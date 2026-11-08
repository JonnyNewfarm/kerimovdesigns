"use client";

import type { MutableRefObject } from "react";

type Props = {
  titleRef: MutableRefObject<HTMLDivElement | null>;
  title: string;
};

export default function ProjectTitle({ titleRef, title }: Props) {
  return (
    <div
      ref={(element) => {
        titleRef.current = element;
      }}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[40] max-w-[90vw] break-words font-bueno font-bold uppercase leading-[1.02] tracking-[0.005em] text-white mix-blend-difference"
      style={{
        opacity: 0,
        willChange: "left, top, transform, opacity",
      }}
    >
      <span className="block overflow-hidden">
        <span data-project-title-text className="block will-change-transform">
          {title}
        </span>
      </span>
    </div>
  );
}
