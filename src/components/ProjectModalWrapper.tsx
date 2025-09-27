"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MotionImage from "./MotionImage";

export interface Project {
  id: string;
  title: string;
  src: string;
  src2?: string | null;
  src3?: string | null;
  src4?: string | null;
  src5?: string | null;
  src6?: string | null;
  src7?: string | null;
  src8?: string | null;
  src9?: string | null;
  srcVideo?: string | null;
  role?: string | null;
  type?: string | null;
  tools?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectModalWrapperProps {
  project: Project;
}

interface ModalImage {
  src: string;
  alt: string;
}

const ProjectModalWrapper = ({ project }: ProjectModalWrapperProps) => {
  const [modalImage, setModalImage] = useState<ModalImage | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleImageClick = (src: string, alt: string) => {
    setScale(1);
    setModalImage({ src, alt });
  };

  const closeModal = () => {
    setModalImage(null);
    setScale(1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

  if (!isClient) return null;

  const images = [
    project.src,
    project.src2,
    project.src3,
    project.src4,
    project.src5,
    project.src6,
    project.src7,
    project.src8,
    project.src9,
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="min-h-[70vh] sm:mt-20 mt-10  mb-20 flex flex-col gap-y-20 sm:gap-y-40 justify-center items-center">
        {images.map((src, index) => (
          <MotionImage key={index}>
            <Image
              className="cursor-pointer md:max-w-[800px]"
              src={src}
              alt={project.title || `Project Image ${index + 1}`}
              width={800}
              height={450}
              onClick={() => handleImageClick(src, `Image ${index + 1}`)}
            />
          </MotionImage>
        ))}

        {project.srcVideo && (
          <MotionImage>
            <video
              className="md:max-w-[800px]"
              autoPlay
              muted
              loop
              playsInline
              src={project.srcVideo}
            />
          </MotionImage>
        )}
      </div>

      <AnimatePresence>
        {modalImage && (
          <motion.div
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 md:top-7 left-0 w-full h-screen z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              onWheel={handleWheel}
              drag
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.2}
              initial={{ scale: 0.8 }}
              animate={{ scale }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center justify-center"
            >
              <Image
                src={modalImage.src}
                alt={modalImage.alt}
                width={1200}
                height={800}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                priority
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectModalWrapper;
