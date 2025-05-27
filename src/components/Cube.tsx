"use client";
import React, { useEffect, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";
import { useSpring, useScroll, useTransform } from "framer-motion";

export default function index() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const smoothProgress = useSpring(progress, { damping: 20 });

  return (
    <div ref={container} className={"h-[200vh]"}>
      <div className={"sticky top-0 h-screen"}>
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Cube progress={smoothProgress} />
        </Canvas>
      </div>
    </div>
  );
}

function Cube({ progress }: any) {
  const mesh = useRef(null);

  const texture_1 = useLoader(TextureLoader, "/cube/img1.jpg");
  const texture_2 = useLoader(TextureLoader, "/cube/img2.jpg");
  const texture_3 = useLoader(TextureLoader, "/cube/img3.jpg");
  const texture_4 = useLoader(TextureLoader, "/cube/img4.jpg");
  const texture_5 = useLoader(TextureLoader, "/cube/img5.jpg");
  const texture_6 = useLoader(TextureLoader, "/cube/img6.jpg");

  return (
    <mesh ref={mesh} rotation-y={progress} rotation-x={progress}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial map={texture_1} attach="material-0" />
      <meshStandardMaterial map={texture_2} attach="material-1" />
      <meshStandardMaterial map={texture_3} attach="material-2" />
      <meshStandardMaterial map={texture_4} attach="material-3" />
      <meshStandardMaterial map={texture_5} attach="material-4" />
      <meshStandardMaterial map={texture_6} attach="material-5" />
    </mesh>
  );
}
