"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Link from "next/link";
import { OrbitControls } from "@react-three/drei";

// Custom hook to detect if screen width is md (768px) or wider
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

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 4.3]);
  const smoothProgress = useSpring(progress, { damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1],
      }}
      transition={{
        duration: 2,
        times: [0, 0.4, 1],
        ease: "easeInOut",
      }}
      ref={container}
      className="h-[150vh]"
    >
      <div className="sticky uppercase top-0 h-screen flex flex-col justify-center items-center">
        <Canvas className="w-full h-3/4">
          {isMdUp && <OrbitControls enableZoom={false} enablePan={false} />}
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Cube scrollProgress={smoothProgress} />
        </Canvas>

        <div className="absolute bottom-15 text-center px-4">
          <h1 className="text-white/90 text-2xl sm:text-2xl font-bold">
            Rustam Kerimov
          </h1>
          <h2 className="text-white/90 text-3xl whitespace-nowrap sm:text-4xl font-extrabold">
            Graphic Designer
          </h2>
        </div>

        <div className="absolute hidden lg:block left-10 bottom-15 text-left px-4">
          <h2 className="text-white/90 text-4xl sm:text-4xl font-extrabold">
            <Link href={"/projects"}>Archives</Link>
          </h2>
        </div>

        <div className="absolute hidden lg:block right-10 bottom-15 text-left px-4">
          <h2 className="text-white/90 text-4xl sm:text-4xl font-extrabold">
            <Link href={"/contact"}>Collaborate</Link>
          </h2>
        </div>
      </div>
    </motion.div>
  );
}

const Cube = ({ scrollProgress }: { scrollProgress: any }) => {
  const [hovered, setHovered] = useState(false);

  const mesh = useRef<Mesh>(null);
  const texture1 = useLoader(TextureLoader, "/cube-img/image1.jpg");
  const texture2 = useLoader(TextureLoader, "/cube-img/image2.jpg");
  const texture3 = useLoader(TextureLoader, "/cube-img/image3.jpg");
  const texture4 = useLoader(TextureLoader, "/cube-img/image4.jpg");
  const texture5 = useLoader(TextureLoader, "/cube-img/image5.jpg");
  const texture6 = useLoader(TextureLoader, "/cube-img/image6.jpg");

  useFrame(() => {
    if (!mesh.current) return;

    const value = scrollProgress.get();
    mesh.current.rotation.x = value;
    mesh.current.rotation.y = value;
  });

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  return (
    <>
      <mesh
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2.3, 2.3, 2.3]} />
        <meshStandardMaterial map={texture1} attach={"material-0"} />
        <meshStandardMaterial map={texture2} attach={"material-1"} />
        <meshStandardMaterial map={texture3} attach={"material-2"} />
        <meshStandardMaterial map={texture4} attach={"material-3"} />
        <meshStandardMaterial map={texture5} attach={"material-4"} />
        <meshStandardMaterial map={texture6} attach={"material-5"} />
      </mesh>
    </>
  );
};
