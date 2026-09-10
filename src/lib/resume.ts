/**
 * Resume data — single source for the HTML resume.
 * Truthful functional responsibilities only. No phone number,
 * no stale future admissions, no invented credentials.
 */

export const RESUME = {
  summary:
    'Software & Systems Engineer building production platforms for a real manufacturing business: a customer-facing digital platform with quote intake, admin operations and a client portal, and an ERPNext implementation customized to factory workflows. Independent product work includes a Discord community platform with multi-provider AI routing. Self-taught, maintenance-minded, and used to working where the software runs.',

  experience: [
    {
      role: 'IT & Digital Systems Lead',
      org: 'Reve Stitching',
      meta: 'Faisalabad, Pakistan · 2024–Present',
      points: [
        'Build and maintain the company\'s digital platform: public site, structured quote and sample intake, admin operations tooling, client portal and transactional email (Astro, TypeScript, Supabase, Resend).',
        'Integrate the platform with the factory\'s ERPNext instance, including fail-safe Lead creation from website enquiries.',
        'Implement and customize ERPNext for internal operations: stock entry workflows, batch/LOT traceability, gate passes, custom DocTypes, reports and operational dashboards.',
        'Own the system in production: monitoring, dependency updates, and iteration with the teams that use it daily.',
      ],
    },
    {
      role: 'Design & Build (custom storefront); Setup & Launch (production store)',
      org: 'Haus Couture',
      meta: 'UK streetwear label',
      points: [
        'Designed and built the label\'s first custom Astro storefront (information architecture, typography, responsive implementation, deployment).',
        'Carried the brand onto Shopify when commercial requirements outgrew a bespoke build: catalogue and variant architecture, six collections, theme customization, policies, domain integration and launch.',
      ],
    },
    {
      role: 'Creator & Developer',
      org: 'Aurelia',
      meta: 'Independent product · 2024–Present',
      points: [
        'Designed and built a Discord community management platform: Python bot with modular cog architecture (47 cogs, 173 invokable command paths), moderation, onboarding, engagement and privacy systems.',
        'Built the Next.js web dashboard with Discord OAuth and live configuration, plus public documentation, stats and changelog.',
        'Implemented multi-provider AI routing (Gemini, Groq, Mistral, OpenRouter) with router-owned failover.',
      ],
    },
  ],

  capabilities: [
    {
      title: 'Product & Web Platforms',
      items: ['Astro', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel', 'Zod'],
    },
    {
      title: 'ERP & Operations',
      items: ['ERPNext', 'Frappe', 'Python', 'PostgreSQL', 'Workflow design'],
    },
    {
      title: 'AI & Automation',
      items: ['Provider routing', 'Vision analysis', 'Transactional email', 'Integrations'],
    },
    {
      title: 'Ecommerce',
      items: ['Shopify', 'Catalogue architecture', 'Responsive implementation'],
    },
    {
      title: 'Practices',
      items: ['Validation-first APIs', 'Fail-safe design', 'Maintenance & monitoring', 'Documentation'],
    },
  ],

  education: [
    {
      program: 'Intermediate in Computer Science (ICS)',
      meta: '2024–2026',
    },
  ],

  links: [
    { label: 'Email', value: 'hamzaali.dev@proton.me', href: 'mailto:hamzaali.dev@proton.me' },
    { label: 'GitHub', value: 'github.com/hamzaa1i', href: 'https://github.com/hamzaa1i' },
    { label: 'Portfolio', value: 'hamzaalidev.vercel.app', href: 'https://hamzaalidev.vercel.app' },
  ],
} as const;
