import { getProjects } from "@/app/actions";
import DeleteProjectCard from "./DeleteProjectCard";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex w-full justify-center">
        <h1 className="text-2xl">Delete Projects</h1>
      </div>

      <DeleteProjectCard projects={projects} />
    </div>
  );
}
