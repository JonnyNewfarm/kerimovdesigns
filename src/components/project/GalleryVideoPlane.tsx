"use client";

import { useEffect, useRef } from "react";

import type { MutableRefObject } from "react";

import * as THREE from "three";

import GalleryMediaPlane from "./GalleryMediaPlane";

import type {
  PointerState,
  ProjectGalleryVideoBridge,
} from "./projectGalleryThreeTypes";

export default function GalleryVideoPlane({
  index,
  video,
  pointerRef,
  hoveredIndexRef,
  scrollBendRef,
}: {
  index: number;

  video: ProjectGalleryVideoBridge;

  pointerRef: MutableRefObject<PointerState>;

  hoveredIndexRef: MutableRefObject<number | null>;

  scrollBendRef: MutableRefObject<number>;
}) {
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);

  const posterTextureRef = useRef<THREE.Texture | null>(null);

  /*
   * =====================================================
   * VIDEO TEXTURE
   * =====================================================
   */

  useEffect(() => {
    let frameId = 0;

    let disposed = false;

    const setupTexture = () => {
      if (disposed) {
        return;
      }

      const element = video.videoRef.current;

      /*
       * ProjectVideoDesktop kan montere
       * litt senere enn Canvas.
       */

      if (!element) {
        frameId = requestAnimationFrame(setupTexture);

        return;
      }

      const texture = new THREE.VideoTexture(element);

      texture.colorSpace = THREE.SRGBColorSpace;

      texture.wrapS = THREE.ClampToEdgeWrapping;

      texture.wrapT = THREE.ClampToEdgeWrapping;

      texture.minFilter = THREE.LinearFilter;

      texture.magFilter = THREE.LinearFilter;

      texture.generateMipmaps = false;

      texture.needsUpdate = true;

      videoTextureRef.current = texture;
    };

    setupTexture();

    return () => {
      disposed = true;

      cancelAnimationFrame(frameId);

      videoTextureRef.current?.dispose();

      videoTextureRef.current = null;
    };
  }, [video.videoRef]);

  /*
   * =====================================================
   * POSTER
   * =====================================================
   */

  useEffect(() => {
    if (!video.poster) {
      return;
    }

    let disposed = false;

    const loader = new THREE.TextureLoader();

    loader.load(
      video.poster,

      (texture) => {
        if (disposed) {
          texture.dispose();

          return;
        }

        texture.colorSpace = THREE.SRGBColorSpace;

        texture.wrapS = THREE.ClampToEdgeWrapping;

        texture.wrapT = THREE.ClampToEdgeWrapping;

        texture.minFilter = THREE.LinearFilter;

        texture.magFilter = THREE.LinearFilter;

        texture.needsUpdate = true;

        posterTextureRef.current = texture;
      },
    );

    return () => {
      disposed = true;

      posterTextureRef.current?.dispose();

      posterTextureRef.current = null;
    };
  }, [video.poster]);

  return (
    <GalleryMediaPlane
      index={index}
      getAnchor={() => video.anchorRef.current}
      getTexture={() => {
        /*
         * Før video faktisk spiller:
         * bruk poster.
         */

        if (!video.hasStartedRef.current && posterTextureRef.current) {
          return posterTextureRef.current;
        }

        /*
         * Når onPlaying har skjedd:
         * bruk live VideoTexture.
         */

        return videoTextureRef.current ?? posterTextureRef.current;
      }}
      pointerRef={pointerRef}
      hoveredIndexRef={hoveredIndexRef}
      scrollBendRef={scrollBendRef}
    />
  );
}
