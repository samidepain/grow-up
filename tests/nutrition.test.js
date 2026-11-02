// Besoins et objectif de poids : Mifflin-St Jeor, activité, rythmes maximaux, plancher de la dépense au repos, IMC, moins de 18 ans.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITY, ageOn, dateAt, planFor, restingKcal } from '../js/nutrition.js';

const JOUR = '2026-11-02';
// Homme de 30 ans, 180 cm, 80 kg, surtout assis
const homme = { sex: 'm', birth: '1996-06-15', height: 180, weight: 80 };
const presque = (a, b, tol) => assert.ok(Math.abs(a - b) <= (tol || 0.01), a + ' au lieu de ' + b);

test('âge et dépense au repos (Mifflin-St Jeor)', () => {
  assert.equal(ageOn('1996-11-03', JOUR), 29);
  assert.equal(ageOn('1996-11-02', JOUR), 30);
  assert.equal(restingKcal('m', 80, 180, 30), 1780);
  assert.equal(restingKcal('f', 60, 165, 25), 1345.25);
});

test('il manque des données : rien n’est calculé', () => {
  const pl = planFor({ sex: null, birth: '1996-06-15', height: 180, weight: null }, { goal: 'keep' }, JOUR);
  assert.equal(pl.status, 'missing');
  assert.deepEqual(pl.missing, ['sex', 'weight', 'activity']);
});

test('garder son poids : dépense au repos × activité, et répartition', () => {
  const pl = planFor(homme, { activity: 'sit', goal: 'keep' }, JOUR);
  assert.equal(pl.status, 'keep');
  assert.equal(pl.kcal, Math.round(1780 * ACTIVITY.sit.pal / 10) * 10); // 2 490
  assert.deepEqual(pl.protein, [130, 175]);                              // 1,6 et 2,2 g/kg, arrondis à 5 g
  assert.deepEqual(pl.fat, [95, 110]);                                   // 35 et 40 % de 2 490 kcal
  assert.equal(pl.carbs, Math.round((pl.kcal - 130 * 4 - 95 * 9) / 4 / 5) * 5);
  assert.equal(pl.fibre, 30);
});

test('prise de poids au bon rythme : surplus d’environ 7 700 kcal par kilo', () => {
  const pl = planFor(homme, { activity: 'sit', goal: 'gain', target: 84, by: '2027-06-01' }, JOUR);
  assert.equal(pl.status, 'ok');
  presque(pl.kgWeek, 4 / (211 / 7), 1e-9);
  assert.ok(pl.pctWeek < 0.25);
  assert.equal(pl.kcal, Math.round((1780 * 1.4 + pl.kgWeek * 1100) / 10) * 10);
  assert.equal(pl.advised, dateAt({ date: JOUR, weight: 80 }, 84, 0.25)); // 0,2 kg par semaine : 20 semaines
  assert.equal(pl.advised, '2027-03-22');
});

test('prise de poids trop rapide : recadrée à 0,5 % par semaine, avec une date réaliste', () => {
  const pl = planFor(homme, { activity: 'sit', goal: 'gain', target: 90, by: '2027-01-01' }, JOUR);
  assert.equal(pl.status, 'fast');
  presque(pl.kgWeek, 0.4);
  assert.equal(pl.realistic, '2027-04-26'); // 10 kg à 0,4 kg par semaine : 25 semaines
  assert.equal(pl.kcal, Math.round((1780 * 1.4 + 0.4 * 1100) / 10) * 10);
});

test('perte trop rapide : jamais sous la dépense au repos', () => {
  // 100 kg, peu actif : le plancher (dépense au repos) limite avant les 1 % par semaine
  const p = { sex: 'm', birth: '1986-06-15', height: 180, weight: 100 };
  const pl = planFor(p, { activity: 'sit', goal: 'lose', target: 90, by: '2026-11-30' }, JOUR);
  assert.equal(pl.status, 'fast');
  assert.equal(pl.limit, 'resting');
  assert.ok(pl.kcal >= pl.bmr);
  assert.ok(Math.abs(pl.kgWeek) < 1);
});

test('perte trop rapide pour une personne active : limitée à 1 % par semaine', () => {
  const p = { sex: 'm', birth: '2001-06-15', height: 175, weight: 70 };
  const pl = planFor(p, { activity: 'hard', goal: 'lose', target: 64, by: '2026-12-14' }, JOUR);
  assert.equal(pl.status, 'fast');
  assert.equal(pl.limit, 'pct');
  presque(pl.kgWeek, -0.7);
  assert.equal(pl.realistic, '2027-01-04'); // 6 kg à 0,7 kg par semaine : 9 semaines
});

test('perte au bon rythme', () => {
  const p = { sex: 'f', birth: '1994-03-10', height: 168, weight: 70 };
  const pl = planFor(p, { activity: 'mixed', goal: 'lose', target: 66, by: '2027-02-22' }, JOUR);
  assert.equal(pl.status, 'ok');
  presque(pl.kgWeek, -0.25);
  assert.equal(pl.kcal, Math.round((restingKcal('f', 70, 168, 32) * 1.55 - 0.25 * 1100) / 10) * 10);
});

test('poids visé sous un IMC de 18,5 : refusé, on garde son poids', () => {
  const p = { sex: 'f', birth: '1994-03-10', height: 160, weight: 52 };
  const pl = planFor(p, { activity: 'sit', goal: 'lose', target: 45, by: '2027-06-01' }, JOUR);
  assert.equal(pl.status, 'bmi');
  assert.equal(pl.minKg, 47.5);
  assert.equal(pl.kgWeek, 0);
  assert.equal(pl.kcal, pl.base);
});

test('moins de 18 ans : pas d’objectif de perte, la prise reste possible', () => {
  const ado = { sex: 'm', birth: '2010-01-01', height: 175, weight: 65 };
  assert.equal(planFor(ado, { activity: 'sit', goal: 'lose', target: 60, by: '2027-06-01' }, JOUR).status, 'minor');
  assert.equal(planFor(ado, { activity: 'sit', goal: 'gain', target: 67, by: '2027-06-01' }, JOUR).status, 'ok');
});

test('objectif incomplet ou incohérent : poids visé, sens, date', () => {
  assert.equal(planFor(homme, { activity: 'sit', goal: 'gain' }, JOUR).status, 'target');
  assert.equal(planFor(homme, { activity: 'sit', goal: 'lose', target: 85, by: '2027-06-01' }, JOUR).status, 'direction');
  assert.equal(planFor(homme, { activity: 'sit', goal: 'gain', target: 84 }, JOUR).status, 'date');
  assert.equal(planFor(homme, { activity: 'sit', goal: 'gain', target: 84, by: '2026-10-01' }, JOUR).status, 'date');
});

test('le rythme part du poids et de la date où l’objectif a été fixé', () => {
  const n = { activity: 'sit', goal: 'lose', target: 78, by: '2027-01-26', start: { date: '2026-10-06', weight: 82 } };
  const pl = planFor(homme, n, JOUR);
  assert.equal(pl.status, 'ok');
  presque(pl.kgWeek, -4 / (112 / 7), 1e-9);
});
