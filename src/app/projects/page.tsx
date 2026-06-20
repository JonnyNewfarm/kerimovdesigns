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
            <div className="mt-10 flex w-full items-center justify-between pt-6">
              <Link
                href={prevPage ? `/projects?page=${prevPage}` : "#"}
                aria-disabled={!prevPage}
                tabIndex={prevPage ? 0 : -1}
                prefetch={!!prevPage}
                className={`group flex min-h-12 min-w-12 items-center justify-center border border-color/25 px-4 text-sm uppercase tracking-[0.18em] transition-all duration-300 ${
                  prevPage
                    ? "font-black text-color"
                    : "pointer-events-none border-color/10 text-color/20"
                }`}
              >
                <span className="mr-2 text-xl leading-none transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Prev
              </Link>

              <div className="flex flex-col items-center leading-none">
                <span className="mt-2 text-sm tracking-[0.18em] text-color">
                  {String(currentPage).padStart(2, "0")} /{" "}
                  {String(totalPages).padStart(2, "0")}
                </span>
              </div>

              <Link
                href={nextPage ? `/projects?page=${nextPage}` : "#"}
                aria-disabled={!nextPage}
                tabIndex={nextPage ? 0 : -1}
                prefetch={!!nextPage}
                className={`group flex min-h-12 min-w-12 items-center justify-center border border-color/25 px-4 text-sm uppercase tracking-[0.18em] transition-all duration-300 ${
                  nextPage
                    ? "font-black text-color"
                    : "pointer-events-none border-color/10 text-color/20"
                }`}
              >
                Next
                <span className="ml-2 text-xl leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </ProjectsTableMobile>
        </div>
      </main>
    </SmoothScroll>
  );
};

export default Page;
