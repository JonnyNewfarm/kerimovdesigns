"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionImageProps {
  children: ReactNode;
}

const MotionImage = ({ children }: MotionImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default MotionImage;
