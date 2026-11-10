# Fixed Gear Calculator

> **This is not an original work.** It is a preservation copy of the
> **Fantastic Fixed Gear Calculator** by the **[SURPLACE](https://www.surplace.fr/) team**
> ([surplace.fr/ffgc](https://www.surplace.fr/ffgc/),
> [archived copy](https://web.archive.org/web/20260414030900/https://www.surplace.fr/ffgc/)).
> It exists only to keep their calculator available to the fixed gear community in case
> the original goes down. **All credit goes to them.** If the original is online, please use it.

> **Ceci n'est pas une œuvre originale.** C'est une copie de sauvegarde du
> **Fantastic Fixed Gear Calculator** de l'**équipe [SURPLACE](https://www.surplace.fr/)**.
> Elle existe uniquement pour que la communauté pignon fixe garde accès à leur calculateur
> si l'original disparaît. **Tout le mérite leur revient.** Si l'original est en ligne, utilisez-le.

**Live:** https://bouliboule.github.io/fixed-gear-calculator/

## What it calculates

From chainring teeth, sprocket teeth and tire size:

- ratio
- skid patches, single-sided and ambidextrous
- development (metres) or gear inches (imperial)
- speed from 50 to 130 rpm, in km/h or mph
- equivalent gears within ±2 %, each with its own skid patch count

The page is in English and French, with metric and imperial units.

## Credits

- **SURPLACE team**: the original calculator, its idea, layout and formulas.
- **[Sheldon Brown](https://www.sheldonbrown.com/)**: tire circumference data and gear theory.
- **lajalousie**: the corrected ambidextrous skid patch method.

If the SURPLACE team would like this copy changed or taken down, open an issue and it will be.

## Development

Plain HTML, CSS and JavaScript modules, with no dependencies and no build step.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
npm test                       # node --test, calculation tests
```

The code is a clean rewrite; no code or images from surplace.fr are included.
It is released into the public domain ([The Unlicense](LICENSE)).
