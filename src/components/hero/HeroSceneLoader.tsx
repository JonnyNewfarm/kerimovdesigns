"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ReadySignal({ onReady }: { onReady: () => void }) {
  const hasReported = useRef(false);

  useEffect(() => {
    if (hasReported.current) {
      return;
    }

    let frame2: number | null = null;

    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        if (hasReported.current) {
          return;
        }

        hasReported.current = true;

        onReady();
      });
    });

    return () => {
      window.cancelAnimationFrame(frame1);

      if (frame2 !== null) {
        window.cancelAnimationFrame(frame2);
      }
    };
  }, [onReady]);

  return null;
}

function LoaderBackdrop({ isExiting }: { isExiting: boolean }) {
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const exitProgressRef = useRef(0);

  useFrame((_, delta) => {
    const material = materialRef.current;

    if (!material) return;

    if (!isExiting) {
      exitProgressRef.current = 0;

      material.opacity = 1;

      return;
    }

    exitProgressRef.current = Math.min(
      exitProgressRef.current + delta / 0.7,
      1,
    );

    const progress = exitProgressRef.current;

    material.opacity = 1 - THREE.MathUtils.smoothstep(progress, 0.12, 1);
  });

  return (
    <mesh position={[0, 0, -3.1]} renderOrder={1000} frustumCulled={false}>
      <planeGeometry args={[100, 100]} />

      <meshBasicMaterial
        ref={materialRef}
        color="#181c14"
        transparent
        opacity={1}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroSceneLoader({
  sceneReady,
  onComplete,
}: {
  sceneReady: boolean;
  onComplete: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const mountedAtRef = useRef(performance.now());

  const hasStartedExitRef = useRef(false);

  useEffect(() => {
    if (!sceneReady || hasStartedExitRef.current) {
      return;
    }

    hasStartedExitRef.current = true;

    const minimumVisibleMs = 500;

    const elapsed = performance.now() - mountedAtRef.current;

    const exitDelay = Math.max(0, minimumVisibleMs - elapsed);

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, exitDelay);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, exitDelay + 720);

    return () => {
      window.clearTimeout(exitTimer);

      window.clearTimeout(completeTimer);
    };
  }, [sceneReady, onComplete]);

  return <LoaderBackdrop isExiting={isExiting} />;
}
