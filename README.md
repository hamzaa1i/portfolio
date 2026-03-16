# Hamza Ali — Digital Solutions Architect Portfolio

An immersive, story-driven developer portfolio featuring WebGL interactive backgrounds, scroll-driven GSAP animations, and premium UI interactions.

**Live Site:** [hamzaali.vercel.app](https://hamzaali.vercel.app)

---

## 🚀 About

At 17, I built production systems for an international garment export business with zero prior coding experience. This portfolio showcases that journey — from digitizing a 300K+ monthly garment operation to creating brand identities for UK/EU exporters.

**What makes this portfolio different:**
- Interactive Three.js particle system that responds to mouse movement
- Full-viewport section snapping with Lenis smooth scroll
- GSAP-powered magnetic buttons with radial glow effects
- Horizontal scrolling project showcase (desktop)
- Custom cursor with state changes
- Typing effect with 5 rotating roles
- Liquid glassmorphism UI with floating ambient orbs
- Mobile-optimized with graceful WebGL fallback

---

## 🛠️ Tech Stack

### Framework & Build
- **Astro 5** — Static site generation, React islands
- **Tailwind CSS 3** — Utility-first styling, dark mode
- **TypeScript** — Type safety

### Animation & Interaction
- **GSAP 3.12** — Scroll animations, magnetic effects, text reveals
- **ScrollTrigger** — Scroll-driven animations, section pinning
- **Lenis 1.2** — Smooth scroll with wheel normalization
- **Three.js + R3F** — WebGL particle background

### Deployment
- **Vercel** — Automatic deployments from GitHub
- **GitHub** — Version control, source hosting

---

## 📂 Project Structure
portfolio/
├── public/
│ ├── favicon.svg
│ └── images/ # Project screenshots (add your own)
│
├── src/
│ ├── components/
│ │ ├── Header.astro # Scrollspy navigation
│ │ ├── Footer.astro # Minimal footer with social links
│ │ ├── InteractiveBackground.tsx # Three.js particle system
│ │ ├── MagneticButton.astro # GSAP magnetic + glow button
│ │ ├── ProjectCard.astro # Glass project cards
│ │ ├── SkillOrb.astro # Floating skill badges
│ │ ├── TypeWriter.astro # Typing effect component
│ │ ├── CustomCursor.astro # Dot + follower cursor
│ │ ├── ScrollProgress.astro # Thin progress bar
│ │ ├── Lightbox.astro # Click-to-expand images
│ │ ├── ScrollIndicator.astro # Animated scroll chevron
│ │ └── DarkModeScript.astro # Flash prevention
│ │
│ ├── layouts/
│ │ └── Layout.astro # Base layout, meta tags, fonts
│ │
│ ├── pages/
│ │ └── index.astro # Single-page portfolio
│ │
│ ├── scripts/
│ │ └── animations.js # GSAP + Lenis engine
│ │
│ └── styles/
│ └── global.css # Tailwind + glass utilities + custom props
│
├── astro.config.mjs # Astro configuration
├── tailwind.config.mjs # Tailwind configuration
├── tsconfig.json # TypeScript configuration
└── package.json # Dependencies

---

## 🎨 Design System

### Color Palette
```css
--void:          #030305    /* Deepest background */
--midnight:      #0a0a12    /* Section backgrounds */
--glass-bg:      rgba(255, 255, 255, 0.03)
--glass-border:  rgba(255, 255, 255, 0.08)
--accent-cyan:   #00f0ff
--accent-purple: #bf00ff
--text-primary:  #ffffff
--text-secondary: #71717a

### Typography
Headings: Space Grotesk (500, 600, 700)
Body: Inter (400, 500, 600)
Monospace: JetBrains Mono (400)
Key Features
Dark-first design (no light mode toggle needed)
Liquid glassmorphism cards with backdrop blur
Magnetic buttons with mouse-reactive glow
Custom cursor (desktop only)
Full accessibility (prefers-reduced-motion support)

🚦 Getting Started
Prerequisites
Node.js 18+ and npm

Git
Installation
Clone the repository:

git clone https://github.com/hamzaa1i/portfolio.git
cd portfolio
Install dependencies:

npm install
Run development server:

npm run dev
Open http://localhost:4321 in your browser.

Build for Production

npm run build
npm run preview  # Preview production build locally
📱 Mobile Optimization
Desktop (>1024px):

Full WebGL particle background
Section snapping enabled
Custom cursor active
Magnetic button effects
Horizontal project scroll
Mobile (<1024px):

Static CSS gradient background (no WebGL for performance)
Free scroll with Lenis smooth scroll
No custom cursor
No magnetic effects (touch-friendly)
Vertical project card stack
Performance Targets:

Lighthouse Performance: 90+ (desktop), 80+ (mobile)
First Contentful Paint: <1.5s
Total JS: <200KB gzipped

🎬 Key Interactive Features
1. WebGL Particle Background
Mouse-reactive fluid particles (cyan/purple)
Performance tier detection (reduces particles on weak hardware)
Mobile fallback: CSS gradient + animated orbs
2. Section Snapping
Full-viewport sections with Lenis smooth scroll
GSAP ScrollTrigger snap configuration
Disabled on mobile for free scroll
3. Magnetic Glow Buttons
GSAP magnetic pull within 80px radius (desktop only)
CSS --mouse-x/--mouse-y variables for radial glow
Touch-friendly on mobile (no magnetic effect)
4. Typing Effect
5 rotating roles with blinking cyan caret
GSAP-powered (80ms type speed, 40ms delete speed)
2-second pause between roles
5. Horizontal Project Scroll
Pinned heading, horizontal track scrolls with vertical wheel
GSAP ScrollTrigger horizontal scrub
Mobile: converts to vertical card stack
6. Custom Cursor
Dot (8px) + follower ring (40px)
State changes: "View" on projects, "Click" on buttons
Desktop only (hidden on touch devices)

🔧 Customization Guide
Update Contact Info
Email & Social Links:
Edit src/pages/index.astro:

<!-- Line 614: Email -->
<a href="mailto:YOUR_EMAIL@proton.me">

<!-- Line 633: GitHub -->
<a href="https://github.com/YOUR_USERNAME">

<!-- Line 587: WhatsApp -->
<a href="https://wa.me/YOUR_PHONE_NUMBER">

Also update:

src/layouts/Layout.astro (Schema.org markup)
src/components/Header.astro (mobile menu links)
src/components/Footer.astro (footer social icons)
Add Project Screenshots
Add images to public/images/:

reve-screenshot.png (1200x800px recommended)
erp-screenshot.png
brand-screenshot.png
Update src/pages/index.astro:

<!-- Line 340: Project cards -->
<img
  src="/images/reve-screenshot.png"
  alt="Reve Stitching Website Screenshot"
  loading="lazy"
/>
Change Color Scheme
Edit src/styles/global.css:

:root {
  --accent-cyan: #YOUR_COLOR;
  --accent-purple: #YOUR_COLOR;
}
And tailwind.config.mjs:

colors: {
  'accent-cyan': '#YOUR_COLOR',
  'accent-purple': '#YOUR_COLOR',
}
Modify Projects
Edit src/pages/index.astro (line ~57):

const projects = [
  {
    title: 'Your Project Title',
    description: 'Brief description...',
    type: 'Project Type',
    role: 'Your Role',
    stack: ['Tech', 'Stack', 'Array'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/you/repo',
    placeholderClass: 'project-placeholder-1',
  },
  // Add more projects...
];

🌐 Deployment
Deploy to Vercel (Recommended)
Push to GitHub:
Bash

git add .
git commit -m "Initial portfolio build"
git push origin main
Import to Vercel:

Go to vercel.com/new
Import hamzaa1i/portfolio
Framework: Astro (auto-detected)
Click "Deploy"
Custom Domain (Optional):

Project Settings → Domains
Add: hamzaali.vercel.app or your custom domain
Auto-deploys: Every push to main branch triggers a new deployment.

Deploy to Netlify (Alternative)
Build command: npm run build
Publish directory: dist
Environment: Node.js 18+
📊 Performance Optimizations
Image optimization: All images lazy-loaded except hero
Font strategy: display=swap + preconnect to Google Fonts
Code splitting: Astro islands for React components
Tree shaking: Unused GSAP plugins excluded
Critical CSS: Inlined in <head>
Reduced motion: Full support for prefers-reduced-motion
♿ Accessibility
All interactive elements keyboard accessible
Skip-to-content link (hidden, appears on focus)
ARIA labels on icon-only buttons
Semantic HTML structure
prefers-reduced-motion disables all animations
High contrast text (WCAG AA compliant)
Focus indicators on all interactive elements
📄 License
MIT License — Feel free to fork and customize for your own portfolio.

Attribution appreciated but not required.

📬 Contact
Hamza Ali
Digital Solutions Architect

Email: hamzaali.dev@proton.me
WhatsApp: +92 332 9555786
GitHub: @hamzaa1i
LinkedIn: linkedin.com/in/hamzaalidev
Portfolio: hamzaali.vercel.app
🙏 Acknowledgments
Technologies:

Astro — Framework
GSAP — Animation engine
Three.js — WebGL rendering
Tailwind CSS — Styling
Lenis — Smooth scroll
Inspiration:

Awwwards-winning agency portfolios
Modern immersive web experiences
Storytelling-driven design
🐛 Known Issues
WebGL particle performance on low-end mobile devices (fallback works)
Safari <15 may have minor backdrop-filter rendering issues
Horizontal scroll section requires ScrollTrigger horizontal plugin (included)
Report bugs: GitHub Issues

🔮 Future Enhancements
 Case study pages for each project (/projects/reve-stitching, etc.)
 Blog section (optional)
 Project screenshots lightbox gallery
 Contact form with email API (Resend/SendGrid)
 Analytics integration (Vercel Analytics or Plausible)
 Search functionality (if adding blog)
 Internationalization (Urdu + English)

Built with ❤️ in Faisalabad, Pakistan

"I don't just write code — I architect solutions."

Last Updated: March 2026