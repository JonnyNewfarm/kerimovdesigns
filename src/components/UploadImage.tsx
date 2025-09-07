"use client";
import { UploadButton } from "@/utils/uploadthing";
import React, { useState, useEffect } from "react";
import "@uploadthing/react/styles.css";

interface UploadImageProps {
  onUploadComplete: (url: string) => void;
  initialUrl?: string; // optional preloaded image/video
}

const UploadImage: React.FC<UploadImageProps> = ({
  onUploadComplete,
  initialUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  useEffect(() => {
    if (initialUrl) setPreview(initialUrl);
  }, [initialUrl]);

  return (
    <div>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mb-2 w-36  h-32 object-cover border border-stone-600"
        />
      )}
      <UploadButton
        appearance={{
          button: "bg-stone-300 text-white py-2 px-4 rounded",
          container: "",
          allowedContent: "text-[#242323]",
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const url = res[0].url;
            setPreview(url); // update preview
            onUploadComplete(url);
            alert("Upload Completed");
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default UploadImage;
