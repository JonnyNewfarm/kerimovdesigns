"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LinkReveal from "@/components/LinkReveal";
import MagneticComp from "@/components/MagneticComp";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "@/components/TransitionLink";

import { BASE_HEIGHT, BASE_WIDTH, PANEL_POSITIONS } from "./projectLayouts";

import type { DesktopProjectItemProps } from "./projectTypes";

import { formatProjectNumber, formatTags, formatTools } from "./projectutils";

const revealDuration = 0.65;

const DesktopProjectItem = memo(function DesktopProjectItem({
  project,
  index,
  align,
  offsetX,
  baseScale,
  isActive,
  isDimmed,
  onHoverChange,
}: DesktopProjectItemProps) {
  const tools = formatTools(project.tools);
  const tags = formatTags(project.tags);
  const projectNumber = formatProjectNumber(index);

  const panelPosition = PANEL_POSITIONS[index] ?? "rightOfCard";

  const panelTop = baseScale < 0.7 ? 105 : baseScale < 0.8 ? 54 : 12;

  const panelGap = baseScale < 0.7 ? 10 : baseScale < 0.8 ? 18 : 32;

  const visualImageEdge = (BASE_WIDTH * (1 + baseScale)) / 2;

  const panelOffset = visualImageEdge + panelGap;

  const handlePointerEnter = useCallback(() => {
    onHoverChange(project.id);
  }, [onHoverChange, project.id]);

  const handlePointerLeave = useCallback(() => {
    onHoverChange(null);
  }, [onHoverChange]);

  const displayedScale = isDimmed ? baseScale * 0.965 : baseScale;

  const renderedImageWidth = Math.ceil(BASE_WIDTH * baseScale);

  const alignmentClass =
    align === "left"
      ? "justify-start"
      : align === "center"
        ? "justify-center"
        : "justify-end";

  const translateX = align === "right" ? -Math.abs(offsetX) : offsetX;

  const textAlignmentClass =
    panelPosition === "leftOfCard" ? "text-right" : "text-left";

  return (
    <div className={`flex w-full ${alignmentClass}`}>
      <div
        style={{
          transform: `translateX(${translateX}px)`,
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

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`
                    pointer-events-auto
                    absolute
                    z-50
                    w-[280px]
                    ${textAlignmentClass}
                  `}
                  style={{
                    top: panelTop,

                    right:
                      panelPosition === "leftOfCard" ? panelOffset : "auto",

                    left:
                      panelPosition === "rightOfCard" ? panelOffset : "auto",
                  }}
                >
                  <div className="space-y-3">
                    <TextReveal
                      as="p"
                      mode="words"
                      viewport={false}
                      active={isActive}
                      delay={0}
                      stagger={0.035}
                      duration={revealDuration}
                      y="105%"
                      className="
                        text-base
                        font-black
                        uppercase
                        tracking-[-0.022em]
                        text-color/40
                      "
                    >
                      Project Details
                    </TextReveal>

                    <motion.div
                      initial={{
                        scaleX: 0,
                        opacity: 0,
                      }}
                      animate={{
                        scaleX: 1,
                        opacity: 1,
                      }}
                      exit={{
                        scaleX: 0,
                        opacity: 0,
                      }}
                      transition={{
                        delay: 0.1,
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-px w-full bg-color/20"
                      style={{
                        transformOrigin:
                          panelPosition === "leftOfCard"
                            ? "right center"
                            : "left center",
                      }}
                    />

                    <div className="space-y-3">
                      {tags.length > 0 && (
                        <div className="space-y-1.5">
                          <TextReveal
                            as="p"
                            mode="words"
                            viewport={false}
                            active={isActive}
                            delay={0.14}
                            duration={revealDuration}
                            y="105%"
                            className="
                              text-sm
                              font-semibold
                              uppercase
                              text-color
                            "
                          >
                            Tags:
                          </TextReveal>

                          <div className="space-y-1">
                            {tags.map((tag, tagIndex) => (
                              <TransitionLink
                                key={tag.slug}
                                href={`/projects?tags=${encodeURIComponent(
                                  tag.slug,
                                )}`}
                                transitionLabel={tag.label}
                                className={`
                                  block
                                  w-fit
                                  underline-offset-4
                                  transition-colors
                                  hover:text-color
                                  hover:underline

                                  ${
                                    panelPosition === "leftOfCard"
                                      ? "ml-auto"
                                      : ""
                                  }
                                `}
                              >
                                <LinkReveal
                                  active={isActive}
                                  delay={0.19 + tagIndex * 0.045}
                                  duration={revealDuration}
                                  y="110%"
                                  className="
                                    text-[13px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-color/55
                                  "
                                >
                                  {tag.label}
                                </LinkReveal>
                              </TransitionLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.type && (
                        <div className="space-y-1">
                          <TextReveal
                            as="p"
                            mode="words"
                            viewport={false}
                            active={isActive}
                            delay={0.28}
                            duration={revealDuration}
                            y="105%"
                            className="
                              text-sm
                              font-semibold
                              uppercase
                              text-color
                            "
                          >
                            Year:
                          </TextReveal>

                          <TextReveal
                            as="p"
                            mode="words"
                            viewport={false}
                            active={isActive}
                            delay={0.33}
                            stagger={0.025}
                            duration={revealDuration}
                            y="105%"
                            className="
                              text-[13px]
                              uppercase
                              tracking-[0.18em]
                              text-color/55
                            "
                          >
                            {project.type}
                          </TextReveal>
                        </div>
                      )}

                      {tools && (
                        <div className="space-y-1">
                          <TextReveal
                            as="p"
                            mode="words"
                            viewport={false}
                            active={isActive}
                            delay={0.38}
                            duration={revealDuration}
                            y="105%"
                            className="
                              text-sm
                              font-semibold
                              uppercase
                              text-color
                            "
                          >
                            Tools:
                          </TextReveal>

                          <TextReveal
                            as="p"
                            mode="words"
                            viewport={false}
                            active={isActive}
                            delay={0.43}
                            stagger={0.025}
                            duration={revealDuration}
                            y="105%"
                            className="
                              text-[13px]
                              uppercase
                              leading-6
                              tracking-[0.18em]
                              text-color/55
                            "
                          >
                            {tools}
                          </TextReveal>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MagneticComp>
      </div>
    </div>
  );
});

export default DesktopProjectItem;
