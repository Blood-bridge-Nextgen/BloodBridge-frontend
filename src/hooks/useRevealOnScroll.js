import { useLayoutEffect } from 'react';

/**
 * Reveal-on-view system for the BloodBridge landing page.
 *
 * How it works
 * 1. Before the first paint, every element matching REVEAL_TARGETS gets
 *    data-reveal="hidden" (CSS hides it, see reveal.css).
 * 2. One shared IntersectionObserver watches them.
 * 3. When an element enters the viewport it gets data-reveal="visible",
 *    which transitions it in. It is then unobserved, so it only animates once.
 * 4. When the transition ends, the data-reveal attribute is removed entirely,
 *    so the element goes back to its own CSS (hover transitions, etc.).
 *
 * No JSX changes are needed: the hook finds elements by their existing class
 * names. data-* attributes are used (not classes) so React re-renders never
 * wipe them.
 *
 * Usage: call `useRevealOnScroll()` once in App.jsx.
 */

/*
 * selector : which elements to reveal
 * delay    : fixed delay in ms (optional)
 * stagger  : true = delay by position within its row, left to right (optional)
 */
const REVEAL_TARGETS = [
  // Hero (text first, image slightly after)
  { selector: '.hero-text-block' },
  { selector: '.hero-imagery', delay: 150 },

  // Statistics
  { selector: '.statistics-grid .statistic-card', stagger: true },

  // How It Works
  { selector: '.workflow-heading' },
  { selector: '.workflow-step', stagger: true },

  // Features
  { selector: '.feature-section__header' },
  { selector: '.feature-section__card', stagger: true },

  // Trust / testimonials
  { selector: '.trust-section__header' },
  { selector: '.trust-section__card', stagger: true },

  // Safety & Verification and Hospital / Blood Bank sections:
  // add their class names here, for example
  // { selector: '.safety-section__header' },
  // { selector: '.safety-section__card', stagger: true },
  // { selector: '.hospital-section__header' },
  // { selector: '.hospital-section__card', stagger: true },

  // CTA banner + footer
  { selector: '.footer-cta-content' },
  { selector: '.editorial-footer-top' },
  { selector: '.editorial-footer-copyright' },
  { selector: '.editorial-footer-wordmark' },
];

const STAGGER_STEP = 90; // ms between items in a row
const STAGGER_MAX = 360; // never delay more than this

/** Position of an element among its siblings that sit on the same visual row. */
function positionInRow(el) {
  const sameRow = Array.from(el.parentElement.children).filter(
    (sibling) => Math.abs(sibling.offsetTop - el.offsetTop) < 4
  );
  return Math.max(sameRow.indexOf(el), 0);
}

/** Restore an element to its normal, un-animated state. */
function clearReveal(el) {
  el.removeAttribute('data-reveal');
  el.style.removeProperty('--reveal-delay');
}

export default function useRevealOnScroll() {
  // useLayoutEffect: tag elements before the browser paints, so content
  // never flashes visible and then disappears.
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Reduced motion or no IntersectionObserver: leave everything visible.
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const config = new Map(); // element -> its target config
    const listeners = new Map(); // element -> transitionend handler

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;

          if (!entry.isIntersecting) {
            // Still below the viewport: wait.
            if (entry.boundingClientRect.top >= 0) return;
            // Already scrolled past (e.g. refresh mid-page): show instantly.
            observer.unobserve(el);
            clearReveal(el);
            return;
          }

          observer.unobserve(el); // animate only once

          const { delay = 0, stagger = false } = config.get(el) || {};
          const totalDelay = stagger
            ? Math.min(positionInRow(el) * STAGGER_STEP, STAGGER_MAX)
            : delay;

          el.style.setProperty('--reveal-delay', `${totalDelay}ms`);

          const onEnd = (event) => {
            if (event.target !== el || event.propertyName !== 'opacity') return;
            el.removeEventListener('transitionend', onEnd);
            listeners.delete(el);
            clearReveal(el);
          };
          listeners.set(el, onEnd);
          el.addEventListener('transitionend', onEnd);

          el.setAttribute('data-reveal', 'visible');
        });
      },
      {
        threshold: 0.1,
        // Trigger slightly before the element reaches the bottom edge.
        rootMargin: '0px 0px -48px 0px',
      }
    );

    REVEAL_TARGETS.forEach((target) => {
      document.querySelectorAll(target.selector).forEach((el) => {
        config.set(el, target);
        el.setAttribute('data-reveal', 'hidden');
        observer.observe(el);
      });
    });

    // Cleanup: stop observing and restore every element we touched.
    return () => {
      observer.disconnect();
      listeners.forEach((handler, el) =>
        el.removeEventListener('transitionend', handler)
      );
      config.forEach((_, el) => clearReveal(el));
    };
  }, []);
}