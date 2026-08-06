import {
  MOBILE_CARD_BASE_HEIGHT,
  MOBILE_CARD_BASE_WIDTH,
} from "./projectLayouts";

import type { ProjectListItem } from "./projectTypes";

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

  return Array.isArray(tools) ? tools.join(", ") : tools;
}

export function getMobileCardWidth(scale: number) {
  return MOBILE_CARD_BASE_WIDTH * scale;
}

export function getMobileCardHeight(scale: number) {
  return MOBILE_CARD_BASE_HEIGHT * scale;
}

export function formatProjectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}