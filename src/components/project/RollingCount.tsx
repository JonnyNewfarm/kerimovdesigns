import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { formatCount } from "./projectUtils";

type RollingDigitProps = {
  digit: number;
  delay?: number;
};

function RollingDigit({ digit, delay = 0 }: RollingDigitProps) {
  const duration = digit === 0 ? 0.6 : 0.45 + digit * 0.22;

  return (
    <span
      className="
        relative
        inline-block
        h-[1em]
        overflow-hidden
        leading-none
      "
    >
      <motion.span
        className="block"
        initial={{
          y: "0%",
        }}
        animate={{
          y: `-${digit * 10}%`,
        }}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
          delay,
        }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            className="block h-[1em] leading-none"
            aria-hidden="true"
          >
            {index}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

type RollingCountProps = {
  value: number;
  digits?: number;
};

export default function RollingCount({ value, digits = 2 }: RollingCountProps) {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasStarted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  const currentValue = hasStarted ? value : 0;

  const formattedValue = String(currentValue).padStart(digits, "0");

  return (
    <span
      className="
        inline-flex
        overflow-hidden
        text-lg
        font-black
        uppercase
        leading-none
        tracking-[0.06em]
        text-white/85
        sm:text-xl
      "
      aria-label={formatCount(value)}
    >
      {formattedValue.split("").map((character, index) => (
        <RollingDigit
          key={`${index}-${character}`}
          digit={Number(character)}
          delay={index * 0.08}
        />
      ))}
    </span>
  );
}
