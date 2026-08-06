import type { LayoutItem, MobileLayoutItem } from "./projectTypes";

export const BASE_WIDTH = 720;
export const BASE_HEIGHT = 430;

export const DESKTOP_SAFE_PADDING = 24;
export const MOBILE_SAFE_PADDING = 16;

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

export const PANEL_TOP_OVERRIDES = [
  null,
  null,
  null,
  null,
  84,
  null,
] as const;

export const PANEL_GAP_OVERRIDES = [
  34,
  null,
  null,
  20,
  30,
  null,
] as const;

export const desktopLayout: LayoutItem[] = [
  {
    left: "74%",
    leftMd: "74%",
    leftLg: "74%",
    leftXl: "84%",
    left2xl: "84%",
    top: 175,
    topMd: 175,
    topLg: 175,
    topXl: 180,
    top2xl: 180,
    scale: 0.9,
    drift: 95,
    driftDirection: -1,
  },
  {
    left: "60%",
    leftMd: "75%",
    leftLg: "75%",
    leftXl: "84%",
    left2xl: "84%",
    top: 550,
    topMd: 550,
    topLg: 550,
    topXl: 560,
    top2xl: 560,
    scale: 0.75,
    drift: 90,
    driftDirection: 1,
  },
  {
    left: "22%",
    leftMd: "22%",
    leftLg: "22%",
    leftXl: "22%",
    left2xl: "22%",
    top: 1100,
    topMd: 1100,
    topLg: 1100,
    topXl: 1100,
    top2xl: 1100,
    scale: 0.9,
    drift: 90,
    driftDirection: -1,
  },
  {
    left: "85%",
    leftMd: "70%",
    leftLg: "70%",
    leftXl: "85%",
    left2xl: "85%",
    top: 1550,
    topMd: 1600,
    topLg: 1550,
    topXl: 1550,
    top2xl: 1550,
    scale: 0.76,
    drift: 95,
    driftDirection: 1,
  },
  {
    left: "55%",
    leftMd: "55%",
    leftLg: "55%",
    leftXl: "55%",
    left2xl: "55%",
    top: 1970,
    topMd: 2020,
    topLg: 1970,
    topXl: 1970,
    top2xl: 1970,
    scale: 0.76,
    drift: 76,
    driftDirection: -1,
  },
  {
    left: "85%",
    leftMd: "85%",
    leftLg: "85%",
    leftXl: "85%",
    left2xl: "85%",
    top: 2500,
    topMd: 2650,
    topLg: 2500,
    topXl: 2500,
    top2xl: 2500,
    scale: 0.9,
    drift: 34,
    driftDirection: 1,
  },
];

export const mobileLayout: MobileLayoutItem[] = [
  {
    left: "5%",
    leftSm: "5%",
    top: 135,
    topSm: 120,
    scale: 0.9,
    scaleSm: 1.4,
    drift: 60,
    driftDirection: -1,
  },
  {
    left: "80%",
    leftSm: "80%",
    top: 400,
    topSm: 550,
    scale: 0.8,
    scaleSm: 1.1,
    drift: 60,
    driftDirection: 1,
  },
  {
    left: "10%",
    leftSm: "10%",
    top: 780,
    topSm: 950,
    scale: 0.96,
    scaleSm: 0.96,
    drift: 60,
    driftDirection: -1,
  },
  {
    left: "67%",
    leftSm: "67%",
    top: 1150,
    topSm: 1300,
    scale: 0.85,
    scaleSm: 1.3,
    drift: 55,
    driftDirection: 1,
  },
  {
    left: "18%",
    leftSm: "18%",
    top: 1470,
    topSm: 1640,
    scale: 0.7,
    scaleSm: 0.9,
    drift: 40,
    driftDirection: -1,
  },
  {
    left: "70%",
    leftSm: "70%",
    top: 1800,
    topSm: 1950,
    scale: 0.9,
    scaleSm: 1.2,
    drift: 40,
    driftDirection: 1,
  },
];