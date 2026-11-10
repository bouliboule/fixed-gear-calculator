# Fixed Gear Calculator — Architecture Plan

A free, static, bilingual (FR/EN), metric/imperial rebuild of the defunct
"Fantastic Fixed Gear Calculator" (surplace.fr/ffgc), hosted on GitHub Pages.

## 1. What the original did

Recovered from the Wayback Machine (snapshot 2026-04-14, copy in
`reference/original/`). It was one HTML page, jQuery + jQuery UI, ~200 lines of JS.

| Area | Original behaviour |
|---|---|
| Inputs | Chainring 28–59 t (default 46), sprocket 9–23 t (default 18), tire from a 32-entry list (default 700x23), "ambidextrous skid" checkbox |
| Settings | Language EN/FR (auto from `navigator.language`), units imperial/metric (FR ⇒ metric) |
| Outputs | Ratio, skid patches, development (m or inches) |
| Drawing | Canvas: wheel with skid patches (pink, blue for the ambidextrous set), cog, chainring, chain |
| Equivalent gears | Every ring×sprocket combo within ±2 % of the current ratio, clickable |
| Cadence / speed | Speed at 50–130 rpm in steps of 10, 90 rpm highlighted |
| Help | Click a result label for a short explanation dialog |

### Formulas (kept, verified against the original source)

```
g           = gcd(ring, sprocket)
ratio       = ring / sprocket
skidPatches = sprocket / g
ambidextrous: if (ring / g) is odd  → skidPatches × 2, else unchanged
development = ratio × tireCircumference            (metres per crank turn)
speed       = development × rpm × 60 / 1000        (km/h)
equivalent  = all (r, s) with |r/s − ratio| < 0.02 × ratio
```

Tire circumferences (mm) are Sheldon Brown's cyclecomputer calibration values.

### Things we fix or add

- Imperial speed used `/ 1.609`; use 1.609344.
- Imperial "development in inches" is not what riders use. Show **gear inches**
  (ratio × wheel diameter, Sheldon Brown's convention) in imperial, and
  **development in metres** in metric. Both are visible in a secondary line.
- Tire list had typos/duplicates (`26x1'/2`, two 571-25 rows). Clean it, add
  common modern sizes (700x30, 700x40, 650B), and a **custom circumference** input.
- Teeth ranges widened (ring 20–70, sprocket 9–30) with numeric steppers, not 32-item selects.
- Equivalent gears also show their skid patch count, so you can pick a
  same-feel gear with better tire wear. This is the most useful missing feature.
- Shareable URL (`#46x18&t=700x23&u=m&l=fr`), settings remembered in `localStorage`.
- Works offline, dark mode, keyboard and screen-reader accessible, no tracking.
- Optional later: gain ratio (needs crank length), rollout check for track racing limits.

## 2. Stack

**No framework, no build step.** Plain HTML + CSS + vanilla ES modules.
The whole app is a few hundred lines; a toolchain would be the largest part of the project
and the thing most likely to rot. Anyone in the community can fork and edit it.

- Rendering: SVG for the wheel/drivetrain (crisp at any size, themable with CSS, accessible) instead of canvas.
- Tests: `node --test` on the pure calculation module. No dependencies.
- Deploy: GitHub Pages serving the repo root from `main`. No Actions needed for
  deploy; one small workflow runs the tests on push.

## 3. Repository layout

```
fixed-gear-calculator/
├── index.html            single page, semantic markup, both languages' meta
├── css/
│   └── style.css         tokens (light/dark), layout, components
├── js/
│   ├── calc.js           pure functions: gcd, ratio, skidPatches, development,
│   │                     gearInches, speed, equivalents — no DOM
│   ├── tires.js          tire table: { id, label, etrto, circumferenceMm }
│   ├── i18n.js           { en: {...}, fr: {...} } strings + number formatting
│   ├── units.js          metric/imperial conversion and unit labels
│   ├── wheel.js          builds/updates the SVG drawing from state
│   ├── state.js          state object, URL hash ⇄ state, localStorage
│   └── app.js            wires inputs → state → render
├── tests/
│   └── calc.test.js      known gears: 46×18, 48×16, 47×17, 44×16 …
├── assets/               favicon, social card
├── docs/                 this plan + design spec
├── design/               static mockup
├── reference/original/   archived surplace.fr source — reference only, git-ignored
├── LICENSE               The Unlicense (public domain)
└── README.md             EN + FR, tribute statement first
```

### Data flow

```
inputs / URL hash / localStorage
        │
        ▼
   state { ring, sprocket, tireId | customMm, ambidextrous, lang, unit }
        │  calc.js (pure)
        ▼
   result { ratio, patches, developmentM, gearInches, speeds[], equivalents[] }
        │
        ▼
   render: results, SVG wheel, equivalents table, cadence table, URL hash
```

One `render()` runs on every change, like the original's `draw()`. No virtual DOM needed.

## 4. Internationalisation and units

- One page, runtime switch between EN and FR.
- Defaults: English and metric. A saved choice or the URL overrides them.
- Language and unit are **independent** (a French speaker can pick mph).
- Numbers via `Intl.NumberFormat(lang)` — gives the French decimal comma for free.
- `<html lang>` updated on switch; strings in `data-i18n` attributes.
- Fixed-gear vocabulary kept as the community uses it: "skid patch" stays English in FR;
  plateau / pignon / développement / braquet for the rest.

## 5. Hosting

- Repo `bouliboule/fixed-gear-calculator`, public, Unlicense.
- URL: `https://bouliboule.github.io/fixed-gear-calculator/` (custom domain possible later via `CNAME`).
- All paths relative, so it works under the project sub-path and from `file://`.

## 6. Credits — this is a tribute, not a new work

**Rule: all credit goes to the original authors. The maintainer takes none.**

- A tribute banner at the very top of the page, before the calculator, in the
  current language: this is a preservation copy of SURPLACE's *Fantastic Fixed
  Gear Calculator*, kept online only in case the original disappears. All credit
  belongs to them, and if the original is back, people should use it. Links to
  surplace.fr/ffgc and to its Wayback Machine snapshot.
- The same statement appears in the About dialog, the footer, the README
  (first paragraph, EN and FR), the page `<meta name="description">` and the social card.
- Credited by name: the SURPLACE team (the calculator), Sheldon Brown (tire data,
  gear theory) and lajalousie (ambidextrous skid patch method).
- No maintainer name, handle, "made by", donation link or analytics anywhere on the page.
  The only unavoidable trace is the GitHub username in the URL.
- Licence: **The Unlicense** (public domain), so nobody — including the
  maintainer — holds a copyright notice over it.
- Clean rewrite: no code, logo or images from surplace.fr are reused. The archived
  copy stays local as a behavioural reference and is not published.
- Takedown: a contact address (bouliworks@gmail.com) is shown in the footer, About dialog and README.
  On request, the page is changed or replaced by a link to the original.

## 7. Build phases

1. **Core** — `calc.js`, `tires.js`, tests. Verified against the original's outputs.
2. **Page** — markup, styles, inputs, results, cadence table, equivalents.
3. **Drawing** — SVG wheel with skid patches, cog, chainring, chain.
4. **i18n + units** — strings, switches, detection, persistence, shareable URL.
5. **Polish** — dark mode, a11y pass, help popovers, favicon, social card, README.
6. **Ship** — create repo, enable Pages, test on phone.

## 8. Decisions

| Decision | Outcome |
|---|---|
| Project name | "Fixed Gear Calculator" / "Calculateur Pignon Fixe", repo `fixed-gear-calculator` |
| Cadence range | 50–130 rpm, as the original |
| Credit | Entirely to the original authors (section 6) |
| Licence | The Unlicense |
| Gain ratio / crank length | v2 |
| Custom domain | Later, if wanted |
