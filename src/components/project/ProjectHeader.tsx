import { motion } from "framer-motion";

import TextReveal from "../TextReveal";

import ProjectMetadata from "./ProjectMetadata";
import RollingCount from "./RollingCount";
import { projectEase } from "./projectAnimations";
import { getTitleLines } from "./projectUtils";

type ProjectHeaderProps = {
  title: string;
  imageCount: number;
  videoCount: number;
  tags: string[];
  year?: string | null;
  tools?: string | null;
};

export default function ProjectHeader({
  title,
  imageCount,
  videoCount,
  tags,
  year,
  tools,
}: ProjectHeaderProps) {
  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1600px]
        px-7
        pt-[24vh]
        sm:px-14
      "
    >
      <div className="max-w-[1200px]">
        <div
          className="
            flex
            flex-col
            gap-4
            xl:flex-row
            xl:items-end
            xl:justify-between
          "
        >
          <div className="max-w-[1200px]">
            <TextReveal
              as="h1"
              mode="lines"
              delay={0.12}
              className="
                text-left
                text-5xl
                font-black
                uppercase
                leading-[0.9]
                tracking-[-0.020em]
                text-color
                sm:text-7xl
                md:text-7xl
                xl:text-[5.8rem]
              "
            >
              {getTitleLines(title)}
            </TextReveal>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
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
              delay: 0.15,
            }}
            className="
              flex
              items-center
              gap-8
              xl:justify-end
              xl:pb-4
            "
          >
            <div className="flex flex-col">
              <span
                className="
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  text-white/45
                  sm:text-xs
                "
              >
                Images
              </span>

              <RollingCount value={imageCount} />
            </div>

            <div className="flex flex-col">
              <span
                className="
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  text-white/45
                  sm:text-xs
                "
              >
                Videos
              </span>

              <RollingCount value={videoCount} />
            </div>
          </motion.div>
        </div>

        <ProjectMetadata tags={tags} year={year} tools={tools} />
      </div>
    </section>
  );
}
