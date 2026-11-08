import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { canvasProps } from './common';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';
import { zahlwort } from '../content/words';

type Item = 'apfel' | 'ball' | 'stern';
const COLORS: Record<Item, string> = { apfel: '#E63946', ball: '#3A86FF', stern: '#FFD60A' };

function Thing({ item, start, target, collected, onCollect }: { item: Item; start: THREE.Vector3; target: THREE.Vector3; collected: boolean; onCollect: () => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const goal = collected ? target : start;
    g.position.lerp(goal, Math.min(1, dt * 5));
    if (!collected) g.rotation.y += dt * 0.6;
  });
  return (
    <group ref={ref} position={start} onClick={(e) => { e.stopPropagation(); if (!collected) onCollect(); }}>
      {item === 'stern' ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.14, 5]} />
          <meshStandardMaterial color={COLORS[item]} flatShading />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[0.32, 24, 16]} />
          <meshStandardMaterial color={COLORS[item]} roughness={0.4} />
        </mesh>
      )}
      {item === 'apfel' && (
        <>
          <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.03, 0.03, 0.15]} /><meshStandardMaterial color="#6B3E1E" /></mesh>
          <mesh position={[0.1, 0.38, 0]} rotation={[0, 0, -0.8]} scale={[1, 0.5, 0.3]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color="#38B000" /></mesh>
        </>
      )}
    </group>
  );
}

export default function Count3D({ count, item }: { count: number; item: Item }) {
  const [collected, setCollected] = useState<number[]>([]);
  const starts = useMemo(() => Array.from({ length: count }, (_, i) => {
    const cols = Math.min(count, 5);
    const row = Math.floor(i / cols), col = i % cols;
    return new THREE.Vector3(-2.2 + col * 0.8 + (row % 2) * 0.3, -0.4 + row * 0.85, (row % 2) * -0.4);
  }), [count]);
  const targets = useMemo(() => Array.from({ length: count }, (_, i) => new THREE.Vector3(2.3 + ((i % 3) - 1) * 0.35, -0.75 + Math.floor(i / 3) * 0.3, 0)), [count]);
  const collect = (i: number) => {
    const n = collected.length + 1;
    setCollected((c) => [...c, i]);
    sfx.pop();
    speak(zahlwort(n), { force: false });
  };
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-2">
      <div className="h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-himmel-100 to-minze-100 sm:h-72" role="img" aria-label={`3D-Szene mit ${count} Dingen zum Einsammeln`} data-testid="canvas-3d">
        <Canvas {...canvasProps} camera={{ position: [0, 0.6, 5.2], fov: 50 }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[2, 5, 4]} intensity={1.3} />
          <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#8EE3BF" />
          </mesh>
          {/* Korb */}
          <mesh position={[2.3, -0.85, 0]}>
            <cylinderGeometry args={[0.75, 0.55, 0.6, 24, 1, true]} />
            <meshStandardMaterial color="#C98B4B" side={THREE.DoubleSide} />
          </mesh>
          {starts.map((s, i) => (
            <Thing key={i} item={item} start={s} target={targets[collected.indexOf(i)] ?? targets[0]!} collected={collected.includes(i)} onCollect={() => collect(i)} />
          ))}
        </Canvas>
      </div>
      <div className="flex items-center gap-3" aria-live="polite">
        <span className="font-display text-xl font-bold">Im Korb: {collected.length}</span>
        {collected.length > 0 && <button type="button" className="rounded-full bg-white px-3 py-1 text-sm shadow" onClick={() => setCollected([])}>Zurücklegen</button>}
      </div>
    </div>
  );
}
