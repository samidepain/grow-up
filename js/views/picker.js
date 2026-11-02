// Choix d’un exercice (ajouter ou remplacer).
import { esc } from '../util.js';
import { KINDS } from '../library.js';
import { S } from '../store.js';
import { activeWorkout, canon, exDef, itemsOf, offeredEx, searchEx } from '../data.js';

export function pickerList(){
  const P = S.picker; const q = (P.q || '').trim();
  let ref = null;
  if (P.mode === 'replace') { const w = activeWorkout(); const it = w && itemsOf(w)[P.idx]; ref = it ? (exDef(it.ex) || it) : null; }
  const exclude = new Set();
  if (P.mode === 'replace' || P.mode === 'add') { const w = activeWorkout(); if (w) Object.keys(w.ex).forEach(k => exclude.add(canon(k))); }
  let list = searchEx(offeredEx().filter(e => !exclude.has(e.id)), q);
  const score = e => { if (!ref || !ref.muscles) return 0; let s = 0; (ref.muscles.p || []).forEach(x => { if ((e.muscles.p || []).indexOf(x) >= 0) s += 3; else if ((e.muscles.s || []).indexOf(x) >= 0) s += 1; }); if (e.kind === ref.kind) s += 0.5; return s; };
  // Avec une recherche, on garde l'ordre de la recherche ; sans recherche, les exercices du même muscle d'abord
  list = list.map(e => ({ e, s:score(e) }));
  if (!q) list.sort((a, b) => b.s - a.s || a.e.name.localeCompare(b.e.name, 'fr'));
  const row = x => '<button type="button" class="pick" data-act="pick" data-v="' + esc(x.e.id) + '"><span class="stack" style="gap:2px"><span class="n">' + esc(x.e.name) + '</span><span class="m">' + esc(KINDS[x.e.kind] || '') + ((x.e.muscles.p || []).length ? ' · ' + x.e.muscles.p.join(', ') : '') + (x.e.custom ? ' · perso' : '') + '</span></span><span aria-hidden="true">›</span></button>';
  if (q) return list.map(row).join('') || '<p class="empty">Aucun exercice trouvé. Crée-le avec le bouton ci-dessus.</p>';
  const same = list.filter(x => x.s >= 3); const rest = list.filter(x => x.s < 3);
  let h = '';
  if (ref && same.length) h += '<span class="label">Même muscle</span>' + same.map(row).join('') + '<span class="label">Autres exercices</span>';
  h += rest.map(row).join('');
  return h || '<p class="empty">Aucun exercice trouvé. Crée-le avec le bouton ci-dessus.</p>';
}
export function viewPicker(){
  const P = S.picker; const w = activeWorkout();
  const title = P.mode === 'replace' ? 'Remplacer un exercice' : 'Ajouter un exercice';
  let sub = '';
  if (P.mode === 'replace' && w) { const it = itemsOf(w)[P.idx]; sub = it ? 'À la place de « ' + it.name + ' ». Les séries et la place dans le superset sont gardées.' : ''; }
  let h = '<section class="card"><div class="row between"><h2>' + title + '</h2><button type="button" class="link" data-act="pick-cancel">Annuler</button></div>' + (sub ? '<p class="muted small">' + esc(sub) + '</p>' : '');
  if (P.mode === 'replace' && w && w.tpl) h += '<label class="toggle"><input type="checkbox" id="pick-tpl" data-act="pick-tpl"' + (P.alsoTpl ? ' checked' : '') + '><span><b>Remplacer aussi dans « ' + esc(w.name || '') + ' »</b><br><span class="muted small">Sinon, le changement vaut seulement pour aujourd’hui.</span></span></label>';
  h += '<input class="plain" id="pick-q" data-pq="1" placeholder="Rechercher un exercice ou un muscle" value="' + esc(P.q || '') + '" autocomplete="off">';
  h += '<button type="button" class="btn" data-act="new-ex-from-pick">+ Créer un nouvel exercice</button>';
  h += '<div class="stack" id="pick-list">' + pickerList() + '</div></section>';
  return h;
}
