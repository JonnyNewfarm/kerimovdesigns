"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MotionImage from "./MotionImage";

export interface Project {
  id: string;
  title: string;
  src: string;
  src2?: string | null;
  src3?: string | null;
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
    setModalImage({ src, alt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (!isClient) return null;

  return (
    <>
      <div className="min-h-screen  sm:mt-20 mt-14 justify-center items-center flex  flex-col gap-y-26 sm:gap-y-40">
        {project.src && (
          <MotionImage>
            <Image
              className="cursor-pointer md:max-w-[800px]"
              src={project.src}
              alt={project.title || "Project Image"}
              width={800}
              height={450}
              onClick={() => handleImageClick(project.src!, "Image 1")}
            />
          </MotionImage>
        )}

        {project.src2 && (
          <MotionImage>
            <Image
              className="cursor-pointer md:max-w-[800px]"
              src={project.src2}
              alt={project.title || "Project Image 2"}
              width={800}
              height={450}
              onClick={() => handleImageClick(project.src2!, "Image 2")}
            />
          </MotionImage>
        )}

        {project.src3 && (
          <MotionImage>
            <Image
              className="cursor-pointer md:max-w-[800px]"
              src={project.src3}
              alt={project.title || "Project Image 3"}
              width={800}
              height={450}
              onClick={() => handleImageClick(project.src3!, "Image 3")}
            />
          </MotionImage>
        )}

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

      {modalImage && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <Image
            src={modalImage.src}
            alt={modalImage.alt}
            width={1200}
            height={800}
            className="max-w-[90%] max-h-[90%] object-contain"
            priority
            unoptimized
          />
        </div>
      )}
    </>
  );
};

export default ProjectModalWrapper;
