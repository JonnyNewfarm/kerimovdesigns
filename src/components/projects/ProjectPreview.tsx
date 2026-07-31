"use client";

import { useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

import MagneticComp from "../MagneticComp";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "@/components/TransitionLink";

import type { ProjectListItem } from "./projectsTypes";
import { formatProjectTag, projectsEase } from "./projectUtils";

type ProjectPreviewProps = {
  project: ProjectListItem | null;
  hasProjects: boolean;
  activeTagsKey: string;
};

export default function ProjectPreview({
  project,
  hasProjects,
  activeTagsKey,
}: ProjectPreviewProps) {
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const imageLinkRef = useRef<HTMLAnchorElement | null>(null);

  const imageMouseX = useMotionValue(0);
  const imageMouseY = useMotionValue(0);

  const cursorX = useSpring(imageMouseX, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  const cursorY = useSpring(imageMouseY, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  const updateCursorPosition = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    imageMouseX.set(event.clientX - rect.left);
    imageMouseY.set(event.clientY - rect.top);
  };

  const handleImageMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    updateCursorPosition(event);

    if (!isHoveringImage) {
      setIsHoveringImage(true);
    }
  };

  const handleImageMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    updateCursorPosition(event);
    setIsHoveringImage(true);
  };

  const handleImageMouseLeave = () => {
    setIsHoveringImage(false);
  };

  return (
    <main
      className="
        relative
        flex
        min-h-0
        flex-col
        md:col-span-7
        xl:col-span-8
      "
    >
      <AnimatePresence initial={false} mode="wait">
        {hasProjects && project ? (
          <motion.div
            key={`project-view-${activeTagsKey || "all"}`}
            initial={{
              opacity: 0,
              x: 32,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              x: 22,
              filter: "blur(8px)",
            }}
            transition={{
              duration: 0.48,
              ease: projectsEase,
            }}
            className="
              ml-auto
              flex
              w-full
              max-w-[1080px]
              flex-col
            "
          >
            <MagneticComp>
              <TransitionLink
                ref={imageLinkRef}
                href={`/project/${project.id}`}
                transitionLabel={project.title}
                onMouseMove={handleImageMouseMove}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                className="
                  group
                  relative
                  isolate
                  z-10
                  block
                  h-[clamp(360px,56vh,640px)]
                  w-full
                  shrink-0
                  cursor-pointer
                  overflow-hidden
                "
                aria-label={`Open project ${project.title}`}
              >
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  priority
                  sizes="
                    (min-width: 1280px) 66vw,
                    (min-width: 768px) 58vw,
                    100vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.03]
                  "
                />

                <motion.div
                  aria-hidden="true"
                  style={{
                    x: cursorX,
                    y: cursorY,
                  }}
                  animate={{
                    opacity: isHoveringImage ? 1 : 0,
                    scale: isHoveringImage ? 1 : 0.35,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                    scale: {
                      duration: 0.35,
                      ease: projectsEase,
                    },
                  }}
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0
                    z-20
                    hidden
                    -translate-x-1/2
                    -translate-y-1/2
                    mix-blend-difference
                    lg:flex
                  "
                >
                  <div
                    className="
                      text-center
                      text-[7vw]
                      font-black
                      uppercase
                      leading-[0.78]
                      tracking-[-0.035em]
                      text-white
                      md:text-[5.8vw]
                      lg:text-[4.8vw]
                    "
                  >
                    View case
                  </div>
                </motion.div>
              </TransitionLink>
            </MagneticComp>

            <ProjectPreviewDetails project={project} />
          </motion.div>
        ) : (
          <EmptyProjectPreview activeTagsKey={activeTagsKey} />
        )}
      </AnimatePresence>
    </main>
  );
}

type ProjectPreviewDetailsProps = {
  project: ProjectListItem;
};

function ProjectPreviewDetails({ project }: ProjectPreviewDetailsProps) {
  return (
    <div className="mt-7 min-h-0 pt-7">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={project.id}
          initial={{
            opacity: 0,
            y: 14,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -10,
            filter: "blur(6px)",
            position: "absolute",
            width: "100%",
          }}
          transition={{
            duration: 0.22,
            ease: projectsEase,
          }}
          className="relative"
        >
          <TextReveal
            as="p"
            mode="words"
            delay={0}
            viewport={false}
            className="
              mb-3
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-white/40
              sm:text-xs
            "
          >
            Featured Project
          </TextReveal>

          <TransitionLink
            href={`/project/${project.id}`}
            transitionLabel={project.title}
            className="inline-block"
          >
            <TextReveal
              as="h2"
              mode="words"
              delay={0}
              stagger={0.012}
              duration={0.42}
              viewport={false}
              className="
                max-w-[980px]
                text-[clamp(2.8rem,4.6vw,5.8rem)]
                font-black
                uppercase
                leading-[0.88]
                tracking-[-0.035em]
                transition-opacity
                duration-300
                hover:opacity-70
              "
            >
              {project.title}
            </TextReveal>
          </TransitionLink>

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-6
              pt-6
              sm:grid-cols-3
            "
          >
            {project.tags.length > 0 ? (
              <ProjectMetadataItem label="Tags">
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="
                        text-sm
                        uppercase
                        tracking-[0.12em]
                        text-white/75
                      "
                    >
                      {formatProjectTag(tag)}
                    </span>
                  ))}
                </div>
              </ProjectMetadataItem>
            ) : null}

            {project.type ? (
              <ProjectMetadataItem label="Year">
                <p
                  className="
                    text-sm
                    uppercase
                    tracking-[0.12em]
                    text-white/75
                  "
                >
                  {project.type}
                </p>
              </ProjectMetadataItem>
            ) : null}

            {project.tools ? (
              <ProjectMetadataItem label="Tools">
                <p
                  className="
                    text-sm
                    uppercase
                    tracking-[0.12em]
                    text-white/75
                  "
                >
                  {project.tools}
                </p>
              </ProjectMetadataItem>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type ProjectMetadataItemProps = {
  label: string;
  children: React.ReactNode;
};

function ProjectMetadataItem({ label, children }: ProjectMetadataItemProps) {
  return (
    <div>
      <p
        className="
          mb-2
          text-[10px]
          font-black
          uppercase
          tracking-[0.3em]
          text-white/35
          sm:text-xs
        "
      >
        {label}
      </p>

      {children}
    </div>
  );
}

type EmptyProjectPreviewProps = {
  activeTagsKey: string;
};

function EmptyProjectPreview({ activeTagsKey }: EmptyProjectPreviewProps) {
  return (
    <motion.div
      key={`empty-preview-${activeTagsKey || "all"}`}
      initial={{
        opacity: 0,
        scale: 0.985,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.99,
        filter: "blur(8px)",
      }}
      transition={{
        duration: 0.5,
        ease: projectsEase,
      }}
      className="
        ml-auto
        flex
        min-h-[clamp(360px,56vh,640px)]
        w-full
        max-w-[1080px]
        items-center
        justify-center
        border
        border-white/[0.07]
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.12,
          duration: 0.4,
          ease: projectsEase,
        }}
        className="
          flex
          flex-col
          items-center
          px-8
          text-center
        "
      >
        <span
          className="
            mb-5
            block
            h-px
            w-12
            bg-white/25
          "
        />

        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.3em]
            text-white/90
            sm:text-xs
          "
        >
          No matching work
        </p>
      </motion.div>
    </motion.div>
  );
}
