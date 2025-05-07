import DeleteProject from "@/components/admin/DeleteProject";
import UploadProject from "@/components/admin/UploadProject";
import React from "react";

const page = () => {
  return (
    <div className="">
      <UploadProject />
      <DeleteProject />
    </div>
  );
};

export default page;
