"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useContactOverlay } from "../contact/ContactOverlayProvider";
import { useHeroIntro } from "../HeroIntroContext";
import LinkReveal from "../LinkReveal";
import { useProjectNav } from "../ProjectNavContext";
import TextReveal from "../TextReveal";
import TransitionLink from "../TransitionLink";
import WaveLinkText from "../WaveLink";

const PROJECT_EASE = [0.76, 0, 0.24, 1] as const;

const INFO_HIDE_SCROLL = 80;

const REVEAL_DELAYS = {
  name: 0.05,
  occupation: 0.17,
  location: 0.29,
  home: 0.41,
  work: 0.49,
  contact: 0.57,
} as const;

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { introExited } = useHeroIntro();
  const { projectTitle } = useProjectNav();

  const { isContactOpen, openContact } = useContactOverlay();

  const [showProjectTitle, setShowProjectTitle] = useState(true);
  const [isProjectTitleHovered, setIsProjectTitleHovered] = useState(false);
  const [showSecondaryInfo, setShowSecondaryInfo] = useState(true);

  const lastScrollYRef = useRef(0);
  const projectTitleTickingRef = useRef(false);
  const navbarInfoTickingRef = useRef(false);

  const isHomePage = pathname === "/";
  const isProjectDetailPage = pathname.startsWith("/project/");

  const shouldShowNavbar = !isHomePage || introExited;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateNavbarInfo = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      if (currentScrollY <= INFO_HIDE_SCROLL) {
        setShowSecondaryInfo(true);

        lastScrollY = currentScrollY;
        navbarInfoTickingRef.current = false;

        return;
      }

      if (Math.abs(scrollDifference) < 4) {
        navbarInfoTickingRef.current = false;

        return;
      }

      if (scrollDifference > 0) {
        setShowSecondaryInfo(false);
      } else {
        setShowSecondaryInfo(true);
      }

      lastScrollY = currentScrollY;
      navbarInfoTickingRef.current = false;
    };

    const handleNavbarInfoScroll = () => {
      if (navbarInfoTickingRef.current) {
        return;
      }

      navbarInfoTickingRef.current = true;

      window.requestAnimationFrame(updateNavbarInfo);
    };

    window.addEventListener("scroll", handleNavbarInfoScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleNavbarInfoScroll);
    };
  }, []);

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
        projectTitleTickingRef.current = false;

        return;
      }

      if (Math.abs(scrollDifference) < 5) {
        projectTitleTickingRef.current = false;

        return;
      }

      if (scrollDifference > 0) {
        setShowProjectTitle(false);
        setIsProjectTitleHovered(false);
      } else {
        setShowProjectTitle(true);
      }

      lastScrollYRef.current = currentScrollY;
      projectTitleTickingRef.current = false;
    };

    const handleProjectTitleScroll = () => {
      if (projectTitleTickingRef.current) {
        return;
      }

      projectTitleTickingRef.current = true;

      window.requestAnimationFrame(updateScrollDirection);
    };

    window.addEventListener("scroll", handleProjectTitleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleProjectTitleScroll);
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
      href === "/contact"
        ? pathname === "/contact" || isContactOpen
        : pathname === href ||
          (href === "/projects" &&
            (pathname.startsWith("/projects") ||
              pathname.startsWith("/project/")));

    return [
      `
        relative
        inline-block

        -mt-1

        text-[clamp(1.15rem,1.55vw,1.5rem)]

        transition-opacity
        duration-300

        outline-none

        after:absolute
        after:left-0
        after:-bottom-[3px]
        after:h-[2px]
        after:w-full
        after:origin-left
        after:scale-x-0
        after:bg-current
        after:transition-transform
        after:duration-300

        focus-visible:opacity-100
        focus-visible:after:scale-x-100
      `,
      isActive ? "opacity-100" : "opacity-80 hover:opacity-100",
    ].join(" ");
  };

  const secondaryInfoAnimation = showSecondaryInfo
    ? {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }
    : {
        opacity: 0,
        y: -8,
        filter: "blur(5px)",
      };

  const secondaryInfoClassName = `shrink-0 whitespace-nowrap tracking-tighter ${
    showSecondaryInfo ? "pointer-events-auto" : "pointer-events-none"
  }`;

  return (
    <motion.nav
      initial={false}
      animate={
        shouldShowNavbar
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }
          : {
              opacity: 0,
              y: -12,
              filter: "blur(5px)",
            }
      }
      transition={{
        duration: 0.8,
        delay: isHomePage && introExited ? 0.04 : 0,
        ease: PROJECT_EASE,
      }}
      style={{
        pointerEvents: shouldShowNavbar ? "auto" : "none",
      }}
      className="
        fixed
        top-0
        z-[99]

        hidden
        w-full

        bg-transparent

        py-4

        lg:block
      "
    >
      <div
        className="
          text-color
          z-50

          w-full

          px-[clamp(2.5rem,4.5vw,5rem)]
          py-3

          text-[clamp(0.7rem,0.9vw,0.875rem)]
          font-extrabold
        "
      >
        <div
          className="
            flex
            w-full
            min-w-0

            items-start
            justify-between

            gap-x-[clamp(1.5rem,2.5vw,4rem)]
          "
        >
          <motion.div
            initial={false}
            animate={secondaryInfoAnimation}
            transition={{
              duration: showSecondaryInfo ? 0.6 : 0.4,
              ease: PROJECT_EASE,
            }}
            className={secondaryInfoClassName}
          >
            <TextReveal
              as="p"
              mode="words"
              viewport={false}
              active={shouldShowNavbar}
              delay={REVEAL_DELAYS.name}
              stagger={0.025}
              duration={0.75}
              y="115%"
              rotate={1.5}
              className="
                m-0
                whitespace-nowrap
                uppercase
                leading-tight
              "
            >
              Name / Rustam Kerimov
            </TextReveal>
          </motion.div>

          <motion.div
            initial={false}
            animate={secondaryInfoAnimation}
            transition={{
              duration: showSecondaryInfo ? 0.6 : 0.4,
              delay: showSecondaryInfo ? 0.05 : 0,
              ease: PROJECT_EASE,
            }}
            className={secondaryInfoClassName}
          >
            <TextReveal
              as="p"
              mode="words"
              viewport={false}
              active={shouldShowNavbar}
              delay={REVEAL_DELAYS.occupation}
              stagger={0.025}
              duration={0.75}
              y="115%"
              rotate={1.5}
              className="
                m-0
                whitespace-nowrap
                uppercase
                leading-tight
              "
            >
              Occupation / Graphic designer
            </TextReveal>
          </motion.div>

          <motion.div
            initial={false}
            animate={secondaryInfoAnimation}
            transition={{
              duration: showSecondaryInfo ? 0.6 : 0.4,
              delay: showSecondaryInfo ? 0.1 : 0,
              ease: PROJECT_EASE,
            }}
            className={secondaryInfoClassName}
          >
            <TextReveal
              as="p"
              mode="words"
              viewport={false}
              active={shouldShowNavbar}
              delay={REVEAL_DELAYS.location}
              stagger={0.025}
              duration={0.75}
              y="115%"
              rotate={1.5}
              className="
                m-0
                whitespace-nowrap
                uppercase
                leading-tight
              "
            >
              Location / Oslo, Norway
            </TextReveal>
          </motion.div>

          <div
            className="
              shrink-0

              whitespace-nowrap
              tracking-tighter
            "
          >
            <div
              className="
                m-0
                flex
                items-center

                gap-x-[clamp(0.7rem,1vw,1rem)]

                whitespace-nowrap
                leading-tight
              "
            >
              <LinkReveal
                active={shouldShowNavbar}
                delay={REVEAL_DELAYS.home}
                duration={0.75}
                y="115%"
                rotate={1.5}
              >
                <TransitionLink
                  href="/"
                  transitionLabel="Index"
                  className={getLinkClassName("/")}
                >
                  <WaveLinkText text="HOME" />
                </TransitionLink>
              </LinkReveal>

              <div className="relative inline-block">
                <LinkReveal
                  active={shouldShowNavbar}
                  delay={REVEAL_DELAYS.work}
                  duration={0.75}
                  y="115%"
                  rotate={1.5}
                >
                  <TransitionLink
                    href="/projects"
                    transitionLabel="Selected Work"
                    className={getLinkClassName("/projects")}
                  >
                    <WaveLinkText text="MY WORK" />
                  </TransitionLink>
                </LinkReveal>

                <AnimatePresence initial={false}>
                  {isProjectDetailPage && projectTitle ? (
                    <motion.div
                      className={`
                        absolute
                        left-1/2
                        top-full

                        mt-[3px]

                        whitespace-nowrap

                        ${
                          showProjectTitle
                            ? "pointer-events-auto"
                            : "pointer-events-none"
                        }
                      `}
                      initial="hidden"
                      animate={showProjectTitle ? "visible" : "hidden"}
                      variants={{
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",

                          transition: {
                            duration: 0.55,
                            ease: PROJECT_EASE,

                            staggerChildren: 0.06,
                            delayChildren: 0.06,
                          },
                        },

                        hidden: {
                          opacity: 0,
                          y: -7,
                          filter: "blur(4px)",

                          transition: {
                            duration: 0.38,
                            ease: PROJECT_EASE,

                            staggerChildren: 0.035,
                            staggerDirection: -1,
                          },
                        },
                      }}
                    >
                      <div className="flex -translate-x-full items-end">
                        {/* =========================================
                            PROJECT TITLE
                        ========================================== */}

                        <motion.button
                          type="button"
                          onClick={handleCloseProject}
                          onMouseEnter={() => setIsProjectTitleHovered(true)}
                          onMouseLeave={() => setIsProjectTitleHovered(false)}
                          aria-label={`Close ${projectTitle} and go back`}
                          variants={{
                            visible: {
                              opacity: 1,
                              x: 0,
                              y: 0,

                              transition: {
                                duration: 0.5,
                                ease: PROJECT_EASE,
                              },
                            },

                            hidden: {
                              opacity: 0,
                              x: 6,
                              y: -3,

                              transition: {
                                duration: 0.32,
                                ease: PROJECT_EASE,
                              },
                            },
                          }}
                          className="
                            relative

                            mr-2

                            flex
                            cursor-pointer
                            items-end

                            border-0
                            bg-transparent

                            p-0

                            text-current
                          "
                        >
                          <motion.span
                            aria-hidden="true"
                            initial={false}
                            animate={{
                              opacity: isProjectTitleHovered ? 1 : 0,
                              scale: isProjectTitleHovered ? 1 : 0,
                              rotate: isProjectTitleHovered ? 0 : -90,
                            }}
                            transition={{
                              duration: 0.35,
                              ease: PROJECT_EASE,
                            }}
                            style={{
                              transformOrigin: "50% 50%",
                            }}
                            className="
                              absolute
                              -left-5
                              -top-[2px]

                              flex
                              h-5
                              w-5

                              -translate-y-1/2

                              items-center
                              justify-center
                            "
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
                            className="
                              mb-[-2px]

                              block
                              max-w-[240px]

                              truncate

                              text-[10px]
                              font-black

                              uppercase
                              leading-none
                              tracking-[0.18em]
                            "
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
                          className="
                            block
                            shrink-0
                            overflow-visible
                          "
                          variants={{
                            visible: {
                              opacity: 1,
                              x: 0,

                              transition: {
                                duration: 0.45,
                                ease: PROJECT_EASE,
                              },
                            },

                            hidden: {
                              opacity: 0,
                              x: 5,

                              transition: {
                                duration: 0.28,
                                ease: PROJECT_EASE,
                              },
                            },
                          }}
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
                                    duration: 0.65,
                                    ease: PROJECT_EASE,
                                  },

                                  pathOffset: {
                                    duration: 0.65,
                                    ease: PROJECT_EASE,
                                  },

                                  opacity: {
                                    duration: 0.2,
                                  },
                                },
                              },

                              hidden: {
                                pathLength: 0,
                                pathOffset: 1,
                                opacity: 0,

                                transition: {
                                  pathLength: {
                                    duration: 0.38,
                                    ease: PROJECT_EASE,
                                  },

                                  pathOffset: {
                                    duration: 0.38,
                                    ease: PROJECT_EASE,
                                  },

                                  opacity: {
                                    duration: 0.22,
                                  },
                                },
                              },
                            }}
                          />
                        </motion.svg>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <LinkReveal
                active={shouldShowNavbar}
                delay={REVEAL_DELAYS.contact}
                duration={0.75}
                y="115%"
                rotate={1.5}
              >
                <button
                  type="button"
                  onClick={openContact}
                  aria-expanded={isContactOpen}
                  className={`
                    ${getLinkClassName("/contact")}

                    cursor-pointer

                    border-0
                    bg-transparent

                    p-0

                    text-inherit
                  `}
                >
                  <WaveLinkText text="CONTACT" />
                </button>
              </LinkReveal>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
