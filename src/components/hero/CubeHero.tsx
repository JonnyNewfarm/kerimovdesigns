"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { usePageTransition } from "@/components/ClientPageTransitionWrapper";

import { useHeroIntro } from "../HeroIntroContext";
import LinkReveal from "../LinkReveal";
import LocalTime from "../LocalTime";
import TextReveal from "../TextReveal";
import TransitionLink from "../TransitionLink";

import Cube from "./Cube";
import CubeLoadingPlaceholder from "./CubeLoadingPlaceholder";
import HeroIntro from "./HeroIntro";
import useIsMdUp from "./hooks/UseIsMdup";
import useScrollLock from "./hooks/UseScrollLock";

const ease = [0.22, 1, 0.36, 1] as const;

const BOTTOM_REVEAL_DELAYS = {
  time: 0.05,
  status: 0.17,
  latestProject: 0.29,
  portfolio: 0.41,
} as const;

const BOTTOM_REVEAL_DURATION = 0.75;
const BOTTOM_REVEAL_STAGGER = 0.025;
const BOTTOM_REVEAL_Y = "115%";
const BOTTOM_REVEAL_ROTATE = 1.5;

type IndexProps = {
  title: string;
  href: string;
};

export default function Index({ href, title }: IndexProps) {
  const container = useRef<HTMLDivElement | null>(null);

  const isDraggingCubeRef = useRef(false);

  const clientWorkTransitionRef = useRef<HTMLAnchorElement | null>(null);
  const contactTransitionRef = useRef<HTMLAnchorElement | null>(null);
  const visualIdentityTransitionRef = useRef<HTMLAnchorElement | null>(null);
  const animationTransitionRef = useRef<HTMLAnchorElement | null>(null);
  const logoTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const isMdUp = useIsMdUp();

  const [hasMounted, setHasMounted] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);
  const [shouldUseIntro, setShouldUseIntro] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [cubeReady, setCubeReady] = useState(false);
  const [allowCanvasMount, setAllowCanvasMount] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isAlignCubeHovered, setIsAlignCubeHovered] = useState(false);

  const [alignCubeTrigger, setAlignCubeTrigger] = useState(0);

  const [hasInteractedWithCube, setHasInteractedWithCube] = useState(false);

  const [mobileOrbitEnabled, setMobileOrbitEnabled] = useState(false);

  const { isTransitioning } = usePageTransition();

  const { introExited, setIntroExited } = useHeroIntro();

  const canRevealBottomLine = introExited && cubeReady;

  const isCanvasActive = isHeroVisible && !isTransitioning;

  /*
   * SPACEBAR -> ALIGN CUBE
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      event.preventDefault();

      setHasInteractedWithCube(true);

      setAlignCubeTrigger((value) => value + 1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * STOP CANVAS WHEN HERO IS FAR AWAY
   */
  useEffect(() => {
    const element = container.current;

    if (!element) {
      return;
    }

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();

      const scrolledIntoHero = -rect.top;

      const stopAt = window.innerHeight * 1.9;

      setIsHeroVisible(scrolledIntoHero < stopAt);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * MOUNT CANVAS AFTER PAGE TRANSITION
   */
  useEffect(() => {
    if (isTransitioning) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAllowCanvasMount(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isTransitioning]);

  const handleCubeReady = useCallback(() => {
    setCubeReady(true);
  }, []);

  useScrollLock(hasMounted && !introExited);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  /*
   * SHOW CONTROLS AFTER USER SCROLLS
   */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value: number) => {
      if (value > 0.005) {
        setHasInteractedWithCube(true);
      }
    });

    return unsubscribe;
  }, [scrollYProgress]);

  const cubeProgress = useTransform(scrollYProgress, [0, 1], [0, 4.4]);

  const cubeScrollProgress = useSpring(cubeProgress, {
    stiffness: 140,
    damping: 27,
    mass: 0.15,
    restDelta: 0.001,
    restSpeed: 0.01,
  });

  /*
   * INTRO
   */
  useEffect(() => {
    setHasMounted(true);

    const hasSeenIntro = sessionStorage.getItem("hero-intro-seen") === "true";

    if (hasSeenIntro) {
      setShouldUseIntro(false);
      setIntroDone(true);
      setIntroExited(true);
      setIntroChecked(true);

      return;
    }

    setShouldUseIntro(true);
    setIntroDone(false);
    setIntroExited(false);
    setIntroChecked(true);

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("hero-intro-seen", "true");

      setIntroDone(true);
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [setIntroExited]);

  return (
    <motion.div
      ref={container}
      className="
        min-h-[230vh]
        border-white
        md:min-h-[230dvh]
      "
      initial={false}
      animate={{
        opacity: 1,
      }}
    >
      {/*
       * HIDDEN TRANSITION LINKS
       */}
      <div
        className="
          pointer-events-none
          fixed
          -left-[9999px]
          top-0
          opacity-0
        "
        aria-hidden="true"
      >
        <TransitionLink
          ref={contactTransitionRef}
          href="/contact"
          transitionLabel="Contact"
          tabIndex={-1}
          aria-hidden="true"
          className="
            fixed
            -left-[9999px]
            top-0
            opacity-0
          "
        >
          Contact
        </TransitionLink>

        <TransitionLink
          ref={clientWorkTransitionRef}
          href="/projects?tags=posters"
          transitionLabel="Posters"
          tabIndex={-1}
          aria-hidden="true"
          className="
            fixed
            -left-[9999px]
            top-0
            opacity-0
          "
        >
          Posters
        </TransitionLink>

        <TransitionLink
          ref={visualIdentityTransitionRef}
          href="/projects?tags=visual-identity"
          transitionLabel="Visual Identity"
          tabIndex={-1}
          aria-hidden="true"
          className="
            fixed
            -left-[9999px]
            top-0
            opacity-0
          "
        >
          Visual Identities
        </TransitionLink>

        <TransitionLink
          ref={animationTransitionRef}
          href="/projects?tags=animations"
          transitionLabel="Animations"
          tabIndex={-1}
          aria-hidden="true"
          className="
            fixed
            -left-[9999px]
            top-0
            opacity-0
          "
        >
          Animations
        </TransitionLink>

        <TransitionLink
          ref={logoTransitionRef}
          href="/projects?tags=logo-design"
          transitionLabel="Logo Design"
          tabIndex={-1}
          aria-hidden="true"
          className="
            fixed
            -left-[9999px]
            top-0
            opacity-0
          "
        >
          Logo Design
        </TransitionLink>
      </div>

      <div
        className="
          sticky
          top-0
          flex
          h-[100vh]
          flex-col
          items-center
          justify-center
          overflow-hidden
          uppercase
          md:h-[100dvh]
        "
      >
        {introChecked && shouldUseIntro && (
          <HeroIntro
            isDone={introDone}
            onExitComplete={() => {
              setIntroExited(true);
              setShouldUseIntro(false);
            }}
          />
        )}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <CubeLoadingPlaceholder visible={introExited && !cubeReady} />

          <motion.div
            initial={false}
            animate={{
              opacity: introDone && cubeReady ? 1 : 0,
            }}
            transition={{
              duration: 0.7,
              ease,
            }}
            style={{
              pointerEvents: introDone && cubeReady ? "auto" : "none",
            }}
            className="
              relative
              h-full
              w-full
            "
          >
            {hasMounted && allowCanvasMount && (
              <Canvas
                className="
                  h-3/4
                  w-full
                "
                dpr={isMdUp ? [1, 1.5] : 1.45}
                frameloop={isCanvasActive ? "always" : "never"}
                gl={{
                  antialias: false,
                  powerPreference: "high-performance",
                }}
              >
                {(isMdUp || mobileOrbitEnabled) && (
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate
                    enableDamping
                    dampingFactor={0.06}
                    rotateSpeed={0.65}
                    onStart={() => {
                      isDraggingCubeRef.current = true;
                      setHasInteractedWithCube(true);
                    }}
                    onEnd={() => {
                      isDraggingCubeRef.current = false;
                    }}
                  />
                )}

                <ambientLight intensity={2} />

                <directionalLight position={[2, 1, 1]} />

                <Suspense fallback={null}>
                  <Cube
                    isActive={isCanvasActive}
                    scrollProgress={cubeScrollProgress}
                    introDone={introDone}
                    isDraggingCubeRef={isDraggingCubeRef}
                    contactTransitionRef={contactTransitionRef}
                    clientWorkTransitionRef={clientWorkTransitionRef}
                    visualIdentityTransitionRef={visualIdentityTransitionRef}
                    animationTransitionRef={animationTransitionRef}
                    logoTransitionRef={logoTransitionRef}
                    onReady={handleCubeReady}
                    alignTrigger={alignCubeTrigger}
                  />
                </Suspense>
              </Canvas>
            )}

            {/*
             * VERTICAL DESKTOP SCROLL PROGRESS
             */}
            <motion.div
              initial={false}
              animate={
                hasInteractedWithCube
                  ? {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                    }
                  : {
                      opacity: 0,
                      x: 6,
                      filter: "blur(5px)",
                    }
              }
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                pointer-events-none
                absolute
                right-5
                top-1/2
                z-20
                hidden
                h-[30vh]
                w-px
                -translate-y-1/2
                overflow-hidden
                bg-white/20
                lg:block
              "
            >
              <motion.div
                className="
                  h-full
                  w-full
                  origin-top
                  bg-[#ecdfcc]
                "
                style={{
                  scaleY: scrollYProgress,
                }}
              />
            </motion.div>

            {/*
             * MOBILE CUBE CONTROLS
             */}
            <motion.div
              initial={false}
              animate={
                canRevealBottomLine && hasInteractedWithCube
                  ? {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      filter: "blur(0px)",
                    }
                  : {
                      opacity: 0,
                      x: -8,
                      y: 6,
                      filter: "blur(5px)",
                    }
              }
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                pointerEvents:
                  canRevealBottomLine && hasInteractedWithCube
                    ? "auto"
                    : "none",
              }}
              className="
                absolute
                bottom-6
                left-6
                z-30
                flex
                flex-col
                items-start
                lg:hidden
              "
            >
              <div className="mb-2 overflow-hidden">
                <motion.p
                  initial={false}
                  animate={
                    mobileOrbitEnabled
                      ? {
                          opacity: 0.8,
                          y: 0,
                        }
                      : {
                          opacity: 0,
                          y: 8,
                        }
                  }
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="
                    whitespace-nowrap
                    text-[13px]
                    font-normal
                    normal-case
                    text-color
                  "
                >
                  Swipe cube to rotate
                </motion.p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={mobileOrbitEnabled}
                  onClick={() => {
                    setMobileOrbitEnabled((current) => !current);
                  }}
                  className={`
                    flex
                    min-w-[92px]
                    cursor-pointer
                    items-center
                    justify-center
                    whitespace-nowrap
                    border-2
                    px-3
                    py-1.5
                   text-[12px]
                    sm:text-[13px]
                    font-semibold
                    uppercase
                    transition-colors
                    duration-300
                    ${
                      mobileOrbitEnabled
                        ? "border-[#ecdfcc] bg-[#ecdfcc] text-[#181c14]"
                        : "border-white/40 text-color"
                    }
                  `}
                >
                  {mobileOrbitEnabled ? "Lock cube" : "Rotate cube"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAlignCubeTrigger((value) => value + 1);
                  }}
                  className="
                    flex
                    cursor-pointer
                    items-center
                    whitespace-nowrap
                    border
                    border-[#515b4f]
                    bg-[#515b4f]
                    px-3
                    py-1.5
                    text-[12px]
                    sm:text-[13px]
                    font-semibold
                    uppercase
                    text-color
                  "
                >
                  Align cube
                </button>
              </div>
            </motion.div>

            {/* DESKTOP ALIGN CUBE CONTROL */}
            <motion.div
              initial={false}
              animate={
                hasInteractedWithCube
                  ? {
                      opacity: 1,
                      x: 0,
                      y: "-50%",
                      scale: 1,
                      filter: "blur(0px)",
                    }
                  : {
                      opacity: 0,
                      x: 8,
                      y: "-47%",
                      scale: 0.985,
                      filter: "blur(7px)",
                    }
              }
              transition={{
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
                opacity: {
                  duration: 0.75,
                  ease: "easeOut",
                },
                filter: {
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              style={{
                pointerEvents: hasInteractedWithCube ? "auto" : "none",
              }}
              className="
    absolute
    right-[14vw]
    top-1/2
    z-20
    hidden
    lg:block
    xl:right-[16vw]
  "
            >
              <div className="flex flex-col items-start gap-y-4">
                <div className="flex items-center gap-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAlignCubeTrigger((value) => value + 1);
                    }}
                    onMouseEnter={() => setIsAlignCubeHovered(true)}
                    onMouseLeave={() => setIsAlignCubeHovered(false)}
                    className="
          group
          flex
          cursor-pointer
          items-center
          border-[1px]
          border-white/40
          text-[12px]
          font-semibold
          uppercase
          focus:outline-none
          focus-visible:outline-none
          focus-visible:ring-0
          xl:text-lg
        "
                  >
                    <span
                      className="
            relative
            overflow-hidden
            px-3
            py-1.5
          "
                    >
                      <span
                        aria-hidden="true"
                        className="
              absolute
              inset-0
              origin-bottom
              scale-y-0
              bg-[#ecdfcc]
              transition-transform
              duration-500
              ease-[cubic-bezier(0.76,0,0.24,1)]
              group-hover:scale-y-100
            "
                      />

                      <span
                        className="
              relative
              z-10
              transition-colors
              duration-300
              group-hover:text-[#181c14]
            "
                      >
                        Align cube
                      </span>
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={
                      isAlignCubeHovered
                        ? {
                            opacity: 1,
                            x: 0,
                            filter: "blur(0px)",
                          }
                        : {
                            opacity: 0,
                            x: -6,
                            filter: "blur(4px)",
                          }
                    }
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="pointer-events-none"
                  >
                    <TextReveal
                      as="span"
                      mode="words"
                      viewport={false}
                      active={isAlignCubeHovered}
                      duration={0.5}
                      y="110%"
                      className="
            whitespace-nowrap
            text-[10px]
            font-semibold
            normal-case
            xl:text-[16px]
          "
                    >
                      or use Spacebar
                    </TextReveal>
                  </motion.div>
                </div>

                <motion.div
                  initial={false}
                  animate={
                    isAlignCubeHovered
                      ? {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }
                      : {
                          opacity: 0,
                          y: 6,
                          filter: "blur(5px)",
                        }
                  }
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pointer-events-none"
                >
                  <TextReveal
                    as="span"
                    mode="words"
                    viewport={false}
                    active={isAlignCubeHovered}
                    duration={0.5}
                    y="110%"
                    className="
          whitespace-nowrap
          text-[10px]
          font-semibold
          normal-case
          xl:text-[16px]
        "
                  >
                    Scroll or drag to rotate
                  </TextReveal>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/*
         * BOTTOM INFO
         */}
        <motion.div
          initial={false}
          animate={
            canRevealBottomLine
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }
              : {
                  opacity: 0,
                  y: 12,
                  filter: "blur(5px)",
                }
          }
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            pointerEvents: canRevealBottomLine ? "auto" : "none",
          }}
          className="
            absolute
            bottom-10
            left-0
            right-0
            z-10
            hidden
            px-10
            lg:block
            lg:px-20
          "
        >
          <div
            className="
              flex
              w-full
              items-end
              justify-between
            "
          >
            <div
              className="
                pointer-events-none
                hidden
                text-left
                lg:block
              "
            >
              <div className="relative pt-6">
                <TextReveal
                  as="h1"
                  mode="words"
                  viewport={false}
                  active={canRevealBottomLine}
                  delay={BOTTOM_REVEAL_DELAYS.portfolio}
                  stagger={BOTTOM_REVEAL_STAGGER}
                  duration={BOTTOM_REVEAL_DURATION}
                  y={BOTTOM_REVEAL_Y}
                  rotate={BOTTOM_REVEAL_ROTATE}
                  className="
                    satoshi-black
                    relative
                    whitespace-nowrap
                    leading-[0.95]
                    tracking-[-0.02em]
                    text-color
                    lg:text-4xl
                  "
                >
                  Portfolio / 2026
                </TextReveal>
              </div>
            </div>

            <LinkReveal
              active={canRevealBottomLine}
              delay={BOTTOM_REVEAL_DELAYS.latestProject}
              duration={BOTTOM_REVEAL_DURATION}
              y={BOTTOM_REVEAL_Y}
              rotate={BOTTOM_REVEAL_ROTATE}
            >
              <div
                className="
                  flex
                  items-center
                  gap-x-1
                  whitespace-nowrap
                  text-[10px]
                  xl:text-[14px]
                "
              >
                <span
                  className="
                    satoshi-black
                    leading-none
                    tracking-[-0.02em]
                    text-color
                  "
                >
                  Latest Project
                </span>

                <span>/</span>

                <TransitionLink
                  className="
                    group
                    relative
                  "
                  href={`/project/${href}`}
                  transitionLabel={title}
                >
                  <span
                    className="
                      satoshi-black
                      leading-none
                      tracking-[-0.02em]
                      text-color
                    "
                  >
                    {title}
                  </span>

                  <span
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-0
                      h-px
                      w-full
                      overflow-hidden
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-0
                        origin-right
                        scale-x-100
                        bg-current
                        transition-transform
                        duration-500
                        ease-[cubic-bezier(0.76,0,0.24,1)]
                        group-hover:scale-x-0
                      "
                    />

                    <span
                      className="
                        absolute
                        inset-0
                        origin-left
                        scale-x-0
                        bg-current
                        transition-transform
                        duration-500
                        delay-0
                        ease-[cubic-bezier(0.76,0,0.24,1)]
                        group-hover:scale-x-100
                        group-hover:delay-[180ms]
                      "
                    />
                  </span>
                </TransitionLink>
              </div>
            </LinkReveal>

            <div
              className="
                hidden
                text-[10px]
                lg:block
                xl:text-[14px]
              "
            >
              <TextReveal
                as="p"
                mode="words"
                viewport={false}
                active={canRevealBottomLine}
                delay={BOTTOM_REVEAL_DELAYS.status}
                stagger={BOTTOM_REVEAL_STAGGER}
                duration={BOTTOM_REVEAL_DURATION}
                y={BOTTOM_REVEAL_Y}
                rotate={BOTTOM_REVEAL_ROTATE}
                className="
                  satoshi-black
                  whitespace-nowrap
                  leading-none
                  tracking-[-0.02em]
                  text-color
                "
              >
                Status / Open for work
              </TextReveal>
            </div>

            <div
              className="
                hidden
                text-[10px]
                lg:block
                xl:text-[14px]
              "
            >
              <LinkReveal
                active={canRevealBottomLine}
                delay={BOTTOM_REVEAL_DELAYS.time}
                duration={BOTTOM_REVEAL_DURATION}
                y={BOTTOM_REVEAL_Y}
                rotate={BOTTOM_REVEAL_ROTATE}
              >
                <p
                  className="
                    satoshi-black
                    whitespace-nowrap
                    leading-none
                    tracking-[-0.02em]
                    text-color
                  "
                >
                  <LocalTime />
                </p>
              </LinkReveal>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
