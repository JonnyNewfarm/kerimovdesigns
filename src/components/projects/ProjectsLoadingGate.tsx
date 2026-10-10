"use client";

import { useLoader } from "@react-three/fiber";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextureLoader } from "three";

import HeroLoadingSpinner from "../hero/HeroLoadingSpinner";

const MIN_LOADER_VISIBLE_TIME = 850;
const NAVBAR_HEIGHT = 72;

type ProjectsRevealContextType = {
  revealStarted: boolean;
};

const ProjectsRevealContext = createContext<ProjectsRevealContextType>({
  revealStarted: false,
});

export const useProjectsReveal = () => {
  return useContext(ProjectsRevealContext);
};

type ProjectsLoadingGateProps = {
  children: ReactNode;
  desktopSrcs?: string[];
  mobileSrcs?: string[];
};

export default function ProjectsLoadingGate({
  children,
  desktopSrcs = [],
  mobileSrcs = [],
}: ProjectsLoadingGateProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  const [assetsReady, setAssetsReady] = useState(false);

  const [revealStarted, setRevealStarted] = useState(false);

  const [loaderComplete, setLoaderComplete] = useState(false);

  const [loaderExited, setLoaderExited] = useState(false);

  const initialLoadFinishedRef = useRef(false);

  const loaderStartedAtRef = useRef(0);

  const stableDesktopSrcs = useMemo(() => {
    return Array.from(new Set(desktopSrcs.filter(Boolean)));
  }, [desktopSrcs]);

  const stableMobileSrcs = useMemo(() => {
    return Array.from(new Set(mobileSrcs.filter(Boolean)));
  }, [mobileSrcs]);

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
    if (isDesktop === null || initialLoadFinishedRef.current) {
      return;
    }

    let cancelled = false;

    const sources = isDesktop ? stableDesktopSrcs : stableMobileSrcs;

    if (sources.length === 0) {
      setAssetsReady(true);

      return;
    }

    if (isDesktop) {
      sources.forEach((src) => {
        useLoader.preload(TextureLoader, src);
      });
    }

    let completed = 0;

    const markComplete = () => {
      if (cancelled) {
        return;
      }

      completed += 1;

      if (completed < sources.length) {
        return;
      }

      setAssetsReady(true);
    };

    const images = sources.map((src) => {
      const image = new window.Image();

      image.decoding = "async";

      image.onload = () => {
        if (typeof image.decode === "function") {
          image
            .decode()
            .catch(() => {})
            .finally(markComplete);

          return;
        }

        markComplete();
      };

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
  }, [isDesktop, stableDesktopSrcs, stableMobileSrcs]);

  useEffect(() => {
    if (!assetsReady || revealStarted || initialLoadFinishedRef.current) {
      return;
    }

    const elapsed = performance.now() - loaderStartedAtRef.current;

    const remaining = Math.max(MIN_LOADER_VISIBLE_TIME - elapsed, 0);

    let frameOne = 0;
    let frameTwo = 0;

    const timeout = window.setTimeout(() => {
      frameOne = window.requestAnimationFrame(() => {
        frameTwo = window.requestAnimationFrame(() => {
          setRevealStarted(true);

          setLoaderComplete(true);
        });
      });
    }, remaining);

    return () => {
      window.clearTimeout(timeout);

      if (frameOne) {
        window.cancelAnimationFrame(frameOne);
      }

      if (frameTwo) {
        window.cancelAnimationFrame(frameTwo);
      }
    };
  }, [assetsReady, revealStarted]);

  const handleExitComplete = () => {
    initialLoadFinishedRef.current = true;

    setLoaderExited(true);
  };

  return (
    <ProjectsRevealContext.Provider
      value={{
        revealStarted,
      }}
    >
      <div
        className="
          relative
          min-h-screen
          bg-dark
        "
      >
        <div
          className="
            relative
            min-h-screen
          "
          style={{
            pointerEvents: revealStarted ? "auto" : "none",
          }}
        >
          {children}
        </div>

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
                duration-700
                ease-[cubic-bezier(0.16,1,0.3,1)]

                ${revealStarted ? "opacity-0" : "opacity-100"}
              `}
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
    </ProjectsRevealContext.Provider>
  );
}
