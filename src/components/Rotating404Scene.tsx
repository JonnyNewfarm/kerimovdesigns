"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const DIGITS = ["4", "0", "4"];

function makeDigitTexture(digit: string): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");
  if (ctx === null) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "900 380px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(digit, canvas.width / 2, canvas.height / 2 + 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function getSceneSettings(width: number) {
  const isMobile = width < 768;

  return {
    cameraZ: isMobile ? 5.8 : 7,
    digitSize: isMobile ? 1.1 : 1.65,
    floatStrength: isMobile ? 0.12 : 0.28,
    finalPositions: [
      new THREE.Vector3(isMobile ? -0.82 : -1.25, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(isMobile ? 0.82 : 1.25, 0, 0),
    ],
    orbitOffsets: [
      new THREE.Vector3(isMobile ? -0.98 : -1.6, 0.32, -0.2),
      new THREE.Vector3(0, -0.32, 0.2),
      new THREE.Vector3(isMobile ? 0.98 : 1.6, 0.32, -0.2),
    ],
  };
}

export default function Rotating404Scene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    if (currentMount === null) {
      return;
    }

    const mountElement: HTMLDivElement = currentMount;

    let settings = getSceneSettings(window.innerWidth);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      100,
    );

    camera.position.z = settings.cameraZ;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    mountElement.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] =
      DIGITS.map((digit, index) => {
        const texture = makeDigitTexture(digit);

        const material = new THREE.MeshBasicMaterial({
          map: texture ?? undefined,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(
          settings.digitSize,
          settings.digitSize,
        );

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(settings.orbitOffsets[index]);
        group.add(mesh);

        return mesh;
      });

    const clock = new THREE.Clock();

    const speeds = [0.9, -1.35, 1.15];
    const cycleLength = 6.5;

    function smoothstep(edge0: number, edge1: number, x: number): number {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    let frameId = 0;

    function animate() {
      const elapsed = clock.getElapsedTime();
      const cycle = (elapsed % cycleLength) / cycleLength;

      const gatherIn = smoothstep(0.48, 0.72, cycle);
      const scatterOut = smoothstep(0.82, 1, cycle);
      const meetAmount = gatherIn * (1 - scatterOut);

      meshes.forEach((mesh, index) => {
        const orbit = settings.orbitOffsets[index].clone();

        orbit.x +=
          Math.sin(elapsed * (0.7 + index * 0.25)) * settings.floatStrength;

        orbit.y +=
          Math.cos(elapsed * (0.9 + index * 0.2)) * settings.floatStrength;

        orbit.z +=
          Math.sin(elapsed * (0.6 + index * 0.3)) *
          settings.floatStrength *
          0.6;

        mesh.position.lerpVectors(
          orbit,
          settings.finalPositions[index],
          meetAmount,
        );

        mesh.rotation.y = elapsed * speeds[index] * (1 - meetAmount);

        mesh.rotation.x =
          Math.sin(elapsed * (0.8 + index * 0.2)) * 0.35 * (1 - meetAmount);

        mesh.rotation.z =
          Math.sin(elapsed * (0.6 + index * 0.15)) * 0.18 * (1 - meetAmount);

        mesh.scale.setScalar(1 + meetAmount * 0.35);
      });

      group.rotation.z = Math.sin(elapsed * 0.18) * 0.04 * (1 - meetAmount);
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    }

    function handleResize() {
      settings = getSceneSettings(window.innerWidth);

      camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
      camera.position.z = settings.cameraZ;
      camera.updateProjectionMatrix();

      renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(
          settings.digitSize,
          settings.digitSize,
        );
      });
    }

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.map?.dispose();
        mesh.material.dispose();
      });

      renderer.dispose();

      if (renderer.domElement.parentElement === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
