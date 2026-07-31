"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGroup } from "framer-motion";

import ProjectGallery from "./ProjectGallery";
import ProjectHeader from "./ProjectHeader";
import ProjectImageModal from "./ProjectImageModal";

import type {
  ImageDimensions,
  ImageDimensionsMap,
  LoadedImages,
  Project,
} from "./projectTypes";

import { getProjectImages, getProjectTags } from "./projectUtils";

export type { Project } from "./projectTypes";

type ProjectModalWrapperProps = {
  project: Project;
};

export default function ProjectModalWrapper({
  project,
}: ProjectModalWrapperProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [loadedImages, setLoadedImages] = useState<LoadedImages>({});

  const [imageDimensions, setImageDimensions] = useState<ImageDimensionsMap>(
    {},
  );

  const images = useMemo(() => {
    return getProjectImages(project);
  }, [project]);

  const projectTags = useMemo(() => {
    return getProjectTags(project.tags);
  }, [project.tags]);

  const imageCount = images.length;

  const videoCount = project.srcVideo ? 1 : 0;

  const activeImage =
    activeIndex !== null ? (images[activeIndex] ?? null) : null;

  const activeDimensions =
    activeIndex !== null ? imageDimensions[activeIndex] : undefined;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        setHoveredIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openImage = (index: number) => {
    const isLoaded = loadedImages[index];

    const dimensions = imageDimensions[index];

    if (!isLoaded || !dimensions) {
      return;
    }

    setHoveredIndex(null);
    setActiveIndex(index);
  };

  const closeImage = () => {
    setActiveIndex(null);
    setHoveredIndex(null);
  };

  const handleImageLoad = (index: number, dimensions: ImageDimensions) => {
    setImageDimensions((previous) => {
      const current = previous[index];

      if (
        current?.width === dimensions.width &&
        current?.height === dimensions.height
      ) {
        return previous;
      }

      return {
        ...previous,
        [index]: dimensions,
      };
    });

    setLoadedImages((previous) => {
      if (previous[index]) {
        return previous;
      }

      return {
        ...previous,
        [index]: true,
      };
    });
  };

  return (
    <LayoutGroup>
      <ProjectHeader
        title={project.title}
        imageCount={imageCount}
        videoCount={videoCount}
        tags={projectTags}
        year={project.type}
        tools={project.tools}
      />

      <ProjectGallery
        project={project}
        images={images}
        activeIndex={activeIndex}
        hoveredIndex={hoveredIndex}
        loadedImages={loadedImages}
        imageDimensions={imageDimensions}
        onHoverAction={setHoveredIndex}
        onOpenImageAction={openImage}
        onImageLoadAction={handleImageLoad}
      />

      <ProjectImageModal
        title={project.title}
        activeIndex={activeIndex}
        src={activeImage}
        dimensions={activeDimensions}
        onCloseAction={closeImage}
      />
    </LayoutGroup>
  );
}
