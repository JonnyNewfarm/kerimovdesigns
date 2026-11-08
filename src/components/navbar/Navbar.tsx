"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const LINKEDIN_URL = "https://www.linkedin.com/in/rustam-kerimov-75bb5a331/";
const INSTAGRAM_URL = "https://www.instagram.com/kerimov.designs/";
const EMAIL_ADDRESS = "rustam-98@hotmail.com";

const services = [
  "Visual Identities",
  "Logo Design",
  "Art Direction",
  "Motion & Animation",
  "Editorial Design",
];

const ease = [0.16, 1, 0.3, 1] as const;

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

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
      transition={{ duration: 0.85, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [currentPath, setCurrentPath] = useState(() => normalizePath(pathname));

  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentPath(normalizePath(pathname));
  }, [pathname]);

  useEffect(() => {
    const onPopState = () =>
      setCurrentPath(normalizePath(window.location.pathname));

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

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

  const navigateMobile = (url: string) => {
    const next = normalizePath(url);

    if (normalizePath(window.location.pathname) !== next) {
      window.history.pushState(null, "", next);
    }

    setCurrentPath(next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const openAbout = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      navigateMobile(currentPath === "/" ? "/about" : "/");
    } else {
      window.dispatchEvent(new Event("rustam:open-profile"));
    }
  };

  const baseText =
    "font-bueno text-[15px] font-medium leading-[1.18] tracking-[-0.025em] lg:text-[clamp(15px,1.1vw,20px)]";

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-[100] w-full bg-transparent px-[5%] pb-4 pt-6 text-color lg:bg-transparent lg:px-[3.1%] lg:pb-0 lg:pt-[18px] lg:text-color"
    >
      <div
        className={`flex w-full items-start justify-between gap-x-5 ${baseText}`}
      >
        {/* NAME */}
        <Reveal delay={0}>
          <button
            type="button"
            onClick={() => navigateMobile("/")}
            className="whitespace-nowrap text-left lg:hidden"
          >
            Rustam Kerimov
          </button>

          <div className="hidden flex-col items-start lg:flex">
            <span className="text-sm">Name:</span>

            <span className="whitespace-nowrap">Rustam Kerimov</span>
          </div>
        </Reveal>

        {/* ROLE — DESKTOP */}
        <Reveal delay={0.08} className="hidden lg:block">
          <div className="flex flex-col items-start">
            <span className="text-sm">occupation:</span>

            <span className="whitespace-nowrap">Graphic Designer</span>
          </div>
        </Reveal>

        {/* SERVICES — DESKTOP */}
        <Reveal delay={0.16} className="hidden lg:block">
          <div className="flex flex-col items-start">
            <span className="text-sm">Location:</span>
            Oslo, Norway
          </div>
        </Reveal>

        {/* CONNECT — DESKTOP */}
        <Reveal delay={0.24} className="hidden lg:block">
          <div className="flex flex-col items-start">
            <span className="text-sm">Connect:</span>

            <button
              type="button"
              onClick={copyEmail}
              className="whitespace-nowrap cursor-pointer text-left transition-opacity duration-300 hover:opacity-50"
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
              className="whitespace-nowrap transition-opacity duration-300 hover:opacity-50"
            >
              Instagram
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap transition-opacity duration-300 hover:opacity-50"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>

        {/* PROFILE / ABOUT */}
        <Reveal delay={0.32}>
          <div className="flex flex-col items-start text-left">
            {/* MOBILE */}
            <button
              type="button"
              onClick={openAbout}
              className="cursor-pointer whitespace-nowrap transition-opacity duration-300 hover:opacity-50 lg:hidden"
            >
              {currentPath === "/" ? "About me" : "Back"}
            </button>

            {/* DESKTOP — LABEL IS NOT CLICKABLE */}
            <span className="hidden text-sm lg:block">Profile:</span>

            {/* DESKTOP — ONLY ABOUT ME IS CLICKABLE */}
            <button
              type="button"
              onClick={openAbout}
              className="hidden cursor-pointer whitespace-nowrap text-left transition-opacity duration-300 hover:opacity-50 lg:block"
            >
              About me
            </button>
          </div>
        </Reveal>
      </div>
    </nav>
  );
}
