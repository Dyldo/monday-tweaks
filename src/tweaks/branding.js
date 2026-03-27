import brandingCss from "../styles/branding.css?inline";
import { MONDAY_TEXT_MARKER } from "../constants.js";

const BRANDING_STYLE_ID = "custom-monday-branding-styles";

const WEEKDAY_BANNER_CLASSES = [
  "banner-text-monday",
  "banner-text-tuesday",
  "banner-text-wednesday",
  "banner-text-thursday",
  "banner-text-friday",
  "banner-text-saturday",
  "banner-text-sunday",
];

function getCurrentDayName() {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
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
  injectBrandingStyles();

  const mondayText = findMondayBrandingElement();
  if (!mondayText) return;

  const currentDay = getCurrentDayName();
  if (mondayText.textContent?.trim().toLowerCase() !== currentDay) {
    mondayText.textContent = currentDay;
  }
  mondayText.setAttribute(MONDAY_TEXT_MARKER, "true");
  syncBannerDayClass(mondayText, currentDay);
}

export const brandingTweak = {
  init() {
    replaceMondayTextWithCurrentDay();
  },

  shouldHandleNode(node) {
    if (!(node instanceof Element)) return false;

    return Boolean(
      node.matches('span[class*="mondayText"]') ||
        node.matches("header, nav, [role='banner']") ||
        node.querySelector('span[class*="mondayText"]') ||
        node.querySelector("header, nav, [role='banner']"),
    );
  },

  onMutation() {
    replaceMondayTextWithCurrentDay();
  },
};
