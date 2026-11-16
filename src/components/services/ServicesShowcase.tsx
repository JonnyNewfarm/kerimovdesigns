"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import ServicesMorphImage from "./ServicesMorphImage";
import { SECTIONS } from "./servicesData";

export default function ServicesShowcase() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const progressRef = useRef(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      const mobile = window.innerWidth < 768;

      const anchor = window.innerHeight * (mobile ? 0.7 : 0.5);

      const positions = textRefs.current.map((element) => {
        if (!element) return null;

        const rect = element.getBoundingClientRect();

        return rect.top + rect.height / 2;
      });

      if (positions.some((position) => position === null)) {
        return;
      }

      const centers = positions as number[];
      const lastIndex = centers.length - 1;

      if (anchor <= centers[0]) {
        progressRef.current = 0;
        return;
      }

      if (anchor >= centers[lastIndex]) {
        progressRef.current = lastIndex;
        return;
      }

      for (let i = 0; i < lastIndex; i++) {
        const start = centers[i];
        const end = centers[i + 1];

        if (anchor >= start && anchor <= end) {
          const t = THREE.MathUtils.clamp(
            (anchor - start) / (end - start),
            0,
            1,
          );

          progressRef.current = i + t;

          break;
        }
      }
    };

    const onScroll = () => {
      if (frame) return;

      frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);

      window.removeEventListener("resize", onScroll);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      className="
        mx-auto
        grid
        max-w-[1700px]
        grid-cols-1
        items-start
        px-5

        md:grid-cols-[minmax(0,32%)_minmax(0,1fr)]
        md:gap-x-10
        md:px-8

        lg:grid-cols-[340px_minmax(0,1fr)]
        lg:gap-x-20
        lg:px-10
      "
    >
      {/* STICKY IMAGE */}
      <div
        className="
          sticky
          top-0
          z-10
          flex
          h-[42svh]
          min-w-0
          items-center
          justify-center
          bg-dark

          md:h-svh
          md:justify-start
        "
      >
        <ServicesMorphImage progressRef={progressRef} />
      </div>

      {/* SCROLLING TEXT */}
      <div className="min-w-0 pb-[12svh] md:pb-0">
        {SECTIONS.map((section, index) => (
          <div
            key={section.src}
            ref={(element) => {
              textRefs.current[index] = element;
            }}
            className="
              flex
              min-h-[70svh]
              items-center
              py-12

              md:min-h-svh
              md:py-24
            "
          >
            <p
              className="
                max-w-[1100px]
                text-[clamp(30px,4.2vw,68px)]
                font-normal
                leading-[1.14]
                tracking-normal
              "
            >
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
