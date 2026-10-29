/* ============================================================
   js/animations.js
   Short GSAP entrances and scroll reveals with safe fallbacks.
   ============================================================ */
(function () {
  "use strict";

  let initialized = false;
  let waitingForVisibleTab = false;
  const animations = [];

  function revealOnScroll(elements, trigger) {
    if (!elements.length) return;

    const tween = gsap.from(elements, {
      autoAlpha: 0,
      y: 18,
      duration: 0.58,
      ease: "power2.out",
      stagger: 0.09,
      immediateRender: false,
      clearProps: "opacity,visibility,transform",
      scrollTrigger: {
        trigger: trigger,
        start: "top 86%",
        once: true
      }
    });

    animations.push(tween);
  }

  function finishAnimations() {
    animations.forEach(function (animation) {
      animation.progress(1);
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    });
    animations.length = 0;
  }

  function initAnimations() {
    if (initialized) return;
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (document.visibilityState === "hidden") {
      if (!waitingForVisibleTab) {
        waitingForVisibleTab = true;
        document.addEventListener("visibilitychange", function onVisible() {
          if (document.visibilityState !== "visible") return;
          document.removeEventListener("visibilitychange", onVisible);
          waitingForVisibleTab = false;
          initAnimations();
        });
      }
      return;
    }

    initialized = true;
    gsap.registerPlugin(ScrollTrigger);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        finishAnimations();
      }
    });

    const heroItems = document.querySelectorAll(".hero-copy > *, .hero-img");
    const hero = gsap.from(heroItems, {
      autoAlpha: 0,
      y: 18,
      duration: 0.65,
      ease: "power2.out",
      stagger: 0.1,
      clearProps: "opacity,visibility,transform"
    });
    animations.push(hero);

    document.querySelectorAll(".sec-head").forEach(function (heading) {
      revealOnScroll([heading], heading);
    });

    document.querySelectorAll(".members, .stats, .values").forEach(function (group) {
      revealOnScroll(Array.from(group.children), group);
    });

    const legacy = document.querySelector(".legacy");
    if (legacy) {
      revealOnScroll([legacy], legacy);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    } else {
      window.addEventListener("load", function () {
        ScrollTrigger.refresh();
      }, { once: true });
    }
  }

  window.initAnimations = initAnimations;
})();
