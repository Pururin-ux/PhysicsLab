# 0002 — Web runtime and optional adapters

Status: `CANON`.

## Decision

Next.js is the canonical `apps/web` runtime and npm is the canonical package
manager. Sites/Vinext/OpenAI hosting remains an optional secondary deployment
or preview adapter.

## Consequence

CI, standard development, route behaviour, and product architecture follow
the Next.js path. The adapter may be maintained without becoming an additional
product source of truth.
