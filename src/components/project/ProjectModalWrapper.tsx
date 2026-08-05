"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

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
      if (event.key !== "Escape") {
        return;
      }

      setActiveIndex(null);
      setHoveredIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useLayoutEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscrollBehavior = html.style.overscrollBehavior;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscrollBehavior;

      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscrollBehavior;

      body.style.paddingRight = "";
    };
  }, [activeIndex]);

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
