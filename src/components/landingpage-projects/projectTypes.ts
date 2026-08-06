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

export type DesktopLayoutItem = {
  align: "left" | "center" | "right";
  scale: number;
  offsetX?: number;
};

export type MobileLayoutItem = {
  align: "left" | "right";
  scale: number;
  scaleSm: number ;
  offsetX?: number;
  marginTop?: number;
};

export type DesktopProjectItemProps = {
  project: ProjectListItem;
  index: number;
  align: "left" | "center" | "right";
  offsetX: number;
  baseScale: number;
  isActive: boolean;
  isDimmed: boolean;
  onHoverChange: (projectId: string | null) => void;
};

export type MobileProjectItemProps = {
  project: ProjectListItem;
  index: number;
  align: "left" | "right";
  offsetX: number;
  baseScale: number;
};