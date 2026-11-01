// Premier lancement et changement de programme.
import { esc } from '../util.js';
import { DAY_ORDER, DAY_SHORT, PROGRAMS } from '../library.js';
import { S } from '../store.js';
import { settings } from '../data.js';

export function newSetup(mode){ return { mode, name: settings().name || '', prog:null, progName:'', days:[], restart:true }; }
export function viewSetup(){
  const U = S.setup; const first = U.mode === 'welcome';
  let h = '';
  if (first) {
    h += '<section class="card welcome"><img class="hero-logo" src="icons/logo.png" alt="La loutre des Loutrons qui soulève une barre" width="128" height="128"><h1>Bienvenue chez les Loutrons</h1><p>Note tes séances : l’appli calcule tes objectifs de charge et de reps à partir des précédentes.</p><p class="muted small">Tout reste sur ce téléphone, sans compte. Pense à exporter une sauvegarde de temps en temps (Programme › Réglages).</p></section>';
    h += '<section class="card"><h3>Ton prénom</h3><label class="f"><span>Prénom (facultatif)</span><input id="setup-name" data-u="name" value="' + esc(U.name) + '" autocomplete="given-name"></label></section>';
  } else {
    h += '<div class="row between"><h1>Changer de programme</h1><button type="button" class="link" data-act="setup-cancel">Annuler</button></div><p class="muted small">Ton historique et les séances que tu as créées sont gardés. Le planning est remplacé.</p>';
  }
  const opt = (k, title, desc) => '<button type="button" class="pick' + (U.prog === k ? ' on' : '') + '" data-act="setup-prog" data-v="' + k + '" aria-pressed="' + (U.prog === k) + '"><span class="stack" style="gap:2px"><span class="n">' + esc(title) + '</span><span class="m">' + esc(desc) + '</span></span><span aria-hidden="true">' + (U.prog === k ? '✓' : '') + '</span></button>';
  h += '<section class="card"><h3>' + (first ? 'Ton programme de départ' : 'Nouveau programme') + '</h3>';
  Object.keys(PROGRAMS).forEach(k => { h += opt(k, PROGRAMS[k].name, PROGRAMS[k].desc); });
  h += opt('custom', 'Créer mon programme', 'Tu le nommes, tu crées tes séances et tu choisis tes exercices.');
  if (U.prog === 'custom') h += '<label class="f"><span>Nom de ton programme</span><input id="setup-pname" data-u="progName" value="' + esc(U.progName) + '" placeholder="ex. Prise de masse"></label><p class="muted small">Tu choisiras tes jours dans Programme › Planning, une fois tes séances créées.</p>';
  h += '</section>';
  if (PROGRAMS[U.prog]) {
    const n = PROGRAMS[U.prog].tpls.length;
    h += '<section class="card"><h3>Tes jours de salle</h3><p class="muted small">Ce programme compte ' + n + ' séances : choisis ' + n + ' jours. Elles sont réparties dans l’ordre de la semaine.</p><div class="days" role="group">' +
      DAY_ORDER.map(wd => { const on = U.days.indexOf(wd) >= 0; return '<button type="button" class="chip txt' + (on ? ' on' : '') + '" data-act="setup-day" data-v="' + wd + '" aria-pressed="' + on + '">' + DAY_SHORT[wd] + '</button>'; }).join('') + '</div></section>';
  }
  if (!first) h += '<section class="card"><label class="toggle"><input type="checkbox" id="setup-restart" data-act="setup-restart"' + (U.restart ? ' checked' : '') + '><span><b>Recommencer en semaine 1</b><br><span class="muted small">Nouveau bloc de 6 semaines, en commençant par une semaine de calibration.</span></span></label></section>';
  else h += '<p class="muted small">Suivi du genou, tests de détente, sport collectif à côté : ces options s’activent plus tard dans Programme › Réglages.</p>';
  h += '<button type="button" class="btn primary big" data-act="setup-done">' + (first ? 'C’est parti' : 'Changer de programme') + '</button>';
  if (first) h += '<section class="card"><h3>Tu as déjà une sauvegarde ?</h3><p class="muted small">Importe ton fichier d’export pour retrouver tes séances et tes réglages.</p><label class="f"><span>Importer un export JSON</span><input type="file" id="import-file" accept=".json,application/json"></label></section>';
  return h;
}
