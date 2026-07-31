export const HERO_BG_COLOR = "#181c14";
export const SATOSHI_FONT_FAMILY = "Satoshi";

export const SHADER_SPEED = 1.15;
export const SHADER_MOVEMENT = 0.65;
export const SHADER_WARP = 0.095;
export const SHADER_DISPLACEMENT = 0.018;

export const CUBE_SIZE = 2.3;
export const CUBE_HALF = CUBE_SIZE / 2;

export const FACE_OVERLAY_OFFSET = 0.016;
export const FACE_OVERLAY_POSITION =
  CUBE_HALF + FACE_OVERLAY_OFFSET;

export const VIDEO_OVERLAY_POSITION =
  CUBE_HALF + FACE_OVERLAY_OFFSET + 0.002;

export const FACE_OVERLAY_SIZE = 2.08;

/*
 * Klikkbart ABOUT-område på top face.
 * Verdiene følger plasseringen i createTopTextTexture.
 */
export const ABOUT_LINK_CANVAS_SIZE = 1024;

export const ABOUT_LINK_X = 105;
export const ABOUT_LINK_Y = 45;
export const ABOUT_LINK_WIDTH = 95;
export const ABOUT_LINK_HEIGHT = 390;

export const ABOUT_LINK_PLANE_WIDTH =
  (ABOUT_LINK_WIDTH / ABOUT_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ABOUT_LINK_PLANE_HEIGHT =
  (ABOUT_LINK_HEIGHT / ABOUT_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ABOUT_LINK_CENTER_X =
  ((ABOUT_LINK_X + ABOUT_LINK_WIDTH / 2) /
    ABOUT_LINK_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

export const ABOUT_LINK_CENTER_Y =
  (0.5 -
    (ABOUT_LINK_Y + ABOUT_LINK_HEIGHT / 2) /
      ABOUT_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const CLIENT_WORK_LINK_CANVAS_SIZE = 1024;

export const CLIENT_WORK_LINK_X = 65;
export const CLIENT_WORK_LINK_Y = 775;
export const CLIENT_WORK_LINK_WIDTH = 670;
export const CLIENT_WORK_LINK_HEIGHT = 150;

export const CLIENT_WORK_LINK_PLANE_WIDTH =
  (CLIENT_WORK_LINK_WIDTH /
    CLIENT_WORK_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const CLIENT_WORK_LINK_PLANE_HEIGHT =
  (CLIENT_WORK_LINK_HEIGHT /
    CLIENT_WORK_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const CLIENT_WORK_LINK_CENTER_X =
  ((CLIENT_WORK_LINK_X +
    CLIENT_WORK_LINK_WIDTH / 2) /
    CLIENT_WORK_LINK_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

export const CLIENT_WORK_LINK_CENTER_Y =
  (0.5 -
    (CLIENT_WORK_LINK_Y +
      CLIENT_WORK_LINK_HEIGHT / 2) /
      CLIENT_WORK_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const VISUAL_LINK_CANVAS_SIZE = 1024;

export const VISUAL_LINK_X = 245;
export const VISUAL_LINK_Y = 865;
export const VISUAL_LINK_WIDTH = 690;
export const VISUAL_LINK_HEIGHT = 105;

export const VISUAL_LINK_PLANE_WIDTH =
  (VISUAL_LINK_WIDTH / VISUAL_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const VISUAL_LINK_PLANE_HEIGHT =
  (VISUAL_LINK_HEIGHT /
    VISUAL_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const VISUAL_LINK_CENTER_X =
  ((VISUAL_LINK_X + VISUAL_LINK_WIDTH / 2) /
    VISUAL_LINK_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

export const VISUAL_LINK_CENTER_Y =
  (0.5 -
    (VISUAL_LINK_Y + VISUAL_LINK_HEIGHT / 2) /
      VISUAL_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ANIMATION_LINK_CANVAS_SIZE = 1024;

export const ANIMATION_LINK_X = 45;
export const ANIMATION_LINK_Y = 50;
export const ANIMATION_LINK_WIDTH = 600;
export const ANIMATION_LINK_HEIGHT = 165;

export const ANIMATION_LINK_PLANE_WIDTH =
  (ANIMATION_LINK_WIDTH /
    ANIMATION_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ANIMATION_LINK_PLANE_HEIGHT =
  (ANIMATION_LINK_HEIGHT /
    ANIMATION_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ANIMATION_LINK_CENTER_X =
  ((ANIMATION_LINK_X +
    ANIMATION_LINK_WIDTH / 2) /
    ANIMATION_LINK_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

export const ANIMATION_LINK_CENTER_Y =
  (0.5 -
    (ANIMATION_LINK_Y +
      ANIMATION_LINK_HEIGHT / 2) /
      ANIMATION_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const LOGO_LINK_CANVAS_SIZE = 1024;

export const LOGO_LINK_X = 65;
export const LOGO_LINK_Y = 360;
export const LOGO_LINK_WIDTH = 500;
export const LOGO_LINK_HEIGHT = 125;

export const LOGO_LINK_PLANE_WIDTH =
  (LOGO_LINK_WIDTH / LOGO_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const LOGO_LINK_PLANE_HEIGHT =
  (LOGO_LINK_HEIGHT / LOGO_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const LOGO_LINK_CENTER_X =
  ((LOGO_LINK_X + LOGO_LINK_WIDTH / 2) /
    LOGO_LINK_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

export const LOGO_LINK_CENTER_Y =
  (0.5 -
    (LOGO_LINK_Y + LOGO_LINK_HEIGHT / 2) /
      LOGO_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const cubeProjects: {
  title: string;
  subtitle: string;
  images: string[];
}[] = [
  {
    title: "Rustam Kerimov",
    subtitle: "Graphic Designer",
    images: ["cube-img/rk-portrait-05.jpg"],
  },
  {
    title: "Echo Festival",
    subtitle: "Gradient Shader",
    images: [],
  },
  {
    title: "i-D Magazine",
    subtitle: "Gradient Shader",
    images: [],
  },
  {
    title: "Art Exhibition",
    subtitle: "Gradient Shader",
    images: [],
  },
  {
    title: "Drømmenes Melodi",
    subtitle: "Gradient Shader",
    images: [],
  },
  {
    title: "Maltesers Package",
    subtitle: "Gradient Shader",
    images: [],
  },
];

export const logoImagePaths = [
  "/cube-img/logos/logo-1.png",
  "/cube-img//logos/logo-2.png",
  "/cube-img//logos/logo-3.png",
  "/cube-img/logos/logo-4.png",
];

export const visualImagePaths = [
  "/cube-img/cc-11.jpg",
  "/cube-img/cc-07.webp",
  "/cube-img/cc-05.jpeg",
];

export const clientWorkImagePaths = [
  "/cube-img/client-work5.jpg",
  "/cube-img/client-work3.jpg",
];

export type CollageTile = {
  imageSlot: 0 | 1 | 2;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: boolean;
};

export const BOX_FACE_PROJECT_INDEXES = [
  1,
  2,
  3,
  4,
  0,
  5,
];

export const faceCollageLayout: CollageTile[] = [
  {
    imageSlot: 0,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  },
];

export const visualCollageLayout: CollageTile[] = [
  {
    imageSlot: 0,
    x: 0,
    y: -0.54,
    width: 0.5,
    height: 1.36,
  },
  {
    imageSlot: 2,
    x: 0.5,
    y: -0.35,
    width: 0.5,
    height: 1.29,
  },
];