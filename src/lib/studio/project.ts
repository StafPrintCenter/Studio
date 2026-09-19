import QRCode from "qrcode";
import { kvGet, kvSet } from "./storage";
import { DEFAULT_PROJECT, type Artwork, type ProjectState } from "./store";

export const STUDIO_EXT = ".studio3d";

export function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "projet"
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function exportProjectFile(project: ProjectState) {
  downloadBlob(createProjectBlob(project), `${slugify(project.name)}${STUDIO_EXT}`);
}

export function createProjectBlob(project: ProjectState) {
  const payload = {
    format: "spc-studio3d",
    version: 1,
    exportedAt: new Date().toISOString(),
    project,
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
}

export function projectFile(project: ProjectState) {
  return new File([createProjectBlob(project)], `${slugify(project.name)}${STUDIO_EXT}`, {
    type: "application/json",
  });
}

export async function readProjectFile(file: File): Promise<ProjectState> {
  const text = await file.text();
  const data = JSON.parse(text) as { project?: ProjectState } & Partial<ProjectState>;
  const project = (data.project ?? data) as ProjectState;
  if (!project || typeof project !== "object" || !project.model) {
    throw new Error("Fichier de projet invalide");
  }
  return { ...DEFAULT_PROJECT, ...project };
}

/** Read an image file into a base64 artwork record. */
export function readArtwork(file: File): Promise<Artwork> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () =>
        resolve({
          name: file.name,
          dataUrl,
          width: img.naturalWidth || 0,
          height: img.naturalHeight || 0,
          size: file.size,
        });
      img.onerror = () =>
        resolve({ name: file.name, dataUrl, width: 0, height: 0, size: file.size });
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const ACCEPTED_IMAGE = "image/png,image/jpeg,image/webp,image/svg+xml";

export function isImageFile(file: File) {
  return /^image\/(png|jpeg|jpg|webp|svg\+xml)$/.test(file.type);
}

/* ---------- BAT & AR sessions (local, no server) ---------- */

export function newCode(prefix: string) {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${s}`;
}

export interface SharedRecord {
  id: string;
  createdAt: string;
  project: ProjectState;
  status?: "pending" | "approved";
  approvedAt?: string;
}

export async function saveShared(kind: "bat" | "ar", project: ProjectState) {
  const id = newCode(kind === "bat" ? "BAT" : "AR");
  const record: SharedRecord = {
    id,
    createdAt: new Date().toISOString(),
    project,
    status: "pending",
  };
  await kvSet(`${kind}:${id}`, JSON.stringify(record));
  return record;
}

export async function loadShared(
  kind: "bat" | "ar",
  id: string,
): Promise<SharedRecord | null> {
  const raw = await kvGet(`${kind}:${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SharedRecord;
  } catch {
    return null;
  }
}

export async function updateShared(kind: "bat" | "ar", record: SharedRecord) {
  await kvSet(`${kind}:${record.id}`, JSON.stringify(record));
}

export async function makeQr(url: string) {
  return QRCode.toDataURL(url, {
    width: 480,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}

export async function shareUrl(title: string, url: string) {
  const nav = navigator as Navigator & {
    share?: (d: { title: string; url: string }) => Promise<void>;
  };
  if (nav.share) {
    try {
      await nav.share({ title, url });
      return "shared" as const;
    } catch {
      return "cancelled" as const;
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied" as const;
}

export function formatBytes(bytes: number) {
  if (!bytes) return "-";
  const units = ["o", "Ko", "Mo"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
