/* =========================================================
   DIZZAH MEDIA
   GLOBAL JAVASCRIPT
   International Media House — Production Ready
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     1. MOBILE NAVIGATION
     ======================================================= */

  const mobileToggle =
    document.getElementById("mobileToggle") ||
    document.querySelector(".menu-btn") ||
    document.querySelector(".mobile-menu-btn");

  const navLinks =
    document.querySelector(".nav-links") || document.querySelector("#mainNav") || document.querySelector("nav");

  if (mobileToggle && navLinks) {

    mobileToggle.setAttribute("aria-expanded", "false");

    mobileToggle.addEventListener("click", () => {

      const isOpen =
        navLinks.classList.toggle("show") ||
        navLinks.classList.toggle("open") ||
        navLinks.classList.toggle("active");

      mobileToggle.setAttribute(
        "aria-expanded",
        String(Boolean(isOpen))
      );
    });

    navLinks.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("show");
        navLinks.classList.remove("open");
        navLinks.classList.remove("active");

        mobileToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =======================================================
     2. CURRENT YEAR
     ======================================================= */

  const yearElements =
    document.querySelectorAll("#year, .current-year");

  yearElements.forEach(element => {
    element.textContent =
      new Date().getFullYear();
  });


  /* =======================================================
     3. ACTIVE NAVIGATION
     ======================================================= */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

  const navigationLinks =
    document.querySelectorAll(".nav-links a");

  navigationLinks.forEach(link => {

    const href =
      link.getAttribute("href");

    if (!href) return;

    const cleanHref =
      href.split("#")[0]
        .split("?")[0]
        .split("/")
        .pop()
        .toLowerCase();

    if (
      cleanHref &&
      cleanHref === currentPage
    ) {
      link.classList.add("active");
      link.setAttribute(
        "aria-current",
        "page"
      );
    }

  });


  /* =======================================================
     4. BACK TO TOP
     ======================================================= */

  let backToTop =
    document.getElementById("backToTop");

  if (!backToTop) {

    backToTop =
      document.createElement("button");

    backToTop.id = "backToTop";
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute(
      "aria-label",
      "Rudi juu"
    );
    backToTop.setAttribute(
      "title",
      "Rudi juu"
    );

    backToTop.innerHTML = "↑";

    document.body.appendChild(backToTop);

  }

  const updateBackToTop = () => {

    if (window.scrollY > 450) {

      backToTop.style.display =
        "grid";

    } else {

      backToTop.style.display =
        "none";

    }

  };

  updateBackToTop();

  window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
  );

  backToTop.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  /* =======================================================
     5. HEADER SCROLL STATE
     ======================================================= */

  const header =
    document.querySelector(".site-header") || document.querySelector("header");

  const updateHeader =
    () => {

      if (!header) return;

      if (window.scrollY > 30) {

        header.classList.add("scrolled");

      } else {

        header.classList.remove("scrolled");

      }

    };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* =======================================================
     6. CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
     ======================================================= */

  document.addEventListener(
    "click",
    event => {

      if (
        !navLinks ||
        !mobileToggle
      ) {
        return;
      }

      const clickedInsideNav =
        navLinks.contains(event.target);

      const clickedToggle =
        mobileToggle.contains(event.target);

      if (
        !clickedInsideNav &&
        !clickedToggle
      ) {

        navLinks.classList.remove("show");
        navLinks.classList.remove("open");
        navLinks.classList.remove("active");

        mobileToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );


  /* =======================================================
     7. ESCAPE KEY — CLOSE MOBILE MENU
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      if (!navLinks || !mobileToggle) {
        return;
      }

      navLinks.classList.remove("show");
      navLinks.classList.remove("open");
      navLinks.classList.remove("active");

      mobileToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    }
  );


  /* =======================================================
     8. LAZY LOAD IMAGES
     ======================================================= */

  const images =
    document.querySelectorAll(
      "img[data-src]"
    );

  if ("IntersectionObserver" in window) {

    const imageObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            const image =
              entry.target;

            const source =
              image.getAttribute(
                "data-src"
              );

            if (source) {

              image.src = source;
              image.removeAttribute(
                "data-src"
              );

            }

            imageObserver.unobserve(
              image
            );

          });

        },
        {
          rootMargin: "150px"
        }
      );

    images.forEach(image => {
      imageObserver.observe(image);
    });

  } else {

    images.forEach(image => {

      const source =
        image.getAttribute(
          "data-src"
        );

      if (source) {
        image.src = source;
      }

    });

  }


  /* =======================================================
     9. EXTERNAL LINKS
     ======================================================= */

  const externalLinks =
    document.querySelectorAll(
      'a[href^="http"]'
    );

  externalLinks.forEach(link => {

    const sameHost =
      link.hostname ===
      window.location.hostname;

    if (!sameHost) {

      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );

    }

  });


  /* =======================================================
     10. SMOOTH ANCHOR NAVIGATION
     ======================================================= */

  const anchorLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  anchorLinks.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const headerHeight =
          header
            ? header.offsetHeight
            : 0;

        const targetPosition =
          target.getBoundingClientRect()
            .top +
          window.scrollY -
          headerHeight -
          15;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

      }
    );

  });


  /* =======================================================
     11. NEWSLETTER / SIMPLE FORMS
     ======================================================= */

  const newsletterForms =
    document.querySelectorAll(
      ".newsletter-form"
    );

  newsletterForms.forEach(form => {

    form.addEventListener(
      "submit",
      event => {

        const email =
          form.querySelector(
            'input[type="email"]'
          );

        if (!email) {
          return;
        }

        if (!email.value.trim()) {

          event.preventDefault();

          email.focus();

          return;

        }

      }
    );

  });


  /* =======================================================
     12. SEARCH INPUT — BASIC UX ONLY
     
     IMPORTANT:
     This does NOT replace Search.html's
     Supabase search system.
     ======================================================= */

  const searchInputs =
    document.querySelectorAll(
      'input[type="search"]'
    );

  searchInputs.forEach(input => {

    input.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          input.value = "";

        }

      }
    );

  });


  /* =======================================================
     13. IMAGE ERROR FALLBACK
     ======================================================= */

  const siteImages =
    document.querySelectorAll(
      "img"
    );

  siteImages.forEach(image => {

    image.addEventListener(
      "error",
      () => {

        if (
          image.dataset.fallbackApplied
        ) {
          return;
        }

        image.dataset.fallbackApplied =
          "true";

        image.src =
          "assets/news1.jpg";

      }
    );

  });


  /* =======================================================
     14. ACCESSIBLE DETAILS / FAQ
     ======================================================= */

  const faqItems =
    document.querySelectorAll(
      ".faq-item"
    );

  faqItems.forEach(item => {

    const heading =
      item.querySelector(
        "h3"
      );

    if (!heading) {
      return;
    }

    heading.setAttribute(
      "tabindex",
      "0"
    );

    heading.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          item.classList.toggle(
            "open"
          );

        }

      }
    );

  });


  /* =======================================================
     15. REDUCED MOTION SUPPORT
     ======================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  if (reducedMotion.matches) {

    document.documentElement
      .style
      .scrollBehavior = "auto";

  }


  /* =======================================================
     16. PAGE READY STATE
     ======================================================= */

  document.documentElement
    .classList
    .add("js-ready");


  /* =======================================================
     17. CONSOLE BRANDING
     ======================================================= */

  console.info(
    "%cDIZZAH MEDIA",
    "font-size:18px;font-weight:800;color:#7427c9;"
  );

  console.info(
    "Hakika Leo, Kesho kwa Ubora Zaidi."
  );

});
