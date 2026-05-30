(function () {
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initLenis() {
    if (prefersReducedMotion() || !window.Lenis) {
      return null;
    }

    const lenis = new window.Lenis({
      duration: 1.05,
      smoothWheel: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return lenis;
  }

  function markRevealItems() {
    document.querySelectorAll(".reveal").forEach(function (item) {
      item.classList.add("reveal-ready");
    });
  }

  function initMagneticButtons() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    document.querySelectorAll(".magnetic").forEach(function (node) {
      node.addEventListener("pointermove", function (event) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.transform = "translate(" + (x * 0.06).toFixed(2) + "px," + (y * 0.06).toFixed(2) + "px)";
      });
      node.addEventListener("pointerleave", function () {
        node.style.transform = "";
      });
    });
  }

  function initDepthParallax() {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const hero = document.querySelector(".hero-grid");
    const depthItems = Array.from(document.querySelectorAll("[data-depth]"));
    if (!hero || !depthItems.length) {
      return;
    }

    hero.addEventListener("pointermove", function (event) {
      const rect = hero.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      depthItems.forEach(function (item) {
        const depth = Number(item.dataset.depth) || 0;
        item.style.transform = "translate3d(" + (px * depth * 110).toFixed(2) + "px," + (py * depth * 110).toFixed(2) + "px,0)";
      });
    });

    hero.addEventListener("pointerleave", function () {
      depthItems.forEach(function (item) {
        item.style.transform = "";
      });
    });
  }

  function initCompareSlider() {
    const input = document.getElementById("compareRange");
    const front = document.getElementById("compareFront");
    const divider = document.getElementById("compareDivider");
    if (!input || !front || !divider) {
      return;
    }

    function update() {
      const value = Number(input.value);
      const right = 100 - value;
      front.style.clipPath = "inset(0 " + right + "% 0 0)";
      divider.style.right = right + "%";
    }

    update();
    input.addEventListener("input", update);
  }

  function initGsapMotion() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion()) {
      document.querySelectorAll(".reveal-ready").forEach(function (el) {
        el.classList.remove("reveal-ready");
      });
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (window.lenis && window.lenis.on) {
      window.lenis.on("scroll", ScrollTrigger.update);
    }

    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .from(".eyebrow", { y: 28, autoAlpha: 0, duration: 0.9 })
      .from("#mainTitle", { y: 56, autoAlpha: 0, filter: "blur(12px)", duration: 1.2 }, "-=0.55")
      .from(".hero-lead", { y: 22, autoAlpha: 0, duration: 0.8 }, "-=0.85")
      .from(".hero-highlights span", { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.55 }, "-=0.55")
      .from(".cta-row .btn", { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, "-=0.4")
      .from(".state-pill", { y: 18, autoAlpha: 0, duration: 0.55 }, "-=0.32")
      .from(".card-photo", { y: 36, rotate: -9, scale: 0.94, autoAlpha: 0, duration: 1.15 }, "-=1.3")
      .from(".card-mini-top, .card-mini-bottom", { y: 26, scale: 0.94, autoAlpha: 0, stagger: 0.12, duration: 0.75 }, "-=0.95")
      .from(".hero-dock", { y: 34, autoAlpha: 0, duration: 0.8 }, "-=0.35");

    gsap.utils.toArray(".reveal-ready").forEach(function (el) {
      gsap.fromTo(el, {
        y: 34,
        autoAlpha: 0
      }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%"
        }
      });
    });

    gsap.to(".fabric-ribbon-a", {
      xPercent: 14,
      rotation: -10,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.7
      }
    });

    gsap.to(".fabric-ribbon-b", {
      xPercent: -12,
      rotation: 15,
      ease: "none",
      scrollTrigger: {
        trigger: "#journey",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8
      }
    });

    gsap.to(".card-photo", {
      yPercent: -8,
      rotation: -3,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    const journeySteps = gsap.utils.toArray(".journey-step");
    const activeTitle = document.getElementById("journeyActiveTitle");
    const activeText = document.getElementById("journeyActiveText");
    const journeySection = document.getElementById("journey");
    const journeyRibbon = document.querySelector(".journey-ribbon-main");

    function activateStep(step) {
      journeySteps.forEach(function (item) {
        item.classList.toggle("is-active", item === step);
      });
      if (activeTitle) {
        activeTitle.textContent = step.querySelector("h3")?.textContent || "";
      }
      if (activeText) {
        activeText.textContent = step.querySelector("p")?.textContent || "";
      }
      if (journeySection) {
        journeySection.dataset.journeyTone = step.dataset.journeyTone || "";
      }
    }

    if (journeySteps.length) {
      activateStep(journeySteps[0]);

      ScrollTrigger.create({
        trigger: ".journey-track",
        start: "top top+=120",
        end: "bottom bottom",
        pin: ".journey-pin",
        pinSpacing: false
      });

      journeySteps.forEach(function (step, index) {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onEnter: function () {
            activateStep(step);
            if (journeyRibbon) {
              gsap.fromTo(journeyRibbon, { rotate: -18 }, { rotate: -12 + index * 4, duration: 0.6, ease: "power2.out" });
            }
          },
          onEnterBack: function () {
            activateStep(step);
          }
        });
      });
    }

    gsap.fromTo(".register-form-shell", {
      y: 28,
      scale: 0.98
    }, {
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#register",
        start: "top 78%"
      }
    });
  }

  function initThreeFabric() {
    if (prefersReducedMotion() || !window.createFabricScene) {
      document.documentElement.classList.add("fabric-fallback");
      return;
    }

    const canvas = document.getElementById("fabricCanvas");
    if (!canvas) {
      return;
    }

    try {
      window.__fabricSceneCleanup = window.createFabricScene(canvas);
    } catch (error) {
      console.warn("fabric scene init failed", error);
      document.documentElement.classList.add("fabric-fallback");
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    window.lenis = initLenis();
    markRevealItems();
    initMagneticButtons();
    initDepthParallax();
    initCompareSlider();
    initGsapMotion();
    initThreeFabric();
  });
})();
