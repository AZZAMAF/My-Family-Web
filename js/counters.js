/* ============================================================
   js/counters.js
   Count-up values when the statistics enter the viewport.
   ============================================================ */
(function () {
  "use strict";

  function setFinalValues(elements) {
    elements.forEach(function (element) {
      const target = Number(element.dataset.count);
      if (Number.isFinite(target)) {
        element.textContent = String(target);
      }
    });
  }

  function initCounters() {
    const numbers = Array.from(document.querySelectorAll("[data-count]"));
    if (!numbers.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setFinalValues(numbers);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const target = Number(element.dataset.count);
          observer.unobserve(element);

          if (!Number.isFinite(target)) return;

          const duration = 900;
          const startedAt = performance.now();

          function tick(now) {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(target * eased));

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              element.textContent = String(target);
            }
          }

          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.35 }
    );

    numbers.forEach(function (element) {
      observer.observe(element);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCounters, { once: true });
  } else {
    initCounters();
  }
})();
