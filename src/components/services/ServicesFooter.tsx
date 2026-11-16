"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EMAIL } from "./servicesData";

const LINKEDIN_URL = "https://www.linkedin.com/in/rustam-kerimov-75bb5a331/";

const INSTAGRAM_URL = "https://www.instagram.com/kerimov.designs/";

export default function ServicesFooter() {
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const linkClass = "w-fit transition-opacity duration-300 hover:opacity-50";

  return (
    <footer className="w-full bg-dark text-color">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1700px]
          grid-cols-2
          items-start
          gap-x-5
          gap-y-16
          px-5
          pb-8
          pt-16
          text-[15px]
          leading-[1.3]
          tracking-[-0.025em]

          sm:px-8
          sm:text-[16px]

          lg:grid-cols-4
          lg:items-end
          lg:gap-8
          lg:px-10
          lg:pb-10
          lg:pt-12
        "
      >
        {/* CONNECT — TOP LEFT MOBILE */}
        <div
          className="
            order-1
            flex
            min-w-0
            flex-col
            items-start

            lg:order-2
          "
        >
          <button
            type="button"
            onClick={copyEmail}
            className={`${linkClass} cursor-pointer text-left`}
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            LinkedIn
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Instagram
          </a>
        </div>

        {/* NAVIGATION — TOP RIGHT MOBILE */}
        <nav
          aria-label="Footer navigation"
          className="
            order-2
            flex
            min-w-0
            flex-col
            items-end

            lg:order-3
            lg:items-start
          "
        >
          <Link href="/" className={linkClass}>
            Home
          </Link>

          <Link href="/services" className={linkClass}>
            Services
          </Link>
        </nav>

        {/* COPYRIGHT — BOTTOM LEFT */}
        <div
          className="
            order-3
            min-w-0
            self-end

            lg:order-1
          "
        >
          <p className="text-[12px] leading-[1.3] sm:text-[16px]">
            © {new Date().getFullYear()} Rustam Kerimov
          </p>
        </div>

        {/* CREDITS — BOTTOM RIGHT */}
        <div
          className="
            order-4
            min-w-0
            self-end
            text-right
            lg:justify-self-end
          "
        >
          <p>Design &amp; Dev:</p>

          <a
            href="https://www.jonasnygaard.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Jonas Nygaard
          </a>
        </div>
      </div>
    </footer>
  );
}
