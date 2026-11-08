"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  start: boolean;
};

type RevealItem = {
  mesh: THREE.Mesh;
  delay: number;
};

const DURATION = 1.15;
const STAGGER = 0.075;
const RISE_DISTANCE = 0.38;

const OVERSHOOT = 1.0;

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

const easeOutBack = (t: number) => {
  const c = OVERSHOOT;

  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

function isProjectMesh(object: THREE.Object3D): object is THREE.Mesh {
  if (!(object instanceof THREE.Mesh)) {
    return false;
  }

  const material = object.material;

  if (!(material instanceof THREE.ShaderMaterial)) {
    return false;
  }

  return Boolean(
    material.uniforms.uOpacity &&
      material.uniforms.uPointer &&
      material.uniforms.uHover,
  );
}

function buildOutsideInOrder(meshes: THREE.Mesh[]) {
  const ordered: THREE.Mesh[] = [];

  let left = 0;
  let right = meshes.length - 1;

  while (left <= right) {
    if (left === right) {
      ordered.push(meshes[left]);
    } else {
      ordered.push(meshes[left]);
      ordered.push(meshes[right]);
    }

    left++;
    right--;
  }

  return ordered;
}

export default function SceneImageReveal({ start }: Props) {
  const { scene, size } = useThree();

  const startedAt = useRef<number | null>(null);
  const finished = useRef(false);
  const items = useRef<RevealItem[]>([]);

  useFrame(({ clock }) => {
    if (finished.current) return;

    if (!start) {
      scene.traverse((object) => {
        if (!isProjectMesh(object)) return;

        const material = object.material as THREE.ShaderMaterial;

        material.uniforms.uOpacity.value = 0;
      });

      return;
    }

    if (startedAt.current === null) {
      startedAt.current = clock.elapsedTime;

      const visible: THREE.Mesh[] = [];
      const halfWidth = size.width / 2;

      scene.traverse((object) => {
        if (!isProjectMesh(object)) return;

        const material = object.material as THREE.ShaderMaterial;

        if (object.renderOrder === 300) {
          material.uniforms.uOpacity.value = 1;
          return;
        }

        const inView =
          object.visible &&
          object.position.x > -halfWidth - 200 &&
          object.position.x < halfWidth + 200;

        if (inView) {
          material.uniforms.uOpacity.value = 0;
          visible.push(object);
        } else {
          material.uniforms.uOpacity.value = 1;
        }
      });

      visible.sort((a, b) => a.position.x - b.position.x);

      // Reveal from both outer edges toward the center.
      const revealOrder = buildOutsideInOrder(visible);

      items.current = revealOrder.map((mesh, index) => ({
        mesh,
        delay: index * STAGGER,
      }));
    }

    const elapsed = clock.elapsedTime - startedAt.current;

    let allFinished = true;

    for (const { mesh, delay } of items.current) {
      const material = mesh.material as THREE.ShaderMaterial;

      if (mesh.renderOrder === 300) {
        material.uniforms.uOpacity.value = 1;
        continue;
      }

      const t = clamp01((elapsed - delay) / DURATION);

      const landing = easeOutBack(t);

      material.uniforms.uOpacity.value = THREE.MathUtils.smoothstep(t, 0, 0.55);

      mesh.position.y -= size.height * RISE_DISTANCE * (1 - landing);

      if (t < 1) {
        allFinished = false;
      }
    }

    if (allFinished) {
      finished.current = true;

      scene.traverse((object) => {
        if (!isProjectMesh(object)) return;

        const material = object.material as THREE.ShaderMaterial;

        material.uniforms.uOpacity.value = 1;
      });
    }
  });

  return null;
}
