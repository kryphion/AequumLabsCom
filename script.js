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
});

