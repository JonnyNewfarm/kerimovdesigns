// src/components/CubeSection.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { motion } from "framer-motion-3d";
import {
  useSpring,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

export default function CubeSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const smoothProgress = useSpring(progress, { damping: 20 });

  return (
    <div ref={container} className="h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center">
        <Canvas className="w-full h-3/4">
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Cube progress={smoothProgress} />
        </Canvas>
        <div className="absolute bottom-16 text-center px-4">
          <h1 className="text-white/90 text-3xl sm:text-2xl font-bold">
            Rustam Kerimov
          </h1>
          <h2 className="text-white/90 text-4xl sm:text-4xl font-extrabold">
            Graphic Designer
          </h2>
        </div>
        <div className="absolute hidden md:block left-10 bottom-16 text-left px-4">
          <h2 className="text-white/90 text-4xl sm:text-4xl font-extrabold">
            Archives
          </h2>
        </div>
        <div className="absolute hidden md:block right-10 bottom-16 text-left px-4">
          <h2 className="text-white/90 text-4xl sm:text-4xl font-extrabold">
            Collaborate
          </h2>
        </div>
      </div>
    </div>
  );
}

function Cube({ progress }: any) {
  const mesh = useRef(null);

  const options = { damping: 20 };
  const mouse = {
    x: useSpring(useMotionValue(0), options),
    y: useSpring(useMotionValue(0), options),
  };

  useEffect(() => {
    const manageMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const { clientX, clientY } = e;
      const x = -0.5 + clientX / innerWidth;
      const y = -0.5 + clientY / innerHeight;
      mouse.x.set(x);
      mouse.y.set(y);
    };

    window.addEventListener("mousemove", manageMouseMove);
    return () => window.removeEventListener("mousemove", manageMouseMove);
  }, []);

  const texture1 = useLoader(
    TextureLoader as unknown as new (...args: any[]) => any,
    "/cube/img1.jpg"
  );
  const texture2 = useLoader(
    TextureLoader as unknown as new (...args: any[]) => any,
    "/cube/img2.jpg"
  );
  const texture3 = useLoader(
    TextureLoader as unknown as new (...args: any[]) => any,
    "/cube/img3.jpg"
  );
  const texture4 = useLoader(
    TextureLoader as unknown as new (...args: any[]) => any,
    "/cube/img4.jpg"
  );
  const texture5 = useLoader(
    TextureLoader as unknown as new (...args: any[]) => any,
    "/cube/img5.jpg"
  );
  const texture6 = useLoader(
    TextureLoader as unknown as new (...args: any[]) => any,
    "/cube/img6.jpg"
  );

  return (
    <motion.mesh ref={mesh} rotateX={progress} rotateY={progress}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial map={texture1} attach="material-0" />
      <meshStandardMaterial map={texture2} attach="material-1" />
      <meshStandardMaterial map={texture3} attach="material-2" />
      <meshStandardMaterial map={texture4} attach="material-3" />
      <meshStandardMaterial map={texture5} attach="material-4" />
      <meshStandardMaterial map={texture6} attach="material-5" />
    </motion.mesh>
  );
}
