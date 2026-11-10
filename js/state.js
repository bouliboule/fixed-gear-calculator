import { RING_MIN, RING_MAX, SPROCKET_MIN, SPROCKET_MAX, clamp } from './calc.js';
import { TIRES, DEFAULT_TIRE, CUSTOM } from './tires.js';

const KEY = 'fgc-settings';
const IMPERIAL_REGIONS = ['US', 'GB', 'LR', 'MM'];

function detect() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  const lang = langs[0].toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const region = (langs[0].split('-')[1] || '').toUpperCase();
  const unit = IMPERIAL_REGIONS.includes(region) || (lang === 'en' && !region) ? 'i' : 'm';
  return { lang, unit };
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}

// Hash format: #46x18&t=700x23&a=1&u=m&l=fr&c=2100
function fromHash() {
  const out = {};
  const h = location.hash.slice(1);
  if (!h) return out;
  const [gear, ...rest] = h.split('&');
  const m = gear.match(/^(\d+)x(\d+)$/);
  if (m) { out.ring = +m[1]; out.sprocket = +m[2]; }
  for (const kv of rest) {
    const [k, v] = kv.split('=');
    if (k === 't') out.tire = decodeURIComponent(v);
    if (k === 'a') out.ambidextrous = v === '1';
    if (k === 'u' && (v === 'm' || v === 'i')) out.unit = v;
    if (k === 'l' && (v === 'en' || v === 'fr')) out.lang = v;
    if (k === 'c') out.customMm = +v;
  }
  return out;
}

export function toHash(s) {
  let h = `#${s.ring}x${s.sprocket}&t=${encodeURIComponent(s.tire)}`;
  if (s.tire === CUSTOM) h += `&c=${s.customMm}`;
  if (s.ambidextrous) h += '&a=1';
  return h + `&u=${s.unit}&l=${s.lang}`;
}

export function initialState() {
  const s = { ring: 46, sprocket: 18, tire: DEFAULT_TIRE, customMm: 2100, ambidextrous: false,
    ...detect(), ...load(), ...fromHash() };
  return normalise(s);
}

export function normalise(s) {
  s.ring = clamp(+s.ring || 46, RING_MIN, RING_MAX);
  s.sprocket = clamp(+s.sprocket || 18, SPROCKET_MIN, SPROCKET_MAX);
  if (s.tire !== CUSTOM && !TIRES.has(s.tire)) s.tire = DEFAULT_TIRE;
  s.customMm = clamp(+s.customMm || 2100, 500, 3500);
  return s;
}

export const circumference = s => (s.tire === CUSTOM ? s.customMm : TIRES.get(s.tire).mm);
