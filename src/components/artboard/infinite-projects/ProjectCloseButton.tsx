"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ActivePlane } from "./types";

export default function ProjectCloseButton({
  selected,
  closing,
  onClose,
}: {
  selected: ActivePlane | null;
  closing: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {selected && !closing && (
        <motion.button
          key="close"
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="absolute right-[4%] top-24 z-30 cursor-pointer bg-transparent p-0 text-xs font-bold uppercase tracking-[0.06em] text-[#e7e3dd] md:top-28"
        >
          CLOSE
        </motion.button>
      )}
    </AnimatePresence>
  );
}
