# Fixed Gear Calculator — Design Spec

Static mockup: `design/mockup.html` (open in a browser; follows system light/dark).

## Principles

- **One screen, zero clicks to an answer.** Defaults (46×18, 700x23) show a full result on load.
- **Phone first.** It gets used in bike shops and at the kerb. Single column, max width 480 px,
  thumb-sized steppers, no horizontal scroll.
- **Recognisable.** Same order as the original — settings, wheel, analysis, equivalent gears,
  cadence/speed — and the same signal colours: pink skid patches, blue ambidextrous ones.
- **Quiet.** System fonts, no images, no trackers, loads instantly.

## Layout (top to bottom)

0. **Tribute banner** — first thing on the page, full width, accent left border, never dismissible:
   "A preservation of SURPLACE's Fantastic Fixed Gear Calculator. All credit goes to them.
   Kept online only in case the original disappears." + links to the original and its archive.
1. **Header** — title, subtitle "after SURPLACE's Fantastic Fixed Gear Calculator", then two segmented switches on one row: `EN | FR` and `Metric | Imperial`, plus an `About` link.
2. **Gear** — two steppers side by side: Chainring `− 46 +`, Sprocket `− 18 +` (typing allowed).
   Tire select below (grouped by rim: 700C, 650B, 27", 26", small wheels, Custom…).
   Ambidextrous skid toggle.
3. **Wheel drawing** — SVG: wheel with skid patches on the tire, sprocket, chainring, chain.
   Tooth counts are drawn to scale so the picture changes as you step.
4. **Results** — three big figures: Ratio, Skid patches, Development (metric) or Gear inches (imperial).
   A small second line carries the other unit's figure. Each label opens a short explanation.
5. **Cadence / Speed** — grid of 9 cells, 50–130 rpm, 90 rpm highlighted. km/h or mph.
6. **Equivalent gears ±2 %** — chips `41×16 · 16`, where the second number is the skid patch count.
   Tap to load that gear. The current gear is marked; gears with more patches than the current one are emphasised.
7. **Footer** — "All credit: SURPLACE · Sheldon Brown · lajalousie", source link, "public domain".
   No maintainer name anywhere.

At ≥ 720 px the Gear form and the wheel sit side by side; everything else stays one column.

## Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f6f5f2` | `#141414` | page |
| `--surface` | `#ffffff` | `#1e1e1e` | cards |
| `--border` | `#dcdad4` | `#333333` | hairlines |
| `--text` | `#1a1a1a` | `#f0f0f0` | primary text |
| `--muted` | `#6b6b6b` | `#a0a0a0` | labels, units |
| `--skid` | `#e6004c` | `#ff3d7f` | skid patches, links, accent |
| `--ambi` | `#0077e6` | `#4da6ff` | ambidextrous patches |
| `--metal` | `#3a3a3a` | `#c8c8c8` | cog, chainring, rim |

Type: system UI stack; results in tabular numerals, 700 weight, 1.75 rem. Radius 10 px. Spacing on a 4 px grid.

## Components

- **Segmented switch** — `role="radiogroup"`, arrow keys move selection.
- **Stepper** — `<input type="number" inputmode="numeric">` with − / + buttons (44 px targets),
  press-and-hold repeats, out-of-range values clamp.
- **Result tile** — label (button opening a `<dialog>` with the explanation), value, unit.
- **Speed cell** — speed over cadence; 90 rpm cell uses accent border.
- **Gear chip** — button; `aria-current` on the active gear.

## Wording

| Key | EN | FR |
|---|---|---|
| ring | Chainring | Plateau |
| sprocket | Sprocket | Pignon |
| tire | Tire | Pneu |
| ambi | Ambidextrous skid | Skid ambidextre |
| ratio | Ratio | Ratio |
| patches | Skid patches | Skid patchs |
| development | Development | Développement |
| gearInches | Gear inches | Pouces (gear inches) |
| speed | Cadence / Speed | Cadence / Vitesse |
| equivalents | Equivalent gears ±2 % | Braquets équivalents ±2 % |
| rpm | rpm | tr/min |
| teeth | t | d |

## Accessibility

- Contrast ≥ 4.5:1 for text in both themes; patches also differ by position, not only colour.
- Results region is `aria-live="polite"`; the SVG has a text alternative ("9 skid patches, 18 ambidextrous").
- Full keyboard operation; visible focus rings; respects `prefers-reduced-motion`.
