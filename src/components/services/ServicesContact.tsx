"use client";

import { useEffect, useRef, useState } from "react";

import { EMAIL } from "./servicesData";

export default function ServicesContact() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

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
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const label =
    status === "copied"
      ? "Copied!"
      : status === "error"
        ? "Unable to copy"
        : "Copy email";

  return (
    <section
      className="
        mx-auto
        grid
        min-h-[75svh]
        w-full
        max-w-[1700px]
        grid-cols-1
        items-center
        px-5
        py-28

        md:grid-cols-[minmax(0,32%)_minmax(0,1fr)]
        md:gap-x-10
        md:px-8

        lg:grid-cols-[340px_minmax(0,1fr)]
        lg:gap-x-20
        lg:px-10
      "
    >
      <div className="min-w-0 md:col-start-2">
        <p
          className="
            max-w-[950px]
            text-[clamp(32px,4.2vw,68px)]
            font-normal
            leading-[1.14]
            tracking-normal
          "
        >
          Open for collaborations and new projects. Let's create something
          together.
        </p>

        <button
          type="button"
          onClick={copyEmail}
          aria-label={`Copy email address ${EMAIL}`}
          className="
            group
            mt-12
            flex
            max-w-full
            cursor-pointer
            flex-col
            items-start
            gap-3
            text-left
            md:mt-16
          "
        >
          <span
            className="
              max-w-full
              text-[clamp(24px,2.8vw,46px)]
              font-normal
              leading-[1.15]
              tracking-normal
              transition-opacity
              duration-300
              group-hover:opacity-55
              group-focus-visible:opacity-55
            "
            style={{
              overflowWrap: "anywhere",
            }}
          >
            {EMAIL}
          </span>

          <span
            className="
              text-sm
              font-normal
              tracking-normal
              opacity-100
              transition-opacity
              duration-300
              md:opacity-0
              md:group-hover:opacity-100
              md:group-focus-visible:opacity-100
            "
            aria-live="polite"
          >
            {label}
          </span>
        </button>
      </div>
    </section>
  );
}
