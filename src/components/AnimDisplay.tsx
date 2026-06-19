"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import TextReveal from "./TextReveal";

const ease = [0.22, 1, 0.36, 1] as const;

const animations = [
  {
    title: "Echo",
    heading: "Moving graphics",
    type: "Animated graphics",
    description:
      "A high-energy visual piece built around movement, contrast and bold screen composition.",
    video: "/echo-new.mp4",
    href: "/project/692fa8ade953917a4953f016",
    hoverText: "View case",
    cursorClass: "text-[#c8dde6]",
  },
  {
    title: "Drømmenes Melodi",
    heading: "Visual identity",
    type: "Visual identity",
    description:
      "A visual identity direction shaped through strong graphic contrast, clean composition and bold image pairing.",
    images: ["/visual-01.jpeg", "/visual-02.jpeg"],
    href: "/project/69300cd7a94f6af6c6b7d9d8",
    hoverText: "View case",
    cursorClass: "text-[#34294a]",
  },
];

export default function AnimDisplay() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const activeProjectRef = useRef<HTMLAnchorElement | null>(null);
  const latestMouseRef = useRef({ x: 0, y: 0 });

  const [isLg, setIsLg] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [cursorClass, setCursorClass] = useState("text-white");
  const [isHoveringProject, setIsHoveringProject] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  const cursorY = useSpring(mouseY, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  useEffect(() => {
    const checkScreen = () => setIsLg(window.innerWidth >= 1024);

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!activeProjectRef.current) return;

      const rect = activeProjectRef.current.getBoundingClientRect();
      const { x, y } = latestMouseRef.current;

      const isStillInside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (!isStillInside) {
        setIsHoveringProject(false);
        activeProjectRef.current = null;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const firstY = useTransform(scrollYProgress, [0, 1], [-10, 20]);
  const secondY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    latestMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLAnchorElement>,
    text: string,
    newCursorClass: string,
  ) => {
    activeProjectRef.current = event.currentTarget;

    latestMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    mouseX.set(event.clientX);
    mouseY.set(event.clientY);

    setHoverText(text);
    setCursorClass(newCursorClass);
    setIsHoveringProject(true);
  };

  const handleMouseLeave = () => {
    setIsHoveringProject(false);
    activeProjectRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-dark px-4 py-24 text-color md:px-10 md:py-32 lg:px-16"
    >
      <motion.div
        aria-hidden="true"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          opacity: isHoveringProject ? 1 : 0,
          scale: isHoveringProject ? 1 : 0.35,
        }}
        transition={{
          opacity: { duration: 0.2, ease: "easeOut" },
          scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 lg:flex"
      >
        <div
          className={`text-center text-[7vw] font-black uppercase leading-[0.78] tracking-[-0.035em] md:text-[5.8vw] lg:text-[4.8vw] ${cursorClass}`}
        >
          {hoverText}
        </div>
      </motion.div>

      <div className="mx-auto w-full max-w-[1800px]">
        <div className="flex flex-col gap-32 lg:gap-48">
          {animations.map((item, index) => {
            const projectY = index === 0 ? firstY : secondY;

            return (
              <motion.article
                key={item.title}
                style={isLg ? { y: projectY } : undefined}
                className={`grid grid-cols-1 gap-6 ${
                  index === 1 ? "lg:ml-auto lg:w-[75%]" : "lg:w-[78%]"
                }`}
              >
                <div>
                  <TextReveal
                    as="p"
                    mode="words"
                    delay={0.05}
                    className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-color/45 md:text-sm"
                  >
                    {item.title}
                  </TextReveal>

                  <TextReveal
                    as="h2"
                    mode="words"
                    delay={0.12}
                    className="max-w-[1100px] text-[14vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[8vw] lg:text-[5.8vw]"
                  >
                    {item.heading}
                  </TextReveal>
                </div>

                {item.video ? (
                  <Link
                    href={item.href}
                    aria-label={`View ${item.title}`}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={(event) =>
                      handleMouseEnter(event, item.hoverText, item.cursorClass)
                    }
                    onMouseLeave={handleMouseLeave}
                    className="group relative block aspect-video w-full overflow-hidden bg-color/[0.04]"
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      src={item.video}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-dark/0 transition-colors duration-500 group-hover:bg-dark/10" />
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    aria-label={`View ${item.title}`}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={(event) =>
                      handleMouseEnter(event, item.hoverText, item.cursorClass)
                    }
                    onMouseLeave={handleMouseLeave}
                    className="group relative grid aspect-video w-full grid-cols-2 overflow-hidden bg-color/[0.04]"
                  >
                    {item.images?.map((image, imageIndex) => (
                      <div
                        key={image}
                        className="relative h-full w-full overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`${item.title} image ${imageIndex + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 38vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    ))}

                    <div className="pointer-events-none absolute inset-0 bg-dark/0 transition-colors duration-500 group-hover:bg-dark/10" />
                  </Link>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.45fr_1fr] md:items-start">
                  <div>
                    <TextReveal
                      as="p"
                      mode="words"
                      delay={0.08}
                      className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-color/40"
                    >
                      {`0${index + 1} / ${item.type}`}
                    </TextReveal>

                    <TextReveal
                      as="h3"
                      mode="words"
                      delay={0.14}
                      className="text-[6vw] font-black uppercase leading-[0.86] tracking-[-0.04em] text-color md:text-[5vw] lg:text-[3.6vw]"
                    >
                      {item.title}
                    </TextReveal>
                  </div>

                  <TextReveal
                    as="p"
                    mode="words"
                    delay={0.2}
                    className="max-w-[620px] text-base font-bold leading-[1.35] text-color/55 md:justify-self-end md:text-right md:text-lg"
                  >
                    {item.description}
                  </TextReveal>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-24 md:mt-32 lg:mt-40">
          <TextReveal
            as="h2"
            mode="words"
            delay={0.05}
            className="max-w-[1300px] text-[12vw] font-semibold uppercase leading-[0.9] tracking-[-0.035em] md:text-[6.4vw] lg:text-[5vw]"
          >
            Selected work across motion and identity.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
