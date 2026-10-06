import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { kvGet, kvSet, kvDel } from "./storage";
import type { EnvId, FinishId, ModelKind } from "./models";

export interface Artwork {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

export interface UvTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  tileX: number;
  tileY: number;
}

export const DEFAULT_UV: UvTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  tileX: 1,
  tileY: 1,
};

export interface ProjectState {
  version: 1;
  name: string;
  model: ModelKind;
  preset: number;
  customDims: { w: number; h: number; d: number } | undefined;
  uv: UvTransform;
  finish: FinishId;
  environment: EnvId;
  artwork: Artwork | null;
  spotMask: Artwork | null;
  autoRotate: boolean;
  rotateSpeed: number;
  shadows: boolean;
  background: boolean;
}

export const DEFAULT_PROJECT: ProjectState = {
  version: 1,
  name: "Projet sans titre",
  model: "rollup",
  preset: 0,
  customDims: undefined,
  uv: { ...DEFAULT_UV },
  finish: "matte",
  environment: "studio",
  artwork: null,
  spotMask: null,
  autoRotate: true,
  rotateSpeed: 0.6,
  shadows: true,
  background: true,
};

export interface LayoutState {
  leftWidth: number;
  rightWidth: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  theme: "dark" | "light";
}

export const DEFAULT_LAYOUT: LayoutState = {
  leftWidth: 276,
  rightWidth: 340,
  leftCollapsed: false,
  rightCollapsed: false,
  theme: "light",
};

export interface SavedDims {
  id: string;
  label: string;
  w: number;
  h: number;
  d: number;
}

interface StudioStore {
  project: ProjectState;
  layout: LayoutState;
  savedDims: Partial<Record<ModelKind, SavedDims[]>>;
  hydrated: boolean;
  set: <K extends keyof ProjectState>(key: K, value: ProjectState[K]) => void;
  setUv: (patch: Partial<UvTransform>) => void;
  resetUv: () => void;
  loadProject: (p: ProjectState) => void;
  resetProject: () => void;
  setLayout: (patch: Partial<LayoutState>) => void;
  resetLayout: () => void;
  addSavedDims: (model: ModelKind, entry: Omit<SavedDims, "id">) => void;
  removeSavedDims: (model: ModelKind, id: string) => void;
}

export const useStudio = create<StudioStore>()(
  persist(
    (setState) => ({
      project: { ...DEFAULT_PROJECT },
      layout: { ...DEFAULT_LAYOUT },
      savedDims: {},
      hydrated: false,
      set: (key, value) =>
        setState((s) => ({ project: { ...s.project, [key]: value } })),
      setUv: (patch) =>
        setState((s) => ({ project: { ...s.project, uv: { ...s.project.uv, ...patch } } })),
      resetUv: () => setState((s) => ({ project: { ...s.project, uv: { ...DEFAULT_UV } } })),
      loadProject: (p) => setState({ project: { ...DEFAULT_PROJECT, ...p } }),
      resetProject: () => setState({ project: { ...DEFAULT_PROJECT } }),
      setLayout: (patch) => setState((s) => ({ layout: { ...s.layout, ...patch } })),
      resetLayout: () => setState({ layout: { ...DEFAULT_LAYOUT } }),
      addSavedDims: (model, entry) =>
        setState((s) => ({
          savedDims: {
            ...s.savedDims,
            [model]: [...(s.savedDims[model] ?? []), { ...entry, id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` }],
          },
        })),
      removeSavedDims: (model, id) =>
        setState((s) => ({
          savedDims: { ...s.savedDims, [model]: (s.savedDims[model] ?? []).filter((e) => e.id !== id) },
        })),
    }),
    {
      name: "spc-studio-state",
      storage: createJSONStorage(() => ({
        getItem: (n: string) => kvGet(n),
        setItem: (n: string, v: string) => kvSet(n, v),
        removeItem: (n: string) => kvDel(n),
      })),
      partialize: (s) => ({ project: s.project, layout: s.layout, savedDims: s.savedDims }) as never,
      onRehydrateStorage: () => () => {
        useStudio.setState({ hydrated: true });
      },
    },
  ),
);

if (typeof window !== "undefined") {
  // Ensure the flag flips even when nothing was stored yet.
  setTimeout(() => {
    if (!useStudio.getState().hydrated) useStudio.setState({ hydrated: true });
  }, 0);
}
