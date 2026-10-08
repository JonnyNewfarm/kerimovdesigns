import { Metadata } from "next";

import Link from "next/link";

import { redirect } from "next/navigation";

import { getProjects } from "../actions";

import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsTableMobile from "@/components/projects/ProjectsTableMobile";
import ProjectsLoadingGate from "@/components/projects/ProjectsLoadingGate";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Rustam Kerimov | Projects",

  description:
    "Explore the projects and works of Rustam Kerimov, showcasing design and creative skills.",

  icons: {
    icon: "/favicon.ico",
  },
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    page?: string;

    tag?: string;

    tags?: string;
  }>;
}

const ITEMS_PER_PAGE = 5;

const MAX_SELECTED_TAGS = 3;

/*
 * =========================================================
 * NORMALIZE TAGS
 * =========================================================
 */

const normalizeTags = ({
  tags,
  tag,
}: {
  tags?: string;

  tag?: string;
}) => {
  const rawTags = tags ?? tag;

  if (!rawTags) {
    return [];
  }

  return rawTags
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, MAX_SELECTED_TAGS);
};

/*
 * =========================================================
 * PROJECT URL
 * =========================================================
 */

const createProjectsUrl = ({
  page,
  tags,
}: {
  page?: number;

  tags?: string[];
}) => {
  const params = new URLSearchParams();

  if (tags?.length) {
    params.set("tags", tags.join(","));
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/projects?${query}` : "/projects";
};

/*
 * =========================================================
 * PAGE
 * =========================================================
 */

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  /*
   * =====================================================
   * PAGE NUMBER
   * =====================================================
   */

  const parsedPage = Number(resolvedSearchParams.page);

  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  /*
   * =====================================================
   * TAGS
   * =====================================================
   */

  const activeTags = normalizeTags({
    tags: resolvedSearchParams.tags,

    tag: resolvedSearchParams.tag,
  });

  /*
   * =====================================================
   * PROJECT DATA
   * =====================================================
   */

  const allProjects = await getProjects();

  /*
   * =====================================================
   * AVAILABLE TAGS
   * =====================================================
   */

  const availableTags = Array.from(
    new Set(
      allProjects.flatMap((project) =>
        Array.isArray(project.tags) ? project.tags : [],
      ),
    ),
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  /*
   * =====================================================
   * FILTER PROJECTS
   * =====================================================
   *
   * Denne server-side filtreringen brukes fortsatt
   * av MOBIL-versjonen.
   *
   * Desktop får allProjects og filtrerer client-side
   * slik at Framer Motion kan animere gridet smooth.
   */

  const filteredProjects =
    activeTags.length === 0
      ? allProjects
      : allProjects.filter((project) => {
          const projectTags = Array.isArray(project.tags) ? project.tags : [];

          return activeTags.every((activeTag) =>
            projectTags.includes(activeTag),
          );
        });

  /*
   * =====================================================
   * MOBILE PAGINATION
   * =====================================================
   */

  const total = filteredProjects.length;

  const totalPages = Math.max(Math.ceil(total / ITEMS_PER_PAGE), 1);

  /*
   * Redirect invalid pages.
   */

  if (total > 0 && currentPage > totalPages) {
    redirect(
      createProjectsUrl({
        page: totalPages,

        tags: activeTags,
      }),
    );
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const mobileProjects = filteredProjects.slice(startIndex, endIndex);

  /*
   * =====================================================
   * MOBILE PREV / NEXT
   * =====================================================
   */

  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  /*
   * =====================================================
   * INITIAL LOADER ASSETS
   * =====================================================
   *
   * DESKTOP:
   *
   * Hele desktop-gridet finnes samtidig.
   * Derfor preloader vi ALLE prosjektbilder før
   * ProjectsLoadingGate avslutter.
   *
   * Når gridet mountes er Three-texturene allerede
   * varme i cache.
   *
   *
   * MOBILE:
   *
   * Beholder samme oppførsel som før.
   * Kun bildene på nåværende paginerte side lastes.
   */

  const desktopSrcs = allProjects
    .map((project) => project.src)
    .filter((src): src is string => Boolean(src));

  const mobileSrcs = mobileProjects
    .map((project) => project.src)
    .filter((src): src is string => Boolean(src));

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <ProjectsLoadingGate desktopSrcs={desktopSrcs} mobileSrcs={mobileSrcs}>
      <SmoothScroll>
        <main
          className="
            w-full
            bg-dark
            text-color
          "
        >
          {/* =============================================
              DESKTOP
          ============================================= */}

          <div
            className="
              hidden
              w-full
              lg:block
            "
          >
            <ProjectsTable
              /*
               * VIKTIG:
               *
               * Desktop får ALLE prosjekter.
               *
               * ProjectsTable filtrerer selv client-side
               * for å beholde smooth layout-animation.
               */
              projects={allProjects}
              startIndex={0}
              availableTags={availableTags}
              activeTags={activeTags}
            />
          </div>

          {/* =============================================
              MOBILE
          ============================================= */}

          <div
            className="
              min-h-screen
              w-full
              lg:hidden
            "
          >
            <ProjectsTableMobile
              projects={mobileProjects}
              startIndex={startIndex}
              availableTags={availableTags}
              activeTags={activeTags}
            >
              <div
                className="
                  flex
                  w-full
                  flex-row-reverse
                  items-center
                  justify-between
                  pt-6
                "
              >
                {/* =======================================
                    PAGE NUMBER
                ======================================= */}

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-white/50
                  "
                >
                  {String(currentPage).padStart(2, "0")} /{" "}
                  {String(totalPages).padStart(2, "0")}
                </p>

                {/* =======================================
                    ARROWS
                ======================================= */}

                <div
                  className="
                    flex
                    items-center
                    gap-6
                  "
                >
                  {/* PREVIOUS */}

                  {prevPage ? (
                    <Link
                      href={createProjectsUrl({
                        page: prevPage,

                        tags: activeTags,
                      })}
                      prefetch
                      aria-label="Previous projects"
                      className="
                        flex
                        min-h-12
                        min-w-12
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <PaginationArrow direction="prev" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="
                        flex
                        min-h-12
                        min-w-12
                        items-center
                        justify-center
                        text-white/20
                      "
                    >
                      <PaginationArrow direction="prev" />
                    </span>
                  )}

                  {/* NEXT */}

                  {nextPage ? (
                    <Link
                      href={createProjectsUrl({
                        page: nextPage,

                        tags: activeTags,
                      })}
                      prefetch
                      aria-label="Next projects"
                      className="
                        flex
                        min-h-12
                        min-w-12
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <PaginationArrow direction="next" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="
                        flex
                        min-h-12
                        min-w-12
                        items-center
                        justify-center
                        text-white/20
                      "
                    >
                      <PaginationArrow direction="next" />
                    </span>
                  )}
                </div>
              </div>
            </ProjectsTableMobile>
          </div>
        </main>
      </SmoothScroll>
    </ProjectsLoadingGate>
  );
};

export default Page;

/*
 * =========================================================
 * PAGINATION ARROW
 * =========================================================
 */

const PaginationArrow = ({ direction }: { direction: "prev" | "next" }) => {
  const isPrev = direction === "prev";

  return (
    <svg
      viewBox="0 0 48 24"
      className="
        h-8
        w-16
        fill-none
        stroke-current
      "
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {isPrev ? (
        <>
          <path d="M44 12H14" />

          <path d="M14 12L24 20" />
        </>
      ) : (
        <>
          <path d="M4 12H34" />

          <path d="M34 12L24 4" />
        </>
      )}
    </svg>
  );
};
