declare interface Env {
  __STATIC_CONTENT: KVNamespace;
  CONFIG: KVNamespace;
  API_KEY: string;
  TELEGRAM_TOKEN: string;
  CLOUDFLARE_ZONEID: string;
  CLOUDFLARE_TOKEN: string;
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const manifest: string;
  export default manifest;
}

declare type ConfigApiKey = string[];

declare type ConfigChatId = {
  server: number;
  wordpress: number;
  user: number;
  content: number;
};

declare type ConfigWebmasterId = number[];

declare type ConfigRouteId = string;
