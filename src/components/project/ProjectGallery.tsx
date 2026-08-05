"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import ProjectDescription from "./ProjectDescription";
import ProjectGalleryItem from "./ProjectGalleryItem";

import type {
  ImageDimensions,
  ImageDimensionsMap,
  LoadedImages,
  Project,
} from "./projectTypes";

import { imageLayouts } from "./projectUtils";

type ProjectGalleryProps = {
  project: Project;
  images: string[];
  activeIndex: number | null;
  hoveredIndex: number | null;
  loadedImages: LoadedImages;
  imageDimensions: ImageDimensionsMap;
  onHoverAction: (index: number | null) => void;
  onOpenImageAction: (index: number) => void;
  onImageLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

const videoEase = [0.76, 0, 0.24, 1] as const;

export default function ProjectGallery({
  project,
  images,
  activeIndex,
  hoveredIndex,
  loadedImages,
  imageDimensions,
  onHoverAction,
  onOpenImageAction,
  onImageLoadAction,
}: ProjectGalleryProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const toggleVideo = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch {
      setIsVideoPlaying(false);
    }
  };

  const showPauseIcon = isVideoPlaying && isVideoHovered;

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
          sm:mt-28
          sm:gap-y-32
          sm:px-8
          lg:mt-32
        "
      >
        {images.map((src, index) => {
          const isActive = activeIndex === index;
          const isLoaded = Boolean(loadedImages[index]);

          const shouldBlur =
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
                shouldBlur={shouldBlur}
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
          <div
            className="
              flex
              w-full
              justify-center
              lg:justify-start
            "
          >
            <div
              className="
                w-full
                max-w-[520px]
                lg:max-w-[680px]
                lg:translate-x-20
              "
            >
              <h2
                className="
                  mb-2
                  text-xl
                  font-black
                  uppercase
                "
              >
                Video
              </h2>

              <button
                type="button"
                aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                onClick={toggleVideo}
                onMouseEnter={() => {
                  setIsVideoHovered(true);
                }}
                onMouseLeave={() => {
                  setIsVideoHovered(false);
                }}
                className="
                  relative
                  block
                  w-full
                  cursor-pointer
                  overflow-hidden
                  text-left
                "
              >
                <video
                  ref={videoRef}
                  className="
                    pointer-events-none
                    block
                    h-auto
                    w-full
                    select-none
                  "
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  src={project.srcVideo}
                  onPlay={() => {
                    setIsVideoPlaying(true);
                  }}
                  onPause={() => {
                    setIsVideoPlaying(false);
                  }}
                  onEnded={() => {
                    setIsVideoPlaying(false);
                  }}
                />

                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    bottom-4
                    right-4
                    z-10
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    text-white
                    bg-black/40

                    sm:bottom-6
                    sm:right-6
                    sm:h-20
                    sm:w-20
                  "
                >
                  <AnimatePresence initial={false} mode="wait">
                    {showPauseIcon ? (
                      <motion.svg
                        key="pause"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-18 w-18 "
                        initial={{
                          opacity: 0,
                          scale: 0.65,
                          rotate: -12,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.65,
                          rotate: 12,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: videoEase,
                        }}
                      >
                        <path
                          d="M8 5V19"
                          stroke="currentColor"
                          strokeWidth="2"
                        />

                        <path
                          d="M16 5V19"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="play"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-18 w-18"
                        initial={{
                          opacity: 0,
                          scale: 0.65,
                          rotate: -12,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.65,
                          rotate: 12,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: videoEase,
                        }}
                      >
                        <path
                          d="M7 4L18 12L7 20V4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="miter"
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
