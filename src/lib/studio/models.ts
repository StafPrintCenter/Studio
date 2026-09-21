export type ModelKind =
  | "rollup"
  | "banner"
  | "flag"
  | "counter"
  | "box"
  | "poster"
  | "poster-a"
  | "leaflet"
  | "bag"
  | "tshirt"
  | "cap";

export interface SupportModel {
  id: ModelKind;
  name: string;
  category: string;
  description: string;
  /** Real world dimensions in centimeters (w x h x d) */
  dims: { w: number; h: number; d: number };
  /** Printable surface in cm */
  printArea: { w: number; h: number };
  material: string;
  presets: { label: string; w: number; h: number; d?: number }[];
  /** Default orbit camera distance multiplier */
  camera: [number, number, number];
  /** Label of the currently resolved preset, used by procedural variants. */
  variantLabel?: string;
}

export const MODELS: SupportModel[] = [
  {
    id: "counter",
    name: "Comptoir d'accueil",
    category: "PLV & Stands",
    description: "Comptoir promotionnel personnalisable, disponible en formes courbe, fermée ou d’angle.",
    dims: { w: 90, h: 100, d: 45 },
    printArea: { w: 90, h: 90 },
    material: "PVC expansé + tablette stratifiée",
    presets: [
      { label: "Courbe - 90 × 100 cm", w: 90, h: 100, d: 45 },
      { label: "Fermé - 100 × 100 cm", w: 100, h: 100, d: 50 },
      { label: "Angle - 120 × 100 cm", w: 120, h: 100, d: 60 },
    ],
    camera: [1.45, 1.05, 2.1],
  },
  {
    id: "rollup",
    name: "Roll-up kakemono",
    category: "PLV & Stands",
    description:
      "Enrouleur aluminium avec toile polyester 220 g. Montage sans outil, housse de transport incluse.",
    dims: { w: 85, h: 200, d: 30 },
    printArea: { w: 85, h: 200 },
    material: "Toile polyester 220 g",
    presets: [
      { label: "85 × 200 cm", w: 85, h: 200 },
      { label: "100 × 200 cm", w: 100, h: 200 },
      { label: "120 × 200 cm", w: 120, h: 200 },
    ],
    camera: [0, 1.1, 3.6],
  },
  {
    id: "banner",
    name: "Bâche publicitaire extérieure",
    category: "Grand format",
    description:
      "Bâche PVC 510 g avec œillets tous les 50 cm, résistante aux UV et aux intempéries.",
    dims: { w: 300, h: 150, d: 2 },
    printArea: { w: 300, h: 150 },
    material: "PVC 510 g + œillets laiton",
    presets: [
      { label: "200 × 100 cm", w: 200, h: 100 },
      { label: "300 × 150 cm", w: 300, h: 150 },
      { label: "400 × 200 cm", w: 400, h: 200 },
    ],
    camera: [0, 0.6, 4.4],
  },
  {
    id: "flag",
    name: "Enseigne drapeau / façade",
    category: "Signalétique",
    description:
      "Panneau drapeau double face sur potence murale, Dibond 3 mm, fixation façade.",
    dims: { w: 60, h: 40, d: 3 },
    printArea: { w: 60, h: 40 },
    material: "Dibond 3 mm",
    presets: [
      { label: "40 × 30 cm", w: 40, h: 30 },
      { label: "60 × 40 cm", w: 60, h: 40 },
      { label: "80 × 60 cm", w: 80, h: 60 },
    ],
    camera: [0.95, 1.3, 1.65],
  },
  {
    id: "box",
    name: "Boîte packaging premium",
    category: "Packaging",
    description:
      "Étui carton 350 g pelliculé, idéal dorure à chaud et vernis sélectif sur le couvercle.",
    dims: { w: 24, h: 10, d: 18 },
    printArea: { w: 24, h: 18 },
    material: "Carton 350 g pelliculé",
    presets: [
      { label: "Étui 24 × 18 × 10 cm", w: 24, h: 10, d: 18 },
      { label: "Cube 20 × 20 × 20 cm", w: 20, h: 20, d: 20 },
      { label: "Coffret 30 × 22 × 8 cm", w: 30, h: 8, d: 22 },
    ],
    camera: [0.5, 0.36, 0.62],
  },
  {
    id: "poster",
    name: "Affiche encadrée",
    category: "Impression",
    description: "Affiche papier 200 g sous cadre aluminium noir, tirage intérieur.",
    dims: { w: 50, h: 70, d: 2 },
    printArea: { w: 50, h: 70 },
    material: "Papier couché 200 g",
    presets: [
      { label: "A2 42 × 59,4 cm", w: 42, h: 59.4 },
      { label: "50 × 70 cm", w: 50, h: 70 },
      { label: "70 × 100 cm", w: 70, h: 100 },
    ],
    camera: [0, 0.4, 3.0],
  },
  {
    id: "poster-a",
    name: "Affiche format A",
    category: "Impression",
    description: "Affiche papier couché pour communication intérieure, disponible aux formats normalisés.",
    dims: { w: 29.7, h: 42, d: 0.1 },
    printArea: { w: 29.7, h: 42 },
    material: "Papier couché 170 g",
    presets: [
      { label: "A4 21 × 29,7 cm", w: 21, h: 29.7 },
      { label: "A3 29,7 × 42 cm", w: 29.7, h: 42 },
      { label: "A2 42 × 59,4 cm", w: 42, h: 59.4 },
      { label: "A1 59,4 × 84,1 cm", w: 59.4, h: 84.1 },
      { label: "A0 84,1 × 118,9 cm", w: 84.1, h: 118.9 },
    ],
    camera: [0, 0.35, 2.6],
  },
  {
    id: "leaflet",
    name: "Dépliant",
    category: "Impression",
    description: "Dépliant commercial plié, adapté aux menus, brochures et présentations d'entreprise.",
    dims: { w: 29.7, h: 21, d: 0.2 },
    printArea: { w: 29.7, h: 21 },
    material: "Papier couché 170 g",
    presets: [
      { label: "2 volets - A4 ouvert", w: 29.7, h: 21 },
      { label: "3 volets - A4 ouvert", w: 29.7, h: 21 },
      { label: "3 volets - A3 ouvert", w: 42, h: 29.7 },
      { label: "4 volets - 40 × 20 cm", w: 40, h: 20 },
    ],
    camera: [1.5, 1.0, 2.2],
  },
  {
    id: "bag",
    name: "Sac kraft",
    category: "Packaging",
    description: "Sac kraft brun 120 g, poignées cordelières, impression 1 à 4 couleurs.",
    dims: { w: 26, h: 34, d: 12 },
    printArea: { w: 26, h: 34 },
    material: "Kraft brun 120 g",
    presets: [
      { label: "26 × 34 × 12 cm", w: 26, h: 34, d: 12 },
      { label: "32 × 40 × 14 cm", w: 32, h: 40, d: 14 },
      { label: "18 × 24 × 8 cm", w: 18, h: 24, d: 8 },
    ],
    camera: [0.48, 0.42, 0.72],
  },
  {
    id: "tshirt",
    name: "T-shirt personnalisé",
    category: "Textile",
    description: "T-shirt coton avec marquage frontal pour équipes, événements et marques.",
    dims: { w: 54, h: 72, d: 3 },
    printArea: { w: 32, h: 42 },
    material: "Coton 180 g/m²",
    presets: [
      { label: "S", w: 48, h: 68, d: 3 },
      { label: "M", w: 52, h: 70, d: 3 },
      { label: "L", w: 56, h: 74, d: 3 },
      { label: "XL", w: 60, h: 78, d: 3 },
    ],
    camera: [0, 0.65, 2.7],
  },
  {
    id: "cap",
    name: "Casquette personnalisée",
    category: "Textile",
    description: "Casquette structurée avec marquage frontal brodé ou transféré.",
    dims: { w: 24, h: 16, d: 28 },
    printArea: { w: 12, h: 6 },
    material: "Coton sergé",
    presets: [
      { label: "Adulte", w: 24, h: 16, d: 28 },
      { label: "Enfant", w: 21, h: 14, d: 24 },
      { label: "Trucker", w: 25, h: 17, d: 29 },
    ],
    camera: [1.35, 0.9, 2.1],
  },
];

export function getModel(id: string): SupportModel {
  return MODELS.find((m) => m.id === id) ?? (MODELS[0] as SupportModel);
}

export type FinishId = "matte" | "gloss" | "foil" | "spot";

export const FINISHES: { id: FinishId; name: string; hint: string }[] = [
  { id: "matte", name: "Mat", hint: "Pelliculage mat, rendu doux et sans reflet" },
  { id: "gloss", name: "Brillant", hint: "Pelliculage brillant, couleurs saturées" },
  { id: "foil", name: "Dorure à chaud", hint: "Film métallique or, très réfléchissant" },
  { id: "spot", name: "Vernis sélectif", hint: "Vernis 3D piloté par un masque N&B" },
];

export type EnvId = "studio" | "office" | "street" | "showroom";

export const ENVIRONMENTS: { id: EnvId; name: string; hint: string }[] = [
  { id: "studio", name: "Studio photo", hint: "Cyclo, softboxes et accessoires" },
  { id: "office", name: "Bureau moderne", hint: "Bureau, écran et étagère" },
  { id: "street", name: "Façade urbaine", hint: "Mur de rue et trottoir" },
  { id: "showroom", name: "Showroom", hint: "Hall d'exposition clair" },
];

/** Apply a catalogue preset to the model dimensions. */
export function resolvePreset(model: SupportModel, presetIndex: number): SupportModel {
  const p = model.presets[presetIndex];
  if (!p) return model;
  const dims = { w: p.w, h: p.h, d: p.d ?? model.dims.d };
  return { ...model, dims, printArea: { w: p.w, h: p.h }, variantLabel: p.label };
}
