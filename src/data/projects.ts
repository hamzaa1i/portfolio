import type { ImageMetadata } from 'astro';

import aureliaLanding from '../assets/projects/aurelia/landing.png';
import hausHome from '../assets/projects/haus-couture/home-desktop.png';
import reveHome from '../assets/projects/reve-platform/home-desktop.png';

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  type: string;
  role: string;
  timeline: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl: string;
  image?: ImageMetadata;
  imageAlt?: string;
  placeholderClass?: string;
  secondary?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'reve-stitching',
    title: 'Reve Stitching Digital Platform',
    shortTitle: 'Reve Digital Platform',
    description:
      'A garment manufacturer’s public site grown into an operations layer for quote and sample intake, admin workflows, client access, email and ERPNext integration.',
    type: 'Digital Platform',
    role: 'Lead Developer & Digital Systems',
    timeline: '2024–Present',
    stack: ['Astro', 'TypeScript', 'Supabase', 'Turso / Drizzle', 'ERPNext'],
    liveUrl: 'https://www.revestitching.com',
    githubUrl: 'https://github.com/hamzaa1i/reve-stitching',
    caseStudyUrl: '/work/reve-stitching',
    image: reveHome,
    imageAlt: 'Reve Stitching digital platform homepage',
  },
  {
    slug: 'erp-system',
    title: 'Reve Manufacturing ERP',
    shortTitle: 'Reve Manufacturing ERP',
    description:
      'ERPNext implemented around real garment-factory workflows: material movement, batch and LOT traceability, gate passes, order tracking and live stock reporting.',
    type: 'ERP & Operations',
    role: 'IT & Digital Systems Lead',
    timeline: 'Ongoing',
    stack: ['ERPNext', 'Frappe', 'Python', 'JavaScript'],
    caseStudyUrl: '/work/erp-system',
    placeholderClass: 'project-placeholder-2',
  },
  {
    slug: 'haus-couture',
    title: 'Haus Couture',
    shortTitle: 'Haus Couture',
    description:
      'A UK streetwear storefront built first as a custom Astro experience, then rebuilt on Shopify when the commercial requirements demanded mature commerce infrastructure.',
    type: 'E-commerce',
    role: 'Design, Build & Launch',
    timeline: '2026',
    stack: ['Shopify', 'Astro', 'Tailwind CSS', 'Vercel'],
    liveUrl: 'https://hauscouture.co.uk',
    caseStudyUrl: '/work/haus-couture',
    image: hausHome,
    imageAlt: 'Haus Couture production Shopify storefront homepage',
  },
  {
    slug: 'aurelia',
    title: 'Aurelia',
    shortTitle: 'Aurelia',
    description:
      'A Discord community management platform spanning a modular bot, web dashboard, moderation, onboarding, engagement, privacy controls and multi-provider AI routing.',
    type: 'Product & Automation',
    role: 'Creator & Developer',
    timeline: '2024–Present',
    stack: ['Python', 'discord.py', 'Next.js', 'PostgreSQL', 'AI Routing'],
    liveUrl: 'https://veloura-aurelia.vercel.app',
    githubUrl: 'https://github.com/hamzaa1i/miles-discord-bot',
    caseStudyUrl: '/work/aurelia',
    image: aureliaLanding,
    imageAlt: 'Aurelia community management platform landing page',
  },
  {
    slug: 'brand-identity',
    title: 'Reve Brand Identity',
    shortTitle: 'Reve Brand Identity',
    description:
      'A complete identity system for a garment exporter, including the logo system, typography, print collateral, company profile and production-ready brand assets.',
    type: 'Brand Identity',
    role: 'Brand Designer',
    timeline: '2025',
    stack: ['Figma', 'Brand Strategy', 'Visual Identity'],
    caseStudyUrl: '/work/brand-identity',
    placeholderClass: 'project-placeholder-3',
    secondary: true,
  },
];

export const flagshipProjects = projects.filter((project) => !project.secondary);
