import { getProjectById } from "@/app/actions";
import React from "react";
import SmoothScroll from "../../../components/SmoothScroll";
import ProjectModalWrapper from "@/components/ProjectModalWrapper";

const page = async ({ params }: { params: { projectId: string } }) => {
  const project = await getProjectById(params.projectId);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#242323] p-20 border-b-[1px] border-white/50">
        <div className="w-full flex flex-col min-h-screen items-center gap-y-20 sm:gap-y-10 justify-center text-[#ecebeb]">
          <h1 className="text-5xl text-wrap text-center sm:text-8xl">
            {project?.title}
          </h1>

          <div className="flex flex-col sm:flex-row gap-x-5">
            <div>
              <h1 className="mb-2">Role</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project?.role}</p>
            </div>

            <div>
              <h1 className="mb-2">Type</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project?.type}</p>
            </div>

            <div>
              <h1 className="mb-2">Tools</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project?.tools}</p>
            </div>
          </div>
          <ProjectModalWrapper project={project} />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default page;
