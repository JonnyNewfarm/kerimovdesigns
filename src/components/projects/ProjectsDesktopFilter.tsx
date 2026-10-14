"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import TextReveal from "@/components/TextReveal";
import FilterPopupThreeBackground from "./FilterPopupThreeBackground";
import { useProjectsReveal } from "./ProjectsLoadingGate";

type ProjectsDesktopFilterProps = {
  availableTags: string[];
  selectedTags: string[];
  totalCount: number;
  resultCount: number;
  onChange: (tags: string[]) => void;
  onPopupOpenChange?: (open: boolean) => void;
};

const MAX_SELECTED_TAGS = 3;
const COLLAPSED_TAG_COUNT = 5;
const POPUP_WIDTH = 380;
const VIEWPORT_PADDING = 24;
const POPUP_ROTATE_Y = 13;

const FILTER_EASE = [0.22, 1, 0.36, 1] as const;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const formatTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    return (
      element.getClientRects().length > 0 &&
      !element.closest("[inert]") &&
      element.getAttribute("aria-hidden") !== "true"
    );
  });
}

export default function ProjectsDesktopFilter({
  availableTags,
  selectedTags,
  onChange,
  onPopupOpenChange,
}: ProjectsDesktopFilterProps) {
  const { revealStarted } = useProjectsReveal();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [popupLeft, setPopupLeft] = useState(VIEWPORT_PADDING);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFilterRef = useRef<HTMLButtonElement | null>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closePopupRef = useRef<() => void>(() => {});

  useEffect(() => {
    setMounted(true);
  }, []);

  const openPopup = () => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : triggerRef.current;

    setThreeReady(false);
    setIsPanelHovered(false);
    setIsPopupOpen(true);

    onPopupOpenChange?.(true);
  };

  const closePopup = useCallback(() => {
    setIsPanelHovered(false);
    setIsPopupOpen(false);

    onPopupOpenChange?.(false);
  }, [onPopupOpenChange]);

  useEffect(() => {
    closePopupRef.current = closePopup;
  }, [closePopup]);

  useEffect(() => {
    return () => {
      onPopupOpenChange?.(false);
    };
  }, [onPopupOpenChange]);

  const collapsedTags = useMemo(() => {
    const result: string[] = [];

    selectedTags.forEach((tag) => {
      if (availableTags.includes(tag) && !result.includes(tag)) {
        result.push(tag);
      }
    });

    availableTags.forEach((tag) => {
      if (result.length < COLLAPSED_TAG_COUNT && !result.includes(tag)) {
        result.push(tag);
      }
    });

    return result;
  }, [availableTags, selectedTags]);

  const updateUrl = (nextTags: string[]) => {
    const params = new URLSearchParams(window.location.search);

    params.delete("page");
    params.delete("tag");
    params.delete("tags");

    if (nextTags.length > 0) {
      params.set("tags", nextTags.join(","));
    }

    const query = params.toString();

    const nextUrl =
      query.length > 0
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;

    window.history.pushState(null, "", nextUrl);
  };

  const commitTags = (nextTags: string[]) => {
    onChange(nextTags);
    updateUrl(nextTags);
  };

  const clearTags = () => {
    if (selectedTags.length === 0) {
      return;
    }

    commitTags([]);
  };

  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);

    if (!isSelected && selectedTags.length >= MAX_SELECTED_TAGS) {
      return;
    }

    const nextTags = isSelected
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    commitTags(nextTags);
  };

  // Popup positioning
  useEffect(() => {
    if (!isPopupOpen) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();

      const width = Math.min(
        POPUP_WIDTH,
        window.innerWidth - VIEWPORT_PADDING * 2,
      );

      const maxLeft = window.innerWidth - width - VIEWPORT_PADDING;

      setPopupLeft(Math.max(VIEWPORT_PADDING, Math.min(rect.left, maxLeft)));
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [isPopupOpen]);

  // Focus management
  useEffect(() => {
    if (!isPopupOpen || !mounted) {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const focusInitialElement = () => {
      if (firstFilterRef.current) {
        firstFilterRef.current.focus({
          preventScroll: true,
        });
      } else {
        dialog.focus({
          preventScroll: true,
        });
      }
    };

    const frame = requestAnimationFrame(focusInitialElement);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();

        closePopupRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(dialog);

      if (focusable.length === 0) {
        event.preventDefault();

        dialog.focus({
          preventScroll: true,
        });

        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!active || !dialog.contains(active)) {
        event.preventDefault();

        (event.shiftKey ? last : first).focus({
          preventScroll: true,
        });

        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();

        last.focus({
          preventScroll: true,
        });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();

        first.focus({
          preventScroll: true,
        });
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;

      if (target instanceof Node && !dialog.contains(target)) {
        const focusable = getFocusableElements(dialog);

        (focusable[0] ?? dialog).focus({
          preventScroll: true,
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      cancelAnimationFrame(frame);

      document.removeEventListener("keydown", handleKeyDown, true);

      document.removeEventListener("focusin", handleFocusIn);

      const previousFocus = previousFocusRef.current;
      const trigger = triggerRef.current;

      requestAnimationFrame(() => {
        if (previousFocus?.isConnected) {
          previousFocus.focus({
            preventScroll: true,
          });
        } else if (trigger?.isConnected) {
          trigger.focus({
            preventScroll: true,
          });
        }
      });
    };
  }, [isPopupOpen, mounted]);

  const popup = mounted
    ? createPortal(
        <AnimatePresence>
          {isPopupOpen ? (
            <>
              <motion.button
                type="button"
                tabIndex={-1}
                aria-label="Close filters"
                onClick={closePopup}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: FILTER_EASE,
                }}
                className="
                  fixed
                  inset-0
                  z-[180]

                  cursor-default

                  bg-[#0b0e0a]/30

                  backdrop-blur-[5px]
                "
              />

              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: popupLeft,

                  width: `min(${POPUP_WIDTH}px, calc(100vw - ${
                    VIEWPORT_PADDING * 2
                  }px))`,

                  transform: "translateY(-50%)",

                  perspective: "900px",
                  perspectiveOrigin: "50% 50%",

                  pointerEvents: threeReady ? "auto" : "none",

                  zIndex: 190,
                }}
              >
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="All project filters"
                  tabIndex={-1}
                  onPointerEnter={() => {
                    setIsPanelHovered(true);
                  }}
                  onPointerLeave={() => {
                    setIsPanelHovered(false);
                  }}
                  initial={false}
                  animate={{
                    opacity: threeReady ? 1 : 0,
                    y: threeReady ? 0 : 14,
                    scale: threeReady ? 1 : 0.985,
                    rotateY: isPanelHovered ? 0 : POPUP_ROTATE_Y,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.99,
                    rotateY: 2,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.48,
                      ease: FILTER_EASE,
                    },
                    y: {
                      duration: 0.6,
                      ease: FILTER_EASE,
                    },
                    scale: {
                      duration: 0.62,
                      ease: FILTER_EASE,
                    },
                    rotateY: {
                      duration: isPanelHovered ? 0.7 : 0.9,
                      ease: FILTER_EASE,
                    },
                  }}
                  style={{
                    width: "100%",
                    transformOrigin: "50% 50%",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  className="
                    relative
                    isolate

                    flex
                    max-h-[calc(100dvh-150px)]
                    flex-col

                    overflow-hidden

                    border-0
                    bg-transparent
                    outline-none

                    text-color

                    will-change-transform
                  "
                >
                  <FilterPopupThreeBackground
                    onReady={() => {
                      setThreeReady(true);
                    }}
                  />

                  <motion.div
                    initial={false}
                    animate={{
                      opacity: threeReady ? 1 : 0,
                      y: threeReady ? 0 : 8,
                    }}
                    transition={{
                      opacity: {
                        duration: 0.5,
                        delay: threeReady ? 0.38 : 0,
                        ease: FILTER_EASE,
                      },
                      y: {
                        duration: 0.6,
                        delay: threeReady ? 0.38 : 0,
                        ease: FILTER_EASE,
                      },
                    }}
                    className="
                      relative
                      z-10

                      flex
                      min-h-0
                      flex-1
                      flex-col
                    "
                  >
                    <div
                      className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-5

                        px-6
                        pb-6
                        pt-6
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.28em]

                            text-white/55
                          "
                        >
                          Project filter
                        </p>

                        <h3
                          className="
                            mt-2

                            text-[1.9rem]
                            font-black
                            uppercase

                            leading-[0.92]
                            tracking-[-0.025em]

                            text-white/90
                          "
                        >
                          All filters
                        </h3>
                      </div>

                      <motion.button
                        type="button"
                        onClick={closePopup}
                        aria-label="Close filters"
                        initial={{
                          opacity: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        transition={{
                          delay: 0.08,
                          duration: 0.4,
                          ease: FILTER_EASE,
                        }}
                        className="
    group
    relative
    shrink-0

    cursor-pointer

    border-0
    bg-transparent
    p-0

    text-[9px]
    font-black
    uppercase
    tracking-[0.16em]

    text-white/70

    outline-none
    focus-visible:outline-none
    focus-visible:text-white

    transition-colors
    duration-300

    hover:text-white
  "
                      >
                        <span className="relative block">
                          Close
                          <span
                            aria-hidden="true"
                            className="
        pointer-events-none
        absolute
        -bottom-[4px]
        left-0

        h-[2px]
        w-full

        origin-right
        scale-x-0

        bg-current

        transition-transform
        duration-500
        ease-[cubic-bezier(0.76,0,0.24,1)]

        group-hover:origin-left
        group-hover:scale-x-100

        group-focus-visible:origin-left
        group-focus-visible:scale-x-100
      "
                          />
                        </span>
                      </motion.button>
                    </div>

                    <div
                      className="
                        min-h-0
                        flex-1

                        overflow-y-auto

                        px-6
                        pb-6

                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden
                      "
                    >
                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-x-5
                          gap-y-1
                        "
                      >
                        <PopupFilterButton
                          buttonRef={firstFilterRef}
                          label="All work"
                          active={selectedTags.length === 0}
                          disabled={false}
                          onClick={clearTags}
                          index={0}
                        />

                        {availableTags.map((tag, index) => {
                          const active = selectedTags.includes(tag);

                          const disabled =
                            !active && selectedTags.length >= MAX_SELECTED_TAGS;

                          return (
                            <PopupFilterButton
                              key={tag}
                              label={formatTag(tag)}
                              active={active}
                              disabled={disabled}
                              onClick={() => toggleTag(tag)}
                              index={index + 1}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        min-h-[54px]
                        shrink-0

                        items-center
                        justify-between

                        px-6
                        pb-5
                        pt-2
                      "
                    >
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.18em]

                          text-white/75
                        "
                      >
                        Select up to three filters
                      </p>

                      <AnimatePresence initial={false}>
                        {selectedTags.length > 0 ? (
                          <motion.button
                            type="button"
                            onClick={clearTags}
                            initial={{
                              opacity: 0,
                              x: 5,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              x: 5,
                            }}
                            whileHover={{
                              x: 3,
                            }}
                            transition={{
                              duration: 0.35,
                              ease: FILTER_EASE,
                            }}
                            className="
    group
    cursor-pointer

    text-[10px]
    font-black
    uppercase
    tracking-[0.18em]
    text-white/75

    outline-none
    focus-visible:outline-none
    focus-visible:text-white

    transition-colors
    duration-300
    hover:text-white
  "
                          >
                            <span
                              className="
      relative
      inline-block

      after:pointer-events-none
      after:absolute
      after:-bottom-[4px]
      after:left-0
      after:h-[2px]
      after:w-full
      after:origin-left
      after:scale-x-0
      after:bg-current
      after:content-['']
      after:transition-transform
      after:duration-300

      group-focus-visible:after:scale-x-100
    "
                            >
                              Clear
                            </span>
                          </motion.button>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="w-full min-w-0">
        <TextReveal
          as="p"
          mode="words"
          viewport={false}
          active={revealStarted}
          delay={0.42}
          duration={0.7}
          y="100%"
          className="
            mb-5

            text-[10px]
            font-black
            uppercase
            tracking-[0.28em]

            text-white/80

            xl:text-[12px]
          "
        >
          Filter
        </TextReveal>

        <FilterButton
          label="All work"
          active={selectedTags.length === 0}
          disabled={false}
          onClick={clearTags}
          revealStarted={revealStarted}
          revealDelay={0.5}
        />

        <div className="mt-[2px]">
          {collapsedTags.map((tag, index) => {
            const active = selectedTags.includes(tag);

            const disabled =
              !active && selectedTags.length >= MAX_SELECTED_TAGS;

            return (
              <FilterButton
                key={tag}
                label={formatTag(tag)}
                active={active}
                disabled={disabled}
                onClick={() => toggleTag(tag)}
                revealStarted={revealStarted}
                revealDelay={0.56 + index * 0.045}
              />
            );
          })}
        </div>

        {availableTags.length > COLLAPSED_TAG_COUNT ? (
          <motion.button
            ref={triggerRef}
            type="button"
            onClick={openPopup}
            aria-haspopup="dialog"
            aria-expanded={isPopupOpen}
            initial={false}
            animate={{
              opacity: revealStarted ? 1 : 0,
              y: revealStarted ? 0 : 6,
            }}
            whileHover={{
              x: 3,
            }}
            transition={{
              opacity: {
                duration: 0.5,
                delay: 0.8,
                ease: FILTER_EASE,
              },
              y: {
                duration: 0.65,
                delay: 0.8,
                ease: FILTER_EASE,
              },
              x: {
                duration: 0.35,
                ease: FILTER_EASE,
              },
            }}
            className="
              group
              mt-5

              flex
              w-fit

              cursor-pointer
              items-center
              gap-2.5

              text-[9px]
              font-black
              uppercase
              tracking-[0.2em]

              text-white/60

              transition-colors
              duration-300

              hover:text-white

              xl:text-[12px]
              outline-none
focus:outline-none
focus-visible:outline-none

focus-visible:text-white
            "
          >
            <span
              className="
    relative
    block
    pb-[3px]

    after:pointer-events-none
    after:absolute
    after:bottom-0
    after:left-0
    after:h-[2px]
    after:w-full
    after:origin-left
    after:scale-x-0
    after:bg-current
    after:content-['']
    after:transition-transform
    after:duration-300

    group-focus-visible:after:scale-x-100
  "
            >
              View all filters
            </span>
            <span
              className="
                relative
                block

                h-[9px]
                w-[9px]
                shrink-0
              "
              aria-hidden="true"
            >
              <span
                className="
                  absolute
                  left-0
                  top-1/2

                  h-px
                  w-full

                  -translate-y-1/2

                  bg-current
                "
              />

              <span
                className="
                  absolute
                  left-1/2
                  top-0

                  h-full
                  w-px

                  -translate-x-1/2

                  bg-current
                "
              />
            </span>
          </motion.button>
        ) : null}
      </div>

      {popup}
    </>
  );
}

type FilterButtonProps = {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  revealStarted: boolean;
  revealDelay: number;
};

function FilterButton({
  label,
  active,
  disabled,
  onClick,
  revealStarted,
  revealDelay,
}: FilterButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      initial={false}
      animate={{
        opacity: disabled ? 0.15 : 1,
        x: 0,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              x: 4,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              x: 2,
            }
      }
      transition={{
        x: {
          duration: 0.38,
          ease: FILTER_EASE,
        },
        opacity: {
          duration: 0.3,
          ease: FILTER_EASE,
        },
      }}
      className={`
  group
  relative

  flex
  min-w-0
  items-center

  py-[5px]

  text-left
  text-[11px]
  font-black
  uppercase
  tracking-[0.15em]

  xl:text-[12px]

  outline-none
  focus:outline-none
  focus-visible:outline-none

  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
`}
    >
      <span
        className={`
  relative
  block
  truncate

  pb-[3px]

  transition-colors
  duration-300

  after:pointer-events-none
  after:absolute
  after:bottom-0
  after:left-0
  after:h-[2px]
  after:w-full
  after:origin-left
  after:scale-x-0
  after:bg-current
  after:content-['']
  after:transition-transform
  after:duration-300

  group-focus-visible:after:scale-x-100
  group-focus-visible:text-white

  ${active ? "text-white" : "text-white/35 group-hover:text-white"}
`}
      >
        <TextReveal
          as="span"
          mode="words"
          viewport={false}
          active={revealStarted}
          delay={revealDelay}
          duration={0.72}
          y="105%"
          className="truncate"
        >
          {label}
        </TextReveal>
      </span>
    </motion.button>
  );
}

type PopupFilterButtonProps = {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  index: number;
  buttonRef?: React.Ref<HTMLButtonElement>;
};

function PopupFilterButton({
  label,
  active,
  disabled,
  onClick,
  index,
  buttonRef,
}: PopupFilterButtonProps) {
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      initial={{
        opacity: 0,
        y: 5,
      }}
      animate={{
        opacity: disabled ? 0.22 : 1,
        y: 0,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              x: 3,
            }
      }
      transition={{
        opacity: {
          duration: 0.4,
          delay: Math.min(index, 10) * 0.018,
          ease: FILTER_EASE,
        },
        y: {
          duration: 0.45,
          delay: Math.min(index, 10) * 0.018,
          ease: FILTER_EASE,
        },
        x: {
          duration: 0.32,
          ease: FILTER_EASE,
        },
      }}
      className={`
  group

  flex
  min-h-[34px]
  w-full
  min-w-0
  items-center

  px-2

  text-left
  text-[9px]
  font-black
  uppercase
  tracking-[0.14em]

  outline-none
  focus:outline-none
  focus-visible:outline-none
  focus-visible:ring-0
  focus-visible:bg-black/20

  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}

  ${
    active
      ? `
        bg-black/[0.22]
        text-white
      `
      : `
        text-white/60
        hover:bg-black/[0.10]
        hover:text-white
      `
  }
`}
    >
      <span className="truncate">{label}</span>

      {active ? (
        <span
          aria-hidden="true"
          className="
            ml-auto
            pl-3

            text-[11px]
            leading-none

            text-white/65
          "
        >
          ×
        </span>
      ) : null}
    </motion.button>
  );
}
