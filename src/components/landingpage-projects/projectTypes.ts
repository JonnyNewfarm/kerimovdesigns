import type { MotionValue } from "framer-motion";

export type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  type: string | null;
  tools: string[] | string | null;
  tags?: string | string[] | null;
  createdAt?: Date;
};

export type LandingPageProjectsProps = {
  projects: ProjectListItem[];
};

export type LayoutItem = {
  left: string;
  leftMd?: string;
  leftLg?: string;
  leftXl?: string;
  left2xl?: string;

  top: number;
  topMd?: number;
  topLg?: number;
  topXl?: number;
  top2xl?: number;

  scale: number;
  drift: number;
  driftDirection: 1 | -1;
};

export type MobileLayoutItem = {
  left: string;
  leftSm?: string;

  top: number;
  topSm?: number;

  scale: number;
  scaleSm?: number;

  drift: number;
  driftDirection: 1 | -1;
};

export type LayoutMode = "desktop" | "mobile" | null;

export type DesktopProjectItemProps = {
  project: ProjectListItem;
  index: number;
  left: string;
  top: number;
  baseScale: number;
  drift: number;
  driftDirection: 1 | -1;
  scrollYProgress: MotionValue<number>;
  isActive: boolean;
  isDimmed: boolean;
  onHoverChange: (projectId: string | null) => void;
};

export type MobileProjectItemProps = {
  project: ProjectListItem;
  index: number;
  left: string;
  top: number;
  baseScale: number;
  drift: number;
  driftDirection: 1 | -1;
  scrollYProgress: MotionValue<number>;
};