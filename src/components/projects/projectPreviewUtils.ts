import * as THREE from "three";

export function getCoverUv(
  texture: THREE.Texture,
  planeWidth: number,
  planeHeight: number,
) {
  const image =
    texture.image as
      | HTMLImageElement
      | undefined;

  const imageWidth =
    image?.naturalWidth ||
    image?.width ||
    1;

  const imageHeight =
    image?.naturalHeight ||
    image?.height ||
    1;

  const imageAspect =
    imageWidth /
    imageHeight;

  const planeAspect =
    planeWidth /
    planeHeight;

  if (
    imageAspect >
    planeAspect
  ) {
    const scaleX =
      planeAspect /
      imageAspect;

    return {
      scale:
        new THREE.Vector2(
          scaleX,
          1,
        ),

      offset:
        new THREE.Vector2(
          (1 - scaleX) / 2,
          0,
        ),
    };
  }

  const scaleY =
    imageAspect /
    planeAspect;

  return {
    scale:
      new THREE.Vector2(
        1,
        scaleY,
      ),

    offset:
      new THREE.Vector2(
        0,
        (1 - scaleY) / 2,
      ),
  };
}