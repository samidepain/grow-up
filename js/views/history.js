// Écran Historique.
import { esc, fmtDateLong, fmtKg, num } from '../util.js';
import { S } from '../store.js';
import { activeWorkout, countSets, itemsOf, validSets, wName, workouts } from '../data.js';

export function viewHistory(){
  if (!S.loaded) return '<p class="empty">Chargement…</p>';
  const ws = workouts().reverse(); const aw = activeWorkout();
  let h = '<h1>Historique</h1>';
  if (!ws.length) return h + '<section class="card"><p class="muted">Tes séances apparaîtront ici dès que tu en auras commencé une.</p></section>';
  ws.forEach(w => {
    const open = S.openHist === w.id;
    h += '<section class="card"><button type="button" class="hitem" data-act="hist" data-v="' + w.id + '" aria-expanded="' + open + '"><span class="stack" style="gap:2px"><span class="n">' + esc(wName(w)) + '</span><span class="muted small">' + esc(fmtDateLong(w.date)) + ' · ' + (w.status === 'en_cours' ? 'en cours' : (w.duration || 0) + ' min') + ' · ' + countSets(w) + ' séries' + (w.knee != null ? ' · genou ' + w.knee + '/10' : '') + '</span></span><span class="pill' + (w.deload ? ' court' : '') + '">' + (w.deload ? 'Décharge' : 'S' + w.week) + '</span></button>';
    if (open) {
      h += '<div class="hdetail">';
      itemsOf(w).forEach(it => {
        const st = w.ex && w.ex[it.ex]; if (!st) return;
        if (it.kind === 'check') { h += '<p>' + esc(it.name) + ' : ' + (st.done ? 'fait' : 'non fait') + '</p>'; return; }
        const vs = validSets(st.sets);
        if (!vs.length) { h += '<p class="muted">' + esc(it.name) + ' : ' + (st.skip ? 'non fait (prévu)' : 'aucune série') + '</p>'; return; }
        h += '<p><b>' + esc(it.name) + '</b> : ' + (it.kind === 'plyo' ? vs.length + ' séries' : vs.map(x => (it.kind === 'bw' && !num(x.kg) ? 'PdC' : fmtKg(num(x.kg))) + '×' + x.reps).join(' · ')) + (st.rir != null ? ' · ' + (st.rir >= 4 ? '4+' : st.rir) + ' en réserve' : '') + '</p>';
      });
      if (w.notes) h += '<p class="muted">Notes : ' + esc(w.notes) + '</p>';
      h += '<div class="row">';
      if (w.status !== 'en_cours' && !aw) h += '<button type="button" class="btn" data-act="reopen" data-v="' + w.id + '">Rouvrir pour corriger</button>';
      h += S.confirm === w.id ? '<button type="button" class="btn danger" data-act="del-w" data-v="' + w.id + '">Confirmer la suppression</button><button type="button" class="btn" data-act="cancel-confirm">Annuler</button>' : '<button type="button" class="btn danger" data-act="ask-del-w" data-v="' + w.id + '">Supprimer</button>';
      h += '</div></div>';
    }
    h += '</section>';
  });
  return h;
}
