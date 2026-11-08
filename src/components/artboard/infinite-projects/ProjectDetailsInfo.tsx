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
      className="block whitespace-pre-line"
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

function InfoField({
  label,
  value,
  labelClassName,
  valueClassName,
  reducedMotion,
}: {
  label: string;
  value: string;
  labelClassName: string;
  valueClassName: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div variants={sectionVariants}>
      <p className={labelClassName}>
        <RevealText text={label} stagger={0} reducedMotion={reducedMotion} />
      </p>

      <p className={valueClassName}>
        <RevealText text={value} reducedMotion={reducedMotion} />
      </p>
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

  return (
    <AnimatePresence>
      {selected && !closing && ready && project && (
        <motion.div
          key={`details-${project.id}-${selected.copy}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={detailsVariants}
          className="pointer-events-none absolute inset-0 z-20 text-[#e7e3dd]"
        >
          <motion.div
            variants={sectionVariants}
            className="absolute left-[5%] top-[7%] z-30 w-[88%] md:left-[3.5%] md:top-[27%] md:w-[20.5%]"
          >
            <h2 className="break-words font-bueno text-[clamp(21px,4.5vw,28px)] font-bold uppercase leading-[1.08] tracking-[-0.012em] text-[#e7e3dd] md:text-[clamp(22px,1.45vw,27px)]">
              <RevealText
                text={project.title?.trim() || "Untitled"}
                stagger={0.025}
                reducedMotion={reducedMotion}
              />
            </h2>

            {project.description?.trim() && (
              <motion.div
                variants={sectionVariants}
                className="
      mt-8 hidden md:block lg:mt-11

      [@media(max-height:800px)]:!mt-6
      [@media(max-height:650px)]:!mt-4
    "
              >
                <p
                  className="
        whitespace-pre-line
        break-words
        font-bueno
        text-[clamp(15px,1.05vw,18px)]
        leading-[1.55]
        text-[#e7e3dd]/78

        [@media(max-height:800px)]:text-[15px]
        [@media(max-height:800px)]:leading-[1.45]

        [@media(max-height:650px)]:text-[14px]
        [@media(max-height:650px)]:leading-[1.4]
      "
                >
                  <RevealText
                    text={project.description}
                    reducedMotion={reducedMotion}
                  />
                </p>
              </motion.div>
            )}
          </motion.div>

          {project.description?.trim() && (
            <motion.div
              variants={sectionVariants}
              className="absolute bottom-[28%] left-[5%] right-[5%] md:hidden"
            >
              <InfoField
                label="Description"
                value={project.description}
                reducedMotion={reducedMotion}
                labelClassName="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-[#e7e3dd]/45"
                valueClassName="line-clamp-3 whitespace-pre-line break-words font-bueno text-[13px] leading-[1.38] text-[#e7e3dd]/85"
              />
            </motion.div>
          )}

          {(project.type?.trim() || project.tools?.trim()) && (
            <div className="absolute bottom-[26%] right-[3.8%] hidden w-[18.5%] flex-col items-start gap-6 md:flex">
              {project.type?.trim() && (
                <InfoField
                  label="Year:"
                  value={project.type}
                  reducedMotion={reducedMotion}
                  labelClassName="mb-3 font-sans text-[10px] font-medium  tracking-[0.18em] text-[#e7e3dd]"
                  valueClassName="break-words font-bueno text-[clamp(16px,1.1vw,19px)] font-medium leading-[1.3] text-[#e7e3dd]/90"
                />
              )}

              {project.tools?.trim() && (
                <InfoField
                  label="Tools:"
                  value={project.tools}
                  reducedMotion={reducedMotion}
                  labelClassName="mb-3 font-sans text-[10px] font-medium  tracking-[0.18em] text-[#e7e3dd]"
                  valueClassName="whitespace-pre-line break-words font-bueno text-[clamp(16px,1.1vw,19px)] font-medium leading-[1.3] text-[#e7e3dd]/90"
                />
              )}
            </div>
          )}

          {(project.type?.trim() || project.tools?.trim()) && (
            <div className="absolute bottom-[10%] left-[5%] right-[5%] flex flex-col items-start gap-3 md:hidden">
              {project.type?.trim() && (
                <InfoField
                  label="Year"
                  value={project.type}
                  reducedMotion={reducedMotion}
                  labelClassName="mb-1 text-[9px] uppercase tracking-[0.2em] text-[#e7e3dd]/55"
                  valueClassName="break-words font-bueno text-[12px] leading-[1.25]"
                />
              )}

              {project.tools?.trim() && (
                <InfoField
                  label="Tools"
                  value={project.tools}
                  reducedMotion={reducedMotion}
                  labelClassName="mb-1 text-[9px] uppercase tracking-[0.2em] text-[#e7e3dd]/55"
                  valueClassName="line-clamp-2 break-words font-bueno text-[12px] leading-[1.25]"
                />
              )}
            </div>
          )}

          <motion.div
            variants={sectionVariants}
            className="absolute bottom-[3.5%] left-[5%] right-[5%] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-end gap-2 md:bottom-[5%] md:left-[5.3%] md:right-[4%]"
          >
            <div className="min-w-0 overflow-hidden">
              <motion.p
                variants={reducedMotion ? reducedMaskVariants : maskVariants}
                className="text-[9px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-[#e7e3dd]/80 md:text-[10px]"
              >
                Scroll or click to explore
              </motion.p>
            </div>

            <div className="min-w-0 overflow-hidden text-center">
              {project.tags.length > 0 && (
                <motion.p
                  variants={reducedMotion ? reducedMaskVariants : maskVariants}
                  className="truncate whitespace-nowrap font-sans text-[8px] font-medium uppercase leading-[1.4] tracking-[0.12em] text-[#e7e3dd]/80 md:text-[10px] md:tracking-[0.16em]"
                  title={project.tags.join(" / ")}
                >
                  {project.tags
                    .filter((tag) => tag.trim().length > 0)
                    .join(" / ")}
                </motion.p>
              )}
            </div>

            <nav
              aria-label="Project media navigation"
              className="pointer-events-auto flex w-max max-w-full min-w-0 justify-self-end items-center justify-end gap-[clamp(9px,1.2vw,20px)] overflow-x-auto whitespace-nowrap font-bueno text-[clamp(15px,1.15vw,19px)] font-medium tabular-nums [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              {Array.from({ length: mediaCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show project media ${index + 1}`}
                  aria-current={
                    index === currentMediaIndex ? "true" : undefined
                  }
                  onClick={() => onSelectMedia(index)}
                  className={`shrink-0 border-0 bg-transparent px-1 py-2 leading-none outline-offset-4 transition-opacity duration-300 ease-in-out focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e7e3dd] ${
                    currentMediaIndex === index
                      ? "text-[#e7e3dd] opacity-100"
                      : "text-[#e7e3dd] opacity-30 hover:opacity-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
