import { Suspense } from "react";
import { getProjectsPagination } from "../actions";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsTableSkeleton from "@/components/ProjectsTableSkeleton";
import ProjectsTableMobile from "@/components/projects/ProjectsTableMobile";
import SmoothScroll from "@/components/SmoothScroll";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rustam Kerimov | Projects",
  description:
    "Explore the projects and works of Rustam Kerimov, showcasing design and creative skills.",
  icons: {
    icon: "/favicon.ico",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const currentPage = Math.max(
    parseInt(resolvedSearchParams.page || "1", 10) || 1,
    1,
  );

  const itemsPerPage = 5;

  const { projects, total } = await getProjectsPagination(
    currentPage,
    itemsPerPage,
  );

  const totalPages = Math.max(Math.ceil(total / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <SmoothScroll>
      <div className="w-full bg-dark text-color">
        <div className="hidden w-full md:block">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTable projects={projects} startIndex={startIndex} />
          </Suspense>
        </div>

        <div className="min-h-screen w-full md:hidden">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTableMobile projects={projects} startIndex={startIndex}>
              <div className="mt-10 flex w-full items-center justify-between pt-6">
                <Link
                  href={prevPage ? `/projects?page=${prevPage}` : "#"}
                  aria-disabled={!prevPage}
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
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <Link
                  href={nextPage ? `/projects?page=${nextPage}` : "#"}
                  aria-disabled={!nextPage}
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
          </Suspense>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
