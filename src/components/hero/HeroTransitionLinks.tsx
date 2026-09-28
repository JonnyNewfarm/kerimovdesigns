"use client";

import type React from "react";

import TransitionLink from "../TransitionLink";

type AnchorRef = React.Ref<HTMLAnchorElement>;

type HeroTransitionLinksProps = {
  enabled: boolean;

  scrollToSection: (sectionIndex: number) => void;

  contactTransitionRef: AnchorRef;
  posterTransitionRef: AnchorRef;
  visualIdentityTransitionRef: AnchorRef;
  animationTransitionRef: AnchorRef;
  typographyTransitionRef: AnchorRef;

  dreamProjectTransitionRef: AnchorRef;
  postersBundleTransitionRef: AnchorRef;
  kistefossTransitionRef: AnchorRef;
  aurelisTransitionRef: AnchorRef;
  artExhibitionTransitionRef: AnchorRef;
};

/*
 * =========================================================
 * SECTIONS
 * =========================================================
 */

const SECTIONS = {
  VISUAL_IDENTITY: 1,
  POSTERS: 2,
  ANIMATIONS: 3,
  TYPOGRAPHY: 4,
  ALL_PROJECTS: 5,
} as const;

/*
 * =========================================================
 * KEYBOARD FOCUS STYLE
 * =========================================================
 *
 * Vanligvis er linkene visuelt skjult.
 *
 * Når de får keyboard-focus blir de synlige
 * nederst til venstre.
 *
 * Dermed vet keyboard-brukeren nøyaktig hva
 * som er valgt.
 * =========================================================
 */
const focusLinkClassName = `
  sr-only

  focus:not-sr-only
  focus:pointer-events-none

  focus:fixed
  focus:left-[72px]
  focus:bottom-5
  focus:z-[9999]

  lg:focus:bottom-auto
  lg:focus:top-1/2
  lg:focus:-translate-y-1/2

  focus:block
  focus:w-auto
  focus:h-auto

  focus:bg-transparent
  focus:p-0

  focus:font-bueno
  focus:text-[13px]
  focus:uppercase
  focus:tracking-[0.02em]
  focus:text-[#ece7dc]

  focus:outline-none
`;

export default function HeroTransitionLinks({
  enabled,

  scrollToSection,

  contactTransitionRef,
  posterTransitionRef,
  visualIdentityTransitionRef,
  animationTransitionRef,
  typographyTransitionRef,

  dreamProjectTransitionRef,
  postersBundleTransitionRef,
  kistefossTransitionRef,
  aurelisTransitionRef,
  artExhibitionTransitionRef,
}: HeroTransitionLinksProps) {
  const tabIndex = enabled ? 0 : -1;

  return (
    <nav
      aria-label="Portfolio navigation"
      aria-hidden={!enabled}
      className="
        pointer-events-none
        fixed
        inset-0
        z-[9999]
      "
    >
      {/*
       * =====================================================
       * VISUAL IDENTITY
       * =====================================================
       */}

      <TransitionLink
        ref={visualIdentityTransitionRef}
        href="/projects?tags=visual-identity"
        transitionLabel="Visual Identity"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.VISUAL_IDENTITY);
        }}
      >
        Visual Identity
      </TransitionLink>

      {/*
       * =====================================================
       * POSTERS
       * =====================================================
       */}

      <TransitionLink
        ref={posterTransitionRef}
        href="/projects?tags=posters"
        transitionLabel="Posters"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.POSTERS);
        }}
      >
        Posters
      </TransitionLink>

      {/*
       * =====================================================
       * ANIMATIONS
       * =====================================================
       */}

      <TransitionLink
        ref={animationTransitionRef}
        href="/projects?tags=animations"
        transitionLabel="Animations"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ANIMATIONS);
        }}
      >
        Animations
      </TransitionLink>

      {/*
       * =====================================================
       * TYPOGRAPHY
       * =====================================================
       */}

      <TransitionLink
        ref={typographyTransitionRef}
        href="/projects?tags=typography"
        transitionLabel="Typography"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.TYPOGRAPHY);
        }}
      >
        Typography
      </TransitionLink>

      {/*
       * =====================================================
       * ALL PROJECTS SCENE
       * =====================================================
       *
       * Alle linkene under eksisterer visuelt
       * inne i samme Three.js scene.
       *
       * Derfor sender Tab alle til section 5.
       * =====================================================
       */}

      <TransitionLink
        ref={dreamProjectTransitionRef}
        href="/project/69300cd7a94f6af6c6b7d9d8"
        transitionLabel="DRØMMENES MELODI"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        DRØMMENES MELODI
      </TransitionLink>

      <TransitionLink
        ref={postersBundleTransitionRef}
        href="/project/6a738fe5c50ff327148b02f9"
        transitionLabel="POSTERS BUNDLE #1"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        POSTERS BUNDLE #1
      </TransitionLink>

      <TransitionLink
        ref={kistefossTransitionRef}
        href="/project/6a873e144aea474cdeae7a76"
        transitionLabel="KISTEFOSS MUSEUM"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        KISTEFOSS MUSEUM
      </TransitionLink>

      <TransitionLink
        ref={aurelisTransitionRef}
        href="/project/6a873ba44aea474cdeae7a75"
        transitionLabel="AURELIS CAPITAL"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        AURELIS CAPITAL
      </TransitionLink>

      <TransitionLink
        ref={artExhibitionTransitionRef}
        href="/project/6930b50f931d3caa254b3237"
        transitionLabel="ART EXHIBITION"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        ART EXHIBITION
      </TransitionLink>

      {/*
       * ALL PROJECTS BUTTON
       */}

      <TransitionLink
        ref={contactTransitionRef}
        href="/projects"
        transitionLabel="All Projects"
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        All Projects
      </TransitionLink>
    </nav>
  );
}
