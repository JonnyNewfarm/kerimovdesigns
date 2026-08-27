"use client";

import { deleteProjectById } from "@/app/actions";
import { useState } from "react";

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
  const [projectList, setProjectList] = useState(projects);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const result = await deleteProjectById(id);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      setProjectList((current) =>
        current.filter((project) => project.id !== id),
      );
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-10 md:grid-cols-3">
      {projectList.map((project) => {
        const isDeleting = deletingId === project.id;

        return (
          <div
            key={project.id}
            className="my-2 flex max-w-[500px] flex-col border border-stone-300/20 p-4"
          >
            <h2 className="text-lg">{project.title}</h2>

            <img src={project.src} alt="" />

            <button
              onClick={() => handleDelete(project.id)}
              disabled={deletingId !== null}
              className="mt-2 w-full max-w-[170px] cursor-pointer border border-red-700 py-1.5 text-red-600 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
