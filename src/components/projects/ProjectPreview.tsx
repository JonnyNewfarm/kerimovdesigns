"use client";

import { useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";

import TextReveal from "@/components/TextReveal";
import TransitionLink from "@/components/TransitionLink";

import ProjectPreviewThreeImage from "./ProjectPreviewThreeImage";

import type { ProjectListItem } from "./projectsTypes";

import { formatProjectTag, projectsEase } from "./projectUtils";

type ProjectPreviewProps = {
  project: ProjectListItem | null;
  hasProjects: boolean;
  activeTagsKey: string;
};

const imageRevealEase = [0.22, 1, 0.36, 1] as const;

export default function ProjectPreview({
  project,
  hasProjects,
  activeTagsKey,
}: ProjectPreviewProps) {
  const imageLinkRef = useRef<HTMLAnchorElement | null>(null);

  return (
    <main
      className="
        relative
        flex
        min-h-0
        min-w-0
        flex-col
      "
    >
      <AnimatePresence mode="wait">
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
              max-w-[1040px]
              flex-col
            "
          >
            {/*
             * =================================================
             * THREE PREVIEW
             * =================================================
             */}

            <TransitionLink
              ref={imageLinkRef}
              href={`/project/${project.id}`}
              transitionLabel={project.title}
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
                overflow-visible
              "
              aria-label={`Open project ${project.title}`}
            >
              <motion.div
                key={`preview-image-${project.id}`}
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 1.25,
                  ease: imageRevealEase,
                }}
                className="
                  absolute
                  inset-0
                  overflow-visible
                "
              >
                <ProjectPreviewThreeImage
                  src={project.src}
                  anchorRef={imageLinkRef}
                  hoverColor={project.hoverText}
                />
              </motion.div>
            </TransitionLink>

            <ProjectPreviewDetails project={project} />
          </motion.div>
        ) : (
          <EmptyProjectPreview activeTagsKey={activeTagsKey} />
        )}
      </AnimatePresence>
    </main>
  );
}

/*
 * =========================================================
 * DETAILS
 * =========================================================
 */

type ProjectPreviewDetailsProps = {
  project: ProjectListItem;
};

function ProjectPreviewDetails({ project }: ProjectPreviewDetailsProps) {
  return (
    <div
      className="
        mt-5
        min-h-0
        pt-5
      "
    >
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
          className="
            relative
          "
        >
          <TextReveal
            as="p"
            mode="words"
            delay={0.05}
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
            className="
              inline-block
              max-w-full
            "
          >
            <TextReveal
              as="h2"
              mode="words"
              delay={0.06}
              duration={0.6}
              viewport={false}
              className="
                max-w-[980px]
                text-[clamp(2.6rem,4vw,5rem)]
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
                <div
                  className="
                    flex
                    flex-wrap
                    gap-x-3
                    gap-y-2
                  "
                >
                  {project.tags.map((tag, index) => (
                    <TextReveal
                      key={tag}
                      as="span"
                      viewport={false}
                      delay={0.06 + index * 0.025}
                      duration={0.6}
                      className="
                        text-sm
                        uppercase
                        tracking-[0.12em]
                        text-white/75
                      "
                    >
                      {formatProjectTag(tag)}
                    </TextReveal>
                  ))}
                </div>
              </ProjectMetadataItem>
            ) : null}

            {project.type ? (
              <ProjectMetadataItem label="Year">
                <TextReveal
                  as="p"
                  viewport={false}
                  delay={0.1}
                  duration={0.6}
                  className="
                    text-sm
                    uppercase
                    tracking-[0.12em]
                    text-white/75
                  "
                >
                  {project.type}
                </TextReveal>
              </ProjectMetadataItem>
            ) : null}

            {project.tools ? (
              <ProjectMetadataItem label="Tools">
                <TextReveal
                  as="p"
                  viewport={false}
                  delay={0.12}
                  duration={0.6}
                  className="
                    text-sm
                    uppercase
                    tracking-[0.12em]
                    text-white/75
                  "
                >
                  {project.tools}
                </TextReveal>
              </ProjectMetadataItem>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/*
 * =========================================================
 * METADATA
 * =========================================================
 */

type ProjectMetadataItemProps = {
  label: string;
  children: React.ReactNode;
};

function ProjectMetadataItem({ label, children }: ProjectMetadataItemProps) {
  return (
    <div>
      <TextReveal
        as="p"
        viewport={false}
        delay={0.06}
        duration={0.6}
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
      </TextReveal>

      <div>{children}</div>
    </div>
  );
}

/*
 * =========================================================
 * EMPTY
 * =========================================================
 */

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
        max-w-[1040px]
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
