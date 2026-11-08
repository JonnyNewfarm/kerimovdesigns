"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

export default function PixelPerspectiveCamera() {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    camera.position.set(0, 0, size.height / (2 * Math.tan(halfFov)));
    camera.aspect = size.width / size.height;
    camera.far = 20000;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
  }, [camera, size.width, size.height]);

  return null;
}
