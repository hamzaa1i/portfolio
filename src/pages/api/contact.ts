import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { contactSchema } from '../../lib/contact-schema';

export const prerender = false;

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

async function verifyTurnstile(token: string, secret: string, ip?: string) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const result = await response.json() as { success?: boolean };
  return Boolean(result.success);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ message: 'Invalid request.' }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ message: parsed.error.issues[0]?.message ?? 'Please check the form.' }, 422);
  }

  // A filled honeypot is treated as success so automated senders receive no signal.
  if (parsed.data.companyWebsite) return json({ ok: true }, 200);

  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!parsed.data.turnstileToken) return json({ message: 'Please complete the security check.' }, 400);
    const valid = await verifyTurnstile(parsed.data.turnstileToken, turnstileSecret, clientAddress);
    if (!valid) return json({ message: 'Security check failed. Please try again.' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return json({
      message: 'The form is temporarily unavailable. Please email hamzaali.dev@proton.me.',
    }, 503);
  }

  const to = import.meta.env.CONTACT_TO_EMAIL || 'hamzaali.dev@proton.me';
  const from = import.meta.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
  const resend = new Resend(apiKey);
  const { name, email, inquiry, budget, message } = parsed.data;

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio inquiry: ${inquiry} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Inquiry: ${inquiry}`,
        `Budget: ${budget || 'Not specified'}`,
        '',
        message,
      ].join('\n'),
    });

    if (result.error) throw result.error;
    return json({ ok: true }, 200);
  } catch {
    return json({
      message: 'The message could not be sent. Please email hamzaali.dev@proton.me.',
    }, 502);
  }
};
