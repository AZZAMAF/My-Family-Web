(function () {
  "use strict";

  function setupLoadingScreen() {
    const overlay = document.getElementById("loading-overlay");
    if (!overlay) return;

    let isHidden = false;
    let fallbackTimer;

    function hideOverlay() {
      if (isHidden) return;
      isHidden = true;
      window.clearTimeout(fallbackTimer);
      overlay.classList.add("hidden");

      if (typeof window.initAnimations === "function") {
        window.initAnimations();
      }
    }

    window.setTimeout(hideOverlay, 1200);
    fallbackTimer = window.setTimeout(hideOverlay, 3000);
  }

  function setupImageFallbacks() {
    document.querySelectorAll("img[src^='src/']").forEach(function (image) {
      function tryProjectAssetPath() {
        if (image.dataset.fallbackApplied) return;
        image.dataset.fallbackApplied = "true";
        image.src = "assets/" + image.getAttribute("src");
      }

      image.addEventListener("error", tryProjectAssetPath, { once: true });

      if (image.complete && image.naturalWidth === 0) {
        tryProjectAssetPath();
      }
    });
  }

  function setupMobileNavigation() {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("primary-navigation");
    if (!header || !toggle || !menu) return;

    function setMenuOpen(isOpen) {
      header.classList.toggle("is-menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup navigasi" : "Buka navigasi",
      );
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
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window
      .matchMedia("(min-width: 701px)")
      .addEventListener("change", function (event) {
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
        const isActive = link.dataset.nav === id;
        link.classList.toggle("active", isActive);

        if (isActive) {
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
        if (window.scrollY <= 24) {
          setActiveSection(sections[0].id);
          return;
        }

        const visibleSection = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          })[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -65% 0px",
        threshold: 0,
      },
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY <= 24) setActiveSection(sections[0].id);
      },
      { passive: true },
    );
  }

  function setupMemberModal() {
    const modal = document.getElementById("member-modal");
    const panel = modal && modal.querySelector('[role="dialog"]');
    const name = document.getElementById("modal-name");
    const role = document.getElementById("modal-role");
    const occupation = document.getElementById("modal-occupation");
    const hobbies = document.getElementById("modal-hobbies");
    const funFact = document.getElementById("modal-fun-fact");
    const skills = document.getElementById("modal-skills");
    const closeButton = document.getElementById("modal-close");
    const members = document.querySelectorAll(".member");

    if (
      !modal ||
      !panel ||
      !name ||
      !role ||
      !occupation ||
      !hobbies ||
      !funFact ||
      !skills ||
      !closeButton ||
      !members.length
    )
      return;

    const profiles = {
      suheri: {
        occupation: "Pengusaha herbal",
        hobbies: [
          "Merawat tanaman",
          "Mempelajari bahan alami",
          "Berbagi cerita",
        ],
        funFact:
          "Ketertarikannya pada tanaman dapat menjadi awal dari banyak percakapan.",
        skills: ["Meracik herbal", "Berwirausaha", "Berkomunikasi"],
      },
      ikah: {
        occupation: "Guru di SMKN 5",
        hobbies: [
          "Membaca",
          "Menyiapkan bahan ajar",
          "Menghabiskan waktu bersama keluarga",
        ],
        funFact:
          "Kegiatan belajar tidak selalu harus berlangsung di dalam kelas.",
        skills: ["Mengajar", "Membimbing siswa", "Menyusun materi"],
      },
      saila: {
        occupation: "Guru SMP di Bogor",
        hobbies: ["Membaca sastra", "Menulis", "Berbagi bahan bacaan"],
        funFact:
          "Sebuah cerita bisa menjadi cara menyenangkan untuk membuka diskusi.",
        skills: ["Mengajar", "Menulis", "Komunikasi"],
      },
      syifa: {
        occupation: "Mahasiswa Bina Bangsa dan freelancer",
        hobbies: [
          "Mengeksplorasi desain",
          "Mencari inspirasi visual",
          "Belajar hal baru",
        ],
        funFact:
          "Ide desain bisa muncul dari hal sederhana yang ditemui sehari-hari.",
        skills: ["Desain UI", "Kreativitas", "Manajemen proyek"],
      },
      azzam: {
        occupation: "Mahasiswa Computer Science di Cakrawala University",
        hobbies: [
          "Belajar pemrograman",
          "Mencoba teknologi baru",
          "Mengerjakan proyek web",
        ],
        funFact:
          "Satu proyek kecil bisa menjadi tempat yang baik untuk belajar teknologi baru.",
        skills: ["Pemrograman", "Pengembangan web", "Pemecahan masalah"],
      },
    };

    let activeMember = null;
    let previousBodyOverflow = "";
    let closeTimer = 0;

    function renderList(container, items, className) {
      container.replaceChildren();
      items.forEach(function (item) {
        const element = document.createElement(className ? "span" : "li");
        if (className) element.className = className;
        element.textContent = item;
        container.append(element);
      });
    }

    function openModal(member) {
      if (!modal.hidden) return;

      window.clearTimeout(closeTimer);
      activeMember = member;
      name.textContent = member.querySelector("h3").textContent.trim();
      role.textContent = member.querySelector(".role").textContent.trim();
      const profile = profiles[member.dataset.member];
      if (!profile) return;

      occupation.textContent = profile.occupation;
      hobbies.replaceChildren();
      profile.hobbies.forEach(function (hobby) {
        const item = document.createElement("li");
        item.textContent = hobby;
        hobbies.append(item);
      });
      funFact.textContent = profile.funFact;
      renderList(skills, profile.skills, "skill-tag");

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      void modal.offsetWidth;
      modal.classList.add("is-open");
      closeButton.focus();
    }

    function closeModal() {
      if (modal.hidden || !modal.classList.contains("is-open")) return;

      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = previousBodyOverflow;
      closeTimer = window.setTimeout(function () {
        modal.hidden = true;
        if (activeMember) activeMember.focus();
      }, 220);
    }

    members.forEach(function (member) {
      member.addEventListener("click", function () {
        openModal(member);
      });

      member.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openModal(member);
      });
    });

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = panel.querySelectorAll(
        "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      );
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function init() {
    setupLoadingScreen();
    setupImageFallbacks();
    setupMobileNavigation();
    setupActiveNavigation();
    setupMemberModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
