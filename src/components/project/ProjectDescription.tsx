import { useState } from "react";
import { motion } from "framer-motion";

import { projectEase, projectLayoutEase } from "./projectAnimations";

type ProjectDescriptionProps = {
  title: string;
  description?: string | null;
};

export default function ProjectDescription({
  title,
  description,
}: ProjectDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) {
    return null;
  }

  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const previewText = paragraphs[0] || description;

  const textToShow = isExpanded ? description : previewText;

  const hasMoreText =
    paragraphs.length > 1 || description.length > previewText.length;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.85,
        ease: projectEase,
      }}
      className="
        mt-14
        w-full
        
        py-10
        sm:mt-20
        sm:px-8
        sm:py-16
        lg:mt-28
        lg:px-0
      "
      aria-labelledby="project-description-title"
    >
      <div
        className="
          ml-auto
          w-full
          max-w-[920px]
          pr-4
          sm:pr-8
          lg:pr-16
          xl:pr-20
        "
      >
        <h2 id="project-description-title" className="sr-only">
          {title} project description
        </h2>

        <motion.div
          layout
          id="project-description-content"
          transition={{
            layout: {
              duration: 0.75,
              ease: projectLayoutEase,
            },
          }}
          className="
            overflow-hidden
            whitespace-pre-line
            text-base
            font-black
            italic
            leading-8
            tracking-[0.06em]
            text-white/85
            sm:text-lg
            sm:leading-9
            md:text-2xl
            md:leading-10
          "
        >
          {textToShow}
        </motion.div>

        {hasMoreText ? (
          <button
            type="button"
            onClick={() => {
              setIsExpanded((previous) => !previous);
            }}
            aria-expanded={isExpanded}
            aria-controls="project-description-content"
            className="
              mt-8
              inline-flex
              cursor-pointer
              items-center
              gap-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.32em]
              text-white/55
              transition-opacity
              duration-300
              hover:opacity-100
              sm:text-xs
            "
          >
            <span>{isExpanded ? "Show less" : "Read more"}</span>

            <span
              className={`
                inline-flex
                origin-center
                transition-transform
                duration-500
                ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isExpanded ? "rotate-90" : "-rotate-90"}
              `}
              aria-hidden="true"
            >
              <svg
                width="30"
                height="18"
                viewBox="0 0 30 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="
                  h-[14px]
                  w-[24px]
                  sm:h-[16px]
                  sm:w-[28px]
                "
              >
                <path
                  d="M4 14H26"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />

                <path
                  d="M4 14L11 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </button>
        ) : null}
      </div>
    </motion.section>
  );
}
