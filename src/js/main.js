(function () {
  const config = window.APP_CONFIG || {};

  function setSourceField() {
    const sourceField = document.getElementById("source");
    if (sourceField) {
      sourceField.value = window.location.href;
    }
  }

  function updateWorkshopDate() {
    const dateEl1 = document.getElementById("workshop-date-value");
    const dateEl2 = document.querySelector(".next-box .v strong");
    const dateEl3 = document.getElementById("register-date");
    const priceEl = document.getElementById("workshop-price");
    const registerPriceEl = document.getElementById("register-price");
    if (dateEl1) {
      dateEl1.textContent = config.workshopDateText + ", מודיעין";
    }
    if (dateEl2) {
      dateEl2.textContent = config.workshopDateText;
    }
    if (dateEl3) {
      dateEl3.textContent = config.workshopDateText;
    }
    if (priceEl && registerPriceEl) {
      registerPriceEl.textContent = priceEl.textContent.trim();
    }
  }

  function initDrawer() {
    const openBtn = document.getElementById("openMenu");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("overlay");

    if (!openBtn || !drawer || !overlay) {
      return;
    }

    function lockScroll(lock) {
      document.body.style.overflow = lock ? "hidden" : "";
    }

    function setExpanded(expanded) {
      openBtn.setAttribute("aria-expanded", String(expanded));
      drawer.setAttribute("aria-hidden", String(!expanded));
    }

    function openDrawer() {
      drawer.classList.add("open");
      setExpanded(true);
      lockScroll(true);
    }

    function closeDrawer() {
      drawer.classList.remove("open");
      setExpanded(false);
      lockScroll(false);
    }

    openBtn.addEventListener("click", function (event) {
      event.preventDefault();
      if (drawer.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    });

    document.querySelectorAll(".menu-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        const id = link.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (!el) {
          return;
        }

        event.preventDefault();
        closeDrawer();
        setTimeout(function () {
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 70,
            behavior: "smooth"
          });
        }, 150);
      });
    });

    document.querySelectorAll('a[href^="#"]:not(.menu-link)').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        const id = this.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (!el) {
          return;
        }

        event.preventDefault();
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 70,
          behavior: "smooth"
        });
      });
    });
  }

  function updateWhatsappLinks() {
    const workshopTitle = document.querySelector(".hero h1")?.textContent.trim() || "";
    const message = 'היי שירן, יש לי שאלה קצרה לגבי הסדנה "' + workshopTitle + '" :)';
    const url = "https://wa.me/" + config.whatsappPhone + "?text=" + encodeURIComponent(message);

    ["whatsapp-hero", "whatsapp-register", "whatsapp-register-side", "whatsapp-footer", "whatsapp-trust"].forEach(function (id) {
      const link = document.getElementById(id);
      if (!link) {
        return;
      }

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  function ensureRegisterFormVisible() {
    const form = document.querySelector("#register form");
    if (!form) {
      return;
    }

    [form].concat(Array.from(form.querySelectorAll("*"))).forEach(function (node) {
      node.style.removeProperty("opacity");
      node.style.removeProperty("visibility");
      node.style.removeProperty("transform");
    });
  }

  function splitIntoWords(element) {
    if (!element || element.dataset.wordsSplit === "true") {
      return [];
    }

    const text = (element.textContent || "").trim();
    if (!text) {
      return [];
    }

    const tokens = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    const words = [];

    tokens.forEach(function (token) {
      if (!token.trim()) {
        fragment.appendChild(document.createTextNode(token));
        return;
      }

      const span = document.createElement("span");
      span.className = "split-word";
      span.textContent = token;
      fragment.appendChild(span);
      words.push(span);
    });

    element.textContent = "";
    element.appendChild(fragment);
    element.dataset.wordsSplit = "true";
    return words;
  }

  function buildJourneyController() {
    const steps = Array.from(document.querySelectorAll(".journey-step"));
    const activeTitle = document.getElementById("journeyActiveTitle");
    const activeText = document.getElementById("journeyActiveText");
    const section = document.getElementById("journey");
    if (!steps.length || !activeTitle || !activeText || !section) {
      return null;
    }

    function activateStep(step) {
      steps.forEach(function (item) {
        item.classList.toggle("is-active", item === step);
      });

      const title = step.querySelector("h3");
      const text = step.querySelector("p");
      if (title) {
        activeTitle.textContent = title.textContent.trim();
      }
      if (text) {
        activeText.textContent = text.textContent.trim();
      }
      section.dataset.journeyTone = step.dataset.journeyTone || "";
    }

    activateStep(steps[0]);

    return {
      steps: steps,
      section: section,
      activateStep: activateStep
    };
  }

  function initMotionFallback() {
    if (!document.body) {
      return false;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      document.body.classList.add("motion-reduced");
      return false;
    }

    const groups = [
      {
        selector: [
          ".hero .eyebrow",
          ".hero h1",
          ".hero .hero-lead",
          ".hero .hero-highlights span",
          ".hero .cta-row .btn",
          ".hero .hero-img"
        ].join(", "),
        immediate: true,
        step: 85
      },
      {
        selector: "main > section",
        step: 70
      },
      {
        selector: ".detail-grid .kv, section:not(#register) .compact-box .kv, .soft-panel:not(.register-support-panel), .video-item, #faq details, .social-links a, .footer-links a, .journey-step, .journey-stage, .compare-card",
        step: 55
      }
    ];

    const revealElements = [];
    groups.forEach(function (group) {
      const items = Array.from(document.querySelectorAll(group.selector));
      items.forEach(function (item, index) {
        if (item.classList.contains("reveal-on-scroll")) {
          return;
        }

        item.classList.add("reveal-on-scroll");
        item.style.setProperty("--reveal-delay", String(index * group.step) + "ms");
        if (group.immediate) {
          item.dataset.revealImmediate = "true";
        }
        revealElements.push(item);
      });
    });

    if (!revealElements.length) {
      return false;
    }

    document.body.classList.add("motion-ready");

    const heroItems = revealElements.filter(function (item) {
      return item.dataset.revealImmediate === "true";
    });

    window.requestAnimationFrame(function () {
      heroItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    });

    const observedItems = revealElements.filter(function (item) {
      return item.dataset.revealImmediate !== "true";
    });

    if (!("IntersectionObserver" in window)) {
      observedItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return true;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -12% 0px"
    });

    observedItems.forEach(function (item) {
      observer.observe(item);
    });

    return true;
  }

  function initJourneyFallback(journey) {
    if (!journey || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      const visibleEntry = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];

      if (!visibleEntry) {
        return;
      }

      journey.activateStep(visibleEntry.target);
    }, {
      threshold: [0.35, 0.6, 0.85],
      rootMargin: "-15% 0px -20% 0px"
    });

    journey.steps.forEach(function (step) {
      observer.observe(step);
    });
  }

  function initParallaxAndTiltFallback() {
    if (!document.body || document.body.classList.contains("motion-reduced")) {
      return;
    }

    const parallaxItems = Array.from(document.querySelectorAll("[data-parallax], .fabric-ribbon"));
    if (parallaxItems.length) {
      let ticking = false;

      function updateParallax() {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        parallaxItems.forEach(function (item) {
          const speed = Number(item.dataset.parallaxSpeed || (item.classList.contains("fabric-ribbon") ? 0.05 : 0.08));
          item.style.setProperty("--parallax-shift", String(scrollY * speed) + "px");
        });
        ticking = false;
      }

      window.addEventListener("scroll", function () {
        if (ticking) {
          return;
        }
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }, { passive: true });

      updateParallax();
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) {
      return;
    }

    document.querySelectorAll(".interactive-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * -7;
        const rotateX = (y - 0.5) * 7;
        card.style.setProperty("--tilt-x", rotateX.toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", rotateY.toFixed(2) + "deg");
      });

      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function initGsapExperience(journey) {
    if (!window.gsap || !window.ScrollTrigger || !document.body) {
      return false;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      document.body.classList.add("motion-reduced");
      return false;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add("gsap-motion");

    const hero = document.querySelector(".hero");
    const heroFigure = document.querySelector(".hero-figure");
    const heroImg = document.querySelector(".hero-img");
    const heroCaption = document.querySelector(".hero-caption");
    const eyebrow = document.querySelector(".hero .eyebrow");
    const heroLead = document.querySelector(".hero-lead");
    const stateNotice = document.getElementById("heroStateNotice");
    const ctas = gsap.utils.toArray(".hero .cta-row .btn");
    const chips = gsap.utils.toArray(".hero-highlights span");
    const orbits = gsap.utils.toArray(".hero-orbit");
    const ribbons = gsap.utils.toArray(".fabric-ribbon");
    const heroTitleWords = splitIntoWords(document.getElementById("mainTitle"));
    const sectionCards = gsap.utils.toArray("main > section");
    const secondaryReveals = gsap.utils.toArray(".detail-grid .kv, section:not(#register) .compact-box .kv, .soft-panel:not(.register-support-panel), .video-item, #faq details, .social-links a, .footer-links a, .compare-card");
    const journeyStage = document.querySelector(".journey-stage");
    const journeyRibbon = document.querySelector(".journey-ribbon");
    const journeyGlow = document.querySelector(".journey-glow");
    const registerSection = document.getElementById("register");
    const registerFormShell = document.querySelector(".register-form-shell");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    ensureRegisterFormVisible();

    gsap.set([eyebrow, heroLead, stateNotice, heroCaption], { autoAlpha: 0, y: 32 });
    gsap.set(ctas, { autoAlpha: 0, y: 34, scale: 0.96 });
    gsap.set(chips, { autoAlpha: 0, y: 26, scale: 0.92 });
    gsap.set(orbits, { autoAlpha: 0, y: 22, scale: 0.88 });
    gsap.set(heroFigure, { autoAlpha: 0, y: 36, scale: 0.95, rotateZ: -1.5 });
    gsap.set(heroImg, { scale: 1.08 });
    gsap.set(ribbons, { autoAlpha: 0, xPercent: function (_, target) { return target.classList.contains("fabric-ribbon-b") ? -12 : 12; }, rotate: function (_, target) { return target.classList.contains("fabric-ribbon-b") ? 8 : -8; } });
    gsap.set(heroTitleWords, { autoAlpha: 0, yPercent: 115, rotateZ: 1.5, filter: "blur(8px)" });

    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .to(ribbons, {
        autoAlpha: 0.9,
        xPercent: 0,
        rotate: 0,
        duration: 1.6,
        stagger: 0.08,
        ease: "sine.out"
      })
      .to(orbits, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.05,
        stagger: 0.1
      }, 0.15)
      .to(eyebrow, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8
      }, 0.22)
      .to(heroTitleWords, {
        autoAlpha: 1,
        yPercent: 0,
        rotateZ: 0,
        filter: "blur(0px)",
        duration: 0.95,
        stagger: 0.05
      }, 0.28)
      .to(heroLead, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9
      }, 0.5)
      .to(chips, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.08
      }, 0.72)
      .to(heroFigure, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        duration: 1.2,
        ease: "power3.out"
      }, 0.78)
      .to(heroImg, {
        scale: 1,
        duration: 1.4,
        ease: "power2.out"
      }, 0.82)
      .to([stateNotice, heroCaption], {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1
      }, 1.02)
      .to(ctas, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: 0.08
      }, 1.12);

    if (hero) {
      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top+=10%",
          scrub: 0.8
        }
      })
        .to(heroFigure, { yPercent: isMobile ? -2 : -6, scale: 0.96, ease: "none" }, 0)
        .to(heroImg, { scale: 1.05, ease: "none" }, 0)
        .to(orbits, { yPercent: function (index) { return index === 1 ? -10 : 10; }, xPercent: function (index) { return index === 1 ? -5 : 5; }, ease: "none" }, 0)
        .to(ribbons, { yPercent: function (index) { return index === 1 ? -12 : 10; }, rotation: function (index) { return index === 1 ? 4 : -4; }, ease: "none" }, 0)
        .to(".hero-highlights", { yPercent: -6, autoAlpha: 0.75, ease: "none" }, 0)
        .to(".hero .cta-row", { yPercent: -4, ease: "none" }, 0);
    }

    ribbons.forEach(function (ribbon, index) {
      gsap.to(ribbon, {
        xPercent: index === 1 ? -8 : 8,
        yPercent: index === 2 ? -10 : 10,
        rotation: index === 1 ? -3 : 3,
        duration: 5 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    sectionCards.forEach(function (section) {
      if (section.id === "journey") {
        return;
      }
      gsap.from(section, {
        autoAlpha: 0,
        y: 42,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%"
        }
      });
    });

    secondaryReveals.forEach(function (item, index) {
      gsap.from(item, {
        autoAlpha: 0,
        y: 24,
        scale: 0.98,
        duration: 0.72,
        delay: (index % 3) * 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%"
        }
      });
    });

    if (journey && journey.steps.length) {
      journey.steps.forEach(function (step) {
        ScrollTrigger.create({
          trigger: step,
          start: isMobile ? "top 70%" : "top center",
          end: isMobile ? "bottom 42%" : "bottom center",
          onEnter: function () {
            journey.activateStep(step);
            if (journeyStage) {
              gsap.to(journeyStage, { scale: 1.01, duration: 0.45, ease: "power2.out", yoyo: true, repeat: 1 });
            }
            if (journeyRibbon) {
              gsap.to(journeyRibbon, { rotate: "+=5", duration: 0.55, ease: "sine.out", yoyo: true, repeat: 1 });
            }
            if (journeyGlow) {
              gsap.fromTo(journeyGlow, { autoAlpha: 0.35 }, { autoAlpha: 0.95, duration: 0.45, yoyo: true, repeat: 1, ease: "sine.out" });
            }
          },
          onEnterBack: function () {
            journey.activateStep(step);
          }
        });
      });

      if (!isMobile && journeyStage) {
        gsap.timeline({
          scrollTrigger: {
            trigger: "#journey",
            start: "top 70%",
            end: "bottom bottom",
            scrub: 0.8
          }
        })
          .to(journeyRibbon, { yPercent: -8, rotation: 7, ease: "none" }, 0)
          .to(journeyGlow, { yPercent: 12, scale: 1.08, ease: "none" }, 0)
          .to(journeyStage, { yPercent: -3, ease: "none" }, 0);
      }
    }

    if (registerSection) {
      gsap.fromTo(registerSection, {
        boxShadow: "0 14px 34px rgba(78,54,43,.08)"
      }, {
        boxShadow: "0 38px 94px rgba(78,54,43,.18)",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: registerSection,
          start: "top 82%"
        }
      });

      if (registerFormShell) {
        ScrollTrigger.create({
          trigger: registerSection,
          start: "top 82%",
          onEnter: function () {
            gsap.fromTo(registerFormShell, {
              y: 18,
              rotateX: -8,
              scale: 0.985,
              transformPerspective: 1400,
              transformOrigin: "top center"
            }, {
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              clearProps: "transform"
            });
          },
          onEnterBack: function () {
            gsap.to(registerFormShell, {
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
              clearProps: "transform"
            });
          }
        });
      }
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (finePointer.matches) {
      document.querySelectorAll(".interactive-card").forEach(function (card) {
        card.addEventListener("pointermove", function (event) {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          const rotateY = (x - 0.5) * -7;
          const rotateX = (y - 0.5) * 7;
          card.style.setProperty("--tilt-x", rotateX.toFixed(2) + "deg");
          card.style.setProperty("--tilt-y", rotateY.toFixed(2) + "deg");
        });

        card.addEventListener("pointerleave", function () {
          gsap.to(card, {
            "--tilt-x": "0deg",
            "--tilt-y": "0deg",
            duration: 0.45,
            ease: "power2.out"
          });
        });
      });
    }

    return true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    setSourceField();
    updateWorkshopDate();
    initDrawer();
    updateWhatsappLinks();
    ensureRegisterFormVisible();

    const journey = buildJourneyController();
    if (!initGsapExperience(journey)) {
      initMotionFallback();
      initJourneyFallback(journey);
      initParallaxAndTiltFallback();
    }
  });
})();
