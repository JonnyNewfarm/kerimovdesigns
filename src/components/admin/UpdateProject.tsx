"use client";

import { useEffect, useState, useTransition } from "react";
import { getProjects, updateProject } from "@/app/actions";
import UploadImage from "@/components/UploadImage";

export default function UpdateProject() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const data = await getProjects();
      setProjects(data);
    })();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const project = projects.find((p) => p.id === selectedProjectId);
    if (project) setFormData(project);
  }, [selectedProjectId, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    startTransition(() => {
      updateProject(selectedProjectId, formData);
    });
  };

  const imageFields = [
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
    <div className="w-full py-12 flex flex-col items-center p-10 justify-center">
      <h1 className="text-2xl mb-4 text-white">Update Project</h1>

      <select
        onChange={(e) => setSelectedProjectId(e.target.value)}
        className="mb-6 p-2 border w-full max-w-lg border-white text-white bg-[#181c14]"
        value={selectedProjectId}
      >
        <option value="" className="text-white">
          Select a project to update
        </option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </select>

      {selectedProjectId && (
        <form
          onSubmit={handleUpdate}
          className="flex flex-col items-center gap-y-4 w-full max-w-lg"
        >
          {["title", "role", "type", "tools"].map((field) => (
            <input
              key={field}
              className="border px-3 py-2 w-full"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field] || ""}
              onChange={handleChange}
            />
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {imageFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col items-center">
                <h2 className="mb-1 text-sm font-medium">{label}</h2>
                <UploadImage
                  onUploadComplete={(url) =>
                    setFormData({ ...formData, [name]: url })
                  }
                  initialUrl={formData[name]}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 border w-full font-semibold text-lg border-white px-4 py-2"
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Project"}
          </button>
        </form>
      )}
    </div>
  );
}
