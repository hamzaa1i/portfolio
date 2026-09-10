import { z } from 'astro/zod';

/**
 * Contact validation schema — safe for client and server bundles.
 * Contains no environment access.
 */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(100, 'Name is too long.'),
  email: z.pipe(
    z.string().trim().toLowerCase().max(254),
    z.email('Please enter a valid email address.'),
  ),
  subject: z
    .string()
    .trim()
    .min(3, 'Please add a short subject.')
    .max(150, 'Subject is too long.'),
  message: z
    .string()
    .trim()
    .min(20, 'Please write a little more detail (at least 20 characters).')
    .max(5000, 'Message is too long (5000 characters maximum).'),
  /**
   * Honeypot — accepts any value so parsing succeeds; the server then
   * silently drops bot submissions without an error response.
   */
  company_website: z.string().optional().default(''),
  /** Turnstile token, verified server-side when configured. */
  'cf-turnstile-response': z.string().optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
