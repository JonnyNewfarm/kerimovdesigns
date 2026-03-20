"use client";

import { motion, AnimatePresence } from "framer-motion";

type HeroIntroProps = {
  isDone: boolean;
};

export default function HeroIntro({ isDone }: HeroIntroProps) {
  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[#181c14]"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg
                className="hero-intro-logo"
                width="300"
                height="300"
                viewBox="0 0 169 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.72205e-06 89.6V0H33.536C41.1307 0 47.6587 1.23734 53.12 3.71201C58.5813 6.10134 62.7627 9.6 65.664 14.208C68.6507 18.7307 70.144 24.2347 70.144 30.72C70.144 37.0347 68.6507 42.496 65.664 47.104C62.7627 51.6267 58.5813 55.1253 53.12 57.6C47.6587 59.9893 41.1307 61.184 33.536 61.184H5.248L9.47201 56.832V89.6H5.72205e-06ZM61.184 89.6L38.144 57.088H48.384L71.552 89.6H61.184ZM9.47201 57.6L5.248 53.12H33.28C42.24 53.12 49.024 51.1573 53.632 47.232C58.3253 43.3067 60.672 37.8027 60.672 30.72C60.672 23.552 58.3253 18.0053 53.632 14.08C49.024 10.1547 42.24 8.192 33.28 8.192H5.248L9.47201 3.71201V57.6ZM100.692 67.328L100.308 55.808L154.58 0H165.46L125.908 41.472L120.532 47.232L100.692 67.328ZM92.5 89.6V0H101.972V89.6H92.5ZM156.884 89.6L118.228 45.056L124.628 38.144L168.148 89.6H156.884Z" />
              </svg>
            </motion.div>

            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.7,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[10px] uppercase tracking-[0.45em] text-[#ecdfcc]/65"
            >
              Portfolio Experience
            </motion.p>

            <ProgressLine />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProgressLine() {
  return (
    <div className="relative h-[1px] w-[180px] overflow-hidden bg-[#ecdfcc]/15">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 h-full w-1/2 bg-[#ecdfcc]"
      />
    </div>
  );
}
