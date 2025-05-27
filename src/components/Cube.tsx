"use client";
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

import { OrbitControls, ScrollControls } from "@react-three/drei";
import { useScroll } from "framer-motion";

export default function Index() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="h-[150vh]">
      <div className="h-screen sticky top-0">
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Cube scrollProgress={scrollYProgress} />
        </Canvas>
      </div>
    </div>
  );
}

const Cube = ({ scrollProgress }: { scrollProgress: any }) => {
  const mesh = useRef<Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      const offset = scrollProgress.get();
      mesh.current.rotation.x = offset * 5;
      mesh.current.rotation.y = offset * 5;
      mesh.current.rotation.z = offset * 5;
    }
  });

  const texture1 = useLoader(TextureLoader, "/cube/img1.jpg");
  const texture2 = useLoader(TextureLoader, "/cube/img2.jpg");
  const texture3 = useLoader(TextureLoader, "/cube/img3.jpg");
  const texture4 = useLoader(TextureLoader, "/cube/img4.jpg");
  const texture5 = useLoader(TextureLoader, "/cube/img5.jpg");
  const texture6 = useLoader(TextureLoader, "/cube/img6.jpg");

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture1} attach={"material-0"} />
      <meshStandardMaterial map={texture2} attach={"material-1"} />
      <meshStandardMaterial map={texture3} attach={"material-2"} />
      <meshStandardMaterial map={texture4} attach={"material-3"} />
      <meshStandardMaterial map={texture5} attach={"material-4"} />
      <meshStandardMaterial map={texture6} attach={"material-5"} />
    </mesh>
  );
};
