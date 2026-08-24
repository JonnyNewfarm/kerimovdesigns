"use client";

import ProjectDescription from "./ProjectDescription";
import ProjectGalleryItem from "./ProjectGalleryItem";
import ProjectVideo from "./ProjectVideo";

import type {
  ImageDimensions,
  ImageDimensionsMap,
  Project,
} from "./projectTypes";

import { imageLayouts } from "./projectUtils";

type ProjectGalleryDesktopProps = {
  project: Project;
  images: string[];

  activeIndex: number | null;
  hoveredIndex: number | null;

  imageDimensions: ImageDimensionsMap;

  onHoverAction: (index: number | null) => void;
  onOpenImageAction: (index: number) => void;
  onImageLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

export default function ProjectGalleryDesktop({
  project,
  images,
  activeIndex,
  hoveredIndex,
  imageDimensions,
  onHoverAction,
  onOpenImageAction,
  onImageLoadAction,
}: ProjectGalleryDesktopProps) {
  return (
    <div
      className="
        relative
        left-1/2
        w-screen
        -translate-x-1/2
        overflow-hidden
      "
    >
      <div
        className="
          mb-20
          mt-28
          flex
          min-h-[70vh]
          w-full
          flex-col
          gap-y-32
          px-8

          lg:mt-32
        "
      >
        {images.map((src, index) => {
          const isActive = activeIndex === index;
          const isLoaded = Boolean(imageDimensions[index]);

          const shouldFade =
            (hoveredIndex !== null && hoveredIndex !== index) ||
            (activeIndex !== null && activeIndex !== index);

          const layout = imageLayouts[index % imageLayouts.length];

          return (
            <div key={`${src}-${index}`}>
              <ProjectGalleryItem
                src={src}
                index={index}
                title={project.title}
                layout={layout}
                dimensions={imageDimensions[index]}
                isActive={isActive}
                isLoaded={isLoaded}
                shouldFade={shouldFade}
                onHoverAction={onHoverAction}
                onOpenAction={onOpenImageAction}
                onLoadAction={onImageLoadAction}
              />

              {index === 0 ? (
                <ProjectDescription
                  title={project.title}
                  description={project.description}
                />
              ) : null}
            </div>
          );
        })}

        {project.srcVideo ? (
          <ProjectVideo
            src={project.srcVideo}
            poster={project.src}
            variant="desktop"
          />
        ) : null}
      </div>
    </div>
  );
}
