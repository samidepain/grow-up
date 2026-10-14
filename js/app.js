// Point d’entrée : chargement des données, premier affichage, service worker.
import { loadDocs, S, usingIdb } from './store.js';
import { upgradeLegacy } from './data.js';
import { render, renderTabs } from './render.js';
import './actions.js'; // écoute les clics, saisies et changements

async function init(){
  renderTabs(); render();
  await loadDocs();
  S.loaded = true;
  upgradeLegacy();
  render();
  if (usingIdb() && navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(() => {});
}
init();
if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
