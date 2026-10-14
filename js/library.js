// Bibliothèque d’exercices, séances modèles et programmes de départ.

export const MUSCLES = ['Pectoraux','Dos','Épaules','Biceps','Triceps','Quadriceps','Ischios','Fessiers','Mollets','Abdos'];
export const KINDS = { load:'Charge', bw:'Poids du corps + lest', plyo:'Pliométrie', check:'À cocher' };
export const CATS = { lower:'Polyarticulaire bas du corps', upper:'Polyarticulaire haut du corps', iso:'Isolation (petit muscle)' };
export const M = (p, s) => ({ p: p || [], s: s || [] });
export const BASE_EX = {
  ua_bench:{name:'Développé couché haltères ou machine', kind:'load', cat:'upper', step:2, sets:3, lo:6, hi:8, rest:150, muscles:M(['Pectoraux'],['Triceps','Épaules']), cue:'Omoplates serrées, descente contrôlée. Avec des haltères, note le poids d’un haltère.'},
  ua_pull:{name:'Tractions pronation', kind:'bw', cat:'upper', step:1.25, sets:4, lo:5, hi:7, rest:150, muscles:M(['Dos'],['Biceps']), cue:'Arrête-toi 1-2 reps avant l’échec. Le poids noté est le lest (0 = poids du corps).'},
  ua_lat:{name:'Élévations latérales', kind:'load', cat:'iso', step:1, sets:3, lo:12, hi:15, rest:75, muscles:M(['Épaules']), cue:'Monte jusqu’à l’horizontale, sans élan. Note le poids d’un haltère.'},
  ua_rear:{name:'Reverse fly (arrière d’épaule)', kind:'load', cat:'iso', step:1, sets:3, lo:12, hi:15, rest:75, muscles:M(['Épaules']), cue:'Bras presque tendus, tire vers l’arrière sans hausser les épaules.'},
  ua_skull:{name:'Barre au front', kind:'load', cat:'iso', step:2, sets:3, lo:8, hi:12, rest:75, muscles:M(['Triceps']), cue:'Si les coudes gênent, remplace par l’extension à la poulie au-dessus de la tête.'},
  ua_curl:{name:'Curl incliné', kind:'load', cat:'iso', step:1, sets:3, lo:10, hi:12, rest:75, muscles:M(['Biceps']), cue:'Bras derrière le buste, pas de balancier.'},
  ua_abs:{name:'Abdos à la poulie', kind:'load', cat:'iso', step:2.5, sets:3, lo:8, hi:12, rest:60, muscles:M(['Abdos']), cue:'Enroule le buste, bassin fixe.'},
  la_warm:{name:'Échauffement jambes', kind:'check', cue:'5 min de vélo, 2×10 pas latéraux avec élastique, 2×10 mobilité de cheville au mur (genou vers l’avant, talon au sol), 2×10 squats lents.'},
  la_pogo:{name:'Pogos', kind:'plyo', sets:2, lo:10, unit:'contacts', cue:'Rebonds rapides sur l’avant du pied, genoux presque tendus.'},
  la_cmj:{name:'Sauts avec contre-mouvement', kind:'plyo', sets:3, lo:4, unit:'sauts', cue:'Explosifs, réception souple. Arrête la série si la hauteur baisse nettement.'},
  la_hack:{name:'Hack squat', kind:'load', cat:'lower', step:5, sets:3, lo:5, hi:8, rest:150, knee:true, muscles:M(['Quadriceps'],['Fessiers']), cue:'Position de pieds confortable, descente contrôlée, amplitude sans douleur.'},
  la_rdl:{name:'RDL (soulevé de terre roumain)', kind:'load', cat:'lower', step:2.5, sets:3, lo:6, hi:8, rest:150, muscles:M(['Ischios','Fessiers']), cue:'Hanches vers l’arrière, dos neutre, barre près des jambes.'},
  la_step:{name:'Step-ups avec haltères', kind:'load', cat:'lower', step:2, sets:3, lo:6, hi:8, rest:90, uni:true, knee:true, muscles:M(['Quadriceps','Fessiers']), cue:'Reps par jambe, poids d’un haltère.'},
  la_ext:{name:'Leg extension à une jambe', kind:'load', cat:'iso', step:2.5, sets:2, lo:10, hi:12, rest:75, uni:true, knee:true, muscles:M(['Quadriceps']), cue:'Reps par jambe. Descente contrôlée, pause d’1 s jambe tendue.', cueKnee:'Commence entre 90° et 45-60° de flexion, puis gagne environ 10° vers l’extension toutes les 2 semaines sans réaction. Au-dessus de 3/10, reviens à la plage précédente.'},
  la_calf:{name:'Mollets debout lourds', kind:'load', cat:'iso', step:5, sets:3, lo:6, hi:10, rest:75, muscles:M(['Mollets']), cue:'Pause d’1 s en bas, montée complète.'},
  ub_incl:{name:'Développé incliné haltères', kind:'load', cat:'upper', step:2, sets:3, lo:8, hi:10, rest:120, muscles:M(['Pectoraux'],['Épaules','Triceps']), cue:'Banc à environ 30°, note le poids d’un haltère.'},
  ub_chin:{name:'Tractions prise neutre ou supination', kind:'bw', cat:'upper', step:1.25, sets:3, lo:6, hi:10, rest:120, muscles:M(['Dos'],['Biceps']), cue:'Arrête-toi 1-2 reps avant l’échec. Passe à 2 séries si les coudes ou la récupération se dégradent.'},
  ub_row:{name:'Rowing buste appuyé', kind:'load', cat:'upper', step:2.5, sets:3, lo:6, hi:10, rest:120, muscles:M(['Dos'],['Biceps']), cue:'Poitrine sur un banc incliné ou une machine, coudes vers les hanches.'},
  ub_fly:{name:'Pec fly', kind:'load', cat:'iso', step:2.5, sets:2, lo:12, hi:15, rest:75, muscles:M(['Pectoraux']), cue:'Coudes légèrement fléchis, étirement contrôlé.'},
  ub_ham:{name:'Curl marteau', kind:'load', cat:'iso', step:1, sets:3, lo:10, hi:12, rest:75, muscles:M(['Biceps']), cue:'Prise neutre, coudes collés au corps.'},
  ub_rope:{name:'Extensions triceps à la corde', kind:'load', cat:'iso', step:2.5, sets:3, lo:10, hi:12, rest:75, muscles:M(['Triceps']), cue:'Écarte la corde en bas du mouvement.'},
  ub_abs:{name:'Abdos', kind:'check', cue:'10 min, seulement si tu restes sous 1h30.'},
  lb_rope:{name:'Corde à sauter', kind:'plyo', sets:3, lo:20, unit:'s', optional:true, cue:'Optionnelle : à faire si tu te sens frais.', cueSport:'Optionnelle : seulement les semaines avec une seule séance de {sport}.'},
  lb_press:{name:'Presse à cuisses', kind:'load', cat:'lower', step:10, sets:3, lo:8, hi:12, rest:150, knee:true, muscles:M(['Quadriceps'],['Fessiers']), cue:'Position de pieds confortable, descente contrôlée.'},
  lb_thrust:{name:'Hip thrust', kind:'load', cat:'lower', step:5, sets:3, lo:6, hi:10, rest:150, muscles:M(['Fessiers'],['Ischios']), cue:'Pause d’1 s en haut, menton rentré.'},
  lb_curl:{name:'Leg curl', kind:'load', cat:'iso', step:2.5, sets:3, lo:8, hi:12, rest:75, muscles:M(['Ischios']), cue:'Descente lente, hanches plaquées.'},
  lb_abd:{name:'Hip abduction', kind:'load', cat:'iso', step:2.5, sets:3, lo:12, hi:15, rest:75, muscles:M(['Fessiers']), cue:'Pause d’1 s jambes écartées.'},
  lb_back:{name:'Back extensions', kind:'bw', cat:'iso', step:2.5, sets:2, lo:12, hi:15, rest:75, muscles:M(['Fessiers','Ischios']), cue:'Charnière de hanche, pense fessiers et ischios. Le poids noté est le lest (0 = poids du corps).'},
  lb_calf:{name:'Mollets à la presse', kind:'load', cat:'iso', step:5, sets:3, lo:12, hi:15, rest:75, muscles:M(['Mollets']), cue:'Amplitude complète, pause en bas.'},
  // Alternatives utiles pour remplacer un exercice
  lib_press1:{name:'Presse à une jambe', kind:'load', cat:'lower', step:5, sets:3, lo:8, hi:12, rest:90, uni:true, knee:true, muscles:M(['Quadriceps','Fessiers']), cue:'Reps par jambe, amplitude sans douleur.'},
  lib_revlunge:{name:'Fendu arrière haltères', kind:'load', cat:'lower', step:2, sets:3, lo:8, hi:10, rest:90, uni:true, knee:true, muscles:M(['Quadriceps','Fessiers']), cue:'Grand pas en arrière, buste légèrement penché.'},
  lib_goblet:{name:'Squat goblet', kind:'load', cat:'lower', step:2, sets:3, lo:8, hi:12, rest:120, knee:true, muscles:M(['Quadriceps'],['Fessiers']), cue:'Haltère contre la poitrine, amplitude confortable.'},
  lib_stepdown:{name:'Step-down contrôlé', kind:'bw', cat:'lower', step:2, sets:2, lo:8, hi:12, rest:60, uni:true, knee:true, muscles:M(['Quadriceps'],['Fessiers']), cue:'Descente lente depuis une marche, genou dans l’axe du pied.'},
  lib_nordic:{name:'Nordic curl (excentrique)', kind:'bw', cat:'iso', step:2.5, sets:2, lo:3, hi:6, rest:120, muscles:M(['Ischios']), cue:'Descente la plus lente possible, remonte avec les mains. Commence par très peu de volume.'},
  lib_seatcalf:{name:'Mollets assis', kind:'load', cat:'iso', step:5, sets:3, lo:10, hi:15, rest:60, muscles:M(['Mollets']), cue:'Genoux à 90°, pause en bas.'},
  lib_pulldown:{name:'Tirage vertical à la poulie', kind:'load', cat:'upper', step:2.5, sets:3, lo:8, hi:12, rest:120, muscles:M(['Dos'],['Biceps']), cue:'Tire les coudes vers les côtes, buste stable.'},
  lib_rowbar:{name:'Rowing barre', kind:'load', cat:'upper', step:2.5, sets:3, lo:6, hi:10, rest:120, muscles:M(['Dos'],['Biceps']), cue:'Dos neutre ; préfère le rowing buste appuyé si le bas du dos fatigue.'},
  lib_cablerow:{name:'Rowing poulie basse', kind:'load', cat:'upper', step:2.5, sets:3, lo:8, hi:12, rest:90, muscles:M(['Dos'],['Biceps']), cue:'Poitrine sortie, tire vers le nombril.'},
  lib_ohp:{name:'Développé militaire haltères', kind:'load', cat:'upper', step:2, sets:3, lo:6, hi:10, rest:120, muscles:M(['Épaules'],['Triceps']), cue:'Assis ou debout, gainage serré.'},
  lib_ohext:{name:'Extension triceps poulie au-dessus de la tête', kind:'load', cat:'iso', step:2.5, sets:3, lo:10, hi:12, rest:75, muscles:M(['Triceps']), cue:'Coudes fixes, étirement complet derrière la tête.'},
  lib_pallof:{name:'Pallof press', kind:'load', cat:'iso', step:2.5, sets:3, lo:8, hi:12, rest:60, muscles:M(['Abdos']), cue:'Reps par côté, résiste à la rotation.'},
  lib_boxjump:{name:'Box jumps', kind:'plyo', sets:3, lo:4, unit:'sauts', cue:'Hauteur modérée, réception souple, redescends en marchant.'},
  // Exercices courants, pour composer son propre programme.
  // Pour en ajouter : un identifiant qui ne change plus jamais (l'historique s'y rattache), puis les mêmes champs que ci-dessus.
  lib_squat:{name:'Squat à la barre', kind:'load', cat:'lower', step:2.5, sets:3, lo:6, hi:8, rest:180, knee:true, muscles:M(['Quadriceps'],['Fessiers']), cue:'Barre sur le haut du dos, descends en contrôle aussi bas que tu restes gainé.'},
  lib_bench:{name:'Développé couché à la barre', kind:'load', cat:'upper', step:2.5, sets:3, lo:6, hi:8, rest:150, muscles:M(['Pectoraux'],['Triceps','Épaules']), cue:'Omoplates serrées, pieds au sol, barre au bas des pectoraux.'},
  lib_deadlift:{name:'Soulevé de terre', kind:'load', cat:'lower', step:5, sets:3, lo:4, hi:6, rest:180, muscles:M(['Ischios','Fessiers'],['Dos']), cue:'Barre contre les tibias, dos neutre, pousse le sol avec les jambes.'},
  lib_bulgarian:{name:'Fentes bulgares', kind:'load', cat:'lower', step:2, sets:3, lo:8, hi:12, rest:90, uni:true, knee:true, muscles:M(['Quadriceps','Fessiers']), cue:'Pied arrière sur un banc, reps par jambe, poids d’un haltère.'},
  lib_legext:{name:'Leg extension', kind:'load', cat:'iso', step:2.5, sets:3, lo:10, hi:15, rest:75, knee:true, muscles:M(['Quadriceps']), cue:'Pause d’1 s jambes tendues, descente lente.'},
  lib_dips:{name:'Dips', kind:'bw', cat:'upper', step:1.25, sets:3, lo:6, hi:10, rest:120, muscles:M(['Pectoraux','Triceps'],['Épaules']), cue:'Descends jusqu’à avoir les bras à 90°. Le poids noté est le lest (0 = poids du corps).'},
  lib_pushup:{name:'Pompes', kind:'bw', cat:'upper', step:1.25, sets:3, lo:8, hi:15, rest:90, muscles:M(['Pectoraux'],['Triceps','Épaules']), cue:'Corps gainé, poitrine près du sol. Le poids noté est le lest (0 = poids du corps).'},
  lib_curlbar:{name:'Curl à la barre', kind:'load', cat:'iso', step:2, sets:3, lo:8, hi:12, rest:75, muscles:M(['Biceps']), cue:'Coudes fixes, pas de balancier.'},
  lib_facepull:{name:'Face pull', kind:'load', cat:'iso', step:2.5, sets:3, lo:12, hi:15, rest:60, muscles:M(['Épaules'],['Dos']), cue:'Corde vers le front, coudes hauts, pause d’1 s.'},
  lib_legraise:{name:'Relevés de jambes suspendu', kind:'bw', cat:'iso', step:1, sets:3, lo:8, hi:15, rest:60, muscles:M(['Abdos']), cue:'Enroule le bassin, sans balancer. Le poids noté est le lest (0 = poids du corps).'}
};
export const ALIAS = { ub_lat:'ua_lat', lb_warm:'la_warm' };
// Séances modèles des programmes de départ. focusNoJump / cutNoJump : textes utilisés quand le module détente est désactivé (les sauts sont alors retirés).
export const BASE_TPL = {
  UA:{name:'Upper A', focus:'Poussée lourde et tractions', cut:'les abdos, puis 1 série d’élévations et de reverse fly',
    items:[{ex:'ua_bench'},{ex:'ua_pull'},{ex:'ua_lat',ss:'A'},{ex:'ua_rear',ss:'A'},{ex:'ua_skull',ss:'B'},{ex:'ua_curl',ss:'B'},{ex:'ua_abs'}]},
  LA:{name:'Lower A', focus:'Force et détente', focusNoJump:'Force du bas du corps', cut:'1 série de step-ups, puis 1 série de leg extension',
    items:[{ex:'la_warm'},{ex:'la_pogo'},{ex:'la_cmj'},{ex:'la_hack'},{ex:'la_rdl'},{ex:'la_step'},{ex:'la_ext',ss:'C'},{ex:'la_calf',ss:'C'}]},
  UB:{name:'Upper B', focus:'Volume haut du corps', cut:'les abdos, puis 1 série d’élévations latérales',
    items:[{ex:'ub_incl'},{ex:'ub_chin'},{ex:'ub_row'},{ex:'ub_fly',ss:'D'},{ex:'ua_lat',ss:'D'},{ex:'ub_ham',ss:'E'},{ex:'ub_rope',ss:'E'},{ex:'ub_abs'}]},
  LB:{name:'Lower B', focus:'Volume et chaîne postérieure', cut:'la corde, puis 1 série de back extensions, puis 1 série d’abduction', cutNoJump:'1 série de back extensions, puis 1 série d’abduction',
    items:[{ex:'la_warm'},{ex:'lb_rope'},{ex:'lb_press'},{ex:'lb_thrust'},{ex:'lb_curl',ss:'F'},{ex:'lb_abd',ss:'F'},{ex:'lb_back',ss:'G'},{ex:'lb_calf',ss:'G'}]},
  FA:{name:'Full body A', focus:'Squat, développé couché, rowing', cut:'1 série de curl et d’élévations, puis 1 série de leg curl',
    items:[{ex:'lib_squat'},{ex:'lib_bench'},{ex:'ub_row'},{ex:'lb_curl'},{ex:'ua_lat',ss:'A'},{ex:'ub_ham',ss:'A'}]},
  FB:{name:'Full body B', focus:'Soulevé de terre roumain, tirage, développé militaire', cut:'1 série d’extensions triceps et de mollets, puis 1 série de fendu arrière',
    items:[{ex:'la_rdl'},{ex:'lib_pulldown'},{ex:'lib_ohp'},{ex:'lib_revlunge'},{ex:'ub_rope',ss:'B'},{ex:'la_calf',ss:'B'}]},
  FC:{name:'Full body C', focus:'Presse, développé incliné, rowing à la poulie', cut:'1 série de reverse fly et d’abdos, puis 1 série de hip thrust',
    items:[{ex:'lb_press'},{ex:'ub_incl'},{ex:'lib_cablerow'},{ex:'lb_thrust'},{ex:'ua_rear',ss:'C'},{ex:'ua_abs',ss:'C'}]}
};
// Programmes proposés au premier lancement. days : jours conseillés (getDay() : 0 = dimanche).
export const PROGRAMS = {
  exemple:{ name:'Programme exemple', desc:'Haut et bas du corps en alternance : 4 séances par semaine, environ 1 h 15 chacune.', days:[1,2,5,0], tpls:['UA','LA','UB','LB'] },
  fullbody:{ name:'Full body 3 jours', desc:'Tout le corps à chaque séance : 3 séances par semaine, environ 1 h chacune.', days:[1,3,5], tpls:['FA','FB','FC'] }
};
// Notes du programme exemple, affichées seulement avec son planning d'origine et le sport les lundis et jeudis, match le samedi. {Sport} = nom du sport.
export const DAY_NOTES = {
  1:'{Sport} ce soir : fais la séance le matin ou le midi.',
  2:'Environ 55 h avant l’entraînement physique du jeudi.',
  3:'Repos complet avant le jeudi.',
  4:'{Sport} ce soir, la séance la plus physique.',
  5:'Haut du corps uniquement, la veille du match.',
  6:'Match ce soir.',
  0:'Plutôt en fin de matinée. Après un match dur : 2-3 reps en réserve et 1 série de moins sur les gros exercices.'
};
export const DAY_ORDER = [1,2,3,4,5,6,0];
export const DAY_SHORT = {1:'Lun',2:'Mar',3:'Mer',4:'Jeu',5:'Ven',6:'Sam',0:'Dim'};
export const JUMP_PROTOCOL = 'Après l’échauffement, avant les sauts et la musculation. 3 sauts avec contre-mouvement au maximum, 1 min de repos entre chaque, toujours avec la même méthode (mains sur les hanches, mesure par vidéo ou marque à la craie au mur). L’appli garde le meilleur.';
