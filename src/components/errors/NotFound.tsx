import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, MeshWobbleMaterial, Sparkles, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Box, RotateCcw, Compass, ExternalLink, TriangleAlert } from 'lucide-react';

const FONT_URL = "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json";

// --- MAILLAGE 3D INTERACTIF & AUTO-ANIMÉ ---
function MeshErrorObject() {
  const [hovered, setHovered] = useState(false);

  return (
    <group>
      {/* Effet de flottement physique fluide */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Sparkles count={50} scale={4} size={2} speed={0.4} color={hovered ? "#ea580c" : "#f97316"} />

        {/* Texte 3D "404" avec réaction au survol */}
        <Suspense fallback={null}>
          <Center top>
            <Text3D
              font={FONT_URL}
              size={1.2}
              height={0.3}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              404
              <MeshWobbleMaterial
                color={hovered ? "#ea580c" : "#f97316"}
                factor={hovered ? 0.4 : 0.15}
                speed={2.5}
                roughness={0.15}
                metalness={0.8}
              />
            </Text3D>
          </Center>
        </Suspense>

        {/* Cages de maillage fil de fer à géométries imbriquées */}
        <mesh scale={2.2}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#cbd5e1" wireframe />
        </mesh>

        <mesh scale={2.8} rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#f97316" wireframe transparent opacity={0.25} />
        </mesh>
      </Float>

      {/* Grille de sol 3D sous l'objet */}
      <gridHelper args={[12, 12, "#ea580c", "#e2e8f0"]} position={[0, -2, 0]} />
    </group>
  );
}

// --- COMPOSANT PRINCIPAL ---
export function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 flex flex-col justify-between font-sans selection:bg-[#f97316] selection:text-white">

      {/* 1. NAVBAR - Zone dédiée et isolée en haut */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/60 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-md shadow-[#f97316]/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-900 font-['Space_Grotesk']">
            SPC <span className="text-[#f97316]">3D STUDIO</span>
          </span>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 shadow-sm flex items-center gap-1.5">
          <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
          ERR_MODEL_NOT_FOUND (404)
        </span>
      </header>

      {/* 2. MAIN CONTENT - Layout Split 50/50 (Grille 2 colonnes) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">

        {/* Colonne Gauche : Simulation 3D Isolé dans son propre Canvas */}
        <div className="w-full h-95 sm:h-112.5 lg:h-125 bg-slate-100/50 border border-slate-200/80 rounded-3xl overflow-hidden relative shadow-inner">
          <div className="absolute top-4 left-4 z-10 text-[10px] font-mono text-slate-400 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200">
            VIEWPORT_3D // DRAG_TO_ROTATE
          </div>

          <Canvas
            camera={{ position: [0, 1, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ea580c" />

            <Suspense fallback={null}>
              <Environment preset="studio" />
              <MeshErrorObject />
            </Suspense>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>

        {/* Colonne Droite : Message & Actions (Aucun risque de chevauchement) */}
        <div className="flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-mono">
            <span>Coordonnées spatiales invalides</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-['Space_Grotesk'] leading-tight">
            Maillage 3D introuvable ou supprimé
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
            La scène 3D ou l&apos;actif de réalité augmentée demandé n&apos;a pas pu être chargé dans le viewport actuel. Vérifiez l&apos;URL ou retournez au menu principal.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full pt-2">
            <a
              href="/"
              className="px-6 py-3.5 rounded-xl bg-linear-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#f97316]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              Retourner au Studio 3D
            </a>

            <a
              href="https://tools.stafprint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <Compass className="w-4 h-4 text-[#f97316]" />
              Explorer SPC Tools
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </main>

      {/* 3. FOOTER - Zone dédiée en bas */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono z-20">
        <div>
          © 2026 <span className="text-slate-800 font-bold">STAF PRINT CENTER</span>. Tous droits réservés.
        </div>
        <div className="flex items-center gap-6">
          <a href="https://stafprint.com" className="hover:text-slate-900 transition-colors">stafprint.com</a>
          <a href="https://brief.stafprint.com" className="hover:text-[#f97316] transition-colors">brief.stafprint.com</a>
          <a href="https://tools.stafprint.com" className="hover:text-[#f97316] transition-colors">tools.stafprint.com</a>
        </div>
      </footer>
    </div>
  );
}