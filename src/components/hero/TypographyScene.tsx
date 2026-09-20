"use client";

import type { Texture } from "three";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import { ImagePlane, SceneShell } from "./PortfolioPrimitives";

import WorldButton from "./WorldButton";

export default function TypographyScene({
  scale,
  textures,
  onOpen,
}: {
  scale: number;

  textures: Texture[];

  onOpen: () => void;
}) {
  const angle = WORLD_SECTIONS[4].angle;

  return (
    <SceneShell angle={angle} scale={scale}>
      {/* LEFT / SLIGHTLY HIGHER */}
      <ImagePlane
        texture={textures[0]}
        position={[-1.7, 0.05, 0.3]}
        bendStrength={0.96}
        width={2.75}
        height={3.45}
        rotationZ={0.025}
      />

      {/* RIGHT / LOWER */}
      <ImagePlane
        texture={textures[1]}
        position={[1.35, -0.35, -0.08]}
        bendStrength={0.9}
        width={2.6}
        height={3.25}
        rotationZ={-0.025}
      />

      <WorldButton
        label="TYPOGRAPHY"
        width={1.75}
        position={[1.8, -1.82, 0.5]}
        onClick={onOpen}
      />
    </SceneShell>
  );
}
