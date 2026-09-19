# SPC 3D Studio & AR

Application web professionnelle de prévisualisation 3D des supports imprimés STAF PRINT, avec plaquage de visuel, finitions, BAT client et réalité augmentée.

## Identité visuelle

- Thème sombre par défaut (#0f172a / #020617), thème clair (#fdfbf7), bascule dans la barre d'outils.
- Accent orange ambré (#f97316 / #ea580c).
- Space Grotesk (titres), Inter (interface), JetBrains Mono (valeurs numériques).
- Interface dense de logiciel pro : boutons icônes avec infobulles, transitions courtes.

## Écrans

### 1. Studio (page d'accueil)

Barre d'outils haute : logo, sélecteur de modèle, Importer `.studio3d`, Exporter, Partager, Auto-rotation, Reset caméra, Plein écran, Générer BAT, Mode AR, Paramètres.

Panneau gauche — catalogue des supports, redimensionnable et rétractable :
Roll-up kakemono, Bâche extérieure, Enseigne drapeau / façade, Boîte packaging premium, Affiche encadrée, Sac kraft. Chaque support affiche dimensions réelles, description et préréglages.

Scène 3D centrale : rotation orbitale fluide, auto-rotation avec réglage de vitesse, ombres réalistes, dépôt d'image par glisser-déposer directement sur la scène.

Panneau droit — onglets, redimensionnable et rétractable :
- Visuel : import PNG/JPG/WebP/SVG, zone de dépôt, vignette, nom, dimensions, Remplacer.
- Transformation UV : échelle, position X/Y, rotation, répétition X/Y — curseur + valeur cliquable éditable (Entrée/sortie de champ valide), bouton Réinitialiser.
- Finitions : Mat, Brillant, Dorure à chaud, Vernis sélectif (import d'un masque noir et blanc).
- Environnements : Studio photo, Bureau moderne, Façade urbaine, Showroom.
- Export du rendu : PNG haute résolution, fond transparent optionnel.
- Projet : téléchargement `.studio3d`, restauration, QR Code et partage natif mobile.
- Actions BAT et AR.

Bas de page discret : liens vers brief.stafprint.com et tools.stafprint.com.

### 2. BAT client — `/bat/:batId`

Vue épurée sans outils d'édition : visualisation 3D du support validé, finitions appliquées, dimensions, fiche technique et bouton de validation du BAT.

### 3. Réalité augmentée — `/ar/:sessionCode`

Visualisation à l'échelle 1:1 sur mobile via `<model-viewer>` (AR Quick Look / Scene Viewer), avec repli sur l'aperçu 3D sur ordinateur et QR code pour passer sur mobile.

## Persistance

Sauvegarde automatique du projet en cours et de la disposition des panneaux dans le navigateur (IndexedDB, repli localStorage), avec bouton « Réinitialiser la disposition ». Les BAT et sessions AR sont encodés dans l'URL partagée, sans serveur.

## Détails techniques

- React Three Fiber + Drei ; chargement client uniquement (`ssr: false`) pour la scène.
- Supports générés en géométrie procédurale paramétrée (plans courbés, boîtes, cylindres) avec matériaux PBR ; texture du visuel appliquée en `map` avec `repeat/offset/rotation` pilotés par le panneau UV.
- Dorure : `metalness` élevé + couleur or ; vernis sélectif : masque N&B en `roughnessMap`.
- Environnements : décors procéduraux légers + éclairage local (Lightformer), pas de HDR distant.
- Export PNG : rendu hors écran en résolution doublée, `preserveDrawingBuffer` au moment de la capture.
- `.studio3d` : JSON versionné (modèle, UV, finition, environnement, caméra, image encodée).
- État global partagé via un store léger (Zustand), persisté automatiquement.
- Tout est local au navigateur : aucune base de données pour cette première version.

## Hors périmètre

Comptes utilisateurs, stockage serveur des BAT, historique de versions, envoi d'e-mails.
