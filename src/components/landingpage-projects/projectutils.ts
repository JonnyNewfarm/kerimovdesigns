import {
  BASE_WIDTH,
  DESKTOP_SAFE_PADDING,
  MOBILE_CARD_BASE_HEIGHT,
  MOBILE_CARD_BASE_WIDTH,
  MOBILE_SAFE_PADDING,
} from "./projectLayouts";

import type {
  LayoutItem,
  MobileLayoutItem,
  ProjectListItem,
} from "./projectTypes";

export function formatTags(tags: ProjectListItem["tags"]) {
  if (!tags) {
    return [];
  }

  const tagList = Array.isArray(tags) ? tags : [tags];

  return tagList.map((tag) => {
    const slug = tag.trim();

    return {
      slug,
      label: slug.replaceAll("-", " "),
    };
  });
}

export function formatTools(tools: ProjectListItem["tools"]) {
  if (!tools) {
    return "";
  }

  if (Array.isArray(tools)) {
    return tools.join(", ");
  }

  return tools;
}

function percentToNumber(percent: string) {
  return Number(percent.replace("%", "")) / 100;
}

function getSafeLeft(
  left: string,
  elementWidth: number,
  safePadding: number,
) {
  const leftPercent = percentToNumber(left);

  return `clamp(
    ${safePadding}px,
    calc(${leftPercent} * (100vw - ${elementWidth}px)),
    calc(100vw - ${elementWidth}px - ${safePadding}px)
  )`;
}

export function getSafeDesktopLeft(
  left: string,
  baseScale: number,
) {
  return getSafeLeft(
    left,
    BASE_WIDTH * baseScale,
    DESKTOP_SAFE_PADDING,
  );
}

export function getSafeMobileLeft(
  left: string,
  baseScale: number,
) {
  return getSafeLeft(
    left,
    MOBILE_CARD_BASE_WIDTH * baseScale,
    MOBILE_SAFE_PADDING,
  );
}

export function getMobileCardWidth(baseScale: number) {
  return MOBILE_CARD_BASE_WIDTH * baseScale;
}

export function getMobileCardHeight(baseScale: number) {
  return MOBILE_CARD_BASE_HEIGHT * baseScale;
}

export function getBreakpointWidth(width: number) {
  if (width >= 1536) {
    return 1536;
  }

  if (width >= 1280) {
    return 1280;
  }

  if (width >= 1024) {
    return 1024;
  }

  if (width >= 768) {
    return 768;
  }

  if (width >= 640) {
    return 640;
  }

  return 0;
}

export function getResponsiveDesktopTop(
  item: LayoutItem,
  width: number,
) {
  if (width >= 1536 && item.top2xl !== undefined) {
    return item.top2xl;
  }

  if (width >= 1280 && item.topXl !== undefined) {
    return item.topXl;
  }

  if (width >= 1024 && item.topLg !== undefined) {
    return item.topLg;
  }

  if (width >= 768 && item.topMd !== undefined) {
    return item.topMd;
  }

  return item.top;
}

export function getResponsiveDesktopLeft(
  item: LayoutItem,
  width: number,
) {
  if (width >= 1536 && item.left2xl !== undefined) {
    return item.left2xl;
  }

  if (width >= 1280 && item.leftXl !== undefined) {
    return item.leftXl;
  }

  if (width >= 1024 && item.leftLg !== undefined) {
    return item.leftLg;
  }

  if (width >= 768 && item.leftMd !== undefined) {
    return item.leftMd;
  }

  return item.left;
}

export function getResponsiveMobileTop(
  item: MobileLayoutItem,
  width: number,
) {
  if (width >= 640 && item.topSm !== undefined) {
    return item.topSm;
  }

  return item.top;
}

export function getResponsiveMobileLeft(
  item: MobileLayoutItem,
  width: number,
) {
  if (width >= 640 && item.leftSm !== undefined) {
    return item.leftSm;
  }

  return item.left;
}

export function getResponsiveMobileScale(
  item: MobileLayoutItem,
  width: number,
) {
  if (width >= 640 && item.scaleSm !== undefined) {
    return item.scaleSm;
  }

  return item.scale;
}

export function formatProjectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}