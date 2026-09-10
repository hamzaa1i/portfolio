# Portfolio V2

Personal portfolio of Hamza Ali, Software & Systems Engineer. Evidence-first: four flagship case studies built on live systems, verified architecture and real screenshots rather than projections.

**Live:** <https://hamzaalidev.vercel.app>

## Stack

- [Astro 6](https://astro.build) with TypeScript (strict)
- [Tailwind CSS 4](https://tailwindcss.com) via the Vite plugin, CSS-first theme
- Astro Content Collections (MDX) as the single content source
- First-party contact endpoint: Zod validation, honeypot, Cloudflare Turnstile, Resend delivery
- Self-hosted Inter, JetBrains Mono and Instrument Serif variable fonts
- Deployed on Vercel (static pages + one on-demand contact function)

No React. No animation libraries. No analytics. Dark only.

## Local setup

```sh
npm install
npm run dev        # develop at localhost:4321
```

Copy `.env.example` to `.env` to configure the contact endpoint. The site builds and runs fully without any secrets; email delivery returns a controlled 503 until `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set.

## Key commands

```sh
npm run build      # production build
npm run check      # astro type checking
npm ci             # clean install from the lockfile
```

## Structure

```
src/
├── content.config.ts      # collection schemas (projects, notes)
├── content/
│   ├── projects/          # four flagship case studies (MDX)
│   └── notes/             # editorial notes (MDX)
├── components/            # header, footer, cards, figure plates, diagrams, form
├── layouts/Layout.astro   # SEO, JSON-LD, OG images, skip link
├── lib/                   # site identity, content helpers, contact schema/config
├── pages/                 # routes; pages/api/contact.ts is the only server route
├── scripts/reveal.ts      # progressive-enhancement section reveals
├── styles/global.css      # Tailwind 4 theme tokens and prose styles
└── fonts/                 # self-hosted variable fonts
public/og/                 # generated 1200x630 OG images
```

Project data lives only in the collections. No project facts are hardcoded in pages; cards, indexes, case-study routes and SEO all render from `src/content/projects`.

## Media policy

Every project image is genuine: live-site screenshots (captured September 2026), real repository product assets, or clearly-labelled architecture diagrams. Private information is excluded; buyer-name strips on manufacturer-site captures are cropped. The Reve ERP case study uses a workflow diagram because the real system is internal — no fake admin UI.

## Philosophy

Real work presented with editorial precision. Systems that survive real workflows over prototypes that look impressive. Fail-safe ordering, typed boundaries, drafts over verdicts for AI, and maintenance treated as part of the job.

## License

MIT — see [LICENSE](LICENSE).

## Contact

Hamza Ali — [hamzaali.dev@proton.me](mailto:hamzaali.dev@proton.me) · [GitHub](https://github.com/hamzaa1i)
