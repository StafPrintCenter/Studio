import { useMemo } from "react";
import * as THREE from "three";
import { ArtMaterial } from "./ArtMaterial";
import { useImageTexture, useUvTexture } from "@/lib/studio/useImageTexture";
import type { FinishId, SupportModel } from "@/lib/studio/models";
import type { UvTransform } from "@/lib/studio/store";

interface Props {
  model: SupportModel;
  uv: UvTransform;
  finish: FinishId;
  artwork: string | null;
  mask: string | null;
}

function useBulgedPlane(w: number, h: number, bulge: number) {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, 32, 4);
    const pos = g.attributes["position"] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const t = (x / (w / 2)) ** 2;
      pos.setZ(i, bulge * (1 - t));
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, [w, h, bulge]);
}

export function Support({ model, uv, finish, artwork, mask }: Props) {
  const rawArt = useImageTexture(artwork);
  const rawMask = useImageTexture(mask, false);
  const art = useUvTexture(rawArt, uv);
  const maskTex = rawMask;

  const w = model.dims.w / 100;
  const h = model.dims.h / 100;
  const d = model.dims.d / 100;

  const bulged = useBulgedPlane(w, h, 0.02);
  const bannerGeo = useBulgedPlane(w, h, 0.03);
  const shirtShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.28, -0.36);
    shape.lineTo(0.28, -0.36);
    shape.lineTo(0.3, 0.2);
    shape.lineTo(0.47, 0.08);
    shape.lineTo(0.58, 0.26);
    shape.lineTo(0.29, 0.43);
    shape.quadraticCurveTo(0.13, 0.3, 0.09, 0.43);
    shape.quadraticCurveTo(0, 0.34, -0.09, 0.43);
    shape.quadraticCurveTo(-0.13, 0.3, -0.29, 0.43);
    shape.lineTo(-0.58, 0.26);
    shape.lineTo(-0.47, 0.08);
    shape.lineTo(-0.3, 0.2);
    shape.closePath();
    return shape;
  }, []);

  if (model.id === "rollup") {
    return (
      <group position={[0, 0, 0]}>
        {/* base cassette */}
        <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.06, 0.09, d / 100 + 0.16]} />
          <meshStandardMaterial color="#9aa3af" metalness={0.85} roughness={0.32} />
        </mesh>
        <mesh position={[0, h / 2 + 0.09, -0.055]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, h, 12]} />
          <meshStandardMaterial color="#b6bcc6" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* printed canvas */}
        <mesh
          geometry={bulged}
          position={[0, h / 2 + 0.09, 0.01]}
          castShadow
          receiveShadow
        >
          <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  if (model.id === "banner") {
    const grommets = [];
    const cols = Math.max(2, Math.round(w / 0.5));
    for (let i = 0; i <= cols; i++) {
      const x = -w / 2 + (i * w) / cols;
      for (const y of [h / 2 - 0.03, -h / 2 + 0.03]) {
        grommets.push(
          <mesh key={`${i}-${y}`} position={[x, y + h / 2 + 0.4, 0.035]} castShadow>
            <torusGeometry args={[0.014, 0.005, 8, 16]} />
            <meshStandardMaterial color="#cbb27a" metalness={1} roughness={0.28} />
          </mesh>,
        );
      }
    }
    return (
      <group>
        <mesh
          geometry={bannerGeo}
          position={[0, h / 2 + 0.4, 0.02]}
          castShadow
          receiveShadow
        >
          <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
        </mesh>
        {grommets}
      </group>
    );
  }

  if (model.id === "flag") {
    const panelDepth = Math.max(0.025, d);
    const panelY = h / 2 + 1.15;
    const wallX = -w / 2 - 0.34;
    return (
      <group position={[0, 1.5, 0]}>
        {/* wall */}
        <mesh position={[-w / 2 - 0.22, -0.2, -0.1]} receiveShadow>
          <boxGeometry args={[0.12, 2.6, 1.6]} />
          <meshStandardMaterial color="#8d8478" roughness={0.95} />
        </mesh>
        {/* bracket */}
        <mesh position={[-w / 2 - 0.09, 0, 0]} castShadow>
          <boxGeometry args={[0.16, 0.04, 0.04]} />
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, Math.max(0.02, d / 100)]} />
          <ArtMaterial map={art} mask={maskTex} finish={finish} />
        </mesh>
      </group>
    );
  }

  if (model.id === "counter") {
    return (
      <group position={[0, h / 2, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[w / 2, w / 2, h, 40, 1, false, -Math.PI / 2, Math.PI]} />
          <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, h / 2 + 0.035, 0]} castShadow>
          <boxGeometry args={[w + 0.12, 0.07, Math.max(d, 0.38)]} />
          <meshStandardMaterial color="#34383d" roughness={0.38} />
        </mesh>
      </group>
    );
  }

  if (model.id === "box") {
    const bw = model.dims.w / 100;
    const bh = model.dims.h / 100;
    const bd = model.dims.d / 100;
    const lidH = Math.max(0.018, bh * 0.22);
    const baseH = bh - lidH;
    return (
      <group position={[0, 0.001, 0]}>
        {/* base of the box */}
        <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bw * 0.985, baseH, bd * 0.985]} />
          <meshStandardMaterial color="#ded5c7" roughness={0.82} />
        </mesh>
        {/* printed lid */}
        <mesh position={[0, baseH + lidH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[bw, lidH, bd]} />
          <meshStandardMaterial attach="material-0" color="#efe8dd" roughness={0.7} />
          <meshStandardMaterial attach="material-1" color="#efe8dd" roughness={0.7} />
          <ArtMaterial map={art} mask={maskTex} finish={finish} />
          <meshStandardMaterial attach="material-3" color="#d6ccbc" roughness={0.85} />
          <meshStandardMaterial attach="material-4" color="#efe8dd" roughness={0.7} />
          <meshStandardMaterial attach="material-5" color="#efe8dd" roughness={0.7} />
        </mesh>
        {/* lid shadow line */}
        <mesh position={[0, baseH, 0]}>
          <boxGeometry args={[bw * 1.002, 0.003, bd * 1.002]} />
          <meshStandardMaterial color="#b6ac9c" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (model.id === "poster" || model.id === "poster-a") {
    const fw = w + 0.05;
    const fh = h + 0.05;
    const framed = model.id === "poster";
    return (
      <group position={[0, h / 2 + 0.35, 0]}>
        {framed && (
          <mesh position={[0, 0, -0.012]} castShadow receiveShadow>
            <boxGeometry args={[fw, fh, 0.02]} />
            <meshStandardMaterial color="#16181d" metalness={0.5} roughness={0.45} />
          </mesh>
        )}
        {!framed && (
          <mesh position={[0, 0, -0.002]} castShadow receiveShadow>
            <boxGeometry args={[w, h, 0.003]} />
            <meshStandardMaterial color="#f3f0ea" roughness={0.92} />
          </mesh>
        )}
        <mesh position={[0, 0, 0.002]} castShadow receiveShadow>
          <planeGeometry args={[w, h]} />
          <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }



  if (model.id === "leaflet") {
    const folds = model.variantLabel?.startsWith("2") ? 2 : model.variantLabel?.startsWith("4") ? 4 : 3;
    const panelW = w / folds;
    return (
      <group position={[0, h / 2 + 0.2, 0]} rotation-x={-0.12}>
        {Array.from({ length: folds }, (_, index) => {
          const angle = (index - (folds - 1) / 2) * 0.2;
          return (
            <mesh key={index} position={[(index - (folds - 1) / 2) * panelW * 0.94, 0, Math.abs(index - (folds - 1) / 2) * 0.025]} rotation-y={angle} castShadow>
              <planeGeometry args={[panelW, h]} />
              <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
    );
  }

  if (model.id === "tshirt") {
    const scale = h / 0.86;
    return (
      <group position={[0, h / 2 + 0.12, 0]} scale={[scale, scale, scale]}>
        <mesh castShadow>
          <shapeGeometry args={[shirtShape]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.92} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.02, 0.006]}>
          <planeGeometry args={[0.34, 0.42]} />
          <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  if (model.id === "cap") {
    return (
      <group position={[0, h / 2 + 0.16, 0]} rotation-x={-0.08}>
        <mesh scale={[w / 0.3, h / 0.18, d / 0.32]} castShadow>
          <sphereGeometry args={[0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#30343a" roughness={0.82} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -h * 0.25, d * 0.34]} rotation-x={-0.12} castShadow>
          <sphereGeometry args={[w * 0.42, 24, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#252a30" roughness={0.78} />
        </mesh>
        <mesh position={[0, h * 0.08, d * 0.43]}>
          <planeGeometry args={[model.printArea.w / 100, model.printArea.h / 100]} />
          <ArtMaterial map={art} mask={maskTex} finish={finish} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // bag
  const bw = model.dims.w / 100;
  const bh = model.dims.h / 100;
  const bd = model.dims.d / 100;
  return (
    <group position={[0, bh / 2 + 0.001, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[bw, bh, bd]} />
        <meshStandardMaterial attach="material-0" color="#c49a6c" roughness={0.9} />
        <meshStandardMaterial attach="material-1" color="#c49a6c" roughness={0.9} />
        <meshStandardMaterial attach="material-2" color="#b98f61" roughness={0.95} />
        <meshStandardMaterial attach="material-3" color="#a9835a" roughness={0.95} />
        <ArtMaterial map={art} mask={maskTex} finish={finish} color="#c49a6c" />
        <meshStandardMaterial attach="material-5" color="#c49a6c" roughness={0.9} />
      </mesh>
      {[-bw / 5, bw / 5].map((x) => (
        <mesh key={x} position={[x, bh / 2 + 0.03, bd / 2 - 0.01]} castShadow>
          <torusGeometry args={[0.045, 0.005, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#8a6a45" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
