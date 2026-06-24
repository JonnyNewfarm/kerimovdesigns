"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, MathUtils } from "three";

interface Props {
  children: ReactNode;
  overlayColor?: string;
  duration?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

function TransitionCube({ isActive }: { isActive: boolean }) {
  const cubeRef = useRef<Mesh | null>(null);
  const scaleRef = useRef(0.2);

  useFrame((_, delta) => {
    if (!cubeRef.current) return;

    cubeRef.current.rotation.x += delta * 2.4;
    cubeRef.current.rotation.y += delta * 3.2;
    cubeRef.current.rotation.z += delta * 0.8;

    const targetScale = isActive ? 2.6 : 0.2;

    scaleRef.current = MathUtils.lerp(scaleRef.current, targetScale, 0.075);

    cubeRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1.8, 1.8, 1.8]} />

      <meshBasicMaterial attach="material-0" color="#f5f5f0" />
      <meshBasicMaterial attach="material-1" color="#d8d8cd" />
      <meshBasicMaterial attach="material-2" color="#ffffff" />
      <meshBasicMaterial attach="material-3" color="#c8c8bc" />
      <meshBasicMaterial attach="material-4" color="#eeeeE6" />
      <meshBasicMaterial attach="material-5" color="#b8b8aa" />
    </mesh>
  );
}

function CubeOverlay({
  showOverlay,
  overlayColor,
  duration,
}: {
  showOverlay: boolean;
  overlayColor: string;
  duration: number;
}) {
  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: duration * 0.35,
            ease,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration * 0.45,
              ease,
            }}
          />

          <motion.div
            className="absolute inset-0"
            initial={{
              scale: 0.35,
              y: 160,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
            }}
            exit={{
              scale: 4,
              opacity: 0,
            }}
            transition={{
              duration,
              ease,
            }}
          >
            <Canvas
              dpr={[1, 1.5]}
              camera={{
                position: [0, 0, 5],
                fov: 45,
              }}
              gl={{
                antialias: false,
                powerPreference: "high-performance",
              }}
            >
              <ambientLight intensity={2} />
              <directionalLight position={[2, 2, 3]} intensity={2} />

              <TransitionCube isActive={showOverlay} />
            </Canvas>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ViewTransitionWrapper({
  children,
  overlayColor = "#181c14",
  duration = 0.75,
}: Props) {
  const pathname = usePathname();

  const [currentPath, setCurrentPath] = useState(pathname);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (pathname === currentPath) return;

    setShowOverlay(true);

    const swapTimeout = window.setTimeout(() => {
      setCurrentPath(pathname);

      const hideTimeout = window.setTimeout(() => {
        setShowOverlay(false);
      }, duration * 650);

      return () => window.clearTimeout(hideTimeout);
    }, duration * 500);

    return () => window.clearTimeout(swapTimeout);
  }, [pathname, currentPath, duration]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{
            opacity: 0,
            scale: 1.03,
          }}
          animate={{
            opacity: showOverlay ? 0.25 : 1,
            scale: showOverlay ? 0.82 : 1,
            y: showOverlay ? 80 : 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.94,
            y: -40,
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="min-h-screen origin-center"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <CubeOverlay
        showOverlay={showOverlay}
        overlayColor={overlayColor}
        duration={duration}
      />
    </div>
  );
}
