# 🌌 Hamza Ali — Digital Solutions Architect Portfolio

<p align="center">
  <a href="https://astro.build">
    <img src="https://img.shields.io/badge/Made%20with-Astro-FF5D01?style=flat-square&logo=astro" alt="Astro Badge">
  </a>

  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="TailwindCSS Badge">
  </a>

  <a href="https://threejs.org/">
    <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js Badge">
  </a>

  <a href="https://greensock.com/gsap/">
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP Badge">
  </a>

  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel Badge">
  </a>
</p>

<p align="center">
  An immersive, story-driven developer portfolio featuring WebGL interactive backgrounds,
  scroll-driven GSAP animations, cinematic transitions, and premium UI interactions.
</p>

<p align="center">
  🌐 <strong>Live Site:</strong>
  <a href="https://hamzaalidev.vercel.app">hamzaalidev.vercel.app</a>
</p>

---

## 🚀 About

At 17, I built production systems for an international garment export business with zero prior coding experience.

This portfolio documents that transformation — from digitizing a **300K+ monthly garment manufacturing operation** to designing premium digital systems and brand experiences for international exporters.

### ✨ What Makes This Portfolio Different

- Interactive Three.js particle system that reacts to cursor movement
- Full-viewport section snapping powered by Lenis smooth scrolling
- GSAP magnetic buttons with radial glow interactions
- Horizontal scrolling project showcase on desktop
- Custom cursor with contextual interaction states
- Animated typing effect with rotating developer roles
- Liquid glassmorphism interface with ambient floating gradients
- Mobile-optimized architecture with graceful WebGL fallback
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
| [GSAP 3.12](https://greensock.com/gsap/)                                                                                    | Scroll animations, magnetic effects, reveals |
| [ScrollTrigger](https://greensock.com/scrolltrigger/)                                                                       | Scroll-driven timelines & section pinning    |
| [Lenis 1.2](https://lenis.darkroom.engineering/)                                                                            | Smooth scrolling engine                      |
| [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) | WebGL particle rendering                     |

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
│   │   ├── InteractiveBackground.tsx
│   │   ├── MagneticButton.astro
│   │   ├── ProjectCard.astro
│   │   ├── SkillOrb.astro
│   │   ├── TypeWriter.astro
│   │   ├── CustomCursor.astro
│   │   ├── ScrollProgress.astro
│   │   ├── Lightbox.astro
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

- Node.js 18+
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

- Full WebGL particle background
- Section snapping enabled
- Custom cursor interactions
- Magnetic hover effects
- Horizontal project scrolling

### 📱 Mobile Experience (<1024px)

- Static CSS gradient fallback
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

### 1️⃣ WebGL Particle Background

- Mouse-reactive fluid particles
- Cyan/purple gradient rendering
- Adaptive particle count based on hardware tier
- Mobile CSS fallback system

### 2️⃣ Section Snapping

- Full-screen immersive sections
- Lenis-powered smooth scrolling
- GSAP ScrollTrigger snapping
- Disabled on mobile for natural scroll

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

### 5️⃣ Horizontal Project Scroll

- Scroll-scrubbed horizontal track
- Pinned section heading
- Desktop cinematic interaction
- Mobile vertical conversion fallback

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

#### WhatsApp

```astro
<a href="https://wa.me/YOUR_PHONE_NUMBER">
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
| Node Version      | `18+`           |

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
  Digital Solutions Architect
</p>

<p align="center">
  📧 Email:
  <a href="mailto:hamzaali.dev@proton.me">hamzaali.dev@proton.me</a>
</p>

<p align="center">
  💬 WhatsApp:
  <a href="https://wa.me/923329555786">+92 332 9555786</a>
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
- [Three.js](https://threejs.org/) — WebGL rendering
- [Tailwind CSS](https://tailwindcss.com/) — Styling system
- [Lenis](https://lenis.darkroom.engineering/) — Smooth scrolling

### 🎨 Inspiration

- Awwwards-winning agency portfolios
- Cinematic web experiences
- Storytelling-focused interaction design
- Immersive developer showcases

---

## 🐛 Known Issues

- WebGL particle performance on low-end devices
- Safari <15 may show backdrop-filter rendering inconsistencies
- Horizontal scroll requires GSAP ScrollTrigger horizontal support

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
