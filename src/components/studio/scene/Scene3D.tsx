import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Support } from "./Support";
import { EnvironmentDecor, StudioLighting } from "./Environments";
import { resolvePreset, getModel } from "@/lib/studio/models";
import type { ProjectState } from "@/lib/studio/store";

export interface SceneApi {
  capture: (opts: { transparent: boolean; scale: number }) => string | null;
  resetCamera: () => void;
}

interface Props {
  project: ProjectState;
  apiRef?: RefObject<SceneApi | null> | undefined;
  interactive?: boolean;
  className?: string;
}

function Bridge({
  apiRef,
  controlsRef,
  home,
}: {
  apiRef?: RefObject<SceneApi | null> | undefined;
  controlsRef: RefObject<any>;
  home: [number, number, number];
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      resetCamera: () => {
        camera.position.set(...home);
        controlsRef.current?.target?.set(0, home[1] * 0.6, 0);
        controlsRef.current?.update?.();
      },
      capture: ({ transparent, scale }) => {
        const decor = scene.getObjectByName("env-decor");
        const prevDecor = decor?.visible;
        const prevBg = scene.background;
        const prevRatio = gl.getPixelRatio();
        if (transparent) {
          if (decor) decor.visible = false;
          scene.background = null;
        }
        gl.setPixelRatio(Math.min(scale, 4));
        gl.render(scene, camera);
        const url = gl.domElement.toDataURL("image/png");
        gl.setPixelRatio(prevRatio);
        if (transparent) {
          if (decor && prevDecor !== undefined) decor.visible = prevDecor;
          scene.background = prevBg;
        }
        gl.render(scene, camera);
        return url;
      },
    };
  }, [apiRef, gl, scene, camera, controlsRef, home]);

  useEffect(() => {
    camera.position.set(...home);
    controlsRef.current?.target?.set(0, home[1] * 0.6, 0);
    controlsRef.current?.update?.();
  }, [camera, controlsRef, home[0], home[1], home[2]]);

  return null;
}

export function Scene3D({ project, apiRef, interactive = true, className }: Props) {
  const model = resolvePreset(getModel(project.model), project.preset);
  const controlsRef = useRef<any>(null);
  const home = model.camera.map((v) => v * 1.35) as [number, number, number];

  useEffect(() => {
    controlsRef.current?.target?.set(0, home[1] * 0.6, 0);
    controlsRef.current?.update?.();
  }, [home, project.model]);

  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      camera={{ position: home, fov: 42 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.28;
      }}
    >
      <Suspense fallback={null}>
        <StudioLighting envId={project.environment} />
        <EnvironmentDecor envId={project.environment} />
        <group name="support">
        <Support
          model={model}
          uv={project.uv}
          finish={project.finish}
          artwork={project.artwork?.dataUrl ?? null}
          mask={project.spotMask?.dataUrl ?? null}
        />
        </group>
        {project.shadows && (
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.34}
            scale={12}
            blur={2.4}
            far={6}
          />
        )}
        <OrbitControls
          ref={controlsRef}
          enabled={interactive}
          enablePan={interactive}
          enableDamping
          dampingFactor={0.08}
          minDistance={0.8}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2 - 0.02}
          target={[0, home[1] * 0.6, 0]}
          autoRotate={project.autoRotate}
          autoRotateSpeed={project.rotateSpeed * 4}
        />
        <Bridge apiRef={apiRef} controlsRef={controlsRef} home={home} />
      </Suspense>
    </Canvas>
  );
}
