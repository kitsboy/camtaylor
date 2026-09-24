---
title: NOSTR as a front door, not a megaphone
date: 2026-08-01
terrain: Identity
camp: Camp I
tags: [NOSTR, Identity, GiveABit]
summary: Why Give A Bit treats NOSTR keys as identity rather than as another channel to post into.
---

Most companies treat NOSTR as a distribution channel: another place to post the same
announcement. We treat it as a front door.

A keypair is an identity you own outright — no platform can revoke it, no acquisition
can rename it, no policy update can quietly lock you out of it. For a donation
platform with our ambitions, that is not a marketing choice. It is the architecture.

What that means in practice:

- The namespace is a registry, so names resolve to keys rather than to accounts we control.
- Reputation travels with the key, so a family of ventures can share trust without sharing a login.
- Contact is a public key, not a lead form you have to trust us with.

The trade-off is real: keys are awkward for normal people, and recovery is a genuine
problem I do not think the ecosystem has solved yet. Naming that out loud is part of
doing this honestly.
