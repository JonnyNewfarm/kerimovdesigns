export const HERO_BG_COLOR = "#181c14";
export const SATOSHI_FONT_FAMILY = "Satoshi";

export const SHADER_SPEED = 1.15;
export const SHADER_MOVEMENT = 0.65;
export const SHADER_WARP = 0.095;
export const SHADER_DISPLACEMENT = 0.018;

export const CUBE_SIZE = 2.3;
export const CUBE_HALF = CUBE_SIZE / 2;

export const FACE_OVERLAY_OFFSET = 0.024;
export const FACE_OVERLAY_POSITION =
  CUBE_HALF + FACE_OVERLAY_OFFSET;

export const VIDEO_OVERLAY_POSITION =
  CUBE_HALF + FACE_OVERLAY_OFFSET + 0.002;

export const FACE_OVERLAY_SIZE = 2.08;



export const ABOUT_LINK_CANVAS_SIZE = 1024;

// CONTACT etter 90deg-rotasjonen i createTopTextTexture
export const ABOUT_LINK_X = 90;
export const ABOUT_LINK_Y = 45;
export const ABOUT_LINK_WIDTH = 120;
export const ABOUT_LINK_HEIGHT = 450;

export const ABOUT_LINK_PLANE_WIDTH =
  (ABOUT_LINK_WIDTH / ABOUT_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ABOUT_LINK_PLANE_HEIGHT =
  (ABOUT_LINK_HEIGHT / ABOUT_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const ABOUT_LINK_CENTER_X =
  (
    (ABOUT_LINK_X + ABOUT_LINK_WIDTH / 2) /
      ABOUT_LINK_CANVAS_SIZE -
    0.5
  ) * FACE_OVERLAY_SIZE;

export const ABOUT_LINK_CENTER_Y =
  (
    0.5 -
    (ABOUT_LINK_Y + ABOUT_LINK_HEIGHT / 2) /
      ABOUT_LINK_CANVAS_SIZE
  ) * FACE_OVERLAY_SIZE;

/*
 * LOGO DESIGN
 *
 * Knappen tegnes nå med:
 * X = 78
 * center Y = 155
 * height = 92
 *
 * Altså top Y = 109.
 */
export const LOGO_LINK_CANVAS_SIZE = 1024;

export const LOGO_LINK_X = 78;
export const LOGO_LINK_Y = 109;
export const LOGO_LINK_WIDTH = 500;
export const LOGO_LINK_HEIGHT = 92;

export const LOGO_LINK_PLANE_WIDTH =
  (LOGO_LINK_WIDTH / LOGO_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const LOGO_LINK_PLANE_HEIGHT =
  (LOGO_LINK_HEIGHT / LOGO_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const LOGO_LINK_CENTER_X =
  (
    (LOGO_LINK_X + LOGO_LINK_WIDTH / 2) /
      LOGO_LINK_CANVAS_SIZE -
    0.5
  ) * FACE_OVERLAY_SIZE;

export const LOGO_LINK_CENTER_Y =
  (
    0.5 -
    (LOGO_LINK_Y + LOGO_LINK_HEIGHT / 2) /
      LOGO_LINK_CANVAS_SIZE
  ) * FACE_OVERLAY_SIZE;

export const POSTER_LINK_CANVAS_SIZE = 1024;

export const POSTER_LINK_X = 245;
export const POSTER_LINK_Y = 865;
export const POSTER_LINK_WIDTH = 440;
export const POSTER_LINK_HEIGHT = 105;

export const POSTER_LINK_PLANE_WIDTH =
  (POSTER_LINK_WIDTH / POSTER_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const POSTER_LINK_PLANE_HEIGHT =
  (POSTER_LINK_HEIGHT / POSTER_LINK_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

export const POSTER_LINK_CENTER_X =
  ((POSTER_LINK_X + POSTER_LINK_WIDTH / 2) /
    POSTER_LINK_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

export const POSTER_LINK_CENTER_Y =
  (0.5 -
    (POSTER_LINK_Y + POSTER_LINK_HEIGHT / 2) /
      POSTER_LINK_CANVAS_SIZE) *
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

export const posterImagePaths = [
  "/poster-9.jpg",
  "/poster-2.jpg",
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

export const posterCollageLayout: CollageTile[] = [
  {
    imageSlot: 0,
    x: 0,
    y: -0.54,
    width: 0.5,
    height: 1.36,
  },
  {
    imageSlot: 1,
    x: 0.5,
    y: -0.35,
    width: 0.5,
    height: 1.29,
  },
];



export type CubeFaceAlignment = {
  name: string;
  top: 0 | 1 | 2 | 3;
};

export const CUBE_FACE_ALIGNMENTS: CubeFaceAlignment[] = [
  {
    name: "right",
    top: 0,
  },
  {
    name: "left",
    top: 0,
  },
  {
    name: "top",
    top: 0,
  },
  {
    name: "bottom",
    top: 0,
  },
  {
    name: "front",
    top: 0,
  },
  {
    name: "back",
    top: 0,
  },
];