import { analyse, RING_MIN, RING_MAX, SPROCKET_MIN, SPROCKET_MAX, clamp } from './calc.js';
import { TIRE_GROUPS, CUSTOM, parseEtrto } from './tires.js';
import { STRINGS, fmt } from './i18n.js';
import { initialState, normalise, save, toHash, circumference } from './state.js';
import { drawWheel } from './wheel.js';

const $ = id => document.getElementById(id);
const state = initialState();
const t = () => STRINGS[state.lang];

function buildTireSelect() {
  const sel = $('tire');
  sel.innerHTML = TIRE_GROUPS.map(g =>
    `<optgroup label="${g.group}">${g.tires.map(([id, name, etrto, mm]) =>
      `<option value="${id}">${name}${etrto ? ` · ETRTO ${etrto}` : ''} · ${mm} mm</option>`).join('')}</optgroup>`).join('')
    + `<option value="${CUSTOM}" id="opt-custom"></option>`;
}

function applyLanguage() {
  const s = t();
  document.documentElement.lang = state.lang;
  document.title = s.title;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = s[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = s[el.dataset.i18nHtml]; });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', s[el.dataset.i18nAria]));
  $('opt-custom').textContent = s.custom;
}

function render() {
  normalise(state);
  const s = t(), L = state.lang, imperial = state.unit === 'i';
  const r = analyse({ ring: state.ring, sprocket: state.sprocket,
    circumferenceMm: circumference(state), ambidextrous: state.ambidextrous });

  // Inputs reflect state
  $('ring').value = state.ring;
  $('sprocket').value = state.sprocket;
  $('tire').value = state.tire;
  $('custom-row').hidden = state.tire !== CUSTOM;
  $('custom').value = state.customMm;
  $('custom-hint').textContent = state.tire === CUSTOM ? state.customHint || '' : '';
  $('ambi').checked = state.ambidextrous;
  $(`l-${state.lang}`).checked = true;
  $(`u-${state.unit}`).checked = true;

  // Results
  $('v-ratio').textContent = fmt(r.ratio, L);
  $('s-ratio').textContent = `${state.ring} ÷ ${state.sprocket}`;
  if (state.ambidextrous && r.ambidextrousGain) {
    $('v-patches').innerHTML = `${r.patchesSingle} <small class="ambi-text">/ ${r.patches}</small>`;
    $('s-patches').innerHTML = `${s.single} / <span class="ambi-text">${s.ambidextrous}</span>`;
  } else {
    $('v-patches').textContent = r.patches;
    $('s-patches').textContent = state.ambidextrous ? s.noGain : '';
  }
  const dev = `${fmt(r.developmentM, L)} m`, gi = fmt(r.gearInches, L, 1);
  const devLabel = $('dev-label');
  if (imperial) {
    devLabel.textContent = s.gearInches; devLabel.dataset.help = 'gearInches';
    $('v-dev').innerHTML = `${gi} <small>in</small>`;
    $('s-dev').textContent = `${dev} ${s.devShort}`;
  } else {
    devLabel.textContent = s.development; devLabel.dataset.help = 'development';
    $('v-dev').innerHTML = `${fmt(r.developmentM, L)} <small>m</small>`;
    $('s-dev').textContent = `${gi} gear inches`;
  }

  // Cadence / speed
  const unit = imperial ? 'mph' : 'km/h';
  $('speeds').innerHTML = r.speeds.map(({ rpm, kmh, mph }) =>
    `<div${rpm === 90 ? ' class="hl"' : ''}><b>${fmt(imperial ? mph : kmh, L, 1)} <small>${unit}</small></b>`
    + `<span>${s.at} ${rpm} ${s.rpm}</span></div>`).join('');

  // Equivalent gears
  $('equivalents').innerHTML = r.equivalents.map(e => {
    const current = e.ring === state.ring && e.sprocket === state.sprocket;
    const cls = !current && e.patches > r.patches ? ' class="better"' : '';
    return `<button type="button"${cls}${current ? ' aria-current="true"' : ''} data-ring="${e.ring}" data-sprocket="${e.sprocket}"
      title="${fmt(e.ratio, L)}">${e.ring}×${e.sprocket}<i>${e.patches}</i></button>`;
  }).join('');

  drawWheel($('wheel'), { ring: state.ring, sprocket: state.sprocket, patchesSingle: r.patchesSingle,
    ambidextrousGain: state.ambidextrous && r.ambidextrousGain, teethUnit: s.teeth,
    label: s.drawing(r.patchesSingle, state.ambidextrous && r.ambidextrousGain ? r.patches : 0) });

  history.replaceState(null, '', toHash(state));
  save({ ring: state.ring, sprocket: state.sprocket, tire: state.tire, customMm: state.customMm,
    ambidextrous: state.ambidextrous, lang: state.lang, unit: state.unit });
}

function openDialog(title, html) {
  $('dialog-title').textContent = title;
  $('dialog-body').innerHTML = html;
  $('dialog').showModal();
}

function wire() {
  for (const id of ['ring', 'sprocket']) {
    $(id).addEventListener('change', e => { state[id] = +e.target.value; render(); });
  }
  // Steppers with press-and-hold repeat
  document.querySelectorAll('.stepper').forEach(st => {
    const key = st.dataset.for;
    const [min, max] = key === 'ring' ? [RING_MIN, RING_MAX] : [SPROCKET_MIN, SPROCKET_MAX];
    st.querySelectorAll('button').forEach(btn => {
      let timer;
      const step = () => { state[key] = clamp(state[key] + +btn.dataset.step, min, max); render(); };
      const stop = () => clearTimeout(timer);
      btn.addEventListener('pointerdown', e => {
        e.preventDefault(); step();
        const repeat = delay => { timer = setTimeout(() => { step(); repeat(80); }, delay); };
        repeat(400);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
      btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(); } });
    });
  });
  $('tire').addEventListener('change', e => { state.tire = e.target.value; render(); });
  $('custom').addEventListener('change', e => {
    const raw = e.target.value, fromEtrto = parseEtrto(raw);
    state.customMm = fromEtrto ?? (parseInt(raw, 10) || state.customMm);
    state.customHint = fromEtrto ? `ETRTO ${raw.trim()} ≈ ${fromEtrto} mm` : '';
    render();
  });
  $('ambi').addEventListener('change', e => { state.ambidextrous = e.target.checked; render(); });
  document.querySelectorAll('input[name=lang]').forEach(el =>
    el.addEventListener('change', () => { state.lang = el.value; applyLanguage(); render(); }));
  document.querySelectorAll('input[name=unit]').forEach(el =>
    el.addEventListener('change', () => { state.unit = el.value; render(); }));
  $('equivalents').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    state.ring = +b.dataset.ring; state.sprocket = +b.dataset.sprocket; render();
  });
  document.querySelectorAll('[data-help]').forEach(el => el.addEventListener('click', () => {
    const [title, body] = t().help[el.dataset.help];
    openDialog(title, body);
  }));
  $('about-btn').addEventListener('click', () => openDialog(t().aboutTitle, t().aboutBody));
  $('dialog').addEventListener('click', e => { if (e.target === $('dialog')) $('dialog').close(); });
}

buildTireSelect();
applyLanguage();
wire();
render();
