// Premier lancement et changement de programme.
import { esc, today } from '../util.js';
import { DAY_ORDER, DAY_SHORT, PROGRAMS } from '../library.js';
import { S } from '../store.js';
import { settings } from '../data.js';
import { sexChips } from './profile.js';

export function newSetup(mode){ return { mode, name: settings().name || '', sex:null, birth:'', height:'', weight:'', prog:null, progName:'', days:[], restart:true }; }
export function viewSetup(){
  const U = S.setup; const first = U.mode === 'welcome';
  let h = '';
  if (first) {
    h += '<section class="card welcome"><img class="hero-logo" src="icons/logo.png" alt="La loutre des Loutrons qui soulève une barre" width="128" height="128"><h1>Bienvenue chez les Loutrons</h1><p>Note tes séances : l’appli calcule tes objectifs de charge et de reps à partir des précédentes.</p><p class="muted small">Tout reste sur ce téléphone, sans compte. Pense à exporter une sauvegarde de temps en temps, depuis ton profil (le rond en haut à droite).</p></section>';
    h += '<section class="card"><h3>Toi</h3><label class="f"><span>Prénom ou pseudo</span><input id="setup-name" data-u="name" value="' + esc(U.name) + '" autocomplete="nickname" required></label>' + sexChips('setup-sex', U.sex);
    h += '<label class="f"><span>Date de naissance</span><input type="date" id="setup-birth" data-u="birth" value="' + esc(U.birth) + '" max="' + today() + '"></label>';
    h += '<div class="fields"><label class="f"><span>Taille (cm)</span><input class="n" id="setup-height" data-u="height" inputmode="decimal" value="' + esc(U.height) + '" placeholder="ex. 180"></label>';
    h += '<label class="f"><span>Poids (kg)</span><input class="n" id="setup-weight" data-u="weight" inputmode="decimal" value="' + esc(U.weight) + '" placeholder="ex. 75"></label></div>';
    h += '<p class="muted small">Seul le prénom ou pseudo est obligatoire. Le reste aide l’appli à mieux te conseiller ; tu pourras le compléter plus tard dans ton profil.</p></section>';
  } else {
    h += '<div class="row between"><h1>Changer de programme</h1><button type="button" class="link" data-act="setup-cancel">Annuler</button></div><p class="muted small">Ton historique et les séances que tu as créées sont gardés. Le planning est remplacé.</p>';
  }
  const opt = (k, title, desc) => '<button type="button" class="pick' + (U.prog === k ? ' on' : '') + '" data-act="setup-prog" data-v="' + k + '" aria-pressed="' + (U.prog === k) + '"><span class="stack" style="gap:2px"><span class="n">' + esc(title) + '</span><span class="m">' + esc(desc) + '</span></span><span aria-hidden="true">' + (U.prog === k ? '✓' : '') + '</span></button>';
  h += '<section class="card"><h3>' + (first ? 'Ton programme de départ' : 'Nouveau programme') + '</h3>';
  Object.keys(PROGRAMS).forEach(k => { h += opt(k, PROGRAMS[k].name, PROGRAMS[k].desc); });
  h += opt('custom', 'Créer mon programme', 'Tu le nommes, tu crées tes séances et tu choisis tes exercices.');
  if (U.prog === 'custom') h += '<label class="f"><span>Nom de ton programme</span><input id="setup-pname" data-u="progName" value="' + esc(U.progName) + '" placeholder="ex. Prise de masse"></label><p class="muted small">Tu choisiras tes jours dans Entraînement › Planning, une fois tes séances créées.</p>';
  h += '</section>';
  if (PROGRAMS[U.prog]) {
    const n = PROGRAMS[U.prog].tpls.length;
    h += '<section class="card"><h3>Tes jours de salle</h3><p class="muted small">Ce programme compte ' + n + ' séances : choisis ' + n + ' jours. Elles sont réparties dans l’ordre de la semaine.</p><div class="days" role="group">' +
      DAY_ORDER.map(wd => { const on = U.days.indexOf(wd) >= 0; return '<button type="button" class="chip txt' + (on ? ' on' : '') + '" data-act="setup-day" data-v="' + wd + '" aria-pressed="' + on + '">' + DAY_SHORT[wd] + '</button>'; }).join('') + '</div></section>';
  }
  if (!first) h += '<section class="card"><label class="toggle"><input type="checkbox" id="setup-restart" data-act="setup-restart"' + (U.restart ? ' checked' : '') + '><span><b>Recommencer en semaine 1</b><br><span class="muted small">Nouveau bloc de 6 semaines, en commençant par une semaine de calibration.</span></span></label></section>';
  else h += '<p class="muted small">Suivi du genou, tests de détente, sport collectif à côté : ces options s’activent plus tard dans ton profil.</p>';
  h += '<button type="button" class="btn primary big" data-act="setup-done">' + (first ? 'C’est parti' : 'Changer de programme') + '</button>';
  if (first) h += '<section class="card"><h3>Tu as déjà une sauvegarde ?</h3><p class="muted small">Importe ton fichier d’export pour retrouver tes séances et tes réglages.</p><label class="f"><span>Importer un export JSON</span><input type="file" id="import-file" accept=".json,application/json"></label></section>';
  return h;
}
