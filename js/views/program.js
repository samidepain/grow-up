// Écran Programme : séances, exercices, planning, réglages, la science.
import { esc, fmtDateLong, fmtKg, lowFirst, num, WEEKDAYS, withDot } from '../util.js';
import { DAY_ORDER, DAY_SHORT, KINDS, MUSCLES, PROGRAMS } from '../library.js';
import { S } from '../store.js';
import { allEx, allTpl, excluded, exDef, jumpsOn, kneeOn, mods, planDay, programOf, settings, sportInfo, sportOn, startDate, tplEst, tplItems } from '../data.js';
import { useShare } from '../backup.js';
import { VERSION } from '../version.js';

const PTABS = [['seances','Séances'],['exercices','Exercices'],['planning','Planning'],['reglages','Réglages'],['science','La science']];
export function viewProgram(){
  let h = '<h1>Programme</h1><div class="seg" role="tablist">' + PTABS.map(t => '<button type="button" class="chip' + (S.progTab === t[0] ? ' on' : '') + '" data-act="ptab" data-v="' + t[0] + '" role="tab" aria-selected="' + (S.progTab === t[0]) + '">' + t[1] + '</button>').join('') + '</div>';
  if (!S.loaded) return h + '<p class="empty">Chargement…</p>';
  if (S.progTab === 'exercices') return h + viewExercises();
  if (S.progTab === 'planning') return h + viewPlanning();
  if (S.progTab === 'reglages') return h + viewSettings();
  if (S.progTab === 'science') return h + viewScience();
  return h + viewTemplates();
}
function programCard(){
  const g = programOf() || {}; const base = PROGRAMS[g.base];
  let h = '<section class="card"><span class="label">Ton programme</span>';
  h += S.renaming
    ? '<div class="row"><input class="plain" id="prog-name" value="' + esc(g.name || '') + '" aria-label="Nom du programme" style="flex:1;width:auto;min-width:0"><button type="button" class="btn primary" data-act="prog-rename-save">Enregistrer</button></div>'
    : '<div class="row between"><h2>' + esc(g.name || 'Mon programme') + '</h2><button type="button" class="link" data-act="prog-rename">Renommer</button></div>';
  h += '<p class="muted small">' + esc(base ? base.desc : 'Ton propre programme : crée tes séances et mets-y les exercices que tu veux.') + '</p>';
  return h + '<button type="button" class="btn" data-act="prog-change">Changer de programme</button></section>';
}
export function noTplCard(){
  return '<section class="card"><h2>Crée ta première séance</h2><p class="muted">Donne-lui un nom, puis ajoute les exercices que tu veux. S’il en manque un, tu peux le créer depuis la liste.</p><button type="button" class="btn primary big" data-act="go-new-tpl">Créer une séance</button></section>';
}
function viewTemplates(){
  let h = programCard() + '<button type="button" class="btn primary" data-act="new-tpl">+ Créer une séance</button>';
  allTpl().forEach(t => {
    const its = tplItems(t);
    h += '<section class="card"><div class="row between"><div class="stack" style="gap:2px"><h3>' + esc(t.name) + '</h3><span class="muted small">' + esc(t.focus || '') + (t.focus ? ' · ' : '') + its.length + ' exercices · environ ' + tplEst(t) + ' min' + (t.edited ? ' · modifiée' : '') + (!t.builtin ? ' · perso' : '') + '</span></div></div>';
    h += '<p class="small muted">' + esc(its.map(it => { const e = exDef(it.ex); return e ? e.name : '?'; }).join(' · ')) + '</p>';
    h += '<div class="row"><button type="button" class="btn sm" data-act="edit-tpl" data-v="' + esc(t.id) + '">Modifier</button><button type="button" class="btn sm" data-act="start" data-v="' + esc(t.id) + '">Commencer</button></div></section>';
  });
  return h;
}
function viewExercises(){
  let h = '<button type="button" class="btn primary" data-act="new-ex">+ Ajouter un exercice</button><p class="muted small">Les exercices ajoutés sont disponibles dans toutes les séances et pour « Remplacer ».</p>';
  const hid = excluded(); const groups = {};
  allEx().forEach(e => { if (e.kind === 'plyo' && !jumpsOn()) return; const g = hid.indexOf(e.id) >= 0 ? 'Masqués' : e.kind === 'plyo' ? 'Pliométrie' : e.kind === 'check' ? 'Autres' : ((e.muscles.p || [])[0] || 'Autres'); (groups[g] = groups[g] || []).push(e); });
  [...MUSCLES, 'Pliométrie', 'Autres', 'Masqués'].forEach(g => {
    if (!groups[g]) return;
    h += '<section class="card"><h3>' + esc(g) + '</h3>' + (g === 'Masqués' ? '<p class="muted small">Plus proposés quand tu ajoutes ou remplaces un exercice.</p>' : '') + groups[g].map(e => '<button type="button" class="pick" data-act="edit-ex" data-v="' + esc(e.id) + '"><span class="stack" style="gap:2px"><span class="n">' + esc(e.name) + '</span><span class="m">' + esc(KINDS[e.kind] || '') + (e.kind === 'load' || e.kind === 'bw' ? ' · ' + e.sets + ' × ' + e.lo + '-' + e.hi + ' · palier ' + fmtKg(e.step) + ' kg' : '') + (e.custom ? ' · perso' : '') + '</span></span><span aria-hidden="true">›</span></button>').join('') + '</section>';
  });
  return h;
}
function viewPlanning(){
  const tpls = allTpl(); const g = programOf() || {};
  let h = '<section class="card"><h3>Planning de la semaine</h3><p class="muted small">Sert au rappel du jour, à la séance proposée et aux séries prévues par muscle. Tu peux toujours faire une autre séance n’importe quel jour.</p>';
  if (!tpls.length) h += '<p class="small">Crée d’abord tes séances dans l’onglet Séances, puis choisis-les ici.</p>';
  DAY_ORDER.forEach(wd => {
    const p = planDay(wd);
    h += '<label class="f"><span>' + esc(WEEKDAYS[wd]) + (p.label !== 'Repos' ? ' · ' + esc(p.label) : '') + '</span><select data-plan="' + wd + '">' +
      tpls.map(t => '<option value="s:' + esc(t.id) + '"' + (p.s === t.id ? ' selected' : '') + '>' + esc(t.name) + '</option>').join('') +
      '<option value="l:Repos"' + (p.s ? '' : ' selected') + '>Pas de séance</option></select></label>';
  });
  if (sportOn()) h += '<p class="muted small">Les jours de ' + esc(lowFirst(sportInfo().name)) + ' et de match se règlent dans Réglages.</p>';
  if (PROGRAMS[g.base]) h += '<button type="button" class="link" data-act="reset-plan">Revenir au planning d’origine</button>';
  return h + '</section>';
}
function viewSettings(){
  const s = settings();
  let h = '<section class="card"><h3>Ton prénom</h3><label class="f"><span>Prénom</span><input id="set-name" value="' + esc(s.name || '') + '" placeholder="Facultatif" autocomplete="given-name"></label></section>';
  h += '<section class="card"><h3>Début du programme</h3><p class="muted small">Sert à calculer la semaine du bloc de 6 semaines (5 de progression, 1 de décharge). Choisis le lundi de ta première semaine.</p><input type="date" class="plain" id="start-date" value="' + esc(startDate()) + '"></section>';
  h += '<section class="card"><h3>Taille</h3><label class="f"><span>Taille (cm)</span><input class="n" id="set-height" inputmode="decimal" value="' + esc(s.height == null ? '' : fmtKg(num(s.height))) + '" placeholder="ex. 180"></label></section>';
  h += optionsCard();
  const hid = excluded().map(exDef).filter(Boolean);
  h += '<section class="card"><h3>Exercices masqués</h3><p class="muted small">Ils ne sont plus proposés quand tu ajoutes ou remplaces un exercice. Les séances qui les contiennent ne changent pas.</p>';
  h += hid.length ? hid.map(e => '<div class="row between"><span>' + esc(e.name) + '</span><button type="button" class="btn sm" data-act="ex-unhide" data-v="' + esc(e.id) + '">Afficher à nouveau</button></div>').join('') : '<p class="small">Aucun. Pour masquer un exercice, ouvre-le dans Programme › Exercices.</p>';
  h += '</section>';
  h += '<section class="card"><h3>Tes données</h3><p class="small">Les séances sont enregistrées seulement dans ce navigateur. Exporte-les régulièrement.</p>';
  h += '<p class="small"><b>' + (s.lastExport ? esc(withDot('Dernière sauvegarde : ' + fmtDateLong(s.lastExport))) : 'Aucune sauvegarde pour l’instant.') + '</b> Seul l’export JSON compte comme sauvegarde.</p>';
  h += '<div class="row"><button type="button" class="btn" data-act="export" data-v="json">Exporter (JSON)</button><button type="button" class="btn" data-act="export" data-v="csv">Exporter les séries (CSV)</button></div>';
  if (useShare('json')) h += '<p class="muted small">«&nbsp;Exporter&nbsp;» ouvre le menu de partage&nbsp;: choisis «&nbsp;Enregistrer dans Fichiers&nbsp;» pour garder une copie, ou envoie le fichier.</p>';
  h += '<label class="f"><span>Importer un export JSON</span><input type="file" id="import-file" accept=".json,application/json"></label>';
  h += '</section>';
  h += '<p class="muted small" style="text-align:center">Grow up · version ' + esc(VERSION) + '</p>';
  return h;
}
function optionsCard(){
  const m = mods(); const sp = sportInfo(); const raw = settings().sport || {};
  const tog = (k, title, desc) => '<label class="toggle"><input type="checkbox" id="mod-' + k + '" data-act="mod" data-v="' + k + '"' + (m[k] ? ' checked' : '') + '><span><b>' + title + '</b><br><span class="muted small">' + desc + '</span></span></label>';
  let h = '<section class="card"><h3>Options</h3><p class="muted small">Désactivées au départ : active seulement ce qui te sert.</p>';
  h += tog('knee', 'Suivi d’une douleur au genou', 'Douleur le matin et pendant les séances jambes. Au-dessus de 3/10, pas de sauts et pas de hausse de charge sur les exercices qui sollicitent le genou.');
  h += tog('jumps', 'Détente et sauts', 'Exercices de pliométrie dans les séances et un test de détente pendant chaque semaine de décharge.');
  h += tog('sport', 'Sport collectif à côté', 'Tes jours d’entraînement et de match apparaissent dans ta semaine.' + (m.jumps ? ' Tu peux aussi signaler une semaine chargée : pas de sauts en salle.' : ''));
  if (m.sport) {
    const days = k => '<div class="days" role="group">' + DAY_ORDER.map(wd => '<button type="button" class="chip txt' + (sp[k].indexOf(wd) >= 0 ? ' on' : '') + '" data-act="sport-day" data-k="' + k + '" data-v="' + wd + '" aria-pressed="' + (sp[k].indexOf(wd) >= 0) + '">' + DAY_SHORT[wd] + '</button>').join('') + '</div>';
    h += '<div class="stack"><label class="f"><span>Ton sport</span><input id="set-sport" value="' + esc(raw.name || '') + '" placeholder="ex. Basket, foot, hand"></label><span class="label">Jours d’entraînement</span>' + days('train') + '<span class="label">Jours de match</span>' + days('match') + '</div>';
  }
  return h + '</section>';
}
function viewScience(){
  const sec = (t, p, src) => '<div class="stack"><h3>' + t + '</h3><p>' + p + '</p>' + (src ? '<p class="src">' + src + '</p>' : '') + '</div>';
  let h = '<section class="card sci"><h2>Comment l’appli fixe tes objectifs</h2>';
  h += sec('Reps ou charge : les deux marchent', 'Augmenter les reps à charge constante ou augmenter la charge donne une prise de muscle très proche sur 8 semaines. L’appli combine les deux (double progression) : d’abord les reps jusqu’au haut de la fourchette, puis la charge.', 'Plotkin et al., 2022, PeerJ.');
  h += sec('Quand monter la charge', 'Quand tu fais le haut de la fourchette sur toutes les séries <b>deux séances de suite</b>, ou une seule fois mais avec <b>au moins 2 reps en réserve</b> sur la dernière série. C’est l’adaptation de la recommandation de l’ACSM (1 à 2 reps de plus que la cible, deux séances de suite) et de la règle « 2 pour 2 » de la NSCA.', 'ACSM, position officielle de 2009 sur la progression en musculation.');
  h += sec('De combien monter', 'L’ACSM recommande +2 à 10 %, moins pour les petits muscles. L’appli prend +2 % (isolation), +2,5 % (haut du corps) ou +5 % (bas du corps), et le haut de la plage (5, 5 ou 10 %) si tu avais 3 reps ou plus en réserve. Le résultat est arrondi au plus petit palier de ton matériel (réglable par exercice), avec au moins un palier. Pour les tractions et les exercices au poids du corps, le pourcentage est calculé sur ton poids de corps plus le lest.', 'ACSM 2009 ; paliers de la NSCA : 1 à 2,5 kg en haut du corps, 2,5 à 5 kg en bas du corps.');
  h += sec('Combien de reps à la nouvelle charge', 'L’appli estime ta force maximale avec la formule d’Epley à partir de ta dernière série (reps faites + reps en réserve), puis calcule combien de reps tu peux faire à la nouvelle charge en gardant ta réserve cible. C’est une estimation, plus fiable entre 3 et 12 reps.', '');
  h += sec('Reps en plus', '+1 rep par série en général. +2 si tu avais 3 reps ou plus en réserve, pour te rapprocher de ta cible. Aucune rep en plus si tu étais à l’échec : tu consolides.', '');
  h += sec('Reps en réserve visées', '1 en réserve sur l’isolation, 2 sur les gros exercices (1 en fin de bloc' + (kneeOn() ? ', sauf ceux qui sollicitent le genou' : '') + '). La prise de muscle progresse quand on se rapproche de l’échec, alors que la force progresse de façon semblable sur une large plage.', 'Robinson et al., 2024, Sports Medicine (méta-régressions sur la proximité de l’échec).');
  h += sec('Charge trop lourde ou stagnation', 'Si la plupart des séries tombent sous la fourchette, l’appli recalcule une charge plus basse d’après ta force estimée. Après 3 séances à la même charge sans progrès, elle propose −10 % puis de remonter. Cette dernière règle vient de la pratique, pas d’une étude.', '');
  h += sec('Volume par muscle', 'Plus de séries par semaine donne plus de muscle, avec des gains qui diminuent progressivement. Une série compte pour 1 sur le muscle principal et 0,5 sur les muscles secondaires.', 'Pelland et al., 2026, Sports Medicine (méta-régression dose-réponse).');
  h += sec('Repos', '2 à 3 min sur les gros exercices lourds, 1 à 2 min sur les autres.', 'ACSM 2009.');
  h += sec('Décharge', 'Une semaine plus légère toutes les 6 semaines : mêmes charges, environ 1/3 de séries en moins, plus de reps en réserve' + (jumpsOn() ? ', moitié des sauts' : '') + '. Les entraîneurs placent souvent la décharge toutes les 4 à 6 semaines pendant environ 7 jours, en baissant surtout le volume. C’est un consensus de praticiens, pas une preuve expérimentale.', 'Bell et al., 2023, Sports Medicine – Open (consensus Delphi).');
  if (kneeOn()) h += sec('Genou', 'L’exercice progressif pour la hanche et le genou est la base de la prise en charge du syndrome fémoro-patellaire. Le seuil de 3/10 est un repère pratique : au-dessus, l’appli suspend les sauts et bloque les hausses de charge sur les exercices qui sollicitent le genou pendant 10 jours.', 'Willy et al., 2019, JOSPT (recommandations cliniques). Cette appli ne remplace pas un avis médical.');
  h += sec('Poids de corps', 'Pour prendre du muscle sans trop de gras, la revue d’Iraki et al. propose une hausse d’environ 0,25 à 0,5 % du poids par semaine chez les pratiquants débutants et intermédiaires. Le bilan de bloc compare ton rythme à cette cible.', 'Iraki et al., 2019, Sports (revue narrative).');
  if (jumpsOn()) h += sec('Test de détente', 'Un test par bloc, pendant la semaine de décharge, au même moment de la séance et avec la même méthode, pour que les mesures soient comparables. Le choix de la décharge (quand la fatigue est la plus basse) est une pratique de terrain.', '');
  h += sec('Alerte de fatigue', 'Si ta force estimée baisse de plus de 2,5 % sur au moins 3 exercices (et au moins 40 % de ceux faits cette semaine), l’appli propose d’avancer la décharge. Une baisse de performance sur plusieurs exercices est un signe de fatigue courant ; les seuils sont des repères de terrain.', '');
  h += sec('Sommeil et montée en charge', 'Après une nuit de moins de 6 h, l’appli conseille de garder 1 rep de plus en réserve. La montée en charge avant les gros exercices (50, 70 puis 85 % de la charge de travail) est une pratique courante. Ces deux repères viennent du terrain.', '');
  return h + '</section>';
}
