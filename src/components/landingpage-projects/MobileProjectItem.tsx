"use client";

import Image from "next/image";
import { memo } from "react";

import TransitionLink from "@/components/TransitionLink";

import type { MobileProjectItemProps } from "./projectTypes";

import { formatProjectNumber, getMobileCardWidth } from "./projectutils";

const MobileProjectItem = memo(function MobileProjectItem({
  project,
  index,
  align,
  baseScale,
  offsetX,
}: MobileProjectItemProps) {
  const projectNumber = formatProjectNumber(index);
  const cardWidth = getMobileCardWidth(baseScale);

  return (
    <div
      className={`
        flex
        w-full
        ${align === "right" ? "justify-end" : "justify-start"}
      `}
      style={{
        paddingLeft: align === "left" ? offsetX : 0,
        paddingRight: align === "right" ? offsetX : 0,
      }}
    >
      <div
        style={{
          width: cardWidth,
        }}
      >
        <TransitionLink
          href={`/project/${project.id}`}
          transitionLabel={project.title}
          className="block"
        >
          <div className="relative aspect-[360/214] overflow-hidden">
            <Image
              fill
              src={project.src}
              alt={project.title}
              className="object-cover"
              sizes={`${Math.ceil(cardWidth)}px`}
            />
          </div>

          <p
            className="
              mt-4
              text-[15px]
              font-semibold
              uppercase
              leading-none
              tracking-[0.22em]
              text-color
            "
          >
            {projectNumber} — {project.title}
          </p>
        </TransitionLink>
      </div>
    </div>
  );
});

export default MobileProjectItem;
