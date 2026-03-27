# Monday Tweaks

This repository now has two versions of the userscript:

- `MondayTweaks.js` is the original single-file script kept intact for historical reference.
- `src/` contains the modular source used to build the current userscript bundle.

## Build

Install dependencies:

```bash
npm install
```

Build the Tampermonkey bundle:

```bash
npm run build
```

The generated userscript will be written to `dist/MondayTweaks.user.js`.

## Source Layout

- `src/main.js` wires the tweaks together and starts the shared mutation observer.
- `src/tweaks/branding.js` replaces Monday branding text with the current day.
- `src/tweaks/fullscreen.js` injects the modal fullscreen button.
- `src/tweaks/layout.js` injects the board layout CSS tweak.
- `src/styles/layout.css` stores the CSS that gets inlined into the userscript bundle.
