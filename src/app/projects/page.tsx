import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProjects } from "../actions";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsTableMobile from "@/components/projects/ProjectsTableMobile";
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

const normalizeTags = ({ tags, tag }: { tags?: string; tag?: string }) => {
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

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const parsedPage = Number(resolvedSearchParams.page);

  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const activeTags = normalizeTags({
    tags: resolvedSearchParams.tags,
    tag: resolvedSearchParams.tag,
  });

  const allProjects = await getProjects();

  const availableTags = Array.from(
    new Set(
      allProjects.flatMap((project) =>
        Array.isArray(project.tags) ? project.tags : [],
      ),
    ),
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const filteredProjects =
    activeTags.length === 0
      ? allProjects
      : allProjects.filter((project) => {
          const projectTags = Array.isArray(project.tags) ? project.tags : [];

          return activeTags.every((activeTag) =>
            projectTags.includes(activeTag),
          );
        });

  const total = filteredProjects.length;

  const totalPages = Math.max(Math.ceil(total / ITEMS_PER_PAGE), 1);

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

  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <SmoothScroll>
      <main className="w-full bg-dark text-color">
        <div className="hidden w-full lg:block">
          <ProjectsTable
            projects={filteredProjects}
            startIndex={0}
            availableTags={availableTags}
            activeTags={activeTags}
          />
        </div>

        <div className="min-h-screen w-full lg:hidden">
          <ProjectsTableMobile
            projects={mobileProjects}
            startIndex={startIndex}
            availableTags={availableTags}
            activeTags={activeTags}
          >
            <div className="flex w-full flex-row-reverse items-center justify-between pt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                {String(currentPage).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </p>

              <div className="flex items-center gap-6">
                {prevPage ? (
                  <Link
                    href={createProjectsUrl({
                      page: prevPage,
                      tags: activeTags,
                    })}
                    prefetch
                    aria-label="Previous projects"
                    className="flex min-h-12 min-w-12 items-center justify-center text-white"
                  >
                    <PaginationArrow direction="prev" />
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex min-h-12 min-w-12 items-center justify-center text-white/20"
                  >
                    <PaginationArrow direction="prev" />
                  </span>
                )}

                {nextPage ? (
                  <Link
                    href={createProjectsUrl({
                      page: nextPage,
                      tags: activeTags,
                    })}
                    prefetch
                    aria-label="Next projects"
                    className="flex min-h-12 min-w-12 items-center justify-center text-white"
                  >
                    <PaginationArrow direction="next" />
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex min-h-12 min-w-12 items-center justify-center text-white/20"
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
  );
};

export default Page;

const PaginationArrow = ({ direction }: { direction: "prev" | "next" }) => {
  const isPrev = direction === "prev";

  return (
    <svg
      viewBox="0 0 48 24"
      className="h-8 w-16 fill-none stroke-current"
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
