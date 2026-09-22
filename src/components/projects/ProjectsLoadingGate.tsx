"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

import HeroLoadingSpinner from "../hero/HeroLoadingSpinner";

/*
 * =========================================================
 * SETTINGS
 * =========================================================
 */

/*
 * Dette er KUN minimumstiden spinneren får være synlig.
 *
 * Det betyr ikke at vi faker loading:
 *
 * - Hvis assets bruker 2 sekunder -> spinner varer 2 sekunder+
 * - Hvis assets ligger cached -> spinner varer minst 800ms
 */
const MIN_LOADER_VISIBLE_TIME = 800;

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ProjectsLoadingGateProps = {
  children: ReactNode;

  /*
   * Første desktop preview.
   */
  desktopSrc?: string | null;

  /*
   * Bildene på gjeldende mobile side.
   */
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
   * null = viewport ikke bestemt enda.
   * true = lg+
   * false = under lg
   */
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  /*
   * Første loading-cycle.
   */
  const [assetsReady, setAssetsReady] = useState(false);

  /*
   * Starter spinnerens slurp-exit.
   */
  const [loaderComplete, setLoaderComplete] = useState(false);

  /*
   * Når denne blir true:
   *
   * Projects mountes.
   *
   * Viktig:
   * den går ALDRI tilbake til false ved filterendringer.
   */
  const [showContent, setShowContent] = useState(false);

  /*
   * Holder tiden spinneren startet.
   */
  const loaderStartedAtRef = useRef<number>(0);

  /*
   * Vi skal bare gjøre initial loader én gang
   * for denne mounted gaten.
   *
   * Filter/searchParams kan endre props senere,
   * men da skal vi IKKE starte loader på nytt.
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
   * DETECT DESKTOP / MOBILE
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
   *
   * Denne effekten kan teknisk få nye props etter filtering,
   * fordi desktopSrc/mobileSrcs endres.
   *
   * MEN:
   *
   * initialLoadFinishedRef sørger for at vi aldri starter
   * side-loaderen igjen etter første loading-cycle.
   */

  useEffect(() => {
    if (isDesktop === null || initialLoadFinishedRef.current) {
      return;
    }

    let cancelled = false;

    /*
     * ===================================================
     * DESKTOP
     * ===================================================
     */

    if (isDesktop) {
      /*
       * Ingen prosjekt?
       *
       * Da finnes ingenting å laste.
       */
      if (!desktopSrc) {
        setAssetsReady(true);

        return;
      }

      /*
       * Varm R3F-cachen.
       *
       * ProjectPreview bruker samme TextureLoader-cache.
       */
      useLoader.preload(TextureLoader, desktopSrc);

      /*
       * Vi bruker også TextureLoader direkte fordi vi
       * trenger et faktisk completion callback.
       */
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
           * Gir browseren én frame før spinner-exiten.
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
         * Et ødelagt bilde skal aldri kunne låse
         * hele /projects permanent.
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

    /*
     * Vanlig browser image preload.
     *
     * ProjectsTableMobile trenger dermed ikke
     * være mounted mens spinneren vises.
     */
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
  }, [isDesktop, desktopSrc, mobileSrcs]);

  /*
   * =====================================================
   * ASSETS READY
   * =====================================================
   *
   * Først når assets faktisk er ferdige begynner
   * vi å avslutte spinneren.
   */

  useEffect(() => {
    if (!assetsReady || loaderComplete || initialLoadFinishedRef.current) {
      return;
    }

    const elapsed = performance.now() - loaderStartedAtRef.current;

    const remaining = Math.max(MIN_LOADER_VISIBLE_TIME - elapsed, 0);

    const timeout = window.setTimeout(() => {
      setLoaderComplete(true);
    }, remaining);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [assetsReady, loaderComplete]);

  /*
   * =====================================================
   * SPINNER EXIT COMPLETE
   * =====================================================
   */

  const handleExitComplete = () => {
    /*
     * Nå er initial loading permanent ferdig
     * for denne ProjectsLoadingGate-instansen.
     */
    initialLoadFinishedRef.current = true;

    /*
     * Mount Projects.
     *
     * TextReveal / Framer Motion starter først NÅ.
     */
    setShowContent(true);
  };

  /*
   * =====================================================
   * PROJECTS
   * =====================================================
   *
   * Etter første load returnerer vi children direkte.
   *
   * Filterendringer endrer children/props,
   * men ProjectsLoadingGate remountes ikke.
   *
   * Derfor:
   *
   * showContent forblir true.
   */

  if (showContent) {
    return children;
  }

  /*
   * =====================================================
   * INITIAL LOADER
   * =====================================================
   */

  return (
    <div
      className="
        fixed
        inset-0
        z-[1199]
        bg-dark
      "
    >
      <HeroLoadingSpinner
        loaderComplete={loaderComplete}
        onExitComplete={handleExitComplete}
      />
    </div>
  );
}
