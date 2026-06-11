"use client";

import React from "react";

type WaveLinkTextProps = {
  text: string;
  className?: string;
};

export default function WaveLinkText({
  text,
  className = "",
}: WaveLinkTextProps) {
  return (
    <span
      className={`group inline-flex overflow-hidden align-bottom leading-tight ${className}`}
      aria-label={text}
    >
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="relative inline-block overflow-hidden"
          style={
            {
              "--delay": `${index * 15}ms`,
            } as React.CSSProperties
          }
        >
          <span
            className="block transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{
              transitionDelay: "var(--delay)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>

          <span
            aria-hidden="true"
            className="absolute left-0 top-full block transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{
              transitionDelay: "var(--delay)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}
