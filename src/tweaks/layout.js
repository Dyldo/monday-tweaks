import layoutCss from "../styles/layout.css?inline";
import { STYLE_ID } from "../constants.js";

function injectGlobalStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = layoutCss;
  document.head.appendChild(style);
}

export const layoutTweak = {
  init() {
    injectGlobalStyles();
  },

  shouldHandleNode(node) {
    if (!(node instanceof Element)) return false;

    return Boolean(
      node.matches(".item-page-header-component") ||
        node.querySelector(".item-page-header-component"),
    );
  },

  onMutation() {
    injectGlobalStyles();
  },
};
