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
    const role = formData.get("role") as string;
    const type = formData.get("type") as string;
    const tools = formData.get("tools") as string;

    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    startTransition(() => {
      createProject({
        title,
        src: imageUrl,
        src2: imageUrl2,
        src3: imageUrl3,
        src4: imageUrl4,
        src5: imageUrl5,
        src6: imageUrl6,
        src7: imageUrl7,
        src8: imageUrl8,
        src9: imageUrl9,
        srcVideo: srcVideo,
        role,
        type,
        tools,
      });
    });
  };

  return (
    <div className="w-full flex-col gap-y-6 text-white min-h-screen flex items-center justify-center">
      <h1 className="text-2xl text-white">Upload project</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-y-6"
      >
        <input
          className="outline-1 outline-stone-600 py-2 px-3 w-full lg:min-w-[350px]"
          name="title"
          placeholder="Title"
          required
        />

        <input
          className="outline-1 outline-stone-600 py-2 w-full px-3 lg:min-w-[350px]"
          name="role"
          placeholder="Role"
          required
        />

        <input
          className="outline-1 outline-stone-600 py-2 w-full px-3 lg:min-w-[350px]"
          name="type"
          placeholder="Type"
          required
        />

        <input
          className="outline-1 outline-stone-600 py-2 px-3 w-full lg:min-w-[350px]"
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
        <input type="hidden" name="src" value={imageUrl9} />
        <input type="hidden" name="srcVideo" value={srcVideo} />

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="cursor-pointer hover:scale-105 transition-transform ease-in-out border-2 w-full text-lg font-semibold border-stone-400 py-2 px-4"
        >
          Upload Images & Video
        </button>

        <button
          className="cursor-pointer hover:scale-105 transition-transform ease-in-out border-2 w-full text-lg font-semibold border-stone-400 py-2 px-4"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Create Project"}
        </button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{ scrollbarWidth: "thin" }}
              className="bg-stone-900 overflow-y-scroll max-h-[80vh] flex flex-col  p-6 rounded-md max-w-xl w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Images & Video</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 text-lg cursor-pointer hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Wide Image</span>
                  <div className="w-full flex justify-start">
                    {" "}
                    {/* <-- wrap fixes centering */}
                    <UploadImage onUploadComplete={setImageUrl} />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl2} />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl3} />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl4} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl5} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl6} />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl7} />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl8} />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Image</span>
                  <div className="w-full flex justify-start">
                    <UploadImage onUploadComplete={setImageUrl9} />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm font-medium">Video?</span>
                  <div className="w-full flex justify-start">
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
