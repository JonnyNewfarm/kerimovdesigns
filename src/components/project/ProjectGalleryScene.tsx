"use client";

import { useFrame } from "@react-three/fiber";

import { Suspense, useEffect, useRef } from "react";

import * as THREE from "three";

import GalleryImagePlane from "./GalleryImagePlane";
import GalleryVideoPlane from "./GalleryVideoPlane";

import type {
  PointerState,
  ProjectGalleryThreeCanvasProps,
} from "./projectGalleryThreeTypes";

export default function ProjectGalleryScene({
  images,
  anchorsRef,
  video,
}: ProjectGalleryThreeCanvasProps) {
  /*
   * =====================================================
   * POINTER
   * =====================================================
   */

  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    active: false,
  });

  const hoveredIndexRef = useRef<number | null>(null);

  /*
   * =====================================================
   * SCROLL
   * =====================================================
   */

  const scrollBendRef = useRef(0);

  const scrollVelocity = useRef(0);

  const lastScroll = useRef(0);

  /*
   * Video behandles som neste
   * gallery-item etter bildene.
   */

  const videoIndex = images.length;

  /*
   * =====================================================
   * GLOBAL POINTER
   * =====================================================
   */

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;

      pointerRef.current.y = event.clientY;

      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;

      hoveredIndexRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, []);

  useEffect(() => {
    lastScroll.current = window.scrollY;
  }, []);

  /*
   * =====================================================
   * MASTER FRAME
   *
   * - hover detection
   * - vertical scroll bend
   *
   * priority -1 gjør at dette skjer før
   * media-plane frames.
   * =====================================================
   */

  useFrame(
    (_, rawDelta) => {
      const delta = Math.min(rawDelta, 1 / 30);

      /*
       * =================================================
       * HOVER DETECTION
       * =================================================
       */

      let hovered: number | null = null;

      if (pointerRef.current.active) {
        /*
         * VIDEO
         */

        const videoAnchor = video?.anchorRef.current;

        if (videoAnchor) {
          const rect = videoAnchor.getBoundingClientRect();

          const inside =
            pointerRef.current.x >= rect.left &&
            pointerRef.current.x <= rect.right &&
            pointerRef.current.y >= rect.top &&
            pointerRef.current.y <= rect.bottom;

          if (inside) {
            hovered = videoIndex;
          }
        }

        /*
         * IMAGES
         */

        if (hovered === null) {
          for (let index = anchorsRef.current.length - 1; index >= 0; index--) {
            const anchor = anchorsRef.current[index];

            if (!anchor) {
              continue;
            }

            const rect = anchor.getBoundingClientRect();

            const inside =
              pointerRef.current.x >= rect.left &&
              pointerRef.current.x <= rect.right &&
              pointerRef.current.y >= rect.top &&
              pointerRef.current.y <= rect.bottom;

            if (inside) {
              hovered = index;

              break;
            }
          }
        }
      }

      hoveredIndexRef.current = hovered;

      /*
       * =================================================
       * VERTICAL SCROLL BEND
       * =================================================
       */

      const scroll = window.scrollY;

      const difference = scroll - lastScroll.current;

      lastScroll.current = scroll;

      /*
       * Kun vertikal deformation.
       *
       * Ikke lateral scroll.
       */

      const target = THREE.MathUtils.clamp(
        -difference * 0.0018,

        -0.022,
        0.022,
      );

      /*
       * Smooth spring.
       */

      const stiffness = 105;

      const damping = 12;

      scrollVelocity.current +=
        (target - scrollBendRef.current) * stiffness * delta;

      scrollVelocity.current *= Math.exp(-damping * delta);

      scrollBendRef.current += scrollVelocity.current * delta;

      /*
       * Retter seg smooth ut
       * når scrolling stopper.
       */

      const returnFollow = 1 - Math.exp(-delta * 4.5);

      scrollBendRef.current += (0 - scrollBendRef.current) * returnFollow;
    },

    -1,
  );

  return (
    <>
      {images.map((src, index) => (
        <Suspense key={`${src}-${index}`} fallback={null}>
          <GalleryImagePlane
            src={src}
            index={index}
            anchorsRef={anchorsRef}
            pointerRef={pointerRef}
            hoveredIndexRef={hoveredIndexRef}
            scrollBendRef={scrollBendRef}
          />
        </Suspense>
      ))}

      {video ? (
        <GalleryVideoPlane
          index={videoIndex}
          video={video}
          pointerRef={pointerRef}
          hoveredIndexRef={hoveredIndexRef}
          scrollBendRef={scrollBendRef}
        />
      ) : null}
    </>
  );
}
