"use client";

import type { Texture } from "three";

import { WORLD_SECTIONS } from "./portfolioWorldConstants";

import type { Position } from "./portfolioWorldTypes";

import { ImagePlane, SceneShell } from "./PortfolioPrimitives";

import WorldButton from "./WorldButton";

function LogoTile({
  texture,
  position,

  width = 1.5,
  height = 1.5,
}: {
  texture: Texture;

  position: Position;

  width?: number;

  height?: number;
}) {
  return (
    <group position={position}>
      <ImagePlane
        texture={texture}
        position={[0, 0, 0.025]}
        width={width}
        height={height}
        bendStrength={0.68}
      />
    </group>
  );
}

export default function LogosScene({
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
      {/* FESTIVAL */}
      <LogoTile
        texture={textures[0]}
        width={1.75}
        height={1.75}
        position={[-2.45, 0.82, 0.04]}
      />

      {/* AMPERSAND */}
      <LogoTile
        texture={textures[1]}
        width={1.35}
        height={1.35}
        position={[-0.45, 1.28, -0.08]}
      />

      {/* BBS */}
      <LogoTile
        texture={textures[4]}
        width={2.2}
        height={2.2}
        position={[2.35, 0.45, 0.18]}
      />

      {/* AW */}
      <LogoTile
        texture={textures[3]}
        width={1.25}
        height={1.25}
        position={[-1.45, -1.35, -0.05]}
      />

      {/* BY:LARM */}
      <LogoTile
        texture={textures[2]}
        width={1.65}
        height={1.65}
        position={[0.45, -0.72, 0.07]}
      />

      <WorldButton
        label="LOGO DESIGN"
        width={1.65}
        position={[1.75, -1.55, 1.3]}
        onClick={onOpen}
      />
    </SceneShell>
  );
}
