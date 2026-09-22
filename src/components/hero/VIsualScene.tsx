"use client";

import type { Texture } from "three";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import { ImagePlane, SceneShell } from "./PortfolioPrimitives";

import WorldButton from "./WorldButton";

export default function VisualScene({
  scale,
  textures,
  isMobile,
  onOpen,
}: {
  scale: number;

  textures: Texture[];

  isMobile: boolean;

  onOpen: () => void;
}) {
  const angle = WORLD_SECTIONS[1].angle;

  return (
    <SceneShell angle={angle} scale={scale}>
      <ImagePlane
        texture={textures[0]}
        position={[-1.35, -0.5, 0.28]}
        bendStrength={1}
        rotationZ={-0}
        width={2}
        height={3}
        isMobile={isMobile}
      />

      <ImagePlane
        texture={textures[2]}
        position={[1, -0.05, -0.15]}
        bendStrength={0.86}
        rotationZ={0}
        width={2.3}
        height={3.3}
        isMobile={isMobile}
      />

      <WorldButton
        label="VISUAL IDENTITIES"
        width={1.91}
        position={[1.35, -1.65, 0.45]}
        onClick={onOpen}
      />
    </SceneShell>
  );
}
