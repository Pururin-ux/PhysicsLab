import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const GOLD = '#FFD700';
const CYAN = '#00E5FF';
const GREEN = '#39FF14';

const AVATAR_TEXTURES = {
  full: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-full-cutout.png`,
  pointing: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-pointing-cutout.png`,
  presenting: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-presenting-cutout.png`,
  surprised: `${process.env.PUBLIC_URL}/mascot/avatar/lab-avatar-surprised-cutout.png`,
};

function useSpringAngle({ base = 0, stiffness = 16, damping = 6 }) {
  const state = useRef({ angle: base, velocity: 0 });

  return (target, delta) => {
    const accel = (target - state.current.angle) * stiffness - state.current.velocity * damping;
    state.current.velocity += accel * delta;
    state.current.angle += state.current.velocity * delta;
    return state.current.angle;
  };
}

function HairStrand({ root, length = 0.48, lean = 0, index = 0, color = '#111316' }) {
  const group = useRef(null);
  const solve = useSpringAngle({ base: lean });

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current) return;
    const breeze = Math.sin(clock.elapsedTime * (1.35 + index * 0.17) + index * 0.9) * 0.16;
    const target = lean - pointer.x * 0.22 + pointer.y * 0.08 + breeze;
    group.current.rotation.z = solve(target, delta);
    group.current.rotation.x = Math.sin(clock.elapsedTime * 1.1 + index) * 0.06;
  });

  return (
    <group ref={group} position={root}>
      <mesh position={[0, -length / 2, 0.04]}>
        <capsuleGeometry args={[0.016, length, 4, 10]} />
        <meshStandardMaterial color={color} emissive="#0A0D10" emissiveIntensity={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, -length * 0.82, 0.07]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color={index % 2 ? GOLD : CYAN} emissive={index % 2 ? GOLD : CYAN} emissiveIntensity={0.3} roughness={0.25} />
      </mesh>
    </group>
  );
}

function PendulumCharm({ position, phase = 0, color = GOLD }) {
  const group = useRef(null);
  const solve = useSpringAngle({ base: 0, stiffness: 12, damping: 4.8 });

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current) return;
    const target = pointer.x * 0.16 + Math.sin(clock.elapsedTime * 1.55 + phase) * 0.18;
    group.current.rotation.z = solve(target, delta);
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, -0.08, 0.06]}>
        <capsuleGeometry args={[0.01, 0.16, 4, 8]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.19, 0.08]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.06, 0.06, 0.012]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.42} roughness={0.24} metalness={0.25} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius = 1.55, speed = 0.7, tilt = 0, color = CYAN, phase = 0 }) {
  const ring = useRef(null);
  const dot = useRef(null);
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.38, 0, Math.PI * 2, false, 0);
    return curve.getPoints(100).map((point) => new THREE.Vector3(point.x, 0, point.y));
  }, [radius]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    if (ring.current) ring.current.rotation.y = t * 0.18;
    if (dot.current) {
      dot.current.position.x = Math.cos(t) * radius;
      dot.current.position.z = Math.sin(t) * radius * 0.38;
    }
  });

  return (
    <group ref={ring} rotation={[tilt, 0, 0]}>
      <Line points={points} color={color} lineWidth={1.2} transparent opacity={0.48} />
      <mesh ref={dot}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.15} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AvatarCutout({ compact = false, pose = 'full' }) {
  const textureKey = compact && pose === 'full' ? 'pointing' : pose;
  const texture = useTexture(AVATAR_TEXTURES[textureKey] || AVATAR_TEXTURES.full);
  const root = useRef(null);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const dimensions = useMemo(() => {
    const width = texture.image?.width || (compact ? 854 : 452);
    const height = texture.image?.height || (compact ? 1210 : 1378);
    const targetHeight = compact ? 2.95 : 3.86;
    return { width: targetHeight * (width / height), height: targetHeight };
  }, [compact, texture.image?.height, texture.image?.width]);

  useFrame(({ pointer, clock }, delta) => {
    if (!root.current) return;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * 0.22, 4, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointer.y * 0.07, 4, delta);
    root.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.035;
  });

  const yOffset = compact ? -0.24 : -0.42;
  const headY = compact ? 0.66 : 1.45;
  const hairRoots = compact
    ? [
      [-0.52, headY + 0.48, 0.12, -0.42, 0.36],
      [-0.26, headY + 0.62, 0.13, -0.18, 0.44],
      [0.02, headY + 0.68, 0.13, 0.04, 0.5],
      [0.32, headY + 0.58, 0.12, 0.28, 0.42],
      [0.58, headY + 0.36, 0.12, 0.46, 0.34],
    ]
    : [
      [-0.34, headY + 0.42, 0.12, -0.36, 0.36],
      [-0.16, headY + 0.58, 0.13, -0.14, 0.42],
      [0.02, headY + 0.62, 0.13, 0.04, 0.5],
      [0.2, headY + 0.54, 0.12, 0.24, 0.4],
      [0.36, headY + 0.32, 0.12, 0.42, 0.32],
    ];

  return (
    <group ref={root} position={[0, yOffset, 0]}>
      <Float speed={1.1} rotationIntensity={0.035} floatIntensity={0.08}>
        <group>
          <mesh position={[0.035, -0.035, -0.055]} scale={[1.025, 1.025, 1]}>
            <planeGeometry args={[dimensions.width, dimensions.height]} />
            <meshBasicMaterial map={texture} color="#111111" transparent opacity={0.36} alphaTest={0.05} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[dimensions.width, dimensions.height]} />
            <meshBasicMaterial map={texture} transparent alphaTest={0.05} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>

          {hairRoots.map(([x, y, z, lean, length], index) => (
            <HairStrand
              key={`${x}-${y}`}
              index={index}
              root={[x, y, z]}
              lean={lean}
              length={length}
              color={index % 2 ? '#1b1b1e' : '#0d1012'}
            />
          ))}

          <PendulumCharm position={[compact ? -0.5 : -0.28, compact ? headY - 0.18 : headY - 0.2, 0.13]} phase={0.4} color={GOLD} />
          <PendulumCharm position={[compact ? 0.5 : 0.28, compact ? headY - 0.18 : headY - 0.2, 0.13]} phase={1.2} color={CYAN} />
        </group>
      </Float>
    </group>
  );
}

function AvatarScene({ compact, pose }) {
  const orbitScale = compact ? 0.78 : 1;

  return (
    <>
      <ambientLight intensity={1.1} />
      <pointLight position={[-1.4, 1.4, 2.2]} intensity={3.2} color={CYAN} />
      <pointLight position={[1.4, 0.7, 2.5]} intensity={2.8} color={GOLD} />
      <Sparkles count={compact ? 22 : 48} speed={0.28} size={compact ? 1.1 : 1.7} scale={[3.1, 3, 1.1]} color={CYAN} opacity={0.28} />
      <group scale={orbitScale} position={[0, compact ? -0.1 : -0.15, -0.1]}>
        <OrbitRing radius={compact ? 1.05 : 1.42} speed={0.9} tilt={0.08} color={CYAN} phase={0} />
        <OrbitRing radius={compact ? 1.22 : 1.62} speed={-0.68} tilt={1.08} color={GOLD} phase={1.2} />
        <OrbitRing radius={compact ? 0.88 : 1.2} speed={0.58} tilt={-0.9} color={GREEN} phase={2.4} />
      </group>
      <AvatarCutout compact={compact} pose={pose} />
      <mesh position={[0, compact ? -1.42 : -2.2, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[compact ? 0.85 : 1.2, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

export default function Mascot3D({
  className = '',
  compact = false,
  pose = 'full',
  label = '3D-маскот PhysicsLab',
}) {
  return (
    <div
      className={`relative ${compact ? 'h-44 w-44' : 'h-[390px] w-full min-w-[300px]'} ${className}`}
      data-testid="mascot-3d"
      aria-label={label}
    >
      <Canvas
        camera={{ position: [0, compact ? 0.2 : 0.02, compact ? 3.55 : 5.55], fov: compact ? 31 : 34 }}
        dpr={[1, 1.7]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <AvatarScene compact={compact} pose={pose} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-x-7 bottom-3 h-8 rounded-full bg-[#00E5FF]/10 blur-2xl" />
    </div>
  );
}
