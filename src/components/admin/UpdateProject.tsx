"use client";

import { useEffect, useState } from "react";
import { getProjects, updateProject } from "@/app/actions";
import UploadImage from "@/components/UploadImage";

type Project = {
  id: string;
  title?: string | null;
  role?: string | null;
  type?: string | null;
  tools?: string | null;
  src?: string | null;
  src2?: string | null;
  src3?: string | null;
  src4?: string | null;
  src5?: string | null;
  src6?: string | null;
  src7?: string | null;
  src8?: string | null;
  src9?: string | null;
  srcVideo?: string | null;
};

type ProjectFormData = {
  title: string;
  role: string;
  type: string;
  tools: string;
  src: string;
  src2: string;
  src3: string;
  src4: string;
  src5: string;
  src6: string;
  src7: string;
  src8: string;
  src9: string;
  srcVideo: string;
};

const emptyFormData: ProjectFormData = {
  title: "",
  role: "",
  type: "",
  tools: "",
  src: "",
  src2: "",
  src3: "",
  src4: "",
  src5: "",
  src6: "",
  src7: "",
  src8: "",
  src9: "",
  srcVideo: "",
};

export default function UpdateProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        alert("Could not fetch projects");
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setFormData(emptyFormData);
      return;
    }

    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId,
    );

    if (!selectedProject) return;

    setFormData({
      title: selectedProject.title || "",
      role: selectedProject.role || "",
      type: selectedProject.type || "",
      tools: selectedProject.tools || "",
      src: selectedProject.src || "",
      src2: selectedProject.src2 || "",
      src3: selectedProject.src3 || "",
      src4: selectedProject.src4 || "",
      src5: selectedProject.src5 || "",
      src6: selectedProject.src6 || "",
      src7: selectedProject.src7 || "",
      src8: selectedProject.src8 || "",
      src9: selectedProject.src9 || "",
      srcVideo: selectedProject.srcVideo || "",
    });
  }, [selectedProjectId, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadComplete = (name: keyof ProjectFormData, url: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: url,
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProjectId) {
      alert("Please select a project first");
      return;
    }

    try {
      setIsUpdating(true);

      await updateProject(selectedProjectId, formData);

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProjectId
            ? {
                ...project,
                ...formData,
              }
            : project,
        ),
      );

      alert("Project updated");
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Could not update project");
    } finally {
      setIsUpdating(false);
    }
  };

  const imageFields: {
    label: string;
    name: keyof ProjectFormData;
  }[] = [
    { label: "Wide Image", name: "src" },
    { label: "Image 2", name: "src2" },
    { label: "Image 3", name: "src3" },
    { label: "Image 4", name: "src4" },
    { label: "Image 5", name: "src5" },
    { label: "Image 6", name: "src6" },
    { label: "Image 7", name: "src7" },
    { label: "Image 8", name: "src8" },
    { label: "Image 9", name: "src9" },
    { label: "Video", name: "srcVideo" },
  ];

  return (
    <div className="w-full py-12 flex flex-col items-center p-10 justify-center text-white">
      <h1 className="text-2xl mb-4">Update Project</h1>

      <select
        onChange={(e) => setSelectedProjectId(e.target.value)}
        className="mb-6 p-2 border w-full max-w-lg border-white text-white bg-[#181c14]"
        value={selectedProjectId}
      >
        <option value="">Select a project to update</option>

        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title || "Untitled Project"}
          </option>
        ))}
      </select>

      {selectedProjectId && (
        <form
          onSubmit={handleUpdate}
          className="flex flex-col items-center gap-y-4 w-full max-w-5xl"
        >
          <div className="w-full max-w-lg flex flex-col gap-y-4">
            <input
              className="border px-3 py-2 w-full text-black"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />

            <input
              className="border px-3 py-2 w-full text-black"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
            />

            <input
              className="border px-3 py-2 w-full text-black"
              name="type"
              placeholder="Type"
              value={formData.type}
              onChange={handleChange}
            />

            <input
              className="border px-3 py-2 w-full text-black"
              name="tools"
              placeholder="Tools"
              value={formData.tools}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {imageFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col items-center">
                <h2 className="mb-1 text-sm font-medium">{label}</h2>

                <UploadImage
                  initialUrl={formData[name]}
                  onUploadComplete={(url) => handleUploadComplete(name, url)}
                />

                {formData[name] && (
                  <input
                    className="mt-2 border px-2 py-1 w-36 text-xs text-black"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 border w-full max-w-lg font-semibold text-lg border-white px-4 py-2 disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Project"}
          </button>
        </form>
      )}
    </div>
  );
}
