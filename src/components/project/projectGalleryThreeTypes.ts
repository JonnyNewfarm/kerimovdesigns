import type { MutableRefObject } from "react";
import * as THREE from "three";

export type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

export type ProjectGalleryVideoBridge = {
  anchorRef: MutableRefObject<HTMLDivElement | null>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  hasStartedRef: MutableRefObject<boolean>;
  poster?: string | null;
};

export type ProjectGalleryThreeCanvasProps = {
  images: string[];
  anchorsRef: MutableRefObject<Array<HTMLDivElement | null>>;
  video?: ProjectGalleryVideoBridge | null;
};

export type GalleryMediaPlaneProps = {
  index: number;
  getAnchor: () => HTMLElement | null;
  getTexture: () => THREE.Texture | null;
  pointerRef: MutableRefObject<PointerState>;
  hoveredIndexRef: MutableRefObject<number | null>;
  scrollBendRef: MutableRefObject<number>;
};