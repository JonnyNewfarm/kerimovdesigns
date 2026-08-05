"use client";

import { useEffect, type TouchEvent, type WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

import TextReveal from "@/components/TextReveal";

import ContactForm from "./ContactForm";
import {
  backdropVariants,
  contactEase,
  panelVariants,
} from "./contactAnimations";
import MagneticComp from "../MagneticComp";

type ContactFormPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactFormPanel({
  isOpen,
  onClose,
}: ContactFormPanelProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (!isOpen) {
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }

    const body = document.body;
    const html = document.documentElement;

    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;

      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [isOpen, onClose]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            fixed
            inset-0
            z-[300]
            overflow-hidden
            overscroll-none
          "
        >
          <motion.button
            type="button"
            aria-label="Close contact form"
            variants={backdropVariants}
            onClick={onClose}
            className="
              absolute
              inset-0
              cursor-default
              bg-[#181c14]/70
              backdrop-blur-[2px]
            "
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            variants={panelVariants}
            onWheel={handleWheel}
            onTouchMove={handleTouchMove}
            className="
              absolute
              bottom-0
              left-0
              right-0
              max-h-[96dvh]
              touch-pan-y
              overflow-y-auto
              overscroll-contain
              bg-[#4b4f47]
              px-5
              pb-8
              pt-5
              text-[#ecdfcc]

              [scrollbar-width:none]
             
              [&::-webkit-scrollbar-track]:bg-transparent

              md:px-12
              md:pb-12
              md:pt-8
            "
          >
            <div className="mx-auto max-w-[1800px]">
              <div
                className="
                  mb-14
                  flex
                  items-start
                  justify-between
                  border-b
                  border-[#ecdfcc]/25
                  pb-5
                  md:mb-20
                "
              >
                <div>
                  <TextReveal
                    as="p"
                    viewport={false}
                    delay={0.38}
                    duration={0.65}
                    y="100%"
                    className="
                      mb-3
                      text-[11px]
                      uppercase
                      opacity-50
                    "
                  >
                    New inquiry
                  </TextReveal>

                  <h2 id="contact-form-title">
                    <TextReveal
                      as="span"
                      viewport={false}
                      delay={0.43}
                      duration={0.9}
                      y="110%"
                      rotate={2}
                      className="
                        text-3xl
                        font-semibold
                        uppercase
                        tracking-[-0.02em]
                        md:text-3xl
                      "
                    >
                      Send a message
                    </TextReveal>
                  </h2>
                </div>

                <MagneticComp>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    aria-label="Close contact form"
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.48,
                      duration: 0.65,
                      ease: contactEase,
                    }}
                    className="
      group
      relative
      flex
      h-11
      w-11
      shrink-0
      cursor-pointer
      items-center
      justify-center
      overflow-hidden
      rounded-full
      border
      border-[#ecdfcc]/40
      transition-colors
      duration-500
      hover:border-[#25221d]
    "
                  >
                    <span
                      className="
        absolute
        inset-0
        origin-bottom
        scale-y-0
        
        bg-[#25221d]
        transition-transform
        duration-500
        ease-[cubic-bezier(0.76,0,0.24,1)]
        group-hover:scale-y-100
      "
                    />

                    <span className="relative z-10 block h-4 w-4">
                      <span
                        className="
          absolute
          left-1/2
          top-1/2
          h-px
          w-4
          -translate-x-1/2
          -translate-y-1/2
          bg-current
          transition-transform
          duration-500
          ease-[cubic-bezier(0.76,0,0.24,1)]
          group-hover:rotate-45
        "
                      />

                      <span
                        className="
          absolute
          left-1/2
          top-1/2
          h-px
          w-4
          -translate-x-1/2
          -translate-y-1/2
          scale-x-0
          bg-current
          transition-transform
          duration-500
          ease-[cubic-bezier(0.76,0,0.24,1)]
          group-hover:-rotate-45
          group-hover:scale-x-100
        "
                      />
                    </span>
                  </motion.button>
                </MagneticComp>
              </div>

              <ContactForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
