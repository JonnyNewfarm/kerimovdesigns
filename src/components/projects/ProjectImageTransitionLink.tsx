"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ProjectImageTransitionLinkProps = {
  href: string;
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  onTransitionStart?: () => void;
  onMouseMove?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
};

const imageEase = [0.76, 0, 0.24, 1] as const;
const maskEase = [0.83, 0, 0.17, 1] as const;

const isModifiedClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
};

const getOldProjectFirstImageTargetRect = (): Rect => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width >= 1280) {
    return {
      left: 80,
      top: Math.min(560, height * 0.58),
      width: 640,
      height: 420,
    };
  }

  if (width >= 1024) {
    return {
      left: 80,
      top: Math.min(540, height * 0.58),
      width: 560,
      height: 370,
    };
  }

  if (width >= 640) {
    return {
      left: 72,
      top: Math.min(500, height * 0.58),
      width: 360,
      height: 250,
    };
  }

  return {
    left: 16,
    top: Math.min(440, height * 0.56),
    width: Math.min(280, width - 32),
    height: 210,
  };
};

export default function ProjectImageTransitionLink({
  href,
  src,
  alt,
  children,
  className,
  "aria-label": ariaLabel,
  onTransitionStart,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: ProjectImageTransitionLinkProps) {
  const router = useRouter();

  const [startRect, setStartRect] = useState<Rect | null>(null);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAnimating]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(event)) return;

    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();

    setStartRect({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    });

    setTargetRect(getOldProjectFirstImageTargetRect());
    setIsAnimating(true);
    onTransitionStart?.();
  };

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </a>

      <AnimatePresence>
        {isAnimating && startRect && targetRect && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden bg-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-dark"
              initial={{
                clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
              }}
              animate={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
              transition={{
                duration: 0.56,
                ease: maskEase,
              }}
            />

            <motion.div
              className="absolute inset-0 bg-white/5 mix-blend-difference"
              initial={{
                opacity: 0,
                clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
              }}
              animate={{
                opacity: 1,
                clipPath: "polygon(0% 0%, 100% 0%, 84% 100%, 0% 100%)",
              }}
              transition={{
                duration: 0.64,
                ease: maskEase,
                delay: 0.04,
              }}
            />

            <motion.div
              className="absolute overflow-hidden bg-dark"
              initial={{
                left: startRect.left,
                top: startRect.top,
                width: startRect.width,
                height: startRect.height,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
              animate={{
                left: targetRect.left,
                top: targetRect.top,
                width: targetRect.width,
                height: targetRect.height,
                clipPath: [
                  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
                  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ],
              }}
              transition={{
                left: {
                  duration: 1.05,
                  ease: imageEase,
                },
                top: {
                  duration: 1.05,
                  ease: imageEase,
                },
                width: {
                  duration: 1.05,
                  ease: imageEase,
                },
                height: {
                  duration: 1.05,
                  ease: imageEase,
                },
                clipPath: {
                  duration: 1.05,
                  ease: maskEase,
                },
              }}
              onAnimationComplete={() => {
                router.push(href);
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{
                  scale: 1.08,
                  filter: "brightness(1.05) contrast(1.08)",
                }}
                animate={{
                  scale: 1,
                  filter: "brightness(0.86) contrast(1.12)",
                }}
                transition={{
                  duration: 1.05,
                  ease: imageEase,
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-dark"
                initial={{
                  opacity: 0,
                  clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                }}
                animate={{
                  opacity: 0.22,
                  clipPath: "polygon(0% 0%, 100% 0%, 86% 100%, 0% 100%)",
                }}
                transition={{
                  duration: 0.9,
                  ease: maskEase,
                  delay: 0.08,
                }}
              />

              <motion.div
                className="absolute inset-0 border border-white/15"
                initial={{
                  opacity: 0,
                  clipPath: "inset(0% 100% 0% 0%)",
                }}
                animate={{
                  opacity: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                }}
                transition={{
                  duration: 0.5,
                  ease: maskEase,
                  delay: 0.12,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
