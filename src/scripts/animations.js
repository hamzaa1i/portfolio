/* ============================================================
   HAMZA ALI — PORTFOLIO V3 ANIMATION ENGINE
   Lenis · GSAP ScrollTrigger · Section Snap · Letter Hover
   Card Popup · Skill Orb Tilt · Premium Storytelling
   ============================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   DETECTION
   ============================================================ */
const IS_MOBILE = typeof window !== 'undefined' && (
  window.innerWidth < 1024 || 'ontouchstart' in window
);
const IS_TOUCH = typeof window !== 'undefined' && (
  'ontouchstart' in window || navigator.maxTouchPoints > 0
);
const REDUCED_MOTION = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenisInstance = null;

/* ============================================================
   SHARED MOUSE + UNIFIED ANIMATION LOOP
   Merges 3 rAF loops → 1. Eliminates 2 extra mousemove listeners.
   ============================================================ */
let sharedMouseX = 0, sharedMouseY = 0;
const _loopCallbacks = [];

if (typeof window !== 'undefined' && !IS_TOUCH && !IS_MOBILE) {
  document.addEventListener('mousemove', (e) => {
    sharedMouseX = e.clientX;
    sharedMouseY = e.clientY;
  }, { passive: true });
}

function registerLoop(fn) { _loopCallbacks.push(fn); }

function startUnifiedLoop() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;
  if (!_loopCallbacks.length) return;

  function tick() {
    for (let i = 0; i < _loopCallbacks.length; i++) {
      _loopCallbacks[i]();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   MODULE 1: LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  if (REDUCED_MOTION) return null;

  lenisInstance = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.7,
    touchMultiplier: 1.2,
    normalizeWheel: true,
    infinite: false,
    autoResize: true,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  return lenisInstance;
}

/* ============================================================
   MODULE 2: SCROLLTRIGGER CONFIG
   ============================================================ */
function initScrollTrigger() {
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });

  ScrollTrigger.defaults({
    fastScrollEnd: true,
    preventOverlaps: true,
  });
}

/* ============================================================
   MODULE 4: SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveals() {
  if (REDUCED_MOTION) {
    gsap.utils.toArray('[data-animate]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  /* fade-up */
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });

  /* fade */
  gsap.utils.toArray('[data-animate="fade"]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });

  /* scale */
  gsap.utils.toArray('[data-animate="scale"]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1, scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });

  /* stagger children */
  gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
    const children = container.children;
    if (!children.length) return;

    gsap.fromTo(children,
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

/* ============================================================
   MODULE 5: TEXT LINE SPLIT & REVEAL
   ============================================================ */
function splitTextIntoLines(element) {
  const text = element.textContent.trim();
  if (!text) return [];

  const words = text.split(' ');
  element.innerHTML = '';
  element.style.overflow = 'hidden';

  const tempSpan = document.createElement('span');
  tempSpan.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;';
  tempSpan.style.font = window.getComputedStyle(element).font;
  document.body.appendChild(tempSpan);

  const containerWidth = element.offsetWidth;
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    tempSpan.textContent = testLine;

    if (tempSpan.offsetWidth > containerWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  document.body.removeChild(tempSpan);

  lines.forEach((lineText) => {
    const wrapper = document.createElement('span');
    wrapper.classList.add('line-reveal');
    wrapper.style.display = 'block';
    wrapper.style.overflow = 'hidden';

    const inner = document.createElement('span');
    inner.classList.add('line');
    inner.style.display = 'block';
    inner.textContent = lineText;

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
  });

  return element.querySelectorAll('.line');
}

function initTextLineSplit() {
  if (REDUCED_MOTION) {
    gsap.utils.toArray('[data-split]').forEach((el) => {
      el.style.opacity = '1';
    });
    return;
  }

  gsap.utils.toArray('[data-split]').forEach((el) => {
    const lines = splitTextIntoLines(el);
    if (!lines.length) return;

    gsap.fromTo(lines,
      { y: '110%' },
      {
        y: '0%',
        duration: 0.9,
        stagger: 0.07,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

/* ============================================================
   MODULE 6: COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  gsap.utils.toArray('[data-counter]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const duration = parseFloat(el.getAttribute('data-counter-duration')) || 2.2;

    if (REDUCED_MOTION) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: target,
          duration: duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.value).toLocaleString() + suffix;
          },
        });
      },
    });
  });
}

/* ============================================================
   MODULE 7: LETTER HOVER POP
   Fixed — waits a frame after scramble to ensure DOM is settled
   ============================================================ */
function wrapInHoverLetters(el) {
  const text = el.textContent.trim();
  if (!text) return;

  el.innerHTML = '';
  el.classList.add('hover-letters');

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.classList.add('char');

    if (text[i] === ' ') {
      span.innerHTML = '&nbsp;';
    } else {
      span.textContent = text[i];
    }

    el.appendChild(span);
  }
}

function initLetterHover() {
  if (IS_TOUCH) return;

  const elements = document.querySelectorAll('[data-hover-letters]');

  elements.forEach((el) => {
    if (el.hasAttribute('data-scramble')) {
      el.addEventListener('scramble:complete', () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            wrapInHoverLetters(el);
          });
        });
      }, { once: true });
    } else {
      wrapInHoverLetters(el);
    }
  });
}

/* ============================================================
   MODULE 8: PROJECT CARD POPUP
   Hover: scale up slightly
   Click: expand to center, blur rest of page
   ============================================================ */
function initCardPopup() {
  const cards = document.querySelectorAll('.project-card-interactive');
  const overlay = document.querySelector('.page-blur-overlay');

  if (!cards.length || !overlay) return;

  let expandedCard = null;
  let originalStyles = null;

  function expandCard(card) {
    if (expandedCard) return;

    expandedCard = card;

    /* Store original position for restore */
    const rect = card.getBoundingClientRect();
    originalStyles = {
      position: card.style.position,
      top: card.style.top,
      left: card.style.left,
      width: card.style.width,
      zIndex: card.style.zIndex,
      transform: card.style.transform,
    };

    /* First: set card to its current position (fixed) */
    card.style.position = 'fixed';
    card.style.top = rect.top + 'px';
    card.style.left = rect.left + 'px';
    card.style.width = rect.width + 'px';
    card.style.zIndex = '75';

    /* Show blur overlay */
    overlay.classList.add('active');

    /* Animate to center */
    requestAnimationFrame(() => {
      const targetWidth = Math.min(window.innerWidth * 0.85, 680);

      gsap.to(card, {
        top: '50%',
        left: '50%',
        width: targetWidth,
        xPercent: -50,
        yPercent: -50,
        duration: 0.5,
        ease: 'power3.out',
      });
    });

    /* Stop scroll */
    if (lenisInstance) lenisInstance.stop();
    document.body.style.overflow = 'hidden';
  }

  function collapseCard() {
    if (!expandedCard || !originalStyles) return;

    const card = expandedCard;

    /* Animate back */
    gsap.to(card, {
      top: originalStyles.top || 'auto',
      left: originalStyles.left || 'auto',
      width: originalStyles.width || 'auto',
      xPercent: 0,
      yPercent: 0,
      duration: 0.4,
      ease: 'power3.inOut',
      onComplete: () => {
        /* Reset all inline styles */
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.zIndex = '';
        card.style.transform = '';

        gsap.set(card, { clearProps: 'all' });
      },
    });

    overlay.classList.remove('active');

    /* Resume scroll */
    if (lenisInstance) lenisInstance.start();
    document.body.style.overflow = '';

    expandedCard = null;
    originalStyles = null;
  }

  /* Click card to expand */
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      /* Don't expand if clicking a link/button inside */
      if (e.target.closest('a') || e.target.closest('button')) return;

      if (expandedCard === card) {
        collapseCard();
      } else if (!expandedCard) {
        expandCard(card);
      }
    });
  });

  /* Click overlay to collapse */
  overlay.addEventListener('click', collapseCard);

  /* Escape to collapse */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expandedCard) collapseCard();
  });
}

/* ============================================================
   MODULE 9: SKILL ORB PROXIMITY TILT (Desktop Only)
   Optimized — uses shared mouse, visibility-gated, one loop
   ============================================================ */
function initSkillOrbs() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const orbs = gsap.utils.toArray('.skill-orb');
  if (!orbs.length) return;

  const section = document.querySelector('#skills');
  let visible = false;

  if (section) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { visible = true; },
      onLeave: () => { visible = false; },
      onEnterBack: () => { visible = true; },
      onLeaveBack: () => { visible = false; },
    });
  }

  registerLoop(() => {
    if (!visible) return;

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      const rect = orb.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = sharedMouseX - cx;
      const dy = sharedMouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      if (dist < maxDist) {
        const factor = 1 - dist / maxDist;
        gsap.to(orb, {
          rotateX: (dy / maxDist) * 12 * factor,
          rotateY: -(dx / maxDist) * 12 * factor,
          x: (dx / maxDist) * 6 * factor,
          y: (dy / maxDist) * 6 * factor,
          scale: 1 + 0.04 * factor,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(orb, {
          rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.7)',
          overwrite: 'auto',
        });
      }
    }
  });
}

/* ============================================================
   MODULE 10: SCROLLSPY — Active Nav Link
   ============================================================ */
function initScrollspy() {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('[data-section]');

  if (!navLinks.length || !sections.length) return;

  sections.forEach((section) => {
    const id = section.getAttribute('id');
    if (!id) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setActiveLink(id),
      onEnterBack: () => setActiveLink(id),
    });
  });

  function setActiveLink(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* Nav link click → smooth scroll via Lenis */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      if (lenisInstance) {
        lenisInstance.scrollTo(target, {
          offset: 0,
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      /* Close mobile menu */
      const menu = document.querySelector('[data-mobile-menu]');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
        if (lenisInstance) lenisInstance.start();
      }
    });
  });
}

/* ============================================================
   MODULE 11: HEADER GLASS ON SCROLL
   ============================================================ */
function initHeaderTransition() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  ScrollTrigger.create({
    start: 'top -50',
    end: 'max',
    onUpdate: (self) => {
      if (self.scroll() > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
  });
}

/* ============================================================
   MODULE 12: SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      bar.style.width = `${self.progress * 100}%`;
    },
  });
}

/* ============================================================
   MODULE 13: SCROLL-TO-TOP
   ============================================================ */
function initScrollToTop() {
  const btn = document.querySelector('[data-scroll-top]');
  if (!btn) return;

  ScrollTrigger.create({
    start: 'top -400',
    end: 'max',
    onUpdate: (self) => {
      if (self.scroll() > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    },
  });

  btn.addEventListener('click', () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ============================================================
   MODULE 14: TYPING EFFECT — Bug-Free
   ============================================================ */
function initTypingEffect() {
  const container = document.querySelector('[data-typewriter]');
  if (!container) return;

  const textEl = container.querySelector('[data-typewriter-text]');
  if (!textEl) return;

  let roles;
  try {
    const raw = container.getAttribute('data-roles') || container.getAttribute('data-typewriter') || '[]';
    // Decode HTML entities that Astro may inject into attribute values
    const decoded = raw.replace(/&quot;/g, '"').replace(/&#34;/g, '"').replace(/&amp;/g, '&');
    roles = JSON.parse(decoded);
  } catch {
    roles = [];
  }
  if (!Array.isArray(roles) || !roles.length) return;

  if (REDUCED_MOTION) {
    textEl.textContent = roles[0];
    return;
  }

  const TYPE_SPEED = 65;
  const DELETE_SPEED = 30;
  const PAUSE_TYPED = 2500;
  const PAUSE_DELETED = 400;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function tick() {
    if (isPaused) return;

    const current = roles[roleIndex];

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
      textEl.textContent = current.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        isPaused = true;
        setTimeout(() => { isPaused = false; tick(); }, PAUSE_DELETED);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIndex = Math.min(current.length, charIndex + 1);
      textEl.textContent = current.substring(0, charIndex);

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; tick(); }, PAUSE_TYPED);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  setTimeout(tick, 900);
}

/* ============================================================
   MODULE 15: STORY PARAGRAPH REVEAL
   ============================================================ */
function initStoryReveal() {
  if (REDUCED_MOTION) return;

  gsap.utils.toArray('[data-story-line]').forEach((p, i) => {
    gsap.fromTo(p,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
        delay: i * 0.03,
      }
    );
  });
}

/* ============================================================
   MODULE 16: MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');

    if (isOpen) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();
    } else {
      menu.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();
    }
  });
}

/* ============================================================
   MODULE 17: LIGHTBOX
   ============================================================ */
function initLightbox() {
  const overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) return;

  const img = overlay.querySelector('.lightbox-image');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const triggers = document.querySelectorAll('[data-lightbox]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox');
      const alt = trigger.getAttribute('data-lightbox-alt') || 'Screenshot';
      if (img && src) {
        img.setAttribute('src', src);
        img.setAttribute('alt', alt);
      }
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();
    });
  });

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
}

/* ============================================================
   MODULE 18: SCROLL INDICATOR — fade + click to scroll
   ============================================================ */
function initScrollIndicator() {
  const el = document.querySelector('[data-scroll-indicator]');
  if (!el) return;

  /* Click to scroll to story section */
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => {
    const story = document.querySelector('#story');
    if (story && lenisInstance) {
      lenisInstance.scrollTo(story, {
        offset: 0,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (story) {
      story.scrollIntoView({ behavior: 'smooth' });
    }
  });

  if (REDUCED_MOTION) return;

  ScrollTrigger.create({
    start: 'top -150',
    onUpdate: (self) => {
      el.style.opacity = self.scroll() > 150 ? '0' : '1';
      el.style.transition = 'opacity 0.4s ease';
    },
  });
}

/* ============================================================
   MODULE 19: HERO REVEAL — unified loop, no standalone rAF
   ============================================================ */
function initHeroReveal() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const hero = document.querySelector('#hero');
  if (!hero) return;
  const reveal = hero.querySelector('.hero-reveal-layer');
  if (!reveal) return;

  let mouseInHero = false;
  const rect = hero.getBoundingClientRect();
  let tx = rect.width / 2, ty = rect.height * 0.4;
  let cx = tx, cy = ty;

  hero.style.setProperty('--reveal-x', cx + 'px');
  hero.style.setProperty('--reveal-y', cy + 'px');
  requestAnimationFrame(() => { reveal.classList.add('active'); });

  hero.addEventListener('mouseenter', () => { mouseInHero = true; });
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouseInHero = false;
    const r = hero.getBoundingClientRect();
    tx = r.width / 2;
    ty = r.height * 0.4;
  });

  registerLoop(() => {
    const speed = mouseInHero ? 0.08 : 0.015;
    const dx = tx - cx, dy = ty - cy;
    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
      cx += dx * speed;
      cy += dy * speed;
      hero.style.setProperty('--reveal-x', cx + 'px');
      hero.style.setProperty('--reveal-y', cy + 'px');
    }
  });
}

/* ============================================================
   MODULE 20: TEXT SCRAMBLE EFFECT
   Progressive character reveal — left to right
   ============================================================ */
function initTextScramble() {
  if (REDUCED_MOTION) {
    gsap.utils.toArray('[data-scramble]').forEach((el) => {
      el.style.opacity = '1';
    });
    return;
  }

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>[]{}=+-';

  gsap.utils.toArray('[data-scramble]').forEach((el) => {
    const original = el.textContent.trim();
    if (!original) return;

    const isLoad = el.getAttribute('data-scramble') === 'load';

    // Hide scroll-triggered elements until they play
    if (!isLoad) {
      el.style.opacity = '0';
    }

    let hasPlayed = false;

    function play() {
      if (hasPlayed) return;
      hasPlayed = true;

      el.style.opacity = '1';

      const len = original.length;
      const totalFrames = Math.min(Math.ceil(len * 2.5), 50);
      let frame = 0;

      function step() {
        frame++;
        const resolved = Math.floor((frame / totalFrames) * len);

        let text = '';
        for (let i = 0; i < len; i++) {
          if (original[i] === ' ') {
            text += ' ';
          } else if (i < resolved) {
            text += original[i];
          } else {
            text += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        el.textContent = text;

        if (frame < totalFrames) {
          requestAnimationFrame(step);
        } else {
          el.textContent = original;
          el.dispatchEvent(new CustomEvent('scramble:complete'));
        }
      }

      requestAnimationFrame(step);
    }

    if (isLoad) {
      setTimeout(play, 400);
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: play,
      });
    }
  });
}

/* ============================================================
   MODULE 21: MAGNETIC BUTTONS
   Optimized — shared mouse, skips offscreen buttons
   ============================================================ */
function initMagneticButtons() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const buttons = document.querySelectorAll('[data-magnetic]');
  if (!buttons.length) return;

  const winH = window.innerHeight;

  registerLoop(() => {
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const rect = btn.getBoundingClientRect();

      if (rect.bottom < -50 || rect.top > winH + 50) {
        if (btn._magneticActive) {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
          btn._magneticActive = false;
        }
        continue;
      }

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = sharedMouseX - cx;
      const dy = sharedMouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = parseFloat(btn.getAttribute('data-magnetic-radius') || '80');
      const strength = parseFloat(btn.getAttribute('data-magnetic-strength') || '0.3');

      if (dist < radius) {
        const factor = strength * (1 - dist / radius);
        gsap.to(btn, {
          x: dx * factor, y: dy * factor,
          duration: 0.25, ease: 'power2.out', overwrite: 'auto',
        });
        btn._magneticActive = true;
      } else if (btn._magneticActive) {
        gsap.to(btn, {
          x: 0, y: 0,
          duration: 0.7, ease: 'elastic.out(1, 0.3)', overwrite: 'auto',
        });
        btn._magneticActive = false;
      }
    }
  });
}

/* ============================================================
   MODULE 22: LASER GLOW — cursor-following highlight
   ============================================================ */
function initLaserGlow() {
  if (IS_TOUCH || IS_MOBILE) return;

  document.querySelectorAll('.laser-glow').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--laser-x', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--laser-y', (e.clientY - rect.top) + 'px');
    }, { passive: true });
  });
}

/* ============================================================
   MASTER INIT
   ============================================================ */
export function initAnimations() {
  if (typeof window === 'undefined') return;

  console.log(
    `%c[Portfolio V3]%c Mobile: ${IS_MOBILE} | Touch: ${IS_TOUCH} | Reduced Motion: ${REDUCED_MOTION}`,
    'color: #C8A24E; font-weight: bold;',
    'color: inherit;'
  );

  /* Core scroll */
  initLenis();
  initScrollTrigger();

  /* Scroll reveals */
  initScrollReveals();
  initTextLineSplit();
  initCounters();
  initStoryReveal();

  /* Interactive effects — scramble MUST run before letterHover */
  initTextScramble();
  initLetterHover();
  initMagneticButtons();
  initCardPopup();
  initSkillOrbs();
  initHeroReveal();

  /* Start unified animation loop (replaces 3 separate rAF loops) */
  startUnifiedLoop();

    /* Laser glow on cards */
  initLaserGlow();

  /* UI */
  initScrollspy();
  initHeaderTransition();
  initScrollProgress();
  initScrollToTop();
  initScrollIndicator();

  /* Content */
  initTypingEffect();
  initMobileMenu();
  initLightbox();

  /* Refresh after full load */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  /* Debounced resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
}

/* ============================================================
   EXPORTS
   ============================================================ */
export function getLenis() {
  return lenisInstance;
}