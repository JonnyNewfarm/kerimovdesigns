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

const SECTIONS = {
  VISUAL_IDENTITY: 1,
  POSTERS: 2,
  ANIMATIONS: 3,
  TYPOGRAPHY: 4,
  ALL_PROJECTS: 5,
} as const;

const PROJECT_TRANSITION_COLORS = {
  DREAM_PROJECT: "#5F3568",
  POSTERS_BUNDLE: "#8593F3",
  KISTEFOSS: "#0F3470",
  AURELIS: "#075354",
  ART_EXHIBITION: "#706F66",
} as const;

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

      <TransitionLink
        ref={dreamProjectTransitionRef}
        href="/project/69300cd7a94f6af6c6b7d9d8"
        transitionLabel="DRØMMENES MELODI"
        transitionColor={PROJECT_TRANSITION_COLORS.DREAM_PROJECT}
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
        transitionColor={PROJECT_TRANSITION_COLORS.POSTERS_BUNDLE}
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
        transitionColor={PROJECT_TRANSITION_COLORS.KISTEFOSS}
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
        transitionColor={PROJECT_TRANSITION_COLORS.AURELIS}
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
        transitionColor={PROJECT_TRANSITION_COLORS.ART_EXHIBITION}
        tabIndex={tabIndex}
        className={focusLinkClassName}
        onFocus={() => {
          scrollToSection(SECTIONS.ALL_PROJECTS);
        }}
      >
        ART EXHIBITION
      </TransitionLink>

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
