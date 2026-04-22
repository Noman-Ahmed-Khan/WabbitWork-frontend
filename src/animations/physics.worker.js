import { createNoise3D } from "simplex-noise";

// We'll use a minimal subset of Three.js math if needed, 
// but to keep the worker light and avoid large imports, 
// we can implement the matrix math manually.

const noise3D = createNoise3D();

// Constants (sync with main thread if needed, but these are mostly static)
const REPEL_RADIUS = 1.5;
const REPEL_STRENGTH = 0.06;
const SPRING_STIFFNESS = 0.3;
const SPRING_DAMPING = 0.8;
const FLOW_SPEED = 0.01;
const FLOW_STRENGTH = 0.008;
const WAVE_AMPLITUDE = 0.2;
const WAVE_FREQUENCY = 1;
const MAX_SPEED = 2.0;

let particles = [];
let count = 0;

// Internal state for particles
// We'll use objects for now for easier porting, 
// but TypedArrays would be better for massive counts.
// For 10k, objects are usually fine in a worker.

self.onmessage = (e) => {
  const { type, data } = e.data;

  if (type === "init") {
    const { count: newCount, viewportWidth, viewportHeight } = data;
    count = newCount;
    particles = [];
    for (let i = 0; i < count; i++) {
      const originX = (Math.random() - 0.5) * viewportWidth;
      const originY = (Math.random() - 0.5) * viewportHeight;
      const originZ = (Math.random() - 0.5) * 8;
      particles.push({
        // Start extremely wide and deep to cover the "whole void"
        x: (Math.random() - 0.5) * viewportWidth * 10, 
        y: (Math.random() - 0.5) * viewportHeight * 10, 
        z: -100, 
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
  }

  if (type === "update") {
    const { t, mouse, rayOrigin, rayDirection, clickActive, clickTime, clickRayOrigin, clickRayDirection } = data;
    const slowT = t * FLOW_SPEED;

    // Buffer to hold matrices: count * 16 floats
    const matrixBuffer = new Float32Array(count * 16);

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      // Click burst
      if (clickActive && clickRayOrigin && clickRayDirection) {
        const tRayC = (p.z - clickRayOrigin[2]) / clickRayDirection[2];
        const cx = clickRayOrigin[0] + clickRayDirection[0] * tRayC;
        const cy = clickRayOrigin[1] + clickRayDirection[1] * tRayC;
        const dxC = p.x - cx, dyC = p.y - cy, dzC = 0;
        const distC = Math.sqrt(dxC * dxC + dyC * dyC + dzC * dzC);
        const radius = 2.5;
        if (distC < radius && distC > 0.001) {
          const strength = (1 - distC / radius) * 0.15 * (1 - clickTime);
          p.vx += (dxC / distC) * strength;
          p.vy += (dyC / distC) * strength;
        }
      }

      // Pointer repel
      const tRay = (p.z - rayOrigin[2]) / rayDirection[2];
      const pointerX = rayOrigin[0] + rayDirection[0] * tRay;
      const pointerY = rayOrigin[1] + rayDirection[1] * tRay;
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

      // Position update
      p.x += p.vx; p.y += p.vy; p.z += p.vz;

      // Matrix Calculation
      // We need to set the matrix in the buffer at i * 16
      const offset = i * 16;
      
      const stretch = 1 + speed * 30;
      const depthScale = 1 + (p.z + 4) * 0.05;
      const baseSize = p.size * depthScale;
      
      const scaleX = baseSize;
      const scaleY = baseSize;
      const scaleZ = baseSize * stretch;

      // Simplified Matrix Calculation (No rotation for now, let's see if we need lookAt)
      // Wait, lookAt is important for the stretch effect.
      // Let's implement lookAt manually.
      
      const targetLookX = p.x + p.vx * 10;
      const targetLookY = p.y + p.vy * 10;
      const targetLookZ = p.z + p.vz * 10;
      
      // If speed is very low, just use identity rotation
      if (speed < 0.001) {
          setMatrix(matrixBuffer, offset, p.x, p.y, p.z, scaleX, scaleY, scaleZ);
      } else {
          setMatrixWithLookAt(matrixBuffer, offset, p.x, p.y, p.z, targetLookX, targetLookY, targetLookZ, scaleX, scaleY, scaleZ);
      }
    }

    // Transfer the matrix buffer back
    self.postMessage({ type: "updated", matrixBuffer }, [matrixBuffer.buffer]);
  }
};

function setMatrix(out, offset, x, y, z, sx, sy, sz) {
  out[offset + 0] = sx; out[offset + 1] = 0;  out[offset + 2] = 0;  out[offset + 3] = 0;
  out[offset + 4] = 0;  out[offset + 5] = sy; out[offset + 6] = 0;  out[offset + 7] = 0;
  out[offset + 8] = 0;  out[offset + 9] = 0;  out[offset + 10] = sz; out[offset + 11] = 0;
  out[offset + 12] = x; out[offset + 13] = y; out[offset + 14] = z; out[offset + 15] = 1;
}

function setMatrixWithLookAt(out, offset, px, py, pz, tx, ty, tz, sx, sy, sz) {
  // Simple lookAt matrix calculation
  // z axis: p - t (normalized)
  let zx = px - tx, zy = py - ty, zz = pz - tz;
  const lenZ = Math.sqrt(zx*zx + zy*zy + zz*zz);
  zx /= lenZ; zy /= lenZ; zz /= lenZ;

  // x axis: up cross z
  let upX = 0, upY = 1, upZ = 0;
  // Handle case where z is parallel to up
  if (Math.abs(zy) > 0.999) {
    upZ = 1; upY = 0;
  }
  let xx = upY * zz - upZ * zy;
  let xy = upZ * zx - upX * zz;
  let xz = upX * zy - upY * zx;
  const lenX = Math.sqrt(xx*xx + xy*xy + xz*xz);
  xx /= lenX; xy /= lenX; xz /= lenX;

  // y axis: z cross x
  let yx = zy * xz - zz * xy;
  let yy = zz * xx - zx * xz;
  let yz = zx * xy - zy * xx;

  out[offset + 0] = xx * sx; out[offset + 1] = xy * sx; out[offset + 2] = xz * sx; out[offset + 3] = 0;
  out[offset + 4] = yx * sy; out[offset + 5] = yy * sy; out[offset + 6] = yz * sy; out[offset + 7] = 0;
  out[offset + 8] = zx * sz; out[offset + 9] = zy * sz; out[offset + 10] = zz * sz; out[offset + 11] = 0;
  out[offset + 12] = px;      out[offset + 13] = py;      out[offset + 14] = pz;      out[offset + 15] = 1;
}
