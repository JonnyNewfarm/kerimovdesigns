"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import TextReveal from "@/components/TextReveal";

import ContactPopupThreeBackground from "./ContactPopupThreeBackground";
import ContactForm from "./ContactForm";
import { contactEase } from "./contactAnimations";

type ContactFormPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PANEL_EASE = [0.22, 1, 0.36, 1] as const;

const PANEL_ROTATE_Y = 10;

export default function ContactFormPanel({
  isOpen,
  onClose,
}: ContactFormPanelProps) {
  const [mounted, setMounted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [isPanelHovered, setIsPanelHovered] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  /*
   * =====================================================
   * CLIENT
   * =====================================================
   */

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * =====================================================
   * MOBILE
   * =====================================================
   */

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsPanelHovered(false);
  }, [isOpen]);

  /*
   * =====================================================
   * ESCAPE
   * =====================================================
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  /*
   * =====================================================
   * LOCK PAGE
   * =====================================================
   *
   * Fryser siden bak modalen helt.
   *
   * Viktig på mobil fordi hero / Lenis / Three ellers
   * kan motta scroll og touch mens Contact er åpen.
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = document.body;
    const html = document.documentElement;

    const scrollY = window.scrollY;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;

    /*
     * Lock document.
     */

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    /*
     * Frys body på nåværende scrollposisjon.
     *
     * Dette er spesielt viktig på iOS/mobile Safari,
     * hvor overflow:hidden alene ikke alltid er nok.
     */

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      /*
       * Restore original document styles.
       */

      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      body.style.overscrollBehavior = previousBodyOverscroll;

      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;

      /*
       * Restore exact scroll position.
       */

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="contact-modal"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
          }}
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
          className="
            fixed
            inset-0
            z-[300]
            overflow-hidden
          "
        >
          {/* =================================================
              BACKDROP
          ================================================= */}

          <motion.button
            type="button"
            aria-label="Close contact form"
            onClick={onClose}
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
              duration: 0.35,
              ease: PANEL_EASE,
            }}
            className="
              absolute
              inset-0

              cursor-default

              bg-[#0b0e0a]/45

              backdrop-blur-[5px]
            "
          />

          {/* =================================================
              STAGE
          ================================================= */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              flex
              items-center
              justify-center

              p-3

              md:p-6
            "
            style={{
              perspective: isMobile ? "none" : "1050px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* ===============================================
                PANEL
            ================================================ */}

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-form-title"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onPointerEnter={() => {
                if (isMobile) {
                  return;
                }

                setIsPanelHovered(true);
              }}
              onPointerLeave={() => {
                if (isMobile) {
                  return;
                }

                setIsPanelHovered(false);
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onPointerMove={(event) => {
                event.stopPropagation();
              }}
              onWheel={(event) => {
                event.stopPropagation();
              }}
              onTouchMove={(event) => {
                event.stopPropagation();
              }}
              initial={{
                opacity: 0,
                y: 14,
                scale: 0.985,
                rotateY: isMobile ? 0 : PANEL_ROTATE_Y,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateY: isMobile ? 0 : isPanelHovered ? 0 : PANEL_ROTATE_Y,
              }}
              exit={{
                opacity: 0,
                y: 8,
                scale: 0.99,
                rotateY: isMobile ? 0 : PANEL_ROTATE_Y * 0.4,
              }}
              transition={{
                opacity: {
                  duration: 0.38,
                  ease: PANEL_EASE,
                },

                y: {
                  duration: 0.58,
                  ease: PANEL_EASE,
                },

                scale: {
                  duration: 0.58,
                  ease: PANEL_EASE,
                },

                rotateY: {
                  duration: isPanelHovered ? 0.68 : 0.85,
                  ease: PANEL_EASE,
                },
              }}
              style={{
                width: isMobile
                  ? "calc(100vw - 24px)"
                  : "min(580px, calc(100vw - 48px))",

                maxHeight: isMobile
                  ? "calc(100dvh - 24px)"
                  : "min(620px, calc(100dvh - 64px))",

                transformStyle: isMobile ? "flat" : "preserve-3d",

                transformOrigin: "50% 50%",

                backfaceVisibility: "hidden",

                WebkitBackfaceVisibility: "hidden",
              }}
              className="
                pointer-events-auto

                relative
                isolate

                flex
                flex-col

                overflow-hidden

                bg-[#59624f]

                text-[#ecdfcc]

                will-change-transform
              "
            >
              {/* =============================================
                  THREE BACKGROUND

                  Panelet venter ikke på canvaset.
              ============================================== */}

              <ContactPopupThreeBackground />

              {/* =============================================
                  CONTENT
              ============================================== */}

              <div
                className="
                  relative
                  z-10

                  flex
                  min-h-0
                  flex-1
                  flex-col
                "
              >
                {/* ===========================================
                    HEADER
                ============================================ */}

                <div
                  className="
                    flex
                    shrink-0
                    items-start
                    justify-between
                    gap-4

                    px-4
                    pb-3
                    pt-4

                    sm:px-5
                    sm:pb-6
                    sm:pt-6
                  "
                >
                  <div className="min-w-0">
                    <h2 id="contact-form-title">
                      <TextReveal
                        as="span"
                        mode="words"
                        viewport={false}
                        delay={0.14}
                        duration={0.72}
                        y="105%"
                        rotate={0.6}
                        className="
                          block

                          mb-6
                          mt-2

                          font-bueno

                          text-[clamp(1.4rem,3.7vw,1.9rem)]
                          font-black

                          uppercase
                          leading-[0.88]
                          tracking-[-0.025em]

                          text-white
                        "
                      >
                        Send a message
                      </TextReveal>
                    </h2>
                  </div>

                  {/* =========================================
                      CLOSE
                  ========================================== */}

                  <motion.button
                    type="button"
                    onClick={onClose}
                    aria-label="Close contact form"
                    initial={{
                      opacity: 0,
                      x: 5,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    whileHover={
                      isMobile
                        ? undefined
                        : {
                            x: 2,
                          }
                    }
                    whileTap={{
                      scale: 0.97,
                    }}
                    transition={{
                      delay: 0.08,
                      duration: 0.32,
                      ease: contactEase,
                    }}
                    className="
                      mt-1.5
                      shrink-0

                      cursor-pointer

                      bg-[#20241e]/90

                      px-2.5
                      py-2

                      text-[7px]
                      font-black
                      uppercase
                      tracking-[0.17em]

                      text-white/65

                      transition-colors
                      duration-300

                      hover:bg-[#171a15]
                      hover:text-white
                    "
                  >
                    Close
                  </motion.button>
                </div>

                {/* ===========================================
                    FORM
                ============================================ */}

                <div
                  ref={scrollAreaRef}
                  data-lenis-prevent
                  data-lenis-prevent-wheel
                  data-lenis-prevent-touch
                  onWheel={(event) => {
                    event.stopPropagation();
                  }}
                  onTouchMove={(event) => {
                    event.stopPropagation();
                  }}
                  style={{
                    touchAction: "pan-y",
                    WebkitOverflowScrolling: "touch",
                  }}
                  className="
                    min-h-0
                    flex-1

                    overflow-x-hidden
                    overflow-y-auto

                    overscroll-contain

                    px-4
                    pb-5

                    [scrollbar-width:none]

                    [&::-webkit-scrollbar]:hidden

                    sm:px-5
                  "
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.18,
                      ease: PANEL_EASE,
                    }}
                    className="
                      mb-2
                      min-w-0
                      w-full
                    "
                  >
                    <ContactForm />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,

    document.body,
  );
}
