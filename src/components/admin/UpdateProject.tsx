"use client";

import { useEffect, useState } from "react";
import { getProjectById, getProjects, updateProject } from "@/app/actions";
import UploadImage from "@/components/UploadImage";

type Project = {
  id: string;
  title?: string | null;
  description?: string | null;
  type?: string | null;
  tools?: string | null;
  tags?: string[];
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
  description: string;
  type: string;
  tools: string;
  tags: string;
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
  description: "",
  type: "",
  tools: "",
  tags: "",
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

function normalizeProjectData(project: Project): ProjectFormData {
  return {
    title: project.title || "",
    description: project.description || "",
    type: project.type || "",
    tools: project.tools || "",
    tags: project.tags?.join(", ") || "",
    src: project.src || "",
    src2: project.src2 || "",
    src3: project.src3 || "",
    src4: project.src4 || "",
    src5: project.src5 || "",
    src6: project.src6 || "",
    src7: project.src7 || "",
    src8: project.src8 || "",
    src9: project.src9 || "",
    srcVideo: project.srcVideo || "",
  };
}

export default function UpdateProject() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData);

  const [isFetchingProject, setIsFetchingProject] = useState(false);

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

    let cancelled = false;

    const fetchFullProject = async () => {
      try {
        setIsFetchingProject(true);

        const project = await getProjectById(selectedProjectId);

        if (cancelled) {
          return;
        }

        if (!project) {
          alert("Could not find selected project");

          setFormData(emptyFormData);

          return;
        }

        setFormData(normalizeProjectData(project));
      } catch (error) {
        console.error("Failed to fetch full project:", error);

        alert("Could not fetch full project data");

        setFormData(emptyFormData);
      } finally {
        if (!cancelled) {
          setIsFetchingProject(false);
        }
      }
    };

    fetchFullProject();

    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUploadComplete = (name: keyof ProjectFormData, url: string) => {
    setFormData((current) => ({
      ...current,
      [name]: url,
    }));
  };

  const handleRemoveMedia = (name: keyof ProjectFormData) => {
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

    const tags = Array.from(
      new Set(
        formData.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
          .filter(Boolean),
      ),
    );

    if (!tags.length) {
      alert("Please add at least one project tag");

      return;
    }

    try {
      setIsUpdating(true);

      const result = await updateProject(selectedProjectId, {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        tools: formData.tools,
        tags,
        src: formData.src,
        src2: formData.src2,
        src3: formData.src3,
        src4: formData.src4,
        src5: formData.src5,
        src6: formData.src6,
        src7: formData.src7,
        src8: formData.src8,
        src9: formData.src9,
        srcVideo: formData.srcVideo,
      });

      if (!result.success) {
        alert(result.error || "Could not update project");

        return;
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === selectedProjectId
            ? {
                ...project,
                title: formData.title,
                description: formData.description,
                type: formData.type,
                tools: formData.tools,
                tags,
                src: formData.src,
                src2: formData.src2,
                src3: formData.src3,
                src4: formData.src4,
                src5: formData.src5,
                src6: formData.src6,
                src7: formData.src7,
                src8: formData.src8,
                src9: formData.src9,
                srcVideo: formData.srcVideo,
              }
            : project,
        ),
      );

      setFormData((current) => ({
        ...current,
        tags: tags.join(", "),
      }));

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
    {
      label: "Wide Image",
      name: "src",
    },
    {
      label: "Optional Image 2",
      name: "src2",
    },
    {
      label: "Image 3",
      name: "src3",
    },
    {
      label: "Image 4",
      name: "src4",
    },
    {
      label: "Image 5",
      name: "src5",
    },
    {
      label: "Image 6",
      name: "src6",
    },
    {
      label: "Image 7",
      name: "src7",
    },
    {
      label: "Image 8",
      name: "src8",
    },
    {
      label: "Image 9",
      name: "src9",
    },
    {
      label: "Video",
      name: "srcVideo",
    },
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center p-10 py-12 text-white">
      <h1 className="mb-4 text-2xl">Update Project</h1>

      <select
        onChange={(event) => setSelectedProjectId(event.target.value)}
        className="mb-6 w-full max-w-lg border border-white bg-[#181c14] p-2 text-white"
        value={selectedProjectId}
        disabled={isUpdating}
      >
        <option value="">Select a project to update</option>

        {projects.map((project) => (
          <option
            className="border-white text-white"
            key={project.id}
            value={project.id}
          >
            {project.title || "Untitled Project"}
          </option>
        ))}
      </select>

      {selectedProjectId && isFetchingProject ? (
        <p className="text-sm text-white/70">Loading project data...</p>
      ) : null}

      {selectedProjectId && !isFetchingProject ? (
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

            <textarea
              className="min-h-[220px] w-full resize-y border bg-transparent px-3 py-2 text-white outline-none"
              name="description"
              placeholder="Project description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              className="w-full border bg-transparent px-3 py-2 text-white outline-none"
              name="tags"
              placeholder="Tags, separated by commas"
              value={formData.tags}
              onChange={handleChange}
              required
            />

            <p className="-mt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
              Example: visual identity, branding, motion
            </p>

            <input
              className="w-full border bg-transparent px-3 py-2 text-white outline-none"
              name="type"
              placeholder="Year"
              value={formData.type}
              onChange={handleChange}
              required
            />

            <input
              className="w-full border bg-transparent px-3 py-2 text-white outline-none"
              name="tools"
              placeholder="Tools"
              value={formData.tools}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {imageFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col items-center">
                <h2 className="mb-1 text-sm font-medium">{label}</h2>

                <UploadImage
                  initialUrl={formData[name]}
                  onUploadComplete={(url) => handleUploadComplete(name, url)}
                />

                <div className="mt-2 flex w-full max-w-[220px] flex-col gap-2">
                  {formData[name] ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(name)}
                      className="border border-red-400 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-400 hover:text-black"
                    >
                      Remove {label}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 w-full max-w-lg border border-white px-4 py-2 text-lg font-semibold disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Project"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
