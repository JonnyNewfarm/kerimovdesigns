"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { motion, useTransform } from "framer-motion";

import MagneticComp from "@/components/MagneticComp";
import TransitionLink from "@/components/TransitionLink";

import { BASE_HEIGHT, BASE_WIDTH, PANEL_POSITIONS } from "./projectLayouts";

import type { DesktopProjectItemProps } from "./projectTypes";

import {
  formatProjectNumber,
  formatTags,
  formatTools,
  getSafeDesktopLeft,
} from "./projectutils";

const DesktopProjectItem = memo(function DesktopProjectItem({
  project,
  index,
  left,
  top,
  baseScale,
  drift,
  driftDirection,
  scrollYProgress,
  isActive,
  isDimmed,
  onHoverChange,
}: DesktopProjectItemProps) {
  const tools = formatTools(project.tools);
  const tags = formatTags(project.tags);
  const projectNumber = formatProjectNumber(index);

  const panelPosition = PANEL_POSITIONS[index] ?? "rightOfCard";

  const automaticPanelTop = baseScale < 0.7 ? 105 : baseScale < 0.8 ? 54 : 12;

  const panelTop = automaticPanelTop;

  const automaticPanelGap = baseScale < 0.7 ? 10 : baseScale < 0.8 ? 18 : 32;

  const panelGap = automaticPanelGap;

  const visualImageEdge = (BASE_WIDTH * (1 + baseScale)) / 2;

  const panelOffset = visualImageEdge + panelGap;

  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [drift * driftDirection, drift * driftDirection * -1],
  );

  const handlePointerEnter = useCallback(() => {
    onHoverChange(project.id);
  }, [onHoverChange, project.id]);

  const handlePointerLeave = useCallback(() => {
    onHoverChange(null);
  }, [onHoverChange]);

  const displayedScale = isDimmed ? baseScale * 0.965 : baseScale;

  const renderedImageWidth = Math.ceil(BASE_WIDTH * baseScale);

  return (
    <motion.div
      className="absolute"
      style={{
        top,
        left: getSafeDesktopLeft(left, baseScale),
      }}
    >
      <motion.div
        style={{
          y: driftY,
        }}
      >
        <MagneticComp>
          <div
            className="group relative"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          >
            <TransitionLink
              href={`/project/${project.id}`}
              transitionLabel={project.title}
              className="block"
            >
              <div
                className="
                  transition-[transform,opacity,filter]
                  duration-[350ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                "
                style={{
                  transform: `scale(${displayedScale})`,
                  transformOrigin: "center center",
                  opacity: isDimmed ? 0.5 : 1,
                }}
              >
                <div
                  className="
                    translate-y-0
                    transition-transform
                    duration-[350ms]
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:-translate-y-2
                  "
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: BASE_WIDTH,
                      height: BASE_HEIGHT,
                    }}
                  >
                    <div
                      className="
                        h-full
                        w-full
                        scale-100
                        transition-transform
                        duration-[450ms]
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:scale-[1.025]
                      "
                    >
                      <Image
                        fill
                        src={project.src}
                        alt={project.title}
                        className="object-cover"
                        sizes={`${renderedImageWidth}px`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span
                    className="
                      text-2xl
                      uppercase
                      
                      leading-none
                      tracking-[-0.08em]
                      text-color
                    "
                  >
                    {projectNumber}
                  </span>
                  <span className="text-2xl">/</span>

                  <span
                    className="
                      text-2xl
                      font-bold
                      uppercase
                      tracking-[-0.025em]
                      text-color/70
                    "
                  >
                    {project.title}
                  </span>
                </div>
              </div>
            </TransitionLink>

            {isActive && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  pointer-events-auto
                  absolute
                  z-50
                  w-[280px]
                  ${panelPosition === "leftOfCard" ? "text-right" : ""}
                `}
                style={{
                  top: panelTop,

                  right: panelPosition === "leftOfCard" ? panelOffset : "auto",

                  left: panelPosition === "rightOfCard" ? panelOffset : "auto",

                  transformOrigin:
                    panelPosition === "leftOfCard" ? "right top" : "left top",
                }}
              >
                <div className="space-y-2">
                  <div>
                    <p
                      className="
                      pt-1
                        text-md
                        uppercase
                        font-black
                        tracking-[0.-0.022em]
                        text-color/40
                      "
                    >
                      Project Details
                    </p>
                  </div>

                  <div className="h-px w-full bg-color/20" />

                  <div className="space-y-2">
                    <p className="font-semibold">TAGS:</p>

                    {tags.length > 0 && (
                      <div className="space-y-1">
                        {tags.map((tag) => (
                          <TransitionLink
                            key={tag.slug}
                            href={`/projects?tags=${encodeURIComponent(
                              tag.slug,
                            )}`}
                            transitionLabel={tag.label}
                            className={`
                              block
                              w-fit
                              text-[13px]
                              uppercase
                              tracking-[0.18em]
                              text-color/55
                              underline-offset-4
                              transition-colors
                              hover:text-color
                              hover:underline

                              ${panelPosition === "leftOfCard" ? "ml-auto" : ""}
                            `}
                          >
                            {tag.label}
                          </TransitionLink>
                        ))}
                      </div>
                    )}

                    <p className="font-semibold">YEAR:</p>

                    {project.type && (
                      <p
                        className="
                          text-[13px]
                          uppercase
                          tracking-[0.18em]
                          text-color/55
                        "
                      >
                        {project.type}
                      </p>
                    )}

                    <p className="font-semibold">TOOLS:</p>

                    {tools && (
                      <p
                        className="
                          text-[13px]
                          uppercase
                          leading-6
                          tracking-[0.18em]
                          text-color/55
                        "
                      >
                        {tools}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </MagneticComp>
      </motion.div>
    </motion.div>
  );
});

export default DesktopProjectItem;
