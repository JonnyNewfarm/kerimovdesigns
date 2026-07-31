"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { OrbitControls } from "@react-three/drei";

import HeroIntro from "./HeroIntro";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "../TransitionLink";
import LocalTime from "../LocalTime";
import { usePageTransition } from "@/components/ClientPageTransitionWrapper";

import Cube from "./Cube";
import CubeLoadingPlaceholder from "./CubeLoadingPlaceholder";
import useIsMdUp from "./hooks/UseIsMdup";
import useScrollLock from "./hooks/UseScrollLock";

const ease = [0.22, 1, 0.36, 1] as const;

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

  const { isTransitioning } = usePageTransition();

  const [allowCanvasMount, setAllowCanvasMount] = useState(false);

  const [introExited, setIntroExited] = useState(false);

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

  const progress = useTransform(scrollYProgress, [0, 1], [0, 4.4]);

  const smoothProgress = useSpring(progress, {
    damping: 20,
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
  }, []);

  return (
    <motion.div
      ref={container}
      className="min-h-[150vh] md:min-h-[150dvh]"
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
                key="hero-canvas-ready"
                className="h-3/4 w-full"
                dpr={isMdUp ? [1, 1.5] : 1.35}
                frameloop={
                  isTransitioning
                    ? "never"
                    : introExited && cubeReady
                      ? "always"
                      : "demand"
                }
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
                    key="cube-ready"
                    scrollProgress={smoothProgress}
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
            introDone
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                }
              : {
                  opacity: 0,
                  x: -30,
                  y: 20,
                }
          }
          transition={{
            duration: 0.9,
            delay: introDone ? 0.15 : 0,
            ease,
          }}
          className="
            pointer-events-none
            absolute
            bottom-[calc(1.5rem+100vh-100dvh)]
            left-6
            z-10
            text-left
            transition-[bottom]
            duration-200
            ease-out
            md:bottom-10
            md:left-10
            md:translate-x-0
            lg:left-14
          "
        >
          {introDone && (
            <div
              className="
                relative
                hidden
                pt-6
                lg:block
              "
            >
              <p
                className="
                  absolute
                  right-0
                  top-0
                  text-sm
                "
              >
                2026
              </p>

              <TextReveal
                as="h1"
                mode="words"
                viewport={false}
                delay={0.05}
                className="
                  satoshi-black
                  relative
                  leading-[0.95]
                  tracking-[-0.02em]
                  text-color
                  lg:text-5xl
                "
              >
                Portfolio
              </TextReveal>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={false}
          animate={
            introDone
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                }
              : {
                  opacity: 0,
                  x: 30,
                  y: 20,
                }
          }
          transition={{
            duration: 0.9,
            delay: introDone ? 0.2 : 0,
            ease,
          }}
          className="
            absolute
            bottom-6
            right-6
            z-10
            text-right
            text-[10px]
            sm:flex
            sm:flex-col
            sm:gap-y-2
            md:bottom-10
            md:right-10
            lg:right-14
            lg:flex
            lg:flex-row
            lg:gap-x-22
            xl:gap-x-34
            xl:text-[14px]
          "
        >
          {introDone && (
            <>
              <div
                className="
                  flex
                  flex-row
                  items-center
                  gap-x-1
                  text-[12px]
                  md:text-[10px]
                  xl:text-[14px]
                "
              >
                <TextReveal
                  className="
                    satoshi-black
                    leading-none
                    tracking-[-0.02em]
                    text-color
                  "
                >
                  Latest Project
                </TextReveal>

                <TextReveal className="">/</TextReveal>

                <TransitionLink
                  className="
                    group
                    relative
                    -mb-1.5
                  "
                  href={`/project/${href}`}
                  transitionLabel={title}
                >
                  <TextReveal
                    as="span"
                    mode="words"
                    viewport={false}
                    delay={0.16}
                    className="
                      satoshi-black
                      leading-none
                      tracking-[-0.02em]
                      text-color
                    "
                  >
                    {title}
                  </TextReveal>

                  <span
                    className="
                      pointer-events-none
                      absolute
                      bottom-1
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

              <TextReveal
                as="p"
                mode="words"
                viewport={false}
                delay={0.16}
                className="
                  satoshi-black
                  hidden
                  leading-none
                  tracking-[-0.02em]
                  text-color
                  lg:block
                "
              >
                Status / Open for work
              </TextReveal>

              <p
                className="
                  satoshi-black
                  hidden
                  leading-none
                  tracking-[-0.02em]
                  text-color
                  md:block
                "
              >
                <LocalTime />
              </p>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
