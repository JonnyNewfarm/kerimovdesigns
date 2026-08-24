"use client";

import Image from "next/image";

import ProjectDescription from "./ProjectDescription";
import ProjectVideo from "./ProjectVideo";

import type {
  ImageDimensions,
  ImageDimensionsMap,
  Project,
} from "./projectTypes";

type ProjectGalleryMobileProps = {
  project: Project;
  images: string[];
  imageDimensions: ImageDimensionsMap;

  onImageLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

export default function ProjectGalleryMobile({
  project,
  images,
  imageDimensions,
  onImageLoadAction,
}: ProjectGalleryMobileProps) {
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
          mt-20
          flex
          min-h-[70vh]
          w-full
          flex-col
          gap-y-20
          px-4
        "
      >
        {images.map((src, index) => {
          const dimensions = imageDimensions[index];
          const isLoaded = Boolean(dimensions);

          const loadImmediately = index <= 1;

          return (
            <div key={`${src}-${index}`} className="w-full">
              <div className="relative w-full">
                <Image
                  unoptimized
                  src={src}
                  alt={project.title || `Project Image ${index + 1}`}
                  width={dimensions?.width ?? 850}
                  height={dimensions?.height ?? 450}
                  sizes="calc(100vw - 32px)"
                  loading={loadImmediately ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  draggable={false}
                  aria-busy={!isLoaded}
                  className={`
                    block
                    h-auto
                    w-full
                    select-none

                    transition-opacity
                    duration-200
                    ease-[cubic-bezier(0.22,1,0.36,1)]

                    ${isLoaded ? "opacity-100" : "opacity-0"}
                  `}
                  onLoad={(event) => {
                    const image = event.currentTarget;

                    onImageLoadAction(index, {
                      width: image.naturalWidth || 850,
                      height: image.naturalHeight || 450,
                    });
                  }}
                />

                {!isLoaded ? (
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      overflow-hidden
                      bg-white/[0.035]
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-0
                        animate-pulse
                        bg-gradient-to-br
                        from-white/[0.02]
                        via-white/[0.07]
                        to-white/[0.02]
                      "
                    />
                  </div>
                ) : null}
              </div>

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
            variant="mobile"
          />
        ) : null}
      </div>
    </div>
  );
}
