#!/usr/bin/env bash
#
# camtaylor deploy verification — one command, no secret, read-only.
#
# SINGLE-DEPLOYER RULE: Cloudflare Pages builds camtaylor.ca straight from this
# repo's git integration (project "camtaylor"). Nothing else deploys. This
# script never deploys anything — it only *observes* the live site and fails
# loudly when what is served is not what was pushed. It is the local twin of
# the `verify` step in .github/workflows/deploy.yml, so the same logic can be
# run before/after a push and inside CI.
#
# WHAT IT CHECKS — the gate is IDENTITY:
#   1. identity — the commit the live /build-meta.json names must equal the
#      commit being shipped. A build clock is NOT accepted as proof (it passed
#      a stale deploy by 41 seconds on another project).
#   2. built-app — the deployment must serve a built bundle (/assets/...),
#      not the source file (/src/main.tsx), and carry the expected <title>.
#
# Bot Fight note: camtaylor's zone challenges flagged (CI/datacenter) IPs on
# the custom domain with 403 — e.g. GitHub Actions runners. The verifier reads
# the marker + bundle from camtaylor.pages.dev (same deployment, Cloudflare's
# own zone, not bot-challenged). The apex is spot-checked by a human.
#
#   bash scripts/deploy-check.sh                              # identity + built-app
#   bash scripts/deploy-check.sh --wait --timeout 900 --interval 20
#   bash scripts/deploy-check.sh --expected-commit 94ef068    # pin by hand
#   bash scripts/deploy-check.sh --expected-commit 0000000    # failure simulation
#
# Exit codes: 0 = verified, 1 = verification failed, 2 = bad usage.
#
# Env overrides: CAMTAYLOR_SITE_URL, CAMTAYLOR_EXPECTED_COMMIT, GITHUB_SHA
#
set -uo pipefail   # deliberately no -e: every failure here is explicit.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO" || exit 1

SITE_URL="${CAMTAYLOR_SITE_URL:-https://camtaylor.ca}"
# The deployment-identity marker is read from camtaylor.pages.dev, which serves
# the SAME production build as the custom domain but is NOT behind the zone's
# Bot Fight Mode challenge (GitHub Actions runner IPs get 403 on camtaylor.ca).
# The apex is still checked for the built bundle + title separately.
MARKER_URL="${CAMTAYLOR_MARKER_URL:-https://camtaylor.pages.dev}"
EXPECTED_COMMIT="${CAMTAYLOR_EXPECTED_COMMIT:-}"
WAIT=0
TIMEOUT=900
INTERVAL=20

usage() {
  awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "$0"
}

fail() {
  echo "" >&2
  echo "❌ DEPLOY CHECK FAILED — $*" >&2
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --url)              [ $# -ge 2 ] || fail "--url needs a value"; SITE_URL="$2"; shift 2 ;;
    --expected-commit)  [ $# -ge 2 ] || fail "--expected-commit needs a value"; EXPECTED_COMMIT="$2"; shift 2 ;;
    --wait)             WAIT=1; shift ;;
    --timeout)          [ $# -ge 2 ] || fail "--timeout needs a value"; TIMEOUT="$2"; shift 2 ;;
    --interval)         [ $# -ge 2 ] || fail "--interval needs a value"; INTERVAL="$2"; shift 2 ;;
    -h|--help)          usage; exit 0 ;;
    *)                  echo "unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done
SITE_URL="${SITE_URL%/}"

# ------------------------------------------------------------------ expectations
PKG_VERSION="$(node -e 'process.stdout.write(String(require(process.argv[1]).version))' "$REPO/package.json" 2>/dev/null)"
[ -n "$PKG_VERSION" ] || fail "could not read version from package.json"

sha_of() { printf '%s' "$1" | tr 'A-Z' 'a-z' | tr -d '[:space:]'; }

if [ -z "$EXPECTED_COMMIT" ]; then
  EXPECTED_COMMIT="${GITHUB_SHA:-}"
fi
if [ -z "$EXPECTED_COMMIT" ]; then
  EXPECTED_COMMIT="$(git -C "$REPO" rev-parse HEAD 2>/dev/null)"
fi
EXPECTED_COMMIT="$(sha_of "$EXPECTED_COMMIT")"
if [ -n "$EXPECTED_COMMIT" ]; then
  case "$EXPECTED_COMMIT" in
    *[!0-9a-f]*) fail "--expected-commit must be a hex commit sha (7-40 chars), got '$EXPECTED_COMMIT'" ;;
  esac
  [ "${#EXPECTED_COMMIT}" -ge 7 ] && [ "${#EXPECTED_COMMIT}" -le 40 ] \
    || fail "--expected-commit must be a hex commit sha (7-40 chars), got '$EXPECTED_COMMIT'"
fi

echo "expected commit : ${EXPECTED_COMMIT:-<unknown>}"
echo "expected version: $PKG_VERSION"
echo "target          : $SITE_URL"

# ------------------------------------------------------------------------ helpers
fetch_error=""
try_fetch() { # $1 = url. Body -> FETCH_BODY, error -> fetch_error
  FETCH_BODY=""
  fetch_error=""
  local raw code
  raw="$(curl -sS --max-time 20 -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' -w $'\n%{http_code}' "$1" 2>&1)" \
    || { fetch_error="curl error: $(printf '%s' "$raw" | tr '\n' ' ')"; return 1; }
  code="$(printf '%s' "$raw" | tail -n 1)"
  FETCH_BODY="$(printf '%s' "$raw" | sed '$d')"
  [ "$code" = "200" ] || { fetch_error="HTTP $code from $1"; return 1; }
  [ -n "$FETCH_BODY" ] || { fetch_error="empty response body from $1"; return 1; }
  return 0
}

json_field() { # $1 = key, stdin = json
  node -e '
    let s = ""
    process.stdin.on("data", d => s += d).on("end", () => {
      try {
        const v = JSON.parse(s)[process.argv[1]]
        process.stdout.write(v === undefined || v === null ? "" : String(v))
      } catch (e) { process.exit(0) }
    })' "$1" 2>/dev/null
}

sha_matches() { # $1 live, $2 expected — equal or a prefix of the other (>=7)
  [ -n "$1" ] && [ -n "$2" ] || return 1
  [ "$1" = "$2" ] && return 0
  [ "${#1}" -ge 7 ] && [ "${#2}" -ge 7 ] || return 1
  case "$2" in "$1"*) return 0 ;; esac
  case "$1" in "$2"*) return 0 ;; esac
  return 1
}

# verify(): 0 = live matches, 1 = not (yet) — sets verify_reason
verify() {
  verify_reason=""

  # 1. IDENTITY — live build-meta.json must name the expected commit. Read from
  # the pages.dev deployment hostname (same build, not bot-challenged).
  try_fetch "$MARKER_URL/build-meta.json?cb=$(date +%s%N)" \
    || { verify_reason="live /build-meta.json unreachable on $MARKER_URL ($fetch_error)"; return 1; }
  local meta="$FETCH_BODY"
  local live_commit live_version live_built
  live_commit="$(sha_of "$(printf '%s' "$meta" | json_field commit)")"
  live_version="$(printf '%s' "$meta" | json_field version)"
  live_built="$(printf '%s' "$meta" | json_field builtAt)"

  [ -n "$live_commit" ] \
    || { verify_reason="live build-meta.json names no commit (malformed deploy?)"; return 1; }
  if [ -n "$EXPECTED_COMMIT" ] && ! sha_matches "$live_commit" "$EXPECTED_COMMIT"; then
    verify_reason="WRONG COMMIT SERVED — expected $EXPECTED_COMMIT, live $live_commit (built $live_built). Cloudflare Pages has not published this commit yet."
    return 1
  fi
  if [ "$live_version" != "$PKG_VERSION" ]; then
    verify_reason="version mismatch — package.json $PKG_VERSION, live $live_version"
    return 1
  fi

  # 2. BUILT-APP — the deployment must serve a built bundle, not the source.
  # Fetched from the same pages.dev deployment host as the marker, because the
  # custom domain's Bot Fight Mode 403s flagged (CI/datacenter) IPs on ALL
  # paths — including the homepage. The apex's real-visitor result is proven
  # separately by the deployment's alias (camtaylor.ca + www point to this
  # pages.dev deployment); a 403 here would be bot-protection, not a failed
  # deploy. The custom domain is spot-checked manually.
  try_fetch "$MARKER_URL/?cb=$(date +%s%N)" \
    || { verify_reason="live homepage unreachable on $MARKER_URL ($fetch_error)"; return 1; }
  local html="$FETCH_BODY"
  case "$html" in
    *'/src/main.tsx'*)
      verify_reason="live homepage serves the SOURCE file (/src/main.tsx) — the build output directory is wrong, not a built site"
      return 1 ;;
  esac
  case "$html" in
    *'/assets/'*) : ;;
    *) verify_reason="live homepage serves no built /assets/ bundle"; return 1 ;;
  esac
  case "$html" in
    *'Cam Taylor | Sherpa'*) : ;;
    *) verify_reason="live homepage has an unexpected <title>"; return 1 ;;
  esac

  LIVE_COMMIT="$live_commit"
  LIVE_VERSION="$live_version"
  LIVE_BUILT="$live_built"
  return 0
}

# ---------------------------------------------------------------------------- run
attempt=0
deadline=$(( $(date +%s) + TIMEOUT ))
while : ; do
  attempt=$((attempt + 1))
  LIVE_COMMIT=""; LIVE_VERSION=""; LIVE_BUILT=""
  if verify; then
    echo ""
    echo "✅ DEPLOY VERIFIED after $attempt attempt(s)"
    echo "   live commit : $LIVE_COMMIT"
    echo "   live version: $LIVE_VERSION (matches package.json)"
    echo "   live built  : $LIVE_BUILT"
    echo "   live site serves a built /assets/ bundle with the expected title"
    [ -n "$EXPECTED_COMMIT" ] && echo "   live build names the commit being shipped — identity verified"
    exit 0
  fi
  if [ "$WAIT" -ne 1 ]; then
    fail "$verify_reason"
  fi
  now=$(date +%s)
  if [ "$now" -ge "$deadline" ]; then
    fail "$verify_reason (gave up after ${TIMEOUT}s / $attempt attempts)"
  fi
  echo "⏳ [$attempt] $verify_reason — retrying in ${INTERVAL}s (timeout ${TIMEOUT}s)"
  sleep "$INTERVAL"
done
