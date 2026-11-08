"use client";

import { useCallback, useEffect, useRef, useState, type MutableRefObject, type PointerEvent } from "react";
import gsap from "gsap";
import * as THREE from "three";
import type { ActivePlane, InfiniteProject } from "./types";
import { OPENING_WARMUP_MS, OPEN_DURATION, CLOSE_DURATION, CLOSE_MORPH_DURATION } from "./constants";

export function useInfiniteProjectControls(
  projects: InfiniteProject[],
  imageHitTestRef: MutableRefObject<
    ((x: number, y: number) => boolean) | null
  >,
  onProjectOpen?: (plane: ActivePlane) => void,
  onProjectClose?: () => void,
) {
  const containerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrollTarget = useRef(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const pressedRef = useRef<ActivePlane | null>(null);
  const pressedPlaneRef = useRef<ActivePlane | null>(null);
  const pressedMediaRef = useRef(false);
  const selectedRef = useRef<ActivePlane | null>(null);
  const transitionRef = useRef<gsap.core.Tween | null>(null);
  const openingTimerRef = useRef<number | null>(null);
  const progress = useRef({ value: 0 });
  const imageProgress = useRef({ value: 0 });
  const coverMorph = useRef({ value: 0 });
  const coverMorphTweenRef = useRef<gsap.core.Tween | null>(null);
  const imageTweenRef = useRef<gsap.core.Tween | null>(null);
  const imageWheelRef = useRef(0);
  const closingRef = useRef(false);

  const pointer = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    moved: false,
  });

  const [hovered, setHovered] = useState<ActivePlane | null>(null);
  const [selected, setSelected] = useState<ActivePlane | null>(null);
  const [closing, setClosing] = useState(false);
  const [detailsReady, setDetailsReady] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const currentMediaIndexRef = useRef(0);

  const handleHoverChange = useCallback((plane: ActivePlane | null) => {
    if (!selectedRef.current) setHovered(plane);
  }, []);

  const handlePress = useCallback((plane: ActivePlane) => {
    const opened = selectedRef.current;
    if (opened) {
      if (opened.index === plane.index && opened.copy === plane.copy) {
        pressedMediaRef.current = true;
      }
      return;
    }
    pressedRef.current = plane;
    pressedPlaneRef.current = plane;
  }, []);

const openProject = useCallback((
  plane: ActivePlane,
  updateUrl = true,
) => {    if (selectedRef.current) return;

    transitionRef.current?.kill();
    imageTweenRef.current?.kill();
    coverMorphTweenRef.current?.kill();
    coverMorph.current.value = 0;
    imageProgress.current.value = 0;
    imageWheelRef.current = 0;
    pressedMediaRef.current = false;
    currentMediaIndexRef.current = 0;
    setCurrentMediaIndex(0);
    if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
    selectedRef.current = plane;
    closingRef.current = false;
    progress.current.value = 0;
    setSelected(plane);
    setHovered(null);
    setClosing(false);
    setDetailsReady(false);

    if (updateUrl) {
  onProjectOpen?.(plane);
}

    openingTimerRef.current = window.setTimeout(() => {
      openingTimerRef.current = null;
      if (closingRef.current || selectedRef.current !== plane) return;
      transitionRef.current = gsap.to(progress.current, {
        value: 1,
        duration: OPEN_DURATION,
        ease: "none",
        overwrite: true,
        onComplete: () => {
          if (closingRef.current || selectedRef.current !== plane) return;
          setDetailsReady(true);
        },
      });
    }, OPENING_WARMUP_MS);
   }, [onProjectOpen]);

const closeProject = useCallback((updateUrl = true) => {    if (!selectedRef.current || closingRef.current) return;
  if (updateUrl) {
  onProjectClose?.();
}

    closingRef.current = true;
    setClosing(true);
    setDetailsReady(false);
    if (openingTimerRef.current !== null) {
      window.clearTimeout(openingTimerRef.current);
      openingTimerRef.current = null;
    }
    transitionRef.current?.kill();
    imageTweenRef.current?.kill();
    coverMorphTweenRef.current?.kill();
    imageWheelRef.current = 0;
    pressedMediaRef.current = false;

    const returnToGallery = () => {
      transitionRef.current = gsap.to(progress.current, {
        value: 0,
        duration: Math.max(0.2, CLOSE_DURATION * progress.current.value),
        ease: "none",
        overwrite: true,
        onComplete: () => {
          selectedRef.current = null;
          closingRef.current = false;
          progress.current.value = 0;
          imageProgress.current.value = 0;
          coverMorph.current.value = 0;
          currentMediaIndexRef.current = 0;
          setCurrentMediaIndex(0);
          setSelected(null);
          setClosing(false);
        },
      });
    };

    if (imageProgress.current.value > 0.01) {
      coverMorph.current.value = 0;
      coverMorphTweenRef.current = gsap.to(coverMorph.current, {
        value: 1,
        duration: CLOSE_MORPH_DURATION,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: returnToGallery,
      });
    } else {
      returnToGallery();
    }
}, [onProjectClose]);
  const stepMedia = useCallback((direction: number, wrapOnNext = false) => {
    const opened = selectedRef.current;
    if (!opened || closingRef.current || progress.current.value < 0.98) return;

    const project = projects[opened.index];
    if (!project) return;
    const imageCount = 1 + (project.images ?? []).filter(
      (url) => url && url !== project.src,
    ).length;
    const mediaCount = imageCount + (project.srcVideo?.trim() ? 1 : 0);
    if (mediaCount < 2 || imageTweenRef.current?.isActive()) return;

    const current = Math.round(imageProgress.current.value);
    const wrapsToFirst = wrapOnNext && direction > 0 && current === mediaCount - 1;
    const next = wrapsToFirst
      ? mediaCount
      : THREE.MathUtils.clamp(current + direction, 0, mediaCount - 1);
    if (next === current) return;

    imageTweenRef.current = gsap.to(imageProgress.current, {
      value: next,
      duration: 1.08,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => {
        const index = wrapsToFirst
          ? Math.round(imageProgress.current.value) % mediaCount
          : THREE.MathUtils.clamp(
              Math.round(imageProgress.current.value),
              0,
              mediaCount - 1,
            );
        if (index !== currentMediaIndexRef.current) {
          currentMediaIndexRef.current = index;
          setCurrentMediaIndex(index);
        }
      },
      onComplete: () => {
        if (wrapsToFirst) imageProgress.current.value = 0;
        const finalIndex = wrapsToFirst ? 0 : next;
        currentMediaIndexRef.current = finalIndex;
        setCurrentMediaIndex(finalIndex);
      },
    });
  }, [projects]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const opened = selectedRef.current;

      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? element.clientHeight
            : 1;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (opened) {
        if (closingRef.current || progress.current.value < 0.98) return;
        imageWheelRef.current += delta * unit;
        if (Math.abs(imageWheelRef.current) < 65) return;
        const direction = Math.sign(imageWheelRef.current);
        imageWheelRef.current = 0;
stepMedia(direction, true);        return;
      }

      scrollTarget.current += delta * unit;
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [stepMedia]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProject();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeProject]);

  useEffect(() => {
    return () => {
      transitionRef.current?.kill();
      imageTweenRef.current?.kill();
      coverMorphTweenRef.current?.kill();
      if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;

    pointer.current = {
      active: true,
      startX: event.clientX,
      lastX: event.clientX,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = pointer.current;
    if (!drag.active) return;

    if (Math.abs(event.clientX - drag.startX) > 6) {
      drag.moved = true;
    }

    if (drag.moved && !selectedRef.current) {
      pressedPlaneRef.current = null;
      scrollTarget.current -= event.clientX - drag.lastX;
    }

    drag.lastX = event.clientX;
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current.active) return;

    if (pointer.current.moved || !pressedRef.current) {
      pressedPlaneRef.current = null;
    }

    if (!pointer.current.moved) {
      if (selectedRef.current) {
        const overImage = imageHitTestRef.current
          ? imageHitTestRef.current(event.clientX, event.clientY)
          : pressedMediaRef.current;
        if (overImage) {
          const opened = selectedRef.current;
          const project = opened ? projects[opened.index] : null;
          const mediaCount = project
            ? 1 + (project.images ?? []).filter(
                (url) => url && url !== project.src,
              ).length + (project.srcVideo?.trim() ? 1 : 0)
            : 0;
          if (mediaCount < 2) {
            closeProject();
          } else {
            stepMedia(1, true);
          }
        } else {
          closeProject();
        }
      } else if (pressedRef.current) {
        openProject(pressedRef.current);
      }
    }

    pointer.current.active = false;
    pressedRef.current = null;
    pressedMediaRef.current = false;
  };

  const onPointerCancel = () => {
    pointer.current.active = false;
    pressedRef.current = null;
    pressedPlaneRef.current = null;
    pressedMediaRef.current = false;
  };

 return {
  containerRef,
  backdropRef,
  scrollTarget,
  titleRef,
  pressedRef,
  pressedPlaneRef,
  selected,
  progress,
  handleHoverChange,
  handlePress,
  openProject,
  closingRef,
  imageProgress,
  coverMorph,
  hovered,
  closing,
  detailsReady,
  currentMediaIndex,
  closeProject,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
};
}
