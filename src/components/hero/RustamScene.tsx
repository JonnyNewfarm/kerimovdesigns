"use client";

import type { Texture } from "three";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import { ImagePlane, SceneShell } from "./PortfolioPrimitives";

export default function RustamScene({
  scale,
  texture,
  isActive,
}: {
  scale: number;

  texture: Texture;

  isActive: boolean;
}) {
  const angle = WORLD_SECTIONS[0].angle;

  return (
    <SceneShell angle={angle} scale={scale}>
      <ImagePlane
        texture={texture}
        position={[0, 0, 0]}
        width={3.5}
        height={3.5}
        bendStrength={0.92}
        intro
        introActive={isActive}
      />
    </SceneShell>
  );
}
