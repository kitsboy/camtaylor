/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_FORM_ID?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  /** Keep true until the owner explicitly authorizes public release. */
  readonly VITE_PRIVATE_PREVIEW?: string;
  /** Satohash API base (default https://api.satohash.io) */
  readonly VITE_SATOHASH_API_URL?: string;
  /** Satohash site base (default https://satohash.io) */
  readonly VITE_SATOHASH_URL?: string;
  /** Optional family free-tier key — never commit secrets */
  readonly VITE_SATOHASH_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}