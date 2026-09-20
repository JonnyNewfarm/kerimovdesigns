"use client";

import {
  useEffect,
  useState,
} from "react";

import * as THREE from "three";

export default function useHoverLabelTexture(
  backgroundColor: string,
) {
  const [
    texture,
    setTexture,
  ] =
    useState<THREE.CanvasTexture | null>(
      null,
    );

  useEffect(() => {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    let cancelled =
      false;

    let createdTexture:
      | THREE.CanvasTexture
      | null = null;

    setTexture(null);

    const createTexture =
      async () => {
        /*
         * Vent på Satoshi dersom fonten
         * fortsatt loader.
         */
        try {
          await document.fonts.ready;
        } catch {
          // fallback font brukes.
        }

        if (cancelled) {
          return;
        }

        const canvas =
          document.createElement(
            "canvas",
          );

        /*
         * Høy resolution så teksten
         * holder seg skarp.
         */
        canvas.width =
          1024;

        canvas.height =
          360;

        const ctx =
          canvas.getContext(
            "2d",
          );

        if (!ctx) {
          return;
        }

        /*
         * BACKGROUND
         */

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        ctx.fillStyle =
          backgroundColor;

        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        /*
         * TEXT
         */

        let fontSize =
          170;

        ctx.font =
          `900 ${fontSize}px Satoshi, Arial, Helvetica, sans-serif`;

        const text =
          "VIEW CASE";

        const maxWidth =
          canvas.width -
          110;

        const measured =
          ctx.measureText(
            text,
          ).width;

        if (
          measured >
          maxWidth
        ) {
          fontSize *=
            maxWidth /
            measured;

          ctx.font =
            `900 ${fontSize}px Satoshi, Arial, Helvetica, sans-serif`;
        }

        ctx.fillStyle =
          "#eae9e1";

        ctx.textAlign =
          "center";

        ctx.textBaseline =
          "middle";

        ctx.fillText(
          text,
          canvas.width / 2,
          canvas.height / 2 + 4,
        );

        /*
         * THREE TEXTURE
         */

        createdTexture =
          new THREE.CanvasTexture(
            canvas,
          );

        createdTexture.colorSpace =
          THREE.SRGBColorSpace;

        createdTexture.minFilter =
          THREE.LinearFilter;

        createdTexture.magFilter =
          THREE.LinearFilter;

        createdTexture.generateMipmaps =
          false;

        createdTexture.needsUpdate =
          true;

        if (
          !cancelled
        ) {
          setTexture(
            createdTexture,
          );
        }
      };

    void createTexture();

    return () => {
      cancelled =
        true;

      createdTexture?.dispose();
    };
  }, [backgroundColor]);

  return texture;
}