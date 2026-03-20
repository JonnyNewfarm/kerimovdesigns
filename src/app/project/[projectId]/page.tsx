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
            {/* Top hero */}
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
              {/* Left side */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                    Selected Project
                  </p>
                </div>

                <h1 className="max-w-[1100px] text-left text-5xl uppercase leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl xl:text-[10rem]">
                  {project.title}
                </h1>
              </div>

              {/* Right side meta */}
              <div className="lg:col-span-4 xl:col-span-3 lg:pt-24">
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="mb-3 text-xs uppercase tracking-[0.22em] text-white/50">
                      Role
                    </h2>
                    <span className="mb-3 block h-px w-full bg-[#ecebeb]/30" />
                    <p className="text-base leading-relaxed">{project.role}</p>
                  </div>

                  <div>
                    <h2 className="mb-3 text-xs uppercase tracking-[0.22em] text-white/50">
                      Type
                    </h2>
                    <span className="mb-3 block h-px w-full bg-[#ecebeb]/30" />
                    <p className="text-base leading-relaxed">{project.type}</p>
                  </div>

                  <div>
                    <h2 className="mb-3 text-xs uppercase tracking-[0.22em] text-white/50">
                      Tools
                    </h2>
                    <span className="mb-3 block h-px w-full bg-[#ecebeb]/30" />
                    <p className="text-base leading-relaxed">{project.tools}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Space before content/modal */}
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
