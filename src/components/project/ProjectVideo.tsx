"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

type ProjectVideoProps = {
  src: string;
  poster?: string | null;
  variant: "mobile" | "desktop";
};

const videoEase = [0.76, 0, 0.24, 1] as const;

export default function ProjectVideo({
  src,
  poster,
  variant,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleVideo = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch {
      setIsVideoPlaying(false);
    }
  };

  const outerClassName =
    variant === "mobile"
      ? "w-full"
      : "flex w-full justify-center lg:justify-start";

  const innerClassName =
    variant === "mobile"
      ? "w-full"
      : "w-full max-w-[520px] lg:max-w-[680px] lg:translate-x-20";

  const controlClassName =
    variant === "mobile"
      ? `
          pointer-events-none
          absolute
          bottom-4
          right-4
          z-10
          flex
          h-12
          w-12
          items-center
          justify-center
          bg-black/40
          text-white
        `
      : `
          pointer-events-none
          absolute
          bottom-6
          right-6
          z-10
          flex
          h-20
          w-20
          items-center
          justify-center
          bg-black/40
          text-white
        `;

  const iconClassName = variant === "mobile" ? "h-12 w-12" : "h-16 w-16";

  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        <h2
          className="
            mb-2
            text-xl
            font-black
            uppercase
          "
        >
          Video
        </h2>

        <button
          type="button"
          aria-label={isVideoPlaying ? "Pause video" : "Play video"}
          onClick={toggleVideo}
          className="
            relative
            block
            w-full
            cursor-pointer
            overflow-hidden
            text-left
          "
          style={{
            aspectRatio: videoAspectRatio,
          }}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster ?? undefined}
            muted
            loop
            playsInline
            preload="metadata"
            className="
              pointer-events-none
              absolute
              inset-0
              h-full
              w-full
              select-none
              object-cover
            "
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;

              if (video.videoWidth && video.videoHeight) {
                setVideoAspectRatio(video.videoWidth / video.videoHeight);
              }
            }}
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onEnded={() => setIsVideoPlaying(false)}
          />

          <span aria-hidden="true" className={controlClassName}>
            <AnimatePresence initial={false} mode="wait">
              {isVideoPlaying ? (
                <motion.svg
                  key="pause"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={iconClassName}
                  initial={{
                    opacity: 0,
                    scale: 0.65,
                    rotate: -12,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.65,
                    rotate: 12,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: videoEase,
                  }}
                >
                  <path d="M8 5V19" stroke="currentColor" strokeWidth="2" />

                  <path d="M16 5V19" stroke="currentColor" strokeWidth="2" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="play"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={iconClassName}
                  initial={{
                    opacity: 0,
                    scale: 0.65,
                    rotate: -12,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.65,
                    rotate: 12,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: videoEase,
                  }}
                >
                  <path
                    d="M7 4L18 12L7 20V4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="miter"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </span>
        </button>
      </div>
    </div>
  );
}
