// ==UserScript==
// @name         Monday Fullscreen Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds fullscreen toggle button to Monday.com modals
// @match        https://*.monday.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "custom-fs-button";
  const MONDAY_TEXT_MARKER = "data-current-day-replaced";
  const ACTION_BAR_SELECTOR = ".item-page-header-component__actions-bar";

  function getCurrentDayName() {
    return new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
  }

  function findMondayBrandingElement() {
    const existingReplacement = document.querySelector(
      `[${MONDAY_TEXT_MARKER}="true"]`,
    );
    if (existingReplacement) return existingReplacement;

    const classMatch = document.querySelector('span[class*="mondayText"]');
    if (classMatch) return classMatch;

    return Array.from(document.querySelectorAll("span, a, div")).find(
      (element) => {
        if (element.children.length > 0) return false;

        const text = element.textContent?.trim().toLowerCase();
        const className =
          typeof element.className === "string"
            ? element.className.toLowerCase()
            : "";

        return (
          text === "monday" &&
          (className.includes("monday") ||
            element.closest('header, nav, [role="banner"]'))
        );
      },
    );
  }

  function replaceMondayTextWithCurrentDay() {
    const mondayText = findMondayBrandingElement();
    if (!mondayText) return;

    const currentDay = getCurrentDayName();
    if (mondayText.textContent?.trim().toLowerCase() === currentDay) return;

    mondayText.setAttribute(MONDAY_TEXT_MARKER, "true");
    mondayText.textContent = currentDay;
  }

  function injectGlobalStyles() {
    if (document.getElementById("custom-monday-styles")) return;

    const style = document.createElement("style");
    style.id = "custom-monday-styles";

    style.innerHTML = `
            /* Make tab items fill available space */
            .monday-board-subset-item-v2 {
                flex: 1 !important;
            }

            /* Make tab buttons full width and remove constraints */
            .monday-board-subset-item-v2 .monday-board-subset-item-v2__button {
                min-width: unset !important;
                max-width: unset !important;
                width: 100% !important;
            }

            /* Make tab row full width */
            .item-page-header-component .item-page-header-details-wrapper .item-page-subsets-tabs-wrapper {
                max-width: unset !important;
                width: 100% !important;
            }
        `;

    document.head.appendChild(style);
  }

  function createButton() {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.innerText = "🧨";

    // Basic styling to match-ish
    btn.style.marginLeft = "8px";
    btn.style.height = "32px";
    btn.style.padding = "0 8px";
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "4px";
    btn.style.background = "#fff";
    btn.style.cursor = "pointer";

    let isFullscreen = false;

    btn.addEventListener("click", () => {
      const modal = document.querySelector(".ReactModal__Content--after-open");
      if (!modal) return;

      if (!isFullscreen) {
        // Modified stile for fullscreen
        modal.style.inset = "0 0 0";
      } else {
        // Default style ( TODO - should dynamically extract the value incase monday.com changes it down the line)
        modal.style.inset = "32px 150px 0px";
      }

      isFullscreen = !isFullscreen;
    });

    return btn;
  }

  function injectButton() {
    const actionBar = document.querySelector(ACTION_BAR_SELECTOR);
    if (!actionBar) return;

    // Prevent buplicate buttons from being inserted
    if (document.getElementById(BUTTON_ID)) return;

    const btn = createButton();
    actionBar.appendChild(btn);
  }

  function shouldProcessMutation(mutations) {
    return mutations.some((mutation) => {
      if (mutation.type !== "childList" || mutation.addedNodes.length === 0) {
        return false;
      }

      return Array.from(mutation.addedNodes).some((node) => {
        if (!(node instanceof Element)) return false;

        if (node.matches(ACTION_BAR_SELECTOR)) return true;
        if (node.matches('span[class*="mondayText"]')) return true;
        if (node.matches("header, nav, [role='banner']")) return true;

        if (node.querySelector(ACTION_BAR_SELECTOR)) return true;
        if (node.querySelector('span[class*="mondayText"]')) return true;
        if (node.querySelector("header, nav, [role='banner']")) return true;

        return false;
      });
    });
  }

  // We need to watch the DOM as it is not a static html file
  const observer = new MutationObserver((mutations) => {
    if (!shouldProcessMutation(mutations)) return;

    injectButton();
    injectGlobalStyles();
    replaceMondayTextWithCurrentDay();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectGlobalStyles();
  injectButton();
  replaceMondayTextWithCurrentDay();
})();
