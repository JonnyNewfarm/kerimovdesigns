"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/app/actions";
import UploadImage from "@/components/UploadImage";
import { AnimatePresence, motion } from "framer-motion";

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

  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") ?? "").trim();

    const description = String(formData.get("description") ?? "").trim();

    const type = String(formData.get("type") ?? "").trim();

    const tools = String(formData.get("tools") ?? "").trim();

    const tags = Array.from(
      new Set(
        String(formData.get("tags") ?? "")
          .split(",")
          .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
          .filter(Boolean),
      ),
    );

    if (!imageUrl) {
      setMessage("Please upload a wide image first.");

      return;
    }

    if (!tags.length) {
      setMessage("Please add at least one project tag.");

      return;
    }

    setMessage("");

    startTransition(async () => {
      const result = await createProject({
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
        type,
        tools,
        tags,
      });

      if (!result.success) {
        setMessage(result.error ?? "Could not create project.");

        return;
      }

      setMessage("Project created successfully.");

      form.reset();

      setImageUrl("");
      setImageUrl2("");
      setImageUrl3("");
      setImageUrl4("");
      setImageUrl5("");
      setImageUrl6("");
      setImageUrl7("");
      setImageUrl8("");
      setImageUrl9("");
      setSrcVideo("");
      setShowModal(false);
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-6 bg-dark px-6 py-24 text-white">
      <h1 className="text-2xl font-semibold uppercase tracking-[-0.03em]">
        Upload project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col items-center justify-center gap-y-6"
      >
        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white"
          name="title"
          placeholder="Title"
          required
        />

        <textarea
          className="min-h-[220px] w-full resize-y border border-stone-600 bg-transparent px-3 py-2 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white"
          name="description"
          placeholder="Project description"
          required
        />

        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white"
          name="tags"
          placeholder="Tags, separated by commas"
          required
        />

        <p className="-mt-3 w-full text-[10px] uppercase tracking-[0.18em] text-white/35">
          Example: visual identity, branding, motion
        </p>

        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white"
          name="type"
          placeholder="Year"
          required
        />

        <input
          className="w-full border border-stone-600 bg-transparent px-3 py-2 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white"
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
          Upload images & video
        </button>

        <div className="grid w-full grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.18em] text-white/50">
          <MediaStatus label="Main image" uploaded={Boolean(imageUrl)} />

          <MediaStatus label="Image 2" uploaded={Boolean(imageUrl2)} />

          <MediaStatus label="Image 3" uploaded={Boolean(imageUrl3)} />

          <MediaStatus label="Image 4" uploaded={Boolean(imageUrl4)} />

          <MediaStatus label="Image 5" uploaded={Boolean(imageUrl5)} />

          <MediaStatus label="Image 6" uploaded={Boolean(imageUrl6)} />

          <MediaStatus label="Image 7" uploaded={Boolean(imageUrl7)} />

          <MediaStatus label="Image 8" uploaded={Boolean(imageUrl8)} />

          <MediaStatus label="Image 9" uploaded={Boolean(imageUrl9)} />

          <MediaStatus label="Video" uploaded={Boolean(srcVideo)} />
        </div>

        {message ? (
          <p role="status" className="w-full text-sm text-white/70">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer border-2 border-stone-400 px-4 py-2 text-lg font-semibold transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Create project"}
        </button>
      </form>

      <AnimatePresence>
        {showModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="upload-media-title"
              style={{
                scrollbarWidth: "thin",
              }}
              className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-y-auto bg-stone-900 p-6"
              initial={{
                y: 50,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 50,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 id="upload-media-title" className="text-xl font-semibold">
                  Upload images & video
                </h2>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer text-lg text-gray-400 transition-colors hover:text-white"
                  aria-label="Close upload modal"
                >
                  ✕
                </button>
              </div>

              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                <UploadField
                  label="Wide image"
                  value={imageUrl}
                  onUploadComplete={setImageUrl}
                />

                <UploadField
                  label="Optional image 2"
                  value={imageUrl2}
                  onUploadComplete={setImageUrl2}
                />

                <UploadField
                  label="Image 3"
                  value={imageUrl3}
                  onUploadComplete={setImageUrl3}
                />

                <UploadField
                  label="Image 4"
                  value={imageUrl4}
                  onUploadComplete={setImageUrl4}
                />

                <UploadField
                  label="Image 5"
                  value={imageUrl5}
                  onUploadComplete={setImageUrl5}
                />

                <UploadField
                  label="Image 6"
                  value={imageUrl6}
                  onUploadComplete={setImageUrl6}
                />

                <UploadField
                  label="Image 7"
                  value={imageUrl7}
                  onUploadComplete={setImageUrl7}
                />

                <UploadField
                  label="Image 8"
                  value={imageUrl8}
                  onUploadComplete={setImageUrl8}
                />

                <UploadField
                  label="Image 9"
                  value={imageUrl9}
                  onUploadComplete={setImageUrl9}
                />

                <UploadField
                  label="Video"
                  value={srcVideo}
                  onUploadComplete={setSrcVideo}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-8 w-full cursor-pointer border border-stone-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type UploadFieldProps = {
  label: string;
  value: string;
  onUploadComplete: (url: string) => void;
};

const UploadField = ({ label, value, onUploadComplete }: UploadFieldProps) => {
  return (
    <div className="flex flex-col items-start">
      <div className="mb-2 flex w-full items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>

        <span
          className={`text-[9px] uppercase tracking-[0.18em] ${
            value ? "text-white" : "text-white/35"
          }`}
        >
          {value ? "Uploaded" : "Empty"}
        </span>
      </div>

      <div className="flex w-full justify-start">
        <UploadImage onUploadComplete={onUploadComplete} />
      </div>

      {value ? (
        <button
          type="button"
          onClick={() => onUploadComplete("")}
          className="mt-2 cursor-pointer text-[10px] uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white"
        >
          Remove
        </button>
      ) : null}
    </div>
  );
};

type MediaStatusProps = {
  label: string;
  uploaded: boolean;
};

const MediaStatus = ({ label, uploaded }: MediaStatusProps) => {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-2">
      <span>{label}</span>

      <span className={uploaded ? "text-white" : "text-white/25"}>
        {uploaded ? "Yes" : "No"}
      </span>
    </div>
  );
};
