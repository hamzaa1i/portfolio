/* ============================================================
   HAMZA ALI — PORTFOLIO ANIMATION ENGINE
   GSAP + Lenis + ScrollTrigger
   14 Modules · Performance Tiered · Mobile Safe
   ============================================================ */

   import gsap from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   import Lenis from 'lenis';
   
   gsap.registerPlugin(ScrollTrigger);
   
   /* ============================================================
      PERFORMANCE TIER DETECTION
      ============================================================ */
   function detectPerformanceTier() {
     if (typeof window === 'undefined') return 'full';
   
     const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;
     if (isMobile) return 'lite';
   
     const canvas = document.createElement('canvas');
     const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
   
     if (!gl) return 'lite';
   
     const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
     const renderer = debugInfo
       ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
       : '';
   
     const isWeakGPU =
       renderer.includes('intel') ||
       renderer.includes('mesa') ||
       renderer.includes('swiftshader') ||
       renderer.includes('llvmpipe');
   
     const cores = navigator.hardwareConcurrency || 2;
     const memory = navigator.deviceMemory || 4;
   
     if (isWeakGPU || cores <= 2 || memory <= 2) return 'lite';
     if (cores <= 4 || memory <= 4) return 'mid';
     return 'full';
   }
   
   const PERF_TIER = detectPerformanceTier();
   const IS_MOBILE = typeof window !== 'undefined' && (window.innerWidth < 1024 || 'ontouchstart' in window);
   const IS_TOUCH = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
   const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   
   /* ============================================================
      MODULE 1: LENIS SMOOTH SCROLL
      ============================================================ */
   let lenisInstance = null;
   
   function initLenis() {
     if (REDUCED_MOTION) return null;
   
     lenisInstance = new Lenis({
       duration: 1.6,
       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
       orientation: 'vertical',
       gestureOrientation: 'vertical',
       smoothWheel: true,
       wheelMultiplier: 0.55,
       touchMultiplier: 1.5,
       normalizeWheel: true,
       infinite: false,
     });
   
     lenisInstance.on('scroll', ScrollTrigger.update);
   
     gsap.ticker.add((time) => {
       lenisInstance.raf(time * 1000);
     });
   
     gsap.ticker.lagSmoothing(0);
   
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
      MODULE 3: SECTION SNAP (Desktop Only)
      ============================================================ */
   function initSectionSnap() {
     if (IS_MOBILE || REDUCED_MOTION) return;
   
     const sections = gsap.utils.toArray('[data-section]');
     if (sections.length === 0) return;
   
     ScrollTrigger.create({
       snap: {
         snapTo: 1 / (sections.length - 1),
         duration: { min: 0.3, max: 0.8 },
         delay: 0.05,
         ease: 'power2.inOut',
         inertia: false,
       },
       start: 'top top',
       end: 'bottom bottom',
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
       gsap.fromTo(
         el,
         { opacity: 0, y: 60 },
         {
           opacity: 1,
           y: 0,
           duration: 0.8,
           ease: 'power3.out',
           scrollTrigger: {
             trigger: el,
             start: 'top 85%',
             end: 'top 40%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   
     /* fade-left */
     gsap.utils.toArray('[data-animate="fade-left"]').forEach((el) => {
       gsap.fromTo(
         el,
         { opacity: 0, x: -60 },
         {
           opacity: 1,
           x: 0,
           duration: 0.8,
           ease: 'power3.out',
           scrollTrigger: {
             trigger: el,
             start: 'top 85%',
             end: 'top 40%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   
     /* fade-right */
     gsap.utils.toArray('[data-animate="fade-right"]').forEach((el) => {
       gsap.fromTo(
         el,
         { opacity: 0, x: 60 },
         {
           opacity: 1,
           x: 0,
           duration: 0.8,
           ease: 'power3.out',
           scrollTrigger: {
             trigger: el,
             start: 'top 85%',
             end: 'top 40%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   
     /* scale */
     gsap.utils.toArray('[data-animate="scale"]').forEach((el) => {
       gsap.fromTo(
         el,
         { opacity: 0, scale: 0.85 },
         {
           opacity: 1,
           scale: 1,
           duration: 0.8,
           ease: 'power3.out',
           scrollTrigger: {
             trigger: el,
             start: 'top 85%',
             end: 'top 40%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   
     /* fade (simple opacity) */
     gsap.utils.toArray('[data-animate="fade"]').forEach((el) => {
       gsap.fromTo(
         el,
         { opacity: 0 },
         {
           opacity: 1,
           duration: 0.6,
           ease: 'power2.out',
           scrollTrigger: {
             trigger: el,
             start: 'top 85%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   
     /* Stagger children groups */
     gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
       const children = container.children;
       if (!children.length) return;
   
       gsap.fromTo(
         children,
         { opacity: 0, y: 30 },
         {
           opacity: 1,
           y: 0,
           duration: 0.6,
           stagger: 0.1,
           ease: 'power3.out',
           scrollTrigger: {
             trigger: container,
             start: 'top 85%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   }
   
   /* ============================================================
      MODULE 5: TEXT LINE SPLIT & REVEAL
      ============================================================ */
   function splitTextIntoLines(element) {
     const text = element.textContent;
     const words = text.split(' ');
     element.innerHTML = '';
     element.style.overflow = 'hidden';
   
     const tempSpan = document.createElement('span');
     tempSpan.style.visibility = 'hidden';
     tempSpan.style.position = 'absolute';
     tempSpan.style.whiteSpace = 'nowrap';
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
       const lineWrapper = document.createElement('span');
       lineWrapper.classList.add('line-reveal');
       lineWrapper.style.display = 'block';
       lineWrapper.style.overflow = 'hidden';
   
       const lineInner = document.createElement('span');
       lineInner.classList.add('line');
       lineInner.style.display = 'block';
       lineInner.textContent = lineText;
   
       lineWrapper.appendChild(lineInner);
       element.appendChild(lineWrapper);
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
   
       gsap.fromTo(
         lines,
         { y: '110%' },
         {
           y: '0%',
           duration: 0.9,
           stagger: 0.08,
           ease: 'power4.out',
           scrollTrigger: {
             trigger: el,
             start: 'top 85%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
         }
       );
     });
   }
   
   /* ============================================================
      MODULE 6: COUNTER ANIMATION
      ============================================================ */
   function initCounters() {
     if (REDUCED_MOTION) {
       gsap.utils.toArray('[data-counter]').forEach((el) => {
         const target = el.getAttribute('data-counter');
         const suffix = el.getAttribute('data-counter-suffix') || '';
         const prefix = el.getAttribute('data-counter-prefix') || '';
         el.textContent = prefix + Number(target).toLocaleString() + suffix;
       });
       return;
     }
   
     gsap.utils.toArray('[data-counter]').forEach((el) => {
       const target = parseInt(el.getAttribute('data-counter'), 10);
       const suffix = el.getAttribute('data-counter-suffix') || '';
       const prefix = el.getAttribute('data-counter-prefix') || '';
       const duration = parseFloat(el.getAttribute('data-counter-duration')) || 2;
   
       const obj = { value: 0 };
   
       ScrollTrigger.create({
         trigger: el,
         start: 'top 85%',
         once: true,
         fastScrollEnd: true,
         onEnter: () => {
           gsap.to(obj, {
             value: target,
             duration: duration,
             ease: 'power2.out',
             onUpdate: () => {
               const displayValue = Math.round(obj.value);
               el.textContent = prefix + displayValue.toLocaleString() + suffix;
             },
           });
         },
       });
     });
   }
   
   /* ============================================================
      MODULE 7: MAGNETIC ELEMENTS (Desktop Only)
      ============================================================ */
   function initMagnetic() {
     if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;
   
     const magneticElements = gsap.utils.toArray('[data-magnetic]');
   
     magneticElements.forEach((el) => {
       const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.3;
       const innerStrength = parseFloat(el.getAttribute('data-magnetic-inner')) || 0.5;
       const distance = parseInt(el.getAttribute('data-magnetic-distance')) || 80;
       const innerEl = el.querySelector('[data-magnetic-inner-target]') || el.querySelector('span') || null;
   
       const onMouseMove = (e) => {
         const rect = el.getBoundingClientRect();
         const cx = rect.left + rect.width / 2;
         const cy = rect.top + rect.height / 2;
         const dx = e.clientX - cx;
         const dy = e.clientY - cy;
         const dist = Math.sqrt(dx * dx + dy * dy);
   
         if (dist < distance) {
           gsap.to(el, {
             x: dx * strength,
             y: dy * strength,
             duration: 0.4,
             ease: 'power3.out',
           });
   
           if (innerEl) {
             gsap.to(innerEl, {
               x: dx * innerStrength,
               y: dy * innerStrength,
               duration: 0.4,
               ease: 'power3.out',
             });
           }
         } else {
           gsap.to(el, {
             x: 0,
             y: 0,
             duration: 0.6,
             ease: 'elastic.out(1, 0.5)',
           });
   
           if (innerEl) {
             gsap.to(innerEl, {
               x: 0,
               y: 0,
               duration: 0.6,
               ease: 'elastic.out(1, 0.5)',
             });
           }
         }
       };
   
       const onMouseLeave = () => {
         gsap.to(el, {
           x: 0,
           y: 0,
           duration: 0.6,
           ease: 'elastic.out(1, 0.5)',
         });
   
         if (innerEl) {
           gsap.to(innerEl, {
             x: 0,
             y: 0,
             duration: 0.6,
             ease: 'elastic.out(1, 0.5)',
           });
         }
       };
   
       document.addEventListener('mousemove', onMouseMove);
       el.addEventListener('mouseleave', onMouseLeave);
     });
   }
   
   /* ============================================================
      MODULE 8: CUSTOM CURSOR (Desktop Only)
      ============================================================ */
   function initCustomCursor() {
     if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;
   
     const dot = document.querySelector('.cursor-dot');
     const follower = document.querySelector('.cursor-follower');
     const label = document.querySelector('.cursor-label');
   
     if (!dot || !follower) return;
   
     document.documentElement.classList.add('has-custom-cursor');
   
     let mouseX = 0;
     let mouseY = 0;
     let dotX = 0;
     let dotY = 0;
     let followerX = 0;
     let followerY = 0;
     let labelX = 0;
     let labelY = 0;
     let isVisible = false;
   
     const dotSpeed = 1;
     const followerSpeed = 0.12;
     const labelSpeed = 0.1;
   
     document.addEventListener('mousemove', (e) => {
       mouseX = e.clientX;
       mouseY = e.clientY;
   
       if (!isVisible) {
         isVisible = true;
         dot.style.opacity = '1';
         follower.style.opacity = '1';
         dotX = mouseX;
         dotY = mouseY;
         followerX = mouseX;
         followerY = mouseY;
       }
     });
   
     document.addEventListener('mouseleave', () => {
       isVisible = false;
       dot.style.opacity = '0';
       follower.style.opacity = '0';
       if (label) label.style.opacity = '0';
     });
   
     document.addEventListener('mouseenter', () => {
       isVisible = true;
       dot.style.opacity = '1';
       follower.style.opacity = '1';
     });
   
     function updateCursor() {
       dotX += (mouseX - dotX) * dotSpeed;
       dotY += (mouseY - dotY) * dotSpeed;
       followerX += (mouseX - followerX) * followerSpeed;
       followerY += (mouseY - followerY) * followerSpeed;
   
       dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
       follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
   
       if (label) {
         labelX += (mouseX - labelX) * labelSpeed;
         labelY += (mouseY - labelY) * labelSpeed;
         label.style.transform = `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`;
       }
   
       requestAnimationFrame(updateCursor);
     }
   
     requestAnimationFrame(updateCursor);
   
     /* Hover states */
     const hoverTargets = document.querySelectorAll(
       'a, button, [role="button"], input, textarea, select, .glow-btn, [data-cursor]'
     );
   
     hoverTargets.forEach((target) => {
       const cursorType = target.getAttribute('data-cursor') || 'hover';
   
       target.addEventListener('mouseenter', () => {
         document.documentElement.classList.remove('cursor-hover', 'cursor-view', 'cursor-click', 'cursor-hidden');
   
         if (cursorType === 'view') {
           document.documentElement.classList.add('cursor-view');
           if (label) {
             label.textContent = 'VIEW';
             label.style.opacity = '1';
           }
         } else if (cursorType === 'click') {
           document.documentElement.classList.add('cursor-click');
           if (label) {
             label.textContent = 'CLICK';
             label.style.opacity = '1';
           }
         } else {
           document.documentElement.classList.add('cursor-hover');
           if (label) label.style.opacity = '0';
         }
       });
   
       target.addEventListener('mouseleave', () => {
         document.documentElement.classList.remove('cursor-hover', 'cursor-view', 'cursor-click');
         if (label) label.style.opacity = '0';
       });
     });
   }
   
   /* ============================================================
      MODULE 9: SCROLLSPY — Active Header Link
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
         fastScrollEnd: true,
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
   
     /* Clicking nav links scrolls via Lenis */
     navLinks.forEach((link) => {
       link.addEventListener('click', (e) => {
         e.preventDefault();
         const targetId = link.getAttribute('href');
         const targetEl = document.querySelector(targetId);
         if (targetEl && lenisInstance) {
           lenisInstance.scrollTo(targetEl, {
             offset: 0,
             duration: 1.6,
             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
           });
         } else if (targetEl) {
           targetEl.scrollIntoView({ behavior: 'smooth' });
         }
   
         /* Close mobile menu if open */
         const mobileMenu = document.querySelector('[data-mobile-menu]');
         if (mobileMenu && mobileMenu.classList.contains('open')) {
           mobileMenu.classList.remove('open');
           document.body.style.overflow = '';
           if (lenisInstance) lenisInstance.start();
         }
       });
     });
   }
   
   /* ============================================================
      MODULE 10: HEADER GLASS TRANSITION
      ============================================================ */
   function initHeaderTransition() {
     const header = document.querySelector('[data-header]');
     if (!header) return;
   
     ScrollTrigger.create({
       start: 'top -80',
       end: 'max',
       onUpdate: (self) => {
         if (self.scroll() > 80) {
           header.classList.add('header-scrolled');
         } else {
           header.classList.remove('header-scrolled');
         }
       },
     });
   }
   
   /* ============================================================
      MODULE 11: HORIZONTAL SCROLL — Work Section (Desktop Only)
      ============================================================ */
   function initHorizontalScroll() {
     if (IS_MOBILE || REDUCED_MOTION) return;
   
     const section = document.querySelector('[data-horizontal-scroll]');
     const track = document.querySelector('[data-horizontal-track]');
   
     if (!section || !track) return;
   
     const cards = track.querySelectorAll('.project-card');
     if (cards.length === 0) return;
   
     /* Wait for layout to settle */
     requestAnimationFrame(() => {
       const totalScrollWidth = track.scrollWidth;
       const viewportWidth = window.innerWidth;
       const scrollDistance = totalScrollWidth - viewportWidth;
   
       if (scrollDistance <= 0) return;
   
       gsap.to(track, {
         x: -scrollDistance,
         ease: 'none',
         scrollTrigger: {
           trigger: section,
           start: 'top top',
           end: () => `+=${scrollDistance}`,
           scrub: 1,
           pin: true,
           anticipatePin: 1,
           fastScrollEnd: true,
           invalidateOnRefresh: true,
         },
       });
     });
   }
   
   /* ============================================================
      MODULE 12: SCROLL PROGRESS BAR
      ============================================================ */
   function initScrollProgress() {
     const progressBar = document.querySelector('.scroll-progress-bar');
     if (!progressBar) return;
   
     ScrollTrigger.create({
       start: 'top top',
       end: 'bottom bottom',
       onUpdate: (self) => {
         const progress = self.progress;
         progressBar.style.height = `${progress * 100}%`;
         document.documentElement.style.setProperty('--scroll-progress', progress.toString());
       },
     });
   }
   
   /* ============================================================
      MODULE 13: SCROLL-TO-TOP BUTTON
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
         lenisInstance.scrollTo(0, {
           duration: 2,
           easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
         });
       } else {
         window.scrollTo({ top: 0, behavior: 'smooth' });
       }
     });
   }
   
   /* ============================================================
      MODULE 14: MOUSE TRACKING (CSS Variables for Glow)
      ============================================================ */
   function initMouseTracking() {
     if (IS_TOUCH || IS_MOBILE) return;
   
     let ticking = false;
     let currentX = 0;
     let currentY = 0;
   
     document.addEventListener('mousemove', (e) => {
       currentX = e.clientX;
       currentY = e.clientY;
   
       if (!ticking) {
         requestAnimationFrame(() => {
           document.documentElement.style.setProperty('--cursor-x', `${currentX}px`);
           document.documentElement.style.setProperty('--cursor-y', `${currentY}px`);
           ticking = false;
         });
         ticking = true;
       }
     });
   
     /* Per-element mouse tracking for glow buttons */
     const glowElements = document.querySelectorAll('.glow-btn, [data-glow]');
   
     glowElements.forEach((el) => {
       el.addEventListener('mousemove', (e) => {
         const rect = el.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         el.style.setProperty('--mouse-x', `${x}px`);
         el.style.setProperty('--mouse-y', `${y}px`);
       });
     });
   }
   
   /* ============================================================
      MODULE 15: TYPING EFFECT
      ============================================================ */
   function initTypingEffect() {
     const container = document.querySelector('[data-typewriter]');
     if (!container) return;
   
     const textEl = container.querySelector('[data-typewriter-text]');
     if (!textEl) return;
   
     const roles = JSON.parse(container.getAttribute('data-typewriter') || '[]');
     if (roles.length === 0) return;
   
     const typeSpeed = 80;
     const deleteSpeed = 40;
     const pauseDuration = 2000;
   
     let roleIndex = 0;
     let charIndex = 0;
     let isDeleting = false;
     let timeoutId = null;
   
     function type() {
       const currentRole = roles[roleIndex];
   
       if (isDeleting) {
         charIndex--;
         textEl.textContent = currentRole.substring(0, charIndex);
   
         if (charIndex === 0) {
           isDeleting = false;
           roleIndex = (roleIndex + 1) % roles.length;
           timeoutId = setTimeout(type, 400);
           return;
         }
   
         timeoutId = setTimeout(type, deleteSpeed);
       } else {
         charIndex++;
         textEl.textContent = currentRole.substring(0, charIndex);
   
         if (charIndex === currentRole.length) {
           isDeleting = true;
           timeoutId = setTimeout(type, pauseDuration);
           return;
         }
   
         timeoutId = setTimeout(type, typeSpeed);
       }
     }
   
     /* Start after a short delay */
     if (REDUCED_MOTION) {
       textEl.textContent = roles[0];
       return;
     }
   
     setTimeout(type, 600);
   }
   
   /* ============================================================
      MODULE 16: STORY SECTION — Line-by-Line Reveal
      ============================================================ */
   function initStoryReveal() {
     if (REDUCED_MOTION) return;
   
     const storyParagraphs = gsap.utils.toArray('[data-story-line]');
   
     storyParagraphs.forEach((p, i) => {
       gsap.fromTo(
         p,
         {
           opacity: 0,
           y: 40,
           filter: 'blur(8px)',
         },
         {
           opacity: 1,
           y: 0,
           filter: 'blur(0px)',
           duration: 1,
           ease: 'power3.out',
           scrollTrigger: {
             trigger: p,
             start: 'top 85%',
             end: 'top 50%',
             toggleActions: 'play none none reverse',
             fastScrollEnd: true,
           },
           delay: i * 0.05,
         }
       );
     });
   }
   
   /* ============================================================
      MODULE 17: SKILL ORBS — Proximity Tilt (Desktop)
      ============================================================ */
   function initSkillOrbs() {
     if (IS_TOUCH || IS_MOBILE || REDUCED_MOTION) return;
   
     const orbs = gsap.utils.toArray('.skill-orb');
     if (orbs.length === 0) return;
   
     let mouseX = 0;
     let mouseY = 0;
   
     document.addEventListener('mousemove', (e) => {
       mouseX = e.clientX;
       mouseY = e.clientY;
     });
   
     function updateOrbs() {
       orbs.forEach((orb) => {
         const rect = orb.getBoundingClientRect();
         const cx = rect.left + rect.width / 2;
         const cy = rect.top + rect.height / 2;
         const dx = mouseX - cx;
         const dy = mouseY - cy;
         const dist = Math.sqrt(dx * dx + dy * dy);
         const maxDist = 150;
   
         if (dist < maxDist) {
           const factor = 1 - dist / maxDist;
           const tiltX = (dy / maxDist) * 15 * factor;
           const tiltY = -(dx / maxDist) * 15 * factor;
           const translateX = (dx / maxDist) * 8 * factor;
           const translateY = (dy / maxDist) * 8 * factor;
   
           gsap.to(orb, {
             rotateX: tiltX,
             rotateY: tiltY,
             x: translateX,
             y: translateY,
             scale: 1 + 0.05 * factor,
             duration: 0.4,
             ease: 'power2.out',
             overwrite: 'auto',
           });
         } else {
           gsap.to(orb, {
             rotateX: 0,
             rotateY: 0,
             x: 0,
             y: 0,
             scale: 1,
             duration: 0.6,
             ease: 'elastic.out(1, 0.6)',
             overwrite: 'auto',
           });
         }
       });
   
       requestAnimationFrame(updateOrbs);
     }
   
     requestAnimationFrame(updateOrbs);
   }
   
   /* ============================================================
      MODULE 18: MOBILE MENU TOGGLE
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
         document.body.style.overflow = '';
         if (lenisInstance) lenisInstance.start();
       } else {
         menu.classList.add('open');
         toggle.classList.add('open');
         toggle.setAttribute('aria-expanded', 'true');
         document.body.style.overflow = 'hidden';
         if (lenisInstance) lenisInstance.stop();
       }
     });
   }
   
   /* ============================================================
      MODULE 19: LIGHTBOX
      ============================================================ */
   function initLightbox() {
     const overlay = document.querySelector('.lightbox-overlay');
     if (!overlay) return;
   
     const lightboxImg = overlay.querySelector('.lightbox-image');
     const closeBtn = overlay.querySelector('.lightbox-close');
   
     const triggers = document.querySelectorAll('[data-lightbox]');
   
     triggers.forEach((trigger) => {
       trigger.addEventListener('click', () => {
         const src = trigger.getAttribute('data-lightbox');
         const alt = trigger.getAttribute('data-lightbox-alt') || 'Project screenshot';
   
         if (lightboxImg && src) {
           lightboxImg.setAttribute('src', src);
           lightboxImg.setAttribute('alt', alt);
         }
   
         overlay.classList.add('active');
         document.body.style.overflow = 'hidden';
         if (lenisInstance) lenisInstance.stop();
       });
     });
   
     function closeLightbox() {
       overlay.classList.remove('active');
       document.body.style.overflow = '';
       if (lenisInstance) lenisInstance.start();
     }
   
     if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
   
     overlay.addEventListener('click', (e) => {
       if (e.target === overlay) closeLightbox();
     });
   
     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape' && overlay.classList.contains('active')) {
         closeLightbox();
       }
     });
   }
   
   /* ============================================================
      MODULE 20: SCROLL INDICATOR — Subtle Bounce in Hero
      ============================================================ */
   function initScrollIndicator() {
     const indicator = document.querySelector('[data-scroll-indicator]');
     if (!indicator || REDUCED_MOTION) return;
   
     ScrollTrigger.create({
       start: 'top -200',
       onUpdate: (self) => {
         if (self.scroll() > 200) {
           gsap.to(indicator, { opacity: 0, duration: 0.3 });
         } else {
           gsap.to(indicator, { opacity: 1, duration: 0.3 });
         }
       },
     });
   }
   
   /* ============================================================
      MASTER INIT — Orchestrate Everything
      ============================================================ */
   export function initAnimations() {
     if (typeof window === 'undefined') return;
   
     /* Log perf tier */
     console.log(`[Portfolio] Performance tier: ${PERF_TIER} | Mobile: ${IS_MOBILE} | Touch: ${IS_TOUCH} | Reduced Motion: ${REDUCED_MOTION}`);
   
     /* Module 1 — Smooth scroll */
     initLenis();
   
     /* Module 2 — ScrollTrigger config */
     initScrollTrigger();
   
     /* Module 3 — Section snapping (desktop) */
     initSectionSnap();
   
     /* Module 4 — Scroll reveal animations */
     initScrollReveals();
   
     /* Module 5 — Text line splits */
     initTextLineSplit();
   
     /* Module 6 — Counter animations */
     initCounters();
   
     /* Module 7 — Magnetic elements (desktop) */
     initMagnetic();
   
     /* Module 8 — Custom cursor (desktop) */
     initCustomCursor();
   
     /* Module 9 — Scrollspy active links */
     initScrollspy();
   
     /* Module 10 — Header glass transition */
     initHeaderTransition();
   
     /* Module 11 — Horizontal scroll (desktop) */
     initHorizontalScroll();
   
     /* Module 12 — Scroll progress bar */
     initScrollProgress();
   
     /* Module 13 — Scroll-to-top button */
     initScrollToTop();
   
     /* Module 14 — Mouse tracking for glow */
     initMouseTracking();
   
     /* Module 15 — Typing effect */
     initTypingEffect();
   
     /* Module 16 — Story line reveal */
     initStoryReveal();
   
     /* Module 17 — Skill orb proximity */
     initSkillOrbs();
   
     /* Module 18 — Mobile menu */
     initMobileMenu();
   
     /* Module 19 — Lightbox */
     initLightbox();
   
     /* Module 20 — Scroll indicator */
     initScrollIndicator();
   
     /* Refresh ScrollTrigger after everything loads */
     window.addEventListener('load', () => {
       ScrollTrigger.refresh();
     });
   
     /* Handle resize */
     let resizeTimeout;
     window.addEventListener('resize', () => {
       clearTimeout(resizeTimeout);
       resizeTimeout = setTimeout(() => {
         ScrollTrigger.refresh();
       }, 250);
     });
   }
   
   /* ============================================================
      EXPORT LENIS INSTANCE (for nav scrollTo)
      ============================================================ */
   export function getLenis() {
     return lenisInstance;
   }
   
   /* ============================================================
      EXPORT PERF TIER (for Three.js quality)
      ============================================================ */
   export function getPerfTier() {
     return PERF_TIER;
   }
   
   /* ============================================================
      AUTO-INIT ON DOM READY
      ============================================================ */
   if (typeof document !== 'undefined') {
     if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', initAnimations);
     } else {
       initAnimations();
     }
   }