"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
  PROFILE_VERTEX_SHADER,
  PROFILE_FRAGMENT_SHADER,
} from "./profileShader";
import {
  OPEN_DURATION,
  CLOSE_DURATION,
  EDGE_MORPH_STRENGTH,
} from "../infinite-projects/constants";
import { smoothstep } from "../infinite-projects/projectMath";
// SAME BEND SETTINGS FOR OPENING AND CLOSING
const PROFILE_TRAIL_TIME = 0.14;
const PROFILE_TRAIL_MAX_X = 0.35;
const PROFILE_TRAIL_MAX_Y = 0.28;
const PROFILE_DEPTH_STRENGTH = 0.92;
export const PROFILE_SLIDES = [
  {
    src: "/rk-portrait.jpg",
    discipline: null,
  },
  {
    src: "/visual-identity.jpg",
    discipline: "Visual Identities",
  },
  {
    src: "/logo-design.jpg",
    discipline: "Logo Design",
  },
  {
    src: "/art-direction.jpg",
    discipline: "Art Direction",
  },
  {
    src: "/bylarm-new.mp4",
    discipline: "Motion & Animation",
  },
  {
    src: "/editorial-design.jpg",
    discipline: "Editorial Design",
  },
] as const;
const PORTRAIT_ASPECT = 4 / 5;
const isVideoSource = (src: string) => /\.(mp4|webm|ogv)(?:\?|$)/i.test(src);
const IMAGE_URLS = PROFILE_SLIDES.filter(
  (slide) => !isVideoSource(slide.src),
).map((slide) => slide.src);
const VIDEO_URLS = PROFILE_SLIDES.filter((slide) =>
  isVideoSource(slide.src),
).map((slide) => slide.src);
type VideoEntry = {
  video: HTMLVideoElement;
  texture: THREE.VideoTexture;
  requested: boolean;
};
export type ProfileMediaJump = {
  from: number;
  to: number;
  progress: number;
};

type Props = {
  open: boolean;
  projectSelected: boolean;
  mediaProgress: MutableRefObject<{ value: number }>;
  mediaJump: MutableRefObject<ProfileMediaJump | null>;
  coverReturn: MutableRefObject<{ value: number }>;
  isOverImage: MutableRefObject<((x: number, y: number) => boolean) | null>;
  htmlBackdropRef: MutableRefObject<HTMLDivElement | null>;
  onReadyChange: (ready: boolean) => void;
  onClosed: () => void;
};
export function getRustamProfileLayout(width: number, height: number) {
  const mobile = width < 1024;
  const thumbnailWidth = mobile
    ? Math.min(140, Math.max(104, width * 0.28))
    : Math.min(210, Math.max(150, width * 0.12));
  const thumbnailHeight = thumbnailWidth / PORTRAIT_ASPECT;
  const thumbnailRight = width * (mobile ? 0.05 : 0.031);
  const thumbnailTop = mobile ? 225 : 150;
  return {
    thumbnailWidth,
    thumbnailHeight,
    thumbnailX: width / 2 - thumbnailRight - thumbnailWidth / 2,
    thumbnailY: height / 2 - thumbnailTop - thumbnailHeight / 2,
    mobile,
  };
}
function textureAspect(texture: THREE.Texture, fallback = PORTRAIT_ASPECT) {
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
  return width && height ? width / height : fallback;
}
function updateCrop(
  texture: THREE.Texture,
  displayedAspect: number,
  scale: THREE.Vector2,
  offset: THREE.Vector2,
) {
  const aspect = textureAspect(texture, displayedAspect);
  if (aspect > displayedAspect) {
    scale.set(displayedAspect / aspect, 1);
    offset.set((1 - scale.x) / 2, 0);
  } else {
    scale.set(1, aspect / displayedAspect);
    offset.set(0, (1 - scale.y) / 2);
  }
}
export default function RustamProfilePlane({
  open,
  projectSelected,
  mediaProgress,
  mediaJump,
  coverReturn,
  isOverImage,
  onReadyChange,
  onClosed,
  htmlBackdropRef,
}: Props) {
  const { size, camera, gl } = useThree();
  const imageTextures = useTexture(IMAGE_URLS);
  const imageTexturesByUrl = useMemo(
    () =>
      new Map(
        IMAGE_URLS.map((src, index) => [src, imageTextures[index]] as const),
      ),
    [imageTextures],
  );
  const videosRef = useRef<Map<string, VideoEntry>>(new Map());
  const layout = getRustamProfileLayout(size.width, size.height);
  const portraitRef = useRef<THREE.Mesh>(null);
  const backdropRef = useRef<THREE.Mesh>(null);
  const backdropMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const opening = useRef({ value: 0 });
  const hasOpened = useRef(false);
  const outlineRef = useRef<number[]>([]);
  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: imageTextures[0],
      },
      uNextTexture: {
        value: imageTextures[0],
      },
      uCoverTexture: {
        value: imageTextures[0],
      },
      uMorph: {
        value: 0,
      },
      uCoverReturn: {
        value: 0,
      },
      uEdgeMorphStrength: {
        value: EDGE_MORPH_STRENGTH,
      },
      uUvFromScale: {
        value: new THREE.Vector2(1, 1),
      },
      uUvFromOffset: {
        value: new THREE.Vector2(),
      },
      uUvToScale: {
        value: new THREE.Vector2(1, 1),
      },
      uUvToOffset: {
        value: new THREE.Vector2(),
      },
      uUvCoverScale: {
        value: new THREE.Vector2(1, 1),
      },
      uUvCoverOffset: {
        value: new THREE.Vector2(),
      },
      uTime: {
        value: 0,
      },
      uWorldScale: {
        value: 1,
      },
      uImageSize: {
        value: new THREE.Vector2(1, 1),
      },
      uTravelLag: {
        value: new THREE.Vector2(),
      },
      uDepthBend: {
        value: 0,
      },
      uClosing: {
        value: 0,
      },
      uOpacity: {
        value: 1,
      },
      uBlur: {
        value: 0,
      },
    }),
    [imageTextures],
  );
  // IMAGE TEXTURES
  useEffect(() => {
    imageTextures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    });
  }, [imageTextures]);
  // VIDEO TEXTURES
  useEffect(() => {
    const entries = videosRef.current;
    for (const src of VIDEO_URLS) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = src;
      video.load();
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      entries.set(src, {
        video,
        texture,
        requested: false,
      });
    }
    return () => {
      for (const { video, texture } of entries.values()) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        texture.dispose();
      }
      entries.clear();
    };
  }, []);
  // CUSTOM CURSOR HIT TEST
  useEffect(() => {
    isOverImage.current = (x, y) => {
      const polygon = outlineRef.current;
      if (polygon.length !== 8) {
        return false;
      }
      let inside = false;
      for (let i = 0, j = 3; i < 4; j = i++) {
        const xi = polygon[i * 2];
        const yi = polygon[i * 2 + 1];
        const xj = polygon[j * 2];
        const yj = polygon[j * 2 + 1];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };
    return () => {
      isOverImage.current = null;
    };
  }, [isOverImage]);
  // OPEN / CLOSE ANIMATION
  useEffect(() => {
    if (!open && !hasOpened.current) {
      return;
    }
    if (open) {
      hasOpened.current = true;
    }
    onReadyChange(false);
    const tween = gsap.to(opening.current, {
      value: open ? 1 : 0,
      duration: open ? OPEN_DURATION : CLOSE_DURATION,
      ease: "none",
      overwrite: true,
      onComplete: () => {
        if (open) {
          onReadyChange(true);
        } else {
          onClosed();
        }
      },
    });
    return () => tween.kill();
  }, [open, onReadyChange, onClosed]);
  useFrame((state) => {
    const mesh = portraitRef.current;
    if (!mesh) return;
    const raw = THREE.MathUtils.clamp(opening.current.value, 0, 1);
    const t = smoothstep(raw);
    const returnAmount = THREE.MathUtils.clamp(coverReturn.current.value, 0, 1);
    // BACKDROP
    const backdrop = backdropRef.current;
    const backdropMaterial = backdropMaterialRef.current;
    if (backdrop && backdropMaterial) {
      // The existing HTML ProjectBackdrop handles
      // background darkening and blur.
      backdrop.visible = false;
    }
    mesh.visible = true;
    // PROFILE MEDIA
    const count = PROFILE_SLIDES.length;
    const value = THREE.MathUtils.clamp(mediaProgress.current.value, 0, count);
    const last = count - 1;
    // A direct menu selection chooses its destination, but keeps
    // the exact same shader morph and transition progress.
    const jump = mediaJump.current;
    const fromIndex = jump ? jump.from : Math.min(Math.floor(value), last);
    const toIndex = jump
      ? jump.to
      : value > last
        ? 0
        : Math.min(fromIndex + 1, last);
    const mixAmount = jump ? jump.progress : value - fromIndex;
    const morphT = smoothstep(mixAmount);
    // VIDEO PLAYBACK
    for (const [src, entry] of videosRef.current) {
      const shouldPlay =
        open &&
        !projectSelected &&
        raw > 0.95 &&
        (PROFILE_SLIDES[fromIndex].src === src ||
          (mixAmount > 0.001 && PROFILE_SLIDES[toIndex].src === src));
      if (shouldPlay) {
        if (entry.video.paused && !entry.requested) {
          entry.requested = true;
          void entry.video.play().catch(() => {
            entry.requested = false;
            console.warn(`Could not play profile video: ${src}`);
          });
        }
      } else {
        if (!entry.video.paused) {
          entry.video.pause();
        }
        entry.requested = false;
      }
    }
    const getTexture = (index: number): THREE.Texture => {
      const src = PROFILE_SLIDES[index].src;
      const image = imageTexturesByUrl.get(src);
      if (image) return image;
      const video = videosRef.current.get(src);
      if (video && video.video.readyState >= 2) {
        return video.texture;
      }
      return imageTextures[0];
    };
    const fromTexture = getTexture(fromIndex);
    const toTexture = getTexture(toIndex);
    // IMAGE FITTING
    const fitImage = (aspect: number) => {
      const maxWidth = Math.min(
        size.width * (layout.mobile ? 0.86 : 0.48),
        size.height * 1.25,
      );
      const maxHeight = size.height * (layout.mobile ? 0.62 : 0.72);
      const width = Math.min(maxWidth, maxHeight * aspect);
      return {
        width,
        height: width / aspect,
      };
    };
    const coverSize = fitImage(PORTRAIT_ASPECT);
    const fromSize = fitImage(
      fromIndex === 0 ? PORTRAIT_ASPECT : textureAspect(fromTexture),
    );
    const toSize = fitImage(
      toIndex === 0 ? PORTRAIT_ASPECT : textureAspect(toTexture),
    );
    const morphWidth = THREE.MathUtils.lerp(
      fromSize.width,
      toSize.width,
      morphT,
    );
    const morphHeight = THREE.MathUtils.lerp(
      fromSize.height,
      toSize.height,
      morphT,
    );
    const targetWidth = THREE.MathUtils.lerp(
      morphWidth,
      coverSize.width,
      returnAmount,
    );
    const targetHeight = THREE.MathUtils.lerp(
      morphHeight,
      coverSize.height,
      returnAmount,
    );
    const targetZ = Math.min(size.height * 0.14, camera.position.z * 0.12);
    const depthCorrection = (camera.position.z - targetZ) / camera.position.z;
    const targetScaleX =
      (targetWidth * depthCorrection) / layout.thumbnailWidth;
    const targetScaleY =
      (targetHeight * depthCorrection) / layout.thumbnailHeight;
    const targetY = layout.mobile ? -size.height * 0.025 * depthCorrection : 0;
    // POSITION
    mesh.position.set(
      THREE.MathUtils.lerp(layout.thumbnailX, 0, t),
      THREE.MathUtils.lerp(layout.thumbnailY, targetY, t),
      THREE.MathUtils.lerp(0, targetZ, t),
    );
    // SCALE INCLUDING DEPTH
    mesh.scale.set(
      THREE.MathUtils.lerp(1, targetScaleX, t),
      THREE.MathUtils.lerp(1, targetScaleY, t),
      THREE.MathUtils.lerp(1, Math.min(targetScaleX, targetScaleY), t),
    );
    // IDENTICAL BEND IN BOTH DIRECTIONS
    //
    // Same magnitude at the same animation position.
    // Only the trailing side and travel direction change.
    //
    // No smoothing state and no separate closing strength.
    const speedShape = (6 * raw * (1 - raw)) / Math.max(OPEN_DURATION, 0.001);
    const lagX = THREE.MathUtils.clamp(
      (Math.abs(layout.thumbnailX) * speedShape * PROFILE_TRAIL_TIME) /
        Math.max(mesh.scale.x, 0.001),
      0,
      layout.thumbnailWidth * PROFILE_TRAIL_MAX_X,
    );
    const lagY = THREE.MathUtils.clamp(
      (Math.abs(layout.thumbnailY - targetY) *
        speedShape *
        PROFILE_TRAIL_TIME) /
        Math.max(mesh.scale.y, 0.001),
      0,
      layout.thumbnailHeight * PROFILE_TRAIL_MAX_Y,
    );
    const direction = open ? 1 : -1;
    // Same bend, opposite movement.
    uniforms.uTravelLag.value.set(lagX * direction, lagY * direction);
    // Depth is always positive.
    // The shader mirrors its shape across the X-axis.
    uniforms.uDepthBend.value =
      Math.sqrt(lagX * lagX + lagY * lagY * 0.55) * PROFILE_DEPTH_STRENGTH;
    // Explicitly choose which edge trails.
    // No unreliable velocity-sign detection.
    uniforms.uClosing.value = open ? 0 : 1;
    const motionTilt = Math.sin(Math.PI * raw);
    // Rotate around the vertical Y-axis ONLY
    const yTilt = motionTilt * (open ? -0.22 : 0.22);
    mesh.rotation.set(0, yTilt, 0);
    mesh.renderOrder = projectSelected ? 299 : 600;
    // SHADER UNIFORMS
    uniforms.uTexture.value = fromTexture;
    uniforms.uNextTexture.value = toTexture;
    uniforms.uCoverTexture.value = imageTextures[0];
    uniforms.uMorph.value = mixAmount;
    uniforms.uCoverReturn.value = returnAmount;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uWorldScale.value = layout.thumbnailHeight / 3.6;
    uniforms.uImageSize.value.set(
      layout.thumbnailWidth,
      layout.thumbnailHeight,
    );
    const displayedAspect = Math.max(
      0.001,
      (layout.thumbnailWidth * mesh.scale.x) /
        (layout.thumbnailHeight * mesh.scale.y),
    );
    // TEXTURE CROPPING
    updateCrop(
      fromTexture,
      displayedAspect,
      uniforms.uUvFromScale.value,
      uniforms.uUvFromOffset.value,
    );
    updateCrop(
      toTexture,
      displayedAspect,
      uniforms.uUvToScale.value,
      uniforms.uUvToOffset.value,
    );
    updateCrop(
      imageTextures[0],
      displayedAspect,
      uniforms.uUvCoverScale.value,
      uniforms.uUvCoverOffset.value,
    );
    // CURSOR HIT TEST
    mesh.updateWorldMatrix(true, false);
    const bounds = gl.domElement.getBoundingClientRect();
    const halfW = layout.thumbnailWidth / 2;
    const halfH = layout.thumbnailHeight / 2;
    const trailingRight = open;
    const corners = [
      [
        -halfW + (trailingRight ? 0 : -lagX * 0.78),
        -halfH + (trailingRight ? 0 : -lagY * 0.78),
      ],
      [
        halfW + (trailingRight ? lagX * 0.78 : 0),
        -halfH + (trailingRight ? lagY * 0.78 : 0),
      ],
      [
        halfW + (trailingRight ? lagX * 0.78 : 0),
        halfH + (trailingRight ? lagY * 0.78 : 0),
      ],
      [
        -halfW + (trailingRight ? 0 : -lagX * 0.78),
        halfH + (trailingRight ? 0 : -lagY * 0.78),
      ],
    ];
    const polygon = outlineRef.current;
    polygon.length = 0;
    for (const [x, y] of corners) {
      const point = mesh.localToWorld(new THREE.Vector3(x, y, 0));
      point.project(camera);
      polygon.push(
        bounds.left + (point.x + 1) * bounds.width * 0.5,
        bounds.top + (1 - point.y) * bounds.height * 0.5,
      );
    }
    // REUSE PROJECT BACKDROP FOR ABOUT
    // ABOUT BACKDROP — FOLLOW THE ACTUAL SHADER EDGES
    const htmlBackdrop = htmlBackdropRef.current;
    if (htmlBackdrop && !projectSelected) {
      if (raw <= 0.001) {
        htmlBackdrop.style.opacity = "0";
        htmlBackdrop.style.clipPath = "";
      } else {
        const outline: string[] = [];
        const PI = Math.PI;
        const lagX = uniforms.uTravelLag.value.x;
        const lagY = uniforms.uTravelLag.value.y;
        const depth = uniforms.uDepthBend.value;
        const morph = uniforms.uMorph.value;
        const cover = uniforms.uCoverReturn.value;
        const worldScale = uniforms.uWorldScale.value;
        const edgeStrength = uniforms.uEdgeMorphStrength.value;
        const time = uniforms.uTime.value;
        const morphPulse = Math.max(
          Math.sin(PI * morph) * (1 - cover),
          Math.sin(PI * cover),
        );
        const point = new THREE.Vector3();
        const addEdgePoint = (u: number, v: number) => {
          const side = u * 2 - 1;
          const verticalSide = v * 2 - 1;
          const horizontalEdge = Math.pow(Math.abs(side), 1.25);
          const verticalEdge = Math.pow(Math.abs(verticalSide), 1.55);
          const cornerMask = horizontalEdge * verticalEdge;
          const sideMiddle = horizontalEdge * (1 - verticalEdge);
          const sx = Math.sin(u * PI);
          const sy = Math.sin(v * PI);
          point.set(
            (u - 0.5) * layout.thumbnailWidth,
            (v - 0.5) * layout.thumbnailHeight,
            0,
          );
          // SAME CORNER TRAILING AS PROFILE SHADER
          point.x += lagX * (0.125 * cornerMask - 0.055 * sideMiddle);
          point.y += lagX * 0.07 * side * verticalSide;
          point.y += lagY * 0.025 * cornerMask;
          // SAME 3D DEPTH CURVE
          const verticalSoftness = 0.8 + 0.2 * sy;
          const depthCurve = (sx * 0.95 - cornerMask * 0.3) * verticalSoftness;
          point.z += depth * 0.48 * depthCurve;
          // SAME IMAGE MORPH
          point.z +=
            sx *
            sy *
            morphPulse *
            worldScale *
            (0.38 + 0.22 * Math.sin(u * 7 + v * 3 + time * 0.4));
          point.x +=
            sx * sy * morphPulse * worldScale * 0.075 * Math.sin(v * 8);
          // SAME MORPH EDGE MOTION
          const sideMask = Math.pow(Math.abs(side), 2.6);
          const topBottomMask = Math.pow(Math.abs(verticalSide), 2.6);
          const sideFlow =
            (Math.sin(v * 2 * PI + time * 0.5 + 0.6) +
              0.3 * Math.sin(v * 4 * PI - time * 0.32)) *
            sy;
          const topBottomFlow =
            (Math.sin(u * 2 * PI - time * 0.4 + 1.2) +
              0.3 * Math.sin(u * 4 * PI + time * 0.3)) *
            sx;
          const edgeAmount = morphPulse * worldScale * edgeStrength;
          point.x += side * sideMask * sideFlow * edgeAmount;
          point.y +=
            verticalSide * topBottomMask * topBottomFlow * edgeAmount * 0.68;
          point.z += (sideMask * sy + topBottomMask * sx) * edgeAmount * 0.65;
          // PROJECT DEFORMED EDGE INTO SCREEN SPACE
          mesh.localToWorld(point);
          point.project(camera);
          const x = bounds.left + (point.x + 1) * bounds.width * 0.5;
          const y = bounds.top + (1 - point.y) * bounds.height * 0.5;
          outline.push(`${x.toFixed(2)}px ${y.toFixed(2)}px`);
        };
        const samples = 32;
        for (let i = 0; i <= samples; i++) {
          addEdgePoint(i / samples, 0);
        }
        for (let i = 1; i <= samples; i++) {
          addEdgePoint(1, i / samples);
        }
        for (let i = 1; i <= samples; i++) {
          addEdgePoint(1 - i / samples, 1);
        }
        for (let i = 1; i <= samples; i++) {
          addEdgePoint(0, 1 - i / samples);
        }
        htmlBackdrop.style.clipPath = `polygon(
          evenodd,
          0px 0px,
          ${window.innerWidth}px 0px,
          ${window.innerWidth}px ${window.innerHeight}px,
          0px ${window.innerHeight}px,
          0px 0px,
          ${outline.join(", ")}
        )`;
        htmlBackdrop.style.opacity = String(
          THREE.MathUtils.smoothstep(t, 0, 0.86),
        );
      }
    }
  });
  return (
    <group>
      <mesh
        ref={backdropRef}
        position={[0, 0, -1]}
        renderOrder={500}
        frustumCulled={false}
        visible={false}
        raycast={() => {}}
      >
        <planeGeometry args={[size.width * 1.4, size.height * 1.4]} />
        <meshBasicMaterial
          ref={backdropMaterialRef}
          color="#080808"
          opacity={0}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh
        ref={portraitRef}
        renderOrder={600}
        frustumCulled={false}
        raycast={() => {}}
      >
        <planeGeometry
          args={[layout.thumbnailWidth, layout.thumbnailHeight, 64, 88]}
        />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={PROFILE_VERTEX_SHADER}
          fragmentShader={PROFILE_FRAGMENT_SHADER}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
