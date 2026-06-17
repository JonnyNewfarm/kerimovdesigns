"use client";

import { UploadButton } from "@/utils/uploadthing";
import React, { useEffect, useState } from "react";
import "@uploadthing/react/styles.css";

interface UploadImageProps {
  onUploadComplete: (url: string) => void;
  initialUrl?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  onUploadComplete,
  initialUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  useEffect(() => {
    setPreview(initialUrl || null);
  }, [initialUrl]);

  return (
    <div>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mb-2 w-36 h-32 object-cover border border-stone-600"
        />
      )}

      <UploadButton
        appearance={{
          button: "bg-stone-300 text-white py-2 px-4",
          container: "",
          allowedContent: "text-[#242323]",
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (!res || res.length === 0) return;

          const url = res[0].ufsUrl;

          if (!url) {
            console.error("No ufsUrl found in UploadThing response:", res[0]);
            alert("Upload completed, but no URL was returned.");
            return;
          }

          setPreview(url);
          onUploadComplete(url);

          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          console.error("UploadThing error:", error);
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default UploadImage;
