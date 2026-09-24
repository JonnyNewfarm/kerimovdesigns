"use client";

import { useLoader } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";

import HeroLoadingSpinner from "../hero/HeroLoadingSpinner";

const MIN_LOADER_VISIBLE_TIME = 800;

const BACKDROP_FADE_DURATION = 0.7;

const NAVBAR_HEIGHT = 72;

type ProjectsLoadingGateProps = {
  children: ReactNode;

  desktopSrc?: string | null;

  mobileSrcs?: string[];
};

export default function ProjectsLoadingGate({
  children,
  desktopSrc,
  mobileSrcs = [],
}: ProjectsLoadingGateProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  const [assetsReady, setAssetsReady] = useState(false);

  const [revealStarted, setRevealStarted] = useState(false);

  const [loaderComplete, setLoaderComplete] = useState(false);

  const [loaderExited, setLoaderExited] = useState(false);

  const initialLoadFinishedRef = useRef(false);

  const loaderStartedAtRef = useRef(0);

  useEffect(() => {
    loaderStartedAtRef.current = performance.now();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();

    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (isDesktop === null || initialLoadFinishedRef.current || revealStarted) {
      return;
    }

    let cancelled = false;

    if (isDesktop) {
      if (!desktopSrc) {
        setAssetsReady(true);

        return;
      }

      useLoader.preload(TextureLoader, desktopSrc);

      const loader = new TextureLoader();

      loader.load(
        desktopSrc,

        () => {
          if (cancelled) {
            return;
          }

          window.requestAnimationFrame(() => {
            if (cancelled) {
              return;
            }

            setAssetsReady(true);
          });
        },

        undefined,

        () => {
          if (cancelled) {
            return;
          }

          setAssetsReady(true);
        },
      );

      return () => {
        cancelled = true;
      };
    }

    if (mobileSrcs.length === 0) {
      setAssetsReady(true);

      return;
    }

    let completed = 0;

    const markComplete = () => {
      if (cancelled) {
        return;
      }

      completed += 1;

      if (completed < mobileSrcs.length) {
        return;
      }

      window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setAssetsReady(true);
      });
    };

    const images = mobileSrcs.map((src) => {
      const image = new window.Image();

      image.onload = markComplete;

      image.onerror = markComplete;

      image.src = src;

      return image;
    });

    return () => {
      cancelled = true;

      images.forEach((image) => {
        image.onload = null;

        image.onerror = null;
      });
    };
  }, [isDesktop, desktopSrc, mobileSrcs, revealStarted]);

  useEffect(() => {
    if (!assetsReady || revealStarted || initialLoadFinishedRef.current) {
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
    initialLoadFinishedRef.current = true;

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
