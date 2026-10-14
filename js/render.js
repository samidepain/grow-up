// Affichage : barre d’onglets et choix de l’écran à afficher.
import { $, parseIso, today } from './util.js';
import { S } from './store.js';
import { activeWorkout, needsSetup, planDay, workouts } from './data.js';
import { ensureTick } from './timers.js';
import { viewToday } from './views/today.js';
import { viewSession } from './views/session.js';
import { viewPicker } from './views/picker.js';
import { viewBilan, viewProgress } from './views/progress.js';
import { viewHistory } from './views/history.js';
import { viewProgram } from './views/program.js';
import { newSetup, viewSetup } from './views/setup.js';
import { viewDraft } from './views/editors.js';

const ICONS = {
  today:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  session:'<svg viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></svg>',
  progress:'<svg viewBox="0 0 24 24"><path d="M3 20h18M5 16l4-5 4 3 6-8"/></svg>',
  history:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  program:'<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></svg>'
};
const TABS = [['today','Aujourd’hui'],['session','Séance'],['progress','Progrès'],['history','Historique'],['program','Programme']];
function sessionDueToday(){ if (!S.loaded) return false; const d = today(); const p = planDay(parseIso(d).getDay()); return !!p.s && !workouts().some(w => w.date === d && w.status === 'terminée'); }
export function renderTabs(){
  const aw = S.loaded && activeWorkout(); const due = sessionDueToday();
  $('#tabs').innerHTML = TABS.map(t => '<button type="button" class="tab' + (S.view === t[0] ? ' on' : '') + '" data-act="tab" data-v="' + t[0] + '" aria-current="' + (S.view === t[0] ? 'page' : 'false') + '">' + ICONS[t[0]] + '<span>' + t[1] + '</span>' + ((t[0] === 'session' && aw) || (t[0] === 'today' && due && !aw) ? '<i class="dot" aria-hidden="true"></i>' : '') + '</button>').join('');
  const m = $('#mode');
  if (!S.loaded) { m.className = 'pill'; m.textContent = 'Chargement…'; }
  else { m.className = 'pill warn'; m.textContent = 'Sur cet appareil'; }
}
export function render(){
  if (needsSetup() && !S.setup) S.setup = newSetup('welcome');
  renderTabs();
  $('.tabs').hidden = !!(S.setup && S.setup.mode === 'welcome');
  const v = S.view;
  $('#app').innerHTML = S.setup ? viewSetup() : S.picker ? viewPicker() : S.draft ? viewDraft() : S.bilan ? viewBilan(S.bilan)
    : v === 'session' ? viewSession() : v === 'progress' ? viewProgress() : v === 'history' ? viewHistory() : v === 'program' ? viewProgram() : viewToday();
  if (v === 'session' && activeWorkout()) ensureTick();
}
export function kneeChips(sel, act, dis){
  let h = '<div class="chips" role="group">';
  for (let i = 0; i <= 10; i++) h += '<button type="button" class="chip' + (sel === i ? ' on' + (i > 3 ? ' hi' : '') : '') + '" data-act="' + act + '" data-v="' + i + '"' + (dis ? ' disabled' : '') + ' aria-pressed="' + (sel === i) + '">' + i + '</button>';
  return h + '</div>';
}
