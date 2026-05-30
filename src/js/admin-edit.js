(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("edit") !== "1") {
    return;
  }

  function getInitialBranchValue() {
    const queryBranch = (params.get("branch") || "").trim();
    if (queryBranch) {
      return queryBranch;
    }

    try {
      const savedBranch = (window.localStorage.getItem("adminEditBranch") || "").trim();
      if (savedBranch) {
        return savedBranch;
      }
    } catch (error) {}

    return "main";
  }

  const titleEl = document.querySelector(".hero h1");
  if (!titleEl) {
    return;
  }

  titleEl.contentEditable = "true";
  titleEl.style.outline = "2px dashed #888";
  titleEl.style.outlineOffset = "4px";

  [
    "workshop-slot",
    "workshop-price",
    "workshop-duration",
    "workshop-group-size",
    "workshop-date-value"
  ].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    el.contentEditable = "true";
    el.style.outline = "2px dashed #888";
    el.style.outlineOffset = "4px";
  });

  const panel = document.createElement("div");
  panel.id = "__adminPanel";
  panel.style.position = "fixed";
  panel.style.bottom = "20px";
  panel.style.left = "20px";
  panel.style.zIndex = "9999";
  panel.style.background = "#fff";
  panel.style.padding = "10px 14px";
  panel.style.border = "1px solid #ccc";
  panel.style.borderRadius = "10px";
  panel.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
  panel.innerHTML = '\n    <label style="display:block;margin-bottom:8px">\n      GitHub Token:\n      <input id="ghToken" type="password" placeholder="ghp_..." style="width:250px">\n    </label>\n    <label style="display:block;margin-bottom:8px">\n      Repo path (user/repo):\n      <input id="ghRepo" placeholder="username/repo-name" style="width:250px">\n    </label>\n    <label style="display:block;margin-bottom:6px">\n      Branch:\n      <input id="ghBranch" value="' + getInitialBranchValue().replace(/"/g, "&quot;") + '" style="width:180px">\n    </label>\n    <div style="margin:0 0 10px;color:#6a4b3e;font-size:12px;line-height:1.5;max-width:250px">\n      השמירה כותבת ישירות לענף שמופיע כאן. בדקי היטב שאת שומרת לענף הנכון לפני העלאה ל-GitHub.\n    </div>\n    <label style="display:block;margin-bottom:8px">\n      <input type="checkbox" id="forceCloseToggle">\n      סגור הרשמה ידנית (FORCE_CLOSE)\n    </label>\n    <button id="saveBtn" style="background:#9b614f;color:white;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer">\n      שמור שינויים\n    </button>\n    <div id="status" style="margin-top:6px;color:#333;font-size:13px"></div>\n  ';
  document.body.appendChild(panel);

  const branchInput = document.getElementById("ghBranch");
  if (branchInput) {
    branchInput.addEventListener("input", function () {
      try {
        window.localStorage.setItem("adminEditBranch", branchInput.value.trim());
      } catch (error) {}
    });
  }

  const forceToggle = document.getElementById("forceCloseToggle");
  const adminState = window.ADMIN_EDIT_STATE;
  if (forceToggle && adminState) {
    forceToggle.checked = adminState.getForceClose() === true;
    forceToggle.addEventListener("change", function () {
      adminState.setForceClose(forceToggle.checked);
    });
  }

  async function fetchGitHubFile(token, repo, branch, path) {
    const url = "https://api.github.com/repos/" + repo + "/contents/" + path;
    const response = await fetch(url + "?ref=" + branch, {
      headers: { Authorization: "token " + token }
    });
    const json = await response.json();
    if (!json.sha) {
      throw new Error("לא התקבל SHA מהשרת עבור " + path);
    }
    return { url: url, sha: json.sha };
  }

  async function updateGitHubFile(token, repoFile, branch, message, content) {
    const base64 = btoa(unescape(encodeURIComponent(content)));
    const response = await fetch(repoFile.url, {
      method: "PUT",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        content: base64,
        branch: branch,
        sha: repoFile.sha
      })
    });
    const json = await response.json();
    if (!json.commit) {
      throw json;
    }
    return json;
  }

  function cleanEditableNode(el) {
    if (!el) {
      return;
    }
    el.removeAttribute("contenteditable");
    el.style.outline = "";
    el.style.outlineOffset = "";
  }

  function buildCleanHtmlDocument() {
    const doc = document.documentElement.cloneNode(true);
    const panelClone = doc.querySelector("#__adminPanel");
    if (panelClone && panelClone.parentNode) {
      panelClone.parentNode.removeChild(panelClone);
    }

    cleanEditableNode(doc.querySelector("#mainTitle"));
    cleanEditableNode(doc.querySelector("#workshop-slot"));
    cleanEditableNode(doc.querySelector("#workshop-price"));
    cleanEditableNode(doc.querySelector("#workshop-duration"));
    cleanEditableNode(doc.querySelector("#workshop-group-size"));
    cleanEditableNode(doc.querySelector("#workshop-date-value"));

    [
      'script[src^="chrome-extension://"]',
      'link[href^="chrome-extension://"]',
      "link#dark-mode-custom-link",
      "link#dark-mode-general-link",
      "style#dark-mode-custom-style",
      "style#dark-mode-native-style",
      "style#dark-mode-native-sheet"
    ].forEach(function (selector) {
      doc.querySelectorAll(selector).forEach(function (node) {
        node.remove();
      });
    });

    doc.querySelectorAll("*").forEach(function (el) {
      ["bis_skin_checked", "bis_register"].forEach(function (attribute) {
        if (el.hasAttribute(attribute)) {
          el.removeAttribute(attribute);
        }
      });

      Array.from(el.attributes).forEach(function (attribute) {
        if (attribute.name.startsWith("__processed_")) {
          el.removeAttribute(attribute.name);
        }
      });
    });

    doc.querySelectorAll(".line-through").forEach(function (el) {
      el.classList.remove("line-through");
    });

    const sourceInput = doc.querySelector("#source");
    if (sourceInput) {
      sourceInput.removeAttribute("value");
    }

    return "<!DOCTYPE html>\n" + doc.outerHTML;
  }

  function updateConfigJsContent(content, isClosed) {
    if (!/forceClose:\s*(true|false)/.test(content)) {
      throw new Error("לא נמצא forceClose בתוך config.js");
    }
    return content.replace(/forceClose:\s*(true|false)/, "forceClose: " + (isClosed ? "true" : "false"));
  }

  async function saveToGitHub() {
    const token = document.getElementById("ghToken").value.trim();
    const repo = document.getElementById("ghRepo").value.trim();
    const branch = document.getElementById("ghBranch").value.trim();
    const status = document.getElementById("status");
    const isClosed = document.getElementById("forceCloseToggle")?.checked === true;

    if (!token || !repo) {
      alert("חייבים למלא Token ו-repo (username/repo)");
      return;
    }

    status.textContent = "📤 שולח שינויים ל-GitHub...";

    try {
      const indexFile = await fetchGitHubFile(token, repo, branch, "index.html");
      const configFile = await fetchGitHubFile(token, repo, branch, "src/js/config.js");
      const updatedHtml = buildCleanHtmlDocument();
      const configResponse = await fetch(configFile.url + "?ref=" + branch, {
        headers: { Authorization: "token " + token }
      });
      const configJson = await configResponse.json();
      const decodedConfig = decodeURIComponent(escape(atob(configJson.content.replace(/\n/g, ""))));
      const updatedConfig = updateConfigJsContent(decodedConfig, isClosed);

      const indexResult = await updateGitHubFile(token, indexFile, branch, "עדכון תוכן דף (עריכה דרך האתר)", updatedHtml);
      await updateGitHubFile(token, configFile, branch, "עדכון FORCE_CLOSE (עריכה דרך האתר)", updatedConfig);

      status.textContent = "✅ נשמר בהצלחה! commit " + indexResult.commit.sha.substring(0, 7);
    } catch (error) {
      console.error(error);
      status.textContent = "❌ שגיאה: " + (error.message || JSON.stringify(error));
    }
  }

  document.getElementById("saveBtn").onclick = saveToGitHub;
})();
