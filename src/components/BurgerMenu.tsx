"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "My Work", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="relative z-[70] flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-color"
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full bg-[#ecdfcc] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? "scale-150" : "scale-100"
          }`}
        />

        <span>{isOpen ? "Close" : "Menu"}</span>
      </button>

      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        transition={{
          duration: 0.35,
          ease: "easeInOut",
        }}
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
      />

      <motion.div
        ref={menuRef}
        initial={false}
        animate={{
          y: isOpen ? "0%" : "-100%",
          opacity: isOpen ? 1 : 1,
        }}
        transition={{
          duration: 0.65,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-50 flex min-h-screen flex-col bg-dark px-6 pb-10 pt-28 text-color"
        style={{
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 18,
          }}
          transition={{
            duration: 0.4,
            delay: isOpen ? 0.2 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 border-b border-white/10 pb-6"
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/40">
            Navigation
          </p>

          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
            Menu
          </h2>
        </motion.div>

        <div className="flex flex-1 flex-col justify-between">
          <nav className="flex flex-col border-t border-white/10">
            {menuLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  y: isOpen ? 0 : 20,
                }}
                transition={{
                  duration: 0.4,
                  delay: isOpen ? 0.25 + index * 0.08 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  onClick={() => setIsOpen(false)}
                  href={link.href}
                  className="flex items-center justify-between border-b border-white/10 py-6"
                >
                  <span className="text-2xl uppercase leading-none tracking-[-0.04em]">
                    {link.label}
                  </span>

                  <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                    0{index + 1}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : 18,
            }}
            transition={{
              duration: 0.4,
              delay: isOpen ? 0.45 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-12 border-t border-white/10 pt-6"
          >
            <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/40">
              Studio
            </p>

            <p className="max-w-[260px] text-sm leading-relaxed text-white/65">
              Graphic design, digital experiences and selected creative
              development.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default BurgerMenu;
