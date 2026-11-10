import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEtrto } from '../js/tires.js';
import { gcd, ratio, skidPatches, developmentM, gearInches, speedKmh, equivalents, analyse } from '../js/calc.js';

const close = (a, b, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test('gcd', () => {
  assert.equal(gcd(46, 18), 2);
  assert.equal(gcd(47, 17), 1);
  assert.equal(gcd(48, 16), 16);
});

test('ratio', () => close(ratio(46, 18), 2.556, 0.001));

test('skid patches match the original calculator', () => {
  assert.equal(skidPatches(46, 18), 9);
  assert.equal(skidPatches(46, 18, true), 18);   // 46/2 = 23 is odd → doubled
  assert.equal(skidPatches(48, 16), 1);
  assert.equal(skidPatches(48, 16, true), 2);    // 48/16 = 3 odd → doubled
  assert.equal(skidPatches(44, 16), 4);
});

test('ambidextrous rule: reduced ring odd doubles, even does not', () => {
  // 44×16: g=4, ring/g=11 (odd) → 8
  assert.equal(skidPatches(44, 16, true), 8);
  // 48×18: g=6, ring/g=8 (even) → stays 3
  assert.equal(skidPatches(48, 18, true), 3);
  // 47×17: coprime → 17, ring 47 odd → 34
  assert.equal(skidPatches(47, 17, true), 34);
});

test('development, gear inches and speed for 46×18 on 700×23', () => {
  const dev = developmentM(46, 18, 2097);
  close(dev, 5.359);
  close(gearInches(46, 18, 2097), 67.16);
  close(speedKmh(dev, 90), 28.94);
});

test('equivalents within ±2 % include the gear itself', () => {
  const eq = equivalents(46, 18);
  assert.ok(eq.some(e => e.ring === 46 && e.sprocket === 18));
  assert.ok(eq.some(e => e.ring === 41 && e.sprocket === 16 && e.patches === 16));
  for (const e of eq) assert.ok(Math.abs(e.ratio - 46 / 18) < 46 / 18 * 0.02);
});

test('analyse returns 9 cadences from 50 to 130', () => {
  const a = analyse({ ring: 46, sprocket: 18, circumferenceMm: 2097, ambidextrous: true });
  assert.deepEqual(a.speeds.map(s => s.rpm), [50, 60, 70, 80, 90, 100, 110, 120, 130]);
  assert.equal(a.patches, 18);
  assert.equal(a.ambidextrousGain, true);
  close(a.speeds[4].mph, 17.98);
});

test('ETRTO converts to a circumference close to the measured table', () => {
  assert.equal(parseEtrto('23-622'), 2099);   // table: 2097
  assert.equal(parseEtrto('25 x 622'), 2111); // table: 2105
  assert.equal(parseEtrto('2105'), null);
  assert.equal(parseEtrto('abc'), null);
});
