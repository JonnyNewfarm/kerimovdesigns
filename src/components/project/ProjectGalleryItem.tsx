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
          opacity: shouldBlur && !isActive ? 0.45 : 1,
        }}
        style={{
          pointerEvents: isActive ? "none" : "auto",
          visibility: isActive ? "hidden" : "visible",
          willChange: "transform",
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
        <MagneticComp>
          <motion.div
            className="group relative w-full"
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
              draggable={false}
              className={`
                h-auto
                w-full
                select-none
                transition-opacity
                duration-300
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
          </motion.div>
        </MagneticComp>
      </motion.div>
    </div>
  );
}
