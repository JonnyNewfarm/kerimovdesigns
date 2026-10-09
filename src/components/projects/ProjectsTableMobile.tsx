"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import TextReveal from "@/components/TextReveal";

import TransitionLink from "../TransitionLink";
import FilterPopupThreeBackground from "./FilterPopupThreeBackground";
import PageTransitionGate from "./PageTransitionGate";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  hoverText?: string | null;
  type: string | null;
  tools: string | null;
  tags: string[];
  createdAt?: Date;
};

interface ProjectsTableMobileProps {
  projects?: ProjectListItem[];
  children?: ReactNode;
  startIndex: number;
  availableTags?: string[];
  activeTags?: string[];
}

/*
 * =========================================================
 * SETTINGS
 * =========================================================
 */

const revealEase = [0.22, 1, 0.36, 1] as const;

const FILTER_EASE = [0.22, 1, 0.36, 1] as const;

const MAX_SELECTED_TAGS = 3;

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

const formatTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};

/*
 * =========================================================
 * MOBILE PROJECTS
 * =========================================================
 */

const ProjectsTableMobile = ({
  projects = [],
  children,
  startIndex,
  availableTags = [],
  activeTags = [],
}: ProjectsTableMobileProps) => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);

  const [threeReady, setThreeReady] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>(activeTags);

  /*
   * =====================================================
   * CLIENT
   * =====================================================
   */

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * =====================================================
   * SYNC SERVER TAGS
   * =====================================================
   */

  useEffect(() => {
    setSelectedTags(activeTags);
  }, [activeTags]);

  /*
   * =====================================================
   * LOCK BODY WHEN FILTER IS OPEN
   * =====================================================
   */

  useEffect(() => {
    if (!filterOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    const previousBodyOverscroll = document.body.style.overscrollBehavior;

    const previousHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;

      document.documentElement.style.overflow = previousHtmlOverflow;

      document.body.style.overscrollBehavior = previousBodyOverscroll;

      document.documentElement.style.overscrollBehavior =
        previousHtmlOverscroll;
    };
  }, [filterOpen]);

  /*
   * =====================================================
   * ESCAPE
   * =====================================================
   */

  useEffect(() => {
    if (!filterOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filterOpen]);

  /*
   * =====================================================
   * OPEN / CLOSE
   * =====================================================
   */

  const openFilter = () => {
    setThreeReady(false);
    setFilterOpen(true);
  };

  const closeFilter = () => {
    setFilterOpen(false);
  };

  /*
   * =====================================================
   * URL
   * =====================================================
   */

  const updateUrl = (nextTags: string[]) => {
    const params = new URLSearchParams(window.location.search);

    /*
     * Når filter endres går vi tilbake til
     * første mobile pagination-page.
     */

    params.delete("page");
    params.delete("tag");
    params.delete("tags");

    if (nextTags.length > 0) {
      params.set("tags", nextTags.join(","));
    }

    const query = params.toString();

    const nextUrl =
      query.length > 0
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;

    router.push(nextUrl, {
      scroll: false,
    });
  };

  /*
   * =====================================================
   * COMMIT FILTER
   * =====================================================
   */

  const commitTags = (nextTags: string[]) => {
    setSelectedTags(nextTags);

    updateUrl(nextTags);
  };

  /*
   * =====================================================
   * CLEAR
   * =====================================================
   */

  const clearTags = () => {
    if (selectedTags.length === 0) {
      return;
    }

    commitTags([]);
  };

  /*
   * =====================================================
   * TOGGLE TAG
   * =====================================================
   */

  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);

    if (!isSelected && selectedTags.length >= MAX_SELECTED_TAGS) {
      return;
    }

    const nextTags = isSelected
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    commitTags(nextTags);
  };

  /*
   * =====================================================
   * FILTER POPUP
   * =====================================================
   */

  const filterPopup = mounted
    ? createPortal(
        <AnimatePresence>
          {filterOpen ? (
            <>
              {/* =========================================
                  BACKDROP
              ========================================== */}

              <motion.button
                type="button"
                aria-label="Close filters"
                onClick={closeFilter}
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
                  duration: 0.4,
                  ease: FILTER_EASE,
                }}
                className="
                  fixed
                  inset-0
                  z-[180]

                  cursor-default

                  bg-[#0b0e0a]/40

                  backdrop-blur-[5px]
                "
              />

              {/* =========================================
                  CENTER STAGE
              ========================================== */}

              <div
                className="
                  pointer-events-none
                  fixed
                  inset-0
                  z-[190]

                  flex
                  items-center
                  justify-center

                  p-4
                "
              >
                {/* =======================================
                    PANEL

                    Ingen perspective.
                    Ingen rotateY.
                    Ingen desktop tilt.
                ======================================== */}

                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="All project filters"
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.975,
                  }}
                  animate={{
                    opacity: threeReady ? 1 : 0,
                    y: threeReady ? 0 : 20,
                    scale: threeReady ? 1 : 0.975,
                  }}
                  exit={{
                    opacity: 0,
                    y: 14,
                    scale: 0.985,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.45,
                      ease: FILTER_EASE,
                    },

                    y: {
                      duration: 0.65,
                      ease: FILTER_EASE,
                    },

                    scale: {
                      duration: 0.65,
                      ease: FILTER_EASE,
                    },
                  }}
                  className="
                    pointer-events-auto

                    relative
                    isolate

                    flex

                    h-[min(520px,calc(100dvh-48px))]
                    w-full
                    max-w-[380px]

                    flex-col

                    overflow-hidden

                    border-0
                    bg-transparent
                    outline-none

                    text-color
                  "
                >
                  {/* =====================================
                      THREE BACKGROUND
                  ====================================== */}

                  <FilterPopupThreeBackground
                    onReady={() => {
                      setThreeReady(true);
                    }}
                  />

                  {/* =====================================
                      CONTENT
                  ====================================== */}

                  <div
                    className="
                      relative
                      z-10

                      flex
                      min-h-0
                      flex-1
                      flex-col
                    "
                  >
                    {/* ===================================
                        HEADER
                    ==================================== */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-5

                        px-6
                        pb-6
                        pt-6
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.28em]

                            text-white/55
                          "
                        >
                          Project filter
                        </p>

                        <h3
                          className="
                            mt-2

                            font-bueno
                            text-[2rem]
                            font-black

                            uppercase
                            leading-[0.92]
                            tracking-[-0.025em]

                            text-white
                          "
                        >
                          All filters
                        </h3>
                      </div>

                      {/* =================================
                          CLOSE
                      ================================== */}

                      <motion.button
                        type="button"
                        onClick={closeFilter}
                        whileTap={{
                          scale: 0.96,
                        }}
                        transition={{
                          duration: 0.25,
                          ease: FILTER_EASE,
                        }}
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center

                          bg-[#20241e]/85

                          px-3
                          py-2

                          text-[8px]
                          font-black
                          uppercase
                          tracking-[0.18em]

                          text-white/65
                        "
                      >
                        Close
                      </motion.button>
                    </div>

                    {/* ===================================
                        FILTERS
                    ==================================== */}

                    <div
                      className="
                        min-h-0
                        flex-1

                        overflow-y-auto

                        px-6
                        pb-6

                        [scrollbar-width:none]

                        [&::-webkit-scrollbar]:hidden
                      "
                    >
                      <div
                        className="
                          grid
                          grid-cols-2

                          gap-x-3
                          gap-y-1
                        "
                      >
                        <PopupFilterButton
                          label="All work"
                          active={selectedTags.length === 0}
                          disabled={false}
                          onClick={clearTags}
                          index={0}
                        />

                        {availableTags.map((tag, index) => {
                          const active = selectedTags.includes(tag);

                          const disabled =
                            !active && selectedTags.length >= MAX_SELECTED_TAGS;

                          return (
                            <PopupFilterButton
                              key={tag}
                              label={formatTag(tag)}
                              active={active}
                              disabled={disabled}
                              onClick={() => toggleTag(tag)}
                              index={index + 1}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* ===================================
                        FOOTER
                    ==================================== */}

                    <div
                      className="
                        flex
                        min-h-[54px]
                        shrink-0
                        items-center
                        justify-between
                        gap-4

                        px-6
                        pb-5
                        pt-2
                      "
                    >
                      <p
                        className="
                          text-[8px]
                          font-black
                          uppercase
                          tracking-[0.16em]

                          text-white/70
                        "
                      >
                        Select up to three filters
                      </p>

                      <AnimatePresence initial={false}>
                        {selectedTags.length > 0 ? (
                          <motion.button
                            type="button"
                            onClick={clearTags}
                            initial={{
                              opacity: 0,
                              x: 5,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              x: 5,
                            }}
                            transition={{
                              duration: 0.35,
                              ease: FILTER_EASE,
                            }}
                            className="
                              shrink-0

                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.18em]

                              text-white/75
                            "
                          >
                            Clear
                          </motion.button>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          ) : null}
        </AnimatePresence>,

        document.body,
      )
    : null;

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
      <section className="min-h-screen bg-dark pb-24 text-color">
        <PageTransitionGate className="min-h-screen">
          {/* =============================================
              INTRO
          ============================================== */}

          <div className="px-6 pt-28">
            <TextReveal
              as="h1"
              mode="words"
              viewport={false}
              delay={0.02}
              duration={0.75}
              y="90%"
              className="
                text-[7vw]
                font-black
                uppercase
                leading-[1.1]
                tracking-[-0.01em]
              "
            >
              A Selection of Projects, Practice & Collaborations
            </TextReveal>

            {/* ===========================================
                MOBILE FILTER TRIGGER

                ProjectTagFilter er fjernet.
                Nå åpner denne samme Three-popup som desktop.
            ============================================ */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.65,
                ease: revealEase,
              }}
              className="
                relative
                z-30

                mt-9
              "
            >
              <motion.button
                type="button"
                onClick={openFilter}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  group

                  flex
                  items-center
                  gap-3

                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.2em]

                  text-white/70
                "
              >
                <TextReveal
                  as="span"
                  mode="words"
                  viewport={false}
                  delay={0.1}
                  duration={0.65}
                  y="90%"
                >
                  Filters
                </TextReveal>

                <span
                  className="
                    relative

                    block
                    h-[10px]
                    w-[10px]
                  "
                  aria-hidden="true"
                >
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2

                      h-px
                      w-full

                      -translate-y-1/2

                      bg-current
                    "
                  />

                  <span
                    className="
                      absolute
                      left-1/2
                      top-0

                      h-full
                      w-px

                      -translate-x-1/2

                      bg-current
                    "
                  />
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* =============================================
              PROJECTS
          ============================================== */}

          {projects.length > 0 ? (
            <>
              <div className="mt-8 flex flex-col gap-16 px-6">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    number={startIndex + index + 1}
                    index={index}
                    priority={index === 0}
                  />
                ))}
              </div>

              {children ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.18,
                    duration: 0.65,
                    ease: revealEase,
                  }}
                  className="
                    mt-16
                    px-6
                    pt-8
                  "
                >
                  {children}
                </motion.div>
              ) : null}
            </>
          ) : (
            /* ===========================================
                EMPTY
            ============================================ */

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(5px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.65,
                ease: revealEase,
              }}
              className="
                flex
                min-h-[55vh]
                flex-col
                items-center
                justify-center
                gap-5

                px-6

                text-center
              "
            >
              <p
                className="
                  text-sm
                  uppercase
                  tracking-[0.2em]

                  text-white/50
                "
              >
                No projects found
              </p>

              {activeTags.length > 0 ? (
                <button
                  type="button"
                  onClick={clearTags}
                  className="
                    border-b
                    border-white/40

                    pb-1

                    text-xs
                    uppercase
                    tracking-[0.2em]

                    text-white
                  "
                >
                  View all projects
                </button>
              ) : null}
            </motion.div>
          )}
        </PageTransitionGate>
      </section>

      {filterPopup}
    </>
  );
};

/*
 * =========================================================
 * POPUP FILTER BUTTON
 * =========================================================
 */

type PopupFilterButtonProps = {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  index: number;
};

function PopupFilterButton({
  label,
  active,
  disabled,
  onClick,
  index,
}: PopupFilterButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      initial={{
        opacity: 0,
        y: 5,
      }}
      animate={{
        opacity: disabled ? 0.22 : 1,
        y: 0,
      }}
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.98,
            }
      }
      transition={{
        opacity: {
          duration: 0.4,
          delay: Math.min(index, 10) * 0.018,
          ease: FILTER_EASE,
        },

        y: {
          duration: 0.45,
          delay: Math.min(index, 10) * 0.018,
          ease: FILTER_EASE,
        },

        scale: {
          duration: 0.2,
          ease: FILTER_EASE,
        },
      }}
      className={`
        flex
        min-h-[38px]
        w-full
        min-w-0
        items-center

        px-2

        text-left

        text-[9px]
        font-black
        uppercase
        tracking-[0.14em]

        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}

        ${
          active
            ? `
              bg-black/[0.22]
              text-white
            `
            : `
              text-white/60
            `
        }
      `}
    >
      <span className="truncate">{label}</span>

      {active ? (
        <span
          className="
            ml-auto
            pl-3

            text-[11px]
            leading-none

            text-white/65
          "
        >
          ×
        </span>
      ) : null}
    </motion.button>
  );
}

/*
 * =========================================================
 * PROJECT CARD
 * =========================================================
 */

interface ProjectCardProps {
  project: ProjectListItem;
  number: number;
  index: number;
  priority?: boolean;
}

const ProjectCard = ({
  project,
  number,
  index,
  priority = false,
}: ProjectCardProps) => {
  const cardDelay = 0.08 + Math.min(index, 4) * 0.08;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        delay: cardDelay,
        duration: 0.75,
        ease: revealEase,
      }}
      className="
        flex
        flex-col
      "
    >
      <TransitionLink
        href={`/project/${project.id}`}
        transitionColor={project.hoverText}
        className="block"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.025,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            delay: cardDelay,
            duration: 0.85,
            ease: revealEase,
          }}
          className="
            w-full
            overflow-hidden

            border
            border-white/15

            bg-white/5
          "
        >
          <Image
            src={project.src}
            alt={project.title}
            width={1600}
            height={1200}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 767px) 100vw, 0px"
            className="
              block
              h-auto
              w-full
            "
          />
        </motion.div>
      </TransitionLink>

      <div className="mt-4">
        <TextReveal
          as="p"
          viewport={false}
          delay={cardDelay + 0.04}
          duration={0.55}
          y="75%"
          className="
            mb-3

            text-[10px]
            uppercase
            tracking-[0.28em]

            text-white/35
          "
        >
          {String(number).padStart(2, "0")}
        </TextReveal>

        <TransitionLink
          href={`/project/${project.id}`}
          transitionColor={project.hoverText}
          className="inline-block"
        >
          <TextReveal
            as="h2"
            mode="words"
            viewport={false}
            delay={cardDelay + 0.07}
            duration={0.7}
            y="85%"
            className="
              text-2xl
              font-semibold
              uppercase
              leading-[0.95]
              tracking-[-0.025em]
            "
          >
            {project.title}
          </TextReveal>
        </TransitionLink>

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: cardDelay + 0.12,
            duration: 0.6,
            ease: revealEase,
          }}
          className="
            mt-6

            flex
            items-start
            justify-between
            gap-6

            border-t
            border-white/15

            pt-4

            text-xs
            uppercase
            tracking-[0.18em]

            text-white/55
          "
        >
          <div
            className="
              flex
              max-w-[60%]
              flex-wrap

              gap-x-3
              gap-y-1
            "
          >
            {project.tags.map((tag, tagIndex) => (
              <TextReveal
                key={tag}
                as="span"
                viewport={false}
                delay={cardDelay + 0.14 + tagIndex * 0.025}
                duration={0.55}
                y="75%"
              >
                {formatTag(tag)}
              </TextReveal>
            ))}
          </div>

          {project.tools ? (
            <TextReveal
              as="span"
              viewport={false}
              delay={cardDelay + 0.16}
              duration={0.55}
              y="75%"
              className="
                max-w-[40%]
                text-right
              "
            >
              {project.tools}
            </TextReveal>
          ) : null}
        </motion.div>
      </div>
    </motion.article>
  );
};

export default ProjectsTableMobile;
