import * as THREE from "three";
import type { ActivePlane, PlaneLayout } from "../infinite-projects/types";

export function updateBackdropMask({ selected, planes, meshes, imageHeight, camera, gl, size, backdrop, point }: {
  selected: ActivePlane;
  planes: PlaneLayout[];
  meshes: Array<THREE.Mesh | null>;
  imageHeight: number;
  camera: THREE.Camera;
  gl: THREE.WebGLRenderer;
  size: { width: number; height: number };
  backdrop: HTMLDivElement;
  point: THREE.Vector3;
}) {
      const activeIndex = planes.findIndex(
        (plane) => plane.index === selected.index && plane.copy === selected.copy,
      );
      const activeMesh = meshes[activeIndex];
      const activePlane = planes[activeIndex];

      if (activeMesh && activePlane) {
        activeMesh.updateWorldMatrix(true, false);

        const uniforms = (activeMesh.material as THREE.ShaderMaterial).uniforms;
        const uPointer = uniforms.uPointer.value as THREE.Vector2;
        const uMotion = uniforms.uMotion.value as THREE.Vector2;
        const worldScale = uniforms.uWorldScale.value as number;
        const edgeBend = uniforms.uEdgeBend.value as number;
        const transitionBend = uniforms.uTransitionBend.value as number;
        const morph = uniforms.uMorph.value as number;
        const edgeMorphStrength = uniforms.uEdgeMorphStrength.value as number;
        const hover = uniforms.uHover.value as number;
        const time = uniforms.uTime.value as number;
        const canvasRect = gl.domElement.getBoundingClientRect();
        const outline: string[] = [];
        const outlinePoints: number[] = [];
        const samples = 24;

        const addEdgePoint = (u: number, v: number) => {
          const sx = Math.sin(u * Math.PI);
          const sy = Math.sin(v * Math.PI);
          const side = u * 2 - 1;
          const edge = Math.pow(Math.abs(side), 1.4);
          const verticalProfile = 0.85 + 0.15 * Math.cos((v - 0.5) * Math.PI);
          const wave = Math.sin(u * 7 - time * 1.8);

          point.set((u - 0.5) * activePlane.width, (v - 0.5) * imageHeight, 0);
          point.z += sx * sy * (
            uPointer.x * 0.32 + uPointer.y * 0.16 +
            wave * hover * 0.13 + uMotion.x * 0.29 + uMotion.y * 0.24
          ) * worldScale;
          point.x += sy * (uPointer.x * 0.085 + uMotion.x * 0.085) * worldScale;
          point.y -= sx * (uPointer.y * 0.065 - uMotion.y * 0.075) * worldScale;
          point.z += edgeBend * (edge * 0.56 + side * edge * 0.17) * verticalProfile;
          point.x += edgeBend * side * edge * 0.11;
          point.y += edgeBend * side * (v - 0.5) * 0.07;
          point.x += transitionBend * Math.sin(v * Math.PI) * 0.035 * activePlane.width;
          point.y += transitionBend * Math.sin(u * Math.PI) * (v - 0.5) * 0.035 * activePlane.width;
          point.z += transitionBend * sx * sy * 0.16 * worldScale;

          const coverReturn = THREE.MathUtils.clamp(uniforms.uCoverReturn.value as number, 0, 1);
          const morphPulse = Math.max(
            Math.sin(Math.PI * THREE.MathUtils.clamp(morph, 0, 1)) * (1 - coverReturn),
            Math.sin(Math.PI * coverReturn),
          );
          point.z += sx * sy * morphPulse * worldScale *
            (0.38 + 0.22 * Math.sin(u * 7 + v * 3 + time * 0.4));
          point.x += sx * sy * morphPulse * worldScale * 0.075 * Math.sin(v * 8);

          const verticalSide = v * 2 - 1;
          const sideMask = Math.pow(Math.abs(side), 2.6);
          const topBottomMask = Math.pow(Math.abs(verticalSide), 2.6);
          const sideFlow = (
            Math.sin(v * 2 * Math.PI + time * 0.5 + 0.6) +
            0.3 * Math.sin(v * 4 * Math.PI - time * 0.32)
          ) * Math.sin(v * Math.PI);
          const topBottomFlow = (
            Math.sin(u * 2 * Math.PI - time * 0.4 + 1.2) +
            0.3 * Math.sin(u * 4 * Math.PI + time * 0.3)
          ) * Math.sin(u * Math.PI);
          const edgeAmount = morphPulse * worldScale * edgeMorphStrength;

          point.x += side * sideMask * sideFlow * edgeAmount;
          point.y += verticalSide * topBottomMask * topBottomFlow * edgeAmount * 0.68;
          point.z += (
            sideMask * Math.sin(v * Math.PI) +
            topBottomMask * Math.sin(u * Math.PI)
          ) * edgeAmount * 0.65;

          activeMesh.localToWorld(point);
          point.project(camera);

          const pixelX = canvasRect.left + (point.x + 1) * size.width * 0.5;
          const pixelY = canvasRect.top + (1 - point.y) * size.height * 0.5;
          outline.push(`${pixelX.toFixed(2)}px ${pixelY.toFixed(2)}px`);
          outlinePoints.push(pixelX, pixelY);
        };

        for (let i = 0; i <= samples; i++) addEdgePoint(i / samples, 0);
        for (let i = 1; i <= samples; i++) addEdgePoint(1, i / samples);
        for (let i = 1; i <= samples; i++) addEdgePoint(1 - i / samples, 1);
        for (let i = 1; i <= samples; i++) addEdgePoint(0, 1 - i / samples);

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        backdrop.style.clipPath = `polygon(evenodd, 0px 0px, ${screenWidth}px 0px, ${screenWidth}px ${screenHeight}px, 0px ${screenHeight}px, 0px 0px, ${outline.join(", ")})`;
        return outlinePoints;
      }
}
