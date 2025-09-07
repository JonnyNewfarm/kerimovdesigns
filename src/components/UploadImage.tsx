"use client";
import { UploadButton } from "@/utils/uploadthing";
import React from "react";
import "@uploadthing/react/styles.css";

const UploadImage = ({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) => {
  return (
    <div>
      <UploadButton
        appearance={{
          button: "bg-stone-300   text-white py-2 px-4 rounded",
          container: "",
          allowedContent: "text-[#242323]",
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const url = res[0].url;
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
