"use client";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
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
import HeroIntro from "./HeroIntro";

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
  const container = useRef<HTMLDivElement | null>(null);
  const isMdUp = useIsMdUp();
  const [introDone, setIntroDone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 4.3]);
  const smoothProgress = useSpring(progress, { damping: 20 });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hero-intro-seen");

    if (hasSeenIntro) {
      setIntroDone(true);
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("hero-intro-seen", "true");
      setIntroDone(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={container}
      className="min-h-[150dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col items-center justify-center uppercase relative">
        <HeroIntro isDone={introDone} />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <Canvas className="w-full h-3/4">
              {isMdUp && <OrbitControls enableZoom={false} enablePan={false} />}
              <ambientLight intensity={2} />
              <directionalLight position={[2, 1, 1]} />
              <Cube scrollProgress={smoothProgress} introDone={introDone} />
            </Canvas>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.15 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute bottom-4 lg:bottom-11 text-center px-4 z-10"
        >
          <h1 className="text-color text-2xl -mb-1 sm:text-2xl font-bold">
            Rustam Kerimov
          </h1>

          <motion.div
            className="bg-stone-500 mx-auto mt-1 rounded-3xl"
            style={{
              width: lineWidth,
              height: "2px",
              originX: 0,
            }}
          />

          <h2 className="text-color text-3xl whitespace-nowrap sm:text-4xl font-extrabold">
            Graphic Designer
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.25 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute hidden lg:block left-10 bottom-10 text-left px-4 z-10"
        >
          <MagneticComp>
            <h2 className="text-color text-4xl sm:text-4xl font-extrabold">
              <Link href="/projects">Archives</Link>
            </h2>
          </MagneticComp>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.3 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute hidden lg:block right-10 bottom-10 text-left px-4 z-10"
        >
          <MagneticComp>
            <h2 className="text-color text-4xl sm:text-4xl font-extrabold">
              <Link href="/contact">Collaborate</Link>
            </h2>
          </MagneticComp>
        </motion.div>
      </div>
    </motion.div>
  );
}

const Cube = ({
  scrollProgress,
  introDone,
}: {
  scrollProgress: MotionValue<number>;
  introDone: boolean;
}) => {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const targetScaleRef = useRef(1);

  const textures = [
    useLoader(TextureLoader, "/cube-img/image1.jpg"),
    useLoader(TextureLoader, "/cube-img/image2.jpg"),
    useLoader(TextureLoader, "/cube-img/cubeimg5.png"),
    useLoader(TextureLoader, "/cube-img/image4.jpg"),
    useLoader(TextureLoader, "/cube-img/rustam.jpg"),
    useLoader(TextureLoader, "/cube-img/image3.jpg"),
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!mesh.current) return;

    mesh.current.position.set(0, 0, 0);
    mesh.current.rotation.set(0, 0, 0);
    mesh.current.scale.set(1, 1, 1);
    targetScaleRef.current = 1;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;

    const value = scrollProgress.get();

    mesh.current.rotation.x = value;
    mesh.current.rotation.y = value * 1.2;

    if (isMobile) {
      mesh.current.scale.set(1, 1, 1);
      return;
    }

    const targetScale = hovered && introDone ? 1.1 : 1;
    targetScaleRef.current += (targetScale - targetScaleRef.current) * 0.1;

    mesh.current.scale.set(
      targetScaleRef.current,
      targetScaleRef.current,
      targetScaleRef.current,
    );
  });

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.style.cursor = hovered && introDone ? "pointer" : "default";
  }, [hovered, introDone]);

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      onPointerOver={() => introDone && setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2.3, 2.3, 2.3]} />
      {textures.map((tex, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} map={tex} />
      ))}
    </mesh>
  );
};
