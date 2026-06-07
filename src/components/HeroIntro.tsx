"use client";

import { motion, AnimatePresence } from "framer-motion";

type HeroIntroProps = {
  isDone: boolean;
};

const images = [
  "/cube-img/image1.jpg",
  "/cube-img/image2.jpg",
  "/cube-img/cubeimg5.png",
  "/cube-img/image4.jpg",
  "/cube-img/image3.jpg",
  "/cube-img/rustam.jpg",
];

const ease = [0.76, 0, 0.24, 1] as const;

export default function HeroIntro({ isDone }: HeroIntroProps) {
  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.55,
              delay: 0.15,
              ease,
            },
          }}
          className="absolute inset-0 z-50 bg-[#181c14]"
        >
          <div className="relative h-full w-full overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-1/2 top-[18%] -translate-x-1/2 text-[10px] uppercase tracking-[0.45em] text-[#ecdfcc]/65"
            >
              Portfolio Experience
            </motion.p>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-3/4 w-full">
                <div className="absolute left-1/2 top-[50.5%] h-[245px] w-[245px] -translate-x-1/2 -translate-y-1/2 md:h-[285px] md:w-[285px]">
                  {images.map((src, index) => {
                    const isTopImage = src.includes("rustam");

                    return (
                      <motion.img
                        key={src}
                        src={src}
                        alt=""
                        draggable={false}
                        initial={{
                          opacity: 0,
                          x: getInitialX(index),
                          y: getInitialY(index),
                          scale: 0.88,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          y: 0,
                          scale: isTopImage ? 1 : 0.96,
                        }}
                        transition={{
                          opacity: {
                            duration: 0.35,
                            delay: index * 0.07,
                          },
                          x: {
                            duration: 1.15,
                            delay: 0.55 + index * 0.04,
                            ease,
                          },
                          y: {
                            duration: 1.15,
                            delay: 0.55 + index * 0.04,
                            ease,
                          },
                          scale: {
                            duration: 1.15,
                            delay: 0.55 + index * 0.04,
                            ease,
                          },
                        }}
                        className="absolute left-1/2 top-1/2 h-[245px] w-[245px] -translate-x-1/2 -translate-y-1/2 object-cover md:h-[285px] md:w-[285px]"
                        style={{
                          zIndex: isTopImage ? 20 : index,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 2.4,
                ease,
              }}
              className="absolute bottom-[18%] left-1/2 h-[1px] w-[180px] origin-left -translate-x-1/2 bg-[#ecdfcc]/60"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getInitialX(index: number) {
  const desktopPositions = [-460, -280, -110, 110, 280, 460];

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return 0;
  }

  return desktopPositions[index] ?? 0;
}

function getInitialY(index: number) {
  const mobilePositions = [-380, -230, -80, 80, 230, 380];

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return mobilePositions[index] ?? 0;
  }

  return 0;
}
