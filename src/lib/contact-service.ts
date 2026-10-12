import { createHash } from 'node:crypto';
import { z } from 'zod';
import { contactSchema } from './contact-schema';

export const CONTACT_ACTION = 'portfolio-contact';
export const MAX_BODY_BYTES = 24_576;
const fallback = 'The form is temporarily unavailable. Please email hamzaali.dev@proton.me.';
export type ContactEnv = Record<string, string | undefined>;
export interface ContactDependencies {
  fetch: typeof fetch;
  rateLimit: (request: Request) => Promise<{ rateLimited: boolean; error?: string }>;
}

export function parseRecipients(value: string | undefined): string[] {
  if (!value?.trim()) throw new Error('Missing recipient configuration');
  const addresses = value.split(',').map(address => address.trim().toLowerCase());
  if (addresses.length > 50 || addresses.some(address => !z.email().safeParse(address).success)) {
    throw new Error('Invalid recipient configuration');
  }
  return [...new Set(addresses)];
}

export function parseSender(value: string | undefined): string {
  const sender = value?.trim() || '';
  const address = sender.match(/^Portfolio <([^<>]+)>$/)?.[1] || sender;
  if (/[\r\n]/.test(sender) || !z.email().safeParse(address).success ||
      address.toLowerCase() !== 'contact@hamzaalikhurram.com') throw new Error('Invalid sender configuration');
  return sender;
}

export const json = (body: Record<string, unknown>, status: number, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...headers,
  } });

async function readBody(request: Request): Promise<unknown> {
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function handleContact(
  request: Request, env: ContactEnv, deps: ContactDependencies, development = false,
): Promise<Response> {
  if (request.method !== 'POST') return json({ message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') {
    return json({ message: 'Request origin is not allowed.' }, 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json({ message: 'Please send JSON.' }, 415);
  }
  let payload: unknown;
  try { payload = await readBody(request); }
  catch (error) { return json({ message: error instanceof RangeError ? 'Request is too large.' : 'Invalid request.' }, error instanceof RangeError ? 413 : 400); }
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return json({ message: 'Please check your name, email and message (20–4000 characters).' }, 422);
  if (parsed.data.companyWebsite) return json({ ok: true }, 200);

  // Only an explicit local development opt-out can skip external security services.
  const local = development && !env.VERCEL_ENV && ['localhost', '127.0.0.1'].includes(url.hostname)
    && env.CONTACT_ALLOW_INSECURE_LOCAL === 'true';
  let to: string[], from: string;
  try {
    to = parseRecipients(env.CONTACT_TO_EMAIL);
    from = parseSender(env.CONTACT_FROM_EMAIL);
    if (!env.RESEND_API_KEY?.trim()) throw new Error('Missing delivery configuration');
    if (!local && (!env.TURNSTILE_SECRET_KEY?.trim() || !env.PUBLIC_TURNSTILE_SITE_KEY?.trim())) {
      throw new Error('Missing security configuration');
    }
  } catch { return json({ message: fallback }, 503); }

  if (!local) {
    const allowedHosts = new Set([
      'hamzaalikhurram.com', 'www.hamzaalikhurram.com', 'hamzaalidev.vercel.app',
      env.VERCEL_URL, env.VERCEL_BRANCH_URL,
      ...(env.CONTACT_ALLOWED_HOSTNAMES || '').split(',').map(host => host.trim().toLowerCase()),
    ].filter(Boolean));
    if (!allowedHosts.has(url.hostname)) return json({ message: fallback }, 503);
    try {
      const limit = await deps.rateLimit(request);
      if (limit.error === 'not-found') return json({ message: fallback }, 503);
      if (limit.rateLimited) return json({ message: 'Too many attempts. Please wait a minute or email directly.' }, 429, { 'Retry-After': '60' });
      if (limit.error) return json({ message: fallback }, 503);
    } catch { return json({ message: fallback }, 503); }
    if (!parsed.data.turnstileToken) return json({ message: 'Please complete the security check.' }, 400);
    try {
      const verification = await deps.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', signal: AbortSignal.timeout(5000),
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY!, response: parsed.data.turnstileToken }),
      });
      if (!verification.ok) return json({ message: fallback }, 503);
      const result = await verification.json();
      if (result.success !== true || result.hostname !== url.hostname || result.action !== CONTACT_ACTION) {
        return json({ message: 'Security check failed or expired. Please try again.' }, 400);
      }
    } catch { return json({ message: fallback }, 503); }
  }
  const { name, email, inquiry, budget, message, submissionId } = parsed.data;
  const mail = {
    from, to, reply_to: email,
    subject: `Portfolio inquiry: ${inquiry} — ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, `Inquiry: ${inquiry}`, `Budget: ${budget || 'Not specified'}`, '', message].join('\n'),
  };
  // A stable logical submission + identical mail yields one send across function instances/retries.
  const idempotencyKey = `portfolio-${createHash('sha256').update(JSON.stringify([submissionId, mail])).digest('hex')}`;
  try {
    const response = await deps.fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(mail),
    });
    if (!response.ok || typeof (await response.json()).id !== 'string') throw new Error('Delivery not accepted');
    return json({ ok: true }, 200);
  } catch {
    return json({ message: 'Delivery could not be confirmed. Retry this message or email hamzaali.dev@proton.me.' }, 502);
  }
}
