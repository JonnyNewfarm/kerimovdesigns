"use client";

import { useEffect, useState } from "react";

import ProjectGalleryDesktop from "./ProjectGalleryDesktop";
import ProjectGalleryMobile from "./ProjectGalleryMobile";

import type {
  ImageDimensions,
  ImageDimensionsMap,
  Project,
} from "./projectTypes";

type ProjectGalleryProps = {
  project: Project;
  images: string[];

  activeIndex: number | null;
  hoveredIndex: number | null;

  imageDimensions: ImageDimensionsMap;

  onHoverAction: (index: number | null) => void;
  onOpenImageAction: (index: number) => void;
  onImageLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

export default function ProjectGallery({
  project,
  images,
  activeIndex,
  hoveredIndex,
  imageDimensions,
  onHoverAction,
  onOpenImageAction,
  onImageLoadAction,
}: ProjectGalleryProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return (
      <ProjectGalleryMobile
        project={project}
        images={images}
        imageDimensions={imageDimensions}
        onImageLoadAction={onImageLoadAction}
      />
    );
  }

  return (
    <ProjectGalleryDesktop
      project={project}
      images={images}
      activeIndex={activeIndex}
      hoveredIndex={hoveredIndex}
      imageDimensions={imageDimensions}
      onHoverAction={onHoverAction}
      onOpenImageAction={onOpenImageAction}
      onImageLoadAction={onImageLoadAction}
    />
  );
}
