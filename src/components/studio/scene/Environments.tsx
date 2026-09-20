import { useEffect, useMemo } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { EnvId } from "@/lib/studio/models";

type Vec3 = [number, number, number];

const PALETTES = {
  studio: { ambient: "#eef5ff", key: "#fff8e9", fill: "#cfe7ff" },
  office: { ambient: "#edf7f8", key: "#fff1d8", fill: "#c5e5ed" },
  street: { ambient: "#e3f1ff", key: "#ffe8c9", fill: "#bddcff" },
  showroom: { ambient: "#f0f8f3", key: "#fff0da", fill: "#cce9dc" },
} as const;

/** Lighting is tailored to each location, while preserving accurate print colors. */
export function StudioLighting({ envId }: { envId: EnvId }) {
  const palette = PALETTES[envId];
  const outdoor = envId === "street";

  return (
    <>
      <hemisphereLight
        args={[palette.ambient, outdoor ? "#8f877d" : "#727d87", outdoor ? 1.05 : 0.82]}
      />
      <directionalLight
        position={outdoor ? [5, 8, 4] : [3.5, 6, 4]}
        intensity={outdoor ? 2.8 : 2.35}
        color={palette.key}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={7}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-4, 3, 1]} intensity={1.05} color={palette.fill} />
      <Environment resolution={256}>
        <Lightformer intensity={3.2} color={palette.key} position={[0, 5, 3]} scale={[7, 4, 1]} />
        <Lightformer
          intensity={2}
          color={palette.fill}
          position={[-5, 2, 0]}
          rotation-y={Math.PI / 2}
          scale={[8, 4, 1]}
        />
        <Lightformer
          intensity={1.5}
          color="#ffd2a1"
          position={[5, 2, -1]}
          rotation-y={-Math.PI / 2}
          scale={[8, 3, 1]}
        />
      </Environment>
    </>
  );
}

function usePatternTexture(kind: "concrete" | "wood" | "pavement" | "terrazzo") {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const base = {
      concrete: "#697680",
      wood: "#896b53",
      pavement: "#7c8284",
      terrazzo: "#ece9e2",
    }[kind];
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 256, 256);

    if (kind === "wood") {
      for (let y = 0; y < 256; y += 32) {
        ctx.fillStyle = y % 64 === 0 ? "#9a775b" : "#7d604a";
        ctx.fillRect(0, y, 256, 30);
        ctx.fillStyle = "#59463a";
        ctx.fillRect(0, y + 30, 256, 2);
        const seam = y % 64 === 0 ? 152 : 76;
        ctx.fillRect(seam, y, 2, 30);
      }
    } else if (kind === "pavement") {
      ctx.strokeStyle = "#a3aaad";
      ctx.lineWidth = 2;
      for (let y = 0; y <= 256; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
      for (let x = 0; x <= 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
      }
    } else {
      const seed = kind === "concrete" ? 17 : 31;
      for (let i = 0; i < 420; i++) {
        const x = (i * 73 + seed) % 256;
        const y = (i * 47 + seed * 3) % 256;
        const size = kind === "terrazzo" ? 2 + (i % 4) : 1;
        ctx.fillStyle =
          kind === "terrazzo"
            ? i % 3 === 0
              ? "#c3bdb2"
              : i % 3 === 1
                ? "#9aa2a6"
                : "#d8cfc0"
            : i % 3 === 0
              ? "#69716f"
              : i % 3 === 1
                ? "#2e373b"
                : "#8b7b69";
        ctx.fillRect(x, y, size, size);
      }
    }

    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.wrapS = result.wrapT = THREE.RepeatWrapping;
    result.repeat.set(kind === "wood" ? 6 : 10, kind === "wood" ? 6 : 10);
    result.anisotropy = 4;
    return result;
  }, [kind]);

  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

/** Softbox on a tripod: the group sits on the floor (y = 0). */
function Softbox({
  position,
  rotation = [0, 0, 0],
  height = 2.1,
}: {
  position: Vec3;
  rotation?: Vec3;
  height?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* tripod legs */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
        <mesh
          key={a}
          position={[Math.sin(a) * 0.19, 0.22, Math.cos(a) * 0.19]}
          rotation={[Math.cos(a) * 0.32, 0, -Math.sin(a) * 0.32]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.022, 0.52, 10]} />
          <meshStandardMaterial color="#23282e" metalness={0.6} roughness={0.42} />
        </mesh>
      ))}
      {/* mast */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.026, 0.038, height, 12]} />
        <meshStandardMaterial color="#23282e" metalness={0.65} roughness={0.4} />
      </mesh>
      {/* softbox head */}
      <group position={[0, height, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.92, 1.18, 0.16]} />
          <meshStandardMaterial color="#1d2126" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[0.84, 1.1]} />
          <meshStandardMaterial
            color="#fdf6e8"
            emissive="#fff3d9"
            emissiveIntensity={0.9}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}

function Plant({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.23, 0.17, 0.44, 18]} />
        <meshStandardMaterial color="#8d7059" roughness={0.85} />
      </mesh>
      {([[-0.14, 0.68, 0], [0.16, 0.8, 0.05], [0, 1.0, -0.06], [0.24, 0.58, -0.1]] as Vec3[]).map(
        ([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]} rotation-z={(index - 1.5) * 0.32} castShadow>
            <sphereGeometry args={[0.18, 12, 8]} />
            <meshStandardMaterial color={index % 2 ? "#4e8159" : "#3c6a48"} roughness={0.9} />
          </mesh>
        ),
      )}
    </group>
  );
}

/** Real photo studio: flat working floor, warm backdrop, stands, softboxes and camera gear. */
function PhotoStudio() {
  return (
    <group name="env-decor">
      {/* seamless white cyclorama floor + wall */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#e9eaec" roughness={0.75} />
      </mesh>
      <mesh position={[0, 4.4, -4.6]} receiveShadow>
        <planeGeometry args={[20, 9]} />
        <meshStandardMaterial color="#f2f3f4" roughness={0.9} />
      </mesh>
      {/* curved cove joining floor and wall */}
      <mesh position={[0, 0.9, -3.7]} rotation-x={-Math.PI / 2} receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 20, 32, 1, true, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#eeeff1" side={THREE.DoubleSide} roughness={0.88} />
      </mesh>
      {/* overhead lighting truss */}
      <group position={[0, 4.3, -0.6]}>
        {[-0.22, 0.22].map((z) => (
          <mesh key={z} position={[0, 0, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 12, 10]} />
            <meshStandardMaterial color="#3a4048" metalness={0.75} roughness={0.35} />
          </mesh>
        ))}
        {[-4.2, -2.1, 0, 2.1, 4.2].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
            <meshStandardMaterial color="#3a4048" metalness={0.75} roughness={0.35} />
          </mesh>
        ))}
      </group>
      {/* studio strobes on stands, resting on the floor */}
      <Softbox position={[-3.1, 0, 1.6]} rotation={[0, 0.5, 0]} height={2.25} />
      <Softbox position={[3.1, 0, 1.4]} rotation={[0, -0.5, 0]} height={2.0} />
      {/* large scrim / reflector panel */}
      <group position={[-3.9, 0, -1.2]} rotation-y={0.7}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.5, 2.2, 0.05]} />
          <meshStandardMaterial color="#f6f2e9" roughness={0.6} />
        </mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.15, 0.12]} rotation-x={0.25} castShadow>
            <cylinderGeometry args={[0.02, 0.024, 0.34, 8]} />
            <meshStandardMaterial color="#23282e" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* camera on tripod */}
      <group position={[2.0, 0, 2.4]} rotation-y={-0.45}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
          <mesh
            key={a}
            position={[Math.sin(a) * 0.26, 0.6, Math.cos(a) * 0.26]}
            rotation={[Math.cos(a) * 0.4, 0, -Math.sin(a) * 0.4]}
            castShadow
          >
            <cylinderGeometry args={[0.016, 0.02, 1.3, 10]} />
            <meshStandardMaterial color="#20252b" metalness={0.6} roughness={0.42} />
          </mesh>
        ))}
        <mesh position={[0, 1.28, 0]} castShadow>
          <boxGeometry args={[0.28, 0.18, 0.2]} />
          <meshStandardMaterial color="#15181c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.28, 0.2]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.24, 20]} />
          <meshStandardMaterial color="#0f1215" metalness={0.4} roughness={0.35} />
        </mesh>
      </group>
      {/* apple boxes and a rolling case on the floor */}
      <group position={[-2.3, 0, 2.6]}>
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.62, 0.24, 0.42]} />
          <meshStandardMaterial color="#b98f5c" roughness={0.85} />
        </mesh>
        <mesh position={[0.05, 0.34, 0.03]} rotation-y={0.2} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.2, 0.38]} />
          <meshStandardMaterial color="#c79c68" roughness={0.85} />
        </mesh>
      </group>
      <group position={[3.5, 0, 2.7]} rotation-y={0.3}>
        <mesh position={[0, 0.33, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.66, 0.44]} />
          <meshStandardMaterial color="#20242a" roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.68, 0]} castShadow>
          <boxGeometry args={[0.74, 0.05, 0.46]} />
          <meshStandardMaterial color="#d2762f" roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}


function ModernOffice() {
  const floor = usePatternTexture("wood");
  return (
    <group name="env-decor">
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={floor} color="#8b735f" roughness={0.75} />
      </mesh>
      <mesh position={[0, 3.7, -4]} receiveShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color="#71848c" roughness={0.95} />
      </mesh>
      <group position={[2.25, 0, -1.4]}>
        <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.08, 1.05]} />
          <meshStandardMaterial color="#866142" roughness={0.55} />
        </mesh>
        {[-1.15, 1.15].map((x) => (
          <mesh key={x} position={[x, 0.38, 0]} castShadow>
            <boxGeometry args={[0.07, 0.76, 0.82]} />
            <meshStandardMaterial color="#242c31" metalness={0.55} roughness={0.42} />
          </mesh>
        ))}
        <mesh position={[0, 1.25, -0.25]} castShadow>
          <boxGeometry args={[1.12, 0.68, 0.06]} />
          <meshStandardMaterial color="#151b20" metalness={0.35} roughness={0.24} />
        </mesh>
        <mesh position={[0, 1.25, -0.215]}>
          <planeGeometry args={[0.98, 0.54]} />
          <meshStandardMaterial color="#274854" emissive="#315f6f" emissiveIntensity={0.32} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.96, -0.24]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.28, 12]} />
          <meshStandardMaterial color="#252d32" metalness={0.6} />
        </mesh>
      </group>
      <group position={[-2.7, 1.65, -3.72]}>
        {[-0.75, 0, 0.75].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow>
            <boxGeometry args={[2.1, 0.06, 0.35]} />
            <meshStandardMaterial color="#27343a" metalness={0.2} roughness={0.55} />
          </mesh>
        ))}
        {[-0.75, 0.75].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 1.55, 0.34]} />
            <meshStandardMaterial color="#27343a" metalness={0.2} roughness={0.55} />
          </mesh>
        ))}
        {[-0.48, -0.15, 0.22, 0.5].map((x, index) => (
          <mesh key={x} position={[x, 0.17, 0.18]} rotation-z={(index - 1) * 0.06} castShadow>
            <boxGeometry args={[0.2, 0.54, 0.2]} />
            <meshStandardMaterial color={["#b25136", "#d69a3a", "#3d7a75", "#718d54"][index] ?? "#b25136"} roughness={0.8} />
          </mesh>
        ))}
      </group>
      <Plant position={[-2.1, 0, -1]} scale={0.9} />
      <mesh position={[-2.5, 2.65, -3.75]}>
        <planeGeometry args={[2.2, 1.15]} />
        <meshStandardMaterial color="#bb7847" roughness={0.9} />
      </mesh>
    </group>
  );
}

function UrbanStreet() {
  const pavement = usePatternTexture("pavement");
  return (
    <group name="env-decor">
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial map={pavement} color="#777b7b" roughness={0.98} />
      </mesh>
      <mesh position={[0, 4, -4.2]} receiveShadow>
        <boxGeometry args={[20, 8, 0.45]} />
        <meshStandardMaterial color="#a27d69" roughness={0.96} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => (
        <mesh key={index} position={[-8 + index * 2, 4, -3.96]} receiveShadow>
          <boxGeometry args={[0.055, 8, 0.03]} />
          <meshStandardMaterial color="#4f3b34" roughness={1} />
        </mesh>
      ))}
      {[-5.3, 0, 5.3].map((x) => (
        <group key={x} position={[x, 2.45, -3.92]}>
          <mesh castShadow>
            <boxGeometry args={[2.35, 3.3, 0.12]} />
            <meshStandardMaterial color="#1c3037" metalness={0.45} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[2.05, 2.98]} />
            <meshStandardMaterial color="#395768" metalness={0.35} roughness={0.18} />
          </mesh>
          <mesh position={[0, 1.87, 0.12]} castShadow>
            <boxGeometry args={[2.7, 0.14, 0.55]} />
            <meshStandardMaterial color="#273139" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.1, 1.75]} receiveShadow>
        <boxGeometry args={[22, 0.2, 0.34]} />
        <meshStandardMaterial color="#aaa495" roughness={0.95} />
      </mesh>
      <group position={[-3.3, 0, 1.1]}>
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.075, 3.4, 12]} />
          <meshStandardMaterial color="#242b30" metalness={0.72} roughness={0.42} />
        </mesh>
        <mesh position={[0, 3.32, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.2, 0.35, 12]} />
          <meshStandardMaterial color="#242b30" metalness={0.65} roughness={0.38} />
        </mesh>
        <pointLight position={[0, 3.22, 0.1]} intensity={0.5} color="#ffd39a" distance={5} />
      </group>
      <group position={[3.2, 0, 1.1]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.7, 0.1, 0.55]} />
          <meshStandardMaterial color="#6f4732" roughness={0.78} />
        </mesh>
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.22, 0]} castShadow>
            <boxGeometry args={[0.08, 0.45, 0.48]} />
            <meshStandardMaterial color="#30383d" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Bright retail showroom: glossy floor, glazed storefront, display plinths, counter, seating. */
function Showroom() {
  const terrazzo = usePatternTexture("terrazzo");
  return (
    <group name="env-decor">
      {/* polished terrazzo floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial map={terrazzo} color="#ffffff" roughness={0.26} metalness={0.12} />
      </mesh>
      {/* back wall + ceiling */}
      <mesh position={[0, 4.2, -5]} receiveShadow>
        <planeGeometry args={[22, 9]} />
        <meshStandardMaterial color="#f0ece5" roughness={0.92} />
      </mesh>
      <mesh position={[0, 4.6, -1]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[22, 12]} />
        <meshStandardMaterial color="#f6f4f0" roughness={0.95} />
      </mesh>
      {/* glazed storefront on the right, mullions + daylight */}
      <group position={[6.4, 0, -1]} rotation-y={-Math.PI / 2}>
        <mesh position={[0, 2.3, 0]}>
          <planeGeometry args={[9, 4.6]} />
          <meshStandardMaterial
            color="#cfe6f2"
            emissive="#e7f4ff"
            emissiveIntensity={0.45}
            transparent
            opacity={0.55}
            roughness={0.08}
            metalness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        {[-3, -1, 1, 3].map((x) => (
          <mesh key={x} position={[x, 2.3, 0.03]} castShadow>
            <boxGeometry args={[0.08, 4.6, 0.08]} />
            <meshStandardMaterial color="#3b4248" metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
      </group>
      {/* wooden slat feature wall */}
      {Array.from({ length: 16 }, (_, index) => (
        <mesh key={index} position={[-6.6 + index * 0.42, 1.9, -4.9]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 3.8, 0.1]} />
          <meshStandardMaterial color={index % 2 ? "#b98b5c" : "#a97b4e"} roughness={0.72} />
        </mesh>
      ))}
      {/* track spotlights */}
      <mesh position={[0, 4.5, -1.6]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 11, 10]} />
        <meshStandardMaterial color="#2c3238" metalness={0.7} roughness={0.35} />
      </mesh>
      {[-3.4, 0, 3.4].map((x) => (
        <group key={x} position={[x, 4.35, -1.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.13, 0.26, 16]} />
            <meshStandardMaterial color="#2c3238" metalness={0.7} roughness={0.3} />
          </mesh>
          <spotLight
            position={[0, -0.1, 0]}
            target-position={[x * 0.5, 0, 0.4]}
            intensity={16}
            angle={0.45}
            penumbra={0.85}
            distance={9}
            color="#fff2de"
          />
        </group>
      ))}
      {/* display plinths */}
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 0, -1.8]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.9, 0.95]} />
            <meshStandardMaterial color="#f5f2ec" roughness={0.42} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[1.02, 0.05, 1.02]} />
            <meshStandardMaterial color="#c08a4c" roughness={0.42} metalness={0.2} />
          </mesh>
        </group>
      ))}
      {/* reception counter */}
      <group position={[-4.4, 0, 1.4]} rotation-y={0.35}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.1, 0.6]} />
          <meshStandardMaterial color="#ece7de" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.13, 0.02]} castShadow>
          <boxGeometry args={[2.55, 0.07, 0.72]} />
          <meshStandardMaterial color="#8d5f38" roughness={0.42} />
        </mesh>
      </group>
      {/* lounge seating */}
      <group position={[3.6, 0, 2.3]} rotation-y={-0.4}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.32, 0.8]} />
          <meshStandardMaterial color="#5c6f7a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.62, -0.35]} castShadow>
          <boxGeometry args={[1.7, 0.6, 0.16]} />
          <meshStandardMaterial color="#67818d" roughness={0.85} />
        </mesh>
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.08, 0.3]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.16, 10]} />
            <meshStandardMaterial color="#3b3027" roughness={0.6} />
          </mesh>
        ))}
      </group>
      <Plant position={[-2.2, 0, 2.6]} scale={1.2} />
      <Plant position={[5.2, 0, -3.2]} scale={1.35} />
      {/* brand sign on the back wall */}
      <mesh position={[-2.6, 3.1, -4.78]} castShadow>
        <boxGeometry args={[2.8, 0.7, 0.07]} />
        <meshStandardMaterial color="#e07a34" emissive="#f97316" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}


/** Complete location-specific decor, hidden when exporting a transparent PNG. */
export function EnvironmentDecor({ envId }: { envId: EnvId }) {
  if (envId === "studio") return <PhotoStudio />;
  if (envId === "office") return <ModernOffice />;
  if (envId === "street") return <UrbanStreet />;
  return <Showroom />;
}