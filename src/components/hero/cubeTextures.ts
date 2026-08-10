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
    posterCollageLayout,

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

  /*
   * MAIN TEXT
   */
  const lines = [
    "RUSTAM KERIMOV",
    "GRAPHIC DESIGNER",
    "OSLO / NORWAY",
  ];

  const x = -size / 2 + 56;
  const startY = -110;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e8e3dc";

  ctx.font = `900 86px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  lines.forEach((line, index) => {
    ctx.fillText(
      line,
      x,
      startY + index * 105,
    );
  });

  /*
   * CONTACT BUTTON
   * samme styling som VISUAL IDENTITIES
   */
  const contactText = "CONTACT";
  const contactY = size / 2 - 145;

  ctx.font = `900 64px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const contactTextWidth =
    ctx.measureText(contactText).width;

  const buttonPaddingLeft = 40;
  const buttonPaddingRight = 40;
  const buttonHeight = 135;

  const arrowGap = 26;
  const arrowWidth = 82;

  const buttonWidth =
    buttonPaddingLeft +
    contactTextWidth +
    arrowGap +
    arrowWidth +
    buttonPaddingRight;

  const buttonX = x;

  const buttonY =
    contactY - buttonHeight / 2;

    

  /*
   * BUTTON BACKGROUND
   */
  ctx.fillStyle = "#1e211d";

  ctx.fillRect(
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight,
  );

    ctx.strokeStyle = "#ecdfcc";
ctx.lineWidth = 3;

ctx.strokeRect(
  buttonX,
  buttonY,
  buttonWidth,
  buttonHeight,
);
  /*
   * BUTTON TEXT
   */
  ctx.fillStyle = "#ecdfcc";

  ctx.fillText(
    contactText,
    buttonX + buttonPaddingLeft,
    contactY,
  );

  /*
   * BUTTON ARROW
   */
  const arrowStartX =
    buttonX +
    buttonPaddingLeft +
    contactTextWidth +
    arrowGap;

  const arrowY = contactY;

  const arrowEndX =
    arrowStartX + arrowWidth;

  ctx.beginPath();

  ctx.moveTo(
    arrowStartX,
    arrowY,
  );

  ctx.lineTo(
    arrowEndX,
    arrowY,
  );

  ctx.lineTo(
    arrowEndX - 24,
    arrowY - 20,
  );

  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 8;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  /*
   * CORNER LABEL
   */
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

  /*
   * TEXTURE
   */
  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function createVisualIdentityTexture(
  textures: Texture[],
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

  /*
   * TOP LABEL: I DESIGN
   * ingen bg / ingen border
   */
  const topLabelText = "I DESIGN";
  const topLabelX = padding;
  const topLabelY = 100;

  ctx.font = `900 67px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e8e3dc";

  ctx.fillText(
    topLabelText,
    topLabelX,
    topLabelY,
  );

  /*
   * COLLAGE
   */
  const collageX = padding;
  const collageY = 410;

  const collageWidth =
    size - padding * 2;

  const collageHeight = 480;
  const gap = 22;

  visualCollageLayout.forEach((tile) => {
    const texture =
      textures[tile.imageSlot];

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
      tile.x === 0
        ? 0
        : gap / 2;

    const insetTop =
      tile.y === 0
        ? 0
        : gap / 2;

    const insetRight =
      tile.x + tile.width >= 1
        ? 0
        : gap / 2;

    const insetBottom =
      tile.y + tile.height >= 1
        ? 0
        : gap / 2;

    const drawX =
      x + insetLeft;

    const drawY =
      y + insetTop;

    const drawWidth =
      width -
      insetLeft -
      insetRight;

    const drawHeight =
      height -
      insetTop -
      insetBottom;

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

  /*
   * VISUAL IDENTITIES BUTTON
   */
  const visualLinkText =
    "VISUAL IDENTITIES";

  const visualLinkY = 940;

  ctx.font = `900 61px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const visualTextWidth =
    ctx.measureText(visualLinkText).width;

  const buttonPaddingLeft = 38;
  const buttonPaddingRight = 38;
  const buttonHeight = 125;

  const arrowGap = 26;
  const arrowWidth = 82;

  const buttonWidth =
    buttonPaddingLeft +
    visualTextWidth +
    arrowGap +
    arrowWidth +
    buttonPaddingRight;

  const visualLinkX =
    (size - buttonWidth) / 2 + 60;

  const buttonY =
    visualLinkY -
    buttonHeight / 2;

  /*
   * BUTTON BG
   */
  ctx.fillStyle = "#1e211d";

  ctx.fillRect(
    visualLinkX,
    buttonY,
    buttonWidth,
    buttonHeight,
  );

  /*
   * BUTTON BORDER
   */
  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 3;

  ctx.strokeRect(
    visualLinkX,
    buttonY,
    buttonWidth,
    buttonHeight,
  );

  /*
   * BUTTON TEXT
   */
  ctx.fillStyle = "#ecdfcc";

  ctx.fillText(
    visualLinkText,
    visualLinkX + buttonPaddingLeft,
    visualLinkY,
  );

  /*
   * BUTTON ARROW
   */
  const arrowStartX =
    visualLinkX +
    buttonPaddingLeft +
    visualTextWidth +
    arrowGap;

  const arrowY = visualLinkY;

  const arrowEndX =
    arrowStartX + arrowWidth;

  ctx.beginPath();

  ctx.moveTo(
    arrowStartX,
    arrowY,
  );

  ctx.lineTo(
    arrowEndX,
    arrowY,
  );

  ctx.lineTo(
    arrowEndX - 24,
    arrowY - 20,
  );

  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 8;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  /*
   * TEXTURE
   */
  const visualIdentityTexture =
    new CanvasTexture(canvas);

  visualIdentityTexture.colorSpace =
    SRGBColorSpace;

  visualIdentityTexture.needsUpdate =
    true;

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

  /*
   * MAIN TEXT
   */
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#e8e3dc";

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

  /*
   * SMALL LABEL
   */
  ctx.fillStyle = "#e8e3dc";

  ctx.font = `700 45px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.textBaseline = "bottom";

  ctx.fillText(
    "VIDEO / LOOP / TYPE",
    padding,
    418,
  );

  /*
   * ANIMATIONS BUTTON
   * samme styling som VISUAL IDENTITIES
   */
  const animationText = "ANIMATIONS";

  const animationButtonX = 60;
  const animationButtonY = 130;

  ctx.font = `900 64px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const animationTextWidth =
    ctx.measureText(animationText).width;

  const buttonPaddingLeft = 40;
  const buttonPaddingRight = 40;

  const buttonHeight = 130;

  const arrowGap = 26;
  const arrowWidth = 82;

  const buttonWidth =
    buttonPaddingLeft +
    animationTextWidth +
    arrowGap +
    arrowWidth +
    buttonPaddingRight;

  const buttonTop =
    animationButtonY -
    buttonHeight / 2;

  /*
   * BUTTON BG
   */
  ctx.fillStyle = "#1e211d";

  ctx.fillRect(
    animationButtonX,
    buttonTop,
    buttonWidth,
    buttonHeight,
  );

  ctx.strokeStyle = "#ecdfcc";
ctx.lineWidth = 3;

ctx.strokeRect(
  animationButtonX,
  buttonTop,
  buttonWidth,
  buttonHeight,
);

  /*
   * BUTTON TEXT
   */
  ctx.fillStyle = "#ecdfcc";

  ctx.fillText(
    animationText,
    animationButtonX +
      buttonPaddingLeft,
    animationButtonY,
  );

  /*
   * BUTTON ARROW
   */
  const animationArrowStartX =
    animationButtonX +
    buttonPaddingLeft +
    animationTextWidth +
    arrowGap;

  const animationArrowEndX =
    animationArrowStartX +
    arrowWidth;

  ctx.beginPath();

  ctx.moveTo(
    animationArrowStartX,
    animationButtonY,
  );

  ctx.lineTo(
    animationArrowEndX,
    animationButtonY,
  );

  ctx.lineTo(
    animationArrowEndX - 24,
    animationButtonY - 20,
  );

  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 8;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  /*
   * TEXTURE
   */
  const texture =
    new CanvasTexture(canvas);

  texture.colorSpace =
    SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

export function createPosterTexture(
  textures: Texture[],
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

  const padding = 70;
  const paddingTitle = 53;

 
  const topLabelText = "POSTER DESIGN";
  const topLabelX = paddingTitle;
  const topLabelY = 145;

  ctx.font = `900 68px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e8e3dc";

  ctx.fillText(
    topLabelText,
    topLabelX,
    topLabelY,
  );

 
  const collageX = padding;
  const collageY = 410;

  const collageWidth = size - padding * 2;
  const collageHeight = 480;
  const gap = 65;

  posterCollageLayout.forEach((tile) => {
    const texture = textures[tile.imageSlot];

    const image = texture?.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;

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
      tile.x + tile.width >= 1 ? 0 : gap / 2;

    const insetBottom =
      tile.y + tile.height >= 1 ? 0 : gap / 2;

const scale = 1.1;

const originalDrawWidth =
  width - insetLeft - insetRight;

const originalDrawHeight =
  height - insetTop - insetBottom;

const drawWidth =
  originalDrawWidth * scale;

const drawHeight =
  originalDrawHeight * scale;

const drawX =
  x +
  insetLeft +
  (originalDrawWidth - drawWidth) / 2;

const drawY =
  y +
  insetTop +
  (originalDrawHeight - drawHeight) / 2;

drawImageContain(
  ctx,
  image,
  drawX,
  drawY,
  drawWidth,
  drawHeight,
);

 

    drawImageContain(
      ctx,
      image,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
    );
  });


  const linkText = "VIEW POSTERS";
  const linkY = 930;

  ctx.font = `900 61px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const textWidth =
    ctx.measureText(linkText).width;

  const buttonPaddingLeft = 38;
  const buttonPaddingRight = 38;
  const buttonHeight = 125;

  const arrowGap = 26;
  const arrowWidth = 82;

  const buttonWidth =
    buttonPaddingLeft +
    textWidth +
    arrowGap +
    arrowWidth +
    buttonPaddingRight;

  const linkX =
    (size - buttonWidth) / 2 + 133;

  const buttonY =
    linkY - buttonHeight / 2;

  /*
   * BUTTON BG
   */
  ctx.fillStyle = "#1e211d";

  ctx.fillRect(
    linkX,
    buttonY,
    buttonWidth,
    buttonHeight,
  );

  /*
   * BUTTON BORDER
   */
  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 3;

  ctx.strokeRect(
    linkX,
    buttonY,
    buttonWidth,
    buttonHeight,
  );

  /*
   * BUTTON TEXT
   */
  ctx.fillStyle = "#ecdfcc";

  ctx.fillText(
    linkText,
    linkX + buttonPaddingLeft,
    linkY,
  );

  /*
   * BUTTON ARROW
   */
  const arrowStartX =
    linkX +
    buttonPaddingLeft +
    textWidth +
    arrowGap;

  const arrowY = linkY;
  const arrowEndX =
    arrowStartX + arrowWidth;

  ctx.beginPath();

  ctx.moveTo(
    arrowStartX,
    arrowY,
  );

  ctx.lineTo(
    arrowEndX,
    arrowY,
  );

  ctx.lineTo(
    arrowEndX - 24,
    arrowY - 20,
  );

  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 8;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  /*
   * TEXTURE
   */
  const posterTexture =
    new CanvasTexture(canvas);

  posterTexture.colorSpace =
    SRGBColorSpace;

  posterTexture.needsUpdate = true;

  return posterTexture;
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

  /*
   * BUTTON
   * flyttet høyere opp + samme stil som de andre
   */
  const logoButtonText = "LOGO DESIGN";
  const logoButtonX = padding;
  const logoButtonY = 155;

  ctx.font = `900 64px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const logoButtonTextWidth =
    ctx.measureText(logoButtonText).width;

  const buttonPaddingLeft = 40;
  const buttonPaddingRight = 40;
  const buttonHeight = 130;
  const arrowGap = 26;
  const arrowWidth = 82;

  const buttonWidth =
    buttonPaddingLeft +
    logoButtonTextWidth +
    arrowGap +
    arrowWidth +
    buttonPaddingRight;

  const buttonTop =
    logoButtonY - buttonHeight / 2;

  ctx.fillStyle = "#232622";
  ctx.fillRect(
    logoButtonX,
    buttonTop,
    buttonWidth,
    buttonHeight,
  );

  ctx.strokeStyle = "#ecdfcc";
ctx.lineWidth = 3;

ctx.strokeRect(
  logoButtonX,
  buttonTop,
  buttonWidth,
  buttonHeight,
);

  ctx.fillStyle = "#ecdfcc";
  ctx.fillText(
    logoButtonText,
    logoButtonX + buttonPaddingLeft,
    logoButtonY,
  );

  const logoArrowStartX =
    logoButtonX +
    buttonPaddingLeft +
    logoButtonTextWidth +
    arrowGap;

  const logoArrowEndX =
    logoArrowStartX + arrowWidth;

  ctx.beginPath();

  ctx.moveTo(
    logoArrowStartX,
    logoButtonY,
  );

  ctx.lineTo(
    logoArrowEndX,
    logoButtonY,
  );

  ctx.lineTo(
    logoArrowEndX - 24,
    logoButtonY - 20,
  );

  ctx.strokeStyle = "#ecdfcc";
  ctx.lineWidth = 8;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.stroke();

  /*
   * BIG TITLE
   * flyttet nærmere logo-griden
   */
  const titleY = 345;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#e8e3dc";

  ctx.font = `900 96px ${SATOSHI_FONT_FAMILY}, Arial, Helvetica, sans-serif`;

  ctx.fillText(
    "VISUAL MARKS",
    padding,
    titleY,
  );

  /*
   * LOGO AREA
   */
  const logoAreaX = padding;
  const logoAreaY = 470;

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