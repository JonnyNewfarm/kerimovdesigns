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
import { Project } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import MagneticComp from "@/components/MagneticComp";
import { usePathname } from "next/navigation";

type ProjectWithMeta = Project & {
  role?: string | null;
  type?: string | null;
  tools?: string[] | string | null;
};

interface MyProjectsProps {
  projects: ProjectWithMeta[];
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
  entrance: "blur" | "clean";
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
  entrance: "blur" | "clean";
};

const BASE_WIDTH = 580;
const BASE_HEIGHT = 430;

const DESKTOP_SAFE_PADDING = 24;
const MOBILE_SAFE_PADDING = 16;

const MOBILE_CONTAINER_MAX_WIDTH = 430;
const MOBILE_CARD_BASE_WIDTH = 320;
const MOBILE_CARD_BASE_HEIGHT = 214;

const desktopLayout: LayoutItem[] = [
  {
    left: "15%",
    leftMd: "15%",
    leftLg: "15%",
    leftXl: "15%",
    left2xl: "15%",
    top: 160,
    topMd: 160,
    topLg: 170,
    topXl: 170,
    top2xl: 170,
    scale: 0.9,
    drift: 95,
    driftDirection: -1,
    entrance: "blur",
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
    topXl: 300,
    top2xl: 300,
    scale: 0.75,
    drift: 90,
    driftDirection: 1,
    entrance: "clean",
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
    topXl: 950,
    top2xl: 950,
    scale: 0.9,
    drift: 90,
    driftDirection: -1,
    entrance: "blur",
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
    entrance: "clean",
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
    entrance: "blur",
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
    entrance: "clean",
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
    entrance: "blur",
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
    entrance: "clean",
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
    entrance: "blur",
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
    entrance: "clean",
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
    entrance: "blur",
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
    entrance: "clean",
  },
];

function formatTools(tools: ProjectWithMeta["tools"]) {
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
  const [activeMobileId, setActiveMobileId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportWidth = useViewportWidth();
  const pathname = usePathname();

  useEffect(() => {
    setHoveredId(null);
    setActiveMobileId(null);
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
      className="bg-dark text-color relative w-full mt-14 mb-20 overflow-hidden"
    >
      <div
        className="relative hidden w-full md:block"
        style={{ height: desktopSectionHeight }}
      >
        <div className="absolute left-[12%] top-16 z-30 flex items-start gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-color/45">
            06
          </span>
          <p className="text-3xl uppercase tracking-[0.22em] text-color/70">
            Recent Work
          </p>
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
              entrance={item.entrance}
              delay={index * 0.08}
              isActive={isActive}
              isDimmed={isDimmed}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          );
        })}

        <Link
          href="/projects"
          className="absolute left-[8%] top-[2480px] z-40 group"
        >
          <MagneticComp>
            <div className="leading-[0.8] uppercase tracking-[-0.04em]">
              <p className="text-6xl flex gap-x-2 items-center text-color/70 transition group-hover:text-color">
                view —
              </p>
              <p className="text-6xl text-color/70 transition group-hover:text-color">
                Archives
              </p>
            </div>
          </MagneticComp>
        </Link>
      </div>

      <div className="block md:hidden">
        <div
          className="relative  w-full"
          style={{
            maxWidth: MOBILE_CONTAINER_MAX_WIDTH,
            height: mobileSectionHeight,
          }}
        >
          <div className="absolute left-[8%] top-10 z-30 flex items-start gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-color/45">
              06
            </span>
            <p className="text-xl uppercase tracking-[0.22em] text-color/70">
              Recent Work
            </p>
          </div>

          {visibleProjects.map((project, index) => {
            const item = mobileLayout[index % mobileLayout.length];
            const resolvedLeft = getResponsiveMobileLeft(item, viewportWidth);
            const resolvedTop = getResponsiveMobileTop(item, viewportWidth);
            const resolvedScale = getResponsiveMobileScale(item, viewportWidth);

            const isActive = activeMobileId === project.id;
            const isDimmed =
              activeMobileId !== null && activeMobileId !== project.id;

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
                entrance={item.entrance}
                delay={index * 0.06}
                isActive={isActive}
                isDimmed={isDimmed}
                onToggle={() =>
                  setActiveMobileId((prev) =>
                    prev === project.id ? null : project.id,
                  )
                }
              />
            );
          })}

          <Link
            href="/projects"
            className="absolute left-[8%] z-40 group"
            style={{
              top: mobileSectionHeight - 90,
            }}
          >
            <MagneticComp>
              <div className="leading-[0.8] uppercase tracking-[-0.04em]">
                <p className="text-4xl flex gap-x-2 items-center text-color/70 transition group-hover:text-color">
                  view —
                </p>
                <p className="text-4xl text-color/70 transition group-hover:text-color">
                  Archives
                </p>
              </div>
            </MagneticComp>
          </Link>
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
  entrance,
  delay,
  isActive,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}: {
  project: ProjectWithMeta;
  index: number;
  left: string;
  top: number;
  baseScale: number;
  drift: number;
  driftDirection: 1 | -1;
  scrollYProgress: MotionValue<number>;
  entrance: "blur" | "clean";
  delay: number;
  isActive: boolean;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const tools = formatTools(project.tools);
  const useBlurEntrance = entrance === "blur";
  const projectNumber = formatProjectNumber(index);

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
      initial={useBlurEntrance ? { y: 60 } : { y: 36 }}
      whileInView={useBlurEntrance ? { y: 0, scale: 1 } : { y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: useBlurEntrance ? 1.05 : 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div style={{ y: driftY, willChange: "transform" }}>
        <MagneticComp>
          <motion.div
            initial="rest"
            animate={isActive ? "hover" : "rest"}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className="group"
            style={{ transformOrigin: "center center" }}
          >
            <Link href={`/project/${project.id}`} className="block">
              <motion.div
                animate={{
                  scale: isDimmed ? baseScale * 0.94 : baseScale,
                  filter: isDimmed ? "blur(6px)" : "blur(0px)",
                  opacity: isDimmed ? 0.7 : 1,
                }}
                transition={{
                  duration: 0.55,
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
                    duration: 0.6,
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
                        duration: 0.9,
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
                <div className="mt-5">
                  <p className="text-[18px] uppercase tracking-[0.22em] text-color">
                    {projectNumber} - {project.title}
                  </p>

                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 6,
                    }}
                    transition={{
                      duration: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pt-3 space-y-1.5 pointer-events-none"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {project.role && (
                      <p className="text-[14px] uppercase tracking-[0.18em] text-color/55">
                        {project.role}
                      </p>
                    )}

                    {project.type && (
                      <p className="text-[14px] uppercase tracking-[0.18em] text-color/55">
                        {project.type}
                      </p>
                    )}

                    {tools && (
                      <p className="text-[14px] uppercase tracking-[0.18em] text-color/55">
                        {tools}
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </Link>
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
  entrance,
  delay,
  isActive,
  isDimmed,
  onToggle,
}: {
  project: ProjectWithMeta;
  index: number;
  left: string;
  top: number;
  baseScale: number;
  drift: number;
  driftDirection: 1 | -1;
  scrollYProgress: MotionValue<number>;
  entrance: "blur" | "clean";
  delay: number;
  isActive: boolean;
  isDimmed: boolean;
  onToggle: () => void;
}) {
  const tools = formatTools(project.tools);
  const useBlurEntrance = entrance === "blur";
  const projectNumber = formatProjectNumber(index);

  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [drift * driftDirection, drift * driftDirection * -1],
  );

  const cardWidth = getMobileCardWidth(baseScale);
  const cardHeight = getMobileCardHeight(baseScale);

  return (
    <motion.div
      className="absolute"
      style={{
        top,
        left: getSafeMobileLeft(left, baseScale),
      }}
      initial={useBlurEntrance ? { y: 40, filter: "blur(14px)" } : { y: 26 }}
      whileInView={useBlurEntrance ? { y: 0, filter: "blur(0px)" } : { y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: useBlurEntrance ? 0.95 : 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div style={{ y: driftY, willChange: "transform" }}>
        <div
          className="block text-left"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <Link href={`/project/${project.id}`} className="block">
            <motion.div
              animate={{
                filter: isDimmed ? "blur(5px)" : "blur(0px)",
                opacity: isDimmed ? 0.72 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
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

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        height: 0,
                        filter: "blur(8px)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        height: "auto",
                        filter: "blur(0px)",
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        height: 0,
                        filter: "blur(6px)",
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-1.5">
                        {project.role && (
                          <p className="text-[10px] uppercase tracking-[0.18em] text-color/55">
                            {project.role}
                          </p>
                        )}
                        {project.type && (
                          <p className="text-[10px] uppercase tracking-[0.18em] text-color/55">
                            {project.type}
                          </p>
                        )}
                        {tools && (
                          <p className="text-[10px] uppercase tracking-[0.18em] text-color/55">
                            {tools}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
