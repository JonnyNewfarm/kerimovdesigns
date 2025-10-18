"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import {
  useScroll,
  useSpring,
  useTransform,
  motion,
  MotionValue,
} from "framer-motion";
import Link from "next/link";
import { OrbitControls } from "@react-three/drei";
import MagneticComp from "./MagneticComp";

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsMdUp(mediaQuery.matches);
    function handleChange(e: MediaQueryListEvent) {
      setIsMdUp(e.matches);
    }
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return isMdUp;
}

export default function Index() {
  const container = useRef(null);
  const isMdUp = useIsMdUp();

  // --- Scroll progress setup ---
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Smooth cube rotation
  const progress = useTransform(scrollYProgress, [0, 1], [0, 4.3]);
  const smoothProgress = useSpring(progress, { damping: 20 });

  // --- Line animation progress (0% → 100%) ---
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1] }}
      transition={{ duration: 2, times: [0, 0.4, 1], ease: "easeInOut" }}
      ref={container}
      className="h-[150vh]"
    >
      <div className="sticky uppercase top-0 h-screen flex flex-col justify-center items-center">
        {/* Cube */}
        <Canvas className="w-full h-3/4">
          {isMdUp && <OrbitControls enableZoom={false} enablePan={false} />}
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Cube scrollProgress={smoothProgress} />
        </Canvas>

        {/* Text + Underline */}
        <div className="absolute bottom-15 text-center px-4">
          <h1 className="text-color text-2xl -mb-1 sm:text-2xl font-bold">
            Rustam Kerimov
          </h1>

          {/* Animated underline */}
          <motion.div
            className="bg-stone-500 mx-auto mt-1  rounded-3xl"
            style={{
              width: lineWidth,
              height: "2px",
              originX: 0,
            }}
          />

          <h2 className="text-color text-3xl whitespace-nowrap sm:text-4xl font-extrabold ">
            Graphic Designer
          </h2>
        </div>

        {/* Links */}
        <div className="absolute hidden lg:block left-10 bottom-15 text-left px-4">
          <MagneticComp>
            <h2 className="text-color text-4xl sm:text-4xl font-extrabold">
              <Link href={"/projects"}>Archives</Link>
            </h2>
          </MagneticComp>
        </div>

        <div className="absolute hidden lg:block right-10 bottom-15 text-left px-4">
          <MagneticComp>
            <h2 className="text-color text-4xl sm:text-4xl font-extrabold">
              <Link href={"/contact"}>Collaborate</Link>
            </h2>
          </MagneticComp>
        </div>
      </div>
    </motion.div>
  );
}

const Cube = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const textures = [
    useLoader(TextureLoader, "/cube-img/image1.jpg"),
    useLoader(TextureLoader, "/cube-img/image2.jpg"),
    useLoader(TextureLoader, "/cube-img/cubeimg5.jpg"),
    useLoader(TextureLoader, "/cube-img/image4.jpg"),
    useLoader(TextureLoader, "/cube-img/rustam.jpg"),
    useLoader(TextureLoader, "/cube-img/image6.jpg"),
  ];

  useFrame(() => {
    if (!mesh.current) return;
    const value = scrollProgress.get();
    mesh.current.rotation.x = value;
    mesh.current.rotation.y = value * 1.2;
    const targetScale = hovered ? 1.1 : 1;
    mesh.current.scale.x += (targetScale - mesh.current.scale.x) * 0.1;
    mesh.current.scale.y = mesh.current.scale.x;
    mesh.current.scale.z = mesh.current.scale.x;
  });

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    canvas.style.cursor = hovered ? "pointer" : "default";
  }, [hovered]);

  return (
    <mesh
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2.3, 2.3, 2.3]} />
      {textures.map((tex, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} map={tex} />
      ))}
    </mesh>
  );
};
