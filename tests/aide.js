// Outils des tests : données en mémoire et date simulée, sans navigateur.
import { mock } from 'node:test';
import { S } from '../js/store.js';

// Remplace toutes les données de l'appli (rien n'est écrit : S.loaded reste faux)
export function donnees(docs){ S.docs = new Map(Object.entries(JSON.parse(JSON.stringify(docs)))); }

// Fixe la date du jour, à 9 h
export function jour(isoDate){
  mock.timers.reset();
  mock.timers.enable({ apis: ['Date'], now: new Date(isoDate + 'T09:00:00') });
}

// Réglages de base : programme exemple commencé le lundi 7 septembre 2026, options désactivées
export function reglages(extra){
  return Object.assign({ start: '2026-09-07', program: { base: 'exemple', name: 'Programme exemple', days: [1, 2, 5, 0] }, modules: { knee: false, jumps: false, sport: false } }, extra);
}

// Une séance terminée. exos : { id: { kg, reps: [..], rir } }. Renvoie [identifiant, document].
let n = 0;
export function seance(date, exos, extra){
  n++;
  const ex = {};
  Object.keys(exos).forEach(id => {
    const x = exos[id];
    ex[id] = { sets: x.reps.map(r => ({ kg: String(x.kg), reps: String(r), done: true })), rir: x.rir == null ? null : x.rir, done: false, skip: false };
  });
  return ['w_' + date.replace(/-/g, '') + '_t' + n, Object.assign({ date, status: 'terminée', startedAt: n, deload: false, ex }, extra)];
}

// Construit les documents : réglages, puis des paires [id, doc] ou des objets { id: doc }
export function docs(settings, ...parts){
  const out = { settings };
  parts.forEach(p => { if (Array.isArray(p)) out[p[0]] = p[1]; else Object.assign(out, p); });
  return out;
}
