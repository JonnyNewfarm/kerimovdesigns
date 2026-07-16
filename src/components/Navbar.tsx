"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import WaveLinkText from "./WaveLink";
import TransitionLink from "./TransitionLink";
import { useProjectNav } from "./ProjectNavContext";

const PROJECT_EASE = [0.76, 0, 0.24, 1] as const;

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { projectTitle } = useProjectNav();

  const [showProjectTitle, setShowProjectTitle] = useState(true);
  const [isProjectTitleHovered, setIsProjectTitleHovered] = useState(false);

  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const isProjectDetailPage = pathname.startsWith("/project/");

  useEffect(() => {
    if (!isProjectDetailPage) {
      setShowProjectTitle(false);
      setIsProjectTitleHovered(false);
      return;
    }

    setShowProjectTitle(true);
    lastScrollYRef.current = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const scrollDifference = currentScrollY - previousScrollY;

      if (currentScrollY <= 20) {
        setShowProjectTitle(true);
        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
        return;
      }

      if (Math.abs(scrollDifference) < 5) {
        tickingRef.current = false;
        return;
      }

      if (scrollDifference > 0) {
        setShowProjectTitle(false);
        setIsProjectTitleHovered(false);
      } else {
        setShowProjectTitle(true);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;
      window.requestAnimationFrame(updateScrollDirection);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isProjectDetailPage, pathname]);

  const handleCloseProject = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/projects");
  };

  const getLinkClassName = (href: string) => {
    const isActive =
      pathname === href ||
      (href === "/projects" &&
        (pathname.startsWith("/projects") || pathname.startsWith("/project/")));

    return [
      "inline-block transition-opacity duration-300",
      isActive ? "opacity-100" : "opacity-80 hover:opacity-100",
    ].join(" ");
  };

  return (
    <div className="fixed top-0 z-[99] hidden w-full md:block">
      <div className="z-50 flex w-full items-start justify-between bg-dark px-20 py-3 text-[16px] font-extrabold text-color">
        <div className="h-full w-full">
          <div className="flex items-start justify-between">
            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Name:</h1>
              <p className="m-0 leading-tight">Rustam Kerimov</p>
            </div>

            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Occupation:</h1>

              <p className="m-0 leading-tight">Graphic designer</p>
            </div>

            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Location:</h1>

              <p className="m-0 leading-tight">Oslo, Norway</p>
            </div>

            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Navigation:</h1>

              <div className="m-0 flex gap-x-1 leading-tight">
                <TransitionLink
                  href="/"
                  transitionLabel="Welcome Back"
                  direction="right"
                  className={getLinkClassName("/")}
                >
                  <WaveLinkText text="Home," />
                </TransitionLink>

                <div className="relative inline-block">
                  <TransitionLink
                    href="/projects"
                    transitionLabel="Selected Work"
                    direction="left"
                    className={getLinkClassName("/projects")}
                  >
                    <WaveLinkText text="My work," />
                  </TransitionLink>

                  <AnimatePresence initial={false}>
                    {isProjectDetailPage && projectTitle && (
                      <motion.div
                        className={`absolute left-1/2 top-full mt-[3px] whitespace-nowrap ${
                          showProjectTitle
                            ? "pointer-events-auto"
                            : "pointer-events-none"
                        }`}
                        initial={false}
                        animate={showProjectTitle ? "visible" : "hidden"}
                        variants={{
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.08,
                              delayChildren: 0.05,
                            },
                          },
                          hidden: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.04,
                              staggerDirection: -1,
                            },
                          },
                        }}
                      >
                        <div className="flex -translate-x-full items-end">
                          <motion.button
                            type="button"
                            onClick={handleCloseProject}
                            onMouseEnter={() => setIsProjectTitleHovered(true)}
                            onMouseLeave={() => setIsProjectTitleHovered(false)}
                            aria-label={`Close ${projectTitle} and go back`}
                            variants={{
                              visible: {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                                transition: {
                                  duration: 0.42,
                                  delay: 0.15,
                                  ease: PROJECT_EASE,
                                },
                              },
                              hidden: {
                                opacity: 0,
                                y: -8,
                                filter: "blur(4px)",
                                transition: {
                                  duration: 0.3,
                                  delay: 0.25,
                                  ease: PROJECT_EASE,
                                },
                              },
                            }}
                            className="relative mr-2 flex cursor-pointer items-end border-0 bg-transparent p-0 text-current"
                          >
                            <motion.span
                              aria-hidden="true"
                              initial={false}
                              animate={{
                                opacity: isProjectTitleHovered ? 1 : 0,
                                x: isProjectTitleHovered ? -2 : 0,
                                scale: isProjectTitleHovered ? 1 : 0.8,
                              }}
                              transition={{
                                duration: 0.35,
                                ease: PROJECT_EASE,
                              }}
                              className="absolute -left-5 -top-[2px] flex h-5 w-5 -translate-y-1/2 items-center justify-center"
                            >
                              <span className="absolute h-[1.5px] w-[10px] rotate-45 bg-current" />
                              <span className="absolute h-[1.5px] w-[10px] -rotate-45 bg-current" />
                            </motion.span>

                            <motion.span
                              initial={false}
                              animate={{
                                opacity: isProjectTitleHovered ? 1 : 0.9,
                              }}
                              transition={{
                                duration: 0.4,
                                ease: PROJECT_EASE,
                              }}
                              className="mb-[-2px] block max-w-[240px] truncate text-[10px] font-black uppercase leading-none tracking-[0.18em]"
                            >
                              {projectTitle}
                            </motion.span>
                          </motion.button>

                          <motion.svg
                            aria-hidden="true"
                            width="42"
                            height="28"
                            viewBox="0 0 42 28"
                            fill="none"
                            className="block shrink-0 overflow-visible"
                            initial={false}
                            animate={showProjectTitle ? "visible" : "hidden"}
                          >
                            <motion.path
                              d="M41 1V27H1"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                              variants={{
                                visible: {
                                  pathLength: 1,
                                  pathOffset: 0,
                                  opacity: 0.65,
                                  transition: {
                                    pathLength: {
                                      duration: 0.7,
                                      ease: PROJECT_EASE,
                                    },
                                    pathOffset: {
                                      duration: 0.7,
                                      ease: PROJECT_EASE,
                                    },
                                    opacity: {
                                      duration: 0.12,
                                    },
                                  },
                                },
                                hidden: {
                                  pathLength: 0,
                                  pathOffset: 1,
                                  opacity: 0,
                                  transition: {
                                    pathLength: {
                                      duration: 0.55,
                                      ease: PROJECT_EASE,
                                    },
                                    pathOffset: {
                                      duration: 0.55,
                                      ease: PROJECT_EASE,
                                    },
                                    opacity: {
                                      duration: 0.1,
                                      delay: 0.45,
                                    },
                                  },
                                },
                              }}
                            />
                          </motion.svg>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <TransitionLink
                  href="/contact"
                  transitionLabel="Let's Collaborate"
                  direction="right"
                  className={getLinkClassName("/contact")}
                >
                  <WaveLinkText text="Contact" />
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
