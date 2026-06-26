"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/app/actions";
import UploadImage from "@/components/UploadImage";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadProject() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [imageUrl5, setImageUrl5] = useState("");
  const [imageUrl6, setImageUrl6] = useState("");
  const [imageUrl7, setImageUrl7] = useState("");
  const [imageUrl8, setImageUrl8] = useState("");
  const [imageUrl9, setImageUrl9] = useState("");
  const [srcVideo, setSrcVideo] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const role = formData.get("role") as string;
    const type = formData.get("type") as string;
    const tools = formData.get("tools") as string;

    if (!imageUrl) {
      alert("Please upload a wide image first.");
      return;
    }

    startTransition(() => {
      createProject({
        title,
        description,
        src: imageUrl,
        src2: imageUrl2,
        src3: imageUrl3,
        src4: imageUrl4,
        src5: imageUrl5,
        src6: imageUrl6,
        src7: imageUrl7,
        src8: imageUrl8,
        src9: imageUrl9,
        srcVideo,
        role,
        type,
        tools,
      });
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-6 text-white">
      <h1 className="text-2xl text-white">Upload project</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col items-center justify-center gap-y-6 px-6"
      >
        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none"
          name="title"
          placeholder="Title"
          required
        />

        <textarea
          className="min-h-[220px] w-full resize-y border border-stone-600 bg-transparent px-3 py-2 text-white outline-none"
          name="description"
          placeholder="Project description"
          required
        />

        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none"
          name="role"
          placeholder="Role"
          required
        />

        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none"
          name="type"
          placeholder="Type"
          required
        />

        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none"
          name="tools"
          placeholder="Tools"
          required
        />

        <input type="hidden" name="src" value={imageUrl} />
        <input type="hidden" name="src2" value={imageUrl2} />
        <input type="hidden" name="src3" value={imageUrl3} />
        <input type="hidden" name="src4" value={imageUrl4} />
        <input type="hidden" name="src5" value={imageUrl5} />
        <input type="hidden" name="src6" value={imageUrl6} />
        <input type="hidden" name="src7" value={imageUrl7} />
        <input type="hidden" name="src8" value={imageUrl8} />
        <input type="hidden" name="src9" value={imageUrl9} />
        <input type="hidden" name="srcVideo" value={srcVideo} />

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full cursor-pointer border-2 border-stone-400 px-4 py-2 text-lg font-semibold transition-opacity hover:opacity-70"
        >
          Upload Images & Video
        </button>

        <button
          className="w-full cursor-pointer border-2 border-stone-400 px-4 py-2 text-lg font-semibold transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Create Project"}
        </button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{ scrollbarWidth: "thin" }}
              className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-y-scroll bg-stone-900 p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upload Images & Video</h2>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer text-lg text-gray-400 hover:text-white"
                  aria-label="Close upload modal"
                >
                  ✕
                </button>
              </div>

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Wide Image</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">
                    Optional Image 2
                  </span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl2} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 3</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl3} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 4</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl4} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 5</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl5} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 6</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl6} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 7</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl7} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 8</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl8} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image 9</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setImageUrl9} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Video</span>
                  <div className="flex w-full justify-start">
                    <UploadImage onUploadComplete={setSrcVideo} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
