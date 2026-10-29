/* ============================================================
   js/main.js
   Page interactions: active navigation and animation startup.
   ============================================================ */
(function () {
  "use strict";

  function setupMobileNavigation() {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("primary-navigation");
    if (!header || !toggle || !menu) return;

    function setMenuOpen(isOpen) {
      header.classList.toggle("is-menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Tutup navigasi" : "Buka navigasi");
    }

    toggle.addEventListener("click", function () {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 701px)").addEventListener("change", function (event) {
      if (event.matches) setMenuOpen(false);
    });
  }

  function setupActiveNavigation() {
    const links = Array.from(document.querySelectorAll("[data-nav]"));
    const sections = links
      .map(function (link) {
        return document.getElementById(link.dataset.nav);
      })
      .filter(Boolean);

    if (!links.length || !sections.length) return;

    function setActiveSection(id) {
      links.forEach(function (link) {
        const active = link.dataset.nav === id;
        link.classList.toggle("active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    setActiveSection(sections[0].id);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        const current = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          })[0];

        if (current) {
          setActiveSection(current.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function init() {
    setupMobileNavigation();
    setupActiveNavigation();
    setupLoadingScreen().then(function () {
      if (typeof window.initAnimations === "function") {
        window.initAnimations();
      }
    });
  }

  function setupLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return Promise.resolve();

    const minimumDisplay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? Promise.resolve()
      : new Promise(function (resolve) {
          window.setTimeout(resolve, 420);
        });

    const pageReady = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise(function (resolve) {
          window.addEventListener("load", resolve, { once: true });
        });

    const safetyTimeout = new Promise(function (resolve) {
      window.setTimeout(resolve, 1600);
    });

    return Promise.all([minimumDisplay, Promise.race([pageReady, safetyTimeout])]).then(function () {
      loadingScreen.classList.add("is-hidden");
      window.setTimeout(function () {
        loadingScreen.remove();
      }, 280);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
