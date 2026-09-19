import { createElement, useCallback, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Support } from "./scene/Support";
import { Scene3D } from "./scene/Scene3D";
import { getModel, resolvePreset } from "@/lib/studio/models";
import type { ProjectState } from "@/lib/studio/store";

/** Renders the support offscreen and exports it as a GLB blob URL for <model-viewer>. */
function GlbBuilder({
  project,
  onReady,
  onError,
}: {
  project: ProjectState;
  onReady: (u: string) => void;
  onError: () => void;
}) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const target = scene.getObjectByName("ar-support") ?? scene;
      new GLTFExporter().parse(
        target,
        (result) => {
          const blob = new Blob([result as ArrayBuffer], { type: "model/gltf-binary" });
          onReady(URL.createObjectURL(blob));
        },
        onError,
        { binary: true, onlyVisible: true },
      );
    }, 350);
    return () => window.clearTimeout(t);
  }, [scene, onError, onReady, project]);
  return null;
}

export function ArViewer({ project }: { project: ProjectState }) {
  const model = resolvePreset(getModel(project.model), project.preset);
  const [glb, setGlb] = useState<string | null>(null);
  const [mvReady, setMvReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleReady = useCallback((url: string) => {
    setGlb((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });
    setFailed(false);
  }, []);

  const handleError = useCallback(() => setFailed(true), []);

  useEffect(() => () => {
    setGlb((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }, []);

  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setMvReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("script[data-model-viewer]");
    if (existing) {
      const onLoad = () => setMvReady(true);
      existing.addEventListener("load", onLoad, { once: true });
      return () => existing.removeEventListener("load", onLoad);
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js";
    script.dataset["modelViewer"] = "true";
    script.onload = () => setMvReady(true);
    document.head.appendChild(script);
    return () => {
      script.onload = null;
    };
  }, []);

  return (
    <div className="relative h-full min-h-[18rem] w-full">
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        <Canvas gl={{ preserveDrawingBuffer: true }}>
          <group name="ar-support">
            <Support
              model={model}
              uv={project.uv}
              finish={project.finish}
              artwork={project.artwork?.dataUrl ?? null}
              mask={project.spotMask?.dataUrl ?? null}
            />
          </group>
          <GlbBuilder project={project} onReady={handleReady} onError={handleError} />
        </Canvas>
      </div>

      {mvReady && glb && !failed ? (
        createElement("model-viewer", {
          src: glb,
          ar: true,
          "ar-modes": "webxr scene-viewer quick-look",
          "ar-scale": "fixed",
          "camera-controls": true,
          "auto-rotate": true,
          "camera-orbit": "30deg 70deg auto",
          "interaction-prompt": "auto",
          "shadow-intensity": "1",
          "touch-action": "pan-y",
          alt: `${model.name} en réalité augmentée`,
          style: { display: "block", width: "100%", height: "100%", minHeight: "18rem", backgroundColor: "transparent" },
        })
      ) : (
        <div className="relative h-full min-h-72 w-full">
          <Scene3D project={{ ...project, autoRotate: true }} className="!absolute inset-0" />
          <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex justify-center">
            <span className="rounded-md border border-border/60 bg-surface/85 px-3 py-1.5 text-center text-[11px] text-muted-foreground backdrop-blur">
              {failed ? "Aperçu 3D disponible - placement AR indisponible" : "Préparation du placement AR…"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
