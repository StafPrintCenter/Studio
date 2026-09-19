# STAF PRINT 3D Studio

Créer l'application web professionnelle « SPC 3D Studio & AR » (studio.stafprint.com) pour l'écosystème STAF PRINT CENTER.

Spécifications complètes :
1. Identité STAF PRINT : Thème sombre (#0f172a / #020617) et clair (#fdfbf7), accent orange ambre (#f97316, #ea580c), typographies modernes (Space Grotesk, Inter, JetBrains Mono pour les valeurs). UI de logiciel pro compacte, basée sur icônes avec tooltips (Lucide React), transitions fluides.
2. Architecture du Studio :
   - Toolbar supérieure : Logo SPC 3D Studio, sélecteur modèle, Importer (.studio3d), Exporter projet, Partager, Auto-rotation, Reset caméra, Plein écran, Générer BAT, Mode AR, Paramètres.
   - Panneau gauche (redimensionnable & rétractable avec drag handle + bouton collapse) : Catalogue des modèles STAF PRINT (Roll-up kakemono, Bâche publicitaire extérieure, Enseigne drapeau / façade, Boîte packaging premium, Affiche encadrée, Sac kraft, etc.) avec dimensions, description et presets.
   - Scène 3D centrale Three.js / React Three Fiber / Drei : OrbitControls fluides, rotation automatique togglable avec contrôle de vitesse, ombres réalistes, dropzone direct canvas pour glisser-déposer une image directement dans la scène 3D.
   - Panneau droit (redimensionnable & rétractable avec drag handle + bouton collapse) :
     * Visuel à plaquer : import de fichier image (PNG, JPG, WebP, SVG), dropzone, preview vignette, nom, dimensions et bouton Remplacer.
     * Transformation UV : Sliders et inputs numériques directs synchronisés (clic sur la valeur numérique pour l'éditer inline avec validation Enter/Blur) pour Échelle, Position X, Position Y, Rotation, Répétition Tile X/Y, et bouton Réinitialiser UV aux valeurs par défaut.
     * Finitions & Matériaux PBR : Mat, Brillant, Dorure à chaud (or métallique brillant), Vernis sélectif avec import de masque N&B.
     * Environnements 3D : Studio photo (sol, softboxes, accessoires), Bureau moderne (bureau, écran, étagère), Façade urbaine / Rue, Showroom d'exposition.
     * Export du rendu : Capture PNG haute résolution (avec ou sans fond transparent).
     * Partager & Exporter : Téléchargement du projet au format `.studio3d` (JSON complet), import/restauration de projet, partage avec QR Code et Web Share API.
     * Actions BAT & AR.
3. Module BAT 3D : Vue dédiée (/bat/:batId) épurée pour les clients avec visualisation 3D, inspection des finitions, dimensions, fiche technique et bouton de validation BAT.
4. Module Réalité Augmentée : Vue dédiée (/ar/:sessionCode) avec support <model-viewer> / WebXR pour visualiser les supports en AR à l'échelle 1:1 sur mobile.
5. Persistance locale : Sauvegarde automatique de l'état (IndexedDB / localStorage) et persistance de la disposition des panneaux (avec bouton "Réinitialiser la disposition").
6. Bannière & CTA vers l'écosystème STAF PRINT : Liens discrets vers brief.stafprint.com et tools.stafprint.com.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8ddaf05f-7b8b-4d79-85f4-29a13c6ea1d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
