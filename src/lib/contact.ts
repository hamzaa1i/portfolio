/**
 * Contact delivery configuration — server-side only.
 * Never import from client-side code.
 */

export function getContactConfig() {
  return {
    resendApiKey: import.meta.env.RESEND_API_KEY as string | undefined,
    toEmail: (import.meta.env.CONTACT_TO_EMAIL as string | undefined) ?? 'hamzaali.dev@proton.me',
    fromEmail: import.meta.env.RESEND_FROM_EMAIL as string | undefined,
    turnstileSecret: import.meta.env.TURNSTILE_SECRET_KEY as string | undefined,
    turnstileSiteKey: (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? '',
    siteUrl: (import.meta.env.SITE_URL as string | undefined) ?? 'https://hamzaalidev.vercel.app',
  };
}

/** Escape user-controlled text for safe inclusion in email HTML. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
