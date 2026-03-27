// ==UserScript==
// @name         Monday Tweaks
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Modular Monday.com tweaks bundled with Vite (built 2026-03-27T12:14:51.095Z)
// @match        https://*.monday.com/*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  const brandingCss = ".banner-text-monday{}\n.banner-text-tuesday{}\n.banner-text-wednesday{}\n.banner-text-thursday{\n    text-shadow: -1px 1px #ef3550,\n    -2px 2px #f48fb1,\n    -3px 3px #7e57c2,\n    -4px 4px #2196f3,\n    -5px 5px #26c6da,\n    -6px 6px #43a047,\n    -7px 7px #eeff41,\n    -8px 8px #f9a825,\n    -9px 9px #ff5722\n}\n.banner-text-friday{\n    text-shadow: -1px 1px #ef3550,\n    -2px 2px #f48fb1,\n    -3px 3px #7e57c2,\n    -4px 4px #2196f3,\n    -5px 5px #26c6da,\n    -6px 6px #43a047,\n    -7px 7px #eeff41,\n    -8px 8px #f9a825,\n    -9px 9px #ff5722\n}\n.banner-text-saturday{}\n.banner-text-sunday{}";
  const BUTTON_ID = "custom-fs-button";
  const STYLE_ID = "custom-monday-styles";
  const MONDAY_TEXT_MARKER = "data-current-day-replaced";
  const ACTION_BAR_SELECTOR = ".item-page-header-component__actions-bar";
  const MODAL_SELECTOR = ".ReactModal__Content--after-open";
  const BRANDING_STYLE_ID = "custom-monday-branding-styles";
  const WEEKDAY_BANNER_CLASSES = [
    "banner-text-monday",
    "banner-text-tuesday",
    "banner-text-wednesday",
    "banner-text-thursday",
    "banner-text-friday",
    "banner-text-saturday",
    "banner-text-sunday"
  ];
  function getCurrentDayName() {
    return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  }
  function injectBrandingStyles() {
    if (document.getElementById(BRANDING_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = BRANDING_STYLE_ID;
    style.textContent = brandingCss;
    document.head.appendChild(style);
  }
  function syncBannerDayClass(element, currentDay) {
    element.classList.remove(...WEEKDAY_BANNER_CLASSES);
    element.classList.add(`banner-text-${currentDay}`);
  }
  function findMondayBrandingElement() {
    const existingReplacement = document.querySelector(
      `[${MONDAY_TEXT_MARKER}="true"]`
    );
    if (existingReplacement) return existingReplacement;
    const classMatch = document.querySelector('span[class*="mondayText"]');
    if (classMatch) return classMatch;
    return Array.from(document.querySelectorAll("span, a, div")).find(
      (element) => {
        var _a;
        if (element.children.length > 0) return false;
        const text = (_a = element.textContent) == null ? void 0 : _a.trim().toLowerCase();
        const className = typeof element.className === "string" ? element.className.toLowerCase() : "";
        return text === "monday" && (className.includes("monday") || element.closest('header, nav, [role="banner"]'));
      }
    );
  }
  function replaceMondayTextWithCurrentDay() {
    var _a;
    injectBrandingStyles();
    const mondayText = findMondayBrandingElement();
    if (!mondayText) return;
    const currentDay = getCurrentDayName();
    if (((_a = mondayText.textContent) == null ? void 0 : _a.trim().toLowerCase()) !== currentDay) {
      mondayText.textContent = currentDay;
    }
    mondayText.setAttribute(MONDAY_TEXT_MARKER, "true");
    syncBannerDayClass(mondayText, currentDay);
  }
  const brandingTweak = {
    init() {
      replaceMondayTextWithCurrentDay();
    },
    shouldHandleNode(node) {
      if (!(node instanceof Element)) return false;
      return Boolean(
        node.matches('span[class*="mondayText"]') || node.matches("header, nav, [role='banner']") || node.querySelector('span[class*="mondayText"]') || node.querySelector("header, nav, [role='banner']")
      );
    },
    onMutation() {
      replaceMondayTextWithCurrentDay();
    }
  };
  function createButton() {
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.innerText = "🧨";
    button.style.marginLeft = "8px";
    button.style.height = "32px";
    button.style.padding = "0 8px";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "4px";
    button.style.background = "#fff";
    button.style.cursor = "pointer";
    let isFullscreen = false;
    button.addEventListener("click", () => {
      const modal = document.querySelector(MODAL_SELECTOR);
      if (!modal) return;
      if (!isFullscreen) {
        modal.style.inset = "0 0 0";
      } else {
        modal.style.inset = "32px 150px 0px";
      }
      isFullscreen = !isFullscreen;
    });
    return button;
  }
  function injectButton() {
    const actionBar = document.querySelector(ACTION_BAR_SELECTOR);
    if (!actionBar) return;
    if (document.getElementById(BUTTON_ID)) return;
    actionBar.appendChild(createButton());
  }
  const fullscreenTweak = {
    init() {
      injectButton();
    },
    shouldHandleNode(node) {
      if (!(node instanceof Element)) return false;
      return Boolean(
        node.matches(ACTION_BAR_SELECTOR) || node.querySelector(ACTION_BAR_SELECTOR)
      );
    },
    onMutation() {
      injectButton();
    }
  };
  const layoutCss = ".monday-board-subset-item-v2 {\n  flex: 1 !important;\n}\n\n.monday-board-subset-item-v2 .monday-board-subset-item-v2__button {\n  min-width: unset !important;\n  max-width: unset !important;\n  width: 100% !important;\n}\n\n.item-page-header-component .item-page-header-details-wrapper .item-page-subsets-tabs-wrapper {\n  max-width: unset !important;\n  width: 100% !important;\n}\n";
  function injectGlobalStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = layoutCss;
    document.head.appendChild(style);
  }
  const layoutTweak = {
    init() {
      injectGlobalStyles();
    },
    shouldHandleNode(node) {
      if (!(node instanceof Element)) return false;
      return Boolean(
        node.matches(".item-page-header-component") || node.querySelector(".item-page-header-component")
      );
    },
    onMutation() {
      injectGlobalStyles();
    }
  };
  const tweaks = [layoutTweak, fullscreenTweak, brandingTweak];
  function runTweaks(methodName) {
    for (const tweak of tweaks) {
      const handler = tweak[methodName];
      if (typeof handler === "function") {
        handler();
      }
    }
  }
  function shouldProcessMutations(mutations) {
    return mutations.some((mutation) => {
      if (mutation.type !== "childList" || mutation.addedNodes.length === 0) {
        return false;
      }
      return Array.from(mutation.addedNodes).some(
        (node) => tweaks.some(
          (tweak) => typeof tweak.shouldHandleNode === "function" && tweak.shouldHandleNode(node)
        )
      );
    });
  }
  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      if (!shouldProcessMutations(mutations)) return;
      runTweaks("onMutation");
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function start() {
    runTweaks("init");
    startObserver();
  }
  if (document.body) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
