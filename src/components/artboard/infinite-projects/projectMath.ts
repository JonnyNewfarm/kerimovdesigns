import * as THREE from "three";
import type { TitleSnapshot } from "./types";

export function smoothstep(value: number) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

export function titleMetrics(
  mesh: THREE.Mesh,
  camera: THREE.Camera,
  size: { width: number; height: number },
  planeWidth: number,
  planeHeight: number,
): TitleSnapshot {
  mesh.updateWorldMatrix(true, false);
  const point = mesh.localToWorld(new THREE.Vector3(-planeWidth * 0.48, planeHeight * 0.5, 0.12));
  point.project(camera);
  const x = (point.x + 1) * size.width * 0.5;
  const imageTopY = (1 - point.y) * size.height * 0.5;
  const distance = Math.max(0.1, camera.position.z - mesh.position.z);
  const pixelsPerWorld = camera instanceof THREE.PerspectiveCamera
    ? size.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance)
    : 1;
  const projectedWidth = planeWidth * mesh.scale.x * pixelsPerWorld;
  const font = THREE.MathUtils.clamp(projectedWidth * 0.048, 11, 16);
  const y = imageTopY - 12 - font * 0.52;
  return {
    x,
    y,
    font,
    width: Math.max(90, projectedWidth * 0.87),
    yaw: mesh.rotation.y,
    pitch: mesh.rotation.x,
  };
}
