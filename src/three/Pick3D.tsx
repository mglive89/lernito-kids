import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { canvasProps, RotatingGroup, useDragRotation, useLabelTexture } from './common';

interface Item { id: string; label: string }
type State = 'normal' | 'richtig' | 'falsch' | 'aus';

const CUBE_COLORS = ['#FFB627', '#3A9BDC', '#2EC4B6', '#FF6F59', '#8E6CEF', '#FF8FC7'];

function NumberCube({ item, pos, color, state, onPick, moved }: { item: Item; pos: [number, number, number]; color: string; state: State; onPick: () => void; moved: () => number }) {
  const tex = useLabelTexture(item.label, color, '#FFFFFF');
  const ref = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 1.4 + phase) * 0.12;
    const s = state === 'richtig' ? 1.25 : state === 'aus' ? 0.75 : 1;
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
  });
  return (
    <mesh ref={ref} position={pos} onClick={(e) => { e.stopPropagation(); if (moved() < 12) onPick(); }}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial map={tex} transparent opacity={state === 'aus' ? 0.35 : 1} />
    </mesh>
  );
}

function Creature({ item, pos, state, onPick, moved }: { item: Item; pos: [number, number, number]; state: State; onPick: () => void; moved: () => number }) {
  const tex = useLabelTexture(item.label, null);
  const ref = useRef<THREE.Sprite>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = pos[1] + Math.abs(Math.sin(clock.elapsedTime * 2 + phase)) * 0.15;
    const s = state === 'richtig' ? 1.4 : state === 'aus' ? 0.8 : 1.1;
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
  });
  return (
    <sprite ref={ref} position={pos} onClick={(e) => { e.stopPropagation(); if (moved() < 12) onPick(); }}>
      <spriteMaterial map={tex} transparent opacity={state === 'aus' ? 0.35 : 1} />
    </sprite>
  );
}

function Tree({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.08, 0.1, 0.6]} /><meshStandardMaterial color="#8B5A2B" /></mesh>
      <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.4, 0.9, 12]} /><meshStandardMaterial color="#38B000" flatShading /></mesh>
    </group>
  );
}

export default function Pick3D({ scene, items, states, onPick }: { scene: 'zahlen' | 'wiese'; items: Item[]; states: Record<string, State>; onPick: (id: string) => void }) {
  const { rot, handlers } = useDragRotation();
  const positions = useMemo<[number, number, number][]>(() => items.map((_, i) => {
    const a = (i / items.length) * Math.PI * 2;
    const r = items.length > 4 ? 2 : 1.6;
    return scene === 'zahlen' ? [Math.cos(a) * r, (i % 2) * 0.5, Math.sin(a) * r] : [Math.cos(a) * r, -0.35, Math.sin(a) * r];
  }), [items, scene]);
  return (
    <div className={`h-72 w-full max-w-2xl overflow-hidden rounded-3xl sm:h-96 ${scene === 'zahlen' ? 'bg-gradient-to-b from-lila-100 to-himmel-100' : 'bg-gradient-to-b from-himmel-100 to-minze-100'}`} {...handlers} role="application" aria-label="3D-Welt: Tippe auf die richtige Antwort, ziehe zum Drehen" data-testid="canvas-3d">
      <Canvas {...canvasProps} camera={{ position: [0, 1.6, 5.2], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <RotatingGroup rot={rot}>
          {scene === 'wiese' && (
            <>
              <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[3.4, 40]} /><meshStandardMaterial color="#8EE3BF" /></mesh>
              <mesh position={[0.4, -0.78, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.6, 24]} /><meshStandardMaterial color="#8ED1FC" /></mesh>
              <Tree pos={[-2.6, -0.8, -1.2]} /><Tree pos={[2.4, -0.8, -1.6]} /><Tree pos={[0, -0.8, -2.8]} />
            </>
          )}
          {items.map((it, i) =>
            scene === 'zahlen'
              ? <NumberCube key={it.id} item={it} pos={positions[i]!} color={CUBE_COLORS[i % CUBE_COLORS.length]!} state={states[it.id] ?? 'normal'} onPick={() => onPick(it.id)} moved={() => rot.current.moved} />
              : <Creature key={it.id} item={it} pos={positions[i]!} state={states[it.id] ?? 'normal'} onPick={() => onPick(it.id)} moved={() => rot.current.moved} />
          )}
        </RotatingGroup>
      </Canvas>
    </div>
  );
}
