"use client";

import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import {
  Fn,
  abs,
  cos,
  float,
  mix,
  positionLocal,
  pow,
  sin,
  smoothstep,
  texture,
  uv,
  vec2,
  vec3,
} from "three/tsl";

import { MeshBasicNodeMaterial } from "three/webgpu";

type ProjectImageShaderProps = {
  src: string;
  alt?: string;
  className?: string;
  direction?: 1 | -1;
};

function prepareTexture(textureMap: THREE.Texture) {
  textureMap.colorSpace = THREE.SRGBColorSpace;
  textureMap.minFilter = THREE.LinearFilter;
  textureMap.magFilter = THREE.LinearFilter;
  textureMap.wrapS = THREE.ClampToEdgeWrapping;
  textureMap.wrapT = THREE.ClampToEdgeWrapping;
  textureMap.generateMipmaps = false;
  textureMap.needsUpdate = true;
}

function ProjectImagePlane({
  src,
  direction = 1,
}: {
  src: string;
  direction?: 1 | -1;
}) {
  const textureMap = useLoader(THREE.TextureLoader, src, (loader) => {
    loader.setCrossOrigin("anonymous");
  });

  const { viewport, size } = useThree();

  useEffect(() => {
    prepareTexture(textureMap);
  }, [textureMap]);

  const plane = useMemo(() => {
    const aspect = size.width / size.height || 16 / 9;
    const width = viewport.width;
    const height = viewport.width / aspect;

    return {
      width,
      height,
    };
  }, [viewport.width, size.width, size.height]);

  const material = useMemo(() => {
    const mat = new MeshBasicNodeMaterial();

    /*
      Texture rett inn, akkurat som eksempelet du viste:
      return texture(myMap, uv())
    */
    mat.colorNode = Fn(() => {
      return texture(textureMap, uv());
    })();

    mat.positionNode = Fn(() => {
      const pos = positionLocal.toVar();

      /*
        Denne komponenten remountes på src-endring via key.
        Derfor kan progress være basert på tid inne i node-oppsettet senere,
        men her bruker vi en fast progress-shape per material.
        Vi trigger bevegelsen ved at mesh mountes på nytt.
      */

      const localUv = uv();

      /*
        Offset fra venstre mot høyre, som i screenshoten.
      */
      const offset = float(1).sub(localUv.x.mul(0.5));

      /*
        Bruker y/x til å forme bevegelsen direkte.
        Dette er ikke texture transition ennå, men gir deg TSL-bevegelsen stabilt.
      */
      const p = float(1);

      const smoothProgress = p
        .sub(offset.mul(0.4))
        .div(0.6)
        .clamp(0, 1)
        .toVar();

      const bend = sin(smoothProgress.mul(Math.PI)).toVar();

      const xCentered = localUv.x.mul(2).sub(1).toVar();
      const yCentered = localUv.y.mul(2).sub(1).toVar();

      const xFalloff = float(1)
        .sub(smoothstep(0.78, 1, abs(xCentered)))
        .toVar();

      const yFalloff = float(1)
        .sub(smoothstep(0.82, 1, abs(yCentered)))
        .toVar();

      /*
        Bølge og stretch.
      */
      const waveA = sin(localUv.y.mul(Math.PI * 4.5)).mul(0.14);
      const waveB = sin(
        localUv.y.mul(Math.PI * 8.0).add(localUv.x.mul(Math.PI * 1.8)),
      ).mul(0.08);

      const wave = waveA.add(waveB).mul(bend).mul(xFalloff).toVar();

      pos.z = pos.z.add(wave);

      const sheetBend = pow(abs(yCentered), 1.35).mul(bend).mul(-0.14);

      pos.z = pos.z.add(sheetBend);

      pos.y = pos.y.mul(float(1).add(bend.mul(0.09)));
      pos.x = pos.x.mul(float(1).sub(bend.mul(0.025).mul(yFalloff)));

      /*
        Manuell rotateX.
      */
      const angle = smoothProgress.mul(-Math.PI * 0.46).mul(direction);

      const center = vec3(0, 0.14, 0);
      const shifted = pos.sub(center).toVar();

      const s = sin(angle).toVar();
      const c = cos(angle).toVar();

      const rotated = vec3(
        shifted.x,
        shifted.y.mul(c).sub(shifted.z.mul(s)),
        shifted.y.mul(s).add(shifted.z.mul(c)),
      );

      return rotated.add(center);
    })();

    mat.side = THREE.DoubleSide;

    return mat;
  }, [textureMap, direction]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh material={material}>
      <planeGeometry args={[plane.width, plane.height, 120, 80]} />
    </mesh>
  );
}

export default function ProjectImageShader({
  src,
  alt,
  className,
  direction = 1,
}: ProjectImageShaderProps) {
  return (
    <div className={className} aria-label={alt}>
      <Canvas
        camera={{
          position: [0, 0, 2.35],
          fov: 45,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <ProjectImagePlane key={src} src={src} direction={direction} />
      </Canvas>
    </div>
  );
}
