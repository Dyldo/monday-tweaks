import { brandingTweak } from "./tweaks/branding.js";
import { fullscreenTweak } from "./tweaks/fullscreen.js";
import { layoutTweak } from "./tweaks/layout.js";

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

    return Array.from(mutation.addedNodes).some((node) =>
      tweaks.some(
        (tweak) =>
          typeof tweak.shouldHandleNode === "function" &&
          tweak.shouldHandleNode(node),
      ),
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
    subtree: true,
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
