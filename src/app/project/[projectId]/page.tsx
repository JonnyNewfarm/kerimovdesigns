import { getProjectById } from "@/app/actions";
import { notFound } from "next/navigation";
import React from "react";
import SmoothScroll from "../../../components/SmoothScroll";
import ProjectModalWrapper from "@/components/ProjectModalWrapper";

export type ParamsType = Promise<{ projectId: string }>;

type Props = {
  params: ParamsType;
};

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen pt-32 bg-[#242323] p-20 border-b-[1px] border-white/50">
        <div className="w-full flex flex-col min-h-screen items-center gap-y-20 sm:gap-y-10 justify-center text-[#ecebeb]">
          <h1 className="text-3xl uppercase text-wrap text-center sm:text-7xl">
            {project.title}
          </h1>

          <div className="flex flex-col mt-10 sm:flex-row gap-x-5">
            <div>
              <h1 className="mb-2">Role</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project.role}</p>
            </div>

            <div>
              <h1 className="mb-2">Type</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project.type}</p>
            </div>

            <div>
              <h1 className="mb-2">Tools</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project.tools}</p>
            </div>
          </div>

          <ProjectModalWrapper project={project} />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
