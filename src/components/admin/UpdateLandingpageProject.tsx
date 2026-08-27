"use client";

import { useEffect, useState } from "react";

import {
  getLandingpageProjects,
  updateLandingpageProject,
} from "@/app/actions";

import UploadImage from "@/components/admin/UploadImage";

type LandingpageProject = {
  id: string;
  title: string;
  backgroundHex?: string | null;
  projectTitle?: string | null;
  description: string;
  src: string;
  src2: string;
};

type FormData = {
  title: string;
  backgroundHex: string;
  projectTitle: string;
  description: string;
  src: string;
  src2: string;
};

const emptyFormData: FormData = {
  title: "",
  backgroundHex: "",
  projectTitle: "",
  description: "",
  src: "",
  src2: "",
};

export default function UpdateLandingpageProject() {
  const [projects, setProjects] = useState<LandingpageProject[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [formData, setFormData] = useState<FormData>(emptyFormData);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getLandingpageProjects();

        setProjects(data || []);
      } catch (error) {
        console.error("Failed to fetch landingpage projects:", error);

        alert("Could not fetch landingpage projects");
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setFormData(emptyFormData);
      return;
    }

    const project = projects.find(
      (project) => project.id === selectedProjectId,
    );

    if (!project) {
      setFormData(emptyFormData);
      return;
    }

    setFormData({
      title: project.title || "",
      backgroundHex: project.backgroundHex || "",
      projectTitle: project.projectTitle || "",
      description: project.description || "",
      src: project.src || "",
      src2: project.src2 || "",
    });
  }, [selectedProjectId, projects]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUploadComplete = (name: "src" | "src2", url: string) => {
    setFormData((current) => ({
      ...current,
      [name]: url,
    }));
  };

  const handleRemoveImage = (name: "src" | "src2") => {
    setFormData((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProjectId) {
      alert("Please select a project first");
      return;
    }

    if (!formData.src || !formData.src2) {
      alert("Both images are required");
      return;
    }

    try {
      setIsUpdating(true);

      const result = await updateLandingpageProject(selectedProjectId, {
        title: formData.title,
        backgroundHex: formData.backgroundHex,
        projectTitle: formData.projectTitle,
        description: formData.description,
        src: formData.src,
        src2: formData.src2,
      });

      if (!result.success) {
        alert(result.error || "Could not update landingpage project");

        return;
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === selectedProjectId
            ? {
                ...project,
                ...formData,
              }
            : project,
        ),
      );

      alert("Landingpage project updated");
    } catch (error) {
      console.error("Failed to update landingpage project:", error);

      alert("Could not update landingpage project");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-10 py-12 text-white">
      <h1 className="mb-4 text-2xl">Update Landingpage Project</h1>

      <select
        onChange={(event) => setSelectedProjectId(event.target.value)}
        className="mb-6 w-full max-w-lg border border-white bg-[#181c14] p-2 text-white"
        value={selectedProjectId}
        disabled={isUpdating}
      >
        <option value="">Select a landingpage project to update</option>

        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title || "Untitled Project"}
          </option>
        ))}
      </select>

      {selectedProjectId ? (
        <form
          onSubmit={handleUpdate}
          className="flex w-full max-w-5xl flex-col items-center gap-y-4"
        >
          <div className="flex w-full max-w-lg flex-col gap-y-4">
            <input
              className="w-full border bg-transparent px-3 py-2 text-white outline-none"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              className="w-full border bg-transparent px-3 py-2 text-white outline-none"
              name="projectTitle"
              placeholder="Project title"
              value={formData.projectTitle}
              onChange={handleChange}
            />

            <input
              className="w-full border bg-transparent px-3 py-2 text-white outline-none"
              name="backgroundHex"
              placeholder="Background hex"
              value={formData.backgroundHex}
              onChange={handleChange}
            />

            <textarea
              className="min-h-[220px] w-full resize-y border bg-transparent px-3 py-2 text-white outline-none"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center">
              <h2 className="mb-1 text-sm font-medium">Image 1</h2>

              <UploadImage
                initialUrl={formData.src}
                onUploadComplete={(url) => handleUploadComplete("src", url)}
              />

              {formData.src ? (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("src")}
                  className="mt-2 border border-red-400 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-400 hover:text-black"
                >
                  Remove Image 1
                </button>
              ) : null}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="mb-1 text-sm font-medium">Image 2</h2>

              <UploadImage
                initialUrl={formData.src2}
                onUploadComplete={(url) => handleUploadComplete("src2", url)}
              />

              {formData.src2 ? (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("src2")}
                  className="mt-2 border border-red-400 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-400 hover:text-black"
                >
                  Remove Image 2
                </button>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="mt-4 w-full max-w-lg border border-white px-4 py-2 text-lg font-semibold disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Landingpage Project"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
