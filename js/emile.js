// Émile, le coach des Loutrons : une loutre tirée du logo qui signe les conseils de l'appli.
// Il appelle la personne « loutron » ou « loutronne », ou par son prénom si elle n'a pas répondu.
import { capFirst, esc, lowFirst } from './util.js';
import { settings } from './data.js';

export function callName(){ const s = settings(); return s.sex === 'm' ? 'loutron' : s.sex === 'f' ? 'loutronne' : String(s.name || '').trim(); }
// « Loutron, ta dernière sauvegarde… » : la phrase adressée à la personne
export function hey(text){ const c = callName(); return c ? capFirst(c) + ', ' + lowFirst(text) : text; }
// Bulle d'Émile. body : HTML déjà échappé. opts : { title, tone: 'warn' | 'bad' | 'good', id, hidden, close: action du bouton Fermer }
export function emile(body, opts){
  const o = opts || {};
  return '<div class="emile' + (o.tone ? ' ' + o.tone : '') + '"' + (o.id ? ' id="' + o.id + '"' : '') + (o.hidden ? ' hidden' : '') + '><img src="icons/emile.png" alt="" width="44" height="44"><div class="bubble">'
    + '<div class="row between"><span class="who">Émile</span>' + (o.close ? '<button type="button" class="link" data-act="' + o.close + '">Fermer</button>' : '') + '</div>'
    + (o.title ? '<h3>' + esc(o.title) + '</h3>' : '') + body + '</div></div>';
}
