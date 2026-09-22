"use client";

import { useLoader } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";

import HeroLoadingSpinner from "../hero/HeroLoadingSpinner";

/*
 * =========================================================
 * SETTINGS
 * =========================================================
 */

/*
 * Kun minimumstid.
 *
 * Assets må fortsatt faktisk være ferdige før
 * revealen kan starte.
 */
const MIN_LOADER_VISIBLE_TIME = 800;

/*
 * Samme type timing som hero-backdropen.
 */
const BACKDROP_FADE_DURATION = 0.7;

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ProjectsLoadingGateProps = {
  children: ReactNode;

  desktopSrc?: string | null;

  mobileSrcs?: string[];
};

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function ProjectsLoadingGate({
  children,
  desktopSrc,
  mobileSrcs = [],
}: ProjectsLoadingGateProps) {
  /*
   * null = viewport ikke funnet enda
   * true = desktop
   * false = mobile/tablet
   */
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  /*
   * De faktiske initial-assetsene er ferdige.
   */
  const [assetsReady, setAssetsReady] = useState(false);

  /*
   * Når denne blir true:
   *
   * - Projects mountes
   * - alle Framer Motion-animasjoner starter
   * - spinneren starter slurp
   * - dark backdrop begynner å fade ut
   *
   * ALT samtidig.
   */
  const [revealStarted, setRevealStarted] = useState(false);

  /*
   * Sendes til selve spinneren.
   */
  const [loaderComplete, setLoaderComplete] = useState(false);

  /*
   * Når spinneren er helt ferdig
   * kan loader-lagene fjernes fra DOM.
   */
  const [loaderExited, setLoaderExited] = useState(false);

  const loaderStartedAtRef = useRef(0);

  /*
   * Når første intro er ferdig skal filter,
   * pagination osv. ALDRI starte spinneren igjen.
   */
  const initialLoadFinishedRef = useRef(false);

  /*
   * =====================================================
   * START TIME
   * =====================================================
   */

  useEffect(() => {
    loaderStartedAtRef.current = performance.now();
  }, []);

  /*
   * =====================================================
   * VIEWPORT
   * =====================================================
   */

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

  /*
   * =====================================================
   * INITIAL ASSET PRELOAD
   * =====================================================
   */

  useEffect(() => {
    if (isDesktop === null || initialLoadFinishedRef.current || revealStarted) {
      return;
    }

    let cancelled = false;

    /*
     * ===================================================
     * DESKTOP
     * ===================================================
     */

    if (isDesktop) {
      if (!desktopSrc) {
        setAssetsReady(true);

        return;
      }

      /*
       * Varm R3F-cachen.
       */
      useLoader.preload(TextureLoader, desktopSrc);

      const loader = new TextureLoader();

      loader.load(
        desktopSrc,

        /*
         * LOADED
         */
        () => {
          if (cancelled) {
            return;
          }

          /*
           * Én frame før vi melder ready.
           */
          window.requestAnimationFrame(() => {
            if (cancelled) {
              return;
            }

            setAssetsReady(true);
          });
        },

        undefined,

        /*
         * ERROR
         *
         * Broken asset skal aldri kunne
         * låse siden permanent.
         */
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

    /*
     * ===================================================
     * MOBILE
     * ===================================================
     */

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

  /*
   * =====================================================
   * START REVEAL
   * =====================================================
   *
   * DETTE er forskjellen.
   *
   * Vi venter IKKE til spinneren er helt borte
   * før Projects mountes.
   *
   * Når assets er klare starter:
   *
   * 1. Projects mount
   * 2. Framer Motion
   * 3. spinner slurp
   * 4. backdrop fade
   *
   * samtidig.
   *
   * Det er den hero-lignende overgangen.
   */

  useEffect(() => {
    if (!assetsReady || revealStarted || initialLoadFinishedRef.current) {
      return;
    }

    const elapsed = performance.now() - loaderStartedAtRef.current;

    const remaining = Math.max(MIN_LOADER_VISIBLE_TIME - elapsed, 0);

    const timeout = window.setTimeout(() => {
      /*
       * Mount Projects.
       */
      setRevealStarted(true);

      /*
       * Start spinner slurp samtidig.
       */
      setLoaderComplete(true);
    }, remaining);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [assetsReady, revealStarted]);

  /*
   * =====================================================
   * SPINNER FULLY EXITED
   * =====================================================
   */

  const handleExitComplete = () => {
    initialLoadFinishedRef.current = true;

    setLoaderExited(true);
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div
      className="
        relative
        min-h-screen
        bg-dark
      "
    >
      {/*
       * =================================================
       * PROJECTS
       * =================================================
       *
       * Ikke mounted under faktisk loading.
       *
       * Mountes akkurat idet loader-exiten starter.
       *
       * Dermed starter alle:
       *
       * - TextReveal
       * - ProjectPreview
       * - sidebar motion
       * - PageTransitionGate
       *
       * mens den mørke loader-backdropen
       * fader bort over dem.
       */}

      {revealStarted ? children : null}

      {/*
       * =================================================
       * DARK HERO-STYLE BACKDROP
       * =================================================
       *
       * Ingen lys overlay.
       *
       * Bare samme prinsipp som hero:
       *
       * mørk flate -> transparent
       *
       * mens innholdet allerede animerer under.
       */}

      {!loaderExited ? (
        <div
          className="
            pointer-events-none
            fixed
            inset-0
            z-[1198]
          "
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

          {/*
           * =============================================
           * SPINNER
           * =============================================
           *
           * Eget lag så backdrop-opacity IKKE påvirker
           * spinnerens egen slurp-animasjon.
           */}

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
