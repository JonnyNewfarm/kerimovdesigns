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

const MIN_LOADER_VISIBLE_TIME = 800;

const BACKDROP_FADE_DURATION = 0.7;

/*
 * Samme som Projects-loaderen.
 *
 * Loaderen skal IKKE dekke navbaren.
 */
const NAVBAR_HEIGHT = 72;

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ProjectDetailsLoadingGateProps = {
  children: ReactNode;

  /*
   * Første bildene vi faktisk trenger
   * før project details vises.
   */
  initialImages?: string[];
};

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function ProjectDetailsLoadingGate({
  children,
  initialImages = [],
}: ProjectDetailsLoadingGateProps) {
  /*
   * Faktiske preload-assets ferdige.
   */
  const [assetsReady, setAssetsReady] = useState(false);

  /*
   * Når denne blir true:
   *
   * - project details mountes
   * - header-animationer starter
   * - spinner slurpes
   * - dark backdrop fader ut
   */
  const [revealStarted, setRevealStarted] = useState(false);

  /*
   * Starter spinner-exit.
   */
  const [loaderComplete, setLoaderComplete] = useState(false);

  /*
   * Hele loader-laget kan fjernes.
   */
  const [loaderExited, setLoaderExited] = useState(false);

  const loaderStartedAtRef = useRef(0);

  /*
   * =====================================================
   * START
   * =====================================================
   */

  useEffect(() => {
    loaderStartedAtRef.current = performance.now();
  }, []);

  /*
   * =====================================================
   * PRELOAD FIRST PROJECT IMAGES
   * =====================================================
   */

  useEffect(() => {
    if (revealStarted) {
      return;
    }

    /*
     * Ingen bilder?
     *
     * Da trenger vi ikke vente på noe.
     */
    if (initialImages.length === 0) {
      setAssetsReady(true);

      return;
    }

    let cancelled = false;

    let completed = 0;

    /*
     * Fjern duplicates.
     */
    const uniqueImages = Array.from(new Set(initialImages.filter(Boolean)));

    if (uniqueImages.length === 0) {
      setAssetsReady(true);

      return;
    }

    /*
     * ===================================================
     * WARM THREE CACHE
     * ===================================================
     *
     * Desktop ProjectGalleryThreeCanvas bruker
     * Three textures.
     *
     * Dermed ligger de første bildene allerede
     * klare når canvasen mountes.
     */

    uniqueImages.forEach((src) => {
      useLoader.preload(TextureLoader, src);
    });

    /*
     * ===================================================
     * BROWSER PRELOAD
     * ===================================================
     *
     * Gir oss et faktisk completion-signal.
     */

    const markComplete = () => {
      if (cancelled) {
        return;
      }

      completed += 1;

      if (completed < uniqueImages.length) {
        return;
      }

      /*
       * Én ekstra frame før reveal.
       */
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

      /*
       * Broken image skal aldri
       * kunne låse hele siden.
       */
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

  /*
   * =====================================================
   * START REVEAL
   * =====================================================
   */

  useEffect(() => {
    if (!assetsReady || revealStarted) {
      return;
    }

    const elapsed = performance.now() - loaderStartedAtRef.current;

    const remaining = Math.max(MIN_LOADER_VISIBLE_TIME - elapsed, 0);

    const timeout = window.setTimeout(() => {
      /*
       * Project details mountes NÅ.
       *
       * Dermed begynner:
       *
       * - ProjectHeader
       * - TextReveal
       * - RollingCount
       * - Metadata
       *
       * å animere mens backdropen
       * fortsatt ligger over.
       */
      setRevealStarted(true);

      /*
       * Samtidig:
       * start spinner-slurp.
       */
      setLoaderComplete(true);
    }, remaining);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [assetsReady, revealStarted]);

  /*
   * =====================================================
   * SPINNER FINISHED
   * =====================================================
   */

  const handleExitComplete = () => {
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
       * PROJECT DETAILS
       * =================================================
       *
       * Ikke mounted mens vi faktisk loader.
       *
       * Mountes idet reveal starter.
       */}

      {revealStarted ? children : null}

      {/*
       * =================================================
       * LOADER AREA
       * =================================================
       *
       * Starter UNDER navbar.
       */}

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
          {/*
           * =============================================
           * DARK BACKDROP
           * =============================================
           *
           * Samme reveal-prinsipp som heroen:
           *
           * mørk flate fader bort mens
           * project content allerede animerer under.
           */}

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
