"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { forwardRef } from "react";
import {
  usePageTransition,
  type TransitionDirection,
} from "./ClientPageTransitionWrapper";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  transitionLabel?: string;
  direction?: TransitionDirection;
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink(
    {
      href,
      children,
      className,
      target,
      onClick,
      transitionLabel,
      direction = "left",
      ...props
    },
    ref,
  ) {
    const { startTransition, isTransitioning } = usePageTransition();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) return;

      const isExternal =
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:");

      const isNewTab =
        target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;

      const isAnchorOnly = href.startsWith("#");

      if (isExternal || isNewTab || isAnchorOnly) return;

      event.preventDefault();

      if (!isTransitioning) {
        startTransition(href, transitionLabel, direction);
      }
    };

    return (
      <Link
        ref={ref}
        href={href}
        target={target}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

export default TransitionLink;
