"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import MagneticComp from "@/components/MagneticComp";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import TextReveal from "./TextReveal";

type ProjectListItem = {
  id: string;
  title: string;
  src: string;
  type: string | null;
  tools: string[] | string | null;
  tags?: string | string[] | null;
  createdAt?: Date;
};

interface MyProjectsProps {
  projects: ProjectListItem[];
}

type LayoutItem = {
  left: string;
  leftMd?: string;
  leftLg?: string;
  leftXl?: string;
  left2xl?: string;
  top: number;
  topMd?: number;
  topLg?: number;
  topXl?: number;
  top2xl?: number;
  scale: number;
  drift: number;
  driftDirection: 1 | -1;
};

type MobileLayoutItem = {
  left: string;
  leftSm?: string;
  top: number;
  topSm?: number;
  scale: number;
  scaleSm?: number;
  drift: number;
  driftDirection: 1 | -1;
};

const BASE_WIDTH = 720;
const BASE_HEIGHT = 430;

const DESKTOP_SAFE_PADDING = 24;
const MOBILE_SAFE_PADDING = 16;

const MOBILE_CONTAINER_MAX_WIDTH = 430;
const MOBILE_CARD_BASE_WIDTH = 360;
const MOBILE_CARD_BASE_HEIGHT = 214;

const desktopLayout: LayoutItem[] = [
  {
    left: "74%",
    leftMd: "74%",
    leftLg: "74%",
    leftXl: "84%",
    left2xl: "84%",
    top: 175,
    topMd: 175,
    topLg: 175,
    topXl: 180,
    top2xl: 180,
    scale: 0.9,
    drift: 95,
    driftDirection: -1,
  },
  {
    left: "60%",
    leftMd: "75%",
    leftLg: "75%",
    leftXl: "84%",
    left2xl: "84%",
    top: 550,
    topMd: 550,
    topLg: 550,
    topXl: 560,
    top2xl: 560,
    scale: 0.75,
    drift: 90,
    driftDirection: 1,
  },
  {
    left: "22%",
    leftMd: "22%",
    leftLg: "22%",
    leftXl: "22%",
    left2xl: "22%",
    top: 1100,
    topMd: 1100,
    topLg: 1100,
    topXl: 1100,
    top2xl: 1100,
    scale: 0.9,
    drift: 90,
    driftDirection: -1,
  },
  {
    left: "85%",
    leftMd: "70%",
    leftLg: "70%",
    leftXl: "85%",
    left2xl: "85%",
    top: 1550,
    topMd: 1600,
    topLg: 1550,
    topXl: 1550,
    top2xl: 1550,
    scale: 0.76,
    drift: 95,
    driftDirection: 1,
  },
  {
    left: "55%",
    leftMd: "55%",
    leftLg: "55%",
    leftXl: "55%",
    left2xl: "55%",
    top: 1970,
    topMd: 2020,
    topLg: 1970,
    topXl: 1970,
    top2xl: 1970,
    scale: 0.6,
    drift: 76,
    driftDirection: -1,
  },
  {
    left: "85%",
    leftMd: "85%",
    leftLg: "85%",
    leftXl: "85%",
    left2xl: "85%",
    top: 2500,
    topMd: 2650,
    topLg: 2500,
    topXl: 2500,
    top2xl: 2500,
    scale: 0.9,
    drift: 34,
    driftDirection: 1,
  },
];

const mobileLayout: MobileLayoutItem[] = [
  {
    left: "5%",
    leftSm: "5%",
    top: 135,
    topSm: 120,
    scale: 0.9,
    scaleSm: 1.4,
    drift: 60,
    driftDirection: -1,
  },
  {
    left: "80%",
    leftSm: "80%",
    top: 400,
    topSm: 550,
    scale: 0.8,
    scaleSm: 0.8,
    drift: 60,
    driftDirection: 1,
  },
  {
    left: "10%",
    leftSm: "10%",
    top: 780,
    topSm: 840,
    scale: 0.96,
    scaleSm: 0.96,
    drift: 60,
    driftDirection: -1,
  },
  {
    left: "67%",
    leftSm: "67%",
    top: 1200,
    topSm: 1200,
    scale: 0.85,
    scaleSm: 1.15,
    drift: 55,
    driftDirection: 1,
  },
  {
    left: "18%",
    leftSm: "18%",
    top: 1460,
    topSm: 1530,
    scale: 0.64,
    scaleSm: 0.64,
    drift: 40,
    driftDirection: -1,
  },
  {
    left: "70%",
    leftSm: "70%",
    top: 1800,
    topSm: 1800,
    scale: 0.9,
    scaleSm: 0.9,
    drift: 40,
    driftDirection: 1,
  },
];

function formatTags(tags: ProjectListItem["tags"]): string[] {
  if (!tags) return [];

  const tagList = Array.isArray(tags) ? tags : [tags];

  return tagList.map((tag) => tag.replaceAll("-", " "));
}
function formatTools(tools: ProjectListItem["tools"]) {
  if (!tools) return "";
  if (Array.isArray(tools)) return tools.join(", ");
  return tools;
}

function percentToNumber(percent: string) {
  return Number(percent.replace("%", "")) / 100;
}

function getSafeLeft(left: string, elementWidth: number, safePadding: number) {
  const leftPercent = percentToNumber(left);

  return `clamp(${safePadding}px, calc(${leftPercent} * (100vw - ${elementWidth}px)), calc(100vw - ${elementWidth}px - ${safePadding}px))`;
}

function getSafeDesktopLeft(left: string, baseScale: number) {
  return getSafeLeft(left, BASE_WIDTH * baseScale, DESKTOP_SAFE_PADDING);
}

function getSafeMobileLeft(left: string, baseScale: number) {
  return getSafeLeft(
    left,
    MOBILE_CARD_BASE_WIDTH * baseScale,
    MOBILE_SAFE_PADDING,
  );
}

function getMobileCardWidth(baseScale: number) {
  return MOBILE_CARD_BASE_WIDTH * baseScale;
}

function getMobileCardHeight(baseScale: number) {
  return MOBILE_CARD_BASE_HEIGHT * baseScale;
}

function useViewportWidth() {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

function getResponsiveDesktopTop(item: LayoutItem, width: number) {
  if (width >= 1536 && item.top2xl !== undefined) return item.top2xl;
  if (width >= 1280 && item.topXl !== undefined) return item.topXl;
  if (width >= 1024 && item.topLg !== undefined) return item.topLg;
  if (width >= 768 && item.topMd !== undefined) return item.topMd;

  return item.top;
}

function getResponsiveDesktopLeft(item: LayoutItem, width: number) {
  if (width >= 1536 && item.left2xl !== undefined) return item.left2xl;
  if (width >= 1280 && item.leftXl !== undefined) return item.leftXl;
  if (width >= 1024 && item.leftLg !== undefined) return item.leftLg;
  if (width >= 768 && item.leftMd !== undefined) return item.leftMd;

  return item.left;
}

function getResponsiveMobileTop(item: MobileLayoutItem, width: number) {
  if (width >= 640 && item.topSm !== undefined) return item.topSm;

  return item.top;
}

function getResponsiveMobileLeft(item: MobileLayoutItem, width: number) {
  if (width >= 640 && item.leftSm !== undefined) return item.leftSm;

  return item.left;
}

function getResponsiveMobileScale(item: MobileLayoutItem, width: number) {
  if (width >= 640 && item.scaleSm !== undefined) return item.scaleSm;

  return item.scale;
}

function formatProjectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default function MyProjects({ projects }: MyProjectsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportWidth = useViewportWidth();
  const pathname = usePathname();

  useEffect(() => {
    setHoveredId(null);
  }, [pathname]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const visibleProjects = useMemo(() => projects.slice(0, 6), [projects]);

  const usedDesktopLayout = desktopLayout.slice(0, visibleProjects.length);
  const usedMobileLayout = mobileLayout.slice(0, visibleProjects.length);

  const desktopSectionHeight =
    Math.max(
      ...usedDesktopLayout.map((item) => {
        const resolvedTop = getResponsiveDesktopTop(item, viewportWidth);
        const imageHeight = BASE_HEIGHT * item.scale;
        const textBlockHeight = 120;

        return resolvedTop + imageHeight + textBlockHeight;
      }),
      2200,
    ) + 80;

  const mobileSectionHeight =
    Math.max(
      ...usedMobileLayout.map((item) => {
        const resolvedTop = getResponsiveMobileTop(item, viewportWidth);
        const resolvedScale = getResponsiveMobileScale(item, viewportWidth);
        const imageHeight = getMobileCardHeight(resolvedScale);
        const textBlockHeight = 110;

        return resolvedTop + imageHeight + textBlockHeight;
      }),
      1700,
    ) + 60;

  return (
    <section
      ref={sectionRef}
      className="relative mb-20 mt-14 pt-60 min-h-screen w-full overflow-hidden bg-dark text-color"
    >
      <div
        className="relative hidden w-full lg:block"
        style={{ height: desktopSectionHeight }}
      >
        <div className="absolute left-[12%]  xl:left-[8%] lg:top-[-80px] z-30 max-w-[760px] xl:top-[210px]">
          <div className=" flex items-center gap-4">
            <span className="text-[18px] uppercase tracking-[0.18em] text-color/45">
              06
            </span>

            <span className="text-[13px] font-black uppercase tracking-[0.28em] text-color/45">
              Latest projects
            </span>
          </div>
          <TextReveal
            as="h2"
            mode="lines"
            delay={0.1}
            className="text-[clamp(40px,5.4vw,100px)] mb-2 font-black uppercase leading-[0.82] tracking-[-0.045em] text-color"
          >
            Recent
          </TextReveal>
          <TextReveal
            as="h2"
            mode="lines"
            delay={0.1}
            className="text-[clamp(40px,5.4vw,100px)] font-black uppercase leading-[0.82] tracking-[-0.045em] text-color"
          >
            Work
          </TextReveal>
        </div>

        {visibleProjects.map((project, index) => {
          const item = desktopLayout[index % desktopLayout.length];
          const resolvedTop = getResponsiveDesktopTop(item, viewportWidth);
          const resolvedLeft = getResponsiveDesktopLeft(item, viewportWidth);
          const isActive = hoveredId === project.id;
          const isDimmed = hoveredId !== null && hoveredId !== project.id;

          return (
            <DesktopProjectItem
              key={project.id}
              project={project}
              index={index}
              left={resolvedLeft}
              top={resolvedTop}
              baseScale={item.scale}
              drift={item.drift}
              driftDirection={item.driftDirection}
              scrollYProgress={scrollYProgress}
              isActive={isActive}
              isDimmed={isDimmed}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          );
        })}

        <TransitionLink
          href="/projects"
          transitionLabel="My Work"
          className="group absolute left-[8%] top-[2580px] z-40"
        >
          <MagneticComp>
            <div className="uppercase leading-[0.8] tracking-[-0.04em]">
              <p className="flex items-center gap-x-2 text-6xl text-color/70 transition group-hover:text-color">
                view —
              </p>
              <p className="text-6xl text-color/70 transition group-hover:text-color">
                Archives
              </p>
            </div>
          </MagneticComp>
        </TransitionLink>
      </div>

      <div className="block lg:hidden">
        <div
          className="relative w-full"
          style={{
            maxWidth: MOBILE_CONTAINER_MAX_WIDTH,
            height: mobileSectionHeight,
          }}
        >
          <div className="absolute -top-3 left-[8%] z-30">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-color/45">
                06
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-color/45">
                Latest projects
              </span>
            </div>

            <p className="text-4xl font-black uppercase leading-[0.82] tracking-[-0.07em] text-color/80">
              Recent
              <br />
              Work
            </p>
          </div>

          {visibleProjects.map((project, index) => {
            const item = mobileLayout[index % mobileLayout.length];
            const resolvedLeft = getResponsiveMobileLeft(item, viewportWidth);
            const resolvedTop = getResponsiveMobileTop(item, viewportWidth);
            const resolvedScale = getResponsiveMobileScale(item, viewportWidth);

            return (
              <MobileProjectItem
                key={project.id}
                project={project}
                index={index}
                left={resolvedLeft}
                top={resolvedTop}
                baseScale={resolvedScale}
                drift={item.drift}
                driftDirection={item.driftDirection}
                scrollYProgress={scrollYProgress}
              />
            );
          })}

          <TransitionLink
            href="/projects"
            transitionLabel="My work"
            className="group absolute left-[8%] z-40"
            style={{
              top: mobileSectionHeight - 90,
            }}
          >
            <MagneticComp>
              <div className="uppercase leading-[0.8] tracking-[-0.04em]">
                <p className="flex items-center gap-x-2 text-4xl text-color/70 transition group-hover:text-color">
                  view —
                </p>
                <p className="text-4xl text-color/70 transition group-hover:text-color">
                  Archives
                </p>
              </div>
            </MagneticComp>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

function DesktopProjectItem({
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
  onHoverStart,
  onHoverEnd,
}: {
  project: ProjectListItem;
  index: number;
  left: string;
  top: number;
  baseScale: number;
  drift: number;
  driftDirection: 1 | -1;
  scrollYProgress: MotionValue<number>;
  isActive: boolean;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const tools = formatTools(project.tools);
  const tags = formatTags(project.tags);
  const projectNumber = formatProjectNumber(index);

  const panelPositions = [
    "leftOfCard",
    "leftOfCard",
    "rightOfCard",
    "leftOfCard",
    "leftOfCard",
    "leftOfCard",
  ] as const;

  const panelPosition = panelPositions[index] ?? "rightOfCard";

  const automaticPanelTop = baseScale < 0.7 ? 105 : baseScale < 0.8 ? 54 : 12;

  const panelTopOverrides = [null, null, null, null, 84, null] as const;

  const panelTop = panelTopOverrides[index] ?? automaticPanelTop;

  const automaticPanelGap = baseScale < 0.7 ? 10 : baseScale < 0.8 ? 18 : 32;

  const panelGapOverrides = [34, null, null, 20, 30, null] as const;

  const panelGap = panelGapOverrides[index] ?? automaticPanelGap;

  const visualImageEdge = (BASE_WIDTH * (1 + baseScale)) / 2;
  const panelOffset = visualImageEdge + panelGap;

  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [drift * driftDirection, drift * driftDirection * -1],
  );

  return (
    <motion.div
      className="absolute"
      style={{
        top,
        left: getSafeDesktopLeft(left, baseScale),
      }}
    >
      <motion.div style={{ y: driftY, willChange: "transform" }}>
        <MagneticComp>
          <motion.div
            initial="rest"
            animate={isActive ? "hover" : "rest"}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className="group relative"
            style={{ transformOrigin: "center center" }}
          >
            <TransitionLink
              href={`/project/${project.id}`}
              transitionLabel={project.title}
              className="block"
            >
              <motion.div
                animate={{
                  scale: isDimmed ? baseScale * 0.94 : baseScale,
                  filter: isDimmed ? "blur(4px)" : "blur(0px)",
                  opacity: isDimmed ? 0.7 : 1,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="will-change-transform"
              >
                <motion.div
                  variants={{
                    rest: { y: 0 },
                    hover: { y: -8 },
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: BASE_WIDTH,
                      height: BASE_HEIGHT,
                    }}
                  >
                    <motion.div
                      className="h-full w-full"
                      variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.025 },
                      }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Image
                        fill
                        src={project.src}
                        alt={project.title}
                        className="object-cover"
                        sizes="720px"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                <div className="mt-5 flex items-baseline gap-4">
                  <span className="text-3xl uppercase leading-none tracking-[-0.08em] text-color">
                    {projectNumber}
                  </span>

                  <span className="text-[16px] uppercase tracking-[0.24em] text-color/70">
                    {project.title}
                  </span>
                </div>
              </motion.div>
            </TransitionLink>

            <AnimatePresence>
              {isActive && (
                <div
                  className={`pointer-events-none absolute z-50 w-[280px] ${
                    panelPosition === "leftOfCard" ? "text-right" : ""
                  }`}
                  style={{
                    top: panelTop,
                    right:
                      panelPosition === "leftOfCard" ? panelOffset : "auto",
                    left:
                      panelPosition === "rightOfCard" ? panelOffset : "auto",
                    transformOrigin:
                      panelPosition === "leftOfCard" ? "right top" : "left top",
                  }}
                >
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-color/40">
                        Selected project
                      </p>

                      <p className="mt-2 text-2xl font-black uppercase leading-none tracking-[-0.04em] text-color">
                        {project.title}
                      </p>
                    </div>

                    <div className="h-px w-full bg-color/20" />

                    <div className="space-y-2">
                      <p className="font-semibold">TAGS:</p>
                      {tags.length > 0 && (
                        <div className="space-y-1">
                          {tags.map((tag) => (
                            <p
                              key={tag}
                              className="text-[13px] uppercase tracking-[0.18em] text-color/55"
                            >
                              {tag}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="font-semibold">YEAR:</p>
                      {project.type && (
                        <p className="text-[13px] uppercase tracking-[0.18em] text-color/55">
                          {project.type}
                        </p>
                      )}

                      <p className="font-semibold">TOOLS:</p>
                      {tools && (
                        <p className="text-[13px] uppercase leading-6 tracking-[0.18em] text-color/55">
                          {tools}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </MagneticComp>
      </motion.div>
    </motion.div>
  );
}

function MobileProjectItem({
  project,
  index,
  left,
  top,
  baseScale,
  drift,
  driftDirection,
  scrollYProgress,
}: {
  project: ProjectListItem;
  index: number;
  left: string;
  top: number;
  baseScale: number;
  drift: number;
  driftDirection: 1 | -1;
  scrollYProgress: MotionValue<number>;
}) {
  const projectNumber = formatProjectNumber(index);

  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [drift * driftDirection, drift * driftDirection * -1],
  );

  const cardWidth = getMobileCardWidth(baseScale);
  const cardHeight = getMobileCardHeight(baseScale);

  return (
    <div
      className="absolute"
      style={{
        top,
        left: getSafeMobileLeft(left, baseScale),
      }}
    >
      <motion.div style={{ y: driftY, willChange: "transform" }}>
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
              sizes="(max-width: 767px) 320px, 320px"
            />
          </div>

          <div className="mt-4">
            <p className="text-[14px] uppercase tracking-[0.22em] text-color">
              {projectNumber} - {project.title}
            </p>
          </div>
        </TransitionLink>
      </motion.div>
    </div>
  );
}
