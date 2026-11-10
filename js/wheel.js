// SVG drawing of the rear wheel (with skid patches), sprocket, chainring and chain.
// Same composition as SURPLACE's original canvas drawing.

const WX = 85, WY = 85, TIRE_R = 72, RIM_R = 65, RING_X = 215;

function teethRing(cx, cy, r, teeth) {
  const c = 2 * Math.PI * r, d = c / teeth / 2;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" class="teeth" stroke-dasharray="${d} ${d}"/>`;
}

function patchArcs(count, offsetFraction, cls) {
  const c = 2 * Math.PI * TIRE_R, period = c / count, dash = Math.max(3, period * 0.2);
  const arr = count === 1 ? `${dash} ${c - dash}` : `${dash} ${period - dash}`;
  return `<circle cx="${WX}" cy="${WY}" r="${TIRE_R}" class="${cls}" stroke-dasharray="${arr}"
    stroke-dashoffset="${-period * offsetFraction}" transform="rotate(-90 ${WX} ${WY})"/>`;
}

export function drawWheel(svg, { ring, sprocket, patchesSingle, ambidextrousGain, label, teethUnit }) {
  const rs = sprocket / 2.5, rr = ring / 2.5;
  let spokes = '';
  for (let i = 0; i < 32; i++) {
    const t = i * Math.PI * 2 / 32;
    spokes += `M${WX} ${WY}L${(WX + RIM_R * Math.cos(t)).toFixed(1)} ${(WY + RIM_R * Math.sin(t)).toFixed(1)}`;
  }
  let arms = '';
  for (let i = 0; i < 5; i++) {
    const t = -Math.PI / 2 + i * Math.PI * 2 / 5, l = rr - 3;
    arms += `M${RING_X} ${WY}L${(RING_X + l * Math.cos(t)).toFixed(1)} ${(WY + l * Math.sin(t)).toFixed(1)}`;
  }
  const cs = rs + 1.5, cr = rr + 1.5;

  svg.setAttribute('aria-label', label);
  svg.innerHTML = `
    <path class="spokes" d="${spokes}"/>
    <circle cx="${WX}" cy="${WY}" r="${RIM_R}" class="rim"/>
    <circle cx="${WX}" cy="${WY}" r="${TIRE_R}" class="tire"/>
    ${patchArcs(patchesSingle, 0, 'patch')}
    ${ambidextrousGain ? patchArcs(patchesSingle, 0.5, 'patch ambi') : ''}
    <path class="chain" d="M${WX} ${WY - cs}L${RING_X} ${WY - cr}A${cr} ${cr} 0 0 1 ${RING_X} ${WY + cr}L${WX} ${WY + cs}A${cs} ${cs} 0 0 1 ${WX} ${WY - cs}Z"/>
    <circle cx="${WX}" cy="${WY}" r="${rs}" class="metal-fill"/>
    ${teethRing(WX, WY, rs + 0.8, sprocket)}
    <circle cx="${RING_X}" cy="${WY}" r="${rr - 1.5}" class="ring-band"/>
    ${teethRing(RING_X, WY, rr + 0.8, ring)}
    <path class="arms" d="${arms}"/>
    <circle cx="${RING_X}" cy="${WY}" r="4" class="metal-fill"/>
    <text x="${WX}" y="173" text-anchor="middle">${sprocket} ${teethUnit}</text>
    <text x="${RING_X}" y="${WY + 46}" text-anchor="middle">${ring} ${teethUnit}</text>`;
}
