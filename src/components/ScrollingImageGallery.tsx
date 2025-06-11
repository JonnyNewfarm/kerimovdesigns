"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const ScrollingImageGallery = () => {
  const slider = useRef<HTMLDivElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);
  const direction = useRef(-1);
  const xPercent = useRef(0);

  const images = [
    "/logos/logo1.jpg",
    "/logos/logo2.jpg",
    "/logos/logo3.jpg",
    "/logos/logo4.jpg",
    "/logos/logo5.jpg",
    "/logos/logo6.jpg",
    "/logos/logo7.jpg",
    "/logos/logo8.jpg",
  ];

  const animate = () => {
    if (xPercent.current < -100) xPercent.current = 0;
    if (xPercent.current > 0) xPercent.current = -100;

    gsap.set(row1.current, { xPercent: xPercent.current });
    gsap.set(row2.current, { xPercent: xPercent.current });

    xPercent.current += 0.04 * direction.current;

    requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (self) => {
          direction.current = self.direction * -1;
        },
      },
      x: "-250px",
    });

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="relative w-full flex mt-10  items-center overflow-hidden h-screen bg-dark">
      <div className="absolute flex flex-col top-16 left-5 sm:top-10 sm:left-10 gap-y-1 sm:gap-y-2 max-w-xs sm:max-w-md">
        <h1 className="text-2xl whitespace-nowrap sm:text-4xl font-bold">
          Logos that get you noticed
        </h1>
        <p className="text-base sm:text-lg">
          Simple, fresh, and made to stick with your vibe.
        </p>
      </div>
      <div
        ref={slider}
        className="relative flex whitespace-nowrap will-change-transform"
      >
        <div ref={row1} className="flex gap-x-16">
          {images.map((src, i) => (
            <div
              key={`img1-${i}`}
              className="relative w-[230px] h-[230px] md:w-[250px] md:h-[250px] m-1 border-[4px] border-white/40"
            >
              <Image src={src} alt={`img-${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div
          ref={row2}
          className="flex ml-16 absolute gap-x-16 left-full top-0"
        >
          {images.map((src, i) => (
            <div
              key={`img2-${i}`}
              className="relative w-[200px] h-[200px] md:w-[250px] md:h-[250px] m-1 border-[4px] border-white/40"
            >
              <Image src={src} alt={`img-${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingImageGallery;
