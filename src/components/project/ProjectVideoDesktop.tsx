"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

type ProjectVideoDesktopProps = {
  src: string;

  anchorRef: MutableRefObject<HTMLDivElement | null>;

  videoRef: MutableRefObject<HTMLVideoElement | null>;

  hasStartedRef: MutableRefObject<boolean>;
};

export default function ProjectVideoDesktop({
  src,
  anchorRef,
  videoRef,
  hasStartedRef,
}: ProjectVideoDesktopProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);

  useEffect(() => {
    const video = localVideoRef.current;

    hasStartedRef.current = false;

    if (!video) {
      return;
    }

    video.muted = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {}
    };

    void playVideo();

    return () => {
      video.pause();

      hasStartedRef.current = false;
    };
  }, [src, hasStartedRef]);

  const tryPlay = (video: HTMLVideoElement) => {
    if (!video.paused) {
      return;
    }

    void video.play().catch(() => {});
  };

  return (
    <div
      className="
        flex
        w-full
        justify-center

        lg:justify-start
      "
    >
      <div
        className="
          w-full
          max-w-[520px]

          lg:max-w-[680px]
          lg:translate-x-20
        "
      >
        <div
          ref={(element) => {
            anchorRef.current = element;
          }}
          className="
            relative
            w-full
          "
          style={{
            aspectRatio: videoAspectRatio,
          }}
        >
          <video
            ref={(element) => {
              localVideoRef.current = element;

              videoRef.current = element;
            }}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            aria-hidden="true"
            tabIndex={-1}
            className="
              pointer-events-none
              absolute
              inset-0

              h-full
              w-full

              select-none
              object-cover

              opacity-0
            "
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;

              if (video.videoWidth && video.videoHeight) {
                setVideoAspectRatio(video.videoWidth / video.videoHeight);
              }

              tryPlay(video);
            }}
            onLoadedData={(event) => {
              tryPlay(event.currentTarget);
            }}
            onCanPlay={(event) => {
              tryPlay(event.currentTarget);
            }}
            onPlaying={() => {
              hasStartedRef.current = true;
            }}
          />
        </div>
      </div>
    </div>
  );
}
