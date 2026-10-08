"use client";

import { motion } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import TransitionLink from "@/components/TransitionLink";

import ProjectPreviewThreeImage from "./ProjectPreviewThreeImage";

import { useProjectsReveal } from "./ProjectsLoadingGate";

import type { SharedPointerRef } from "./projectPreviewTypes";
import type { ProjectListItem } from "./projectsTypes";

import { formatProjectTag } from "./projectUtils";

type ProjectsGridCardProps = {
  project: ProjectListItem;

  index?: number;

  projectNumber: number;

  pointerRef: SharedPointerRef;

  active?: boolean;

  activeOrder?: number;
};

const MAX_VISIBLE_TAGS = 2;

/*
 * =========================================================
 * EASING
 * =========================================================
 */

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

const FILTER_EASE = [0.22, 1, 0.36, 1] as const;

export default function ProjectsGridCard({
  project,
  index = 0,
  projectNumber,
  pointerRef,
  active = true,
  activeOrder = index,
}: ProjectsGridCardProps) {
  const { revealStarted } = useProjectsReveal();

  const imageLinkRef = useRef<HTMLAnchorElement | null>(null);

  /*
   * =====================================================
   * KEEP CARD / CANVAS MOUNTED
   * =====================================================
   *
   * Vi unmount-er ikke Three Canvas når man filtrerer.
   *
   * Cardet fader først ut.
   * Deretter tas det ut av layout med display:none.
   *
   * Canvas-contexten beholdes.
   */

  const [inLayout, setInLayout] = useState(active);

  useEffect(() => {
    if (active) {
      setInLayout(true);

      return;
    }

    const timeout = window.setTimeout(() => {
      setInLayout(false);
    }, 220);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [active]);

  /*
   * =====================================================
   * TAGS
   * =====================================================
   */

  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS);

  const hiddenTagsCount = Math.max(project.tags.length - MAX_VISIBLE_TAGS, 0);

  /*
   * =====================================================
   * INITIAL STAGGER
   * =====================================================
   */

  const column = index % 3;

  const row = Math.floor(index / 3);

  const revealDelay = column * 0.07 + Math.min(row, 2) * 0.075;

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <motion.article
      layout="position"
      initial={false}
      animate={{
        opacity: revealStarted && active ? 1 : 0,

        y: revealStarted && active ? 0 : 16,

        scale: revealStarted && active ? 1 : 0.994,
      }}
      transition={{
        opacity: {
          duration: revealStarted && active ? 0.9 : 0.18,

          delay: revealStarted && active ? revealDelay : 0,

          ease: revealStarted && active ? REVEAL_EASE : FILTER_EASE,
        },

        y: {
          duration: revealStarted && active ? 1.05 : 0.32,

          delay: revealStarted && active ? revealDelay : 0,

          ease: revealStarted && active ? REVEAL_EASE : FILTER_EASE,
        },

        scale: {
          duration: revealStarted && active ? 1.1 : 0.32,

          delay: revealStarted && active ? revealDelay : 0,

          ease: revealStarted && active ? REVEAL_EASE : FILTER_EASE,
        },

        layout: {
          duration: 0.78,
          ease: FILTER_EASE,
        },
      }}
      style={{
        display: inLayout ? "block" : "none",

        order: active ? activeOrder : 9999 + projectNumber,

        /*
         * Ingen clipPath.
         * Ingen contain.
         *
         * Three må få tegne utenfor
         * cardets originale bounds.
         */

        willChange: "transform, opacity",
      }}
      className="
        relative
        z-0
        min-w-0
        overflow-visible

        hover:z-30
      "
    >
      {/* =================================================
          IMAGE

          VIKTIG:
          Ingen clipPath.
          Ingen overflow-hidden.

          Three-plane kan derfor bøye seg utenfor
          venstre/høyre kant uten å bli klippet.
      ================================================= */}

      <motion.div
        initial={false}
        animate={{
          opacity: revealStarted && active ? 1 : 0,

          y: revealStarted && active ? 0 : 10,

          scale: revealStarted && active ? 1 : 0.996,
        }}
        transition={{
          opacity: {
            duration: 0.95,

            delay: revealStarted && active ? revealDelay + 0.03 : 0,

            ease: REVEAL_EASE,
          },

          y: {
            duration: 1.1,

            delay: revealStarted && active ? revealDelay : 0,

            ease: REVEAL_EASE,
          },

          scale: {
            duration: 1.15,

            delay: revealStarted && active ? revealDelay : 0,

            ease: REVEAL_EASE,
          },
        }}
        style={{
          transformOrigin: "50% 50%",

          willChange: "transform, opacity",
        }}
        className="
          relative
          overflow-visible
        "
      >
        <TransitionLink
          ref={imageLinkRef}
          href={`/project/${project.id}`}
          transitionLabel={project.title}
          aria-label={`Open project ${project.title}`}
          className="
            group
            relative
            isolate
            block

            aspect-[16/10]
            w-full

            cursor-pointer
            overflow-visible
            outline-none
    focus:outline-none
    focus-visible:outline-none
          "
        >
          <ProjectPreviewThreeImage
            src={project.src}
            anchorRef={imageLinkRef}
            hoverColor={project.hoverText}
            pointerRef={pointerRef}
            variant="card"
          />
        </TransitionLink>
      </motion.div>

      {/* =================================================
          PROJECT INFO
      ================================================= */}

      <motion.div
        initial={false}
        animate={{
          opacity: revealStarted && active ? 1 : 0,

          y: revealStarted && active ? 0 : 8,
        }}
        transition={{
          opacity: {
            duration: 0.75,

            delay: revealStarted && active ? revealDelay + 0.14 : 0,

            ease: REVEAL_EASE,
          },

          y: {
            duration: 0.9,

            delay: revealStarted && active ? revealDelay + 0.11 : 0,

            ease: REVEAL_EASE,
          },
        }}
        className="
          mt-4
          grid
          grid-cols-[auto_minmax(0,1fr)]
          gap-x-3

          xl:mt-5
          xl:gap-x-4
        "
      >
        {/* =================================================
            NUMBER
        ================================================= */}

        <p
          className="
            pt-[3px]

            text-[8px]
            font-black
            uppercase
            tracking-[0.18em]
            text-white/30

            2xl:text-[9px]
          "
        >
          {String(projectNumber).padStart(2, "0")}
        </p>

        <div className="min-w-0">
          {/* ===============================================
              TITLE
          ================================================ */}

          <TransitionLink
            href={`/project/${project.id}`}
            transitionLabel={project.title}
            className="
              block
              w-fit
              max-w-full
            "
          >
            <h2
              className="
                font-bueno

                text-[clamp(1.2rem,1.4vw,1.8rem)]

                uppercase
                leading-[0.94]
                tracking-[-0.025em]

                transition-opacity
                duration-300

                hover:opacity-55
              "
            >
              {project.title}
            </h2>
          </TransitionLink>

          {/* ===============================================
              TAGS
          ================================================ */}

          {visibleTags.length > 0 ? (
            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center

                gap-x-2
                gap-y-1
              "
            >
              {visibleTags.map((tag, tagIndex) => {
                const showSeparator =
                  tagIndex < visibleTags.length - 1 || hiddenTagsCount > 0;

                return (
                  <div
                    key={tag}
                    className="
                        flex
                        items-center
                        gap-2
                      "
                  >
                    <span
                      className="
                          text-[8px]
                          font-black
                          uppercase
                          tracking-[0.15em]
                          text-white/35

                          2xl:text-[9px]
                        "
                    >
                      {formatProjectTag(tag)}
                    </span>

                    {showSeparator ? (
                      <span
                        aria-hidden="true"
                        className="
                            text-[8px]
                            text-white/15
                          "
                      >
                        /
                      </span>
                    ) : null}
                  </div>
                );
              })}

              {hiddenTagsCount > 0 ? (
                <span
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-white/25

                    2xl:text-[9px]
                  "
                >
                  +{hiddenTagsCount}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* ===============================================
              TYPE / YEAR
          ================================================ */}

          {project.type ? (
            <p
              className="
                mt-2

                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white/20

                2xl:text-[9px]
              "
            >
              {project.type}
            </p>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
}
