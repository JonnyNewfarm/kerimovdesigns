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
      <div className="min-h-screen bg-dark text-color">
        <ProjectModalWrapper project={project} />
      </div>
    </SmoothScroll>
  );
};

export default Page;
