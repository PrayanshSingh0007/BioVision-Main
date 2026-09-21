# BioVision — Engineering Tomorrow's Species

An interactive biology education app for a Grade 8 presentation. A student chooses a
habitat, picks a base animal, inherits three adaptations from other animals, and
receives a Final Species Report in which the **base animal stays recognisable and every
selected trait is visibly composed onto it** (wings, antlers, camouflage skin, glowing
night-vision eyes, webbed feet, …) inside a real, colour-graded photograph of its habitat.

BioVision is an educational simulation. It does not perform real genetic engineering and
its survival scores are illustrative, not predictions.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173). For the classroom, press the browser's
fullscreen shortcut (⌃⌘F in Chrome/Safari on a Mac).

Production build (fully static, works offline from any static file server):

```bash
npm run build
npm run preview
```

## Flow

Landing → Boot → Mission Brief → Habitat → Species Archive → Genetic Lab → Species Report

## Presenting tomorrow (cheat sheet)

**If the Wi-Fi at the venue is slow, filtered, or just not there** — this app needs **zero
network at runtime** (no APIs, no fonts/images from the internet, nothing). The only thing
that ever needed Wi-Fi was the one-time `npm install`. Two launchers now handle this:

- **`Open BioVision (Offline).command`** — the safe, always-works option. Double-click it and
  it opens the already-built app straight from disk in your default browser. No terminal
  output, no npm, no server, no Wi-Fi check — it cannot fail because of the network.
- **`Start BioVision.command`** — the normal launcher for live editing (`npm run dev`). It now
  checks for a network connection before trying `npm install`, and if there isn't one (or the
  install fails), it **automatically falls back** to opening the offline build instead of
  hanging or erroring out.

Both open the exact same app. Use the offline one whenever you just need it to work.

1. **Easiest of all:** the app is also hosted at **https://prayanshsingh0007.github.io/BioVision-Main/** — open that on any machine with internet (a smartboard, a borrowed laptop) and it just works. No install.
2. Otherwise double-click a launcher above (or run `npm run dev`) — the browser opens automatically.
3. Click **Fullscreen** (top-right on the landing page or the ⤢ button in the top bar).
4. Suggested demo: Rainforest → Jaguar → Camouflage + Night Vision + Powerful Jaws → Create the species.
   Then **Make another** and try the same three on a Polar Bear in the Arctic to show how the same abilities score differently.
5. A refresh (⌘R) always starts a fresh mission — nothing is saved between visits, so every run starts clean on stage.
6. **4K / large smartboards:** the interface scales itself up automatically on displays wider than ~2200 px (a 4K board shows the 1920 px design at 2×), so text stays readable from the back of the room. Keep the browser at 100 % zoom.
7. **Touch screens:** fully supported — tap a habitat or species once to open and select it; tap a trait to add or remove it. Hover effects are automatically disabled on touch devices.
8. **Rebuilding the offline copy:** after any code change, run `npm run build` once (needs network the first time only, to have `node_modules` installed) to refresh `dist/` before the next offline run.

* 7 habitats, 37 base animals (grouped by their native habitat) and 39 inheritable adaptations — all local data in `src/data/`. Image sources and licenses are listed in `CREDITS.md`.
* Exactly three traits must be selected; traits that come from the base animal itself are
  hidden (they are already part of its biology).
* Nothing is persisted between page loads (by design — a refresh is a clean slate).
* Species generation is deterministic: the same habitat + animal + traits always produce the
  same name, scientific-style name, stats and analysis.

### Presentation presets

You can deep-link straight into a prepared example (handy on stage):

```
https://prayanshsingh0007.github.io/BioVision-Main/#/report?seed=jaguar,rainforest,camouflage,night-vision,strong-bite
https://prayanshsingh0007.github.io/BioVision-Main/#/report?seed=polar-bear,arctic,antlers,bushy-tail,hind-legs
https://prayanshsingh0007.github.io/BioVision-Main/#/lab?seed=wolf,wetlands,aquatic,climbing
```

Format: `seed=<animalId>,<habitatId>,<traitId>,<traitId>,<traitId>` (ids are in `src/data/`).

## How the composition system works

`src/components/visual/SpeciesComposition.jsx` layers, in order:

1. Photographic habitat plate with atmosphere (`HabitatScene.jsx`), pre-blurred behind the animal for shallow depth of field
2. "Behind" overlays — wings, antlers, bushy tail, water ripples
3. Fur halo (the animal's own silhouette, softened and tinted)
4. The base animal photo cut-out
5. "Skin" layers masked to the animal's silhouette and blended with the photo — camouflage,
   fur tint, muscle highlight
6. "Front" overlays — eye glow, fangs, tongue, whiskers, claws, webbed feet, grip marker
7. Callout labels with leader lines to the anatomical anchor

Every animal in `src/data/animals.js` carries anatomical anchors (eyes, head top, mouth, back,
hips, feet…) as percentages of its image, so every overlay lands in a sensible place for
every animal, deterministically.

## Scoring model (transparent, educational)

* Five core stats = base animal stats + trait deltas.
* Environmental adaptation = 50 + base-animal habitat fit × 10 + trait habitat fit × 7.
* Survival estimate = 55 % adaptation + 45 % core average, rounded to the nearest 5.

The report shows this calculation so students can reason about it.

## Tech

Design: cinematic realism — the landing is a single photograph of mist moving through a mountain rainforest canopy, graded like a film frame, with slow drifting mist and a minimal interface (no added elements). Every habitat is a colour-graded photographic plate (Wikimedia Commons, credited in CREDITS.md) with a procedural weather layer; the real animal cut-outs are lit into each scene (rim light, cool fill, contact shadow). Midnight foundation, warm ivory type and controls, restrained cyan scientific overlays; Manrope + Inter bundled locally; a short synthesis sequence when a species is generated. Vector scenes remain as an automatic fallback if a plate fails to load.

React 19 · Vite · React Router (hash routing, so refresh and file:// both work) · Framer
Motion · Lucide icons. No backend, no accounts, no API keys, no network dependency.

## Project structure

```
src/
  assets/animals/         cut-out animal images (transparent PNG)
  components/
    layout/               AppShell, TopBar, Logo
    ui/                   Button, Badge, StatBar, PageTransition
    visual/               HabitatScene, SpeciesComposition, traitOverlays, DNAHelix, AmbientBackground
  data/                   habitats.js, animals.js, traits.js
  pages/                  Landing, Boot, Mission, Habitat, Species, Lab, Report
  state/                  MissionContext (state + localStorage)
  utils/                  scoring.js, generateSpecies.js, storage.js
```
