"use client";

import Image from "next/image";

import type { ImageDimensions, ImageLayout } from "./projectTypes";

type ProjectGalleryItemProps = {
  src: string;

  index: number;

  title: string;

  layout: ImageLayout;

  dimensions?: ImageDimensions;

  isLoaded: boolean;

  onLoadAction: (index: number, dimensions: ImageDimensions) => void;

  onRegisterAction: (index: number, element: HTMLDivElement | null) => void;
};

export default function ProjectGalleryItem({
  src,
  index,
  title,
  layout,
  dimensions,
  isLoaded,
  onLoadAction,
  onRegisterAction,
}: ProjectGalleryItemProps) {
  const loadImmediately = index <= 1;

  return (
    <div
      className={`
        flex
        w-full
        ${layout.row}
      `}
    >
      <div
        className={`
          relative
          w-full

          ${layout.size}
          ${layout.offset}
        `}
      >
        <div
          ref={(element) => {
            onRegisterAction(index, element);
          }}
          role="img"
          aria-label={title || `Project Image ${index + 1}`}
          className="
            relative
            w-full
          "
        >
          {/*
           * Dette eksisterer kun for:
           *
           * - layout
           * - aspect ratio
           * - image dimensions
           *
           * Three.js rendrer det synlige bildet.
           */}
          <Image
            unoptimized
            src={src}
            alt=""
            aria-hidden="true"
            width={dimensions?.width ?? 850}
            height={dimensions?.height ?? 450}
            sizes="
              (max-width: 1024px) 520px,
              680px
            "
            loading={loadImmediately ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            draggable={false}
            className="
              pointer-events-none
              invisible

              block
              h-auto
              w-full

              select-none
            "
            onLoad={(event) => {
              const image = event.currentTarget;

              onLoadAction(index, {
                width: image.naturalWidth || 850,

                height: image.naturalHeight || 450,
              });
            }}
          />

          {!isLoaded ? (
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
                bg-white/[0.035]
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  animate-pulse
                  bg-gradient-to-br
                  from-white/[0.02]
                  via-white/[0.07]
                  to-white/[0.02]
                "
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
