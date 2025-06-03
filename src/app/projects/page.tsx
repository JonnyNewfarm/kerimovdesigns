import { Suspense } from "react";
import { getProjectsPagnation } from "../actions";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsTableSkeleton from "@/components/ProjectsTableSkeleton";
import ProjectsTableMobile from "@/components/projects/ProjectsTableMobile";
import SmoothScroll from "@/components/SmoothScroll";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const { projects, total } = await getProjectsPagnation(currentPage, 5);

  return (
    <SmoothScroll>
      <div className="bg-dark w-full min-h-screen text-[#ecebeb] md:pt-12 border-b-[1px] border-white/50">
        {/* Desktop */}
        <div className="w-full h-screen hidden md:block">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTable projects={projects}>
              {Array.from({ length: Math.ceil(total / 5) }, (_, i) => (
                <a
                  key={i}
                  href={`?page=${i + 1}`}
                  className={`px-3 py-1 border ${
                    currentPage === i + 1 ? "text-[#ecebeb]" : "text-[#ecebeb]"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </ProjectsTable>
          </Suspense>
        </div>

        {/* Mobile */}
        <div className="w-full min-h-screen md:hidden">
          <Suspense fallback={<ProjectsTableSkeleton />}>
            <ProjectsTableMobile projects={projects}>
              {Array.from({ length: Math.ceil(total / 5) }, (_, i) => (
                <a
                  key={i}
                  href={`?page=${i + 1}`}
                  className={`px-3 py-1 border ${
                    currentPage === i + 1 ? "text-[#ecebeb]" : "text-[#ecebeb]"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </ProjectsTableMobile>
          </Suspense>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default page;
