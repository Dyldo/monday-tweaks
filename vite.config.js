import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "vite";

function userscriptBanner(buildTimeIso) {
  return `// ==UserScript==
// @name         Monday Tweaks
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Modular Monday.com tweaks bundled with Vite (built ${buildTimeIso})
// @match        https://*.monday.com/*
// @grant        none
// ==/UserScript==`;
}

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: "prepend-userscript-banner",
      async closeBundle() {
        const outputPath = path.resolve("dist/MondayTweaks.user.js");
        const bundle = await readFile(outputPath, "utf8");
        if (bundle.startsWith("// ==UserScript==")) return;
        const buildTimeIso = new Date().toISOString();
        await writeFile(
          outputPath,
          `${userscriptBanner(buildTimeIso)}\n\n${bundle}`,
        );
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: mode === "min",
    cssCodeSplit: false,
    lib: {
      entry: "src/main.js",
      formats: ["iife"],
      name: "MondayTweaks",
      fileName: () => "MondayTweaks.user.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
}));
