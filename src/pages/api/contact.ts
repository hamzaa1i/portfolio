import type { APIRoute } from 'astro';
import { checkRateLimit } from '@vercel/firewall';
import { handleContact, CONTACT_ACTION } from '../../lib/contact-service';

export const prerender = false;

// Read server credentials at invocation time; never serialize them into a client island.
export const ALL: APIRoute = ({ request }) => handleContact(request, process.env, {
  fetch,
  rateLimit: async (incoming) => {
    // The SDK's development default is permissive; never use it for a send.
    if (process.env.NODE_ENV !== 'production') return { rateLimited: false, error: 'unavailable' };
    // The SDK uses Host for its internal request: pin it to the already-validated URL.
    const headers = new Headers(incoming.headers);
    headers.set('host', new URL(incoming.url).host);
    return checkRateLimit(CONTACT_ACTION, { headers, timeout: 3000 });
  },
}, import.meta.env.DEV);
