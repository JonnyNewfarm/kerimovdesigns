"use client";

import { useLoader } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";

import HeroLoadingSpinner from "../hero/HeroLoadingSpinner";

const MIN_LOADER_VISIBLE_TIME = 800;

const BACKDROP_FADE_DURATION = 0.7;

const NAVBAR_HEIGHT = 72;

type ProjectDetailsLoadingGateProps = {
  children: ReactNode;

  initialImages?: string[];
};

export default function ProjectDetailsLoadingGate({
  children,
  initialImages = [],
}: ProjectDetailsLoadingGateProps) {
  const [assetsReady, setAssetsReady] = useState(false);

  const [revealStarted, setRevealStarted] = useState(false);

  const [loaderComplete, setLoaderComplete] = useState(false);

  const [loaderExited, setLoaderExited] = useState(false);

  const loaderStartedAtRef = useRef(0);

  useEffect(() => {
    loaderStartedAtRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (revealStarted) {
      return;
    }

    if (initialImages.length === 0) {
      setAssetsReady(true);

      return;
    }

    let cancelled = false;

    let completed = 0;

    const uniqueImages = Array.from(new Set(initialImages.filter(Boolean)));

    if (uniqueImages.length === 0) {
      setAssetsReady(true);

      return;
    }

    uniqueImages.forEach((src) => {
      useLoader.preload(TextureLoader, src);
    });

    const markComplete = () => {
      if (cancelled) {
        return;
      }

      completed += 1;

      if (completed < uniqueImages.length) {
        return;
      }

      window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setAssetsReady(true);
      });
    };

    const preloaders = uniqueImages.map((src) => {
      const image = new window.Image();

      image.decoding = "async";

      image.onload = markComplete;

      image.onerror = markComplete;

      image.src = src;

      return image;
    });

    return () => {
      cancelled = true;

      preloaders.forEach((image) => {
        image.onload = null;

        image.onerror = null;
      });
    };
  }, [initialImages, revealStarted]);

  useEffect(() => {
    if (!assetsReady || revealStarted) {
      return;
    }

    const elapsed = performance.now() - loaderStartedAtRef.current;

    const remaining = Math.max(MIN_LOADER_VISIBLE_TIME - elapsed, 0);

    const timeout = window.setTimeout(() => {
      setRevealStarted(true);

      setLoaderComplete(true);
    }, remaining);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [assetsReady, revealStarted]);

  const handleExitComplete = () => {
    setLoaderExited(true);
  };

  return (
    <div
      className="
        relative
        min-h-screen
        bg-dark
      "
    >
      {revealStarted ? children : null}

      {!loaderExited ? (
        <div
          className="
            pointer-events-none
            fixed
            bottom-0
            left-0
            right-0
            z-[1198]
            overflow-hidden
          "
          style={{
            top: `${NAVBAR_HEIGHT}px`,
          }}
        >
          <div
            className={`
              absolute
              inset-0
              bg-[#181c14]

              transition-opacity
              ease-[cubic-bezier(0.22,1,0.36,1)]

              ${revealStarted ? "opacity-0" : "opacity-100"}
            `}
            style={{
              transitionDuration: `${BACKDROP_FADE_DURATION}s`,

              transitionDelay: revealStarted ? "0.08s" : "0s",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-[2]
            "
          >
            <HeroLoadingSpinner
              loaderComplete={loaderComplete}
              onExitComplete={handleExitComplete}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
