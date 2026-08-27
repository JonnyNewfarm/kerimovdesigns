import { getProjects } from "@/app/actions";
import DeleteProjectCard from "./DeleteProjectCard";

export default async function DeleteProject() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex w-full justify-center text-left">
        <h1 className="absolute left-12 text-2xl">Delete Projects</h1>
      </div>

      <DeleteProjectCard projects={projects} />
    </div>
  );
}
