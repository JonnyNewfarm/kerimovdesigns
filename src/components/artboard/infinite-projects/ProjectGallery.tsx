"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

import type {
  Props,
  PlaneLayout,
  ProjectMedia,
  PlaneStart,
  ActivePlane,
} from "./types";

import {
  SCROLL_SMOOTHING,
  HOVER_SPEED,
  EDGE_BEND_STRENGTH,
  EDGE_MORPH_STRENGTH,
} from "./constants";

import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";
import { smoothstep, titleMetrics } from "./projectMath";
import { useProjectVideo } from "./useProjectVideo";
import { updateBackdropMask } from "../scene/updateBackdropMask";

const IMAGE_HEIGHTS = [0.14, 0.18, 0.13, 0.16, 0.15, 0.19];
const MOBILE_HEIGHT_SCALE = 0.13 / 0.15;
const GALLERY_BOTTOM = 0.48;

export type ProjectMediaJump = {
  from: number;
  to: number;
  progress: number;
};

type GalleryProps = Props & {
  scrollTarget: MutableRefObject<number>;
  selected: ActivePlane | null;
  profileActive: boolean;
  progress: MutableRefObject<{ value: number }>;
  onHoverChange: (plane: ActivePlane | null) => void;
  pressedPlaneRef: MutableRefObject<ActivePlane | null>;
  titleRef: MutableRefObject<HTMLDivElement | null>;
  closingRef: MutableRefObject<boolean>;
  backdropRef: MutableRefObject<HTMLDivElement | null>;
  imageProgress: MutableRefObject<{ value: number }>;
  mediaJump: MutableRefObject<ProjectMediaJump | null>;
  coverMorph: MutableRefObject<{ value: number }>;
  imageHitTestRef: MutableRefObject<((x: number, y: number) => boolean) | null>;
  listHitTestRef: MutableRefObject<
    ((x: number, y: number, freeze?: boolean) => ActivePlane | null) | null
  >;
  pointerPositionRef: MutableRefObject<{
    x: number;
    y: number;
  } | null>;
  initialProjectIndex?: number;
};

export default function ProjectGallery({
  projects,
  scrollTarget,
  profileActive,
  selected,
  progress,
  onHoverChange,
  pressedPlaneRef,
  titleRef,
  closingRef,
  backdropRef,
  imageProgress,
  mediaJump,
  coverMorph,
  imageHitTestRef,
  listHitTestRef,
  pointerPositionRef,
  initialProjectIndex = -1,
}: GalleryProps) {
  const { camera, size, gl } = useThree();
  const mobile = size.width < 768;

  const projectImages = useMemo(
    () =>
      projects.map((project) => [
        project.src,
        ...(project.images ?? []).filter((url) => url && url !== project.src),
      ]),
    [projects],
  );

  const projectMedia = useMemo<ProjectMedia[][]>(
    () =>
      projectImages.map((images, index) => {
        const slides: ProjectMedia[] = images.map((src) => ({
          kind: "image",
          src,
        }));

        const video = projects[index]?.srcVideo?.trim();

        if (video) {
          slides.push({
            kind: "video",
            src: video,
          });
        }

        return slides;
      }),
    [projectImages, projects],
  );

  const urls = useMemo(
    () => [...new Set(projectImages.flat())],
    [projectImages],
  );

  const textures = useTexture(urls);

  const textureByUrl = useMemo(
    () => new Map(urls.map((url, index) => [url, textures[index]] as const)),
    [urls, textures],
  );

  const coverTextures = useMemo(
    () => projectImages.map((images) => textureByUrl.get(images[0])!),
    [projectImages, textureByUrl],
  );

  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  const currentScroll = useRef(0);

  const initialScrollSet = useRef(false);
  const hasRenderedFrame = useRef(false);

  const focusedPlane = useRef<ActivePlane | null>(null);
  const hoveredPlane = useRef<ActivePlane | null>(null);
  const hoverValues = useRef<number[]>([]);
  const transitionStart = useRef<PlaneStart | null>(null);
  const screenCorner = useRef(new THREE.Vector3());
  const activeOutline = useRef<number[]>([]);

  useEffect(() => {
    imageHitTestRef.current = (x, y) => {
      const points = activeOutline.current;

      if (points.length < 6) return false;

      let inside = false;
      const n = points.length / 2;

      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = points[i * 2];
        const yi = points[i * 2 + 1];
        const xj = points[j * 2];
        const yj = points[j * 2 + 1];

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    return () => {
      imageHitTestRef.current = null;
    };
  }, [imageHitTestRef]);

  const { videoElementRef, videoTextureRef, videoPlayRequestedRef } =
    useProjectVideo(selected, projects);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    });
  }, [textures]);

  const { planes, totalWidth } = useMemo(() => {
    const gap = size.width * (mobile ? 0.035 : 0.012);

    let cursor = 0;

    const layout = coverTextures.map((texture, index) => {
      const image = texture.image as
        | {
            width?: number;
            height?: number;
          }
        | undefined;

      const ratio = (image?.width || 16) / (image?.height || 9);

      const height =
        size.height *
        IMAGE_HEIGHTS[index % IMAGE_HEIGHTS.length] *
        (mobile ? MOBILE_HEIGHT_SCALE : 1);

      const width = height * ratio;
      const x = cursor + width / 2;

      cursor += width + gap;

      return {
        index,
        width,
        height,
        x,
      };
    });

    const totalWidth = cursor;

    const repetitions = Math.ceil(size.width / Math.max(totalWidth, 1)) + 2;

    const planes: PlaneLayout[] = layout.flatMap((item) =>
      Array.from({ length: repetitions * 2 + 1 }, (_, copy) => ({
        ...item,
        copy: copy - repetitions,
      })),
    );

    return {
      planes,
      totalWidth,
    };
  }, [coverTextures, size.width, size.height, mobile]);

  useEffect(() => {
    listHitTestRef.current = (clientX, clientY, freeze = false) => {
      if (totalWidth <= 0) return null;

      const bounds = gl.domElement.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return null;
      }

      if (
        clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom
      ) {
        return null;
      }

      const worldX =
        ((clientX - bounds.left) / bounds.width - 0.5) * size.width;

      const worldY =
        (0.5 - (clientY - bounds.top) / bounds.height) * size.height;

      const bottomY = -size.height * GALLERY_BOTTOM;

      const offset = THREE.MathUtils.euclideanModulo(
        currentScroll.current,
        totalWidth,
      );

      for (let i = planes.length - 1; i >= 0; i--) {
        const plane = planes[i];

        const x = plane.x + plane.copy * totalWidth - offset;

        const centerY = bottomY + plane.height / 2;

        if (
          Math.abs(worldX - x) <= plane.width * 0.5 &&
          Math.abs(worldY - centerY) <= plane.height * 0.5
        ) {
          if (freeze) {
            scrollTarget.current = currentScroll.current;
          }

          return {
            index: plane.index,
            copy: plane.copy,
          };
        }
      }

      return null;
    };

    return () => {
      listHitTestRef.current = null;
    };
  }, [
    gl,
    listHitTestRef,
    planes,
    scrollTarget,
    size.height,
    size.width,
    totalWidth,
  ]);

  const planeUniforms = useMemo(
    () =>
      planes.map((plane) => {
        const texture = coverTextures[plane.index];

        return {
          uTexture: {
            value: texture,
          },
          uNextTexture: {
            value: texture,
          },
          uCoverTexture: {
            value: texture,
          },
          uMorph: {
            value: 0,
          },
          uEdgeMorphStrength: {
            value: EDGE_MORPH_STRENGTH,
          },
          uCoverReturn: {
            value: 0,
          },
          uUvFromScale: {
            value: new THREE.Vector2(1, 1),
          },
          uUvFromOffset: {
            value: new THREE.Vector2(0, 0),
          },
          uUvToScale: {
            value: new THREE.Vector2(1, 1),
          },
          uUvToOffset: {
            value: new THREE.Vector2(0, 0),
          },
          uUvCoverScale: {
            value: new THREE.Vector2(1, 1),
          },
          uUvCoverOffset: {
            value: new THREE.Vector2(0, 0),
          },
          uTime: {
            value: 0,
          },
          uHover: {
            value: 0,
          },
          uBlur: {
            value: 0,
          },
          uWorldScale: {
            value: plane.height / 3.6,
          },
          uImageSize: {
            value: new THREE.Vector2(plane.width, plane.height),
          },
          uEdgeBend: {
            value: 0,
          },
          uTransitionBend: {
            value: 0,
          },
          uPointer: {
            value: new THREE.Vector2(),
          },
          uMotion: {
            value: new THREE.Vector2(),
          },
          uOpacity: {
            value: 1,
          },
        };
      }),
    [planes, coverTextures],
  );

  // ANIMATION LOOP
  useFrame((state, rawDelta) => {
    if (totalWidth <= 0) return;

    if (!initialScrollSet.current) {
      initialScrollSet.current = true;

      if (initialProjectIndex >= 0 && initialProjectIndex < projects.length) {
        const initialPlane = planes.find(
          (plane) => plane.index === initialProjectIndex && plane.copy === 0,
        );

        if (initialPlane) {
          currentScroll.current = initialPlane.x;
          scrollTarget.current = initialPlane.x;
        }
      }
    }

    const dt = Math.min(rawDelta, 0.05);

    const justSelected =
      selected !== null &&
      (focusedPlane.current?.index !== selected.index ||
        focusedPlane.current?.copy !== selected.copy);

    if (justSelected) {
      focusedPlane.current = selected;

      // Freeze the infinite-scroll position.
      scrollTarget.current = currentScroll.current;

      transitionStart.current = null;
    }

    // NORMAL GALLERY SCROLL
    if (!selected) {
      if (focusedPlane.current) {
        hoveredPlane.current = null;
      }

      focusedPlane.current = null;
      transitionStart.current = null;

      currentScroll.current = THREE.MathUtils.damp(
        currentScroll.current,
        scrollTarget.current,
        SCROLL_SMOOTHING,
        dt,
      );
    }

    const worldPerPixel = 1;
    const periodPixels = totalWidth / worldPerPixel;

    // Keep scroll values bounded during long sessions.
    if (!selected && Math.abs(currentScroll.current) > periodPixels * 20) {
      const periods = Math.trunc(currentScroll.current / periodPixels);

      const shift = periods * periodPixels;

      currentScroll.current -= shift;
      scrollTarget.current -= shift;
    }

    const offset = THREE.MathUtils.euclideanModulo(
      currentScroll.current * worldPerPixel,
      totalWidth,
    );

    if (!selected && !profileActive && !mobile) {
      const pointer = pointerPositionRef.current;

      const next = pointer
        ? (listHitTestRef.current?.(pointer.x, pointer.y) ?? null)
        : null;

      const previous = hoveredPlane.current;

      if (previous?.index !== next?.index || previous?.copy !== next?.copy) {
        hoveredPlane.current = next;
        onHoverChange(next);
      }
    } else if (hoveredPlane.current) {
      hoveredPlane.current = null;
    }

    if (selected && !transitionStart.current && hasRenderedFrame.current) {
      const selectedIndex = planes.findIndex(
        (plane) =>
          plane.index === selected.index && plane.copy === selected.copy,
      );

      const mesh = meshes.current[selectedIndex];
      const plane = planes[selectedIndex];

      if (mesh && plane) {
        const uniforms = (mesh.material as THREE.ShaderMaterial).uniforms;

        transitionStart.current = {
          index: selected.index,
          copy: selected.copy,
          position: mesh.position.clone(),
          scale: mesh.scale.clone(),
          rotation: mesh.rotation.clone(),
          pointer: (uniforms.uPointer.value as THREE.Vector2).clone(),
          motion: (uniforms.uMotion.value as THREE.Vector2).clone(),
          hover: uniforms.uHover.value as number,
          edgeBend: uniforms.uEdgeBend.value as number,
          title: titleMetrics(
            mesh,
            state.camera,
            size,
            plane.width,
            plane.height,
          ),
        };

        pressedPlaneRef.current = null;
      }
    }

    const rawProgress = THREE.MathUtils.clamp(progress.current.value, 0, 1);

    // VIDEO PLAYBACK
    const activeVideo = videoElementRef.current;

    if (activeVideo && selected) {
      const lastSlide = (projectMedia[selected.index]?.length ?? 1) - 1;

      const shouldPlay =
        !closingRef.current &&
        rawProgress > 0.97 &&
        lastSlide >= 1 &&
        (mediaJump.current
          ? mediaJump.current.from === lastSlide ||
            (mediaJump.current.to === lastSlide &&
              mediaJump.current.progress > 0.001)
          : imageProgress.current.value >= lastSlide - 0.99);

      if (shouldPlay && activeVideo.paused && !videoPlayRequestedRef.current) {
        videoPlayRequestedRef.current = true;

        void activeVideo.play().catch(() => {
          videoPlayRequestedRef.current = false;
        });
      } else if (!shouldPlay) {
        if (!activeVideo.paused) {
          activeVideo.pause();
        }

        videoPlayRequestedRef.current = false;
      }
    }

    const t = smoothstep(rawProgress);
    const openingBend = Math.sin(Math.PI * rawProgress);
    const hovered = profileActive
      ? null
      : selected
        ? hoveredPlane.current
        : (pressedPlaneRef.current ?? hoveredPlane.current);

    const focused = focusedPlane.current;

    if (backdropRef.current) {
      backdropRef.current.style.opacity = String(
        THREE.MathUtils.smoothstep(t, 0, 0.86),
      );
    }

    planes.forEach((plane, index) => {
      const mesh = meshes.current[index];
      if (!mesh) return;

      const x = plane.x + plane.copy * totalWidth - offset;
      const baseY = -size.height * GALLERY_BOTTOM + plane.height / 2;

      const isFocused =
        focused?.index === plane.index && focused.copy === plane.copy;

      const isHovered =
        !selected &&
        !mobile &&
        hovered?.index === plane.index &&
        hovered.copy === plane.copy;

      const hover = THREE.MathUtils.damp(
        hoverValues.current[index] ?? 0,
        isHovered ? 1 : 0,
        HOVER_SPEED,
        dt,
      );

      hoverValues.current[index] = hover;

      const inView = Math.abs(x) < size.width / 2 + plane.width / 2;

      mesh.visible = isFocused || inView;

      if (!mesh.visible) return;

      const uniforms = (mesh.material as THREE.ShaderMaterial).uniforms;

      const uniformPointer = uniforms.uPointer.value as THREE.Vector2;

      const uniformMotion = uniforms.uMotion.value as THREE.Vector2;

      if (isFocused && selected) {
        const gallery = projectMedia[selected.index];

        const maxIndex = Math.max(0, gallery.length - 1);

        const imageValue = THREE.MathUtils.clamp(
          imageProgress.current.value,
          0,
          gallery.length,
        );

        const jump = mediaJump.current;
        const fromIndex = jump
          ? jump.from
          : Math.min(Math.floor(imageValue), maxIndex);

        const toIndex = jump
          ? jump.to
          : imageValue > maxIndex
            ? 0
            : Math.min(fromIndex + 1, maxIndex);

        const blend = jump ? jump.progress : imageValue - fromIndex;

        const resolveTexture = (slide: ProjectMedia) => {
          if (slide.kind === "image") {
            return textureByUrl.get(slide.src);
          }

          const video = videoElementRef.current;

          if (video && video.readyState >= 2 && videoTextureRef.current) {
            return videoTextureRef.current;
          }

          const lastImage = projectImages[selected.index].at(-1)!;

          return textureByUrl.get(lastImage);
        };

        const fromTexture = resolveTexture(gallery[fromIndex]);

        const toTexture = resolveTexture(gallery[toIndex]);

        if (fromTexture && toTexture) {
          uniforms.uTexture.value = fromTexture;
          uniforms.uNextTexture.value = toTexture;
          uniforms.uMorph.value = blend;
        }

        uniforms.uCoverReturn.value = coverMorph.current.value;
      } else {
        const coverTexture = coverTextures[plane.index];

        uniforms.uTexture.value = coverTexture;
        uniforms.uNextTexture.value = coverTexture;
        uniforms.uMorph.value = 0;
        uniforms.uCoverReturn.value = 0;

        uniforms.uUvFromScale.value.set(1, 1);
        uniforms.uUvFromOffset.value.set(0, 0);

        uniforms.uUvToScale.value.set(1, 1);
        uniforms.uUvToOffset.value.set(0, 0);

        uniforms.uUvCoverScale.value.set(1, 1);
        uniforms.uUvCoverOffset.value.set(0, 0);
      }

      // OPEN / CLOSE TRANSFORMATION
      if (isFocused && transitionStart.current) {
        const start = transitionStart.current;

        const coverAspect = plane.width / plane.height;

        const fitImage = (aspect: number) => {
          const maxWidth = Math.min(
            size.width * (mobile ? 0.86 : 0.48),
            size.height * 1.25,
          );

          const maxHeight = size.height * (mobile ? 0.62 : 0.72);

          const width = Math.min(maxWidth, maxHeight * aspect);

          return {
            width,
            height: width / aspect,
          };
        };

        const coverSize = fitImage(coverAspect);

        const actualStartWidth =
          (plane.width * start.scale.x * camera.position.z) /
          Math.max(1, camera.position.z - start.position.z);

        coverSize.width = Math.max(coverSize.width, actualStartWidth * 1.03);

        coverSize.height = coverSize.width / coverAspect;

        const gallery = projectMedia[selected.index];

        const maxIndex = Math.max(0, gallery.length - 1);

        const imageValue = THREE.MathUtils.clamp(
          imageProgress.current.value,
          0,
          gallery.length,
        );

        const jump = mediaJump.current;
        const fromIndex = jump
          ? jump.from
          : Math.min(Math.floor(imageValue), maxIndex);

        const toIndex = jump
          ? jump.to
          : imageValue > maxIndex
            ? 0
            : Math.min(fromIndex + 1, maxIndex);

        const blend = smoothstep(jump ? jump.progress : imageValue - fromIndex);

        const imageSize = (index: number) => {
          if (index === 0) {
            return coverSize;
          }

          const slide = gallery[index];

          if (slide.kind === "video") {
            const video = videoElementRef.current;

            const aspect =
              video?.videoWidth && video?.videoHeight
                ? video.videoWidth / video.videoHeight
                : coverAspect;

            return fitImage(aspect);
          }

          const texture = textureByUrl.get(slide.src);

          const image = texture?.image as
            | {
                width?: number;
                height?: number;
              }
            | undefined;

          const aspect =
            image?.width && image?.height
              ? image.width / image.height
              : coverAspect;

          return fitImage(aspect);
        };

        const fromSize = imageSize(fromIndex);
        const toSize = imageSize(toIndex);

        const morphWidth = THREE.MathUtils.lerp(
          fromSize.width,
          toSize.width,
          blend,
        );

        const morphHeight = THREE.MathUtils.lerp(
          fromSize.height,
          toSize.height,
          blend,
        );

        const coverReturn = coverMorph.current.value;

        const targetWidth = THREE.MathUtils.lerp(
          morphWidth,
          coverSize.width,
          coverReturn,
        );

        const targetHeight = THREE.MathUtils.lerp(
          morphHeight,
          coverSize.height,
          coverReturn,
        );

        const targetZ = Math.min(size.height * 0.14, camera.position.z * 0.12);

        const depthCorrection =
          (camera.position.z - targetZ) / camera.position.z;

        const finalScaleX = (targetWidth * depthCorrection) / plane.width;

        const finalScaleY = (targetHeight * depthCorrection) / plane.height;

        const finalX = 0;

        const finalY = mobile ? -size.height * 0.025 * depthCorrection : 0;

        const returnToRest = closingRef.current
          ? smoothstep((0.35 - rawProgress) / 0.35)
          : 0;

        const remainingHover = 1 - returnToRest;

        mesh.position.set(
          THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(start.position.x, finalX, t),
            x,
            returnToRest,
          ),
          THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(start.position.y, finalY, t),
            baseY,
            returnToRest,
          ),
          THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(start.position.z, targetZ, t),
            0,
            returnToRest,
          ),
        );

        mesh.scale.set(
          THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(start.scale.x, finalScaleX, t),
            1,
            returnToRest,
          ),
          THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(start.scale.y, finalScaleY, t),
            1,
            returnToRest,
          ),
          THREE.MathUtils.lerp(start.scale.z, 1, returnToRest),
        );

        mesh.rotation.set(
          THREE.MathUtils.lerp(start.rotation.x, 0, t) * remainingHover,
          THREE.MathUtils.lerp(start.rotation.y, 0, t) * remainingHover,
          THREE.MathUtils.lerp(start.rotation.z, 0, t) * remainingHover,
        );

        uniforms.uHover.value = start.hover * (1 - t) * remainingHover;

        uniformPointer
          .copy(start.pointer)
          .multiplyScalar((1 - t) * remainingHover);

        uniformMotion
          .copy(start.motion)
          .multiplyScalar((1 - t) * remainingHover);

        uniforms.uTransitionBend.value = openingBend * 0.8 * remainingHover;

        uniforms.uEdgeBend.value =
          (start.edgeBend * (1 - t) +
            openingBend * EDGE_BEND_STRENGTH * uniforms.uWorldScale.value) *
          remainingHover;

        uniforms.uOpacity.value = 1;
        mesh.renderOrder = 300;
      } else {
        // Hover only reveals the title.
        // No scale or position change.
        uniforms.uTransitionBend.value = 0;

        mesh.position.set(x, baseY, 0);
        mesh.scale.set(1, 1, 1);
        mesh.rotation.set(0, 0, 0);

        uniforms.uHover.value = 0;

        uniformPointer.set(0, 0);
        uniformMotion.set(0, 0);

        uniforms.uEdgeBend.value = 0;
        uniforms.uOpacity.value = 1;

        mesh.renderOrder = index + 1;
      }

      // DARKEN NON-HOVERED PROJECTS
      const blurTarget = !selected && !mobile && hovered && !isHovered ? 1 : 0;

      uniforms.uBlur.value = selected
        ? 0
        : THREE.MathUtils.damp(uniforms.uBlur.value, blurTarget, 7, dt);

      // TEXTURE UV CROP
      if (isFocused && selected) {
        const displayedAspect = Math.max(
          0.001,
          (plane.width * mesh.scale.x) / (plane.height * mesh.scale.y),
        );

        const setCrop = (
          texture: THREE.Texture,
          scale: THREE.Vector2,
          offset: THREE.Vector2,
        ) => {
          const image = texture.image as
            | {
                width?: number;
                height?: number;
                videoWidth?: number;
                videoHeight?: number;
              }
            | undefined;

          const width = image?.videoWidth || image?.width;

          const height = image?.videoHeight || image?.height;

          const aspect = width && height ? width / height : displayedAspect;

          if (aspect > displayedAspect) {
            scale.set(displayedAspect / aspect, 1);

            offset.set((1 - scale.x) / 2, 0);
          } else {
            scale.set(1, aspect / displayedAspect);

            offset.set(0, (1 - scale.y) / 2);
          }
        };

        setCrop(
          uniforms.uTexture.value,
          uniforms.uUvFromScale.value,
          uniforms.uUvFromOffset.value,
        );

        setCrop(
          uniforms.uNextTexture.value,
          uniforms.uUvToScale.value,
          uniforms.uUvToOffset.value,
        );

        setCrop(
          uniforms.uCoverTexture.value,
          uniforms.uUvCoverScale.value,
          uniforms.uUvCoverOffset.value,
        );
      }

      uniforms.uTime.value = state.clock.elapsedTime;
    });

    if (selected && backdropRef.current) {
      activeOutline.current =
        updateBackdropMask({
          selected,
          planes,
          meshes: meshes.current,
          imageHeight:
            planes.find(
              (plane) =>
                plane.index === selected.index && plane.copy === selected.copy,
            )?.height ?? size.height * (mobile ? 0.13 : 0.15),
          camera,
          gl,
          size,
          backdrop: backdropRef.current,
          point: screenCorner.current,
        }) ?? [];
    }

    if (!selected) {
      activeOutline.current = [];
    }

    const title = titleRef.current;

    if (title) {
      const label = title.querySelector<HTMLElement>(
        "[data-project-title-text]",
      );

      if (selected && transitionStart.current) {
        const start = transitionStart.current.title;

        const projectTitle =
          projects[selected.index]?.title?.trim() || "Untitled";

        if (label && label.textContent !== projectTitle) {
          label.textContent = projectTitle;
        }

        title.style.left = `${start.x}px`;
        title.style.top = `${start.y}px`;
        title.style.width = `${start.width}px`;
        title.style.fontSize = `${start.font}px`;

        title.style.transformOrigin = "left center";

        title.style.transform = `translateY(-50%) perspective(900px) rotateY(${start.yaw}rad) rotateX(${start.pitch}rad)`;

        title.style.opacity = String(
          closingRef.current
            ? 0
            : THREE.MathUtils.smoothstep(start.hover, 0.015, 0.42) *
                (1 - THREE.MathUtils.smoothstep(rawProgress, 0, 0.24)),
        );
      } else if (!selected && !mobile) {
        const active = hoveredPlane.current;

        const activeIndex = active
          ? planes.findIndex(
              (plane) =>
                plane.index === active.index && plane.copy === active.copy,
            )
          : -1;

        const activeHover =
          activeIndex >= 0 ? (hoverValues.current[activeIndex] ?? 0) : 0;

        if (activeIndex >= 0 && activeHover > 0.015) {
          const plane = planes[activeIndex];
          const mesh = meshes.current[activeIndex];

          if (mesh) {
            const metrics = titleMetrics(
              mesh,
              state.camera,
              size,
              plane.width,
              plane.height,
            );

            const projectTitle =
              projects[plane.index]?.title?.trim() || "Untitled";

            if (label && label.textContent !== projectTitle) {
              label.textContent = projectTitle;
            }

            title.style.left = `${metrics.x}px`;
            title.style.top = `${metrics.y}px`;
            title.style.width = `${metrics.width}px`;
            title.style.fontSize = `${metrics.font}px`;

            title.style.transformOrigin = "left center";

            title.style.transform = `translateY(-50%) perspective(900px) rotateY(${metrics.yaw}rad) rotateX(${metrics.pitch}rad)`;

            title.style.opacity = String(
              THREE.MathUtils.smoothstep(activeHover, 0.015, 0.42),
            );
          } else {
            title.style.opacity = "0";
          }
        } else {
          title.style.opacity = "0";
        }
      } else {
        title.style.opacity = "0";
      }
    }

    hasRenderedFrame.current = true;
  });

  return (
    <group>
      {planes.map((plane, index) => (
        <mesh
          key={`${plane.index}-${plane.copy}`}
          ref={(mesh) => {
            meshes.current[index] = mesh;
          }}
          frustumCulled={false}
        >
          <planeGeometry args={[plane.width, plane.height, 64, 88]} />

          <shaderMaterial
            uniforms={planeUniforms[index]}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            transparent
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
