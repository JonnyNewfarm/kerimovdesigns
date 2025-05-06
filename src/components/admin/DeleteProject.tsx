import { getProjects } from "@/app/actions";
import DeleteProjectCard from "./DeleteProjectCard";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <h1>All Projects</h1>
      <DeleteProjectCard projects={projects} />
    </div>
  );
}
