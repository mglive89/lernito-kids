import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { SolidName } from '../learning/types';
import { canvasProps, RotatingGroup, useDragRotation } from './common';

function makeGeometry(solid: SolidName): THREE.BufferGeometry {
  switch (solid) {
    case 'wuerfel': return new THREE.BoxGeometry(1.6, 1.6, 1.6);
    case 'quader': return new THREE.BoxGeometry(2.4, 1.2, 1.2);
    case 'kugel': return new THREE.SphereGeometry(1.1, 32, 24);
    case 'zylinder': return new THREE.CylinderGeometry(0.9, 0.9, 1.9, 32);
    case 'kegel': return new THREE.ConeGeometry(1, 2, 32);
    case 'pyramide': return new THREE.ConeGeometry(1.25, 1.8, 4);
  }
}

export default function Solid3D({ solid, color }: { solid: SolidName; color: string }) {
  const { rot, handlers } = useDragRotation();
  const geo = useMemo(() => makeGeometry(solid), [solid]);
  const edges = useMemo(() => (['wuerfel', 'quader', 'pyramide'].includes(solid) ? new THREE.EdgesGeometry(geo) : null), [geo, solid]);
  return (
    <div className="h-64 w-full max-w-md cursor-grab overflow-hidden rounded-3xl bg-gradient-to-b from-himmel-100 to-white active:cursor-grabbing sm:h-80" {...handlers} aria-label="3D-Körper, mit dem Finger drehbar" role="img" data-testid="canvas-3d">
      <Canvas {...canvasProps} camera={{ position: [0, 0.6, 4.6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} />
        <RotatingGroup rot={rot} limitX={false}>
          <mesh geometry={geo}>
            <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} flatShading={edges !== null} />
          </mesh>
          {edges && (
            <lineSegments geometry={edges}>
              <lineBasicMaterial color="#2B2D42" />
            </lineSegments>
          )}
        </RotatingGroup>
      </Canvas>
    </div>
  );
}
