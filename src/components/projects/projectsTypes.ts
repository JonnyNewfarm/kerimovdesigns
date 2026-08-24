import type { ReactNode } from "react";

export type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  type: string | null;
  tools: string | null;
  hoverText: string | null;
  
  tags: string[];
  createdAt?: Date;
  description?: string | null;
};

export type ProjectsTableProps = {
  projects: ProjectListItem[];
  children?: ReactNode;
  startIndex: number;
  availableTags?: string[];
  activeTags?: string[];
};