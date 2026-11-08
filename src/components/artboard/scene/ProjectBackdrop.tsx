"use client";

import type { RefObject } from "react";

export default function ProjectBackdrop({
  backdropRef,
}: {
  backdropRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={backdropRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[15] bg-[#0e0d0c]/97 backdrop-blur-[24px] opacity-0"
    />
  );
}
