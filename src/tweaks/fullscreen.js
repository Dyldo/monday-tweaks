import { ACTION_BAR_SELECTOR, BUTTON_ID, MODAL_SELECTOR } from "../constants.js";

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

export const fullscreenTweak = {
  init() {
    injectButton();
  },

  shouldHandleNode(node) {
    if (!(node instanceof Element)) return false;

    return Boolean(
      node.matches(ACTION_BAR_SELECTOR) || node.querySelector(ACTION_BAR_SELECTOR),
    );
  },

  onMutation() {
    injectButton();
  },
};
