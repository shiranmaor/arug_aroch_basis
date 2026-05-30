(function () {
  const config = window.APP_CONFIG || {};

  function setSourceField() {
    const sourceField = document.getElementById("source");
    if (sourceField) {
      sourceField.value = window.location.href;
    }
  }

  function updateWorkshopDate() {
    const dateText = (config.workshopDateText || "").trim();
    const dateEl1 = document.getElementById("workshop-date-value");
    const dateEl2 = document.querySelector("#workshop-slot strong");
    const dateEl3 = document.getElementById("register-date");
    const priceEl = document.getElementById("workshop-price");
    const registerPriceEl = document.getElementById("register-price");

    if (dateEl1) {
      dateEl1.textContent = dateText + ", מודיעין";
    }
    if (dateEl2) {
      dateEl2.textContent = dateText;
    }
    if (dateEl3) {
      dateEl3.textContent = dateText;
    }
    if (priceEl && registerPriceEl) {
      registerPriceEl.textContent = priceEl.textContent.trim();
    }
  }

  function updateWhatsappLinks() {
    const workshopTitle = document.querySelector(".hero-copy h1")?.textContent.trim() || "";
    const message = 'היי שירן, יש לי שאלה קצרה לגבי הסדנה "' + workshopTitle + '" :)';
    const url = "https://wa.me/" + config.whatsappPhone + "?text=" + encodeURIComponent(message);

    [
      "whatsapp-hero",
      "whatsapp-register",
      "whatsapp-register-side",
      "whatsapp-footer",
      "whatsapp-trust"
    ].forEach(function (id) {
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
    const form = document.getElementById("leadForm");
    if (!form) {
      return;
    }

    [form].concat(Array.from(form.querySelectorAll("*"))).forEach(function (node) {
      node.style.removeProperty("opacity");
      node.style.removeProperty("visibility");
      node.style.removeProperty("transform");
      node.style.removeProperty("filter");
    });
  }

  function initAnchors() {
    const topbar = document.querySelector(".topbar");
    const offset = function () {
      return (topbar?.offsetHeight || 0) + 28;
    };

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        const targetId = anchor.getAttribute("href")?.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) {
          return;
        }

        event.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset(),
          behavior: "smooth"
        });
      });
    });
  }

  function initJsState() {
    document.body.classList.add("has-js");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("motion-reduced");
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    initJsState();
    setSourceField();
    updateWorkshopDate();
    updateWhatsappLinks();
    ensureRegisterFormVisible();
    initAnchors();
  });
})();
