import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { projectLayoutEase } from "./projectAnimations";
import type { ImageDimensions } from "./projectTypes";

type ProjectImageModalProps = {
  title: string;
  activeIndex: number | null;
  src: string | null;
  dimensions?: ImageDimensions;
  onCloseAction: () => void;
};

export default function ProjectImageModal({
  title,
  activeIndex,
  src,
  dimensions,
  onCloseAction,
}: ProjectImageModalProps) {
  return (
    <AnimatePresence mode="sync">
      {activeIndex !== null && src ? (
        <motion.div
          key="fullscreen-image"
          className="
            pointer-events-none
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
          "
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 1,
          }}
        >
          <motion.div
            layoutId={`project-image-${activeIndex}`}
            className="
              pointer-events-auto
              relative
              cursor-pointer
            "
            onClick={onCloseAction}
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
