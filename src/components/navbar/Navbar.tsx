"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const LINKEDIN_URL = "https://www.linkedin.com/in/rustam-kerimov-75bb5a331/";

const INSTAGRAM_URL = "https://www.instagram.com/kerimov.designs/";

const EMAIL_ADDRESS = "rustam-98@hotmail.com";

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.85,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Navbar() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);

      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);
  };

  const baseText =
    "font-bueno text-[15px] font-medium leading-[1.18] tracking-[-0.025em] lg:text-[clamp(15px,1.1vw,20px)]";

  const linkClass =
    "w-fit whitespace-nowrap transition-opacity duration-300 hover:opacity-50";

  return (
    <nav
      aria-label="Main navigation"
      className="
        fixed
        inset-x-0
        top-0
        z-[100]
        w-full
        bg-transparent
        px-[5%]
        pb-4
        pt-6
        text-color

        lg:px-[3.1%]
        lg:pb-0
        lg:pt-[18px]
      "
    >
      <div
        className={`
          flex
          w-full
          items-start
          justify-between
          gap-x-5
          ${baseText}
        `}
      >
        {/* NAME */}
        <Reveal delay={0}>
          <Link
            href="/"
            className={`
              whitespace-nowrap
              text-left
              lg:hidden
            `}
          >
            Rustam Kerimov
          </Link>

          <div className="hidden flex-col items-start lg:flex">
            <span className="text-sm">Name:</span>

            <span className="whitespace-nowrap">Rustam Kerimov</span>
          </div>
        </Reveal>

        {/* OCCUPATION */}
        <Reveal delay={0.08} className="hidden lg:block">
          <div className="flex flex-col items-start">
            <span className="text-sm">Occupation:</span>

            <span className="whitespace-nowrap">Graphic Designer</span>
          </div>
        </Reveal>

        {/* LOCATION */}
        <Reveal delay={0.16} className="hidden lg:block">
          <div className="flex flex-col items-start">
            <span className="text-sm">Location:</span>

            <span className="whitespace-nowrap">Oslo, Norway</span>
          </div>
        </Reveal>

        {/* CONNECT */}
        <Reveal delay={0.24} className="hidden lg:block">
          <div className="flex flex-col items-start">
            <span className="text-sm">Connect:</span>

            <button
              type="button"
              onClick={copyEmail}
              className={`
                ${linkClass}
                cursor-pointer
                text-left
              `}
              aria-label="Copy email address"
            >
              <span aria-live="polite">
                {copyStatus === "copied"
                  ? "Copied!"
                  : copyStatus === "error"
                    ? "Copy failed"
                    : "Copy Email"}
              </span>
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Instagram
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn
            </a>
          </div>
        </Reveal>

        {/* NAVIGATION */}
        <Reveal delay={0.32}>
          <div className="flex flex-col items-start text-left">
            <span className="hidden text-sm lg:block">Navigation:</span>

            <Link href="/" className={linkClass}>
              Home
            </Link>

            <Link href="/services" className={linkClass}>
              Services
            </Link>
          </div>
        </Reveal>
      </div>
    </nav>
  );
}
