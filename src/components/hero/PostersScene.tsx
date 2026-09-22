"use client";

import type { Texture } from "three";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import { ImagePlane, SceneShell } from "./PortfolioPrimitives";

import WorldButton from "./WorldButton";

export default function PostersScene({
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
  const angle = WORLD_SECTIONS[2].angle;

  return (
    <SceneShell angle={angle} scale={scale}>
      {/* LEFT */}
      <ImagePlane
        texture={textures[0]}
        position={[-1.85, 0.45, 0.25]}
        bendStrength={1}
        width={2.95}
        height={3.7}
        rotationZ={-0.02}
        isMobile={isMobile}
      />

      {/* RIGHT */}
      <ImagePlane
        texture={textures[1]}
        position={[1.2, 0.2, -0.12]}
        bendStrength={0.94}
        width={2.75}
        height={3.5}
        isMobile={isMobile}
      />

      <WorldButton
        label="POSTERS DESIGN"
        width={1.9}
        position={[1.75, -1.55, 0.42]}
        onClick={onOpen}
      />
    </SceneShell>
  );
}
