"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  useRef,
  type MouseEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import { projectLayoutEase } from "./projectAnimations";
import type { ImageDimensions } from "./projectTypes";

type ProjectImageModalProps = {
  title: string;
  activeIndex: number | null;
  src: string | null;
  dimensions?: ImageDimensions;
  onCloseAction: () => void;
};

const CLOSE_ANIMATION_DURATION = 750;

export default function ProjectImageModal({
  title,
  activeIndex,
  src,
  dimensions,
  onCloseAction,
}: ProjectImageModalProps) {
  const isClosingRef = useRef(false);
  const scrollBlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (activeIndex !== null) {
      isClosingRef.current = false;
    }
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (scrollBlockTimeoutRef.current) {
        clearTimeout(scrollBlockTimeoutRef.current);
      }
    };
  }, []);

  const closeImage = () => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    onCloseAction();
  };

  const closeFromScroll = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;

    const blockMomentumScroll = (wheelEvent: WheelEvent) => {
      wheelEvent.preventDefault();
    };

    window.addEventListener("wheel", blockMomentumScroll, {
      passive: false,
      capture: true,
    });

    onCloseAction();

    scrollBlockTimeoutRef.current = setTimeout(() => {
      window.removeEventListener("wheel", blockMomentumScroll, {
        capture: true,
      });

      scrollBlockTimeoutRef.current = null;
    }, CLOSE_ANIMATION_DURATION);
  };

  const handleImageClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    closeImage();
  };

  return (
    <AnimatePresence mode="sync">
      {activeIndex !== null && src ? (
        <motion.div
          key="fullscreen-image"
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen image: ${title}`}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-hidden
            overscroll-none
          "
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          onClick={closeImage}
          onWheel={closeFromScroll}
        >
          <motion.div
            layoutId={`project-image-${activeIndex}`}
            className="
              relative
              cursor-pointer
            "
            onClick={handleImageClick}
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            transition={{
              layout: {
                duration: 0.75,
                ease: projectLayoutEase,
              },
            }}
          >
            <Image
              unoptimized
              src={src}
              alt={title || `Project Image ${activeIndex + 1}`}
              width={dimensions?.width || 850}
              height={dimensions?.height || 450}
              sizes="(max-width: 768px) 90vw, 850px"
              priority
              draggable={false}
              className="
                block
                h-auto
                w-auto
                max-h-[82vh]
                max-w-[78vw]
                select-none
                object-contain
              "
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
