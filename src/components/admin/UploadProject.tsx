"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/app/actions";
import UploadImage from "@/components/UploadImage";

export default function UploadProject() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [srcVideo, setSrcVideo] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const role = formData.get("role") as string;
    const type = formData.get("type") as string;
    const tools = formData.get("tools") as string;

    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    console.log("Submitting with imageUrl:", imageUrl);

    startTransition(() => {
      createProject({
        title,
        src: imageUrl,
        src2: imageUrl2,
        src3: imageUrl3,
        srcVideo: srcVideo,
        role,
        type,
        tools,
      });
    });
  };

  return (
    <div className="w-full flex-col gap-y-6 min-h-screen flex items-center justify-center">
      <h1 className="text-xl">Upload project</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-y-6"
      >
        <input
          className="outline-1 outline-stone-600 py-2 px-3 lg:min-w-[350px]"
          name="title"
          placeholder="Title"
          required
        />

        <input
          className="outline-1 outline-stone-600 py-2 px-3 lg:min-w-[350px]"
          name="role"
          placeholder="Role"
          required
        />

        <input
          className="outline-1 outline-stone-600 py-2 px-3 lg:min-w-[350px]"
          name="type"
          placeholder="Type"
          required
        />
        <input
          className="outline-1 outline-stone-600 py-2 px-3 lg:min-w-[350px]"
          name="tools"
          placeholder="Tools"
          required
        />

        <input type="hidden" name="src" value={imageUrl} />
        <input type="hidden" name="src" value={imageUrl2} />
        <input type="hidden" name="src" value={imageUrl3} />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-center flex-col items-center">
            <h1>Wide Image</h1>
            <UploadImage onUploadComplete={setImageUrl} />
          </div>
          <div className="flex justify-center flex-col items-center">
            Image
            <UploadImage onUploadComplete={setImageUrl2} />
          </div>
          <div className="flex justify-center flex-col items-center">
            <h1>Image</h1>
            <UploadImage onUploadComplete={setImageUrl3} />
          </div>
          <div className="flex justify-center flex-col items-center">
            <h1>Video</h1>
            <UploadImage onUploadComplete={setSrcVideo} />
          </div>
        </div>
        <button
          className="cursor-pointer border-1 border-black py-2 px-4"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
