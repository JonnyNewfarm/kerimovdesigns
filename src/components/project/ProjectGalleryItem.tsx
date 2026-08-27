"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import MagneticComp from "../MagneticComp";

import { projectEase, projectLayoutEase } from "./projectAnimations";

import type { ImageDimensions, ImageLayout } from "./projectTypes";

type ProjectGalleryItemProps = {
  src: string;
  index: number;
  title: string;
  layout: ImageLayout;
  dimensions?: ImageDimensions;
  isActive: boolean;
  isLoaded: boolean;
  shouldFade: boolean;
  onHoverAction: (index: number | null) => void;
  onOpenAction: (index: number) => void;
  onLoadAction: (index: number, dimensions: ImageDimensions) => void;
};

export default function ProjectGalleryItem({
  src,
  index,
  title,
  layout,
  dimensions,
  isActive,
  isLoaded,
  shouldFade,
  onHoverAction,
  onOpenAction,
  onLoadAction,
}: ProjectGalleryItemProps) {
  const loadImmediately = index <= 1;

  return (
    <div className={`flex w-full ${layout.row}`}>
      <motion.div
        layoutId={`project-image-${index}`}
        className={`
          relative
          w-full
          ${layout.size}
          ${layout.offset}
        `}
        animate={{
          opacity: shouldFade && !isActive ? 0.42 : 1,
        }}
        transition={{
          opacity: {
            duration: 0.25,
            ease: projectEase,
          },
          layout: {
            duration: 0.75,
            ease: projectLayoutEase,
          },
        }}
        style={{
          pointerEvents: isActive ? "none" : "auto",
          visibility: isActive ? "hidden" : "visible",
        }}
      >
        <MagneticComp>
          <div
            className="
              group
              relative
              overflow-hidden
              bg-white/[0.035]
            "
            onMouseEnter={() => {
              onHoverAction(index);
            }}
            onMouseLeave={() => {
              onHoverAction(null);
            }}
          >
            <Image
              unoptimized
              src={src}
              alt={title || `Project Image ${index + 1}`}
              width={dimensions?.width ?? 850}
              height={dimensions?.height ?? 450}
              sizes="
                (max-width: 1024px) 520px,
                680px
              "
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

                ${
                  isLoaded
                    ? "cursor-pointer opacity-100"
                    : "cursor-wait opacity-0"
                }
              `}
              onLoad={(event) => {
                const image = event.currentTarget;

                onLoadAction(index, {
                  width: image.naturalWidth || 850,
                  height: image.naturalHeight || 450,
                });
              }}
              onClick={() => {
                if (!isLoaded) {
                  return;
                }

                onOpenAction(index);
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

            <div
              className="
                pointer-events-none
                absolute
                left-4
                top-4
                opacity-0
                transition
                duration-500
                group-hover:opacity-100
              "
            >
              <span
                className="
                  font-mono
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-white
                  mix-blend-difference
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </MagneticComp>
      </motion.div>
    </div>
  );
}
