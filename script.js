document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const updateHeaderState = () => {
    const offset = window.scrollY || window.pageYOffset;
    if (!header) return;
    if (offset > 4) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 0;
    const offset = scrollPosition + headerHeight + 24;

    let activeId = null;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (offset >= sectionTop && offset < sectionBottom) {
        activeId = section.id;
        break;
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      if (id === activeId) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  };

  const handleScroll = () => {
    updateHeaderState();
    updateActiveNavLink();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Theme toggle: dark by default; the choice is remembered in localStorage.
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    if (toggle) {
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }
    if (themeColor) {
      themeColor.setAttribute("content", theme === "dark" ? "#101D32" : "#F5F3EE");
    }
  };

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("ae-theme", next);
      } catch (e) {}
    });
  }

  // Scroll reveals: content eases into place as it enters the viewport. Skipped
  // entirely for reduced motion or old browsers, so nothing is ever left hidden.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  // Containers first; anything inside an element that already reveals is skipped,
  // so nothing animates twice.
  const selectors = [
    ".service-list > *",
    ".principles > *",
    ".steps > *",
    ".about-layout > *",
    ".contact-layout > *",
    ".band .eyebrow, .band .section-title, .band .section-intro",
  ];

  const targets = [];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.closest(".reveal")) return;
      el.classList.add("reveal");
      targets.push(el);
    });
  });

  // Stagger siblings: each element waits a beat after the one before it.
  targets.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) =>
      c.classList.contains("reveal")
    );
    el.style.setProperty("--i", String(siblings.indexOf(el)));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
  root.classList.add("motion");
});

