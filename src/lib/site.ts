/**
 * Site identity and configuration — single source of truth.
 *
 * Identity defaults are locked (see implementation master prompt,
 * section 79). Do not change these without a genuine contradiction.
 */

export const SITE = {
  /** Public canonical origin. SITE_URL env var overrides for future domain moves. */
  url: import.meta.env.SITE_URL ?? 'https://hamzaalidev.vercel.app',
  title: 'Hamza Ali',
  titleTemplate: '%s — Hamza Ali',
  description:
    'Software & Systems Engineer in Faisalabad, Pakistan. I design and build web platforms, manufacturing systems, and production storefronts, from internal ERP workflows to client-facing products.',
  author: 'Hamza Ali',
  role: 'Software & Systems Engineer',
  location: 'Faisalabad, Pakistan',
  availability: 'Available for selected projects',
} as const;

export const IDENTITY = {
  name: 'Hamza Ali',
  email: 'hamzaali.dev@proton.me',
  github: 'https://github.com/hamzaa1i',
  /**
   * LinkedIn is rendered only where a verified profile URL exists in the
   * current repository. Unverified means omitted — never invented.
   */
  linkedin: null as string | null,
} as const;

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Notes', href: '/notes' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const;
