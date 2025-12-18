import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Billboard, Html, Stars } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import type { Note, Profile } from '../types';

interface TreeSceneProps {
  notes: Note[];
  profiles: Map<string, Profile>;
  onTreeClick: (point: THREE.Vector3) => void;
}

export default function TreeScene(props: TreeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 5, 12], fov: 50 }}
      shadows
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
    >
      <fog attach="fog" args={['#0a0e27', 10, 40]} />
      <color attach="background" args={['#0a0e27']} />
      <TreeContents {...props} />
    </Canvas>
  );
}

function TreeContents({ notes, profiles, onTreeClick }: TreeSceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const { camera, gl } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.05;
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();

    const rect = gl.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(
      groupRef.current.children,
      true
    );

    const hit = intersects.find((i) => i.object.userData.isTree === true);
    if (hit) {
      onTreeClick(hit.point);
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} color="#8b9dc3" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        color="#fff8e1"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <spotLight position={[-5, 5, -5]} intensity={0.5} color="#a0c4ff" angle={0.5} />
      <spotLight position={[5, 5, -5]} intensity={0.5} color="#ffd700" angle={0.5} />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#ffeb3b" distance={8} decay={2} />

      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={0.5} />
      <Snow />

      <group
        ref={groupRef}
        onPointerDown={handlePointerDown}
        position={[0, -2, 0]}
      >
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[12, 64]} />
          <meshStandardMaterial color="#1a1f3a" roughness={0.8} metalness={0.1} />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} receiveShadow>
          <circleGeometry args={[11, 64]} />
          <meshStandardMaterial color="#e8f4f8" roughness={1} metalness={0} />
        </mesh>

        <mesh position={[0, 0.4, 0]} castShadow userData={{ isTree: true }}>
          <cylinderGeometry args={[0.4, 0.5, 1.5, 16]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>

        <RealisticTreeLayer position={[0, 1.5, 0]} radius={2.8} height={2.0} color="#1e7a3d" />
        <RealisticTreeLayer position={[0, 3.0, 0]} radius={2.4} height={1.8} color="#228b47" />
        <RealisticTreeLayer position={[0, 4.3, 0]} radius={2.0} height={1.6} color="#2a9d56" />
        <RealisticTreeLayer position={[0, 5.5, 0]} radius={1.6} height={1.4} color="#32b065" />
        <RealisticTreeLayer position={[0, 6.5, 0]} radius={1.2} height={1.2} color="#3dc274" />
        <RealisticTreeLayer position={[0, 7.4, 0]} radius={0.8} height={1.0} color="#46c983" />

        <ChristmasLights />
        <StarTopper />

        {notes.map((note) => {
          const profile = profiles.get(note.user_id);
          return (
            <BearMarker
              key={note.id}
              position={[note.x, note.y, note.z]}
              username={profile?.username || 'Anonymous'}
              avatarUrl={profile?.avatar_url || undefined}
            />
          );
        })}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 3, 0]}
      />
    </>
  );
}

function Snow() {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 1500;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 40;
    return arr;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.02;
      if (positions[i] < -5) {
        positions[i] = 15;
        positions[i - 1] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 40;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function RealisticTreeLayer({ position, radius, height, color }: { position: [number, number, number], radius: number, height: number, color: string }) {
  const [x, y, z] = position;
  return (
    <group position={[x, y, z]}>
      <mesh castShadow userData={{ isTree: true }}>
        <coneGeometry args={[radius, height, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} flatShading />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2 + Math.random();
        const r = radius * 0.8;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -height * 0.3, Math.sin(angle) * r]}
            rotation={[Math.PI / 6, angle, 0]}
            castShadow
            userData={{ isTree: true }}
          >
            <coneGeometry args={[radius * 0.3, height * 0.6, 16]} />
            <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

function ChristmasLights() {
  const lights = useMemo(() => {
    const list = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let t = 0; t < 25; t += 0.5) {
      const y = 1.5 + t * 0.25;
      if (y > 7.5) break;
      const r = Math.max(0.2, 3.0 * (1 - (y - 1.5) / 6.5));
      const angle = t * 1.5;
      list.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return list;
  }, []);

  return (
    <group>
      {lights.map((l, i) => (
        <mesh key={i} position={l.pos} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={l.color} emissive={l.color} emissiveIntensity={2} toneMapped={false} />
          <pointLight color={l.color} intensity={0.5} distance={1.5} decay={2} />
        </mesh>
      ))}
    </group>
  );
}

function StarTopper() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1);
    }
  });
  return (
    <group ref={ref} position={[0, 8.2, 0]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} metalness={1} roughness={0} />
      </mesh>
      <pointLight color="#ffd700" intensity={2} distance={5} decay={2} />
    </group>
  );
}

function BearMarker({
  position,
  username,
  avatarUrl,
}: {
  position: [number, number, number];
  username: string;
  avatarUrl?: string;
}) {
  const [x, y, z] = position;
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (ref.current) {
      // Gentle idle sway
      ref.current.rotation.y += 0.006;
      ref.current.position.y += Math.sin(Date.now() * 0.001 + x) * 0.0015;
    }
  });

  return (
    <group ref={ref} position={[x, y, z]} scale={[1, 1, 1]}>
      {/* Ornament at drop point */}
      <mesh position={[0.18, -0.05, 0.12]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color="#e63946"
          emissive="#e63946"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
        <pointLight color="#ff7b7b" intensity={0.8} distance={1.4} decay={2} />
      </mesh>

      {/* Top hook for ornament */}
      <mesh position={[0.18, 0.12, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.01, 8, 16]} />
        <meshStandardMaterial color="#d9d9d9" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Bear body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Belly patch */}
      <mesh position={[0, 0.12, 0.19]} rotation={[-0.4, 0, 0]}>
        <circleGeometry args={[0.11, 24]} />
        <meshStandardMaterial color="#d7c4a7" roughness={0.7} metalness={0} />
      </mesh>
      {/* Ears */}
      {[-0.12, 0.12].map((ox, i) => (
        <mesh key={i} position={[ox, 0.65, -0.02]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}
      {/* Nose/muzzle */}
      <mesh position={[0, 0.42, 0.18]} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#d7c4a7" roughness={0.7} metalness={0} />
      </mesh>
      <mesh position={[0, 0.44, 0.22]} castShadow>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#2d1b0f" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Eyes */}
      {[-0.05, 0.05].map((ox, i) => (
        <mesh key={i} position={[ox, 0.48, 0.17]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color="#1b1b1b" metalness={0.1} />
        </mesh>
      ))}
      {/* Arms */}
      {[-0.2, 0.2].map((ox, i) => (
        <mesh key={i} position={[ox, 0.28, 0]} rotation={[0, 0, ox > 0 ? 0.3 : -0.3]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.25, 12]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}
      {/* Feet */}
      {[-0.1, 0.1].map((ox, i) => (
        <mesh key={i} position={[ox, 0, 0.05]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#7a4f26" roughness={0.7} metalness={0.05} />
        </mesh>
      ))}

      {/* Floating name + avatar */}
      <Billboard position={[0, 0.9, 0]} follow={true}>
        <Html transform distanceFactor={6} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-xl text-xs text-white">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={username}
                className="w-6 h-6 rounded-full border border-white/20"
              />
            )}
            <span className="font-semibold drop-shadow-md">{username}</span>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}
