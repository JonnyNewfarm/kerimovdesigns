"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = document.body;
    const html = document.documentElement;

    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousHtmlOverscroll = html.style.overscrollBehavior;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    body.style.overscrollBehavior = "none";
    html.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;

      body.style.overscrollBehavior = previousBodyOverscroll;
      html.style.overscrollBehavior = previousHtmlOverscroll;
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

                  VIKTIG:
                  Panelet venter IKKE på canvaset lenger.

                  Derfor ingen glitch når WebGL blir ready.
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
                    sm:pt-6
                    sm:pb-6
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

                          font-bueno
                          mb-6
                          mt-2

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
                      shrink-0

                      cursor-pointer

                      bg-[#20241e]/90

                      px-2.5
                      py-2
                      mt-1.5

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
                    INTRO
                ============================================ */}

                {/* ===========================================
                    FORM
                ============================================ */}

                <div
                  data-lenis-prevent
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
                      min-w-0
                      w-full
                      mb-2
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
