// Alerte de fatigue : force estimée en baisse de plus de 2,5 % sur au moins 3 exercices
// et au moins 40 % des exercices comparés dans la semaine (règle de terrain).
import { test, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { fatigueCheck } from '../js/engine.js';
import { donnees, jour, reglages, seance, docs } from './aide.js';

afterEach(() => mock.timers.reset());

const avant = { kg: 100, reps: [8, 8, 8], rir: 2 };  // 1RM estimé 126,7 kg
const baisse = { kg: 100, reps: [6, 6, 6], rir: 2 }; // 1RM estimé 120 kg : −5 %
const pareil = avant;

function semaine(apres, extra){
  return docs(reglages(extra),
    seance('2026-09-15', { la_hack: avant, la_rdl: avant, lb_press: avant, lb_thrust: avant }),
    seance('2026-09-29', apres),
    { 'b_2026-09-28': { date: '2026-09-28', sleep: 6 }, 'b_2026-09-29': { date: '2026-09-29', sleep: 5 } });
}

test('baisse sur 3 exercices sur 4 : alerte, avec les exercices et le sommeil moyen', () => {
  jour('2026-09-30');
  donnees(semaine({ la_hack: baisse, la_rdl: baisse, lb_press: baisse, lb_thrust: pareil }));
  const f = fatigueCheck();
  assert.ok(f);
  assert.equal(f.compared, 4);
  assert.deepEqual(f.drops, ['Hack squat (−5 %)', 'RDL (soulevé de terre roumain) (−5 %)', 'Presse à cuisses (−5 %)']);
  assert.equal(f.avgSleep, 5.5);
});

test('baisse sur 2 exercices seulement : pas d’alerte', () => {
  jour('2026-09-30');
  donnees(semaine({ la_hack: baisse, la_rdl: baisse, lb_press: pareil, lb_thrust: pareil }));
  assert.equal(fatigueCheck(), null);
});

test('3 baisses mais moins de 40 % des exercices comparés : pas d’alerte', () => {
  jour('2026-09-30');
  const ids = ['la_hack', 'la_rdl', 'lb_press', 'lb_thrust', 'lb_curl', 'lb_abd', 'ua_bench', 'ub_row'];
  const tous = {}; ids.forEach(id => { tous[id] = avant; });
  const apres = {}; ids.forEach((id, i) => { apres[id] = i < 3 ? baisse : pareil; });
  donnees(docs(reglages(), seance('2026-09-15', tous), seance('2026-09-29', apres)));
  assert.equal(fatigueCheck(), null); // 3 sur 8 = 37,5 %
});

test('seuil de 2,5 % : une baisse de 2,4 % ne compte pas, une baisse de 2,6 % compte', () => {
  jour('2026-09-30');
  const b24 = { kg: 97.6, reps: [8, 8, 8], rir: 2 }, b26 = { kg: 97.4, reps: [8, 8, 8], rir: 2 };
  donnees(semaine({ la_hack: b24, la_rdl: b24, lb_press: b24, lb_thrust: b24 }));
  assert.equal(fatigueCheck(), null);
  donnees(semaine({ la_hack: b26, la_rdl: b26, lb_press: b26, lb_thrust: b24 }));
  const f = fatigueCheck();
  assert.ok(f);
  assert.equal(f.drops.length, 3);
  assert.equal(f.drops[0], 'Hack squat (−3 %)'); // affiché au moins à 3 %
});

test('pas d’alerte pendant la semaine de décharge, ni si elle a été ignorée cette semaine', () => {
  const apres = { la_hack: baisse, la_rdl: baisse, lb_press: baisse, lb_thrust: pareil };
  jour('2026-09-30');
  donnees(semaine(apres, { fatigueDismiss: '2026-09-28' }));
  assert.equal(fatigueCheck(), null);
  donnees(semaine(apres, { start: '2026-08-24' })); // le 30 septembre tombe en semaine 6
  assert.equal(fatigueCheck(), null);
});
