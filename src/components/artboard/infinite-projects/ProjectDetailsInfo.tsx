"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import type { ActivePlane, InfiniteProject } from "./types";

type Props = {
  selected: ActivePlane | null;
  closing: boolean;
  ready: boolean;
  project: InfiniteProject | null;
  currentMediaIndex: number;
  mediaCount: number;
  onSelectMedia: (index: number) => void;
  onMenuHoverChange: (hovered: boolean) => void;
};

const ease = [0.16, 1, 0.3, 1] as const;

const detailsVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0.035,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
    },
  },
};

const maskVariants: Variants = {
  hidden: {
    y: "115%",
    opacity: 0,
    filter: "blur(3px)",
  },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

const reducedMaskVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const thumbnailVariants: Variants = {
  hidden: {
    y: "110%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.65,
      ease,
    },
  },
};

function RevealText({
  text,
  delay = 0,
  stagger = 0.015,
  reducedMotion = false,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  reducedMotion?: boolean;
}) {
  const pieces = text.match(/\S+|\s+/g) ?? [];

  return (
    <motion.span
      className="inline"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reducedMotion ? 0 : delay,
            staggerChildren: reducedMotion ? 0 : stagger,
          },
        },
      }}
    >
      {pieces.map((part, index) =>
        /^\s+$/.test(part) ? (
          <span key={index}>{part}</span>
        ) : (
          <span
            key={index}
            className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={reducedMotion ? reducedMaskVariants : maskVariants}
            >
              {part}
            </motion.span>
          </span>
        ),
      )}
    </motion.span>
  );
}

function InlineInfoField({
  label,
  value,
  reducedMotion,
}: {
  label: string;
  value: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      variants={sectionVariants}
      className="
        flex
        items-baseline
        gap-2
        whitespace-nowrap
        text-[clamp(13px,1.1vw,19px)]
        font-medium
        leading-[1.3]
        text-[#e7e3dd]
      "
    >
      <span>
        <RevealText text={label} stagger={0} reducedMotion={reducedMotion} />
      </span>

      <span>
        <RevealText text={value} reducedMotion={reducedMotion} />
      </span>
    </motion.div>
  );
}

export default function ProjectDetailsInfo({
  selected,
  closing,
  ready,
  project,
  currentMediaIndex,
  mediaCount,
  onSelectMedia,
  onMenuHoverChange,
}: Props) {
  const reducedMotion = useReducedMotion() ?? false;

  const thumbnails = project
    ? [
        {
          src: project.src,
          isVideo: false,
        },
        ...(project.images ?? [])
          .filter((src) => src && src !== project.src)
          .map((src) => ({
            src,
            isVideo: false,
          })),
        ...(project.srcVideo?.trim()
          ? [
              {
                src: project.src,
                isVideo: true,
              },
            ]
          : []),
      ].slice(0, mediaCount)
    : [];

  return (
    <AnimatePresence>
      {selected && !closing && ready && project && (
        <motion.div
          key={`details-${project.id}-${selected.copy}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={detailsVariants}
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            text-[#e7e3dd]
          "
        >
          {/* YEAR & TOOLS — TOP LEFT */}

          {(project.type?.trim() || project.tools?.trim()) && (
            <motion.div
              variants={sectionVariants}
              className="
                absolute
                left-[5%]
                top-[7%]
                z-30
                flex
                max-w-[75%]
                flex-wrap
                items-center
                gap-x-4
                gap-y-1
                md:left-[3.5%]
                md:gap-x-8
              "
            >
              {project.type?.trim() && (
                <InlineInfoField
                  label="Year:"
                  value={project.type.trim()}
                  reducedMotion={reducedMotion}
                />
              )}

              {project.tools?.trim() && (
                <InlineInfoField
                  label="Tools:"
                  value={project.tools.trim().replace(/\s+/g, " ")}
                  reducedMotion={reducedMotion}
                />
              )}
            </motion.div>
          )}

          {/* SCROLL — TOP RIGHT */}

          <motion.div
            variants={sectionVariants}
            className="
              absolute
              right-[5%]
              top-[7%]
              overflow-hidden
              md:right-[4%]
            "
          >
            <motion.p
              variants={reducedMotion ? reducedMaskVariants : maskVariants}
              className="
                text-[9px]
                font-medium
                uppercase
                leading-[1.4]
                tracking-[0.16em]
                text-[#e7e3dd]/80
                md:text-[10px]
              "
            >
              Scroll
            </motion.p>
          </motion.div>

          {/* BOTTOM ROW */}

          <motion.div
            variants={sectionVariants}
            className="
              absolute
              bottom-[3.5%]
              left-[5%]
              right-[5%]
              grid
              grid-cols-1
              items-end
              gap-4
              md:bottom-[5%]
              md:left-[5.3%]
              md:right-[4%]
              md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]
              md:gap-8
            "
          >
            {/* TITLE — BOTTOM LEFT */}

            <div className="min-w-0 overflow-hidden">
              <h2
                className="
                  break-words
                  text-[clamp(21px,4.5vw,28px)]
                  font-bold
                  uppercase
                  leading-[1.08]
                  tracking-[-0.012em]
                  text-[#e7e3dd]
                  md:text-[clamp(22px,1.45vw,27px)]
                "
              >
                <RevealText
                  text={project.title?.trim() || "Untitled"}
                  stagger={0.025}
                  reducedMotion={reducedMotion}
                />
              </h2>
            </div>

            {/* MEDIA THUMBNAILS — BOTTOM RIGHT */}

            <motion.nav
              variants={sectionVariants}
              aria-label="Project media navigation"
              className="
                pointer-events-auto
                w-max
                min-w-0
                max-w-full
                justify-self-end
                overflow-x-auto
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  onMenuHoverChange(true);
                }
              }}
              onPointerLeave={() => onMenuHoverChange(false)}
              onFocus={() => onMenuHoverChange(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  onMenuHoverChange(false);
                }
              }}
            >
              <div
                className="
                  flex
                  w-max
                  items-center
                  gap-[6px]
                  py-1
                  md:gap-[8px]
                "
              >
                {thumbnails.map((thumbnail, index) => {
                  const active = currentMediaIndex === index;

                  return (
                    <div
                      key={`${thumbnail.src}-${index}`}
                      className="shrink-0 overflow-hidden"
                    >
                      <motion.button
                        type="button"
                        variants={
                          reducedMotion
                            ? reducedMaskVariants
                            : thumbnailVariants
                        }
                        aria-label={
                          thumbnail.isVideo
                            ? "Show project video"
                            : `Show project image ${index + 1}`
                        }
                        aria-current={active ? "true" : undefined}
                        onClick={() => onSelectMedia(index)}
                        className="
                          relative
                          block
                          aspect-[4/3]
                          w-[38px]
                          cursor-pointer
                          overflow-hidden
                          border-0
                          bg-transparent
                          p-0
                          focus-visible:outline
                          focus-visible:outline-1
                          focus-visible:-outline-offset-1
                          focus-visible:outline-[#e7e3dd]
                          md:w-[clamp(42px,3.2vw,62px)]
                        "
                      >
                        <div
                          className={`
                            relative
                            h-full
                            w-full
                            overflow-hidden
                            bg-[#f1f0f0]
                            transition-opacity
                            duration-300
                            ease-out
                            ${
                              active
                                ? "opacity-100"
                                : "opacity-35 hover:opacity-100"
                            }
                          `}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbnail.src}
                            alt=""
                            draggable={false}
                            className="
                              pointer-events-none
                              h-full
                              w-full
                              select-none
                              object-cover
                            "
                          />

                          {thumbnail.isVideo && (
                            <div
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                bg-black/25
                              "
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M3 1.5L10 6L3 10.5V1.5Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
