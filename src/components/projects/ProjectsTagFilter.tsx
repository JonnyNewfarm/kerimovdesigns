"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface ProjectsTagFilterProps {
  availableTags?: string[];
  activeTags?: string[];
}

const MAX_SELECTED_TAGS = 3;
const VISIBLE_TAGS_COUNT = 3;

const ease = [0.22, 1, 0.36, 1] as const;

const formatTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};

const ProjectsTagFilter = ({
  availableTags = [],
  activeTags = [],
}: ProjectsTagFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(activeTags);

  useEffect(() => {
    setSelectedTags(activeTags);
  }, [activeTags]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const visibleTags = useMemo(() => {
    const firstVisibleTags = availableTags.slice(0, VISIBLE_TAGS_COUNT);

    const selectedTagsOutsideVisibleTags = selectedTags.filter(
      (tag) => !firstVisibleTags.includes(tag),
    );

    return [...selectedTagsOutsideVisibleTags, ...firstVisibleTags]
      .filter((tag, index, tags) => tags.indexOf(tag) === index)
      .slice(0, VISIBLE_TAGS_COUNT);
  }, [availableTags, selectedTags]);

  const updateUrl = (nextTags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");
    params.delete("tag");
    params.delete("tags");

    if (nextTags.length > 0) {
      params.set("tags", nextTags.join(","));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);

    if (!isSelected && selectedTags.length >= MAX_SELECTED_TAGS) {
      return;
    }

    const nextTags = isSelected
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    setSelectedTags(nextTags);
    updateUrl(nextTags);
  };

  const clearTags = () => {
    setSelectedTags([]);
    updateUrl([]);
  };

  return (
    <div ref={containerRef} className="relative z-20 w-full md:z-[200]">
      {" "}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={clearTags}
          aria-pressed={selectedTags.length === 0}
          className={`relative text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 sm:text-xs ${
            selectedTags.length === 0
              ? "text-white"
              : "text-white/35 hover:text-white"
          }`}
        >
          All projects
          {selectedTags.length === 0 ? (
            <span className="absolute -bottom-1 left-0 h-px w-full bg-white" />
          ) : null}
        </button>

        {visibleTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          const isDisabled =
            !isSelected && selectedTags.length >= MAX_SELECTED_TAGS;

          return (
            <div key={tag} className="relative  inline-flex items-center">
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                className={`relative text-[10px] cursor-pointer font-black uppercase tracking-[0.2em] transition-colors duration-300 sm:text-xs ${
                  isSelected
                    ? "pr-3 text-white"
                    : isDisabled
                      ? "cursor-not-allowed text-white/15"
                      : "text-white/35 hover:text-white"
                }`}
              >
                {formatTag(tag)}
              </button>

              {isSelected && (
                <motion.button
                  type="button"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    toggleTag(tag);
                  }}
                  aria-label={`Remove ${formatTag(tag)} filter`}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    rotate: -90,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 90,
                  }}
                  whileTap={{
                    scale: 0.8,
                  }}
                  className="absolute -right-1.5 cursor-pointer -top-2 flex h-4 w-4 items-center justify-center text-white"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3 fill-none stroke-current"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3L13 13" />
                    <path d="M13 3L3 13" />
                  </svg>
                </motion.button>
              )}
            </div>
          );
        })}

        {availableTags.length > VISIBLE_TAGS_COUNT ? (
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="all-project-tags"
            className="group inline-flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/55 transition-colors duration-300 hover:text-white sm:text-xs"
          >
            <span>View all tags</span>

            <motion.span
              animate={{
                rotate: isOpen ? 45 : 0,
              }}
              transition={{
                duration: 0.35,
                ease,
              }}
              className="relative h-3 w-3 shrink-0"
              aria-hidden="true"
            >
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
            </motion.span>
          </button>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="all-project-tags"
            initial={{
              opacity: 0,
              y: -10,
              clipPath: "inset(0 0 100% 0)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: "linear",
              },
            }}
            transition={{
              duration: 0.5,
              ease,
            }}
            className="absolute left-0 top-[calc(100%+18px)] z-30 w-[calc(100vw-3rem)] max-w-[560px] overflow-hidden border-x border-b border-white/15 bg-dark shadow-[0_28px_90px_rgba(0,0,0,0.6)] md:z-[300] md:w-full"
          >
            <svg
              viewBox="0 0 1000 36"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-0 top-0 h-9 w-full"
              aria-hidden="true"
            >
              <motion.path
                initial={{
                  d: "M0 1 Q500 1 1000 1",
                }}
                animate={{
                  d: [
                    "M0 1 Q500 1 1000 1",
                    "M0 1 Q500 30 1000 1",
                    "M0 1 Q500 1 1000 1",
                  ],
                }}
                transition={{
                  duration: 0.7,
                  times: [0, 0.48, 1],
                  ease,
                }}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="flex items-center justify-between border-b border-white/10 px-5 pb-4 pt-7">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/70">
                Select up to three tags
              </p>

              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70">
                {String(selectedTags.length).padStart(2, "0")} /{" "}
                {String(MAX_SELECTED_TAGS).padStart(2, "0")}
              </p>
            </div>

            <div className="max-h-[300px] overflow-y-auto overscroll-contain px-4 py-5 sm:px-5 sm:py-6">
              <div className="grid grid-cols-1 gap-x-5 min-[390px]:grid-cols-2">
                {availableTags.map((tag, index) => {
                  const isSelected = selectedTags.includes(tag);

                  const isDisabled =
                    !isSelected && selectedTags.length >= MAX_SELECTED_TAGS;

                  return (
                    <motion.button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: Math.min(index, 12) * 0.025,
                        duration: 0.35,
                        ease,
                      }}
                      className={`group flex min-w-0 items-center gap-3 text-left ${
                        isDisabled ? "cursor-not-allowed" : ""
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300 ${
                          isSelected
                            ? "border-white bg-white"
                            : isDisabled
                              ? "border-white/10"
                              : "border-white/25 group-hover:border-white"
                        }`}
                      >
                        {isSelected ? (
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3 w-3 fill-none stroke-black"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 8.5L6.5 12L13 4.5" />
                          </svg>
                        ) : null}
                      </span>

                      <span
                        className={`truncate py-2 text-[12px] font-black uppercase tracking-[0.18em] transition-colors duration-300 sm:text-md ${
                          isSelected
                            ? "text-white"
                            : isDisabled
                              ? "text-white/40"
                              : "text-white/70 group-hover:text-white"
                        }`}
                      >
                        {formatTag(tag)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={clearTags}
                disabled={selectedTags.length === 0}
                className="text-[9px] font-black cursor-pointer uppercase tracking-[0.25em] text-white/70 transition-colors duration-300 hover:text-white disabled:cursor-not-allowed disabled:text-white/15"
              >
                Clear selection
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[9px] font-black cursor-pointer uppercase tracking-[0.25em] text-white transition-opacity duration-300 hover:opacity-60"
              >
                Done
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsTagFilter;
