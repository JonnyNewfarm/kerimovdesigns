import * as THREE from "three";

export function updateCoverUv(
  texture: THREE.Texture,
  planeWidth: number,
  planeHeight: number,
  scale: THREE.Vector2,
  offset: THREE.Vector2,
) {
  const source = texture.image as
    | HTMLImageElement
    | HTMLVideoElement
    | undefined;

  if (!source) {
    scale.set(1, 1);

    offset.set(0, 0);

    return;
  }

  let sourceWidth = 1;

  let sourceHeight = 1;

  /*
   * VIDEO
   */

  if (source instanceof HTMLVideoElement) {
    sourceWidth = source.videoWidth || 1;

    sourceHeight = source.videoHeight || 1;
  } else {
    /*
     * IMAGE
     */

    sourceWidth =
      source.naturalWidth ||
      source.width ||
      1;

    sourceHeight =
      source.naturalHeight ||
      source.height ||
      1;
  }

  const sourceAspect =
    sourceWidth /
    sourceHeight;

  const planeAspect =
    planeWidth /
    planeHeight;

  /*
   * Landscape source compared
   * with plane.
   */

  if (sourceAspect > planeAspect) {
    const scaleX =
      planeAspect /
      sourceAspect;

    scale.set(
      scaleX,
      1,
    );

    offset.set(
      (1 - scaleX) / 2,
      0,
    );

    return;
  }

  /*
   * Portrait / taller source.
   */

  const scaleY =
    sourceAspect /
    planeAspect;

  scale.set(
    1,
    scaleY,
  );

  offset.set(
    0,
    (1 - scaleY) / 2,
  );
}