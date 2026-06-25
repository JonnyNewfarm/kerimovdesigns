"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import {
  Canvas,
  useFrame,
  useLoader,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  Mesh,
  Group,
  Texture,
  TextureLoader,
  VideoTexture,
  SRGBColorSpace,
  CanvasTexture,
  MathUtils,
  ShaderMaterial,
  MeshBasicMaterial,
  Color,
  Vector2,
} from "three";
import {
  useScroll,
  useSpring,
  useTransform,
  motion,
  MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrbitControls } from "@react-three/drei";
import MagneticComp from "./MagneticComp";
import HeroIntro from "./HeroIntro";
import TextReveal from "@/components/TextReveal";

const ease = [0.22, 1, 0.36, 1] as const;

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    setIsMdUp(mediaQuery.matches);

    function handleChange(e: MediaQueryListEvent) {
      setIsMdUp(e.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMdUp;
}

const HERO_BG_COLOR = "#181c14";
const SATOSHI_FONT_FAMILY = "Satoshi";

const SHADER_SPEED = 1.15;
const SHADER_MOVEMENT = 0.65;
const SHADER_WARP = 0.095;
const SHADER_DISPLACEMENT = 0.018;

const CUBE_SIZE = 2.3;
const CUBE_HALF = CUBE_SIZE / 2;

const FACE_OVERLAY_OFFSET = 0.016;
const FACE_OVERLAY_POSITION = CUBE_HALF + FACE_OVERLAY_OFFSET;
const VIDEO_OVERLAY_POSITION = CUBE_HALF + FACE_OVERLAY_OFFSET + 0.002;

const FACE_OVERLAY_SIZE = 2.08;

const CONTACT_BUTTON_CANVAS_SIZE = 1024;
const CONTACT_BUTTON_X = 78;
const CONTACT_BUTTON_Y = 585;
const CONTACT_BUTTON_WIDTH = 500;
const CONTACT_BUTTON_HEIGHT = 150;

const CONTACT_BUTTON_PLANE_WIDTH =
  (CONTACT_BUTTON_WIDTH / CONTACT_BUTTON_CANVAS_SIZE) * FACE_OVERLAY_SIZE;

const CONTACT_BUTTON_PLANE_HEIGHT =
  (CONTACT_BUTTON_HEIGHT / CONTACT_BUTTON_CANVAS_SIZE) * FACE_OVERLAY_SIZE;

const CONTACT_BUTTON_CENTER_X =
  ((CONTACT_BUTTON_X + CONTACT_BUTTON_WIDTH / 2) / CONTACT_BUTTON_CANVAS_SIZE -
    0.5) *
  FACE_OVERLAY_SIZE;

const CONTACT_BUTTON_CENTER_Y =
  (0.5 -
    (CONTACT_BUTTON_Y + CONTACT_BUTTON_HEIGHT / 2) /
      CONTACT_BUTTON_CANVAS_SIZE) *
  FACE_OVERLAY_SIZE;

const cubeProjects: {
  title: string;
  subtitle: string;
  images: string[];
}[] = [
  {
    title: "Rustam Kerimov",
    subtitle: "Graphic Designer",
    images: [
      "/cube-img/rustam-4.jpg",
      "/cube-img/rustam-3.jpg",
      "/cube-img/rustam-5.jpg",
    ],
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

const logoImagePaths = [
  "/logo-1.png",
  "/logo-2.png",
  "/logo-3.png",
  "/logo-4.png",
];

const visualImagePaths = [
  "/visual-01.jpeg",
  "/visual-02.jpeg",
  "/visual-003.jpeg",
];

type CollageTile = {
  imageSlot: 0 | 1 | 2;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: boolean;
};

/**
 * three.js BoxGeometry material index order:
 * 0 = right side
 * 1 = left side
 * 2 = top
 * 3 = bottom
 * 4 = front
 * 5 = back
 */
const BOX_FACE_PROJECT_INDEXES = [1, 2, 3, 4, 0, 5];

const RUSTAM_FACE_MATERIAL_INDEX = BOX_FACE_PROJECT_INDEXES.findIndex(
  (projectIndex) => projectIndex === 0,
);

const faceCollageLayout: CollageTile[] = [
  { imageSlot: 0, x: 0, y: 0, width: 0.62, height: 1 },
  { imageSlot: 1, x: 0.62, y: 0, width: 0.38, height: 0.46 },
  { imageSlot: 2, x: 0.62, y: 0.46, width: 0.38, height: 0.54 },
];

const visualCollageLayout: CollageTile[] = [
  { imageSlot: 0, x: 0, y: -0.12, width: 1, height: 0.68 },
  { imageSlot: 1, x: 0, y: 0.58, width: 0.5, height: 0.62 },
  { imageSlot: 2, x: 0.5, y: 0.58, width: 0.5, height: 0.62 },
];

const gradientVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform float uTime;
  uniform float uHover;
  uniform float uDisplacement;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 transformed = position;

    float slowWave =
      sin(position.x * 3.1 + uTime * 0.95) *
      cos(position.y * 2.8 + uTime * 0.82);

    float fabricWave =
      sin((position.x * 1.4 - position.y * 1.8) * 5.0 + uTime * 1.15);

    float detailWave =
      sin((position.x + position.y) * 6.5 + uTime * 1.35);

    float displacement =
      (
        slowWave * uDisplacement +
        fabricWave * 0.005 +
        detailWave * 0.004
      ) * (0.45 + uHover * 0.45);

    transformed += normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const gradientFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;

  uniform float uTime;
  uniform float uHover;
  uniform float uSpeed;
  uniform float uMovement;
  uniform float uWarp;
  uniform vec2 uMouse;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
      (c - a) * u.y * (1.0 - u.x) +
      (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.55;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(st);
      st *= 1.92;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;

    float time = uTime * uSpeed;

    /*
      Ekte gradient-follow:
      uMouse flytter selve UV/gradient-flowen.
      Dette tegner IKKE en sirkel eller spotlight oppå gradienten.
    */
    vec2 mouseOffset = (uMouse - vec2(0.5)) * uHover;

    vec2 animatedUv = uv;

    /*
      Flytter hele gradientfeltet etter musa.
      Øk 0.42 hvis du vil at gradienten skal følge mer.
      Senk 0.42 hvis det blir for mye.
    */
    animatedUv -= mouseOffset * 0.42;

    animatedUv.x += sin(
      (uv.y + mouseOffset.y * 1.8) * 4.8 + time * 0.95
    ) * uWarp;

    animatedUv.y += cos(
      (uv.x + mouseOffset.x * 1.8) * 4.4 + time * 0.82
    ) * uWarp;

    vec2 silkUv = animatedUv;

    silkUv.x += sin(
      (animatedUv.y + animatedUv.x * 0.35 + mouseOffset.x * 0.85) * 7.0 +
      time * 0.75
    ) * 0.045;

    silkUv.y += cos(
      (animatedUv.x - animatedUv.y * 0.25 + mouseOffset.y * 0.85) * 6.5 -
      time * 0.62
    ) * 0.038;

    vec2 flowUv = silkUv * 1.75;

    /*
      Flytter noise/flowen etter musa også.
      Dette gjør at selve gradientbevegelsen føles dratt av cursoren.
    */
    flowUv += mouseOffset * 1.35;

    flowUv += vec2(
      sin(time * 0.42),
      cos(time * 0.36)
    ) * uMovement;

    float n1 = fbm(flowUv + vec2(time * 0.08, -time * 0.04));
    float n2 = fbm(flowUv * 1.65 - vec2(time * 0.12, time * 0.08));
    float n3 = fbm(flowUv * 2.45 + vec2(n1, n2) + time * 0.12);

    float sweepOne =
      smoothstep(0.02, 0.95, silkUv.x + n1 * 0.42);

    float sweepTwo =
      smoothstep(0.04, 0.98, silkUv.y + n2 * 0.38);

    float diagonalSweep =
      smoothstep(
        0.0,
        1.0,
        silkUv.x * 0.58 + silkUv.y * 0.42 + n3 * 0.28
      );

    float movingLight =
      sin((silkUv.x * 3.2 + silkUv.y * 2.4) + time * 1.15 + n3 * 2.2) * 0.5 + 0.5;

    movingLight = smoothstep(0.25, 0.95, movingLight);

    vec3 color = mix(uColorA, uColorB, sweepOne);
    color = mix(color, uColorC, sweepTwo * 0.5);
    color = mix(color, uColorD, diagonalSweep * 0.42);

    vec3 liftedColor = color + uColorC * 0.16;
    color = mix(color, liftedColor, movingLight * 0.22);

    float shadowVeil = fbm(silkUv * 3.4 - time * 0.08);
    color = mix(color * 0.88, color * 1.08, shadowVeil * 0.55);

    /*
      Vanlig statisk center glow.
      Denne følger ikke musa, så den lager ikke fake cursor-sirkel.
    */
    float centerGlow = 1.0 - distance(uv, vec2(0.5));
    centerGlow = smoothstep(0.12, 0.86, centerGlow);

    color = mix(color * 0.82, color * 1.08, centerGlow);

    float vignette =
      smoothstep(0.0, 0.22, uv.x) *
      smoothstep(0.0, 0.22, uv.y) *
      smoothstep(0.0, 0.22, 1.0 - uv.x) *
      smoothstep(0.0, 0.22, 1.0 - uv.y);

    color *= mix(0.72, 1.08, vignette);

    float grain = random(uv * 2.2 + time * 0.025);
    color += (grain - 0.5) * 0.012;

    color = mix(color, color * 1.12, uHover * 0.18);

    color = pow(color, vec3(0.94));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const gradientPalettes: Record<
  number,
  {
    colorA: string;
    colorB: string;
    colorC: string;
    colorD: string;
  }
> = {
  1: {
    colorA: "#d9ded6",
    colorB: "#aab6aa",
    colorC: "#f1f4ee",
    colorD: "#5f6b60",
  },
  2: {
    colorA: "#d7d4cc",
    colorB: "#aeb6b0",
    colorC: "#eef0ea",
    colorD: "#6d746f",
  },
  3: {
    colorA: "#d4ddd7",
    colorB: "#9aaea3",
    colorC: "#eef4ef",
    colorD: "#58695f",
  },
  4: {
    colorA: "#d7dfd4",
    colorB: "#a5b49f",
    colorC: "#f0f5ec",
    colorD: "#5b6d58",
  },
  5: {
    colorA: "#ccd8d0",
    colorB: "#8fa092",
    colorC: "#edf3ee",
    colorD: "#526354",
  },
};

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
  rotate = false,
) {
  const imageWidth =
    image instanceof HTMLImageElement
      ? image.naturalWidth || image.width
      : image.width;

  const imageHeight =
    image instanceof HTMLImageElement
      ? image.naturalHeight || image.height
      : image.height;

  if (!imageWidth || !imageHeight) return;

  ctx.save();

  if (rotate) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(Math.PI / 2);

    drawImageCover(ctx, image, -height / 2, -width / 2, height, width, false);

    ctx.restore();
    return;
  }

  const imageRatio = imageWidth / imageHeight;
  const tileRatio = width / height;

  let sourceWidth = imageWidth;
  let sourceHeight = imageHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > tileRatio) {
    sourceWidth = imageHeight * tileRatio;
    sourceX = (imageWidth - sourceWidth) / 2;
  } else {
    sourceHeight = imageWidth / tileRatio;
    sourceY = (imageHeight - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );

  ctx.restore();
}

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const imageWidth =
    image instanceof HTMLImageElement
      ? image.naturalWidth || image.width
      : image.width;

  const imageHeight =
    image instanceof HTMLImageElement
      ? image.naturalHeight || image.height
      : image.height;

  if (!imageWidth || !imageHeight) return;

  const imageRatio = imageWidth / imageHeight;
  const boxRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;

  if (imageRatio > boxRatio) {
    drawHeight = width / imageRatio;
  } else {
    drawWidth = height * imageRatio;
  }

  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function createCollageTexture(
  textures: Texture[],
  tiles: CollageTile[],
  shouldRotateLargeImage = false,
) {
  const size = 512;
  const gap = 18;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = HERO_BG_COLOR;
  ctx.fillRect(0, 0, size, size);

  tiles.forEach((tile) => {
    const texture = textures[tile.imageSlot];
    const image = texture?.image as HTMLImageElement | HTMLCanvasElement;

    if (!image) return;

    const x = tile.x * size;
    const y = tile.y * size;
    const width = tile.width * size;
    const height = tile.height * size;

    const insetLeft = x === 0 ? 0 : gap / 2;
    const insetTop = y === 0 ? 0 : gap / 2;
    const insetRight = x + width >= size ? 0 : gap / 2;
    const insetBottom = y + height >= size ? 0 : gap / 2;

    const drawX = x + insetLeft;
    const drawY = y + insetTop;
    const drawWidth = width - insetLeft - insetRight;
    const drawHeight = height - insetTop - insetBottom;

    const isLargeImage = tile.imageSlot === 0;

    drawImageCover(
      ctx,
      image,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      shouldRotateLargeImage && isLargeImage,
    );
  });

  const collageTexture = new CanvasTexture(canvas);

  collageTexture.colorSpace = SRGBColorSpace;
  collageTexture.needsUpdate = true;

  return collageTexture;
}

async function loadSatoshiFont() {
  if (typeof document === "undefined") return;

  try {
    await document.fonts.load(`900 100px ${SATOSHI_FONT_FAMILY}`);
    await document.fonts.ready;

    if (document.fonts.check(`900 100px ${SATOSHI_FONT_FAMILY}`)) {
      return;
    }
  } catch {
    // fallback below
  }

  const possibleFontFiles = [
    "/fonts/Satoshi-Black.woff2",
    "/fonts/Satoshi-Bold.woff2",
    "/fonts/Satoshi-Variable.woff2",
    "/fonts/Satoshi.woff2",
  ];

  for (const fontPath of possibleFontFiles) {
    try {
      const fontFace = new FontFace(
        SATOSHI_FONT_FAMILY,
        `url(${fontPath}) format("woff2")`,
        {
          weight: "900",
          style: "normal",
          display: "swap",
        },
      );

      const loadedFont = await fontFace.load();
      document.fonts.add(loadedFont);
      await document.fonts.ready;

      if (document.fonts.check(`900 100px ${SATOSHI_FONT_FAMILY}`)) {
        return;
      }
    } catch {
      // try next font
    }
  }
}

function createTopTextTexture() {
  const size = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  ctx.save();

  ctx.translate(size / 2, size / 2);
  ctx.rotate(Math.PI / 2);

  const lines = ["RUSTAM KERIMOV", "GRAPHIC DESIGNER", "OSLO / NORWAY"];
  const bottomLine = "VISUAL IDENTITY / LOGOS / ANIMATION";

  const x = -size / 2 + 56;
  const startY = -110;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 86px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * 105);
  });

  ctx.textBaseline = "bottom";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `900 40px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(bottomLine, x, size / 2 - 42);

  const cornerOffset = 42;

  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.font = `900 35px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(
    "KERIMOV DESIGNS™",
    size / 2 - cornerOffset,
    -size / 2 + cornerOffset,
  );

  ctx.restore();

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createVisualIdentityTexture(
  textures: Texture[],
  logoTexture?: Texture,
) {
  const size = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  const padding = 78;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#f2eee8";
  ctx.font = `900 42px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("VISUAL IDENTITY", padding, padding);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 92px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("I DESIGN", padding, 150);
  ctx.fillText("VISUAL CONCEPTS", padding, 242);

  const logoImage = logoTexture?.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | undefined;

  if (logoImage) {
    const logoBoxSize = 150;
    const logoPadding = 18;
    const cornerOffset = 10;

    const logoBoxX = size - logoBoxSize - cornerOffset;
    const logoBoxY = cornerOffset;

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.68)";
    ctx.lineWidth = 2;
    ctx.strokeRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);

    drawImageContain(
      ctx,
      logoImage,
      logoBoxX + logoPadding,
      logoBoxY + logoPadding,
      logoBoxSize - logoPadding * 2,
      logoBoxSize - logoPadding * 2,
    );
  }

  const collageX = padding;
  const collageY = 410;
  const collageWidth = size - padding * 2;
  const collageHeight = 480;
  const gap = 22;

  visualCollageLayout.forEach((tile) => {
    const texture = textures[tile.imageSlot];
    const image = texture?.image as HTMLImageElement | HTMLCanvasElement;

    if (!image) return;

    const x = collageX + tile.x * collageWidth;
    const y = collageY + tile.y * collageHeight;
    const width = tile.width * collageWidth;
    const height = tile.height * collageHeight;

    const insetLeft = tile.x === 0 ? 0 : gap / 2;
    const insetTop = tile.y === 0 ? 0 : gap / 2;
    const insetRight = tile.x + tile.width >= 1 ? 0 : gap / 2;
    const insetBottom = tile.y + tile.height >= 1 ? 0 : gap / 2;

    const drawX = x + insetLeft;
    const drawY = y + insetTop;
    const drawWidth = width - insetLeft - insetRight;
    const drawHeight = height - insetTop - insetBottom;

    drawImageCover(ctx, image, drawX, drawY, drawWidth, drawHeight, false);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);
  });

  const visualIdentityTexture = new CanvasTexture(canvas);

  visualIdentityTexture.colorSpace = SRGBColorSpace;
  visualIdentityTexture.needsUpdate = true;

  return visualIdentityTexture;
}

function createMovingGraphicsTextTexture(logoTexture?: Texture) {
  const size = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  const padding = 78;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#f2eee8";
  ctx.font = `900 42px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("MOTION", padding, padding);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 90px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("DESIGN", padding, 145);
  ctx.fillText("CREATED", padding, 230);
  ctx.fillText("WITH MOTION", padding, 315);
  ctx.fillText("FOR VISUAL IMPACT", padding, 400);

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `700 40px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("VIDEO / LOOP / TYPE", padding, size - padding);
  ctx.textBaseline = "top";

  const logoImage = logoTexture?.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | undefined;

  if (logoImage) {
    const logoBoxSize = 150;
    const logoPadding = 18;
    const cornerOffset = 10;

    const logoBoxX = size - logoBoxSize - cornerOffset;
    const logoBoxY = cornerOffset;

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.68)";
    ctx.lineWidth = 2;
    ctx.strokeRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);

    drawImageContain(
      ctx,
      logoImage,
      logoBoxX + logoPadding,
      logoBoxY + logoPadding,
      logoBoxSize - logoPadding * 2,
      logoBoxSize - logoPadding * 2,
    );
  }

  const videoBoxX = padding;
  const videoBoxY = 540;
  const videoBoxWidth = size - padding * 2;
  const videoBoxHeight = 300;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(videoBoxX, videoBoxY, videoBoxWidth, videoBoxHeight);

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createCollaborateTexture() {
  const size = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  const padding = 78;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#f2eee8";
  ctx.font = `900 42px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("LET'S COLLABORATE", padding, padding);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 88px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  const headlineLines = ["AVAILABLE FOR", "FREELANCE", "WORK"];

  headlineLines.forEach((line, index) => {
    ctx.fillText(line, padding, 150 + index * 92);
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
  ctx.font = `900 34px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("CONTACT FOR PROJECTS", padding, 500);

  const buttonX = padding;
  const buttonY = 585;
  const buttonWidth = 500;
  const buttonHeight = 150;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.lineWidth = 2;
  ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 52px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("GO TO CONTACT", buttonX + 38, buttonY + 50);

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createLogoInspirationTexture(textures: Texture[]) {
  const size = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  const padding = 78;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#f2eee8";
  ctx.font = `900 42px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("LOGOS", padding, padding);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 96px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("VISUAL", padding, 150);
  ctx.fillText("MARKS", padding, 246);

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `700 45px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.fillText("SELECTED LOGO DESIGN", padding, 390);

  const logoAreaX = padding;
  const logoAreaY = 500;
  const logoAreaWidth = size - padding * 2;
  const logoAreaHeight = 380;
  const gap = 28;

  const logoBoxWidth = (logoAreaWidth - gap) / 2;
  const logoBoxHeight = (logoAreaHeight - gap) / 2;

  const logoBoxes = [
    {
      x: logoAreaX,
      y: logoAreaY,
    },
    {
      x: logoAreaX + logoBoxWidth + gap,
      y: logoAreaY,
    },
    {
      x: logoAreaX,
      y: logoAreaY + logoBoxHeight + gap,
    },
    {
      x: logoAreaX + logoBoxWidth + gap,
      y: logoAreaY + logoBoxHeight + gap,
    },
  ];

  logoBoxes.forEach((box, index) => {
    const texture = textures[index];
    const image = texture?.image as HTMLImageElement | HTMLCanvasElement;

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(box.x, box.y, logoBoxWidth, logoBoxHeight);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.68)";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, logoBoxWidth, logoBoxHeight);

    if (!image) return;

    const logoPadding = 28;

    drawImageContain(
      ctx,
      image,
      box.x + logoPadding,
      box.y + logoPadding,
      logoBoxWidth - logoPadding * 2,
      logoBoxHeight - logoPadding * 2,
    );
  });

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function waitForTextureImage(texture: Texture) {
  const image = texture.image as HTMLImageElement | undefined;

  if (!image) return Promise.resolve();

  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  if (typeof image.decode === "function") {
    return image.decode().catch(() => undefined);
  }

  return new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
}

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyTouchAction = document.body.style.touchAction;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscrollBehavior;

      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.touchAction = originalBodyTouchAction;

      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

export default function Index() {
  const container = useRef<HTMLDivElement | null>(null);

  const isMdUp = useIsMdUp();

  const isDraggingCubeRef = useRef(false);

  const [hasMounted, setHasMounted] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);
  const [shouldUseIntro, setShouldUseIntro] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useScrollLock(hasMounted && !introDone);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 4.5]);

  const smoothProgress = useSpring(progress, {
    damping: 20,
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setHasMounted(true);

    const hasSeenIntro = sessionStorage.getItem("hero-intro-seen") === "true";

    if (hasSeenIntro) {
      setShouldUseIntro(false);
      setIntroDone(true);
      setIntroChecked(true);
      return;
    }

    setShouldUseIntro(true);
    setIntroChecked(true);

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("hero-intro-seen", "true");
      setIntroDone(true);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, []);
  return (
    <motion.div
      ref={container}
      className="min-h-[150dvh]"
      initial={false}
      animate={{ opacity: 1 }}
    >
      <div className="sticky top-0 relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden uppercase">
        {introChecked && shouldUseIntro && <HeroIntro isDone={introDone} />}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="relative h-full w-full"
          >
            {hasMounted && introDone && (
              <Canvas
                key="hero-canvas-ready"
                className="h-3/4 w-full"
                dpr={[1, 1.5]}
                frameloop="always"
                gl={{
                  antialias: false,
                  powerPreference: "high-performance",
                }}
              >
                {isMdUp && (
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    enableDamping={true}
                    dampingFactor={0.06}
                    rotateSpeed={0.65}
                    onStart={() => {
                      isDraggingCubeRef.current = true;
                    }}
                    onEnd={() => {
                      isDraggingCubeRef.current = false;
                    }}
                  />
                )}

                <ambientLight intensity={2} />
                <directionalLight position={[2, 1, 1]} />

                <Cube
                  key="cube-ready"
                  scrollProgress={smoothProgress}
                  introDone={introDone}
                  isDraggingCubeRef={isDraggingCubeRef}
                />
              </Canvas>
            )}
          </motion.div>
        </div>
        <motion.div
          initial={false}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.15 : 0,
            ease,
          }}
          className="pointer-events-none absolute bottom-4 z-10 px-4 text-center lg:bottom-11"
        >
          {introDone && (
            <>
              <TextReveal
                as="h1"
                mode="words"
                viewport={false}
                delay={0.05}
                className="-mb-1 text-2xl font-bold text-color sm:text-2xl"
              >
                Rustam Kerimov
              </TextReveal>

              <motion.div
                className="mx-auto mt-1 rounded-3xl bg-stone-500"
                style={{
                  width: lineWidth,
                  height: "2px",
                  originX: 0,
                }}
              />

              <TextReveal
                as="h2"
                mode="words"
                viewport={false}
                delay={0.12}
                className="whitespace-nowrap text-3xl font-extrabold text-color sm:text-4xl"
              >
                Graphic Designer
              </TextReveal>
            </>
          )}
        </motion.div>
        <motion.div
          initial={false}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.25 : 0,
            ease,
          }}
          className="absolute bottom-10 left-10 z-10 hidden px-4 text-left lg:block"
        >
          {introDone && (
            <MagneticComp>
              <Link href="/projects" className="inline-block">
                <TextReveal
                  as="span"
                  mode="words"
                  viewport={false}
                  delay={0.05}
                  className="text-4xl satoshi-black text-color sm:text-4xl"
                >
                  Archives
                </TextReveal>
              </Link>
            </MagneticComp>
          )}
        </motion.div>
        <motion.div
          initial={false}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.9,
            delay: introDone ? 0.3 : 0,
            ease,
          }}
          className="absolute bottom-10 right-10 z-10 hidden px-4 text-left lg:block"
        >
          {introDone && (
            <MagneticComp>
              <Link href="/contact" className="inline-block">
                <TextReveal
                  as="span"
                  mode="words"
                  viewport={false}
                  delay={0.05}
                  className="text-4xl satoshi-black text-color sm:text-4xl"
                >
                  Collaborate
                </TextReveal>
              </Link>
            </MagneticComp>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

const Cube = ({
  scrollProgress,
  introDone,
  isDraggingCubeRef,
}: {
  scrollProgress: MotionValue<number>;
  introDone: boolean;
  isDraggingCubeRef: React.MutableRefObject<boolean>;
}) => {
  const router = useRouter();

  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);

  const shaderMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const rustamMaterialRef = useRef<MeshBasicMaterial | null>(null);

  const hoveredRef = useRef(false);
  const activeMaterialIndexRef = useRef<number | null>(null);
  const targetMouseUvRef = useRef(new Vector2(0.5, 0.5));
  const targetScaleRef = useRef(1);
  const introDoneRef = useRef(introDone);

  const movingVideoTextureRef = useRef<VideoTexture | null>(null);
  const movingVideoElementRef = useRef<HTMLVideoElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [rustamTexture, setRustamTexture] = useState<CanvasTexture | null>(
    null,
  );
  const [topTextTexture, setTopTextTexture] = useState<CanvasTexture | null>(
    null,
  );
  const [visualIdentityTexture, setVisualIdentityTexture] =
    useState<CanvasTexture | null>(null);
  const [movingGraphicsTextTexture, setMovingGraphicsTextTexture] =
    useState<CanvasTexture | null>(null);
  const [movingGraphicsVideoTexture, setMovingGraphicsVideoTexture] =
    useState<VideoTexture | null>(null);
  const [collaborateTexture, setCollaborateTexture] =
    useState<CanvasTexture | null>(null);
  const [logoInspirationTexture, setLogoInspirationTexture] =
    useState<CanvasTexture | null>(null);

  const rustamImagePaths = useMemo(() => cubeProjects[0].images, []);

  const rustamTextures = useLoader(
    TextureLoader,
    rustamImagePaths,
  ) as Texture[];

  const visualTextures = useLoader(
    TextureLoader,
    visualImagePaths,
  ) as Texture[];

  const logoTextures = useLoader(TextureLoader, logoImagePaths) as Texture[];

  useEffect(() => {
    introDoneRef.current = introDone;
  }, [introDone]);

  useEffect(() => {
    let cancelled = false;

    let generatedRustamTexture: CanvasTexture | null = null;

    async function buildRustamTexture() {
      rustamTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await Promise.all(
        rustamTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) return;

      generatedRustamTexture = createCollageTexture(
        rustamTextures,
        faceCollageLayout,
        false,
      );

      if (cancelled) {
        generatedRustamTexture?.dispose();
        return;
      }

      setRustamTexture(generatedRustamTexture);
    }

    buildRustamTexture();

    return () => {
      cancelled = true;
      generatedRustamTexture?.dispose();
    };
  }, [rustamTextures]);

  useEffect(() => {
    let cancelled = false;
    let texture: CanvasTexture | null = null;

    async function buildTopTextTexture() {
      await loadSatoshiFont();

      if (cancelled) return;

      texture = createTopTextTexture();

      if (cancelled) {
        texture?.dispose();
        return;
      }

      setTopTextTexture(texture);
    }

    buildTopTextTexture();

    return () => {
      cancelled = true;
      texture?.dispose();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let generatedVisualIdentityTexture: CanvasTexture | null = null;

    async function buildVisualIdentityTexture() {
      visualTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      logoTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all([
        ...visualTextures.map((texture) => waitForTextureImage(texture)),
        ...logoTextures.map((texture) => waitForTextureImage(texture)),
      ]);

      if (cancelled) return;

      generatedVisualIdentityTexture = createVisualIdentityTexture(
        visualTextures,
        logoTextures[3],
      );

      if (cancelled) {
        generatedVisualIdentityTexture?.dispose();
        return;
      }

      setVisualIdentityTexture(generatedVisualIdentityTexture);
    }

    buildVisualIdentityTexture();

    return () => {
      cancelled = true;
      generatedVisualIdentityTexture?.dispose();
    };
  }, [visualTextures, logoTextures]);

  useEffect(() => {
    let cancelled = false;

    let generatedMovingTexture: CanvasTexture | null = null;
    let generatedCollaborateTexture: CanvasTexture | null = null;

    async function buildCanvasTextures() {
      logoTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all(
        logoTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) return;

      generatedMovingTexture = createMovingGraphicsTextTexture(logoTextures[2]);
      generatedCollaborateTexture = createCollaborateTexture();

      if (cancelled) {
        generatedMovingTexture?.dispose();
        generatedCollaborateTexture?.dispose();
        return;
      }

      setMovingGraphicsTextTexture(generatedMovingTexture);
      setCollaborateTexture(generatedCollaborateTexture);
    }

    buildCanvasTextures();

    return () => {
      cancelled = true;
      generatedMovingTexture?.dispose();
      generatedCollaborateTexture?.dispose();
    };
  }, [logoTextures]);

  useEffect(() => {
    let cancelled = false;
    let generatedLogoTexture: CanvasTexture | null = null;

    async function buildLogoInspirationTexture() {
      logoTextures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      await loadSatoshiFont();

      await Promise.all(
        logoTextures.map((texture) => waitForTextureImage(texture)),
      );

      if (cancelled) return;

      generatedLogoTexture = createLogoInspirationTexture(logoTextures);

      if (cancelled) {
        generatedLogoTexture?.dispose();
        return;
      }

      setLogoInspirationTexture(generatedLogoTexture);
    }

    buildLogoInspirationTexture();

    return () => {
      cancelled = true;
      generatedLogoTexture?.dispose();
    };
  }, [logoTextures]);

  useEffect(() => {
    const video = document.createElement("video");

    video.src = "/bylarm-new.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "metadata";
    video.crossOrigin = "anonymous";

    movingVideoElementRef.current = video;

    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;

    movingVideoTextureRef.current = texture;
    setMovingGraphicsVideoTexture(texture);

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser may delay autoplay until interaction.
      }
    };

    playVideo();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();

      texture.dispose();

      movingVideoElementRef.current = null;
      movingVideoTextureRef.current = null;
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!group.current || !mesh.current) return;

    group.current.position.set(0, 0, 0);
    group.current.rotation.set(0, 0, 0);
    group.current.scale.set(1, 1, 1);

    mesh.current.position.set(0, 0, 0);
    mesh.current.rotation.set(0, 0, 0);
    mesh.current.scale.set(1, 1, 1);

    targetScaleRef.current = 1;
  }, []);

  function updateRustamMaterial() {
    if (!rustamMaterialRef.current || !rustamTexture) {
      return;
    }

    const nextMap = rustamTexture;

    if (rustamMaterialRef.current.map === nextMap) {
      return;
    }

    rustamMaterialRef.current.map = nextMap;
    rustamMaterialRef.current.needsUpdate = true;
  }

  function clearCubeHover() {
    hoveredRef.current = false;
    activeMaterialIndexRef.current = null;

    updateRustamMaterial();
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (!introDoneRef.current) return;

    event.stopPropagation();

    const materialIndex = event.face?.materialIndex ?? null;

    hoveredRef.current = materialIndex !== null;
    activeMaterialIndexRef.current = materialIndex;

    if (!isMobile && event.uv) {
      targetMouseUvRef.current.set(event.uv.x, event.uv.y);
    }

    updateRustamMaterial();
  }

  function handlePointerLeave() {
    clearCubeHover();
  }

  function handleCollaborateClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    document.body.style.cursor = "";

    router.push("/contact");
  }

  function handleCollaboratePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  }

  function handleCollaboratePointerOut(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    document.body.style.cursor = "";
  }

  function handleCollaboratePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  }

  function handleCollaboratePointerUp(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    document.body.style.cursor = "";
  }

  useFrame(({ clock }) => {
    if (!group.current) return;

    const time = clock.getElapsedTime();
    const value = scrollProgress.get();

    shaderMaterials.current.forEach((material, materialIndex) => {
      if (!material) return;

      const isActiveFace =
        !isMobile &&
        hoveredRef.current &&
        introDoneRef.current &&
        activeMaterialIndexRef.current === materialIndex;

      material.uniforms.uTime.value = time;

      material.uniforms.uHover.value = MathUtils.lerp(
        material.uniforms.uHover.value,
        isActiveFace ? 1 : 0,
        0.08,
      );

      if (!isMobile) {
        material.uniforms.uMouse.value.lerp(targetMouseUvRef.current, 0.12);
      } else {
        material.uniforms.uMouse.value.set(0.5, 0.5);
      }
    });

    if (!isDraggingCubeRef.current) {
      group.current.rotation.x = MathUtils.lerp(
        group.current.rotation.x,
        value,
        0.045,
      );

      group.current.rotation.y = MathUtils.lerp(
        group.current.rotation.y,
        value * 1.4,
        0.045,
      );
    }

    if (isMobile) {
      group.current.scale.set(1, 1, 1);
      return;
    }

    const targetScale = hoveredRef.current && introDoneRef.current ? 1.1 : 1;

    targetScaleRef.current += (targetScale - targetScaleRef.current) * 0.1;

    group.current.scale.set(
      targetScaleRef.current,
      targetScaleRef.current,
      targetScaleRef.current,
    );
  });

  if (
    !rustamTexture ||
    !topTextTexture ||
    !visualIdentityTexture ||
    !movingGraphicsTextTexture ||
    !movingGraphicsVideoTexture ||
    !collaborateTexture ||
    !logoInspirationTexture
  ) {
    return null;
  }

  return (
    <group ref={group}>
      {/* TOP FACE */}
      <mesh
        position={[0, FACE_OVERLAY_POSITION, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={30}
        raycast={() => null}
      >
        <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />
        <meshBasicMaterial
          map={topTextTexture}
          transparent
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      {/* BOTTOM FACE: MOTION + VIDEO */}
      <mesh
        position={[0, -FACE_OVERLAY_POSITION, 0]}
        rotation={[Math.PI / 2, 0, Math.PI * 2]}
        renderOrder={30}
        raycast={() => null}
      >
        <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />
        <meshBasicMaterial
          map={movingGraphicsTextTexture}
          transparent
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh
        position={[0, -VIDEO_OVERLAY_POSITION, -0.36]}
        rotation={[Math.PI / 2, 0, Math.PI * 2]}
        renderOrder={28}
        raycast={() => null}
      >
        <planeGeometry args={[1.72, 0.66]} />
        <meshBasicMaterial
          map={movingGraphicsVideoTexture}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* LEFT FACE: VISUAL IDENTITY */}
      <mesh
        position={[-FACE_OVERLAY_POSITION, 0, 0]}
        rotation={[0, -Math.PI / 2, -Math.PI]}
        renderOrder={30}
        raycast={() => null}
      >
        <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />
        <meshBasicMaterial
          map={visualIdentityTexture}
          transparent
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      {/* RIGHT FACE: COLLABORATE */}
      <group
        position={[FACE_OVERLAY_POSITION, 0, 0]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
      >
        <mesh renderOrder={30} raycast={() => null}>
          <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />
          <meshBasicMaterial
            map={collaborateTexture}
            transparent
            depthWrite={false}
            depthTest={true}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          position={[CONTACT_BUTTON_CENTER_X, CONTACT_BUTTON_CENTER_Y, 0.01]}
          renderOrder={40}
          onClick={handleCollaborateClick}
          onPointerOver={handleCollaboratePointerOver}
          onPointerOut={handleCollaboratePointerOut}
          onPointerDown={handleCollaboratePointerDown}
          onPointerUp={handleCollaboratePointerUp}
        >
          <planeGeometry
            args={[CONTACT_BUTTON_PLANE_WIDTH, CONTACT_BUTTON_PLANE_HEIGHT]}
          />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* BACK FACE: LOGOS */}
      <mesh
        position={[0, 0, -FACE_OVERLAY_POSITION]}
        rotation={[0, Math.PI, 0]}
        renderOrder={30}
        raycast={() => null}
      >
        <planeGeometry args={[FACE_OVERLAY_SIZE, FACE_OVERLAY_SIZE]} />
        <meshBasicMaterial
          map={logoInspirationTexture}
          transparent
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh
        ref={mesh}
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />

        {BOX_FACE_PROJECT_INDEXES.map((projectIndex, materialIndex) => {
          const isRustam = projectIndex === 0;

          if (isRustam) {
            return (
              <meshBasicMaterial
                key={materialIndex}
                ref={rustamMaterialRef}
                attach={`material-${materialIndex}`}
                map={rustamTexture}
                toneMapped={false}
              />
            );
          }

          const palette = gradientPalettes[projectIndex];

          return (
            <shaderMaterial
              key={materialIndex}
              ref={(material) => {
                shaderMaterials.current[materialIndex] = material;
              }}
              attach={`material-${materialIndex}`}
              vertexShader={gradientVertexShader}
              fragmentShader={gradientFragmentShader}
              uniforms={{
                uTime: { value: 0 },
                uHover: { value: 0 },
                uMouse: { value: new Vector2(0.5, 0.5) },

                uSpeed: { value: SHADER_SPEED },
                uMovement: { value: SHADER_MOVEMENT },
                uWarp: { value: SHADER_WARP },
                uDisplacement: { value: SHADER_DISPLACEMENT },

                uColorA: { value: new Color(palette.colorA) },
                uColorB: { value: new Color(palette.colorB) },
                uColorC: { value: new Color(palette.colorC) },
                uColorD: { value: new Color(palette.colorD) },
              }}
              toneMapped={false}
              onBeforeRender={() => {
                const material = shaderMaterials.current[materialIndex];

                if (!material) return;

                const time = performance.now() * 0.001;

                const isActiveFace =
                  !isMobile &&
                  hoveredRef.current &&
                  introDoneRef.current &&
                  activeMaterialIndexRef.current === materialIndex;

                material.uniforms.uTime.value = time;

                material.uniforms.uHover.value = MathUtils.lerp(
                  material.uniforms.uHover.value,
                  isActiveFace ? 1 : 0,
                  0.08,
                );

                if (!isMobile) {
                  material.uniforms.uMouse.value.lerp(
                    targetMouseUvRef.current,
                    0.12,
                  );
                } else {
                  material.uniforms.uMouse.value.set(0.5, 0.5);
                }
              }}
            />
          );
        })}
      </mesh>
    </group>
  );
};
