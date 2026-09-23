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
 * Minimum tiden spinneren er synlig.
 *
 * Dette faker ikke loading.
 * Assets må fortsatt faktisk være klare.
 */
const MIN_LOADER_VISIBLE_TIME = 800;

/*
 * Samme type dark backdrop fade
 * som heroen.
 */
const BACKDROP_FADE_DURATION = 0.7;

/*
 * Navbar height.
 *
 * Loaderen starter UNDER denne.
 */
const NAVBAR_HEIGHT = 72;

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
   * Prosjektbildene på aktuell mobile side.
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
   * null = viewport ikke bestemt enda
   * true = desktop
   * false = mobile/tablet
   */
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  /*
   * Første nødvendige assets er ferdige.
   */
  const [assetsReady, setAssetsReady] = useState(false);

  /*
   * Når revealStarter:
   *
   * - Projects mountes
   * - Framer Motion starter
   * - spinneren starter slurp
   * - mørk backdrop fader ut
   */
  const [revealStarted, setRevealStarted] = useState(false);

  /*
   * Sendes inn i spinneren.
   *
   * true starter slurp-exiten.
   */
  const [loaderComplete, setLoaderComplete] = useState(false);

  /*
   * Når spinneren er helt ferdig
   * kan hele loader-laget fjernes.
   */
  const [loaderExited, setLoaderExited] = useState(false);

  /*
   * Når første projects-loader er ferdig
   * skal filtering aldri starte den igjen.
   */
  const initialLoadFinishedRef = useRef(false);

  /*
   * Tidspunkt loaderen startet.
   */
  const loaderStartedAtRef = useRef(0);

  /*
   * =====================================================
   * INITIAL TIME
   * =====================================================
   */

  useEffect(() => {
    loaderStartedAtRef.current = performance.now();
  }, []);

  /*
   * =====================================================
   * DESKTOP / MOBILE
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
   * PRELOAD INITIAL ASSETS
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
      /*
       * Ingen prosjekt å vise.
       */
      if (!desktopSrc) {
        setAssetsReady(true);

        return;
      }

      /*
       * Warm R3F cache.
       *
       * ProjectPreview bruker TextureLoader,
       * så samme asset vil normalt være cached
       * når Projects mountes.
       */
      useLoader.preload(TextureLoader, desktopSrc);

      /*
       * Vi trenger også et faktisk
       * completion callback.
       */
      const loader = new TextureLoader();

      loader.load(
        desktopSrc,

        /*
         * LOAD COMPLETE
         */
        () => {
          if (cancelled) {
            return;
          }

          /*
           * Gi browseren én frame før
           * vi starter reveal.
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
         * Broken asset skal aldri
         * låse /projects permanent.
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

    /*
     * Ingen bilder.
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

      /*
       * Fortsatt bilder igjen.
       */
      if (completed < mobileSrcs.length) {
        return;
      }

      /*
       * Alle ferdige.
       */
      window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setAssetsReady(true);
      });
    };

    /*
     * Preload alle bilder på
     * den aktuelle mobile siden.
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
  }, [isDesktop, desktopSrc, mobileSrcs, revealStarted]);

  /*
   * =====================================================
   * ASSETS READY -> START HERO-STYLE REVEAL
   * =====================================================
   *
   * Når assets er klare:
   *
   * 1. Projects mountes.
   * 2. Alle Framer Motion-animasjonene starter.
   * 3. Spinneren starter slurp.
   * 4. Dark backdrop fader bort.
   *
   * Det skjer samtidig.
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
       * Start slurp.
       */
      setLoaderComplete(true);
    }, remaining);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [assetsReady, revealStarted]);

  /*
   * =====================================================
   * SPINNER EXIT COMPLETE
   * =====================================================
   */

  const handleExitComplete = () => {
    /*
     * Initial projects intro er ferdig.
     *
     * Filter/tag changes skal aldri vise
     * spinneren igjen.
     */
    initialLoadFinishedRef.current = true;

    /*
     * Fjern loader-layeret helt.
     */
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
       * PROJECTS CONTENT
       * =================================================
       *
       * Mountes akkurat når reveal starter.
       *
       * Dermed starter:
       *
       * - PageTransitionGate
       * - TextReveal
       * - Framer Motion
       * - ProjectPreview
       * - ProjectsSidebar
       *
       * mens dark backdrop fortsatt ligger
       * over innholdet og fader ut.
       */}

      {revealStarted ? children : null}

      {/*
       * =================================================
       * LOADER SECTION
       * =================================================
       *
       * VIKTIG:
       *
       * Loaderen starter fysisk UNDER navbaren.
       *
       * Navbar blir derfor aldri dekket av
       * projects-loaderen.
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
           * Samme prinsipp som hero:
           *
           * mørk seksjon ligger over content,
           * så fader den bort og avslører
           * Projects-animasjonene under.
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
           *
           * Eget layer.
           *
           * Backdrop fade påvirker derfor ikke
           * spinnerens egen opacity/slurp.
           *
           * HeroLoadingSpinner bruker absolute
           * bottom/right, og siden parent nå bare
           * dekker området UNDER navbaren blir
           * spinneren fortsatt riktig plassert
           * nederst til høyre.
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
