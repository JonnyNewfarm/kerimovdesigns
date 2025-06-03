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

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4 text-white">Update Project</h1>

      <select
        onChange={(e) => setSelectedProjectId(e.target.value)}
        className="mb-6 p-2 border border-white text-white bg-[#242323]"
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
          className="flex flex-col items-center gap-y-4"
        >
          <input
            className="border px-3 py-2 w-80"
            name="title"
            placeholder="Title"
            onChange={handleChange}
          />
          <input
            className="border px-3 py-2 w-80"
            name="role"
            placeholder="Role"
            onChange={handleChange}
          />
          <input
            className="border px-3 py-2 w-80"
            name="type"
            placeholder="Type"
            onChange={handleChange}
          />
          <input
            className="border px-3 py-2 w-80"
            name="tools"
            placeholder="Tools"
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <UploadImage
              onUploadComplete={(url) => setFormData({ ...formData, src: url })}
            />
            <UploadImage
              onUploadComplete={(url) =>
                setFormData({ ...formData, src2: url })
              }
            />
            <UploadImage
              onUploadComplete={(url) =>
                setFormData({ ...formData, src3: url })
              }
            />
            <UploadImage
              onUploadComplete={(url) =>
                setFormData({ ...formData, srcVideo: url })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-4 border border-white px-4 py-2"
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Project"}
          </button>
        </form>
      )}
    </div>
  );
}
