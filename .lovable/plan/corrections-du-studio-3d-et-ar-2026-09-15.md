# Corrections du studio 3D et AR

## Modifications
- Recréer entièrement chaque décor 3D pour simuler réellement son environnement, avec palette, architecture, mobilier, accessoires et éclairage dédiés, tout en gardant les supports lisibles.
- Corriger le chargement des textures pour que toute image importée soit appliquée dès qu'elle est prête, sans autre interaction.
- Ajouter une action « Retirer » à côté de « Remplacer le visuel ».
- Rendre la fenêtre de partage utilisable sur petit écran : largeur, hauteur défilable, QR et actions adaptatives.
- Corriger la génération AR pour reconstruire le fichier 3D à chaque changement et afficher un état d'erreur explicite si la génération ou le lecteur échoue.
- Compléter les métadonnées sociales manquantes des pages concernées.

## Vérification
- Tester l'import puis le retrait d'une image dans le studio.
- Tester la fenêtre de partage sur une largeur mobile.
- Ouvrir une session AR existante et confirmer que le modèle est visible ou qu'une erreur utile apparaît.
- Contrôler l'absence d'erreurs navigateur et le rendu sur ordinateur et mobile.

## Détails techniques
- La texture sera clonée pour appliquer les réglages UV sans mutation silencieuse du cache Three.js, puis invalidée explicitement après chargement.
- Le fichier GLB AR sera exporté depuis une scène dédiée correctement dimensionnée, avec nettoyage des anciennes URL temporaires.
