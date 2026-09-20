"use client";

import { useEffect, useMemo, useState } from "react";

import ProjectGallery from "./ProjectGallery";
import ProjectHeader from "./ProjectHeader";

import type {
  ImageDimensions,
  ImageDimensionsMap,
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
  /*
   * =====================================================
   * IMAGE DIMENSIONS
   * =====================================================
   */

  const [imageDimensions, setImageDimensions] = useState<ImageDimensionsMap>(
    {},
  );

  /*
   * =====================================================
   * PROJECT DATA
   * =====================================================
   */

  const images = useMemo(() => {
    return getProjectImages(project);
  }, [project]);

  const projectTags = useMemo(() => {
    return getProjectTags(project.tags);
  }, [project.tags]);

  const imageCount = images.length;

  const videoCount = project.srcVideo ? 1 : 0;

  /*
   * =====================================================
   * PRELOAD IMAGES
   * =====================================================
   */

  useEffect(() => {
    if (images.length <= 2) {
      return;
    }

    const preloaders = images.slice(2).map((src) => {
      const image = new window.Image();

      image.decoding = "async";

      image.fetchPriority = "low";

      image.src = src;

      return image;
    });

    return () => {
      preloaders.forEach((image) => {
        image.onload = null;

        image.onerror = null;
      });
    };
  }, [images]);

  /*
   * =====================================================
   * IMAGE LOADED
   * =====================================================
   */

  const handleImageLoad = (index: number, dimensions: ImageDimensions) => {
    setImageDimensions((previous) => {
      const current = previous[index];

      /*
       * Ikke trigger unødvendig
       * state update dersom dimensions
       * allerede er riktige.
       */
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
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
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
        imageDimensions={imageDimensions}
        onImageLoadAction={handleImageLoad}
      />
    </>
  );
}
