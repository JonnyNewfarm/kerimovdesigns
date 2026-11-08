
import type * as THREE from "three";

export type InfiniteProject = {
  id: string;
  title: string;
  description?: string;
  tools?: string;
  type?: string;
  tags: string[];
  src: string;
  images?: string[];
  srcVideo?: string;
};

export type Props = {
  projects: InfiniteProject[];
};

export type PlaneLayout = {
  index: number;
  x: number;
  width: number;
  height: number;
  copy: number;
};

export type ActivePlane = {
  index: number;
  copy: number;
};

export type ProjectMedia =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string };

export type PlaneStart = {
  index: number;
  copy: number;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
  pointer: THREE.Vector2;
  motion: THREE.Vector2;
  hover: number;
  edgeBend: number;
  title: TitleSnapshot;
};

export type TitleSnapshot = {
  x: number;
  y: number;
  font: number;
  width: number;
  yaw: number;
  pitch: number;
};
