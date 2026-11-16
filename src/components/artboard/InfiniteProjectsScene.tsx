"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { motion } from "framer-motion";

import ProjectGallery, {
  type ProjectMediaJump,
} from "./infinite-projects/ProjectGallery";

import PixelPerspectiveCamera from "./scene/PixelPerspectiveCamera";
import ProjectBackdrop from "./scene/ProjectBackdrop";
import ProjectTitle from "./infinite-projects/ProjectTitle";
import ProjectDetailsInfo from "./infinite-projects/ProjectDetailsInfo";
import ProjectCursor from "./infinite-projects/ProjectCursor";

import SitePreloader, { SceneReadySignal } from "./scene/SitePreloader";

import { useInfiniteProjectControls } from "./infinite-projects/useInfiniteProjectControls";

import type { ActivePlane, Props } from "./infinite-projects/types";

import SceneImageReveal from "./scene/SceneImageReveal";
import HeroIntro from "./hero/HeroIntro";
import ProjectIntro from "./infinite-projects/ProjectIntro";

export type { InfiniteProject } from "./infinite-projects/types";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function getProjectIdFromPath(pathname: string) {
  const match = pathname.match(/^\/project\/([^/]+)\/?$/);

  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export default function InfiniteProjectsScene({ projects }: Props) {
  const pathname = usePathname();

  const [currentPath, setCurrentPath] = useState(() => normalizePath(pathname));

  useEffect(() => {
    setCurrentPath(normalizePath(pathname));
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const [isOverProject, setIsOverProject] = useState(false);
  const [projectMenuHovered, setProjectMenuHovered] = useState(false);
  const [projectNavIndex, setProjectNavIndex] = useState(0);

  const projectMediaJump = useRef<ProjectMediaJump | null>(null);

  const projectMediaTweenRef = useRef<gsap.core.Tween | null>(null);

  const [threeReady, setThreeReady] = useState(false);
  const [imageRevealStarted, setImageRevealStarted] = useState(false);
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    let secondFrame = 0;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setMountCanvas(true);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  const handleImageRevealStart = useCallback(() => {
    setImageRevealStarted(true);
  }, []);

  const handleThreeReady = useCallback(() => {
    setThreeReady(true);
  }, []);

  const initialPathRef = useRef(pathname);

  const initialProjectIndexRef = useRef(
    projects.findIndex(
      (project) =>
        String(project.id) === getProjectIdFromPath(initialPathRef.current),
    ),
  );

  const lastOpenedPlaneRef = useRef<ActivePlane | null>(null);

  const imageHitTestRef = useRef<((x: number, y: number) => boolean) | null>(
    null,
  );

  const listHitTestRef = useRef<
    ((x: number, y: number, freeze?: boolean) => ActivePlane | null) | null
  >(null);

  const lastMousePosition = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const navigateTo = useCallback((url: string) => {
    const next = normalizePath(url);

    if (normalizePath(window.location.pathname) !== next) {
      window.history.pushState(null, "", next);
    }

    setCurrentPath(next);
  }, []);

  const onProjectOpen = useCallback(
    (plane: ActivePlane) => {
      const project = projects[plane.index];

      if (!project) return;

      lastOpenedPlaneRef.current = plane;

      navigateTo(`/project/${encodeURIComponent(String(project.id))}`);
    },
    [projects, navigateTo],
  );

  const onProjectClose = useCallback(() => {
    navigateTo("/");
  }, [navigateTo]);

  const {
    containerRef,
    backdropRef,
    scrollTarget,
    titleRef,
    pressedRef,
    pressedPlaneRef,
    selected,
    progress,
    handleHoverChange,
    openProject,
    closeProject,
    closingRef,
    imageProgress,
    coverMorph,
    hovered,
    closing,
    detailsReady,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useInfiniteProjectControls(
    projects,
    imageHitTestRef,
    onProjectOpen,
    onProjectClose,
  );

  const handleProjectHoverChange = useCallback(
    (plane: ActivePlane | null) => {
      handleHoverChange(plane);
      setIsOverProject(Boolean(plane));
    },
    [handleHoverChange],
  );

  // PROJECT DEEP LINKS
  useEffect(() => {
    const targetProjectId = getProjectIdFromPath(currentPath);

    if (targetProjectId !== null) {
      if (!threeReady) return;

      const index = projects.findIndex(
        (project) => String(project.id) === targetProjectId,
      );

      if (index < 0) return;

      if (selected) {
        if (selected.index !== index && !closing) {
          closeProject(false);
        }

        return;
      }

      if (closing) return;

      const previous = lastOpenedPlaneRef.current;

      const plane: ActivePlane =
        previous?.index === index ? previous : { index, copy: 0 };

      openProject(plane, false);
      return;
    }

    if (selected && !closing) {
      closeProject(false);
    }
  }, [
    currentPath,
    projects,
    selected,
    closing,
    threeReady,
    openProject,
    closeProject,
  ]);

  useEffect(() => {
    if (selected || closing) {
      setIsOverProject(false);
    }
  }, [selected, closing]);

  useEffect(() => {
    return () => {
      projectMediaTweenRef.current?.kill();
    };
  }, []);

  const hoveredTitle = hovered ? projects[hovered.index]?.title : null;

  const selectedTitle = selected
    ? projects[selected.index]?.title?.trim() || "Untitled"
    : null;

  const selectedProject = selected ? projects[selected.index] : null;

  const mediaCount = selectedProject
    ? 1 +
      (selectedProject.images ?? []).filter(
        (url) => url && url !== selectedProject.src,
      ).length +
      (selectedProject.srcVideo?.trim() ? 1 : 0)
    : 0;

  // PROJECT MEDIA NAVIGATION
  useEffect(() => {
    if (!selected) {
      setProjectMenuHovered(false);
      setProjectNavIndex(0);
      return;
    }

    let frame = 0;

    const update = () => {
      const jump = projectMediaJump.current;

      const index = jump
        ? jump.progress >= 0.5
          ? jump.to
          : jump.from
        : Math.max(
            0,
            Math.min(mediaCount - 1, Math.round(imageProgress.current.value)),
          );

      setProjectNavIndex((previous) => (previous === index ? previous : index));

      frame = window.requestAnimationFrame(update);
    };

    update();

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [selected, mediaCount, imageProgress]);

  const selectProjectMedia = useCallback(
    (index: number) => {
      if (
        !selected ||
        closing ||
        !detailsReady ||
        projectMediaTweenRef.current?.isActive() ||
        index < 0 ||
        index >= mediaCount
      ) {
        return;
      }

      const from = Math.max(
        0,
        Math.min(mediaCount - 1, Math.round(imageProgress.current.value)),
      );

      if (from === index || gsap.isTweening(imageProgress.current)) {
        return;
      }

      if (Math.abs(index - from) === 1) {
        projectMediaTweenRef.current = gsap.to(imageProgress.current, {
          value: index,
          duration: 1.08,
          ease: "power3.inOut",
          overwrite: true,
        });

        return;
      }

      const jump: ProjectMediaJump = {
        from,
        to: index,
        progress: 0,
      };

      projectMediaJump.current = jump;

      projectMediaTweenRef.current = gsap.to(jump, {
        progress: 1,
        duration: 1.08,
        ease: "power3.inOut",
        overwrite: true,

        onComplete: () => {
          imageProgress.current.value = index;
          projectMediaJump.current = null;
          setProjectNavIndex(index);
        },
      });
    },
    [selected, closing, detailsReady, mediaCount, imageProgress],
  );

  useEffect(() => {
    if (selected && !closing) return;

    projectMediaTweenRef.current?.kill();
    projectMediaTweenRef.current = null;

    const jump = projectMediaJump.current;

    if (jump) {
      imageProgress.current.value = jump.progress >= 0.5 ? jump.to : jump.from;

      projectMediaJump.current = null;
    }

    setProjectMenuHovered(false);
  }, [selected, closing, imageProgress]);

  const handleProjectWheelCapture = (event: ReactWheelEvent<HTMLElement>) => {
    if (!projectMediaJump.current) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    onPointerMove(event);

    if (event.pointerType !== "mouse") {
      return;
    }

    lastMousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };

    if (selected || closing) {
      setIsOverProject(false);
      return;
    }

    setIsOverProject(
      Boolean(listHitTestRef.current?.(event.clientX, event.clientY)),
    );
  };

  const showProjectCursor = Boolean(selected && detailsReady && !closing);

  return (
    <section
      ref={containerRef}
      onPointerDownCapture={(event) => {
        pressedRef.current = null;
        pressedPlaneRef.current = null;

        if (selected || closing) {
          return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        if ((event.target as HTMLElement).closest("button")) {
          return;
        }

        const plane =
          listHitTestRef.current?.(event.clientX, event.clientY, true) ?? null;

        pressedRef.current = plane;
        pressedPlaneRef.current = plane;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={handlePointerMove}
      onWheelCapture={handleProjectWheelCapture}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        onPointerCancel();
        setIsOverProject(false);
      }}
      onPointerLeave={() => {
        lastMousePosition.current = null;
        setIsOverProject(false);
      }}
      className={`
        relative
        h-svh
        w-full
        touch-none
        overflow-hidden
        bg-transparent
        ${selected ? "z-[500]" : ""}
        ${
          selected
            ? detailsReady && !closing
              ? "cursor-none"
              : "cursor-default"
            : isOverProject
              ? "cursor-pointer"
              : "cursor-default"
        }
      `}
    >
      <SitePreloader
        threeReady={threeReady}
        onRevealStart={handleImageRevealStart}
      />

      <ProjectBackdrop backdropRef={backdropRef} />

      <ProjectIntro visible={imageRevealStarted && !selected && !closing} />

      {/* THREE.JS PROJECTS */}
      {mountCanvas && (
        <Canvas
          className="!absolute !inset-0 !z-10"
          camera={{
            position: [0, 0, 1200],
            fov: 38,
            near: 0.1,
            far: 20000,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <PixelPerspectiveCamera />

          <Suspense fallback={null}>
            <ProjectGallery
              projects={projects}
              scrollTarget={scrollTarget}
              selected={selected}
              progress={progress}
              onHoverChange={handleProjectHoverChange}
              pressedPlaneRef={pressedPlaneRef}
              titleRef={titleRef}
              closingRef={closingRef}
              profileActive={false}
              backdropRef={backdropRef}
              imageProgress={imageProgress}
              mediaJump={projectMediaJump}
              coverMorph={coverMorph}
              imageHitTestRef={imageHitTestRef}
              listHitTestRef={listHitTestRef}
              pointerPositionRef={lastMousePosition}
              initialProjectIndex={initialProjectIndexRef.current}
            />

            <SceneReadySignal onReady={handleThreeReady} />

            <SceneImageReveal start={imageRevealStarted} />
          </Suspense>
        </Canvas>
      )}

      <HeroIntro visible={imageRevealStarted && !selected && !closing} />

      {/* STATIC PORTRAIT */}
      <motion.div
        initial={{
          clipPath: "inset(100% 0 0 0)",
        }}
        animate={{
          clipPath: imageRevealStarted
            ? "inset(0% 0 0 0)"
            : "inset(100% 0 0 0)",
        }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
    pointer-events-none
    absolute
    right-[5%]
    top-[225px]
    aspect-[4/5]
    w-[clamp(104px,28vw,140px)]
    lg:right-[3.1%]
    lg:top-[150px]
    lg:w-[clamp(150px,12vw,210px)]
  "
      >
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.08 }}
          animate={{
            scale: imageRevealStarted ? 1 : 1.08,
          }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src="/rk-portrait.jpg"
            alt="Portrait of Rustam Kerimov"
            fill
            priority
            sizes="(min-width: 1024px) 210px, 140px"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* PROJECT TITLE */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[40]
          transition-opacity
          duration-200
          ease-out
        "
        style={{
          opacity: selected ? 0 : 1,
        }}
        aria-hidden={selected !== null}
      >
        <ProjectTitle
          titleRef={titleRef}
          title={selectedTitle ?? hoveredTitle ?? ""}
        />
      </div>

      {/* PROJECT DETAILS */}
      <ProjectDetailsInfo
        selected={selected}
        closing={closing}
        ready={detailsReady}
        project={selectedProject}
        currentMediaIndex={projectNavIndex}
        mediaCount={mediaCount}
        onSelectMedia={selectProjectMedia}
        onMenuHoverChange={setProjectMenuHovered}
      />

      {/* PROJECT CURSOR */}
      {showProjectCursor && (
        <ProjectCursor
          active
          hasMultipleMedia={mediaCount > 1}
          isOverImage={imageHitTestRef}
          initialMousePosition={lastMousePosition}
          menuHovered={projectMenuHovered}
        />
      )}
    </section>
  );
}
