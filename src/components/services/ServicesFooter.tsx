"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EMAIL } from "./servicesData";

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

  const linkClass = "transition-opacity duration-300 hover:opacity-50";

  return (
    <footer className="w-full bg-dark text-color">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1700px]
          grid-cols-2
          items-end
          gap-x-6
          gap-y-10
          px-5
          pb-10
          pt-12
          text-[16px]
          leading-tight
          tracking-[-0.04em]
          md:px-8
          lg:flex
          lg:items-end
          lg:justify-between
          lg:gap-8
          lg:px-10
        "
      >
        {/* COPYRIGHT */}
        <div className="min-w-0">
          <p>Copyright:</p>
          <p>© {new Date().getFullYear()} Rustam Kerimov</p>
        </div>

        {/* CONNECT */}
        <div className="min-w-0">
          <p>Connect:</p>

          <button
            type="button"
            onClick={copyEmail}
            className={`${linkClass} cursor-pointer text-left`}
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="min-w-0">
          <p>Navigation:</p>

          <div className="flex items-center gap-1">
            <Link href="/" className={linkClass}>
              Home,
            </Link>

            <Link href="/services" className={linkClass}>
              Services
            </Link>
          </div>
        </nav>

        {/* CREDITS */}
        <div className="min-w-0 text-right">
          <p>Design &amp; Development:</p>

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
