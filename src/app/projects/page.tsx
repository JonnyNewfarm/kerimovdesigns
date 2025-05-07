import { getProjectsPagnation } from "../actions";
import ProjectsTable from "@/components/projects/ProjectsTable";
import ProjectsTableMobile from "@/components/projects/ProjectsTableMobile";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

const page = async ({ searchParams }: PageProps) => {
  const currentPage = parseInt(searchParams.page || "1");
  const { projects, total } = await getProjectsPagnation(currentPage, 5);

  return (
    <div className="bg-dark w-full min-h-screen text-[#ecebeb]">
      <div className="w-full h-screen hidden md:block">
        <ProjectsTable projects={projects}>
          {Array.from({ length: Math.ceil(total / 5) }, (_, i) => (
            <a
              key={i}
              href={`?page=${i + 1}`}
              className={`px-3 py-1 border ${
                currentPage === i + 1
                  ? "bg-[#ecebeb] text-black"
                  : "text-[#ecebeb]"
              }`}
            >
              {i + 1}
            </a>
          ))}
        </ProjectsTable>
      </div>
      <div className="w-full min-h-screen md:hidden">
        <ProjectsTableMobile projects={projects}>
          {Array.from({ length: Math.ceil(total / 5) }, (_, i) => (
            <a
              key={i}
              href={`?page=${i + 1}`}
              className={`px-3 py-1 border ${
                currentPage === i + 1
                  ? "bg-[#ecebeb] text-black"
                  : "text-[#ecebeb]"
              }`}
            >
              {i + 1}
            </a>
          ))}
        </ProjectsTableMobile>
      </div>
    </div>
  );
};

export default page;
