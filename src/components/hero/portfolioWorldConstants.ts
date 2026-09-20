export const WORLD_BG_COLOR =
  "#181c14";

export const WORLD_TEXT_COLOR =
  "#e8e3dc";

export const WORLD_ACCENT_COLOR =
  "#ecdfcc";

export const WORLD_PANEL_COLOR =
  "#232622";

export const WORLD_RADIUS =
  8;

export const WORLD_SECTION_STEP =
  (Math.PI * 2) / 6;

export const WORLD_SECTIONS = [
  {
    id: "rustam",
    label: "Rustam Kerimov",
    angle:
      WORLD_SECTION_STEP * 0,
  },

  {
    id: "visual",
    label: "Visual Identities",
    angle:
      WORLD_SECTION_STEP * 1,
  },

  {
    id: "posters",
    label: "Poster Design",
    angle:
      WORLD_SECTION_STEP * 2,
  },

  {
    id: "animation",
    label: "Animations",
    angle:
      WORLD_SECTION_STEP * 3,
  },

   {
    id: "typography",
    label: "Typography",
    angle: WORLD_SECTION_STEP * 4,
  },

  {
    id: "all-projects",
    label: "All Projects",
    angle:
      WORLD_SECTION_STEP * 5,
  },
] as const;

export const WORLD_SECTION_COUNT =
  WORLD_SECTIONS.length;

/*
 * Beholder gamle imports kompatible.
 */
export {
  ALL_PROJECT_IMAGE_PATHS,
  ANIMATION_VIDEO,
  LOGO_IMAGE_PATHS,
  POSTER_IMAGE_PATHS,
  RUSTAM_IMAGE,
  VISUAL_IMAGE_PATHS,
} from "./portfolioWorldAssets";