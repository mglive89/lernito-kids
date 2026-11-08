import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { LinoMood } from './Lino';
import { MASCOT_DESC } from '../content/mascot';

/*
 * Puppy in 3D – aus einfachen Grundkörpern gebaut (keine externen Modelle, keine Downloads).
 * Gelber Hund mit Schlappohren, blauem Hoodie, beiger Hose und blau-weißen Sneakern.
 */

const COL = {
  fell: '#FFD43B', fellHell: '#FFE070', ohr: '#F0A81C', schnauze: '#FBE3A8', tinte: '#1D2033',
  iris: '#2F74D6', zunge: '#FF7F8E', mund: '#8A1F2B', hoodie: '#2556C9', hoodieDunkel: '#1B43A0',
  hose: '#D9C096', hoseDunkel: '#BFA57A', schuh: '#F7F5EF', schuhBlau: '#2F74D6', kordel: '#F4F4F4'
};

function useMat(color: string, rough = 0.55, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return useMemo(() => new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: rough < 0.4 ? 0.6 : 0.15, clearcoatRoughness: 0.4, sheen: rough > 0.7 ? 0.6 : 0, sheenColor: new THREE.Color(color), ...extra }), [color, rough, extra]);
}

function Capsule({ r, len, mat, ...p }: { r: number; len: number; mat: THREE.Material } & JSX.IntrinsicElements['mesh']) {
  return <mesh castShadow {...p} material={mat}><capsuleGeometry args={[r, len, 12, 24]} /></mesh>;
}
function Ball({ r, mat, scale, ...p }: { r: number; mat: THREE.Material; scale?: [number, number, number] } & Omit<JSX.IntrinsicElements['mesh'], 'scale'>) {
  return <mesh castShadow {...p} scale={scale} material={mat}><sphereGeometry args={[r, 40, 32]} /></mesh>;
}

/** Arm mit Pfote: rotiert um die Schulter */
function Arm({ pose, mats }: { pose: { z: number; x: number }; mats: Record<string, THREE.Material> }) {
  return (
    <group rotation={[pose.x, 0, pose.z]}>
      <Capsule r={0.2} len={0.62} mat={mats.hoodie!} position={[0, -0.42, 0]} />
      <mesh position={[0, -0.8, 0]} material={mats.hoodieDunkel}><torusGeometry args={[0.2, 0.05, 10, 24]} /></mesh>
      <Ball r={0.2} mat={mats.fell!} position={[0, -0.95, 0]} />
    </group>
  );
}

function PuppyModel({ mood, interactive }: { mood: LinoMood; interactive: boolean }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Group>(null);
  const earR = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const mats = {
    fell: useMat(COL.fell, 0.62), fellHell: useMat(COL.fellHell, 0.6), ohr: useMat(COL.ohr, 0.66), schnauze: useMat(COL.schnauze, 0.6),
    tinte: useMat(COL.tinte, 0.25), weiss: useMat('#FFFFFF', 0.2), iris: useMat(COL.iris, 0.2), zunge: useMat(COL.zunge, 0.45), mund: useMat(COL.mund, 0.5),
    hoodie: useMat(COL.hoodie, 0.82), hoodieDunkel: useMat(COL.hoodieDunkel, 0.85), hose: useMat(COL.hose, 0.85), hoseDunkel: useMat(COL.hoseDunkel, 0.85),
    schuh: useMat(COL.schuh, 0.5), schuhBlau: useMat(COL.schuhBlau, 0.45), kordel: useMat(COL.kordel, 0.6)
  };
  const happy = mood !== 'denken' && mood !== 'ruhig';
  const poses: Record<LinoMood, { r: { z: number; x: number }; l: { z: number; x: number } }> = {
    freude: { r: { z: 0.35, x: 0 }, l: { z: -0.35, x: 0 } },
    ruhig: { r: { z: 0.12, x: 0 }, l: { z: -0.12, x: 0 } },
    winken: { r: { z: 2.3, x: 0 }, l: { z: -0.3, x: 0 } },
    jubel: { r: { z: 2.7, x: 0 }, l: { z: -2.7, x: 0 } },
    denken: { r: { z: 2.0, x: -1.0 }, l: { z: -0.25, x: 0 } }
  };
  const pose = poses[mood];

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = mood === 'jubel' ? Math.abs(Math.sin(t * 3.2)) * 0.18 : Math.sin(t * 1.8) * 0.03;
      const targetY = interactive ? pointer.x * 0.55 : Math.sin(t * 0.5) * 0.18;
      root.current.rotation.y += (targetY - root.current.rotation.y) * 0.08;
    }
    if (head.current) {
      head.current.rotation.z = mood === 'denken' ? 0.18 : Math.sin(t * 1.3) * 0.05;
      head.current.rotation.x = interactive ? -pointer.y * 0.18 : 0;
    }
    if (armR.current) armR.current.rotation.z = pose.r.z + (mood === 'winken' ? Math.sin(t * 7) * 0.32 : mood === 'jubel' ? Math.sin(t * 6.4) * 0.12 : Math.sin(t * 1.8) * 0.03);
    if (armL.current) armL.current.rotation.z = pose.l.z + (mood === 'jubel' ? -Math.sin(t * 6.4) * 0.12 : -Math.sin(t * 1.8) * 0.03);
    const ear = Math.sin(t * 2.2) * 0.06;
    if (earL.current) earL.current.rotation.z = -0.12 + ear;
    if (earR.current) earR.current.rotation.z = 0.12 - ear;
    if (tail.current) tail.current.rotation.z = Math.sin(t * (happy ? 9 : 3)) * 0.45;
  });

  return (
    <group ref={root}>
      {/* Beine und Hose */}
      {[-1, 1].map((s) => (
        <group key={`b${s}`} position={[s * 0.3, 0, 0]}>
          <Capsule r={0.27} len={0.45} mat={mats.hose} position={[0, 0.58, 0]} />
          <mesh position={[0, 0.3, 0]} material={mats.hoseDunkel}><torusGeometry args={[0.26, 0.05, 10, 24]} /></mesh>
          {/* Sneaker */}
          <Ball r={0.3} mat={mats.schuhBlau} scale={[0.95, 0.62, 1.35]} position={[0, 0.17, 0.12]} />
          <Ball r={0.31} mat={mats.schuh} scale={[1, 0.3, 1.4]} position={[0, 0.06, 0.12]} />
          <Ball r={0.12} mat={mats.schuh} scale={[1.3, 0.6, 1]} position={[0, 0.25, 0.42]} />
        </group>
      ))}
      {/* Körper im Hoodie */}
      <Capsule r={0.72} len={0.55} mat={mats.hoodie} position={[0, 1.35, 0]} scale={[1, 1, 0.86]} />
      <mesh position={[0, 0.84, 0]} material={mats.hoodieDunkel} scale={[1, 1, 0.86]}><torusGeometry args={[0.66, 0.08, 12, 40]} /></mesh>
      {/* Bauchtasche */}
      <mesh position={[0, 1.1, 0.56]} rotation={[-0.2, 0, Math.PI / 2]} material={mats.hoodieDunkel} scale={[1, 1, 0.35]}><capsuleGeometry args={[0.15, 0.5, 8, 16]} /></mesh>
      {/* Kordeln */}
      {[-1, 1].map((s) => <Capsule key={`k${s}`} r={0.025} len={0.35} mat={mats.kordel} position={[s * 0.14, 1.62, 0.62]} />)}
      {/* Kapuze */}
      <mesh position={[0, 1.95, -0.12]} rotation={[Math.PI / 2.3, 0, 0]} material={mats.hoodieDunkel}><torusGeometry args={[0.46, 0.15, 14, 36]} /></mesh>
      {/* Schwanz */}
      <group ref={tail} position={[0, 1.0, -0.6]}>
        <Capsule r={0.09} len={0.32} mat={mats.fell} position={[0, 0.18, -0.08]} rotation={[-0.6, 0, 0]} />
      </group>
      {/* Arme */}
      <group ref={armR} position={[0.7, 1.68, 0]}><Arm pose={{ z: 0, x: pose.r.x }} mats={mats} /></group>
      <group ref={armL} position={[-0.7, 1.68, 0]}><Arm pose={{ z: 0, x: pose.l.x }} mats={mats} /></group>

      {/* Kopf */}
      <group ref={head} position={[0, 2.62, 0.02]}>
        <Ball r={0.86} mat={mats.fell} scale={[1.08, 0.96, 0.98]} />
        {/* Haarbüschel */}
        {[-0.18, 0, 0.18].map((x, i) => <mesh key={x} position={[x, 0.82, 0.05]} rotation={[0, 0, -x * 1.6]} material={mats.fellHell} castShadow><coneGeometry args={[0.12, 0.3 + (i === 1 ? 0.08 : 0), 16]} /></mesh>)}
        {/* Schlappohren */}
        <group ref={earL} position={[-0.8, 0.5, 0.0]}>
          <Ball r={0.36} mat={mats.ohr} scale={[0.55, 1.55, 0.38]} position={[-0.12, -0.62, 0]} />
        </group>
        <group ref={earR} position={[0.8, 0.5, 0.0]}>
          <Ball r={0.36} mat={mats.ohr} scale={[0.55, 1.55, 0.38]} position={[0.12, -0.62, 0]} />
        </group>
        {/* Schnauze */}
        <Ball r={0.44} mat={mats.schnauze} scale={[1.12, 0.78, 0.82]} position={[0, -0.26, 0.6]} />
        <Ball r={0.13} mat={mats.tinte} scale={[1.4, 0.95, 0.9]} position={[0, -0.12, 0.96]} />
        <Ball r={0.04} mat={mats.weiss} position={[-0.05, -0.08, 1.07]} />
        {/* Augen */}
        {[-1, 1].map((s) => (
          <group key={`a${s}`} position={[s * 0.32, 0.16, 0.7]}>
            {mood === 'ruhig' ? (
              <mesh rotation={[0, 0, Math.PI]} material={mats.tinte}><torusGeometry args={[0.1, 0.028, 8, 20, Math.PI]} /></mesh>
            ) : (
              <>
                <Ball r={0.17} mat={mats.weiss} scale={[0.9, 1.1, 0.6]} />
                <Ball r={0.11} mat={mats.iris} scale={[1, 1.1, 0.6]} position={[0, mood === 'denken' ? 0.05 : -0.01, 0.07]} />
                <Ball r={0.065} mat={mats.tinte} position={[0, mood === 'denken' ? 0.05 : -0.01, 0.12]} />
                <Ball r={0.03} mat={mats.weiss} position={[0.04, 0.05, 0.16]} />
              </>
            )}
          </group>
        ))}
        {/* Augenbrauen beim Nachdenken */}
        {/* Mund */}
        {happy ? (
          <group position={[0, -0.42, 0.86]}>
            <mesh rotation={[0, 0, Math.PI]} material={mats.mund} scale={[1, 0.8, 0.6]}><sphereGeometry args={[0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
            <Ball r={0.08} mat={mats.zunge} scale={[1.2, 0.6, 0.6]} position={[0, -0.07, 0.04]} />
          </group>
        ) : (
          <mesh position={[0, -0.4, 0.9]} rotation={[0, 0, Math.PI + (mood === 'denken' ? 0.2 : 0)]} material={mats.tinte}><torusGeometry args={[0.1, 0.022, 8, 20, Math.PI]} /></mesh>
        )}
        {/* Wangen */}
        {[-1, 1].map((s) => <Ball key={`w${s}`} r={0.1} mat={mats.zunge} scale={[1, 0.6, 0.3]} position={[s * 0.56, -0.18, 0.62]} />)}
      </group>
    </group>
  );
}

function Studio({ onReady }: { onReady?: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    camera.lookAt(0, 1.8, 0);
    let frames = 0;
    let id = 0;
    const tick = () => { if (++frames > 6) onReady?.(); else id = requestAnimationFrame(tick); };
    id = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(id); env.dispose(); pmrem.dispose(); scene.environment = null; };
  }, [gl, scene, camera, onReady]);
  return null;
}

/** Weicher Kontaktschatten (Textur statt Schattenberechnung – schnell auf Tablets). */
function ContactShadow() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, 'rgba(20,24,48,0.45)');
    g.addColorStop(1, 'rgba(20,24,48,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0.05]} scale={[2.6, 1.6, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

export function PuppyScene({ mood = 'freude', interactive = false, onReady, children }: { mood?: LinoMood; interactive?: boolean; onReady?: () => void; children?: ReactNode }) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 9.6], fov: 28 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.NeutralToneMapping }}
      style={{ background: 'transparent' }}
      aria-label={MASCOT_DESC}
      role="img"
    >
      <Studio onReady={onReady} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#FFF3DD" />
      <directionalLight position={[-4, 3, -2]} intensity={0.8} color="#BFD8FF" />
      <directionalLight position={[0, 2, -5]} intensity={0.6} color="#FFFFFF" />
      <PuppyModel mood={mood} interactive={interactive} />
      <ContactShadow />
      {children}
    </Canvas>
  );
}

export default function Puppy3D({ mood = 'freude', interactive = false }: { mood?: LinoMood; interactive?: boolean }) {
  return <PuppyScene mood={mood} interactive={interactive} />;
}
