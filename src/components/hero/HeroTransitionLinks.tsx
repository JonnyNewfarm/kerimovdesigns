"use client";

import type React from "react";

import TransitionLink from "../TransitionLink";

type AnchorRef = React.Ref<HTMLAnchorElement>;

type HeroTransitionLinksProps = {
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

export default function HeroTransitionLinks({
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
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        -left-[9999px]
        top-0
        opacity-0
      "
    >
      <TransitionLink
        ref={contactTransitionRef}
        href="/projects"
        transitionLabel="All Projects"
        tabIndex={-1}
      >
        All Projects
      </TransitionLink>

      <TransitionLink
        ref={posterTransitionRef}
        href="/projects?tags=posters"
        transitionLabel="Posters"
        tabIndex={-1}
      >
        Posters
      </TransitionLink>

      <TransitionLink
        ref={visualIdentityTransitionRef}
        href="/projects?tags=visual-identity"
        transitionLabel="Visual Identity"
        tabIndex={-1}
      >
        Visual Identity
      </TransitionLink>

      <TransitionLink
        ref={animationTransitionRef}
        href="/projects?tags=animations"
        transitionLabel="Animations"
        tabIndex={-1}
      >
        Animations
      </TransitionLink>

      <TransitionLink
        ref={typographyTransitionRef}
        href="/projects?tags=typography"
        transitionLabel="Typography"
        tabIndex={-1}
      >
        Typography
      </TransitionLink>

      <TransitionLink
        ref={dreamProjectTransitionRef}
        href="/project/69300cd7a94f6af6c6b7d9d8"
        transitionLabel="DRØMMENES MELODI"
        tabIndex={-1}
      >
        DRØMMENES MELODI
      </TransitionLink>

      <TransitionLink
        ref={postersBundleTransitionRef}
        href="/project/6a738fe5c50ff327148b02f9"
        transitionLabel="POSTERS BUNDLE #1"
        tabIndex={-1}
      >
        POSTERS BUNDLE #1
      </TransitionLink>

      <TransitionLink
        ref={kistefossTransitionRef}
        href="/project/6a873e144aea474cdeae7a76"
        transitionLabel="KISTEFOSS MUSEUM"
        tabIndex={-1}
      >
        KISTEFOSS MUSEUM
      </TransitionLink>

      <TransitionLink
        ref={aurelisTransitionRef}
        href="/project/6a873ba44aea474cdeae7a75"
        transitionLabel="AURELIS CAPITAL"
        tabIndex={-1}
      >
        AURELIS CAPITAL
      </TransitionLink>

      <TransitionLink
        ref={artExhibitionTransitionRef}
        href="/project/6930b50f931d3caa254b3237"
        transitionLabel="ART EXHIBITION"
        tabIndex={-1}
      >
        ART EXHIBITION
      </TransitionLink>
    </div>
  );
}
