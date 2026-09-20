"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePageTransition } from "@/components/ClientPageTransitionWrapper";

import { useHeroIntro } from "../HeroIntroContext";

import HeroBottomInfo from "./HeroBottomInfo";
import HeroCanvas from "./HeroCanvas";
import HeroLoadingSpinner from "./HeroLoadingSpinner";
import HeroTransitionLinks from "./HeroTransitionLinks";
import useHeroVirtualScroll from "./useHeroVirtualScroll";

import useIsMdUp from "./hooks/UseIsMdup";
import useScrollLock from "./hooks/UseScrollLock";

const HOME_VISITED_KEY = "hero-home-visited";

type RingHeroProps = {
  title: string;
  href: string;
};

export default function RingHero({ title, href }: RingHeroProps) {
  const container = useRef<HTMLDivElement | null>(null);

  const posterTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const contactTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const visualIdentityTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const animationTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const typographyTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const dreamProjectTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const postersBundleTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const kistefossTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const aurelisTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const artExhibitionTransitionRef = useRef<HTMLAnchorElement | null>(null);

  const { setIntroExited } = useHeroIntro();

  const isMdUp = useIsMdUp();

  const [hasMounted, setHasMounted] = useState(false);

  const [allowCanvasMount, setAllowCanvasMount] = useState(false);

  const [sceneReady, setSceneReady] = useState(false);

  const [loaderComplete, setLoaderComplete] = useState(false);

  const [hasCheckedVisit, setHasCheckedVisit] = useState(false);

  const { isTransitioning } = usePageTransition();

  const isCanvasActive = !isTransitioning;

  const showWorld = sceneReady && loaderComplete;

  const {
    virtualScroll,
    isBottomInfoOpen,
    isBottomInfoClosing,
    openBottomInfo,
  } = useHeroVirtualScroll({
    showWorld,
    isTransitioning,
  });

  /*
   * =========================================================
   * MOUNT / NAVBAR STATE
   * =========================================================
   */

  useEffect(() => {
    setHasMounted(true);

    setSceneReady(false);

    setLoaderComplete(false);

    const hasVisitedHome =
      window.sessionStorage.getItem(HOME_VISITED_KEY) === "true";

    if (hasVisitedHome) {
      setIntroExited(true);

      setHasCheckedVisit(true);

      return;
    }

    setIntroExited(false);

    setHasCheckedVisit(true);
  }, [setIntroExited]);

  /*
   * =========================================================
   * CANVAS MOUNT
   * =========================================================
   */

  useEffect(() => {
    if (isTransitioning) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAllowCanvasMount(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isTransitioning]);

  /*
   * =========================================================
   * THREE READY
   * =========================================================
   */

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  /*
   * =========================================================
   * LOADER COMPLETE
   * =========================================================
   */

  const handleLoaderComplete = useCallback(() => {
    setLoaderComplete(true);

    window.sessionStorage.setItem(HOME_VISITED_KEY, "true");

    setIntroExited(true);
  }, [setIntroExited]);

  /*
   * =========================================================
   * SCROLL LOCK
   * =========================================================
   */

  useScrollLock(hasMounted && hasCheckedVisit && !loaderComplete);

  return (
    <div
      ref={container}
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        md:h-[100dvh]
      "
    >
      <HeroTransitionLinks
        contactTransitionRef={contactTransitionRef}
        posterTransitionRef={posterTransitionRef}
        visualIdentityTransitionRef={visualIdentityTransitionRef}
        animationTransitionRef={animationTransitionRef}
        typographyTransitionRef={typographyTransitionRef}
        dreamProjectTransitionRef={dreamProjectTransitionRef}
        postersBundleTransitionRef={postersBundleTransitionRef}
        kistefossTransitionRef={kistefossTransitionRef}
        aurelisTransitionRef={aurelisTransitionRef}
        artExhibitionTransitionRef={artExhibitionTransitionRef}
      />

      <div
        className="
          relative
          h-screen
          overflow-hidden
          uppercase
          md:h-[100dvh]
        "
      >
        <HeroCanvas
          hasMounted={hasMounted}
          allowCanvasMount={allowCanvasMount}
          isMdUp={isMdUp}
          isCanvasActive={isCanvasActive}
          loaderComplete={loaderComplete}
          sceneReady={sceneReady}
          virtualScroll={virtualScroll}
          onSceneReady={handleSceneReady}
          onLoaderComplete={handleLoaderComplete}
          contactTransitionRef={contactTransitionRef}
          posterTransitionRef={posterTransitionRef}
          visualIdentityTransitionRef={visualIdentityTransitionRef}
          animationTransitionRef={animationTransitionRef}
          typographyTransitionRef={typographyTransitionRef}
          dreamProjectTransitionRef={dreamProjectTransitionRef}
          postersBundleTransitionRef={postersBundleTransitionRef}
          kistefossTransitionRef={kistefossTransitionRef}
          aurelisTransitionRef={aurelisTransitionRef}
          artExhibitionTransitionRef={artExhibitionTransitionRef}
        />

        <HeroLoadingSpinner loaderComplete={loaderComplete} />

        <HeroBottomInfo
          title={title}
          href={href}
          showWorld={showWorld}
          isBottomInfoOpen={isBottomInfoOpen}
          isBottomInfoClosing={isBottomInfoClosing}
          openBottomInfo={openBottomInfo}
        />
      </div>
    </div>
  );
}
