/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
declare interface Env {
  __STATIC_CONTENT: KVNamespace;
  CONFIG: KVNamespace;
  API_KEY: string;
  TELEGRAM_TOKEN: string;
  CLOUDFLARE_TOKEN: string;
  CLOUDFLARE_ZONEID: string;
  CLOUDFLARE_ACCOUNTMAIL: string;
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const manifest: string;
  export default manifest;
}