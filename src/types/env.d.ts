declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_SITE_URL?: string;
    readonly PUBLIC_BUSINESS_NAME?: string;
    readonly PUBLIC_BUSINESS_PHONE?: string;
    readonly PUBLIC_BUSINESS_EMAIL?: string;
    readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
    readonly TURNSTILE_SECRET_KEY?: string;
    readonly RESEND_API_KEY?: string;
    readonly RESEND_FROM_EMAIL?: string;
    readonly RESEND_NOTIFICATION_EMAIL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Env {
    CHAMOS_TIRES_KV: KVNamespace;
    TURNSTILE_SECRET_KEY?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    RESEND_NOTIFICATION_EMAIL?: string;
    PUBLIC_SITE_URL?: string;
    PUBLIC_BUSINESS_NAME?: string;
    PUBLIC_BUSINESS_PHONE?: string;
    PUBLIC_BUSINESS_EMAIL?: string;
    PUBLIC_TURNSTILE_SITE_KEY?: string;
  }
}

export {};
