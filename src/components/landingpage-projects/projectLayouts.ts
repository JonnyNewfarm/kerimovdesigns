import type {
  DesktopLayoutItem,
  MobileLayoutItem,
} from "./projectTypes";

export const BASE_WIDTH = 720;
export const BASE_HEIGHT = 430;

export const MOBILE_CONTAINER_MAX_WIDTH = 430;
export const MOBILE_CARD_BASE_WIDTH = 360;
export const MOBILE_CARD_BASE_HEIGHT = 214;

export const PANEL_POSITIONS = [
  "leftOfCard",
  "leftOfCard",
  "rightOfCard",
  "leftOfCard",
  "leftOfCard",
  "leftOfCard",
] as const;

export const desktopLayout: DesktopLayoutItem[] = [
  {
    align: "right",
    scale: 0.9,
    offsetX: 40,
  },
  {
    align: "right",
    scale: 0.75,
    offsetX: 100,
  },
  {
    align: "center",
    scale: 0.9,
    offsetX: -80,
  },
  {
    align: "right",
    scale: 0.76,
    offsetX: 30,
  },
  {
    align: "center",
    scale: 0.86,
    offsetX: 110,
  },
 
];

export const mobileLayout: MobileLayoutItem[] = [
  {
    align: "left",
    scale: 0.9,
    scaleSm: 1.2,
    offsetX: 0,
  },
  {
    align: "right",
    scale: 0.85,
    scaleSm: 1.1,
    offsetX: 0,
  },
  {
    align: "left",
    scale: 1.1,
    scaleSm: 1.15,
    offsetX: 0,
  },
  {
    align: "right",
    scale: 0.8,
    scaleSm: 1,
    offsetX: 0,
  },
  {
    align: "left",
    scale: 1.05,
    scaleSm: 1.05,
    offsetX: 25,
  },
];