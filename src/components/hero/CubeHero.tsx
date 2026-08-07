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

  const { isTransitioning } = usePageTransition();
  const { introExited, setIntroExited } = useHeroIntro();

  const canRevealBottomLine = introExited && cubeReady;
  const isCanvasActive = isHeroVisible && !isTransitioning;

  useEffect(() => {
    const element = container.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const cubeProgress = useTransform(scrollYProgress, [0, 1], [0, 4.4]);

  const cubeScrollProgress = useSpring(cubeProgress, {
    stiffness: 140,
    damping: 27,
    mass: 0.15,
    restDelta: 0.001,
    restSpeed: 0.01,
  });

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
      className="min-h-[230vh] border-white md:min-h-[230dvh]"
      initial={false}
      animate={{
        opacity: 1,
      }}
    >
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
          href="/projects?tags=client-work"
          transitionLabel="Client Work"
          tabIndex={-1}
          aria-hidden="true"
          className="
            fixed
            -left-[9999px]
            top-0
            opacity-0
          "
        >
          Client Work
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
            className="relative h-full w-full"
          >
            {hasMounted && allowCanvasMount && (
              <Canvas
                className="h-3/4 w-full"
                dpr={isMdUp ? [1, 1.5] : 1.35}
                frameloop={isCanvasActive ? "always" : "never"}
                gl={{
                  antialias: false,
                  powerPreference: "high-performance",
                }}
              >
                {isMdUp && (
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate
                    enableDamping
                    dampingFactor={0.06}
                    rotateSpeed={0.65}
                    onStart={() => {
                      isDraggingCubeRef.current = true;
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
                  />
                </Suspense>
              </Canvas>
            )}
          </motion.div>
        </div>

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
            bottom-6
            left-0
            right-0
            z-10
            px-6
            md:bottom-10
            md:px-10
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
                  text-[12px]
                  md:text-[10px]
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
