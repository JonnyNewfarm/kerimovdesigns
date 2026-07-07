import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProjects, getProjectsPagination } from "../actions";
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
  }>;
}

const ITEMS_PER_PAGE = 5;

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const parsedPage = Number(resolvedSearchParams.page);

  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const [desktopProjects, mobilePagination] = await Promise.all([
    getProjects(),
    getProjectsPagination(currentPage, ITEMS_PER_PAGE),
  ]);

  const { projects: mobileProjects, total } = mobilePagination;

  const totalPages = Math.max(Math.ceil(total / ITEMS_PER_PAGE), 1);

  if (total > 0 && currentPage > totalPages) {
    redirect(`/projects?page=${totalPages}`);
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <SmoothScroll>
      <main className="w-full bg-dark text-color">
        <div className="hidden w-full md:block">
          <ProjectsTable projects={desktopProjects} startIndex={0} />
        </div>

        <div className="min-h-screen w-full md:hidden">
          <ProjectsTableMobile
            projects={mobileProjects}
            startIndex={startIndex}
          >
            <div className=" flex flex-row-reverse w-full items-center justify-between pt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                {String(currentPage).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </p>

              <div className="flex items-center gap-6">
                {prevPage ? (
                  <Link
                    href={`/projects?page=${prevPage}`}
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
                    href={`/projects?page=${nextPage}`}
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
          {/* Linje mot venstre */}
          <path d="M44 12H14" />

          {/* Utstikker ned */}
          <path d="M14 12L24 20" />
        </>
      ) : (
        <>
          {/* Linje mot høyre */}
          <path d="M4 12H34" />

          {/* Utstikker opp */}
          <path d="M34 12L24 4" />
        </>
      )}
    </svg>
  );
};
