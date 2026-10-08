import type {
  MutableRefObject,
  RefObject,
} from "react";

export type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

export type SharedPointerRef =
  MutableRefObject<PointerState>;

export type ProjectPreviewVariant =
  | "preview"
  | "card";

export type ProjectPreviewThreeImageProps = {
  src: string;

  hoverColor?: string | null;

  anchorRef: RefObject<HTMLAnchorElement | null>;

  pointerRef?: SharedPointerRef;

  variant?: ProjectPreviewVariant;
};

export type PreviewImagePlaneProps = {
  src: string;

  anchorRef: RefObject<HTMLAnchorElement | null>;

  pointerRef: SharedPointerRef;

  onReady: () => void;
};

export type PreviewHoverLabelProps = {
  anchorRef: RefObject<HTMLAnchorElement | null>;

  pointerRef: SharedPointerRef;

  backgroundColor: string;

  compact?: boolean;
};