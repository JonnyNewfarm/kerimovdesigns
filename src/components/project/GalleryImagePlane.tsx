"use client";

import { useLoader } from "@react-three/fiber";

import { useEffect } from "react";

import * as THREE from "three";

import GalleryMediaPlane from "./GalleryMediaPlane";

import type { MutableRefObject } from "react";

import type { PointerState } from "./projectGalleryThreeTypes";

export default function GalleryImagePlane({
  src,
  index,
  anchorsRef,
  pointerRef,
  hoveredIndexRef,
  scrollBendRef,
}: {
  src: string;

  index: number;

  anchorsRef: MutableRefObject<Array<HTMLDivElement | null>>;

  pointerRef: MutableRefObject<PointerState>;

  hoveredIndexRef: MutableRefObject<number | null>;

  scrollBendRef: MutableRefObject<number>;
}) {
  const texture = useLoader(THREE.TextureLoader, src);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.ClampToEdgeWrapping;

    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.minFilter = THREE.LinearFilter;

    texture.magFilter = THREE.LinearFilter;

    texture.needsUpdate = true;
  }, [texture]);

  return (
    <GalleryMediaPlane
      index={index}
      getAnchor={() => anchorsRef.current[index]}
      getTexture={() => texture}
      pointerRef={pointerRef}
      hoveredIndexRef={hoveredIndexRef}
      scrollBendRef={scrollBendRef}
    />
  );
}
