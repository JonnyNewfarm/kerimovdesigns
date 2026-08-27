"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  deleteLandingpageProject,
  getLandingpageProjects,
} from "@/app/actions";

type LandingpageProject = {
  id: string;
  title: string;
  projectTitle?: string | null;
  backgroundHex?: string | null;
  description: string;
  src: string;
  src2: string;
};

export default function DeleteLandingpageProject() {
  const [projects, setProjects] = useState<LandingpageProject[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getLandingpageProjects();

        setProjects(data || []);
      } catch (error) {
        console.error("Failed to fetch landingpage projects:", error);

        alert("Could not fetch landingpage projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (project: LandingpageProject) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(project.id);

      const result = await deleteLandingpageProject(project.id);

      if (!result.success) {
        alert(result.error || "Could not delete landingpage project");

        return;
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (currentProject) => currentProject.id !== project.id,
        ),
      );
    } catch (error) {
      console.error("Failed to delete landingpage project:", error);

      alert("Could not delete landingpage project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-10 py-12 text-white">
      <h1 className="mb-8 text-2xl">Delete Landingpage Project</h1>

      {isLoading ? (
        <p className="text-sm text-white/50">Loading projects...</p>
      ) : null}

      {!isLoading && projects.length === 0 ? (
        <p className="text-sm text-white/50">No landingpage projects</p>
      ) : null}

      {!isLoading && projects.length > 0 ? (
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const isDeleting = deletingId === project.id;

            return (
              <div
                key={project.id}
                className="
                  flex
                  flex-col
                  border
                  border-white/30
                "
              >
                {/* Images */}
                <div className="grid grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden border-r border-white/20">
                    <Image
                      src={project.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.src2}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-6">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Landingpage Project
                    </p>

                    <h2 className="text-xl font-medium">{project.title}</h2>

                    {project.projectTitle ? (
                      <p className="mt-1 text-sm text-white/50">
                        {project.projectTitle}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      disabled={deletingId !== null}
                      className="
                        w-full
                        border
                        border-red-400
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-red-300
                        transition
                        hover:bg-red-400
                        hover:text-black
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      {isDeleting ? "Deleting..." : "Delete Project"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
