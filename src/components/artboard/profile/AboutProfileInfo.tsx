"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type Props = {
  visible: boolean;
  mediaIndex: number;
  activeDiscipline: string | null;
  onSelectMedia: (index: number) => void;
  onMenuHoverChange?: (hovered: boolean) => void;
};

const SECTIONS = [
  {
    label: "Profile",
    title: "RUSTAM KERIMOV",
    intro:
      "A graphic designer exploring visual identities, typography and motion.",
    description:
      "Creating distinctive visual experiences across branding, editorial design, art direction and animation.",
    mobile:
      "A graphic designer exploring visual identities, typography, art direction and motion.",
  },
  {
    label: "Visual Identities",
    title: "VISUAL IDENTITIES",
    intro:
      "Building distinctive visual systems that give brands a clear and recognizable voice.",
    description:
      "From typography and color to composition and visual direction, every element works together to create a cohesive identity.",
    mobile:
      "Creating distinctive visual identities through typography, color and considered design systems.",
  },
  {
    label: "Logo Design",
    title: "LOGO DESIGN",
    intro:
      "Creating memorable marks that turn ideas into recognizable visual signatures.",
    description:
      "Exploring shape, proportion and typography to develop logos that feel purposeful, distinctive and versatile.",
    mobile:
      "Creating distinctive and memorable logos through shape, typography and visual exploration.",
  },
  {
    label: "Art Direction",
    title: "ART DIRECTION",
    intro: "Shaping visual experiences through a clear creative perspective.",
    description:
      "Connecting imagery, typography and composition to establish a distinctive direction and bring creative ideas together.",
    mobile:
      "Shaping creative ideas through imagery, typography and a considered visual direction.",
  },
  {
    label: "Motion & Animation",
    title: "MOTION & ANIMATION",
    intro:
      "Bringing graphic design to life through movement, rhythm and timing.",
    description:
      "Exploring how motion can add character, energy and an entirely new dimension to visual communication.",
    mobile:
      "Bringing design to life through movement, rhythm, animation and visual storytelling.",
  },
  {
    label: "Editorial Design",
    title: "EDITORIAL DESIGN",
    intro: "Exploring the relationship between typography, imagery and space.",
    description:
      "Creating expressive editorial layouts that balance visual structure, storytelling and experimental design.",
    mobile:
      "Creating expressive editorial experiences through typography, imagery and considered composition.",
  },
] as const;

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

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      opacity: {
        duration: 0.75,
        ease,
      },
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
};

const reducedContentVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

function RevealText({
  text,
  delay = 0,
  stagger = 0.015,
  reducedMotion = false,
  inline = false,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  reducedMotion?: boolean;
  inline?: boolean;
}) {
  const pieces = text.match(/\S+|\s+/g) ?? [];

  return (
    <motion.span
      className={
        inline
          ? "inline-block whitespace-pre-line"
          : "block whitespace-pre-line"
      }
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

export default function AboutProfileInfo({
  visible,
  mediaIndex,
  onSelectMedia,
  onMenuHoverChange,
}: Props) {
  const reducedMotion = useReducedMotion() ?? false;

  const activeSection = SECTIONS[mediaIndex] ?? SECTIONS[0];

  const titleClassName =
    activeSection.title.length > 15
      ? "text-[clamp(15px,1.35vw,24px)]"
      : "text-[clamp(20px,1.7vw,32px)]";

  const currentContentVariants = reducedMotion
    ? reducedContentVariants
    : contentVariants;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="rustam-profile-info"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={detailsVariants}
          className="pointer-events-none absolute inset-0 z-[50] text-[#e7e3dd]"
        >
          <motion.div
            variants={sectionVariants}
            className="absolute left-[5%] top-[10%] w-[90%] lg:left-[3.5%] lg:top-[27%] lg:w-[21%]"
          >
            <div className="grid grid-cols-1">
              <AnimatePresence mode="sync">
                {" "}
                <motion.div
                  key={`about-content-${mediaIndex}`}
                  variants={currentContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="col-start-1 row-start-1 min-w-0"
                >
                  <h2
                    className={`font-bueno whitespace-nowrap font-bold uppercase leading-[1.05] tracking-[-0.025em] ${titleClassName}`}
                  >
                    <RevealText
                      text={activeSection.title}
                      stagger={0.025}
                      reducedMotion={reducedMotion}
                    />
                  </h2>

                  <motion.div
                    variants={sectionVariants}
                    className="mt-5 hidden font-bueno text-[clamp(15px,1.08vw,19px)] leading-[1.55] text-[#e7e3dd]/80 lg:block"
                  >
                    <p>
                      <RevealText
                        text={activeSection.intro}
                        stagger={0.016}
                        reducedMotion={reducedMotion}
                      />
                    </p>

                    <p className="mt-6">
                      <RevealText
                        text={activeSection.description}
                        stagger={0.016}
                        reducedMotion={reducedMotion}
                      />
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* DESKTOP MENU — BOTTOM RIGHT */}
          <motion.div
            variants={sectionVariants}
            onPointerEnter={() => onMenuHoverChange?.(true)}
            onPointerLeave={() => onMenuHoverChange?.(false)}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            className="pointer-events-auto absolute bottom-[5%] right-[3.1%] hidden w-[22%] text-right lg:block"
          >
            <div className="flex flex-col items-end font-bueno text-[clamp(16px,1.1vw,19px)] font-medium leading-[1.4]">
              {SECTIONS.map((section, index) => (
                <button
                  key={section.label}
                  type="button"
                  aria-current={mediaIndex === index ? "true" : undefined}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectMedia(index);
                  }}
                  className="cursor-pointer whitespace-nowrap text-right transition-opacity duration-500 ease-in-out hover:!opacity-100 focus-visible:!opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#e7e3dd]"
                  style={{
                    opacity: mediaIndex === index ? 1 : 0.3,
                  }}
                >
                  <RevealText
                    text={section.label}
                    delay={0.02 + index * 0.018}
                    stagger={0.012}
                    reducedMotion={reducedMotion}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* MOBILE DESCRIPTION — UNCHANGED */}
          <motion.div
            variants={sectionVariants}
            className="absolute bottom-[12%] left-[5%] right-[5%] lg:hidden"
          >
            <div className="grid grid-cols-1">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={`mobile-about-${mediaIndex}`}
                  variants={currentContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="col-start-1 row-start-1 min-w-0"
                >
                  <p className="mb-2 font-bueno text-[13px] leading-[1.4] text-[#e7e3dd]/80">
                    <RevealText
                      text={activeSection.mobile}
                      stagger={0.015}
                      reducedMotion={reducedMotion}
                    />
                  </p>

                  <p className="font-bueno text-[12px] uppercase tracking-[0.08em] text-[#e7e3dd]/65">
                    <RevealText
                      text={activeSection.label}
                      reducedMotion={reducedMotion}
                    />
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* BOTTOM LEFT — EXPLORE / LOCATION / AGE */}
          <motion.div
            variants={sectionVariants}
            className="absolute bottom-[4%] left-[5%] right-[5%] grid grid-cols-2 items-end gap-2 lg:bottom-[5%] lg:left-[5.3%] lg:right-auto lg:flex lg:items-end lg:gap-7"
          >
            <div className="min-w-0">
              <p className="font-sans text-[9px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-[#e7e3dd]/80 md:text-[10px]">
                <RevealText
                  text="Scroll or click to explore"
                  stagger={0.016}
                  reducedMotion={reducedMotion}
                />
              </p>
            </div>

            <div className="flex min-w-0 flex-col items-end gap-1 text-right font-sans text-[9px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-[#e7e3dd]/80 md:flex-row md:justify-end md:gap-3 md:text-[10px] lg:justify-start">
              <span className="whitespace-nowrap">
                <RevealText
                  text="Oslo, Norway"
                  inline
                  reducedMotion={reducedMotion}
                />
              </span>

              <span className="hidden opacity-40 md:inline">/</span>

              <span className="whitespace-nowrap">
                <RevealText
                  text="Age: 27"
                  inline
                  reducedMotion={reducedMotion}
                />
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
