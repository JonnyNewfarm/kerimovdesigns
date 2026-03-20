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
      <div className="min-h-screen bg-dark border-b border-stone-400/20 text-color">
        <div className="px-7 pt-32 pb-16 sm:px-14">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="max-w-[1200px]">
              <p className="mb-8 text-xs uppercase tracking-[0.25em] text-white/50">
                Selected Project
              </p>

              <h1 className="text-left text-5xl uppercase leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl xl:text-[10rem]">
                {project.title}
              </h1>

              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[#ecebeb]/20 pt-6 sm:grid-cols-3 sm:gap-10">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                    Role
                  </p>
                  <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                    {project.role}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                    Type
                  </p>
                  <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                    {project.type}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                    Tools
                  </p>
                  <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                    {project.tools}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 sm:mt-28 lg:mt-32">
              <ProjectModalWrapper project={project} />
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
