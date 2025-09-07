"use client";

import { deleteProjectById } from "@/app/actions";
import { useTransition } from "react";

type Project = {
  id: string;
  title: string;

  src: string;
};

export default function DeleteProjectCard({
  projects,
}: {
  projects: Project[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteProjectById(id);
      } catch (err) {
        console.error("Failed to delete", err);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-10">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border border-stone-300/20 p-4 my-2 flex flex-col max-w-[500px]"
        >
          <h2 className="text-lg">{project.title}</h2>
          <img src={project.src} alt="" />
          <button
            onClick={() => handleDelete(project.id)}
            disabled={isPending}
            className="text-red-600 border-red-700 border w-full py-1.5 mt-2 max-w-[170px] cursor-pointer"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
