"use client";

import Image from "next/image";
import { memo } from "react";
import { motion, useTransform } from "framer-motion";

import TransitionLink from "@/components/TransitionLink";

import type { MobileProjectItemProps } from "./projectTypes";

import {
  formatProjectNumber,
  getMobileCardHeight,
  getMobileCardWidth,
  getSafeMobileLeft,
} from "./projectutils";

const MobileProjectItem = memo(function MobileProjectItem({
  project,
  index,
  left,
  top,
  baseScale,
  drift,
  driftDirection,
  scrollYProgress,
}: MobileProjectItemProps) {
  const projectNumber = formatProjectNumber(index);

  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [drift * driftDirection, drift * driftDirection * -1],
  );

  const cardWidth = getMobileCardWidth(baseScale);
  const cardHeight = getMobileCardHeight(baseScale);

  const renderedImageWidth = Math.ceil(cardWidth);

  return (
    <div
      className="absolute"
      style={{
        top,
        left: getSafeMobileLeft(left, baseScale),
      }}
    >
      <motion.div
        style={{
          y: driftY,
        }}
      >
        <TransitionLink
          href={`/project/${project.id}`}
          transitionLabel={project.title}
          className="block"
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: cardWidth,
              height: cardHeight,
            }}
          >
            <Image
              fill
              src={project.src}
              alt={project.title}
              className="object-cover"
              sizes={`${renderedImageWidth}px`}
            />
          </div>

          <div className="mt-4">
            <p
              className="
                text-[15px]
                uppercase
                font-semibold
                tracking-[0.22em]
                text-color
              "
            >
              {projectNumber} - {project.title}
            </p>
          </div>
        </TransitionLink>
      </motion.div>
    </div>
  );
});

export default MobileProjectItem;
