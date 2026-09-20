"use client";

import { useCallback, useMemo, useRef } from "react";

import ProjectDescription from "./ProjectDescription";
import ProjectGalleryItem from "./ProjectGalleryItem";
import ProjectGalleryThreeCanvas, {
  type ProjectGalleryVideoBridge,
} from "./ProjectGalleryThreeCanvas";
import ProjectVideoDesktop from "./ProjectVideoDesktop";

import type {
  ImageDimensions,
  ImageDimensionsMap,
  Project,
} from "./projectTypes";

import { imageLayouts } from "./projectUtils";

type ProjectGalleryDesktopProps = {
  project: Project;

  images: string[];

  imageDimensions: ImageDimensionsMap;

  onImageLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

export default function ProjectGalleryDesktop({
  project,
  images,
  imageDimensions,
  onImageLoadAction,
}: ProjectGalleryDesktopProps) {
  /*
   * =====================================================
   * IMAGE ANCHORS
   * =====================================================
   */

  const anchorsRef = useRef<Array<HTMLDivElement | null>>([]);

  /*
   * =====================================================
   * VIDEO
   * =====================================================
   */

  const videoAnchorRef = useRef<HTMLDivElement | null>(null);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const videoHasStartedRef = useRef(false);

  /*
   * =====================================================
   * REGISTER IMAGE ANCHOR
   * =====================================================
   */

  const handleRegister = useCallback(
    (
      index: number,

      element: HTMLDivElement | null,
    ) => {
      anchorsRef.current[index] = element;
    },
    [],
  );

  /*
   * =====================================================
   * VIDEO BRIDGE
   * =====================================================
   */

  const videoBridge = useMemo<ProjectGalleryVideoBridge | null>(() => {
    if (!project.srcVideo) {
      return null;
    }

    return {
      anchorRef: videoAnchorRef,

      videoRef: videoElementRef,

      hasStartedRef: videoHasStartedRef,

      poster: project.src,
    };
  }, [project.srcVideo, project.src]);

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
      {/*
       * Én Three canvas for:
       *
       * - alle bilder
       * - autoplay-video
       */}
      <ProjectGalleryThreeCanvas
        images={images}
        anchorsRef={anchorsRef}
        video={videoBridge}
      />

      <div
        className="
          relative
          left-1/2
          z-[10]

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
            const isLoaded = Boolean(imageDimensions[index]);

            const layout = imageLayouts[index % imageLayouts.length];

            return (
              <div key={`${src}-${index}`}>
                <ProjectGalleryItem
                  src={src}
                  index={index}
                  title={project.title}
                  layout={layout}
                  dimensions={imageDimensions[index]}
                  isLoaded={isLoaded}
                  onLoadAction={onImageLoadAction}
                  onRegisterAction={handleRegister}
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

          {/*
           * =================================================
           * DESKTOP VIDEO
           *
           * Ingen Video-heading.
           * Ingen play/pause.
           * Ingen spinner.
           *
           * Bare autoplay media-plane.
           * =================================================
           */}

          {project.srcVideo && videoBridge ? (
            <ProjectVideoDesktop
              src={project.srcVideo}
              anchorRef={videoAnchorRef}
              videoRef={videoElementRef}
              hasStartedRef={videoHasStartedRef}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
