import {
  CanvasTexture,
  SRGBColorSpace,
  Texture,
} from "three";

import {
  HERO_BG_COLOR,
  SATOSHI_FONT_FAMILY,
  type CollageTile,
  visualCollageLayout,
} from "./cubeConstants";

export function drawImageCover(
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

  if (!imageWidth || !imageHeight) {
    return;
  }

  ctx.save();

  if (rotate) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(Math.PI / 2);

    drawImageCover(
      ctx,
      image,
      -height / 2,
      -width / 2,
      height,
      width,
      false,
    );

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

export function drawImageContain(
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

  if (!imageWidth || !imageHeight) {
    return;
  }

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

  ctx.drawImage(
    image,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );
}

export function createCollageTexture(
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

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = HERO_BG_COLOR;
  ctx.fillRect(0, 0, size, size);

  tiles.forEach((tile) => {
    const texture = textures[tile.imageSlot];

    const image = texture?.image as
      | HTMLImageElement
      | HTMLCanvasElement;

    if (!image) {
      return;
    }

    const x = tile.x * size;
    const y = tile.y * size;
    const width = tile.width * size;
    const height = tile.height * size;

    const insetLeft = x === 0 ? 0 : gap / 2;
    const insetTop = y === 0 ? 0 : gap / 2;

    const insetRight =
      x + width >= size ? 0 : gap / 2;

    const insetBottom =
      y + height >= size ? 0 : gap / 2;

    const drawX = x + insetLeft;
    const drawY = y + insetTop;

    const drawWidth =
      width - insetLeft - insetRight;

    const drawHeight =
      height - insetTop - insetBottom;

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

export async function loadSatoshiFont() {
  if (typeof document === "undefined") {
    return;
  }

  try {
    await document.fonts.load(
      `900 100px ${SATOSHI_FONT_FAMILY}`,
    );

    await document.fonts.ready;

    if (
      document.fonts.check(
        `900 100px ${SATOSHI_FONT_FAMILY}`,
      )
    ) {
      return;
    }
  } catch {
    // Fallback below.
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

      if (
        document.fonts.check(
          `900 100px ${SATOSHI_FONT_FAMILY}`,
        )
      ) {
        return;
      }
    } catch {
      // Try next font file.
    }
  }
}

export function createTopTextTexture() {
  const size = 1024;

  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, size, size);

  ctx.save();

  ctx.translate(size / 2, size / 2);
  ctx.rotate(Math.PI / 2);

  const lines = [
    "RUSTAM KERIMOV",
    "GRAPHIC DESIGNER",
    "OSLO / NORWAY",
  ];

  const bottomLine =
    "VISUAL IDENTITY / LOGOS / ANIMATION";

  const x = -size / 2 + 56;
  const startY = -110;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  ctx.font = `900 86px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  lines.forEach((line, index) => {
    ctx.fillText(
      line,
      x,
      startY + index * 105,
    );
  });

  const aboutY = size / 2 - 145;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  ctx.font = `900 60px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText("CONTACT", x, aboutY);

  const contactTextWidth =
    ctx.measureText("CONTACT").width;

  const arrowStartX =
    x + contactTextWidth + 42;

  const arrowEndX = arrowStartX + 105;

  ctx.beginPath();

  ctx.moveTo(arrowStartX, aboutY);
  ctx.lineTo(arrowEndX, aboutY);
  ctx.lineTo(
    arrowEndX - 28,
    aboutY - 23,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  ctx.textBaseline = "bottom";

  const cornerOffset = 42;

  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle =
    "rgba(255, 255, 255, 0.82)";

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

export function createVisualIdentityTexture(
  textures: Texture[],
  logoTexture?: Texture,
) {
  const size = 1024;

  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, size, size);

  const padding = 78;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#f2eee8";

  ctx.font = `900 57px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText("I DESIGN", padding, 74);

  ctx.fillStyle = "#ffffff";

  ctx.font = `900 63px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  const visualLinkX = 250;
  const visualLinkY = 898;
  const visualLinkText =
    "VISUAL IDENTITIES";

  ctx.fillText(
    visualLinkText,
    visualLinkX,
    visualLinkY,
  );

  const visualTextWidth =
    ctx.measureText(visualLinkText).width;

  const visualArrowStartX =
    visualLinkX + visualTextWidth + 24;

  const visualArrowY = visualLinkY + 32;

  const visualArrowEndX =
    visualArrowStartX + 82;

  ctx.beginPath();

  ctx.moveTo(
    visualArrowStartX,
    visualArrowY,
  );

  ctx.lineTo(
    visualArrowEndX,
    visualArrowY,
  );

  ctx.lineTo(
    visualArrowEndX - 24,
    visualArrowY - 20,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  const collageX = padding;
  const collageY = 410;

  const collageWidth =
    size - padding * 2;

  const collageHeight = 480;
  const gap = 22;

  visualCollageLayout.forEach((tile) => {
    const texture = textures[tile.imageSlot];

    const image = texture?.image as
      | HTMLImageElement
      | HTMLCanvasElement;

    if (!image) {
      return;
    }

    const x =
      collageX +
      tile.x * collageWidth;

    const y =
      collageY +
      tile.y * collageHeight;

    const width =
      tile.width * collageWidth;

    const height =
      tile.height * collageHeight;

    const insetLeft =
      tile.x === 0 ? 0 : gap / 2;

    const insetTop =
      tile.y === 0 ? 0 : gap / 2;

    const insetRight =
      tile.x + tile.width >= 1
        ? 0
        : gap / 2;

    const insetBottom =
      tile.y + tile.height >= 1
        ? 0
        : gap / 2;

    const drawX = x + insetLeft;
    const drawY = y + insetTop;

    const drawWidth =
      width - insetLeft - insetRight;

    const drawHeight =
      height - insetTop - insetBottom;

    drawImageCover(
      ctx,
      image,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      false,
    );
  });

  const visualIdentityTexture =
    new CanvasTexture(canvas);

  visualIdentityTexture.colorSpace =
    SRGBColorSpace;

  visualIdentityTexture.needsUpdate = true;

  return visualIdentityTexture;
}

export function createMovingGraphicsTextTexture() {
  const size = 1024;

  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, size, size);

  const padding = 48;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";

  ctx.font = `900 85px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(
    "MOTION AS A",
    padding,
    430,
  );

  ctx.fillText(
    "VISUAL LANGUAGE",
    padding,
    525,
  );

  ctx.fillStyle = "#ffffff";

  ctx.font = `700 45px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.textBaseline = "bottom";

  ctx.fillText(
    "VIDEO / LOOP / TYPE",
    padding,
    418,
  );

  const animationTextX = 60;
  const animationArrowY = 130;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  ctx.font = `900 60px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(
    "ANIMATIONS",
    animationTextX,
    animationArrowY,
  );

  const animationTextWidth =
    ctx.measureText("ANIMATIONS").width;

  const animationArrowStartX =
    animationTextX +
    animationTextWidth +
    28;

  const animationArrowEndX =
    animationArrowStartX + 105;

  ctx.beginPath();

  ctx.moveTo(
    animationArrowStartX,
    animationArrowY,
  );

  ctx.lineTo(
    animationArrowEndX,
    animationArrowY,
  );

  ctx.lineTo(
    animationArrowEndX - 28,
    animationArrowY - 23,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  ctx.font = `900 60px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.beginPath();

  ctx.moveTo(
    animationArrowStartX,
    animationArrowY,
  );

  ctx.lineTo(
    animationArrowEndX,
    animationArrowY,
  );

  ctx.lineTo(
    animationArrowEndX - 28,
    animationArrowY - 23,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    animationArrowStartX,
    animationArrowY,
  );

  ctx.lineTo(
    animationArrowEndX,
    animationArrowY,
  );

  ctx.lineTo(
    animationArrowEndX - 28,
    animationArrowY - 23,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function createClientWorkTexture(
  textures: Texture[],
) {
  const size = 1024;

  const canvas =
    document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, size, size);

  const padding = 68;
  const gap = 24;

  const firstTexture = textures[0];
  const secondTexture = textures[1];

  const firstImage = firstTexture?.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | undefined;

  const secondImage =
    secondTexture?.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;

  /*
   * Første bilde er nesten kvadratisk og får derfor
   * den største flaten til venstre.
   */
  const firstImageX = padding;
  const firstImageY = padding;
  const firstImageWidth = 575;
  const firstImageHeight = 575;

  /*
   * Andre bilde er portrettformat.
   * Boksen følger omtrent bildets originale ratio.
   */
  const secondImageX =
    firstImageX +
    firstImageWidth +
    gap;

  const secondImageY = padding;

  const secondImageWidth =
    size - secondImageX - padding;

  const secondImageHeight = 405;

  if (firstImage) {
    drawImageCover(
      ctx,
      firstImage,
      firstImageX,
      firstImageY,
      firstImageWidth,
      firstImageHeight,
    );
  }

  if (secondImage) {
    drawImageCover(
      ctx,
      secondImage,
      secondImageX,
      secondImageY,
      secondImageWidth,
      secondImageHeight,
    );
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle =
    "rgba(255, 255, 255, 0.72)";

  ctx.font = `900 30px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(
    "SELECTED COMMERCIAL PROJECTS",
    padding,
    700,
  );

  const linkX = padding;
  const linkY = 835;
  const linkText = "CLIENT WORK";

  ctx.fillStyle = "#ffffff";

  ctx.font = `900 64px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  ctx.fillText(
    linkText,
    linkX,
    linkY,
  );

  const textWidth =
    ctx.measureText(linkText).width;

  const arrowStartX =
    linkX + textWidth + 28;

  const arrowEndX =
    arrowStartX + 105;

  ctx.beginPath();

  ctx.moveTo(arrowStartX, linkY);
  ctx.lineTo(arrowEndX, linkY);

  ctx.lineTo(
    arrowEndX - 28,
    linkY - 23,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  const texture =
    new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function createLogoInspirationTexture(
  textures: Texture[],
) {
  const size = 1024;

  const canvas =
    document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, size, size);

  const padding = 78;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "#f2eee8";

  ctx.font = `900 96px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(
    "VISUAL MARKS",
    padding,
    260,
  );

  const logoLinkX = padding;
  const logoLinkY = 420;
  const logoLinkText = "LOGO DESIGN";

  ctx.fillStyle = "#ffffff";

  ctx.font = `900 58px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  ctx.fillText(
    logoLinkText,
    logoLinkX,
    logoLinkY,
  );

  const logoLinkTextWidth =
    ctx.measureText(logoLinkText).width;

  const logoArrowStartX =
    logoLinkX +
    logoLinkTextWidth +
    28;

  const logoArrowEndX =
    logoArrowStartX + 100;

  ctx.beginPath();

  ctx.moveTo(
    logoArrowStartX,
    logoLinkY,
  );

  ctx.lineTo(
    logoArrowEndX,
    logoLinkY,
  );

  ctx.lineTo(
    logoArrowEndX - 28,
    logoLinkY - 23,
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  const logoAreaX = padding;
  const logoAreaY = 500;

  const logoAreaWidth =
    size - padding * 2;

  const logoAreaHeight = 380;
  const gap = 28;

  const logoBoxWidth =
    (logoAreaWidth - gap) / 2;

  const logoBoxHeight =
    (logoAreaHeight - gap) / 2;

  const logoBoxes = [
    {
      x: logoAreaX,
      y: logoAreaY,
    },
    {
      x:
        logoAreaX +
        logoBoxWidth +
        gap,
      y: logoAreaY,
    },
    {
      x: logoAreaX,
      y:
        logoAreaY +
        logoBoxHeight +
        gap,
    },
    {
      x:
        logoAreaX +
        logoBoxWidth +
        gap,
      y:
        logoAreaY +
        logoBoxHeight +
        gap,
    },
  ];

  logoBoxes.forEach(
    (box, index) => {
      const texture = textures[index];

      const image =
        texture?.image as
          | HTMLImageElement
          | HTMLCanvasElement;

      ctx.fillStyle =
        "rgba(255, 255, 255, 0.06)";

      ctx.fillRect(
        box.x,
        box.y,
        logoBoxWidth,
        logoBoxHeight,
      );

      ctx.strokeStyle =
        "rgba(255, 255, 255, 0.68)";

      ctx.lineWidth = 4;

      ctx.strokeRect(
        box.x,
        box.y,
        logoBoxWidth,
        logoBoxHeight,
      );

      if (!image) {
        return;
      }

      const logoPadding = 28;

      drawImageContain(
        ctx,
        image,
        box.x + logoPadding,
        box.y + logoPadding,
        logoBoxWidth -
          logoPadding * 2,
        logoBoxHeight -
          logoPadding * 2,
      );
    },
  );

  const texture =
    new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function waitForTextureImage(
  texture: Texture,
) {
  const image =
    texture.image as
      | HTMLImageElement
      | undefined;

  if (!image) {
    return Promise.resolve();
  }

  if (
    image.complete &&
    image.naturalWidth > 0
  ) {
    return Promise.resolve();
  }

  if (
    typeof image.decode === "function"
  ) {
    return image
      .decode()
      .catch(() => undefined);
  }

  return new Promise<void>(
    (resolve) => {
      image.onload = () => resolve();
      image.onerror = () => resolve();
    },
  );
}