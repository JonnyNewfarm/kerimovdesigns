import { motion } from "framer-motion";

import { projectsEase } from "./projectUtils";

type ProjectsPaginationProps = {
  pageIndex: number;
  totalPages: number;
  hasProjects: boolean;
  canGoPrevPage: boolean;
  canGoNextPage: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export default function ProjectsPagination({
  pageIndex,
  totalPages,
  hasProjects,
  canGoPrevPage,
  canGoNextPage,
  onPrevPage,
  onNextPage,
}: ProjectsPaginationProps) {
  return (
    <motion.div
      animate={{
        opacity: hasProjects ? 1 : 0,
        y: hasProjects ? 0 : 10,
      }}
      transition={{
        duration: 0.3,
        ease: projectsEase,
      }}
      aria-hidden={!hasProjects}
      className={`
        mt-6
        flex
        shrink-0
        items-center
        justify-between
        pt-5
        ${hasProjects ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      <div
        className="
          flex
          w-full
          flex-col
          items-center
          justify-between
          pr-5
          2xl:flex-row
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-white/50
            sm:text-xs
          "
        >
          {String(pageIndex + 1).padStart(2, "0")} /{" "}
          {String(totalPages).padStart(2, "0")}
        </p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={!canGoPrevPage}
            aria-label="Previous projects"
            className={`
              group
              inline-flex
              items-center
              gap-3
              text-[12px]
              font-black
              uppercase
              tracking-[0.25em]
              transition-opacity
              duration-300
              sm:text-md
              xl:text-lg
              2xl:text-xl
              ${
                canGoPrevPage
                  ? "cursor-pointer text-white hover:opacity-70"
                  : "cursor-not-allowed text-white/20 opacity-90"
              }
            `}
          >
            <PaginationTextArrow direction="prev" />

            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={onNextPage}
            disabled={!canGoNextPage}
            aria-label="Next projects"
            className={`
              group
              inline-flex
              items-center
              gap-3
              text-[12px]
              font-black
              uppercase
              tracking-[0.25em]
              transition-opacity
              duration-300
              sm:text-md
              xl:text-xl
              2xl:text-xl
              ${
                canGoNextPage
                  ? "cursor-pointer text-white hover:opacity-70"
                  : "cursor-not-allowed text-white/20 opacity-90"
              }
            `}
          >
            <span>Next</span>

            <PaginationTextArrow direction="next" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

type PaginationTextArrowProps = {
  direction: "prev" | "next";
};

function PaginationTextArrow({ direction }: PaginationTextArrowProps) {
  const isPrev = direction === "prev";

  return (
    <span
      className={`pagination-text-arrow ${isPrev ? "is-prev" : "is-next"}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 24">
        {isPrev ? (
          <>
            <path d="M44 12H14" />

            <path className="pagination-text-arrow-wing" d="M14 12L24 4" />
          </>
        ) : (
          <>
            <path d="M4 12H34" />

            <path className="pagination-text-arrow-wing" d="M34 12L24 4" />
          </>
        )}
      </svg>
    </span>
  );
}
