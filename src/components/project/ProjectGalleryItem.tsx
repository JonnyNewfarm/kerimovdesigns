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
  shouldBlur: boolean;
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
  shouldBlur,
  onHoverAction,
  onOpenAction,
  onLoadAction,
}: ProjectGalleryItemProps) {
  const imageNumber = String(index + 1).padStart(2, "0");

  return (
    <div className={`flex w-full ${layout.row}`}>
      <MagneticComp>
        <motion.div
          layoutId={`project-image-${index}`}
          className={`
            group
            relative
            w-full
            ${layout.size}
            ${layout.offset}
          `}
          onMouseEnter={() => {
            if (!isActive) {
              onHoverAction(index);
            }
          }}
          onMouseLeave={() => {
            if (!isActive) {
              onHoverAction(null);
            }
          }}
          animate={{
            opacity: shouldBlur && !isActive ? 0.45 : 1,
          }}
          style={{
            pointerEvents: isActive ? "none" : "auto",

            visibility: isActive ? "hidden" : "visible",
          }}
          transition={{
            opacity: {
              duration: 0.35,
              ease: projectEase,
            },

            layout: {
              duration: 0.75,
              ease: projectLayoutEase,
            },
          }}
        >
          <motion.div
            className="relative"
            animate={{
              filter:
                shouldBlur && !isActive
                  ? "blur(clamp(2px, 0.5vw, 5px))"
                  : "blur(0px)",
            }}
            transition={{
              duration: 0.35,
              ease: projectEase,
            }}
          >
            <Image
              unoptimized
              src={src}
              alt={title || `Project Image ${index + 1}`}
              width={dimensions?.width || 850}
              height={dimensions?.height || 450}
              sizes="(max-width: 768px) 80vw, 520px"
              priority={index === 0}
              className={`
                h-auto
                w-full
                transition-opacity
                duration-700
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
                onOpenAction(index);
              }}
            />

            {!isLoaded ? (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  overflow-hidden
                  bg-white/[0.035]
                "
                aria-hidden="true"
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

                <span
                  className="
                    absolute
                    left-3
                    top-3
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    text-white/30
                    sm:left-4
                    sm:top-4
                    sm:text-[10px]
                  "
                >
                  {imageNumber}
                </span>
              </div>
            ) : null}
          </motion.div>

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
              {imageNumber}
            </span>
          </div>
        </motion.div>
      </MagneticComp>
    </div>
  );
}
