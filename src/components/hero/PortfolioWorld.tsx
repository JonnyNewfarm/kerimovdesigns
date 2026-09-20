"use client";

import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { Texture, TextureLoader } from "three";

import AllProjectsScene from "./AllProjectsScene";
import AnimationScene from "./AnimationScene";
import PostersScene from "./PostersScene";
import RustamScene from "./RustamScene";
import TypographyScene from "./TypographyScene";
import VisualScene from "./VIsualScene";

import {
  ALL_PROJECT_IMAGE_PATHS,
  POSTER_IMAGE_PATHS,
  RUSTAM_IMAGE,
  TYPOGRAPHY_IMAGE_PATHS,
  VISUAL_IMAGE_PATHS,
} from "./portfolioWorldAssets";

import { WORLD_BG_COLOR } from "./portfolioWorldConstants";

import type { PortfolioWorldProps } from "./portfolioWorldTypes";

import { prepareTexture } from "./PortfolioPrimitives";

import { CameraRig, RingMotionProvider } from "./RingMotionContext";

export default function PortfolioWorld({
  virtualScroll,

  isActive,

  isMobile,

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
}: PortfolioWorldProps) {
  /*
   * =======================================================
   * LOAD IMAGES
   * =======================================================
   */

  const rustamTexture = useLoader(TextureLoader, RUSTAM_IMAGE);

  const visualTextures = useLoader(
    TextureLoader,
    VISUAL_IMAGE_PATHS,
  ) as Texture[];

  const posterTextures = useLoader(
    TextureLoader,
    POSTER_IMAGE_PATHS,
  ) as Texture[];

  const typographyTextures = useLoader(
    TextureLoader,
    TYPOGRAPHY_IMAGE_PATHS,
  ) as Texture[];

  const allProjectTextures = useLoader(
    TextureLoader,
    ALL_PROJECT_IMAGE_PATHS,
  ) as Texture[];

  /*
   * =======================================================
   * COLOR SPACE / TEXTURE PREP
   * =======================================================
   */

  useMemo(() => {
    prepareTexture(rustamTexture);

    visualTextures.forEach(prepareTexture);

    posterTextures.forEach(prepareTexture);

    typographyTextures.forEach(prepareTexture);

    allProjectTextures.forEach(prepareTexture);
  }, [
    rustamTexture,
    visualTextures,
    posterTextures,
    typographyTextures,
    allProjectTextures,
  ]);

  /*
   * =======================================================
   * WORLD SCALE
   * =======================================================
   */

  const scale = isMobile ? 1.1 : 0.82;

  return (
    <>
      <color attach="background" args={[WORLD_BG_COLOR]} />

      <RingMotionProvider virtualScroll={virtualScroll}>
        <CameraRig />

        <RustamScene
          isActive={isActive}
          scale={scale}
          texture={rustamTexture}
        />

        <VisualScene
          scale={scale}
          textures={visualTextures}
          onOpen={() => {
            visualIdentityTransitionRef.current?.click();
          }}
        />

        <PostersScene
          scale={scale}
          textures={posterTextures}
          onOpen={() => {
            posterTransitionRef.current?.click();
          }}
        />

        <AnimationScene
          scale={scale}
          isActive={isActive}
          isMobile={isMobile}
          onOpen={() => {
            animationTransitionRef.current?.click();
          }}
        />

        <TypographyScene
          scale={scale}
          textures={typographyTextures}
          onOpen={() => {
            typographyTransitionRef.current?.click();
          }}
        />

        <AllProjectsScene
          scale={scale}
          textures={allProjectTextures}
          isMobile={isMobile}
          onOpen={() => {
            contactTransitionRef.current?.click();
          }}
          dreamProjectTransitionRef={dreamProjectTransitionRef}
          postersBundleTransitionRef={postersBundleTransitionRef}
          kistefossTransitionRef={kistefossTransitionRef}
          aurelisTransitionRef={aurelisTransitionRef}
          artExhibitionTransitionRef={artExhibitionTransitionRef}
        />
      </RingMotionProvider>
    </>
  );
}
