"use client";

import type { MutableRefObject } from "react";

export default function ProjectBackdrop({
  backdropRef,
}: {
  backdropRef: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={(element) => {
        backdropRef.current = element;
      }}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[15] bg-[#0e0d0c]/97 backdrop-blur-[24px] opacity-0"
    />
  );
}
