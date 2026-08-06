import Link from "next/link";
import { motion } from "framer-motion";

import TextReveal from "../TextReveal";

import { fieldVariants } from "./projectAnimations";
import { formatProjectTag } from "./projectUtils";

type ProjectMetadataProps = {
  tags: string[];
  year?: string | null;
  tools?: string | null;
};

export default function ProjectMetadata({
  tags,
  year,
  tools,
}: ProjectMetadataProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.28,
            staggerChildren: 0.08,
          },
        },
      }}
      className="
        mt-4
        grid
        grid-cols-1
        gap-6
        border-t
        border-[#ecebeb]/20
        pt-6
        sm:flex
        sm:flex-row
        sm:justify-start
        sm:gap-x-30
        md:gap-x-50
        
      "
    >
      <motion.div variants={fieldVariants}>
        <TextReveal
          as="p"
          mode="words"
          className="
            mb-3
            text-[10px]
            uppercase
            tracking-[0.22em]
            text-white/45
            sm:text-xs
          "
        >
          Tags
        </TextReveal>

        <div
          className="
            grid
            max-w-90
            grid-cols-1
            gap-x-8
            gap-y-2
            text-sm
            uppercase
            text-white/85
            sm:text-base
            lg:grid-cols-2
          "
        >
          {tags.length > 0
            ? tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/projects?tags=${encodeURIComponent(tag)}`}
                  className="
                    group
                    relative
                    w-fit
                    whitespace-nowrap
                  "
                >
                  <p>{formatProjectTag(tag)}</p>

                  <span
                    className="
                      pointer-events-none
                      absolute
                      bottom-1
                      left-0
                      h-px
                      w-full
                      overflow-hidden
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-0
                        origin-right
                        scale-x-100
                        bg-current
                        transition-transform
                        duration-500
                        ease-[cubic-bezier(0.76,0,0.24,1)]
                        group-hover:scale-x-0
                      "
                    />

                    <span
                      className="
                        absolute
                        inset-0
                        origin-left
                        scale-x-0
                        bg-current
                        transition-transform
                        duration-500
                        delay-0
                        ease-[cubic-bezier(0.76,0,0.24,1)]
                        group-hover:scale-x-100
                        group-hover:delay-[180ms]
                      "
                    />
                  </span>
                </Link>
              ))
            : "—"}
        </div>
      </motion.div>
      <div className="flex flex-col gap-y-4 sm:flex-row gap-x-16">
        <motion.div variants={fieldVariants}>
          <TextReveal
            as="p"
            mode="words"
            className="
            mb-2
            text-[10px]
            uppercase
            tracking-[0.22em]
            text-white/45
            sm:text-xs
          "
          >
            Year
          </TextReveal>

          <p
            className="
            text-sm
            leading-relaxed
            text-white/85
            sm:text-base
          "
          >
            {year || "—"}
          </p>
        </motion.div>

        <motion.div variants={fieldVariants}>
          <TextReveal
            as="p"
            mode="words"
            className="
            mb-2
            text-[10px]
            uppercase
            tracking-[0.22em]
            text-white/45
            sm:text-xs
          "
          >
            Tools
          </TextReveal>

          <p
            className="
            text-sm
            leading-relaxed
            text-white/85
            sm:text-base
          "
          >
            {tools || "—"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
