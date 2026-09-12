# Hamza Ali — Software & Systems Engineer Portfolio

<p align="center">
  <a href="https://astro.build">
    <img src="https://img.shields.io/badge/Made%20with-Astro-FF5D01?style=flat-square&logo=astro" alt="Astro Badge">
  </a>

  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="TailwindCSS Badge">
  </a>

  <a href="https://greensock.com/gsap/">
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP Badge">
  </a>

  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel Badge">
  </a>
</p>

<p align="center">
  A professional portfolio for production web platforms, ERP workflows,
  e-commerce systems, and product development.
</p>

<p align="center">
  🌐 <strong>Live Site:</strong>
  <a href="https://hamzaalidev.vercel.app">hamzaalidev.vercel.app</a>
</p>

---

## 🚀 About

This portfolio documents current work across the Reve Stitching digital platform,
an ERPNext/Frappe manufacturing implementation, Haus Couture's Shopify rebuild,
and the Aurelia automation platform.

### ✨ What Makes This Portfolio Different

- Full-viewport sections with Lenis smooth scrolling
- GSAP magnetic buttons with radial glow interactions
- Responsive project showcase with verified project media
- Custom cursor with contextual interaction states
- Animated typing effect with rotating developer roles
- Liquid glassmorphism interface with ambient floating gradients
- Mobile-optimized architecture with graceful CSS fallbacks
- Cinematic storytelling-focused section transitions
- Performance-first animations with accessibility support

---

## 🛠️ Tech Stack

### ⚙️ Framework & Build

| Technology                                    | Purpose                                |
| --------------------------------------------- | -------------------------------------- |
| [Astro 5](https://astro.build)                | Static site generation + React islands |
| [Tailwind CSS 3](https://tailwindcss.com/)    | Utility-first styling system           |
| [TypeScript](https://www.typescriptlang.org/) | Type safety & maintainability          |

### 🎬 Animation & Interaction

| Technology                                                                                                                  | Purpose                                      |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [GSAP 3](https://greensock.com/gsap/)                  | Scroll animations, magnetic effects, reveals |
| [ScrollTrigger](https://greensock.com/scrolltrigger/) | Scroll-driven animations                     |
| [Lenis 1](https://lenis.darkroom.engineering/)        | Smooth scrolling engine                      |

### 🚀 Deployment & Tooling

| Technology                    | Purpose                             |
| ----------------------------- | ----------------------------------- |
| [Vercel](https://vercel.com/) | Hosting & automatic deployments     |
| [GitHub](https://github.com/) | Source control & repository hosting |

---

## 📂 Project Structure

```text
portfolio/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── reve-screenshot.png
│       ├── erp-screenshot.png
│       └── brand-screenshot.png
│
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── CommandPalette.astro
│   │   ├── ContactForm.tsx
│   │   ├── ProjectCard.astro
│   │   ├── SkillOrb.astro
│   │   ├── TypeWriter.astro
│   │   ├── MusicPlayer.astro
│   │   ├── Preloader.astro
│   │   ├── Terminal.astro
│   │   ├── ScrollIndicator.astro
│   │   └── DarkModeScript.astro
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── pages/
│   │   └── index.astro
│   │
│   ├── scripts/
│   │   └── animations.js
│   │
│   └── styles/
│       └── global.css
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🎨 Design System

### 🎨 Color Palette

```css
:root {
  --void: #030305;
  --midnight: #0a0a12;

  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);

  --accent-cyan: #00f0ff;
  --accent-purple: #bf00ff;

  --text-primary: #ffffff;
  --text-secondary: #71717a;
}
```

### ✍️ Typography

| Usage     | Font                    |
| --------- | ----------------------- |
| Headings  | Space Grotesk (500–700) |
| Body      | Inter (400–600)         |
| Monospace | JetBrains Mono          |

### ✨ UI Features

- Dark-first premium design system
- Liquid glassmorphism cards with backdrop blur
- Magnetic glow buttons with mouse interaction
- Custom cursor interactions (desktop only)
- Floating ambient orb effects
- Fully responsive adaptive layouts
- `prefers-reduced-motion` accessibility support

---

## 🚦 Getting Started

### 📋 Prerequisites

- Node.js 20+
- npm
- Git

---

## 📥 Installation

### Clone Repository

```bash
git clone https://github.com/hamzaa1i/portfolio.git
cd portfolio
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:4321
```

in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

---

## 📱 Mobile Optimization

### 🖥️ Desktop Experience (>1024px)

- Full animated ambient background
- Full-viewport section layout
- Custom cursor interactions
- Magnetic hover effects
- Project-card hover interactions

### 📱 Mobile Experience (<1024px)

- Motion-aware CSS fallbacks
- Free scrolling with Lenis smoothing
- Touch-optimized interactions
- No magnetic hover effects
- Vertical project card layout

### 📊 Performance Targets

| Metric                 | Target         |
| ---------------------- | -------------- |
| Lighthouse Performance | 90+ Desktop    |
| Mobile Performance     | 80+            |
| First Contentful Paint | <1.5s          |
| Total JavaScript       | <200KB gzipped |

---

## 🎬 Key Interactive Features

### 1️⃣ Ambient Background

- Layered gradients and floating ambient elements
- Black-and-gold visual system
- Mobile and reduced-motion fallbacks

### 2️⃣ Smooth Section Scrolling

- Full-screen immersive sections on desktop
- Lenis-powered smooth scrolling
- GSAP ScrollTrigger reveals
- Natural document flow on mobile

### 3️⃣ Magnetic Glow Buttons

- 80px magnetic interaction radius
- Dynamic radial glow effects
- CSS custom property cursor tracking
- Touch-friendly mobile fallback

### 4️⃣ Typing Effect

- 5 rotating developer roles
- Animated cyan blinking caret
- GSAP-powered typing animation
- Configurable typing/deleting speeds

### 5️⃣ Project Showcase

- Responsive project-card layout
- Verified project media and case-study links
- Desktop hover interactions
- Mobile vertical layout

### 6️⃣ Custom Cursor

- 8px cursor dot
- 40px animated follower ring
- Dynamic "View" and "Click" states
- Automatically disabled on touch devices

---

## 🔧 Customization Guide

### 📬 Update Contact Information

Edit:

```text
src/pages/index.astro
```

#### Email

```astro
<a href="mailto:YOUR_EMAIL@proton.me">
```

#### GitHub

```astro
<a href="https://github.com/YOUR_USERNAME">
```

Also update:

```text
src/layouts/Layout.astro
src/components/Header.astro
src/components/Footer.astro
```

---

## 🖼️ Add Project Screenshots

Add screenshots to:

```text
public/images/
```

Example:

```text
reve-screenshot.png
erp-screenshot.png
brand-screenshot.png
```

Recommended resolution:

```text
1200x800px
```

Update project cards in:

```text
src/pages/index.astro
```

Example:

```astro
<img
  src="/images/reve-screenshot.png"
  alt="Reve Stitching Website Screenshot"
  loading="lazy"
/>
```

---

## 🎨 Change Color Scheme

Edit:

```text
src/styles/global.css
```

```css
:root {
  --accent-cyan: #YOUR_COLOR;
  --accent-purple: #YOUR_COLOR;
}
```

Also update:

```text
tailwind.config.mjs
```

```js
colors: {
  'accent-cyan': '#YOUR_COLOR',
  'accent-purple': '#YOUR_COLOR',
}
```

---

## 🧩 Modify Projects

Edit:

```text
src/pages/index.astro
```

Example:

```js
const projects = [
  {
    title: "Your Project Title",
    description: "Brief description...",
    type: "Project Type",
    role: "Your Role",
    stack: ["Tech", "Stack", "Array"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/you/repo",
    placeholderClass: "project-placeholder-1",
  },
];
```

---

## 🌐 Deployment

## ▲ Deploy to Vercel (Recommended)

### Push to GitHub

```bash
git add .
git commit -m "Initial portfolio build"
git push origin main
```

### Import to Vercel

1. Visit: https://vercel.com/new
2. Import `hamzaa1i/portfolio`
3. Framework auto-detects Astro
4. Click **Deploy**

### 🌍 Custom Domain

```text
Project Settings → Domains
```

Add:

```text
hamzaalidev.vercel.app
```

or your own custom domain.

### 🔄 Auto Deployments

Every push to the `main` branch automatically triggers deployment.

---

## 🌐 Deploy to Netlify (Alternative)

| Setting           | Value           |
| ----------------- | --------------- |
| Build Command     | `npm run build` |
| Publish Directory | `dist`          |
| Node Version      | `20+`           |

---

## 📊 Performance Optimizations

- Lazy-loaded images
- `display=swap` font loading strategy
- Astro island architecture
- Tree-shaken GSAP imports
- Critical CSS inlined in `<head>`
- Reduced motion accessibility support
- Optimized bundle splitting

---

## ♿ Accessibility

- Keyboard-accessible interactions
- Skip-to-content navigation
- ARIA labels on icon-only controls
- Semantic HTML structure
- `prefers-reduced-motion` compatibility
- WCAG AA contrast compliance
- Visible focus indicators

---

## 📄 License

MIT License — free to fork, modify, and customize.

Attribution appreciated but not required.

---

## 📬 Contact

<p align="center">
  <strong>Hamza Ali</strong><br>
  Software &amp; Systems Engineer
</p>

<p align="center">
  📧 Email:
  <a href="mailto:hamzaali.dev@proton.me">hamzaali.dev@proton.me</a>
</p>

<p align="center">
  🐙 GitHub:
  <a href="https://github.com/hamzaa1i">@hamzaa1i</a>
</p>

<p align="center">
  🔗 LinkedIn:
  <a href="https://linkedin.com/in/hamzaalidev">
    linkedin.com/in/hamzaalidev
  </a>
</p>

<p align="center">
  🌐 Portfolio:
  <a href="https://hamzaalidev.vercel.app">
    hamzaalidev.vercel.app
  </a>
</p>

---

## 🙏 Acknowledgments

### ⚙️ Technologies

- [Astro](https://astro.build) — Framework
- [GSAP](https://greensock.com/gsap/) — Animation engine
- [Tailwind CSS](https://tailwindcss.com/) — Styling system
- [Lenis](https://lenis.darkroom.engineering/) — Smooth scrolling

### 🎨 Inspiration

- Awwwards-winning agency portfolios
- Cinematic web experiences
- Storytelling-focused interaction design
- Immersive developer showcases

---

## 🐛 Known Issues

- Safari <15 may show backdrop-filter rendering inconsistencies

### 🐞 Report Bugs

- GitHub Issues:
  https://github.com/hamzaa1i/portfolio/issues

---

## 🔮 Future Enhancements

- [ ] Dedicated case study pages
- [ ] Blog section
- [ ] Expanded image lightbox gallery
- [ ] Contact form with email API integration
- [ ] Analytics integration
- [ ] Search functionality
- [ ] Urdu + English localization

---

<p align="center">
  Built with ❤️ in Faisalabad, Pakistan
</p>

<p align="center">
  <em>"I don't just write code — I architect solutions."</em>
</p>

<p align="center">
  <sub>Last Updated: May 2026</sub>
</p>
