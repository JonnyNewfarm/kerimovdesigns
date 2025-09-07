import { Suspense } from "react";
import { getProjectsPagnation } from "../actions";
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

  const { projects, total } = await getProjectsPagnation(
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(total / itemsPerPage);

  const renderPagination = () => {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
      <div className="flex items-center gap-2 mt-4">
        {prevPage && (
          <a
            href={`?page=${prevPage}`}
            className="px-3 py-1 bg-color/10 rounded text-color"
          >
            Previous
          </a>
        )}

        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i}
            href={`?page=${i + 1}`}
            className={`px-3 py-1 ${
              currentPage === i + 1 ? "font-bold text-color" : "text-color/60"
            }`}
          >
            {i + 1}
          </a>
        ))}

        {nextPage && (
          <a
            href={`?page=${nextPage}`}
            className="px-3 py-1 bg-color/10 rounded text-color"
          >
            Next
          </a>
        )}
      </div>
    );
  };

  return (
    <SmoothScroll>
      <div className="bg-dark w-full min-h-screen text-color md:pt-12 border-b-[1px] border-white/50">
        <div className="w-full hidden md:block h-screen">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTable projects={projects}>
              {renderPagination()}
            </ProjectsTable>
          </Suspense>
        </div>

        {/* Mobile Table */}
        <div className="w-full md:hidden min-h-screen">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTableMobile projects={projects}>
              {renderPagination()}
            </ProjectsTableMobile>
          </Suspense>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
