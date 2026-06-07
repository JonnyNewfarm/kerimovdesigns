import { Suspense } from "react";
import { getProjects, getProjectsPagnation } from "../actions";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsTableSkeleton from "@/components/ProjectsTableSkeleton";
import ProjectsTableMobile from "@/components/projects/ProjectsTableMobile";
import SmoothScroll from "@/components/SmoothScroll";
import { Metadata } from "next";

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

  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 5;

  const desktopProjects = await getProjects();

  const { projects: mobileProjects, total } = await getProjectsPagnation(
    currentPage,
    itemsPerPage,
  );

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const renderPagination = () => {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
      <div className="flex items-center gap-8">
        <a
          href={prevPage ? `?page=${prevPage}` : "#"}
          aria-disabled={!prevPage}
          className={`leading-none transition-all duration-300 ${
            prevPage
              ? "text-color text-4xl hover:opacity-60"
              : "pointer-events-none text-color/20 text-2xl"
          }`}
        >
          ←
        </a>

        <a
          href={nextPage ? `?page=${nextPage}` : "#"}
          aria-disabled={!nextPage}
          className={`leading-none transition-all duration-300 ${
            nextPage
              ? "text-color text-4xl hover:opacity-60"
              : "pointer-events-none text-color/20 text-2xl"
          }`}
        >
          →
        </a>
      </div>
    );
  };

  return (
    <SmoothScroll>
      <div className="w-full bg-dark text-color">
        <div className="hidden w-full md:block">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTable projects={desktopProjects} startIndex={0} />
          </Suspense>
        </div>

        <div className="min-h-screen w-full md:hidden">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTableMobile
              projects={mobileProjects}
              startIndex={startIndex}
            >
              {renderPagination()}
            </ProjectsTableMobile>
          </Suspense>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
