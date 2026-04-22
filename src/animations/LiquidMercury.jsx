import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const COUNT = 16000;
const noise3D = createNoise3D();

// ===== PHYSICS CONSTANTS =====
const REPEL_RADIUS = 1.5;
const REPEL_STRENGTH = 0.06;

const SPRING_STIFFNESS = 0.08;
const SPRING_DAMPING = 0.85;

const FLOW_SPEED = 0.01;
const FLOW_STRENGTH = 0.008;

const WAVE_AMPLITUDE = 0.2;
const WAVE_FREQUENCY = 1;

const MAX_SPEED = 0.15;

/**
 * Inner Three.js mesh — must be rendered inside a <Canvas>.
 */
export const LiquidMercury = () => {
  const meshRef = useRef();
  const { viewport, mouse, raycaster, camera, gl } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const clickRef = useRef({ active: false, time: 0, x: 0, y: 0 });

  // ===== CLICK HANDLER =====
  useMemo(() => {
    const handleClick = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      clickRef.current = { active: true, time: 0, x, y };
    };
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [gl]);

  // ===== PARTICLES =====
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const originX = (Math.random() - 0.5) * viewport.width;
      const originY = (Math.random() - 0.5) * viewport.height;
      const originZ = (Math.random() - 0.5) * 8;
      temp.push({
        x: originX, y: originY, z: originZ,
        originX, originY, originZ,
        vx: 0, vy: 0, vz: 0,
        size: 0.008 + Math.random() * 0.015,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        noiseOffset: Math.random() * 1000,
        flowSpeed: 0.8 + Math.random() * 0.4,
      });
    }
    return temp;
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const slowT = t * FLOW_SPEED;

    if (clickRef.current.active) {
      clickRef.current.time += 0.02;
      if (clickRef.current.time > 1) clickRef.current.active = false;
    }

    raycaster.setFromCamera(mouse, camera);
    const ray = raycaster.ray;

    let rayC = null;
    if (clickRef.current.active) {
      const rayClick = new THREE.Raycaster();
      rayClick.setFromCamera({ x: clickRef.current.x, y: clickRef.current.y }, camera);
      rayC = rayClick.ray;
    }

    particles.forEach((p, i) => {
      // Click burst
      if (clickRef.current.active && rayC) {
        const tRayC = (p.z - rayC.origin.z) / rayC.direction.z;
        const cx = rayC.origin.x + rayC.direction.x * tRayC;
        const cy = rayC.origin.y + rayC.direction.y * tRayC;
        const dxC = p.x - cx, dyC = p.y - cy, dzC = p.z - p.z;
        const distC = Math.sqrt(dxC * dxC + dyC * dyC + dzC * dzC);
        const radius = 2.5;
        if (distC < radius && distC > 0.001) {
          const strength = (1 - distC / radius) * 0.15 * (1 - clickRef.current.time);
          p.vx += (dxC / distC) * strength;
          p.vy += (dyC / distC) * strength;
          p.vz += (dzC / distC) * strength;
        }
      }

      // Pointer repel
      const tRay = (p.z - ray.origin.z) / ray.direction.z;
      const pointerX = ray.origin.x + ray.direction.x * tRay;
      const pointerY = ray.origin.y + ray.direction.y * tRay;
      const dx = p.x - pointerX, dy = p.y - pointerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0.001) {
        const normalized = dist / REPEL_RADIUS;
        const force = Math.pow(1 - normalized, 3) * REPEL_STRENGTH;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Noise
      const noiseX = noise3D(p.originX * 0.08 + p.noiseOffset, p.originY * 0.08, slowT * p.flowSpeed);
      const noiseY = noise3D(p.originX * 0.08, p.originY * 0.08 + p.noiseOffset, slowT * p.flowSpeed + 100);
      const noiseZ = noise3D(p.originX * 0.08 + 50, p.originY * 0.08 + 50, slowT * p.flowSpeed * 0.5);

      // Waves
      const waveX = Math.sin(t * WAVE_FREQUENCY + p.phaseX + p.originY * 0.3) * WAVE_AMPLITUDE;
      const waveY = Math.cos(t * WAVE_FREQUENCY * 0.8 + p.phaseY + p.originX * 0.3) * WAVE_AMPLITUDE;
      const waveZ = Math.sin(t * WAVE_FREQUENCY * 0.6 + p.phaseZ) * WAVE_AMPLITUDE * 0.5;

      const targetX = p.originX + noiseX * 2 + waveX;
      const targetY = p.originY + noiseY * 2 + waveY;
      const targetZ = p.originZ + noiseZ * 1.5 + waveZ;

      // Spring
      p.vx += (targetX - p.x) * SPRING_STIFFNESS;
      p.vy += (targetY - p.y) * SPRING_STIFFNESS;
      p.vz += (targetZ - p.z) * SPRING_STIFFNESS;

      // Flow
      p.vx += Math.cos(noiseX * Math.PI * 2) * FLOW_STRENGTH;
      p.vy += Math.sin(noiseY * Math.PI * 2) * FLOW_STRENGTH;

      // Damping
      p.vx *= SPRING_DAMPING;
      p.vy *= SPRING_DAMPING;
      p.vz *= SPRING_DAMPING;

      // Velocity clamp
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        p.vx *= scale; p.vy *= scale; p.vz *= scale;
      }

      // Position
      p.x += p.vx; p.y += p.vy; p.z += p.vz;

      // Transform
      dummy.position.set(p.x, p.y, p.z);
      const stretch = 1 + speed * 30;
      const depthScale = 1 + (p.z + 4) * 0.05;
      const baseSize = p.size * depthScale;
      dummy.scale.set(baseSize, baseSize, baseSize * stretch);
      if (speed > 0.001) {
        dummy.lookAt(p.x + p.vx * 10, p.y + p.vy * 10, p.z + p.vz * 10);
      }
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color="#c0c0c0"
        metalness={1}
        roughness={0}
        reflectivity={1}
        clearcoat={1}
        envMapIntensity={3}
        ior={2.5}
      />
    </instancedMesh>
  );
};

/**
 * Standalone canvas wrapper — drop into any page.
 * Renders the LiquidMercury particle system on a pitch-black canvas.
 */
export default function LiquidMercuryCanvas({ isDark = true }) {
  const bgColor = isDark ? "#010101" : "#f5f3ef";
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 12], fov: 35 }}>
      <color attach="background" args={[bgColor]} />
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, 5]} intensity={0.5} />
      <pointLight position={[0, 0, 8]} intensity={0.5} />
      <LiquidMercury />
    </Canvas>
  );
}
