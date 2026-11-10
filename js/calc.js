// Pure calculation functions. No DOM. Formulas follow SURPLACE's original
// Fantastic Fixed Gear Calculator (surplace.fr/ffgc) and Sheldon Brown.

export const RING_MIN = 20, RING_MAX = 70;
export const SPROCKET_MIN = 9, SPROCKET_MAX = 30;
export const CADENCES = [50, 60, 70, 80, 90, 100, 110, 120, 130];
export const KM_PER_MILE = 1.609344;
export const MM_PER_INCH = 25.4;

export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export const ratio = (ring, sprocket) => ring / sprocket;

// Number of distinct positions where the wheel stops when skidding with the
// same foot forward. Ambidextrous riders (either foot forward) double it,
// but only when the reduced chainring count is odd (lajalousie's method).
export function skidPatches(ring, sprocket, ambidextrous = false) {
  const g = gcd(ring, sprocket);
  const single = sprocket / g;
  const doubled = ambidextrous && (ring / g) % 2 === 1;
  return doubled ? single * 2 : single;
}

// Metres travelled per crank revolution.
export const developmentM = (ring, sprocket, circumferenceMm) =>
  ratio(ring, sprocket) * circumferenceMm / 1000;

// Sheldon Brown's gear inches: ratio × wheel diameter in inches.
export const gearInches = (ring, sprocket, circumferenceMm) =>
  ratio(ring, sprocket) * circumferenceMm / Math.PI / MM_PER_INCH;

export const speedKmh = (devM, rpm) => devM * rpm * 60 / 1000;

// Every ring × sprocket combination within ±tolerance of the given ratio.
export function equivalents(ring, sprocket, ambidextrous = false, tolerance = 0.02,
  rings = [28, 60], sprockets = [9, 25]) {
  const target = ratio(ring, sprocket);
  const out = [];
  for (let r = rings[0]; r <= rings[1]; r++) {
    for (let s = sprockets[0]; s <= sprockets[1]; s++) {
      if (Math.abs(target - r / s) < target * tolerance) {
        out.push({ ring: r, sprocket: s, ratio: r / s, patches: skidPatches(r, s, ambidextrous) });
      }
    }
  }
  return out.sort((a, b) => a.ratio - b.ratio || a.ring - b.ring);
}

export function analyse({ ring, sprocket, circumferenceMm, ambidextrous }) {
  const dev = developmentM(ring, sprocket, circumferenceMm);
  const single = skidPatches(ring, sprocket, false);
  const patches = skidPatches(ring, sprocket, ambidextrous);
  return {
    ratio: ratio(ring, sprocket),
    patchesSingle: single,
    patches,
    ambidextrousGain: patches > single,
    developmentM: dev,
    gearInches: gearInches(ring, sprocket, circumferenceMm),
    speeds: CADENCES.map(rpm => ({ rpm, kmh: speedKmh(dev, rpm), mph: speedKmh(dev, rpm) / KM_PER_MILE })),
    equivalents: equivalents(ring, sprocket, ambidextrous),
  };
}

export const clamp = (n, min, max) => Math.min(max, Math.max(min, Math.round(n)));
