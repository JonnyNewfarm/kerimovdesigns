"use client";
import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import ProjectGallery, {
  type ProjectMediaJump,
} from "./infinite-projects/ProjectGallery";
import PixelPerspectiveCamera from "./scene/PixelPerspectiveCamera";
import ProjectBackdrop from "./scene/ProjectBackdrop";
import ProjectTitle from "./infinite-projects/ProjectTitle";
import ProjectDetailsInfo from "./infinite-projects/ProjectDetailsInfo";
import ProjectCursor from "./infinite-projects/ProjectCursor";
import RustamProfilePlane, {
  PROFILE_SLIDES,
  type ProfileMediaJump,
} from "./profile/RustamProfilePlane";
import AboutProfileInfo from "./profile/AboutProfileInfo";
import SitePreloader, { SceneReadySignal } from "./scene/SitePreloader";
import { CLOSE_MORPH_DURATION } from "./infinite-projects/constants";
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
  const [profileActive, setProfileActive] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileClosing, setProfileClosing] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [profileMediaIndex, setProfileMediaIndex] = useState(0);
  const [profileMenuHovered, setProfileMenuHovered] = useState(false);
  const [projectMenuHovered, setProjectMenuHovered] = useState(false);
  const [projectNavIndex, setProjectNavIndex] = useState(0);
  const projectMediaJump = useRef<ProjectMediaJump | null>(null);
  const projectMediaTweenRef = useRef<gsap.core.Tween | null>(null);
  const [threeReady, setThreeReady] = useState(false);
  const [imageRevealStarted, setImageRevealStarted] = useState(false);
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
  const profileMediaProgress = useRef({
    value: 0,
  });
  const profileMediaJump = useRef<ProfileMediaJump | null>(null);
  const profileCoverReturn = useRef({
    value: 0,
  });
  const profileMediaTweenRef = useRef<gsap.core.Tween | null>(null);
  const profileCoverTweenRef = useRef<gsap.core.Tween | null>(null);
  const profileWheelRef = useRef(0);
  const profileHitTestRef = useRef<((x: number, y: number) => boolean) | null>(
    null,
  );
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
    currentMediaIndex,
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
  const handleProfileClosed = useCallback(() => {
    setProfileActive(false);
    setProfileReady(false);
    setProfileClosing(false);
    setProfileMediaIndex(0);
    setProfileMenuHovered(false);
    profileMediaJump.current = null;
    profileMediaProgress.current.value = 0;
    profileCoverReturn.current.value = 0;
    profileWheelRef.current = 0;
  }, []);
  const openProfile = useCallback(
    (updateUrl = true) => {
      if (profileActive || selected || closing) {
        return;
      }
      profileMediaTweenRef.current?.kill();
      profileCoverTweenRef.current?.kill();
      profileMediaJump.current = null;
      profileMediaProgress.current.value = 0;
      profileCoverReturn.current.value = 0;
      profileWheelRef.current = 0;
      setProfileMediaIndex(0);
      setProfileClosing(false);
      setProfileReady(false);
      setProfileActive(true);
      setProfileOpen(true);
      setIsOverProject(false);
      handleHoverChange(null);
      if (updateUrl) {
        navigateTo("/about");
      }
    },
    [profileActive, selected, closing, handleHoverChange, navigateTo],
  );
  const closeProfile = useCallback(
    (updateUrl = true) => {
      if (!profileActive || profileClosing) {
        return;
      }
      setProfileClosing(true);
      setProfileReady(false);
      profileMediaTweenRef.current?.kill();

      if (profileMediaJump.current) {
        const jump = profileMediaJump.current;
        profileMediaProgress.current.value =
          jump.progress >= 0.5 ? jump.to : jump.from;
        profileMediaJump.current = null;
      }
      setProfileMenuHovered(false);
      profileWheelRef.current = 0;
      if (updateUrl) {
        navigateTo("/");
      }
      if (profileMediaProgress.current.value > 0.001) {
        profileCoverTweenRef.current?.kill();
        profileCoverTweenRef.current = gsap.to(profileCoverReturn.current, {
          value: 1,
          duration: CLOSE_MORPH_DURATION,
          ease: "power3.inOut",
          overwrite: true,
          onComplete: () => {
            setProfileOpen(false);
          },
        });
      } else {
        setProfileOpen(false);
      }
    },
    [profileActive, profileClosing, navigateTo],
  );
  const requestAbout = useCallback(() => {
    navigateTo("/about");
    if (!selected && !closing && !profileActive && !profileClosing) {
      openProfile(false);
    }
  }, [
    navigateTo,
    selected,
    closing,
    profileActive,
    profileClosing,
    openProfile,
  ]);
  useEffect(() => {
    window.addEventListener("rustam:open-profile", requestAbout);
    return () => {
      window.removeEventListener("rustam:open-profile", requestAbout);
    };
  }, [requestAbout]);
  useEffect(() => {
    const targetProjectId = getProjectIdFromPath(currentPath);
    if (currentPath === "/about") {
      if (selected) {
        if (!closing) {
          closeProject(false);
        }
        return;
      }
      if (profileClosing) return;
      if (!profileActive) {
        openProfile(false);
      }
      return;
    }
    if (profileActive) {
      if (!profileClosing) {
        closeProfile(false);
      }
      return;
    }

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
    profileActive,
    threeReady,
    profileClosing,
    openProject,
    closeProject,
    openProfile,
    closeProfile,
  ]);
  const stepProfileMedia = useCallback(
    (direction: number) => {
      if (
        !profileOpen ||
        !profileReady ||
        profileClosing ||
        profileMediaTweenRef.current?.isActive()
      ) {
        return;
      }
      const count = PROFILE_SLIDES.length;
      const from = Math.round(profileMediaProgress.current.value) % count;
      const to =
        direction > 0
          ? from === count - 1
            ? count
            : from + 1
          : Math.max(0, from - 1);
      if (to === from) return;
      profileMediaTweenRef.current = gsap.to(profileMediaProgress.current, {
        value: to,
        duration: 1.08,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: () => {
          const value = profileMediaProgress.current.value;
          const highlighted =
            direction > 0
              ? value - from >= 0.5
                ? (from + 1) % count
                : from
              : value - to >= 0.5
                ? from
                : to;
          setProfileMediaIndex((previous) =>
            previous === highlighted ? previous : highlighted,
          );
        },
        onComplete: () => {
          const finalIndex = to === count ? 0 : to;
          if (to === count) {
            profileMediaProgress.current.value = 0;
          }
          setProfileMediaIndex(finalIndex);
        },
      });
    },
    [profileOpen, profileReady, profileClosing],
  );
  // DIRECT CATEGORY NAVIGATION — SAME GSAP TWEEN AND SAME SHADER MORPH
  const selectProfileMedia = useCallback(
    (target: number) => {
      if (
        !profileOpen ||
        !profileReady ||
        profileClosing ||
        profileMediaTweenRef.current?.isActive() ||
        target < 0 ||
        target >= PROFILE_SLIDES.length
      ) {
        return;
      }

      const count = PROFILE_SLIDES.length;
      const from = Math.round(profileMediaProgress.current.value) % count;
      if (from === target) return;

      // Adjacent items use the original Next/Back behavior unchanged.
      if (target === from + 1 || (from === count - 1 && target === 0)) {
        stepProfileMedia(1);
        return;
      }
      if (target === from - 1) {
        stepProfileMedia(-1);
        return;
      }

      // Distant categories morph directly, with the same 1.08s
      // duration, power3.inOut ease and shader as adjacent slides.
      const jump: ProfileMediaJump = { from, to: target, progress: 0 };
      profileMediaJump.current = jump;
      profileMediaTweenRef.current = gsap.to(jump, {
        progress: 1,
        duration: 1.08,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: () => {
          const highlighted = jump.progress >= 0.5 ? target : from;
          setProfileMediaIndex((previous) =>
            previous === highlighted ? previous : highlighted,
          );
        },
        onComplete: () => {
          profileMediaProgress.current.value = target;
          profileMediaJump.current = null;
          setProfileMediaIndex(target);
        },
      });
    },
    [profileOpen, profileReady, profileClosing, stepProfileMedia],
  );

  // PROFILE WHEEL
  useEffect(() => {
    if (!profileActive) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (!profileReady || profileClosing) {
        return;
      }
      const element = containerRef.current;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? (element?.clientHeight ?? window.innerHeight)
            : 1;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      profileWheelRef.current += delta * unit;
      if (Math.abs(profileWheelRef.current) < 65) {
        return;
      }
      const direction = Math.sign(profileWheelRef.current);
      profileWheelRef.current = 0;
      stepProfileMedia(direction);
    };
    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    return () => {
      window.removeEventListener("wheel", handleWheel, true);
    };
  }, [
    profileActive,
    profileReady,
    profileClosing,
    stepProfileMedia,
    containerRef,
  ]);
  // PROFILE KEYBOARD
  useEffect(() => {
    if (!profileActive) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProfile();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        stepProfileMedia(1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        stepProfileMedia(-1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [profileActive, closeProfile, stepProfileMedia]);
  useEffect(() => {
    if (selected || closing) {
      setIsOverProject(false);
    }
  }, [selected, closing]);
  useEffect(() => {
    return () => {
      profileMediaTweenRef.current?.kill();
      profileCoverTweenRef.current?.kill();
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
  // NUMBER NAVIGATION — SAME IMAGE PROGRESS / SHADER AS WHEEL NAVIGATION.
  // Reading the progress ref keeps the highlighted number in sync with both
  // wheel input and direct numbered clicks.
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
    return () => window.cancelAnimationFrame(frame);
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
      if (from === index || gsap.isTweening(imageProgress.current)) return;

      if (Math.abs(index - from) === 1) {
        projectMediaTweenRef.current = gsap.to(imageProgress.current, {
          value: index,
          duration: 1.08,
          ease: "power3.inOut",
          overwrite: true,
        });
        return;
      }

      const jump: ProjectMediaJump = { from, to: index, progress: 0 };
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
    if (selected || closing || profileActive) {
      setIsOverProject(false);
      return;
    }
    setIsOverProject(
      Boolean(listHitTestRef.current?.(event.clientX, event.clientY)),
    );
  };
  const handleProfileClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!profileOpen || !profileReady || profileClosing) {
      return;
    }
    if (profileHitTestRef.current?.(event.clientX, event.clientY)) {
      stepProfileMedia(1);
    } else {
      closeProfile();
    }
  };
  const activeDiscipline =
    PROFILE_SLIDES[profileMediaIndex]?.discipline ?? null;
  const showProjectCursor = Boolean(selected && detailsReady && !closing);
  const showProfileCursor = profileOpen && profileReady && !profileClosing;
  return (
    <section
      ref={containerRef}
      onPointerDownCapture={(event) => {
        pressedRef.current = null;
        pressedPlaneRef.current = null;
        if (selected || closing || profileActive) {
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
      className={`relative h-svh w-full touch-none overflow-hidden bg-transparent ${
        selected || profileActive ? "z-[500]" : ""
      } ${
        selected
          ? detailsReady && !closing
            ? "cursor-none"
            : "cursor-default"
          : profileActive
            ? "cursor-default"
            : isOverProject
              ? "cursor-pointer"
              : "cursor-default"
      }`}
    >
      <SitePreloader
        threeReady={threeReady}
        onRevealStart={handleImageRevealStart}
      />
      <ProjectBackdrop backdropRef={backdropRef} />
      <ProjectIntro
        visible={imageRevealStarted && !selected && !closing && !profileActive}
      />
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
            profileActive={profileActive}
            backdropRef={backdropRef}
            imageProgress={imageProgress}
            mediaJump={projectMediaJump}
            coverMorph={coverMorph}
            imageHitTestRef={imageHitTestRef}
            listHitTestRef={listHitTestRef}
            pointerPositionRef={lastMousePosition}
            initialProjectIndex={initialProjectIndexRef.current}
          />
          <RustamProfilePlane
            open={profileOpen}
            projectSelected={Boolean(selected)}
            mediaProgress={profileMediaProgress}
            mediaJump={profileMediaJump}
            coverReturn={profileCoverReturn}
            isOverImage={profileHitTestRef}
            onReadyChange={setProfileReady}
            onClosed={handleProfileClosed}
            htmlBackdropRef={backdropRef}
          />
          <SceneReadySignal onReady={handleThreeReady} />{" "}
          <SceneImageReveal start={imageRevealStarted} />
        </Suspense>
      </Canvas>
      <HeroIntro
        visible={imageRevealStarted && !selected && !closing && !profileActive}
      />
      {!selected && !profileActive && (
        <button
          type="button"
          onClick={requestAbout}
          aria-label="Open Rustam Kerimov profile"
          className="absolute right-[5%] top-[225px] z-30 aspect-[4/5] w-[clamp(104px,28vw,140px)] cursor-pointer bg-transparent lg:right-[3.1%] lg:top-[150px] lg:w-[clamp(150px,12vw,210px)]"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[40] transition-opacity duration-200 ease-out"
        style={{
          opacity: selected || profileActive ? 0 : 1,
        }}
        aria-hidden={selected !== null || profileActive}
      >
        <ProjectTitle
          titleRef={titleRef}
          title={selectedTitle ?? hoveredTitle ?? ""}
        />
      </div>
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
      {profileActive && (
        <button
          type="button"
          aria-label="Next image or close profile"
          onClick={handleProfileClick}
          className="absolute inset-0 z-[35] cursor-default bg-transparent"
        />
      )}
      <AboutProfileInfo
        visible={profileOpen && profileReady && !profileClosing}
        mediaIndex={profileMediaIndex}
        activeDiscipline={activeDiscipline}
        onSelectMedia={selectProfileMedia}
        onMenuHoverChange={setProfileMenuHovered}
      />
      {(showProjectCursor || showProfileCursor) && (
        <ProjectCursor
          key={showProfileCursor ? "profile" : "project"}
          active
          hasMultipleMedia={
            showProfileCursor ? PROFILE_SLIDES.length > 1 : mediaCount > 1
          }
          isOverImage={showProfileCursor ? profileHitTestRef : imageHitTestRef}
          initialMousePosition={lastMousePosition}
          menuHovered={
            showProfileCursor ? profileMenuHovered : projectMenuHovered
          }
        />
      )}
    </section>
  );
}
