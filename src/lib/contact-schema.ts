import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80).regex(/^[^\r\n\u0000]+$/),
  email: z.string().trim().max(160).pipe(z.email('Please enter a valid email address.')),
  inquiry: z.enum(['freelance', 'website', 'erp', 'ecommerce', 'other']),
  budget: z.enum(['', 'lt1k', '1k-3k', '3k-8k', '8k+']).default(''),
  message: z.string().trim().min(20, 'Please include a little more project detail.').max(4000),
  companyWebsite: z.string().max(200).default(''),
  turnstileToken: z.string().max(2048).optional(),
  submissionId: z.uuid(),
});

export type ContactInput = z.infer<typeof contactSchema>;
