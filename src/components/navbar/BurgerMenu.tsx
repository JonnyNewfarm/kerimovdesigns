"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import TransitionLink from "../TransitionLink";

const MENU_EASE = [0.76, 0, 0.24, 1] as const;
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const menuLinks = [
  {
    label: "Home",
    href: "/",
    transitionLabel: "Welcome Back",
  },
  {
    label: "My Work",
    href: "/projects",
    transitionLabel: "Selected Work",
  },
  {
    label: "Contact",
    href: "/contact",
    transitionLabel: "Let's Collaborate",
  },
];

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [instantClose, setInstantClose] = useState(false);

  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    setInstantClose(true);
    setIsOpen(false);
    previousPathname.current = pathname;

    const frame = requestAnimationFrame(() => {
      setInstantClose(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="
          relative
          z-[70]
          flex
          cursor-pointer
          items-center
          gap-3
          text-[11px]
          font-medium
          uppercase
          tracking-[0.18em]
          text-[#ecdfcc]
          lg:hidden
        "
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <motion.span
            variants={{
              closed: {
                rotate: 0,
                width: 11,
              },
              open: {
                rotate: 45,
                width: 15,
              },
            }}
            transition={{
              duration: 0.5,
              ease: MENU_EASE,
            }}
            className="absolute h-px bg-current"
          />

          <motion.span
            variants={{
              closed: {
                rotate: 0,
                width: 11,
              },
              open: {
                rotate: -45,
                width: 15,
              },
            }}
            transition={{
              duration: 0.5,
              ease: MENU_EASE,
            }}
            className="absolute h-px bg-current"
          />
        </span>

        <span className="relative h-[1.2em] overflow-hidden">
          <motion.span
            animate={{
              y: isOpen ? "-50%" : "0%",
            }}
            transition={{
              duration: 0.5,
              ease: MENU_EASE,
            }}
            className="flex flex-col"
          >
            <span className="h-[1.2em] leading-[1.2em]">Menu</span>
            <span className="h-[1.2em] leading-[1.2em]">Close</span>
          </motion.span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: instantClose ? 0 : 0.35,
                ease: MENU_EASE,
              },
            }}
            transition={{
              duration: 0.4,
              ease: MENU_EASE,
            }}
            className="
              fixed
              inset-0
              z-40
              bg-black/45
              backdrop-blur-sm
              md:hidden
            "
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={menuRef}
        id="mobile-navigation"
        initial={false}
        animate={{
          y: isOpen ? "0%" : "-100%",
        }}
        transition={{
          duration: instantClose ? 0 : isOpen ? 0.8 : 0.65,
          ease: MENU_EASE,
        }}
        aria-hidden={!isOpen}
        className="
          fixed
          inset-0
          z-50
          flex
          min-h-dvh
          flex-col
          overflow-hidden
          bg-[#161310]
          px-6
          pb-8
          pt-28
          text-[#ecdfcc]
          lg:hidden
        "
        style={{
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 16,
          }}
          transition={{
            duration: instantClose ? 0 : 0.55,
            delay: isOpen ? 0.18 : 0,
            ease: REVEAL_EASE,
          }}
          className="
            mb-8
            flex
            items-end
            justify-between
            border-b
            border-white/10
            pb-5
          "
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#ecdfcc]/80">
            Navigation
          </p>
        </motion.div>

        <div className="flex flex-1 flex-col">
          <nav className="flex flex-col">
            {menuLinks.map((link, index) => {
              const active = isActiveLink(link.href);

              return (
                <motion.div
                  key={link.href}
                  initial={false}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : 28,
                  }}
                  transition={{
                    duration: instantClose ? 0 : 0.6,
                    delay: isOpen ? 0.24 + index * 0.08 : 0,
                    ease: REVEAL_EASE,
                  }}
                >
                  <TransitionLink
                    href={link.href}
                    transitionLabel={link.transitionLabel}
                    direction="right"
                    className="
                      relative
                      flex
                      min-h-[96px]
                      items-center
                      justify-between
                      border-b
                      border-white/10
                      py-5
                    "
                  >
                    <span>
                      <span
                        className="
                          text-[clamp(2rem,9vw,2.6rem)]
                          font-medium
                          uppercase
                          leading-[0.85]
                          tracking-[-0.035em]
                        "
                      >
                        {link.label}
                      </span>
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#ecdfcc]/30">
                      0{index + 1}
                    </span>
                  </TransitionLink>
                </motion.div>
              );
            })}
          </nav>

          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : 18,
            }}
            transition={{
              duration: instantClose ? 0 : 0.55,
              delay: isOpen ? 0.5 : 0,
              ease: REVEAL_EASE,
            }}
            className="mt-auto border-t border-white/10 pt-6"
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#ecdfcc]/35">
              Studio
            </p>

            <p className="max-w-[290px] text-sm leading-[1.55] text-[#ecdfcc]/60">
              Graphic design, digital experiences and selected creative
              development.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
