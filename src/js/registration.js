(function () {
  const config = window.APP_CONFIG || {};
  const workshopCapacity = Number(config.workshopCapacity) || 5;
  let forceClose = config.forceClose === true;

  (function syncForceCloseFromUrl() {
    try {
      const value = new URLSearchParams(location.search).get("closed");
      if (value == null) {
        return;
      }

      const normalized = String(value).toLowerCase();
      if (["1", "true", "yes", "on"].includes(normalized)) {
        forceClose = true;
      }
      if (["0", "false", "no", "off"].includes(normalized)) {
        forceClose = false;
      }
    } catch (error) {
      console.warn("closed param parse failed", error);
    }
  })();

  function getWorkshopDateText() {
    return (config.workshopDateText || "").trim();
  }

  function buildPageId() {
    const baseId = "arug_aroch_basis";
    const raw = getWorkshopDateText();
    if (!raw) {
      return baseId;
    }

    const stripNikud = function (value) {
      return value.replace(/[\u0591-\u05C7]/g, "");
    };
    const normalizeHeb = function (value) {
      return stripNikud(value).replace(/[^\u0590-\u05FF0-9\s,.\-–—/]/g, "");
    };
    const normToken = function (value) {
      return normalizeHeb(value).replace(/^[בלמהו]?/, "").trim();
    };

    const months = {
      "ינואר": 1,
      "פברואר": 2,
      "מרץ": 3,
      "מרס": 3,
      "אפריל": 4,
      "מאי": 5,
      "יוני": 6,
      "יולי": 7,
      "אוגוסט": 8,
      "ספטמבר": 9,
      "אוקטובר": 10,
      "נובמבר": 11,
      "דצמבר": 12
    };

    let day = null;
    let monthNum = null;
    const tokens = raw.split(/[\s,.\-–—/]+/);
    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      if (day == null) {
        const dayMatch = token.match(/^\d{1,2}$/);
        if (dayMatch) {
          const parsedDay = parseInt(dayMatch[0], 10);
          if (parsedDay >= 1 && parsedDay <= 31) {
            day = parsedDay;
          }
        }
      }
      if (monthNum == null) {
        const normalizedToken = normToken(token);
        if (months[normalizedToken]) {
          monthNum = months[normalizedToken];
        }
      }
      if (day != null && monthNum != null) {
        break;
      }
    }

    let year = null;
    const year4 = raw.match(/\b20\d{2}\b/);
    if (year4) {
      year = parseInt(year4[0], 10);
    } else {
      year = new Date().getFullYear();
    }

    if (day == null || monthNum == null || year == null) {
      return baseId;
    }

    const dd = String(day).padStart(2, "0");
    const mm = String(monthNum).padStart(2, "0");
    const yy = String(year).slice(-2);
    return baseId + "_" + dd + "_" + mm + "_" + yy;
  }

  function parseWorkshopDateFromText(text) {
    const stripNikud = function (value) {
      return value.replace(/[\u0591-\u05C7]/g, "");
    };
    const normalizeHeb = function (value) {
      return stripNikud(value).replace(/[^\u0590-\u05FF0-9\s,.\-–—/]/g, "");
    };
    const normToken = function (value) {
      return normalizeHeb(value).replace(/^[בלמהו]?/, "").trim();
    };

    const months = {
      "ינואר": 1,
      "פברואר": 2,
      "מרץ": 3,
      "מרס": 3,
      "אפריל": 4,
      "מאי": 5,
      "יוני": 6,
      "יולי": 7,
      "אוגוסט": 8,
      "ספטמבר": 9,
      "אוקטובר": 10,
      "נובמבר": 11,
      "דצמבר": 12
    };

    let day = null;
    let monthNum = null;
    let year = null;
    const tokens = text.split(/[\s,.\-–—/]+/);

    for (let index = 0; index < tokens.length; index += 1) {
      if (day == null) {
        const dayMatch = tokens[index].match(/^\d{1,2}$/);
        if (dayMatch) {
          const parsedDay = Number(dayMatch[0]);
          if (parsedDay >= 1 && parsedDay <= 31) {
            day = parsedDay;
          }
        }
      }
      if (monthNum == null) {
        const normalizedToken = normToken(tokens[index]);
        if (months[normalizedToken]) {
          monthNum = months[normalizedToken];
        }
      }
      if (day != null && monthNum != null) {
        break;
      }
    }

    const year4 = text.match(/\b20\d{2}\b/);
    if (year4) {
      year = Number(year4[0]);
    } else {
      year = new Date().getFullYear();
    }

    if (day != null && monthNum != null && year != null) {
      return new Date(year, monthNum - 1, day);
    }
    return null;
  }

  function isWorkshopPast() {
    const el = document.getElementById("workshop-date-value");
    if (!el) {
      return false;
    }

    const dt = parseWorkshopDateFromText((el.textContent || "").trim());
    if (!dt) {
      return false;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const workshopDay = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    today.setHours(0, 0, 0, 0);
    workshopDay.setHours(0, 0, 0, 0);

    return today.getTime() > workshopDay.getTime();
  }

  function isWorkshopFull(count) {
    return Number(count) >= workshopCapacity;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
    }
  }

  function setHidden(id, hidden) {
    const el = document.getElementById(id);
    if (el) {
      el.hidden = hidden;
    }
  }

  function setHtml(id, html, hidden) {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    el.innerHTML = html;
    el.hidden = hidden === true;
  }

  function setDateStrikeState(struck) {
    const dateValueEl = document.getElementById("workshop-date-value");
    const topDateEl = document.querySelector(".next-box .v strong");
    const registerDateEl = document.getElementById("register-date");
    [dateValueEl, topDateEl, registerDateEl].forEach(function (el) {
      if (el) {
        el.classList.toggle("line-through", struck);
      }
    });
  }

  function applyWorkshopState(state) {
    const heroCta = document.getElementById("heroPrimaryCta");
    const detailsCta = document.getElementById("detailsPrimaryCta");
    const registerSubmitButton = document.getElementById("registerSubmitButton");
    const whatsappRegister = document.getElementById("whatsapp-register");

    document.body.dataset.workshopState = state;

    if (state === "past") {
      setDateStrikeState(true);
      setText("heroPrimaryCta", "להצטרפות לרשימת המתנה");
      setText("detailsPrimaryCta", "לרשימת המתנה");
      setText("registerTitle", "השאירי פרטים למועד הבא");
      setText("registerIntro", "המועד שמופיע כאן כבר עבר. אפשר להשאיר פרטים לרשימת ההמתנה, ושירן תחזור אלייך כשהמועד הבא ייפתח.");
      setText("submitButtonText", "שלחי והצטרפי לרשימת ההמתנה");
      setText("registerNote", "לאחר השליחה לא תועברי לתשלום. שירן תחזור אלייך לגבי המועד הבא.");
      setText("whatsapp-register", "יש לי שאלה על המועד הבא");
      setText("heroStateNotice", "המועד שמופיע כאן כבר עבר. אפשר להצטרף לרשימת ההמתנה למועד הבא או לשאול את שירן בוואטסאפ.");
      setText("workshopStateNotice", "המועד הנוכחי כבר עבר. כרגע אפשר להצטרף לרשימת ההמתנה למועד הבא.");
      setHtml("registerStateCard", "<strong>אין כרגע מועד פתוח להרשמה.</strong><br>הפרטים שתשאירי כאן יישמרו לרשימת ההמתנה, ושירן תחזור אלייך לגבי המועד הבא.", false);
      setHidden("heroStateNotice", false);
      setHidden("workshopStateNotice", false);
      if (heroCta) {
        heroCta.setAttribute("aria-label", "מעבר לטופס ההצטרפות לרשימת ההמתנה");
      }
      if (detailsCta) {
        detailsCta.setAttribute("aria-label", "מעבר לטופס ההצטרפות לרשימת ההמתנה");
      }
      if (registerSubmitButton) {
        registerSubmitButton.setAttribute("aria-label", "שליחת הפרטים להצטרפות לרשימת ההמתנה");
      }
      if (whatsappRegister) {
        whatsappRegister.setAttribute("aria-label", "שאלי את שירן שאלה על המועד הבא");
      }
      return;
    }

    if (state === "full" || state === "closed") {
      const stateTitle = state === "full" ? "המועד הנוכחי מלא" : "ההרשמה סגורה כרגע";
      setDateStrikeState(true);
      setText("heroPrimaryCta", "להצטרפות לרשימת המתנה");
      setText("detailsPrimaryCta", "לרשימת המתנה");
      setText("registerTitle", "השאירי פרטים למועד הבא");
      setText("registerIntro", "כרגע לא נפתח מקום חדש במועד הזה. אפשר להשאיר פרטים לרשימת ההמתנה, ושירן תחזור אלייך אם יתפנה מקום או ייפתח מועד נוסף.");
      setText("submitButtonText", "שלחי והצטרפי לרשימת ההמתנה");
      setText("registerNote", "לאחר השליחה לא תועברי לתשלום. שירן תחזור אלייך אם יתפנה מקום או ייפתח מועד נוסף.");
      setText("whatsapp-register", "יש לי שאלה על ההמתנה");
      setText("heroStateNotice", stateTitle + ". אפשר להצטרף לרשימת ההמתנה או לשאול את שירן שאלה לפני שמחליטות.");
      setText("workshopStateNotice", stateTitle + ". כרגע אפשר להשאיר פרטים לרשימת ההמתנה.");
      setHtml("registerStateCard", "<strong>" + stateTitle + ".</strong><br>הפרטים שתשאירי כאן יישמרו לרשימת ההמתנה, ושירן תחזור אלייך אם יתפנה מקום או ייפתח מועד נוסף.", false);
      setHidden("heroStateNotice", false);
      setHidden("workshopStateNotice", false);
      if (heroCta) {
        heroCta.setAttribute("aria-label", "מעבר לטופס ההצטרפות לרשימת ההמתנה");
      }
      if (detailsCta) {
        detailsCta.setAttribute("aria-label", "מעבר לטופס ההצטרפות לרשימת ההמתנה");
      }
      if (registerSubmitButton) {
        registerSubmitButton.setAttribute("aria-label", "שליחת הפרטים להצטרפות לרשימת ההמתנה");
      }
      if (whatsappRegister) {
        whatsappRegister.setAttribute("aria-label", "שאלי את שירן שאלה על ההמתנה");
      }
      return;
    }

    setDateStrikeState(false);
    setText("heroPrimaryCta", "להרשמה ושמירת מקום");
    setText("detailsPrimaryCta", "להרשמה");
    setText("registerTitle", "אם זה מרגיש נכון, אפשר להירשם כאן");
    setText("registerIntro", "מלאי פרטים, ולאחר מכן תועברי אוטומטית לדף התשלום בפייבוקס. אם התאריך כבר עבר או שהמועד מלא, הפרטים שלך יישמרו לסדנה הבאה.");
    setText("submitButtonText", "שלחי והרשמי");
    setText("registerNote", "לאחר השליחה תועברי ישירות לתשלום בפייבוקס.");
    setText("whatsapp-register", "יש לי שאלה לפני הרשמה");
    setHidden("heroStateNotice", true);
    setHidden("workshopStateNotice", true);
    setHidden("registerStateCard", true);
    if (heroCta) {
      heroCta.setAttribute("aria-label", "מעבר לטופס ההרשמה");
    }
    if (detailsCta) {
      detailsCta.setAttribute("aria-label", "מעבר לטופס ההרשמה");
    }
    if (registerSubmitButton) {
      registerSubmitButton.setAttribute("aria-label", "שליחת טופס ההרשמה");
    }
    if (whatsappRegister) {
      whatsappRegister.setAttribute("aria-label", "שאלי את שירן שאלה לפני הרשמה");
    }
  }

  function showMaskText(text, bodyText) {
    const mask = document.getElementById("successMask");
    if (!mask) {
      return;
    }

    const box = mask.querySelector(".success-box");
    if (!box) {
      return;
    }

    let msgEl = box.querySelector("#successMsg");
    let bodyEl = box.querySelector("#successBody");
    if (!msgEl || !bodyEl) {
      box.innerHTML = '\n        <div id="successMsg" style="font-weight:800;color:var(--tz-800);font-size:18px;margin-bottom:10px"></div>\n        <p id="successBody" style="margin:0 0 14px;color:var(--ink);line-height:1.5"></p>\n        <div class="spinner" aria-hidden="true"></div>\n      ';
      msgEl = box.querySelector("#successMsg");
      bodyEl = box.querySelector("#successBody");
    }

    msgEl.textContent = text;
    bodyEl.textContent = bodyText || "רגע קטן ואני מעבירה אותך לתשלום...";
    mask.classList.add("show");
    mask.setAttribute("aria-hidden", "false");
  }

  function showThanks() {
    showMaskText("תודה! מעבירה אותך לתשלום…", "רגע קטן ואני מעבירה אותך לתשלום בפייבוקס.");
  }

  function delayedPaybox() {
    setTimeout(function () {
      window.location.href = config.payboxUrl;
    }, 2000);
  }

  function getRegistrationCount(pageId) {
    return new Promise(function (resolve, reject) {
      const callbackName = "countCb_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
      const script = document.createElement("script");

      window[callbackName] = function (data) {
        try {
          resolve(Number((data && data.count) || 0));
        } finally {
          delete window[callbackName];
          script.remove();
        }
      };

      script.src = config.apiUrl + "?fn=count&page_id=" + encodeURIComponent(pageId) + "&callback=" + callbackName;
      script.onerror = function () {
        delete window[callbackName];
        reject(new Error("count load error"));
      };
      document.head.appendChild(script);
    });
  }

  function showPopup(html) {
    const mask = document.getElementById("successMask");
    if (!mask) {
      return;
    }

    const box = mask.querySelector(".success-box");
    if (!box) {
      return;
    }

    box.innerHTML = html;
    mask.classList.add("show");
    mask.setAttribute("aria-hidden", "false");

    const closeBtn = box.querySelector("#closePopup");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        mask.classList.remove("show");
        mask.setAttribute("aria-hidden", "true");
      });
    }
  }

  function showFullPopup() {
    showPopup('\n      <div style="font-weight:800;color:var(--tz-800);font-size:18px;margin-bottom:10px">\n        המועד הנוכחי מלא\n      </div>\n      <p style="margin:0 0 14px;color:var(--ink);line-height:1.5">\n        אפשר להשאיר פרטים לרשימת ההמתנה ואצור איתך קשר אם יתפנה מקום או ייפתח מועד נוסף :)\n      </p>\n      <button id="closePopup" class="btn btn-primary" style="margin-top:10px">\n        חזרה לדף\n      </button>\n    ');
  }

  function showClosedPopup() {
    showPopup('\n      <div style="font-weight:800;color:var(--tz-800);font-size:18px;margin-bottom:10px">\n        ההרשמה סגורה כרגע\n      </div>\n      <p style="margin:0 0 14px;color:var(--ink);line-height:1.5">\n        אפשר להשאיר פרטים לרשימת ההמתנה ואצור איתך קשר אם יתפנה מקום או ייפתח מועד נוסף :)\n      </p>\n      <button id="closePopup" class="btn btn-primary" style="margin-top:10px">\n        חזרה לדף\n      </button>\n    ');
  }

  function showPastPopup() {
    showPopup('\n    <div style="font-weight:800;color:var(--tz-800);font-size:18px;margin-bottom:10px">\n      המועד שמופיע בעמוד כבר עבר\n    </div>\n    <p style="margin:0 0 14px;color:var(--ink);line-height:1.5">\n      אפשר להשאיר פרטים לרשימת ההמתנה למועד הבא, או לשאול את שירן שאלה קצרה בוואטסאפ :)\n    </p>\n    <button id="closePopup" class="btn btn-primary" style="margin-top:10px">\n      חזרה לדף\n    </button>\n  ');
  }

  function showWaitinglistPopup(message) {
    showPopup('\n    <div style="font-weight:800;color:var(--tz-800);font-size:18px;margin-bottom:10px">\n      תודה! שמרתי את הפרטים שלך.\n    </div>\n    <p style="margin:0 0 14px;color:var(--ink);line-height:1.5">\n      ' + message + '\n    </p>\n    <button id="closePopup" class="btn btn-primary" style="margin-top:10px">\n      חזרה לדף\n    </button>\n  ');
  }

  function postJson(payload) {
    return fetch(config.apiUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  }

  function sendBeaconOrFetch(payload) {
    const textPayload = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([textPayload], { type: "text/plain;charset=utf-8" });
      navigator.sendBeacon(config.apiUrl, blob);
      return;
    }

    fetch(config.apiUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: textPayload
    }).catch(function () {});
  }

  const pageId = buildPageId();
  window.PAGE_ID = pageId;
  window.ADMIN_EDIT_STATE = {
    getForceClose: function () {
      return forceClose;
    },
    setForceClose: function (value) {
      forceClose = value === true;
      applyWorkshopState(forceClose ? "closed" : "open");
    }
  };

  window.addEventListener("DOMContentLoaded", async function () {
    try {
      if (isWorkshopPast()) {
        applyWorkshopState("past");
        showPastPopup();
        return;
      }

      if (forceClose) {
        applyWorkshopState("closed");
        showClosedPopup();
        return;
      }

      const count = await getRegistrationCount(pageId);
      if (isWorkshopFull(count)) {
        applyWorkshopState("full");
        showFullPopup();
      } else {
        applyWorkshopState("open");
      }
    } catch (error) {
      console.warn("count check failed", error);
      applyWorkshopState("open");
    }
  });

  window.addEventListener("DOMContentLoaded", function () {
    postJson({ type: "pageview", page_id: pageId }).catch(function () {});
  });

  (function initRegistration() {
    const form = document.getElementById("leadForm");
    if (!form) {
      return;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString();
      const phone = (formData.get("phone") || "").toString();
      const email = (formData.get("email") || "").toString();
      const region = (formData.get("region") || "").toString();
      const babyAge = (formData.get("baby_age") || "").toString();
      const carriers = (formData.get("carriers") || "").toString();
      const message = (formData.get("message") || "").toString();

      const waitingListPayload = {
        type: "waitinglist",
        page_id: pageId,
        name: name,
        phone: phone,
        email: email,
        message: message,
        region: region,
        baby_age: babyAge,
        carriers: carriers
      };

      try {
        if (isWorkshopPast()) {
          applyWorkshopState("past");
          showWaitinglistPopup("שירן תחזור אלייך כשייפתח מועד חדש :)");
          sendBeaconOrFetch(waitingListPayload);
          return;
        }

        if (forceClose) {
          applyWorkshopState("closed");
          showWaitinglistPopup("שירן תחזור אלייך אם יתפנה מקום או ייפתח מועד חדש :)");
          sendBeaconOrFetch(waitingListPayload);
          return;
        }

        showMaskText("בודקת זמינות…", "רגע קטן ואני בודקת אם נשאר מקום במועד הזה.");
        const count = await getRegistrationCount(pageId);

        if (isWorkshopFull(count)) {
          applyWorkshopState("full");
          showWaitinglistPopup("המועד הזה מלא כרגע. שירן תחזור אלייך אם יתפנה מקום או ייפתח מועד נוסף :)");
          await postJson(waitingListPayload);
          return;
        }

        applyWorkshopState("open");
        showThanks();
        delayedPaybox();

        await postJson({
          type: "registration",
          page_id: pageId,
          name: name,
          phone: phone,
          email: email,
          message: message,
          region: region,
          baby_age: babyAge,
          carriers: carriers
        });
      } catch (error) {
        console.error("count error", error);
        showThanks();
        delayedPaybox();
      }
    });
  })();
})();
