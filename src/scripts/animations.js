/* ============================================================
   HAMZA ALI — PORTFOLIO V3 ANIMATION ENGINE
   Lenis · GSAP ScrollTrigger · Section Snap · Letter Hover
   Card Popup · Skill Orb Tilt · Premium Storytelling
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   DETECTION
   ============================================================ */
const IS_MOBILE =
  typeof window !== "undefined" &&
  (window.innerWidth < 1024 || "ontouchstart" in window);
const IS_TOUCH =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenisInstance = null;

/* ============================================================
   SHARED MOUSE + UNIFIED ANIMATION LOOP
   Merges 3 rAF loops → 1. Eliminates 2 extra mousemove listeners.
   ============================================================ */
let sharedMouseX = 0,
  sharedMouseY = 0;
const _loopCallbacks = [];

if (typeof window !== "undefined" && !IS_TOUCH && !IS_MOBILE) {
  document.addEventListener(
    "mousemove",
    (e) => {
      sharedMouseX = e.clientX;
      sharedMouseY = e.clientY;
    },
    { passive: true },
  );
}

function registerLoop(fn) {
  _loopCallbacks.push(fn);
}

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
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.7,
    touchMultiplier: 1.2,
    normalizeWheel: true,
    infinite: false,
    autoResize: true,
  });

  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  /* Prevent Lenis from stealing scroll inside overlays */
  document.addEventListener('wheel', function(e) {
    var target = e.target;
    if (
      target.closest('.terminal-overlay.active') ||
      target.closest('.cmd-overlay.active') ||
      target.closest('.kbd-overlay.active') ||
      target.closest('.music-player.expanded') ||
      target.closest('[data-mobile-menu].open')
    ) {
      e.stopPropagation();
    }
  }, { passive: false, capture: true });

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
    gsap.utils.toArray("[data-animate]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  /* fade-up */
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });

  /* fade */
  gsap.utils.toArray('[data-animate="fade"]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });

  /* scale */
  gsap.utils.toArray('[data-animate="scale"]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });

  /* stagger children */
  gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
    const children = container.children;
    if (!children.length) return;

    gsap.fromTo(
      children,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });
}

/* ============================================================
   MODULE 5: TEXT LINE SPLIT & REVEAL
   ============================================================ */
function splitTextIntoLines(element) {
  const text = element.textContent.trim();
  if (!text) return [];

  const words = text.split(" ");
  element.innerHTML = "";
  element.style.overflow = "hidden";

  const tempSpan = document.createElement("span");
  tempSpan.style.cssText =
    "visibility:hidden;position:absolute;white-space:nowrap;";
  tempSpan.style.font = window.getComputedStyle(element).font;
  document.body.appendChild(tempSpan);

  const containerWidth = element.offsetWidth;
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? currentLine + " " + word : word;
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
    const wrapper = document.createElement("span");
    wrapper.classList.add("line-reveal");
    wrapper.style.display = "block";
    wrapper.style.overflow = "hidden";

    const inner = document.createElement("span");
    inner.classList.add("line");
    inner.style.display = "block";
    inner.textContent = lineText;

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
  });

  return element.querySelectorAll(".line");
}

function initTextLineSplit() {
  if (REDUCED_MOTION) {
    gsap.utils.toArray("[data-split]").forEach((el) => {
      el.style.opacity = "1";
    });
    return;
  }

  gsap.utils.toArray("[data-split]").forEach((el) => {
    const lines = splitTextIntoLines(el);
    if (!lines.length) return;

    gsap.fromTo(
      lines,
      { y: "110%" },
      {
        y: "0%",
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });
}

/* ============================================================
   MODULE 6: COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  gsap.utils.toArray("[data-counter]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10);
    const suffix = el.getAttribute("data-counter-suffix") || "";
    const prefix = el.getAttribute("data-counter-prefix") || "";
    const duration =
      parseFloat(el.getAttribute("data-counter-duration")) || 2.2;

    if (REDUCED_MOTION) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: target,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              prefix + Math.round(obj.value).toLocaleString() + suffix;
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

  el.innerHTML = "";
  el.classList.add("hover-letters");

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.classList.add("char");

    if (text[i] === " ") {
      span.innerHTML = "&nbsp;";
    } else {
      span.textContent = text[i];
    }

    el.appendChild(span);
  }
}

function initLetterHover() {
  if (IS_TOUCH) return;

  const elements = document.querySelectorAll("[data-hover-letters]");

  elements.forEach((el) => {
    if (el.hasAttribute("data-scramble")) {
      el.addEventListener(
        "scramble:complete",
        () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              wrapInHoverLetters(el);
            });
          });
        },
        { once: true },
      );
    } else {
      wrapInHoverLetters(el);
    }
  });
}

/* ============================================================
   MODULE 8: PROJECT CARD POPUP
   — CSS :hover uses !important (works immediately, no GSAP conflict)
   — Moves card to body (escapes stacking context)
   — power2.inOut = smooth start AND end
   — Arrow cursor when expanded
   ============================================================ */
function initCardPopup() {
  if (IS_MOBILE) return;

  const cards = document.querySelectorAll(".project-card-interactive");
  const overlay = document.querySelector(".page-blur-overlay");

  if (!cards.length || !overlay) return;

  let expandedCard = null;
  let placeholder = null;
  let originalRect = null;

  function expandCard(card) {
    if (expandedCard) return;
    expandedCard = card;

    /* Capture current position */
    const rect = card.getBoundingClientRect();
    originalRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    /* Create invisible placeholder to hold grid spot */
    placeholder = document.createElement("div");
    placeholder.style.cssText =
      "width:" +
      rect.width +
      "px;height:" +
      rect.height +
      "px;visibility:hidden;";
    card.parentElement.insertBefore(placeholder, card);

    /* Move card to body — escapes .content-layer stacking context */
    document.body.appendChild(card);

    /* Kill CSS transitions so GSAP has full control */
    card.style.transition = "none";

    /* Set at current screen position (fixed) */
    gsap.set(card, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: "auto",
      margin: 0,
      zIndex: 75,
      scale: 1,
      clearProps: "transform",
    });

    card.classList.add("expanded");

    /* Show blur overlay */
    overlay.classList.add("active");

    /* Animate to center */
    const targetW = Math.min(window.innerWidth * 0.85, 680);

    gsap.to(card, {
      top: "50%",
      left: "50%",
      width: targetW,
      xPercent: -50,
      yPercent: -50,
      duration: 0.55,
      ease: "power2.inOut",
      delay: 0.08,
    });

    /* Stop scroll */
    if (lenisInstance) lenisInstance.stop();
    document.body.style.overflow = "hidden";
  }

  function collapseCard() {
    if (!expandedCard || !placeholder) return;

    const card = expandedCard;

    /* Animate back to original grid position */
    gsap.to(card, {
      top: originalRect.top,
      left: originalRect.left,
      width: originalRect.width,
      xPercent: 0,
      yPercent: 0,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: function () {
        card.classList.remove("expanded");
        card.style.transition = "";
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.height = "";
        card.style.zIndex = "";
        card.style.margin = "";
        gsap.set(card, { clearProps: "all" });

        if (placeholder && placeholder.parentElement) {
          placeholder.parentElement.insertBefore(card, placeholder);
          placeholder.remove();
        }
        placeholder = null;
      },
    });

    overlay.classList.remove("active");

    if (lenisInstance) lenisInstance.start();
    document.body.style.overflow = "";

    expandedCard = null;
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target.closest("button")) return;

      if (expandedCard === card) {
        collapseCard();
      } else if (!expandedCard) {
        expandCard(card);
      }
    });
  });

  overlay.addEventListener("click", collapseCard);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && expandedCard) collapseCard();
  });
}

/* ============================================================
   MODULE 9: SKILL ORB PROXIMITY TILT (Desktop Only)
   Optimized — uses shared mouse, visibility-gated, one loop
   ============================================================ */
function initSkillOrbs() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const orbs = gsap.utils.toArray(".skill-orb");
  if (!orbs.length) return;

  const section = document.querySelector("#skills");
  let visible = false;

  if (section) {
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        visible = true;
      },
      onLeave: () => {
        visible = false;
      },
      onEnterBack: () => {
        visible = true;
      },
      onLeaveBack: () => {
        visible = false;
      },
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
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(orb, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.7)",
          overwrite: "auto",
        });
      }
    }
  });
}

/* ============================================================
   MODULE 10: SCROLLSPY — Active Nav Link
   ============================================================ */
function initScrollspy() {
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const sections = document.querySelectorAll("[data-section]");

  if (!navLinks.length || !sections.length) return;

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    if (!id) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => setActiveLink(id),
      onEnterBack: () => setActiveLink(id),
    });
  });

  function setActiveLink(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* Nav link click → smooth scroll via Lenis */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;

      /* Handle /#section links (from any page) */
      let targetHash = href;
      if (href.startsWith("/#")) {
        if (window.location.pathname !== "/") {
          /* On a different page — let the page-fade transition handle it */
          return;
        }
        targetHash = href.substring(1); /* Remove the leading / */
      }

      if (!targetHash.startsWith("#")) return;

      e.preventDefault();
      const target = document.querySelector(targetHash);
      if (!target) return;

      if (lenisInstance) {
        lenisInstance.scrollTo(target, {
          offset: 0,
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }

      /* Close mobile menu */
      const menu = document.querySelector("[data-mobile-menu]");
      const toggle = document.querySelector("[data-menu-toggle]");
      if (menu && menu.classList.contains("open")) {
        menu.classList.remove("open");
        if (toggle) {
          toggle.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
        menu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lenisInstance) lenisInstance.start();
      }
    });
  });
}

/* ============================================================
   MODULE 11: HEADER GLASS ON SCROLL
   ============================================================ */
function initHeaderTransition() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  ScrollTrigger.create({
    start: "top -100",
    end: "max",
    onUpdate: (self) => {
      if (self.scroll() > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    },
  });
}

/* ============================================================
   MODULE 12: SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress-bar");
  if (!bar) return;

  ScrollTrigger.create({
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      bar.style.width = `${self.progress * 100}%`;
    },
  });
}

/* ============================================================
   MODULE 13: SCROLL-TO-TOP
   ============================================================ */
function initScrollToTop() {
  const btn = document.querySelector("[data-scroll-top]");
  if (!btn) return;

  ScrollTrigger.create({
    start: "top -400",
    end: "max",
    onUpdate: (self) => {
      if (self.scroll() > 400) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
  });

  btn.addEventListener("click", () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/* ============================================================
   MODULE 14: TYPING EFFECT — Bug-Free
   ============================================================ */
function initTypingEffect() {
  const container = document.querySelector("[data-typewriter]");
  if (!container) return;

  const textEl = container.querySelector("[data-typewriter-text]");
  if (!textEl) return;

  let roles;
  try {
    const raw =
      container.getAttribute("data-roles") ||
      container.getAttribute("data-typewriter") ||
      "[]";
    // Decode HTML entities that Astro may inject into attribute values
    const decoded = raw
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&amp;/g, "&");
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
        setTimeout(() => {
          isPaused = false;
          tick();
        }, PAUSE_DELETED);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIndex = Math.min(current.length, charIndex + 1);
      textEl.textContent = current.substring(0, charIndex);

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          tick();
        }, PAUSE_TYPED);
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

  gsap.utils.toArray("[data-story-line]").forEach((p, i) => {
    gsap.fromTo(
      p,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: p,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
        delay: i * 0.03,
      },
    );
  });
}

/* ============================================================
   MODULE 16: MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");

    if (isOpen) {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lenisInstance) lenisInstance.start();
    } else {
      menu.classList.add("open");
      toggle.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenisInstance) lenisInstance.stop();
    }
  });
}

/* ============================================================
   MODULE 17: LIGHTBOX
   ============================================================ */
function initLightbox() {
  const overlay = document.querySelector(".lightbox-overlay");
  if (!overlay) return;

  const img = overlay.querySelector(".lightbox-image");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const triggers = document.querySelectorAll("[data-lightbox]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-lightbox");
      const alt = trigger.getAttribute("data-lightbox-alt") || "Screenshot";
      if (img && src) {
        img.setAttribute("src", src);
        img.setAttribute("alt", alt);
      }
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      if (lenisInstance) lenisInstance.stop();
    });
  });

  function close() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    if (lenisInstance) lenisInstance.start();
  }

  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) close();
  });
}

/* ============================================================
   MODULE 18: SCROLL INDICATOR — fade + click to scroll
   ============================================================ */
function initScrollIndicator() {
  const el = document.querySelector("[data-scroll-indicator]");
  if (!el) return;

  /* Click to scroll to story section */
  el.style.cursor = "pointer";
  el.addEventListener("click", () => {
    const story = document.querySelector("#story");
    if (story && lenisInstance) {
      lenisInstance.scrollTo(story, {
        offset: 0,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (story) {
      story.scrollIntoView({ behavior: "smooth" });
    }
  });

  if (REDUCED_MOTION) return;

  ScrollTrigger.create({
    start: "top -150",
    onUpdate: (self) => {
      el.style.opacity = self.scroll() > 150 ? "0" : "1";
      el.style.transition = "opacity 0.4s ease";
    },
  });
}

/* ============================================================
   MODULE 19: HERO GRID + BLUEPRINT — entrance only, no per-frame work
   ============================================================ */
function initHeroReveal() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const hero = document.querySelector("#hero");
  if (!hero) return;

  const grid = hero.querySelector(".hero-grid");
  const blueprint = hero.querySelector(".hero-blueprint");

  requestAnimationFrame(() => {
    if (grid) grid.classList.add("active");
    if (blueprint) blueprint.classList.add("active");
  });
}

/* ============================================================
   MODULE 20: TEXT SCRAMBLE EFFECT
   Progressive character reveal — left to right
   ============================================================ */
function initTextScramble() {
  if (REDUCED_MOTION) {
    gsap.utils.toArray("[data-scramble]").forEach((el) => {
      el.style.opacity = "1";
    });
    return;
  }

  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>[]{}=+-";

  gsap.utils.toArray("[data-scramble]").forEach((el) => {
    const original = el.textContent.trim();
    if (!original) return;

    const isLoad = el.getAttribute("data-scramble") === "load";

    // Hide scroll-triggered elements until they play
    if (!isLoad) {
      el.style.opacity = "0";
    }

    let hasPlayed = false;

    function play() {
      if (hasPlayed) return;
      hasPlayed = true;

      el.style.opacity = "1";

      const len = original.length;
      const totalFrames = Math.min(Math.ceil(len * 2.5), 50);
      let frame = 0;

      function step() {
        frame++;
        const resolved = Math.floor((frame / totalFrames) * len);

        let text = "";
        for (let i = 0; i < len; i++) {
          if (original[i] === " ") {
            text += " ";
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
          el.dispatchEvent(new CustomEvent("scramble:complete"));
        }
      }

      requestAnimationFrame(step);
    }

    if (isLoad) {
      setTimeout(play, 400);
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
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

  const buttons = document.querySelectorAll("[data-magnetic]");
  if (!buttons.length) return;

  const winH = window.innerHeight;

  registerLoop(() => {
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const rect = btn.getBoundingClientRect();

      if (rect.bottom < -50 || rect.top > winH + 50) {
        if (btn._magneticActive) {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
          });
          btn._magneticActive = false;
        }
        continue;
      }

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = sharedMouseX - cx;
      const dy = sharedMouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = parseFloat(
        btn.getAttribute("data-magnetic-radius") || "80",
      );
      const strength = parseFloat(
        btn.getAttribute("data-magnetic-strength") || "0.3",
      );

      if (dist < radius) {
        const factor = strength * (1 - dist / radius);
        gsap.to(btn, {
          x: dx * factor,
          y: dy * factor,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
        btn._magneticActive = true;
      } else if (btn._magneticActive) {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
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

  document.querySelectorAll(".laser-glow").forEach((el) => {
    el.addEventListener(
      "mousemove",
      (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--laser-x", e.clientX - rect.left + "px");
        el.style.setProperty("--laser-y", e.clientY - rect.top + "px");
      },
      { passive: true },
    );
  });
}

/* ============================================================
   MODULE 23: DRAGGABLE SNAPSHOT CARD
   — Smooth drag with 3D tilt based on velocity
   — Rubber-band resistance past bounds
   — Elastic snap-back on release
   — "drag me" hint fades after first drag
   — Desktop only
   ============================================================ */
function initDraggableCard() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const card = document.querySelector("[data-draggable]");
  if (!card) return;

  let isDragging = false;
  let startX = 0,
    startY = 0;
  let currentX = 0,
    currentY = 0;
  let lastMX = 0,
    lastMY = 0;
  let velX = 0,
    velY = 0;
  let hasDragged = false;

  const BOUNDS_X = 100;
  const BOUNDS_Y = 60;

  /* Rubber-band: past bounds, movement resists */
  function rubber(value, limit) {
    if (Math.abs(value) <= limit) return value;
    var sign = value > 0 ? 1 : -1;
    var over = Math.abs(value) - limit;
    return sign * (limit + over * 0.12);
  }

  card.addEventListener("mousedown", function (e) {
    /* Don't drag if clicking a link/button inside */
    if (e.target.closest("a") || e.target.closest("button")) return;

    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    lastMX = e.clientX;
    lastMY = e.clientY;
    velX = 0;
    velY = 0;

    card.classList.add("dragging");

    if (!hasDragged) {
      hasDragged = true;
      card.classList.add("dragged");
    }

    /* Kill any snap-back in progress */
    gsap.killTweensOf(card);

    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    var rawX = e.clientX - startX;
    var rawY = e.clientY - startY;

    /* Apply rubber-band */
    currentX = rubber(rawX, BOUNDS_X);
    currentY = rubber(rawY, BOUNDS_Y);

    /* Track velocity for tilt */
    velX = e.clientX - lastMX;
    velY = e.clientY - lastMY;
    lastMX = e.clientX;
    lastMY = e.clientY;

    /* Tilt based on movement direction */
    var tiltY = Math.max(-15, Math.min(15, velX * 1.2));
    var tiltX = Math.max(-15, Math.min(15, -velY * 1.2));

    gsap.set(card, {
      x: currentX,
      y: currentY,
      rotateX: tiltX,
      rotateY: tiltY,
      scale: 1.04,
      boxShadow:
        "0 25px 60px rgba(0, 0, 0, 0.25), 0 0 40px rgba(200, 162, 78, 0.06)",
      force3D: true,
    });
  });

  document.addEventListener("mouseup", function () {
    if (!isDragging) return;
    isDragging = false;

    card.classList.remove("dragging");

    /* Snap back with elastic overshoot */
    gsap.to(card, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow:
        "inset 0 1px 0 0 rgba(255, 255, 255, 0.04), 0 2px 12px rgba(0, 0, 0, 0.15)",
      duration: 1,
      ease: "elastic.out(1, 0.4)",
      force3D: true,
    });

    currentX = 0;
    currentY = 0;
  });
}

/* ============================================================
   MODULE 23B: DRAGGABLE CURRENTLY CARD
   ============================================================ */
function initDraggableCurrently() {
  if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;

  const card = document.querySelector('[data-draggable-currently]');
  if (!card) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;
  let velX = 0, velY = 0;
  let lastMX = 0, lastMY = 0;

  const BOUNDS_X = 80;
  const BOUNDS_Y = 50;

  function rubber(value, limit) {
    if (Math.abs(value) <= limit) return value;
    var sign = value > 0 ? 1 : -1;
    var over = Math.abs(value) - limit;
    return sign * (limit + over * 0.1);
  }

  card.addEventListener('mousedown', function(e) {
    if (e.target.closest('a') || e.target.closest('button')) return;

    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    lastMX = e.clientX;
    lastMY = e.clientY;

    card.classList.add('dragging');
    gsap.killTweensOf(card);
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    var rawX = e.clientX - startX;
    var rawY = e.clientY - startY;

    currentX = rubber(rawX, BOUNDS_X);
    currentY = rubber(rawY, BOUNDS_Y);

    velX = e.clientX - lastMX;
    velY = e.clientY - lastMY;
    lastMX = e.clientX;
    lastMY = e.clientY;

    var tiltY = Math.max(-12, Math.min(12, velX * 1));
    var tiltX = Math.max(-12, Math.min(12, -velY * 1));

    gsap.set(card, {
      x: currentX,
      y: currentY,
      rotateX: tiltX,
      rotateY: tiltY,
      scale: 1.03,
      force3D: true,
    });
  });

  document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('dragging');

    gsap.to(card, {
      x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.9,
      ease: 'elastic.out(1, 0.4)',
      force3D: true,
    });

    currentX = 0;
    currentY = 0;
  });
}

/* ============================================================
   MODULE 24: SMOOTH PARALLAX
   Section headings scroll at 0.8x speed — subtle depth
   ============================================================ */
function initParallax() {
  if (REDUCED_MOTION) return;

  const elements = document.querySelectorAll("[data-parallax]");
  if (!elements.length) return;

  elements.forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-parallax") || "0.8");
    const distance = (1 - speed) * 100;

    gsap.fromTo(
      el,
      { y: -distance },
      {
        y: distance,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

/* ============================================================
   MODULE 25: SOUND DESIGN
   Premium UI sounds — base64 embedded, zero external files
   ============================================================ */
function initSoundDesign() {
  let muted = false;
  try {
    muted = localStorage.getItem("portfolio-muted") === "1";
  } catch (e) {}

  /* Tiny synthesized sounds via AudioContext */
  var audioCtx = null;

  function getCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    return audioCtx;
  }

  function playClick() {
    var ctx = getCtx();
    if (!ctx || muted) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }

  function playHover() {
    var ctx = getCtx();
    if (!ctx || muted) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }

  function playWhoosh() {
    var ctx = getCtx();
    if (!ctx || muted) return;

    var bufferSize = ctx.sampleRate * 0.15;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    var source = ctx.createBufferSource();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
    filter.Q.value = 1;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    source.start(ctx.currentTime);
  }

  function playSuccess() {
    var ctx = getCtx();
    if (!ctx || muted) return;

    [660, 880].forEach(function (freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  var sounds = {
    click: playClick,
    hover: playHover,
    whoosh: playWhoosh,
    success: playSuccess,
  };

  function play(name) {
    if (muted || !sounds[name]) return;
    try {
      sounds[name]();
    } catch (e) {}
  }

  /* Sound toggle button */
  var toggle = document.querySelector("[data-sound-toggle]");
  var onIcon = toggle ? toggle.querySelector("[data-sound-on]") : null;
  var offIcon = toggle ? toggle.querySelector("[data-sound-off]") : null;

  function updateToggle() {
    if (!toggle || !onIcon || !offIcon) return;
    if (muted) {
      onIcon.style.display = "none";
      offIcon.style.display = "block";
    } else {
      onIcon.style.display = "block";
      offIcon.style.display = "none";
    }
  }

  updateToggle();

if (toggle) {
  toggle.addEventListener("click", function () {
    muted = !muted;
    try {
      localStorage.setItem("portfolio-muted", muted ? "1" : "0");
    } catch (e) {}
    updateToggle();
    if (!muted) {
      play("success");
      document.dispatchEvent(new CustomEvent('sound:unmuted'));
    } else {
      document.dispatchEvent(new CustomEvent('sound:muted'));
    }
  });
}

  /* Click sounds */
  document
    .querySelectorAll(
      '[data-sound="click"], .btn-primary, .btn-secondary, [data-nav-link]',
    )
    .forEach(function (el) {
      el.addEventListener("click", function () {
        play("click");
      });
    });

  /* Hover sounds on cards */
  document
    .querySelectorAll(".project-card-interactive, .contact-link, .skill-orb")
    .forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        play("hover");
      });
    });

  /* Whoosh on card expand */
  document.addEventListener("click", function (e) {
    var card = e.target.closest(".project-card-interactive:not(.expanded)");
    if (card) play("whoosh");
  });
}

/* ============================================================
   MODULE 26: EASTER EGGS — 13 hidden interactions
   1.  Click logo 5x        → Theme roulette
   2.  Type "matrix"         → Matrix rain
   3.  Terminal "matrix"     → Matrix rain (via event)
   4.  Hold spacebar 3s      → Gravity drop
   5.  Click void zone       → Secret message
   6.  Konami code           → CRT retro mode
   7.  Type "hireme"         → Celebration pulse
   8.  Type "rotate"         → Barrel roll
   9.  Availability dot 7x   → Escalating messages
   10. Type "stats"          → Dev stats overlay
   11. Type "pk"/"pakistan"   → Pakistan flag
   12. Type "42"             → Hitchhiker quote
   13. 30s idle              → Screen dim
   ============================================================ */
function initEasterEggs() {
  let eggActive = false;

  /* ── Shared: get accent color ── */
  function getAccent() {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#C8A24E"
    );
  }

  /* ── Trigger: Matrix Rain ── */
  function triggerMatrix() {
    if (eggActive) return;
    eggActive = true;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;z-index:9998;pointer-events:none;";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 18);
    const drops = Array(cols).fill(0);
    const chars = "~/ハムザ01アイウエオカキクケコ{}()=>;<>ABCDEF";
    const accent = getAccent();

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 18;
        const y = drops[i] * 18;

        ctx.fillStyle = Math.random() > 0.3 ? accent : "#22c55e";
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 45);

    setTimeout(() => {
      clearInterval(interval);
      gsap.to(canvas, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.in",
        onComplete: () => {
          canvas.remove();
          eggActive = false;
        },
      });
    }, 8000);
  }

  /* ── Trigger: CRT Retro Mode (Konami) ── */
  function triggerCRT() {
    if (eggActive) return;
    eggActive = true;

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;";

    const scanlines = document.createElement("div");
    scanlines.style.cssText =
      "position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px);";
    overlay.appendChild(scanlines);

    const tint = document.createElement("div");
    tint.style.cssText =
      "position:absolute;inset:0;background:rgba(0,255,65,0.04);mix-blend-mode:overlay;";
    overlay.appendChild(tint);

    document.body.appendChild(overlay);

    const origFilter = document.body.style.filter;
    document.body.style.filter =
      "saturate(0.2) brightness(0.85) contrast(1.15) sepia(0.3) hue-rotate(80deg)";

    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
      flickerCount++;
      if (flickerCount > 40) {
        clearInterval(flickerInterval);
        return;
      }
      overlay.style.opacity = Math.random() > 0.7 ? "0.7" : "1";
    }, 100);

    setTimeout(() => {
      clearInterval(flickerInterval);
      overlay.style.opacity = "1";

      const shutoff = document.createElement("div");
      shutoff.style.cssText =
        "position:fixed;inset:0;z-index:9999;background:#FFFFFF;pointer-events:none;opacity:0;";
      document.body.appendChild(shutoff);

      gsap.to(shutoff, {
        opacity: 1,
        duration: 0.08,
        onComplete: () => {
          gsap.to(shutoff, {
            scaleY: 0.003,
            duration: 0.3,
            ease: "power3.in",
            onComplete: () => {
              gsap.to(shutoff, {
                scaleX: 0,
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                  shutoff.remove();
                  overlay.remove();
                  document.body.style.filter = origFilter || "";
                  eggActive = false;
                },
              });
            },
          });
        },
      });
    }, 6000);
  }

  /* ── Trigger: Hire Me Celebration ── */
  /* ── Trigger: Hire Me Celebration ── */
  function triggerHireMe() {
    if (eggActive) return;
    eggActive = true;

    const accent = getAccent();
    const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.5;

    /* Shockwave */
    const wave = document.createElement("div");
    wave.style.cssText =
      "position:fixed;top:50%;left:50%;z-index:9998;width:0;height:0;border-radius:50%;" +
      "background:radial-gradient(circle," +
      accent +
      "20," +
      accent +
      "05,transparent);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    document.body.appendChild(wave);

    gsap.to(wave, {
      width: maxDim,
      height: maxDim,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => wave.remove(),
    });

    /* Particles */
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      const size = 3 + Math.random() * 5;
      const angle = (Math.PI * 2 * i) / 20;
      const dist = 100 + Math.random() * 200;

      p.style.cssText =
        "position:fixed;top:50%;left:50%;z-index:9998;width:" +
        size +
        "px;height:" +
        size +
        "px;border-radius:50%;background:" +
        accent +
        ";pointer-events:none;transform:translate(-50%,-50%);";
      document.body.appendChild(p);

      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        delay: Math.random() * 0.1,
        onComplete: () => p.remove(),
      });
    }

    /* Backdrop */
    const backdrop = document.createElement("div");
    backdrop.style.cssText =
      "position:fixed;inset:0;z-index:9997;background:rgba(0,0,0,0.6);" +
      "backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;" +
      "transition:opacity 0.5s ease;cursor:pointer;";
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => {
      backdrop.style.opacity = "1";
    });

    /* Glass card message */
    const msg = document.createElement("div");
    msg.style.cssText =
      "position:fixed;top:50%;left:50%;z-index:9998;transform:translate(-50%,-50%) scale(0.95);" +
      "text-align:center;pointer-events:auto;opacity:0;cursor:pointer;" +
      "background:var(--glass-bg, rgba(255,255,255,0.03));" +
      "border:1px solid var(--glass-border, rgba(255,255,255,0.06));" +
      "padding:2.5rem 3rem;border-radius:1rem;" +
      "box-shadow:0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.04);";

    msg.innerHTML =
      "<p style=\"font-family:'JetBrains Mono',monospace;font-size:clamp(1.5rem,5vw,2.5rem);" +
      "font-weight:700;color:var(--text-primary, #FAFAFA);margin-bottom:1rem;" +
      "text-shadow:0 0 40px " +
      accent +
      '40;">' +
      "let's do this.</p>" +
      '<a href="#contact" style="font-family:\'JetBrains Mono\',monospace;font-size:clamp(0.8rem,2vw,1rem);' +
      "color:" +
      accent +
      ';text-decoration:underline;text-underline-offset:4px;pointer-events:auto;">' +
      "take me to contact ↓</a>" +
      "<p style=\"font-family:'JetBrains Mono',monospace;font-size:0.6rem;" +
      'color:var(--text-dim, #3F3F46);margin-top:1.5rem;">click anywhere to dismiss</p>';

    document.body.appendChild(msg);

    gsap.to(msg, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay: 0.3,
      ease: "back.out(1.5)",
    });

    function dismiss() {
      if (!msg.parentElement) return;
      gsap.to(msg, {
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
      });
      backdrop.style.opacity = "0";
      setTimeout(() => {
        msg.remove();
        backdrop.remove();
        eggActive = false;
      }, 300);
    }

    /* Click card to dismiss */
    msg.addEventListener("click", (e) => {
      if (e.target.tagName === "A") return;
      dismiss();
    });

    /* Click backdrop to dismiss */
    backdrop.addEventListener("click", dismiss);

    /* Contact link scrolls + dismisses */
    msg.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      dismiss();
      const contact = document.querySelector("#contact");
      if (contact && lenisInstance) {
        lenisInstance.scrollTo(contact, { duration: 1.4 });
      } else if (contact) {
        contact.scrollIntoView({ behavior: "smooth" });
      }
    });

    /* ESC to dismiss */
    function onEsc(e) {
      if (e.key === "Escape") {
        dismiss();
        document.removeEventListener("keydown", onEsc);
      }
    }
    document.addEventListener("keydown", onEsc);
  }

  /* ── Trigger: Barrel Roll ── */
  function triggerBarrelRoll() {
    if (eggActive) return;
    eggActive = true;

    const html = document.documentElement;
    const origOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.willChange = "transform";

    gsap.to(document.body, {
      rotation: 360,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(document.body, { rotation: 0, clearProps: "transform" });
        html.style.overflow = origOverflow || "";
        document.body.style.willChange = "";
        eggActive = false;
      },
    });
  }

  /* ── Trigger: Dev Stats Overlay ── */
  function triggerDevStats() {
    if (eggActive) return;
    eggActive = true;

    const accent = getAccent();

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;" +
      "background:rgba(0,0,0,0.85);opacity:0;transition:opacity 0.5s ease;cursor:pointer;";

    overlay.innerHTML =
      '<div style="background:rgba(24,24,27,0.95);border:1px solid rgba(255,255,255,0.1);' +
      "border-radius:0.875rem;padding:1.5rem 2rem;font-family:'JetBrains Mono',monospace;" +
      'max-width:340px;width:90%;box-shadow:0 25px 60px rgba(0,0,0,0.5);">' +
      '<div style="color:' +
      accent +
      ';font-weight:600;font-size:0.85rem;margin-bottom:0.75rem;">~/hamza dev stats</div>' +
      '<div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:0.75rem;"></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span style="color:#A1A1AA;font-size:0.75rem;">lines of code</span><span style="color:#FAFAFA;font-size:0.75rem;" data-egg-count="12847">0</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span style="color:#A1A1AA;font-size:0.75rem;">cups of chai</span><span style="color:#FAFAFA;font-size:0.75rem;" data-egg-count="2341">0</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span style="color:#A1A1AA;font-size:0.75rem;">bugs squashed</span><span style="color:#FAFAFA;font-size:0.75rem;" data-egg-count="847">0</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span style="color:#A1A1AA;font-size:0.75rem;">git commits</span><span style="color:#FAFAFA;font-size:0.75rem;" data-egg-count="394">0</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span style="color:#A1A1AA;font-size:0.75rem;">mass prayers</span><span style="color:#FAFAFA;font-size:0.75rem;" data-egg-count="1">0</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span style="color:#A1A1AA;font-size:0.75rem;">sleep lost</span><span style="color:' +
      accent +
      ';font-size:0.75rem;">&#8734; hrs</span></div>' +
      '<div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:0.5rem;padding-top:0.75rem;">' +
      '<span style="color:#52525B;font-size:0.65rem;">powered by chai &amp; dua</span>' +
      "</div>" +
      "</div>";

    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    overlay.querySelectorAll("[data-egg-count]").forEach((el) => {
      const target = parseInt(el.getAttribute("data-egg-count"));
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 1.8,
        delay: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toLocaleString();
        },
      });
    });

    function close() {
      if (!overlay.parentElement) return;
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        eggActive = false;
      }, 500);
    }

    overlay.addEventListener("click", close);
    setTimeout(close, 6000);
  }

  /* ── Trigger: Pakistan Flag ── */
  function triggerPakistan() {
    if (eggActive) return;
    eggActive = true;

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;" +
      "pointer-events:none;overflow:hidden;";

    /* Green background */
    const bg = document.createElement("div");
    bg.style.cssText =
      "position:absolute;inset:0;background:#01411C;transform:scaleX(0);transform-origin:left;";
    overlay.appendChild(bg);

    /* White stripe (left 25%) */
    const stripe = document.createElement("div");
    stripe.style.cssText =
      "position:absolute;left:0;top:0;bottom:0;width:25%;background:#FFFFFF;transform:scaleX(0);transform-origin:left;";
    overlay.appendChild(stripe);

    /* Crescent + star SVG */
    const svgWrap = document.createElement("div");
    svgWrap.style.cssText =
      "position:relative;z-index:1;opacity:0;margin-left:8%;";
    svgWrap.innerHTML =
      '<svg width="160" height="160" viewBox="0 0 160 160" fill="none">' +
      '<circle cx="80" cy="80" r="45" fill="#FFFFFF"/>' +
      '<circle cx="92" cy="80" r="37" fill="#01411C"/>' +
      '<polygon points="118,62 121,73 132,73 123,80 126,91 118,84 110,91 113,80 104,73 115,73" fill="#FFFFFF"/>' +
      "</svg>";
    overlay.appendChild(svgWrap);

    /* Text */
    const text = document.createElement("p");
    text.style.cssText =
      "position:absolute;bottom:18%;left:50%;transform:translateX(-50%);" +
      'font-family:"JetBrains Mono",monospace;font-size:clamp(0.8rem,2vw,1.1rem);' +
      "color:#FFFFFF;opacity:0;white-space:nowrap;z-index:1;letter-spacing:0.05em;";
    text.textContent = "Pakistan Zindabad";
    overlay.appendChild(text);

    document.body.appendChild(overlay);

    gsap.to(bg, { scaleX: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(stripe, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.15,
    });
    gsap.to(svgWrap, {
      opacity: 1,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out",
    });
    gsap.to(text, {
      opacity: 0.85,
      duration: 0.5,
      delay: 0.7,
      ease: "power2.out",
    });

    setTimeout(() => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          overlay.remove();
          eggActive = false;
        },
      });
    }, 5000);
  }

  /* ── Trigger: The Answer (42) ── */
  function trigger42() {
    if (eggActive) return;
    eggActive = true;

    const accent = getAccent();

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9998;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;background:rgba(0,0,0,0.92);" +
      "opacity:0;transition:opacity 0.8s ease;pointer-events:none;";

    const quote = document.createElement("p");
    quote.style.cssText =
      'font-family:"JetBrains Mono",monospace;font-size:clamp(1rem,3vw,1.5rem);' +
      "color:#FAFAFA;text-align:center;max-width:500px;padding:0 2rem;line-height:1.6;";
    quote.textContent = "";
    overlay.appendChild(quote);

    const attr = document.createElement("p");
    attr.style.cssText =
      'font-family:"JetBrains Mono",monospace;font-size:clamp(0.7rem,1.5vw,0.85rem);' +
      "color:" +
      accent +
      ";margin-top:1rem;opacity:0;transition:opacity 0.5s ease;";
    attr.textContent = "— Douglas Adams";
    overlay.appendChild(attr);

    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    const fullText = "the answer to life, the universe, and everything.";
    let idx = 0;

    const typeInterval = setInterval(() => {
      if (idx < fullText.length) {
        quote.textContent += fullText[idx];
        idx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          attr.style.opacity = "1";
        }, 300);
      }
    }, 50);

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        eggActive = false;
      }, 800);
    }, 5000);
  }

  /* ── Listen for terminal-triggered eggs ── */
  document.addEventListener("easter:matrix", triggerMatrix);

  /* ── Egg 1: Click Logo 5x → Theme Roulette ── */
  (function () {
    const logoArea = document.querySelector("[data-logo-area]");
    if (!logoArea) return;

    let clicks = 0;
    let timer = null;

    logoArea.addEventListener("click", function (e) {
      if (e.target.closest("[data-terminal-trigger]")) return;

      clicks++;
      clearTimeout(timer);
      timer = setTimeout(function () {
        clicks = 0;
      }, 2000);

      if (clicks >= 5) {
        clicks = 0;
        if (eggActive) return;
        eggActive = true;

        var allThemes = window.__eggThemes || {};
        var keys = Object.keys(allThemes);
        if (!keys.length) {
          eggActive = false;
          return;
        }

        var originalKey = null;
        try {
          originalKey = localStorage.getItem("portfolio-theme");
        } catch (ex) {}
        if (!originalKey || !allThemes[originalKey]) originalKey = keys[0];

        gsap.to(logoArea, {
          rotation: 720,
          duration: 3,
          ease: "power4.out",
          onComplete: function () {
            gsap.set(logoArea, { rotation: 0 });
          },
        });

        var cycleCount = 0;
        var maxCycles = 20;
        var h = document.documentElement;
        var dot = document.querySelector(".theme-dot-inner");

        var cycleInterval = setInterval(function () {
          var randomKey = keys[Math.floor(Math.random() * keys.length)];
          var th = allThemes[randomKey];
          if (th) {
            h.style.setProperty("--accent", th.accent);
            h.style.setProperty("--void", th.void);
            h.style.setProperty("--text-primary", th.textPrimary);
            h.style.setProperty("--text-secondary", th.textSecondary);
            h.style.setProperty("--accent-glow", th.accentGlow);
            h.style.backgroundColor = th.void;
            if (dot) dot.style.background = th.accent;
          }
          cycleCount++;
          if (cycleCount >= maxCycles) {
            clearInterval(cycleInterval);
            setTimeout(function () {
              var restoreTh = allThemes[originalKey];
              if (restoreTh) {
                h.style.setProperty("--void", restoreTh.void);
                h.style.setProperty("--midnight", restoreTh.midnight);
                h.style.setProperty("--surface", restoreTh.surface);
                h.style.setProperty("--elevated", restoreTh.elevated);
                h.style.setProperty("--glass-bg", restoreTh.glassBg);
                h.style.setProperty("--glass-border", restoreTh.glassBorder);
                h.style.setProperty("--glass-hover", restoreTh.glassHover);
                h.style.setProperty(
                  "--glass-hover-border",
                  restoreTh.glassHoverBorder,
                );
                h.style.setProperty("--text-primary", restoreTh.textPrimary);
                h.style.setProperty(
                  "--text-secondary",
                  restoreTh.textSecondary,
                );
                h.style.setProperty("--text-muted", restoreTh.textMuted);
                h.style.setProperty("--text-dim", restoreTh.textDim);
                h.style.setProperty("--accent", restoreTh.accent);
                h.style.setProperty("--accent-hover", restoreTh.accentHover);
                h.style.setProperty("--accent-dim", restoreTh.accentDim);
                h.style.setProperty("--accent-glow", restoreTh.accentGlow);
                h.style.setProperty("--accent-subtle", restoreTh.accentSubtle);
                h.style.setProperty(
                  "--accent-contrast",
                  restoreTh.accentContrast,
                );
                h.style.setProperty("--accent-success", restoreTh.success);
                h.style.setProperty(
                  "--gradient-accent-text",
                  restoreTh.gradientText,
                );
                h.style.backgroundColor = restoreTh.void;
                h.style.color = restoreTh.textPrimary;
                if (restoreTh.isDark) {
                  h.classList.add("dark");
                  h.classList.remove("light");
                } else {
                  h.classList.remove("dark");
                  h.classList.add("light");
                }
                if (dot) dot.style.background = restoreTh.accent;
                try {
                  localStorage.setItem("portfolio-theme", originalKey);
                } catch (ex) {}
              }
              document.dispatchEvent(
                new CustomEvent("theme:change", {
                  detail: { key: originalKey },
                }),
              );
              eggActive = false;
            }, 300);
          }
        }, 150);
      }
    });
  })();

  /* ── Eggs 2,7,8,10,11,12: Typed Word Triggers (merged buffer) ── */
  (function () {
    let buffer = "";

    document.addEventListener("keydown", function (e) {
      var tag = document.activeElement ? document.activeElement.tagName : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      /* Only capture printable single characters */
      if (e.key.length === 1) {
        buffer += e.key.toLowerCase();
        if (buffer.length > 30) buffer = buffer.slice(-30);
      }

      /* Check triggers — longest matches first */
      if (buffer.includes("matrix")) {
        buffer = "";
        triggerMatrix();
      } else if (buffer.includes("hireme") || buffer.includes("hire me")) {
        buffer = "";
        triggerHireMe();
      } else if (buffer.includes("rotate")) {
        buffer = "";
        triggerBarrelRoll();
      } else if (buffer.includes("pakistan")) {
        buffer = "";
        triggerPakistan();
      } else if (buffer.includes("stats")) {
        buffer = "";
        triggerDevStats();
      } else if (buffer.endsWith("42")) {
        buffer = "";
        trigger42();
      } else if (buffer.endsWith("pk")) {
        buffer = "";
        triggerPakistan();
      }
    });
  })();

  /* ── Egg 4: Hold Spacebar 3s → Gravity Drop ── */
  (function () {
    var spaceTimer = null;
    var spaceDown = false;
    var spaceBlocking = false;

    window.addEventListener(
      "keydown",
      function (e) {
        if (e.key !== " ") return;
        var tag = document.activeElement ? document.activeElement.tagName : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (spaceBlocking) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      },
      { capture: true },
    );

    document.addEventListener("keydown", function (e) {
      if (e.key !== " " || e.repeat) return;
      var tag = document.activeElement ? document.activeElement.tagName : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      spaceDown = true;
      spaceBlocking = true;

      spaceTimer = setTimeout(function () {
        if (!spaceDown || eggActive) return;
        eggActive = true;

        var targets = gsap.utils.toArray(
          ".section-inner > *, .stat-card, .skill-orb, .project-card-interactive, .floating-footer",
        );

        if (!targets.length) {
          eggActive = false;
          return;
        }

        var tl = gsap.timeline({
          onComplete: function () {
            gsap.to(targets, {
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.4)",
              stagger: 0.02,
              onComplete: function () {
                eggActive = false;
              },
            });
          },
        });

        tl.to(targets, {
          y: function () {
            return window.innerHeight * 0.5 + Math.random() * 300;
          },
          rotation: function () {
            return (Math.random() - 0.5) * 40;
          },
          opacity: 0.3,
          duration: 0.8,
          ease: "power2.in",
          stagger: 0.015,
        });
      }, 3000);
    });

    document.addEventListener("keyup", function (e) {
      if (e.key !== " ") return;
      spaceDown = false;
      spaceBlocking = false;
      clearTimeout(spaceTimer);
    });
  })();

  /* ── Egg 5: Click Void Zone → Secret Message ── */
  (function () {
    const voidZone = document.querySelector("[data-void-zone]");
    if (!voidZone) return;

    voidZone.addEventListener("click", function () {
      if (eggActive) return;
      eggActive = true;

      const accent = getAccent();

      const msg = document.createElement("div");
      msg.style.cssText =
        "position:fixed;inset:0;z-index:9998;display:flex;flex-direction:column;" +
        "align-items:center;justify-content:center;background:rgba(0,0,0,0.9);" +
        "opacity:0;transition:opacity 0.8s ease;pointer-events:none;";

      msg.innerHTML =
        '<p style="font-family:JetBrains Mono,monospace;font-size:clamp(1.2rem,4vw,2rem);' +
        "color:#FAFAFA;letter-spacing:-0.02em;font-weight:700;margin-bottom:0.5rem;" +
        "text-shadow:0 0 40px " +
        accent +
        '40;">you found the void.</p>' +
        '<p style="font-family:JetBrains Mono,monospace;font-size:clamp(0.8rem,2vw,1rem);' +
        "color:" +
        accent +
        ';font-weight:400;opacity:0.7;">nice.</p>';

      document.body.appendChild(msg);
      requestAnimationFrame(() => {
        msg.style.opacity = "1";
      });

      setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => {
          msg.remove();
          eggActive = false;
        }, 800);
      }, 4000);
    });
  })();

  /* ── Egg 6: Konami Code → CRT Retro Mode ── */
  (function () {
    var KONAMI = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    var idx = 0;

    document.addEventListener("keydown", function (e) {
      var tag = document.activeElement ? document.activeElement.tagName : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === KONAMI[idx]) {
        idx++;
        if (idx === KONAMI.length) {
          idx = 0;
          triggerCRT();
        }
      } else {
        idx = 0;
        if (e.key === KONAMI[0]) idx = 1;
      }
    });
  })();

  /* ── Egg 9: Availability Dot Rapid Clicks → Escalating Messages ── */
  (function () {
    var container = document.querySelector("[data-availability]");
    var textEl = document.querySelector("[data-availability-text]");
    var dot = document.querySelector("[data-availability-dot]");
    if (!container || !textEl || !dot) return;

    var originalText = textEl.textContent.trim();
    var messages = [
      originalText,
      "Yes, I'm actually available",
      "Seriously, hire me",
      "I'll start tomorrow",
      "Okay you can stop clicking",
      "...",
    ];

    var clicks = 0;
    var timer = null;

    function reset() {
      clicks = 0;
      textEl.textContent = originalText;
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
    }

    container.addEventListener("click", function () {
      if (eggActive) return;

      clicks++;
      clearTimeout(timer);
      timer = setTimeout(reset, 2500);

      /* Grow dot + change text */
      if (clicks <= messages.length) {
        textEl.textContent = messages[clicks - 1];
        gsap.to(dot, {
          scale: 1 + clicks * 0.35,
          duration: 0.2,
          ease: "back.out(2)",
        });
      }

      /* Explosion on 7th click */
      if (clicks >= 7) {
        eggActive = true;
        clearTimeout(timer);

        var rect = dot.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        for (var i = 0; i < 15; i++) {
          var p = document.createElement("div");
          var size = 3 + Math.random() * 5;
          var angle = (Math.PI * 2 * i) / 15;
          var dist = 40 + Math.random() * 80;
          p.style.cssText =
            "position:fixed;top:" +
            cy +
            "px;left:" +
            cx +
            "px;z-index:9998;" +
            "width:" +
            size +
            "px;height:" +
            size +
            "px;border-radius:50%;" +
            "background:#10B981;pointer-events:none;transform:translate(-50%,-50%);";
          document.body.appendChild(p);
          gsap.to(p, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            opacity: 0,
            duration: 0.6 + Math.random() * 0.3,
            ease: "power2.out",
            onComplete: function () {
              this.targets()[0].remove();
            },
          });
        }

        gsap.to(dot, { scale: 0, duration: 0.2 });
        textEl.textContent = "Currently taking on new projects ;)";

        setTimeout(function () {
          gsap.to(dot, {
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });
          textEl.textContent = originalText;
          clicks = 0;
          eggActive = false;
        }, 5000);
      }
    });
  })();

  /* ── Egg 13: 30s Idle → Dim Screen ── */
  (function () {
    var idleTimer = null;
    var idleShown = false;
    var idleOverlay = null;

    function dismissIdle() {
      if (!idleOverlay) return;
      var el = idleOverlay;
      idleOverlay = null;
      el.style.opacity = "0";
      el.style.transition = "opacity 0.5s ease";
      setTimeout(function () {
        if (el.parentElement) el.remove();
      }, 500);
    }

    function resetIdle() {
      clearTimeout(idleTimer);
      if (idleOverlay) {
        dismissIdle();
        return;
      }
      if (idleShown) return;
      idleTimer = setTimeout(showIdle, 30000);
    }

    function showIdle() {
      if (eggActive || idleShown) return;
      idleShown = true;

      var accent = getAccent();

      idleOverlay = document.createElement("div");
      idleOverlay.style.cssText =
        "position:fixed;inset:0;z-index:9997;display:flex;flex-direction:column;" +
        "align-items:center;justify-content:center;background:rgba(0,0,0,0);" +
        "transition:background 2s ease;cursor:pointer;";

      idleOverlay.innerHTML =
        "<p style=\"font-family:'JetBrains Mono',monospace;font-size:clamp(1rem,3vw,1.5rem);" +
        'color:#FAFAFA;opacity:0;transition:opacity 1s ease 1s;text-align:center;padding:0 2rem;">' +
        "you've been staring at this for a while.</p>" +
        "<p style=\"font-family:'JetBrains Mono',monospace;font-size:clamp(0.7rem,1.5vw,0.85rem);" +
        "color:" +
        accent +
        ";opacity:0;transition:opacity 1s ease 2s;margin-top:0.75rem;" +
        'text-align:center;padding:0 2rem;">' +
        "go build something. or hire me to build it for you.</p>";

      document.body.appendChild(idleOverlay);

      requestAnimationFrame(function () {
        idleOverlay.style.background = "rgba(0,0,0,0.85)";
        idleOverlay.querySelectorAll("p").forEach(function (p) {
          p.style.opacity = "1";
        });
      });

      idleOverlay.addEventListener("click", dismissIdle);
    }

    ["mousemove", "keydown", "scroll", "click", "touchstart"].forEach(
      function (evt) {
        document.addEventListener(evt, resetIdle, { passive: true });
      },
    );

    resetIdle();
  })();
}

/* ============================================================
   MASTER INIT
   ============================================================ */
export function initAnimations() {
  if (typeof window === "undefined") return;

  console.log(
    `%c[Portfolio V3]%c Mobile: ${IS_MOBILE} | Touch: ${IS_TOUCH} | Reduced Motion: ${REDUCED_MOTION}`,
    "color: #C8A24E; font-weight: bold;",
    "color: inherit;",
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

  /* Draggable card */
  initDraggableCard();
  initDraggableCurrently();

  /* UI */
  initScrollspy();
  initHeaderTransition();
  initScrollProgress();
  initScrollToTop();
  initScrollIndicator();

  /* Parallax depth */
  initParallax();

  /* Sound design */
  initSoundDesign();

  /* Easter eggs */
  initEasterEggs();

  /* Content */
  initTypingEffect();
  initMobileMenu();
  initLightbox();

  /* Refresh after full load */
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  /* Debounced resize */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });

  /* Skeleton reveal — must be last */
  initSkeletonReveal();
}

/* ============================================================
   MODULE 27: SKELETON REVEAL
   Marks skeleton wrappers as loaded after content is ready
   ============================================================ */
function initSkeletonReveal() {
  var skels = document.querySelectorAll('[data-skel]');
  if (!skels.length) return;

  /* Reveal all skeletons with a slight stagger */
  skels.forEach(function(skel, i) {
    setTimeout(function() {
      skel.classList.add('loaded');
    }, 100 + (i * 60));
  });
}

/* ============================================================
   EXPORTS
   ============================================================ */
export function getLenis() {
  return lenisInstance;
}
