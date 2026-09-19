import { useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { UvTransform } from "./store";

export function useImageTexture(dataUrl: string | null | undefined, srgb = true) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!dataUrl) {
      setTexture(null);
      return;
    }
    let disposed = false;
    let created: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.load(dataUrl, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.center.set(0.5, 0.5);
      tex.anisotropy = 8;
      created = tex;
      setTexture(tex);
      invalidate();
    });
    return () => {
      disposed = true;
      created?.dispose();
      setTexture(null);
    };
  }, [dataUrl, invalidate, srgb]);

  return texture;
}

export function applyUv(tex: THREE.Texture | null, uv: UvTransform) {
  if (!tex) return null;
  const s = Math.max(0.05, uv.scale);
  tex.repeat.set(uv.tileX / s, uv.tileY / s);
  tex.offset.set(-uv.offsetX, -uv.offsetY);
  tex.rotation = (uv.rotation * Math.PI) / 180;
  tex.needsUpdate = true;
  return tex;
}

export function useUvTexture(texture: THREE.Texture | null, uv: UvTransform) {
  const transformed = useMemo(() => {
    if (!texture) return null;
    const cloned = texture.clone();
    cloned.needsUpdate = true;
    return cloned;
  }, [texture]);

  useEffect(() => () => transformed?.dispose(), [transformed]);

  return useMemo(
    () => applyUv(transformed, uv),
    [transformed, uv.offsetX, uv.offsetY, uv.rotation, uv.scale, uv.tileX, uv.tileY],
  );
}
