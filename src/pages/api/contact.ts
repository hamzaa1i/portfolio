/**
 * POST /api/contact — first-party contact endpoint.
 *
 * Protections, honestly stated:
 *  - Zod validation and normalization at the boundary
 *  - Cloudflare Turnstile verified server-side WHEN configured
 *  - Honeypot field, silently dropped
 *  - Same-origin check when Origin/Referer headers are present
 *  - Best-effort only: there is no durable distributed rate limiter in
 *    this architecture. On serverless, in-memory limits are per-instance
 *    and are therefore not claimed as durable protection.
 *
 * Delivery: Resend transactional email. Without RESEND_API_KEY the
 * endpoint returns a controlled 503 and the direct email link on the
 * contact page remains the reliable path.
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import { contactSchema } from '../../lib/contact-schema';
import { escapeHtml, getContactConfig } from '../../lib/contact';

interface TurnstileResult {
  success: boolean;
}

async function verifyTurnstile(secret: string, token: string, ip?: string) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    if (!res.ok) return { success: false };
    return (await res.json()) as TurnstileResult;
  } catch {
    return { success: false };
  }
}

function json(data: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const config = getContactConfig();

  // --- Anti-CSRF origin check (when the browser provides it) ---
  // The Origin header must match the host the request was served from,
  // which is environment-agnostic (localhost in dev, the domain in prod).
  const originHeader = request.headers.get('origin') ?? request.headers.get('referer');
  if (originHeader) {
    try {
      const originHost = new URL(originHeader).hostname;
      const servingHost = new URL(request.url).hostname;
      const canonicalHost = new URL(config.siteUrl).hostname;
      const allowed = originHost === servingHost || originHost === canonicalHost;
      if (!allowed) {
        return json({ ok: false, error: 'invalid-origin' }, 403);
      }
    } catch {
      return json({ ok: false, error: 'invalid-origin' }, 403);
    }
  }

  // --- Parse body ---
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid-body' }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .filter((issue) => issue.path.length > 0)
      .map((issue) => ({
        field: String(issue.path[0]),
        message: issue.message,
      }));
    return json({ ok: false, error: 'validation', issues }, 422);
  }

  const { name, email, subject, message } = parsed.data;

  // --- Honeypot: silent success, no delivery ---
  if (parsed.data.company_website) {
    return json({ ok: true }, 200);
  }

  // --- Turnstile: verified server-side when configured ---
  if (config.turnstileSecret) {
    const token = parsed.data['cf-turnstile-response'];
    if (!token) {
      return json({ ok: false, error: 'captcha-required' }, 400);
    }
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const verdict = await verifyTurnstile(config.turnstileSecret, token, ip);
    if (!verdict.success) {
      return json({ ok: false, error: 'captcha-failed' }, 400);
    }
  }

  // --- Delivery ---
  if (!config.resendApiKey || !config.fromEmail) {
    return json(
      {
        ok: false,
        error: 'not-configured',
        message:
          'Email delivery is not configured on this deployment. Please use the direct email link instead.',
      },
      503,
    );
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(config.resendApiKey);

    const text = [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, '', message].join('\n');

    const html = [
      '<table style="font-family: sans-serif; font-size: 14px; color: #18181b;">',
      `<tr><td style="padding: 4px 12px 4px 0; color: #71717a;">Name</td><td>${escapeHtml(name)}</td></tr>`,
      `<tr><td style="padding: 4px 12px 4px 0; color: #71717a;">Email</td><td>${escapeHtml(email)}</td></tr>`,
      `<tr><td style="padding: 4px 12px 4px 0; color: #71717a;">Subject</td><td>${escapeHtml(subject)}</td></tr>`,
      '</table>',
      '<hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />',
      `<p style="white-space: pre-wrap;">${escapeHtml(message)}</p>`,
    ].join('');

    const result = await resend.emails.send({
      from: config.fromEmail,
      to: config.toEmail,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text,
      html,
    });

    if (result.error) {
      console.error('contact: resend rejected the message (no personal data logged)');
      return json({ ok: false, error: 'delivery-failed' }, 502);
    }

    return json({ ok: true }, 200);
  } catch {
    console.error('contact: delivery threw (no personal data logged)');
    return json({ ok: false, error: 'delivery-failed' }, 502);
  }
};
