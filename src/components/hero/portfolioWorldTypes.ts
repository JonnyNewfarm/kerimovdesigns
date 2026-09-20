import type {
  MotionValue,
} from "framer-motion";

import type {
  RefObject,
} from "react";

export type Position = [
  number,
  number,
  number,
];

export type PortfolioWorldProps = {
  virtualScroll:
    MotionValue<number>;

  isActive: boolean;

  isMobile: boolean;

  contactTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  posterTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  visualIdentityTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  animationTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  typographyTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  dreamProjectTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  postersBundleTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  kistefossTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  aurelisTransitionRef:
    RefObject<HTMLAnchorElement | null>;

  artExhibitionTransitionRef:
    RefObject<HTMLAnchorElement | null>;
};