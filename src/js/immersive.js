(function () {
  const runtime = {
    pointerX: 0,
    pointerY: 0,
    pointerActive: false
  };

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
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    document.querySelectorAll(".magnetic").forEach(function (node) {
      node.addEventListener("pointermove", function (event) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.transform = "translate(" + (x * 0.055).toFixed(2) + "px," + (y * 0.055).toFixed(2) + "px)";
        node.style.boxShadow = "0 28px 48px rgba(54,34,29,.18)";
      });
      node.addEventListener("pointerleave", function () {
        node.style.transform = "";
        node.style.boxShadow = "";
      });
    });
  }

  function initTiltCards() {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    document.querySelectorAll(".tilt-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateY = px * -10;
        const rotateX = py * 8;
        card.style.transform = "perspective(1400px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-4px)";
        card.classList.add("tilt-active");
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
        card.classList.remove("tilt-active");
      });
    });
  }

  function initCursorAura() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) {
      return;
    }

    const aura = document.getElementById("cursorAura");
    const dot = document.getElementById("cursorDot");
    if (!aura || !dot) {
      return;
    }

    let auraX = window.innerWidth / 2;
    let auraY = window.innerHeight / 2;
    let dotX = auraX;
    let dotY = auraY;
    let mouseX = auraX;
    let mouseY = auraY;

    document.body.classList.add("cursor-active");

    function tick() {
      auraX += (mouseX - auraX) * 0.18;
      auraY += (mouseY - auraY) * 0.18;
      dotX += (mouseX - dotX) * 0.34;
      dotY += (mouseY - dotY) * 0.34;
      aura.style.transform = "translate3d(" + auraX.toFixed(2) + "px," + auraY.toFixed(2) + "px,0)";
      dot.style.transform = "translate3d(" + dotX.toFixed(2) + "px," + dotY.toFixed(2) + "px,0)";
      requestAnimationFrame(tick);
    }

    document.addEventListener("pointermove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      runtime.pointerX = event.clientX / window.innerWidth * 2 - 1;
      runtime.pointerY = event.clientY / window.innerHeight * 2 - 1;
      runtime.pointerActive = true;
      document.body.classList.add("cursor-visible");
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      runtime.pointerActive = false;
      document.body.classList.remove("cursor-visible", "cursor-hover", "cursor-cta");
    });

    document.querySelectorAll("a, button, input, textarea, summary, .magnetic, .tilt-card").forEach(function (node) {
      node.addEventListener("pointerenter", function () {
        document.body.classList.add("cursor-hover");
        document.body.classList.toggle("cursor-cta", node.classList.contains("btn") || node.classList.contains("trust-action"));
      });
      node.addEventListener("pointerleave", function () {
        document.body.classList.remove("cursor-hover", "cursor-cta");
      });
    });

    requestAnimationFrame(tick);
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
    const shell = document.getElementById("compareSliderShell");
    const beforeLabel = document.getElementById("compareBeforeLabel");
    const afterLabel = document.getElementById("compareAfterLabel");
    if (!input || !front || !divider || !shell) {
      return;
    }

    function update() {
      const value = Number(input.value);
      const right = 100 - value;
      front.style.clipPath = "inset(0 " + right + "% 0 0)";
      divider.style.right = right + "%";
      if (beforeLabel) {
        beforeLabel.style.transform = "translateX(" + (Math.max(0, (50 - value) * 0.3)).toFixed(2) + "px)";
        beforeLabel.style.opacity = value > 68 ? "0.55" : "1";
      }
      if (afterLabel) {
        afterLabel.style.transform = "translateX(" + (Math.min(0, (50 - value) * 0.3)).toFixed(2) + "px)";
        afterLabel.style.opacity = value < 32 ? "0.55" : "1";
      }
      shell.style.boxShadow = "0 36px 86px rgba(54,34,29,.18)";
    }

    update();
    input.addEventListener("input", update);
    input.addEventListener("change", update);
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
    const progressMarker = document.getElementById("journeyProgressMarker");

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
      if (progressMarker) {
        const stepsWrap = step.parentElement;
        const top = step.offsetTop - (stepsWrap ? stepsWrap.scrollTop : 0);
        progressMarker.style.transform = "translateY(" + Math.max(0, top).toFixed(2) + "px)";
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
    window.IMMERSIVE_POINTER = runtime;
    window.lenis = initLenis();
    markRevealItems();
    initCursorAura();
    initMagneticButtons();
    initTiltCards();
    initDepthParallax();
    initCompareSlider();
    initGsapMotion();
    initThreeFabric();
  });
})();
