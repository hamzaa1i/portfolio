/**
 * Section reveal. Runs once, no dependencies.
 * Elements with .reveal fade in 10px over ~400ms when they enter
 * the viewport. Under prefers-reduced-motion, or without
 * IntersectionObserver, everything stays visible.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealAll = () => {
  document.querySelectorAll('.reveal').forEach((el) => {
    el.setAttribute('data-revealed', 'true');
  });
};

if (reduceMotion.matches) {
  revealAll();
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    io.observe(el);
  });
} else {
  revealAll();
}

export {};
