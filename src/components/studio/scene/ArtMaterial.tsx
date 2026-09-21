import * as THREE from "three";
import type { FinishId } from "@/lib/studio/models";

interface Props {
  map: THREE.Texture | null;
  mask?: THREE.Texture | null;
  finish: FinishId;
  color?: string;
  side?: THREE.Side;
}

/** PBR material driven by the selected print finish. */
export function ArtMaterial({ map, mask, finish, color = "#f5f5f4", side }: Props) {
  const common = {
    map: map ?? null,
    side: side ?? THREE.FrontSide,
    toneMapped: map ? false : true,
  };

  if (finish === "foil") {
    return (
      <meshStandardMaterial
        key={map?.uuid ?? "foil-empty"}
        {...common}
        color={map ? "#ffd27a" : "#e8b14c"}
        metalness={1}
        roughness={0.16}
        envMapIntensity={1.6}
      />
    );
  }

  if (finish === "gloss") {
    return (
      <meshStandardMaterial
        key={map?.uuid ?? "gloss-empty"}
        {...common}
        color={map ? "#ffffff" : color}
        metalness={0.06}
        roughness={0.12}
        envMapIntensity={1.15}
      />
    );
  }

  if (finish === "spot") {
    return (
      <meshStandardMaterial
        key={`${map?.uuid ?? "spot-empty"}-${mask?.uuid ?? "no-mask"}`}
        {...common}
        color={map ? "#ffffff" : color}
        metalness={0.08}
        roughness={mask ? 1 : 0.5}
        roughnessMap={mask ?? null}
        envMapIntensity={1.25}
      />
    );
  }

  return (
    <meshStandardMaterial
      key={map?.uuid ?? "matte-empty"}
      {...common}
      color={map ? "#ffffff" : color}
      metalness={0}
      roughness={0.88}
      envMapIntensity={0.7}
    />
  );
}
