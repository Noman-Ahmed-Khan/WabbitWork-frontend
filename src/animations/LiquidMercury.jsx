import React, { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import PhysicsWorker from "./physics.worker.js?worker";

/**
 * Device-specific droplet count.
 * Mobile: 1200, Desktop/Laptop: 10000
 */
const getDropletCount = () => {
  if (typeof window === "undefined") return 10000;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isLowPerf = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  
  if (isMobile || isLowPerf) return 1000; // Reduced slightly more for mobile 'hang' prevention
  return 10000;
};

/**
 * Inner Three.js mesh — handles worker communication and rendering.
 */
export const LiquidMercury = () => {
  const meshRef = useRef();
  const { viewport, mouse, raycaster, camera, gl } = useThree();
  
  // Use a stable count based on device performance
  const count = useMemo(() => getDropletCount(), []);
  
  // Shared state for click events
  const clickRef = useRef({ active: false, time: 0, x: 0, y: 0 });

  // Initialize Worker
  const worker = useMemo(() => new PhysicsWorker(), []);
  const pendingUpdate = useRef(false);

  const [initialized, setInitialized] = useState(false);

  // Initialize particles at center with 0 scale
  useEffect(() => {
    if (meshRef.current) {
        meshRef.current.instanceMatrix.array.fill(0);
        meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  useEffect(() => {
    // Initialize particles in worker
    worker.postMessage({
      type: "init",
      data: {
        count,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      }
    });

    // Handle worker response
    const handleMessage = (e) => {
      const { type, matrixBuffer } = e.data;
      if (type === "updated" && meshRef.current) {
        meshRef.current.instanceMatrix.array.set(matrixBuffer);
        meshRef.current.instanceMatrix.needsUpdate = true;
        
        // Only show after the first buffer is actually applied
        if (!meshRef.current.visible) {
            meshRef.current.visible = true;
            setInitialized(true);
        }
        pendingUpdate.current = false;
      }
    };

    worker.addEventListener("message", handleMessage);
    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
    };
  }, [worker, count, viewport.width, viewport.height]);

  // Click Handler - optimized to use passive listener
  useEffect(() => {
    const handleClick = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      clickRef.current = { active: true, time: 0, x, y };
    };
    gl.domElement.addEventListener("click", handleClick, { passive: true });
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [gl]);

  // Main rendering loop - offloads logic to worker
  useFrame((state) => {
    if (pendingUpdate.current || !meshRef.current) return;

    const t = state.clock.getElapsedTime();
    
    // Update click timer
    if (clickRef.current.active) {
      clickRef.current.time += 0.02;
      if (clickRef.current.time > 1) clickRef.current.active = false;
    }

    // Raycasting for pointer repulsion
    raycaster.setFromCamera(mouse, camera);
    const ray = raycaster.ray;

    // Raycasting for click burst (if active)
    let clickRay = null;
    if (clickRef.current.active) {
      const rayClick = new THREE.Raycaster();
      rayClick.setFromCamera({ x: clickRef.current.x, y: clickRef.current.y }, camera);
      clickRay = rayClick.ray;
    }

    // Send state to worker
    pendingUpdate.current = true;
    worker.postMessage({
      type: "update",
      data: {
        t,
        mouse: [mouse.x, mouse.y],
        rayOrigin: [ray.origin.x, ray.origin.y, ray.origin.z],
        rayDirection: [ray.direction.x, ray.direction.y, ray.direction.z],
        clickActive: clickRef.current.active,
        clickTime: clickRef.current.time,
        clickRayOrigin: clickRay ? [clickRay.origin.x, clickRay.origin.y, clickRay.origin.z] : null,
        clickRayDirection: clickRay ? [clickRay.direction.x, clickRay.direction.y, clickRay.direction.z] : null,
      }
    });
  });

  // Optimize geometry and materials — lower segments for mobile
  const isMobile = useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, isMobile ? 12 : 16, isMobile ? 12 : 16), [isMobile]);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#c0c0c0",
    metalness: 1,
    roughness: 0,
    reflectivity: 1,
    clearcoat: 1,
    envMapIntensity: 3,
    ior: 2.5,
  }), []);

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[geometry, material, count]} 
      frustumCulled={false} 
      visible={initialized}
    />
  );
};

/**
 * Fallback component for lazy loading
 */
const FallbackBackground = ({ isDark }) => (
  <div 
    style={{ 
      position: "absolute", 
      inset: 0, 
      background: isDark ? "#010101" : "#f5f3ef",
      zIndex: -1 
    }} 
  />
);

/**
 * Standalone canvas wrapper — drop into any page.
 */
export default function LiquidMercuryCanvas({ isDark = true }) {
  const bgColor = isDark ? "#010101" : "#f5f3ef";
  
  const isMobile = typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
  
  return (
    <Suspense fallback={<FallbackBackground isDark={isDark} />}>
      <Canvas 
        dpr={isMobile ? 1 : [1, 1.5]} 
        camera={{ position: [0, 0, 12], fov: 35 }}
        gl={{ 
          antialias: !isMobile, 
          alpha: false, 
          powerPreference: "high-performance",
          precision: isMobile ? "mediump" : "highp"
        }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={[bgColor]} />
        <Environment preset="city" />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        <pointLight position={[0, 0, 8]} intensity={0.5} />
        <LiquidMercury />
      </Canvas>
    </Suspense>
  );
}
