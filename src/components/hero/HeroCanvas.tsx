"use client";

import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import React, { Suspense } from "react";

import HeroSceneLoader, { ReadySignal } from "./HeroSceneLoader";
import PortfolioWorld from "./PortfolioWorld";

export default function HeroCanvas({
  hasMounted,
  allowCanvasMount,
  isMdUp,
  isCanvasActive,
  loaderComplete,
  sceneReady,
  virtualScroll,
  onSceneReady,
  onLoaderComplete,

  contactTransitionRef,
  posterTransitionRef,
  visualIdentityTransitionRef,
  animationTransitionRef,
  typographyTransitionRef,

  dreamProjectTransitionRef,
  postersBundleTransitionRef,
  kistefossTransitionRef,
  aurelisTransitionRef,
  artExhibitionTransitionRef,
}: {
  hasMounted: boolean;
  allowCanvasMount: boolean;

  isMdUp: boolean;
  isCanvasActive: boolean;

  loaderComplete: boolean;
  sceneReady: boolean;

  virtualScroll: MotionValue<number>;

  onSceneReady: () => void;
  onLoaderComplete: () => void;

  contactTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  posterTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  visualIdentityTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  animationTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  typographyTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  dreamProjectTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  postersBundleTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  kistefossTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  aurelisTransitionRef: React.RefObject<HTMLAnchorElement | null>;

  artExhibitionTransitionRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  return (
    <div
      className="
        absolute
        inset-0
        touch-none
        overflow-hidden
      "
    >
      {hasMounted && allowCanvasMount && (
        <Canvas
          className="
            h-full
            w-full
            touch-none
          "
          camera={{
            position: [0, 0, 0],
            fov: isMdUp ? 48 : 63,
            near: 0.01,
            far: 100,
          }}
          dpr={isMdUp ? [1, 1.5] : [1, 1.5]}
          frameloop={isCanvasActive ? "always" : "never"}
          gl={{
            antialias: false,
            powerPreference: "high-performance",

            alpha: false,

            stencil: false,
          }}
        >
          <color attach="background" args={["#181c14"]} />

          {!loaderComplete && (
            <HeroSceneLoader
              sceneReady={sceneReady}
              onComplete={onLoaderComplete}
            />
          )}

          <Suspense fallback={null}>
            <PortfolioWorld
              virtualScroll={virtualScroll}
              isActive={isCanvasActive}
              isMobile={!isMdUp}
              contactTransitionRef={contactTransitionRef}
              posterTransitionRef={posterTransitionRef}
              visualIdentityTransitionRef={visualIdentityTransitionRef}
              animationTransitionRef={animationTransitionRef}
              typographyTransitionRef={typographyTransitionRef}
              dreamProjectTransitionRef={dreamProjectTransitionRef}
              postersBundleTransitionRef={postersBundleTransitionRef}
              kistefossTransitionRef={kistefossTransitionRef}
              aurelisTransitionRef={aurelisTransitionRef}
              artExhibitionTransitionRef={artExhibitionTransitionRef}
            />

            <ReadySignal onReady={onSceneReady} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
