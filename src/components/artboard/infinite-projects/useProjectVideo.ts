"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { ActivePlane, InfiniteProject } from "./types";

export function useProjectVideo(selected: ActivePlane | null, projects: InfiniteProject[]) {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const videoPlayRequestedRef = useRef(false);

  useEffect(() => {
    const source = selected ? projects[selected.index]?.srcVideo?.trim() : null;
    if (!source) return;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.src = source;

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    videoElementRef.current = video;
    videoTextureRef.current = texture;
    videoPlayRequestedRef.current = false;
    video.load();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      if (videoElementRef.current === video) videoElementRef.current = null;
      if (videoTextureRef.current === texture) videoTextureRef.current = null;
      videoPlayRequestedRef.current = false;
    };
  }, [selected?.index, projects]);

  return { videoElementRef, videoTextureRef, videoPlayRequestedRef };
}
