"use client";

import { useState } from "react";

import { createLandingpageProject } from "@/app/actions";
import UploadImage from "@/components/admin/UploadImage";

export default function UploadLandingpageProject() {
  const [title, setTitle] = useState("");
  const [backgroundHex, setBackgroundHex] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");

  const [src, setSrc] = useState("");
  const [src2, setSrc2] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!src || !src2) {
      alert("Please upload both images");
      return;
    }

    try {
      setIsUploading(true);

      const result = await createLandingpageProject({
        title,
        backgroundHex,
        projectTitle,
        description,
        src,
        src2,
      });

      if (!result.success) {
        alert(result.error || "Could not create landingpage project");

        return;
      }

      setTitle("");
      setBackgroundHex("");
      setProjectTitle("");
      setDescription("");
      setSrc("");
      setSrc2("");

      alert("Landingpage project created");
    } catch (error) {
      console.error("Failed to create landingpage project:", error);

      alert("Could not create landingpage project");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-10 py-12 text-white">
      <h1 className="mb-4 text-2xl">Upload Landingpage Project</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-5xl flex-col items-center gap-y-4"
      >
        <div className="flex w-full max-w-lg flex-col gap-y-4">
          <input
            className="w-full border bg-transparent px-3 py-2 text-white outline-none"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <input
            className="w-full border bg-transparent px-3 py-2 text-white outline-none"
            placeholder="Project title"
            value={projectTitle}
            onChange={(event) => setProjectTitle(event.target.value)}
          />

          <input
            className="w-full border bg-transparent px-3 py-2 text-white outline-none"
            placeholder="Background hex — #181c14"
            value={backgroundHex}
            onChange={(event) => setBackgroundHex(event.target.value)}
          />

          <textarea
            className="min-h-[220px] w-full resize-y border bg-transparent px-3 py-2 text-white outline-none"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="grid w-fit grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center">
            <h2 className="mb-1 text-sm font-medium">Image 1</h2>

            <UploadImage
              initialUrl={src}
              onUploadComplete={(url) => setSrc(url)}
            />

            {src ? (
              <button
                type="button"
                onClick={() => setSrc("")}
                className="mt-2 border border-red-400 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-400 hover:text-black"
              >
                Remove Image 1
              </button>
            ) : null}
          </div>

          <div className="flex flex-col items-center">
            <h2 className="mb-1 text-sm font-medium">Image 2</h2>

            <UploadImage
              initialUrl={src2}
              onUploadComplete={(url) => setSrc2(url)}
            />

            {src2 ? (
              <button
                type="button"
                onClick={() => setSrc2("")}
                className="mt-2 border border-red-400 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-400 hover:text-black"
              >
                Remove Image 2
              </button>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="mt-4 w-full max-w-lg border border-white px-4 py-2 text-lg font-semibold disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Landingpage Project"}
        </button>
      </form>
    </div>
  );
}
