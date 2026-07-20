/**
 * Thin Satohash API client for camtaylor.
 * Public proof plane only — no secrets. Identify traffic via X-Satohash-Client.
 *
 * API:  https://api.satohash.io
 * Site: https://satohash.io
 *
 * Usage:
 *   import { stampHash, getApiHealth, sha256Hex, verifyUrl, stampGuideUrl } from '../lib/satohash'
 *   const health = await getApiHealth()
 *   // if (!health.ok) → offline; optional stampGuideUrl fallback
 *   const hash = await sha256Hex(payload)
 *   const proof = await stampHash(hash, { filename: 'portfolio-seal.json' })
 *   if (!proof.ok) window.open(stampGuideUrl(hash), '_blank')
 */

const DEFAULT_API = 'https://api.satohash.io'
const DEFAULT_SITE = 'https://satohash.io'
export const SATOHASH_CLIENT_ID = 'camtaylor'

const HEX64 = /^[a-f0-9]{64}$/i

function stripSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

/** API base (stamp + health). Override with VITE_SATOHASH_API_URL. */
export function getSatohashApiUrl(): string {
  return stripSlash(
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SATOHASH_API_URL) ||
      DEFAULT_API,
  )
}

/** Frontend base (verify + stamp guide). Override with VITE_SATOHASH_URL. */
export function getSatohashUrl(): string {
  return stripSlash(
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SATOHASH_URL) || DEFAULT_SITE,
  )
}

export const SATOHASH_API = DEFAULT_API
export const SATOHASH_SITE = DEFAULT_SITE

export type SatohashHealthResult = {
  ok: boolean
  status?: number
  data?: unknown
  error?: string
}

export type SatohashStampResult = {
  ok: boolean
  id?: string
  status?: string
  hash?: string
  error?: string
  httpStatus?: number
  data?: unknown
}

/** SHA-256 hex digest (Web Crypto). Never uploads the raw payload. */
export async function sha256Hex(input: string | ArrayBuffer | Uint8Array): Promise<string> {
  let bytes: Uint8Array
  if (typeof input === 'string') {
    bytes = new TextEncoder().encode(input)
  } else if (input instanceof Uint8Array) {
    bytes = input
  } else {
    bytes = new Uint8Array(input)
  }
  // Fresh ArrayBuffer-backed view for crypto.subtle typing across TS targets.
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  const digest = await crypto.subtle.digest('SHA-256', copy)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Public verify page for a stamp id or hash. */
export function verifyUrl(hashOrId: string): string {
  return `${getSatohashUrl()}/verify/${encodeURIComponent(hashOrId)}`
}

/** Browser stamp guide with optional prefilled hash (offline / paywall fallback). */
export function stampGuideUrl(hash?: string): string {
  const base = `${getSatohashUrl()}/stamp`
  if (!hash) return base
  return `${base}?hash=${encodeURIComponent(hash)}`
}

function clientHeaders(extra?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Satohash-Client': SATOHASH_CLIENT_ID,
    ...extra,
  }
  // Optional family free-tier key — never commit; set VITE_SATOHASH_KEY in private env only.
  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SATOHASH_KEY) || ''
  if (apiKey) headers['X-Satohash-Key'] = apiKey
  return headers
}

/**
 * GET /health — API liveness. Never throws; ok:false when offline.
 */
export async function getApiHealth(opts?: {
  deep?: boolean
  signal?: AbortSignal
}): Promise<SatohashHealthResult> {
  try {
    const qs = opts?.deep ? '?deep=true' : ''
    const res = await fetch(`${getSatohashApiUrl()}/health${qs}`, {
      method: 'GET',
      headers: clientHeaders(),
      signal: opts?.signal,
      cache: 'no-store',
    })
    let data: unknown
    try {
      data = await res.json()
    } catch {
      data = undefined
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data,
        error: `Satohash health HTTP ${res.status}`,
      }
    }
    return { ok: true, status: res.status, data }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Satohash API unreachable',
    }
  }
}

/**
 * POST /api/stamp — timestamp a 64-char SHA-256 hex via OpenTimestamps.
 * Graceful offline: returns ok:false (does not throw) when API is down.
 */
export async function stampHash(
  hash: string,
  opts?: { filename?: string; apiKey?: string; signal?: AbortSignal },
): Promise<SatohashStampResult> {
  const normalized = String(hash || '')
    .trim()
    .toLowerCase()
    .replace(/^0x/, '')
  if (!HEX64.test(normalized)) {
    return { ok: false, error: 'Hash must be 64 hex characters (SHA-256)', httpStatus: 400 }
  }

  try {
    const headers = clientHeaders({ 'Content-Type': 'application/json' }) as Record<
      string,
      string
    >
    if (opts?.apiKey) headers['X-Satohash-Key'] = opts.apiKey

    const res = await fetch(`${getSatohashApiUrl()}/api/stamp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        hash: normalized,
        filename: opts?.filename || `${SATOHASH_CLIENT_ID}-document`,
      }),
      signal: opts?.signal,
    })

    let body: Record<string, unknown> = {}
    try {
      body = (await res.json()) as Record<string, unknown>
    } catch {
      /* non-JSON */
    }

    if (!res.ok) {
      const msg =
        (typeof body.message === 'string' && body.message) ||
        (typeof body.error === 'string' && body.error) ||
        `Satohash stamp failed (HTTP ${res.status})`
      return { ok: false, error: msg, httpStatus: res.status, data: body }
    }

    return {
      ok: true,
      id: typeof body.id === 'string' ? body.id : undefined,
      status: typeof body.status === 'string' ? body.status : 'pending',
      hash: typeof body.hash === 'string' ? body.hash : normalized,
      httpStatus: res.status,
      data: body,
    }
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Satohash API unreachable — use stampGuideUrl fallback',
    }
  }
}

export default {
  SATOHASH_CLIENT_ID,
  SATOHASH_API,
  SATOHASH_SITE,
  getSatohashApiUrl,
  getSatohashUrl,
  sha256Hex,
  stampHash,
  getApiHealth,
  verifyUrl,
  stampGuideUrl,
}
