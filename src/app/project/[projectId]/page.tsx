import { getProjectById } from "@/app/actions";
import { notFound } from "next/navigation";
import React from "react";
import SmoothScroll from "@/components/SmoothScroll";
import ProjectModalWrapper from "@/components/ProjectModalWrapper";
import type { Metadata } from "next";

export type ParamsType = Promise<{ projectId: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return {
      title: "Project Not Found | Rustam Kerimov",
      description: "The project you are looking for does not exist.",
      icons: { icon: "/favicon.ico" },
    };
  }

  return {
    title: `${project.title} | Rustam Kerimov`,
    description: `View details about the project "${project.title}" by Rustam Kerimov.`,
    icons: { icon: "/favicon.ico" },
  };
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) notFound();

  return (
    <SmoothScroll>
      <div className="min-h-screen pt-32 bg-dark p-10 border-b-[1px] border-white/50">
        <div className="w-full flex flex-col min-h-screen items-center gap-y-2 sm:gap-y-5 justify-center text-color">
          <h1 className="text-3xl uppercase text-wrap text-center sm:text-7xl">
            {project.title}
          </h1>

          <div className="flex w-full flex-col justify-center mt-10 gap-y-5 sm:gap-y-0 sm:flex-row gap-x-5">
            <div>
              <h1 className="mb-2">Role</h1>
              <span className="bg-[#ecebeb] h-[1px] w-full sm:w-[200px] block" />
              <p className="mt-2">{project.role}</p>
            </div>

            <div>
              <h1 className="mb-2">Type</h1>
              <span className="bg-[#ecebeb] h-[1px] w-full sm:w-[200px] block" />
              <p className="mt-2">{project.type}</p>
            </div>

            <div>
              <h1 className="mb-2">Tools</h1>
              <span className="bg-[#ecebeb] h-[1px] w-full sm:w-[200px] block" />
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
