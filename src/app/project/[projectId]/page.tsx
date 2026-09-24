import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProjectById } from "@/app/actions";

import ProjectModalWrapper from "@/components/project/ProjectModalWrapper";
import ProjectDetailsLoadingGate from "@/components/project/ProjectDetailsLoadingGate";
import { ProjectNavTitleSetter } from "@/components/ProjectNavContext";
import SmoothScroll from "@/components/SmoothScroll";

type ParamsType = Promise<{
  projectId: string;
}>;

type Props = {
  params: ParamsType;
};

/*
 * =========================================================
 * METADATA
 * =========================================================
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;

  const project = await getProjectById(projectId);

  if (!project) {
    return {
      title: "Project Not Found | Rustam Kerimov",

      description: "The project you are looking for does not exist.",

      icons: {
        icon: "/favicon.ico",
      },
    };
  }

  const description = `View details about the project "${project.title}" by Rustam Kerimov.`;

  return {
    title: `${project.title} | Rustam Kerimov`,

    description,

    icons: {
      icon: "/favicon.ico",
    },

    openGraph: {
      title: `${project.title} | Rustam Kerimov`,

      description,

      images: project.src
        ? [
            {
              url: project.src,

              alt: project.title,
            },
          ]
        : [],
    },
  };
}

/*
 * =========================================================
 * PAGE
 * =========================================================
 */

export default async function Page({ params }: Props) {
  const { projectId } = await params;

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  /*
   * =====================================================
   * INITIAL PROJECT ASSETS
   * =====================================================
   *
   * Kun de første to.
   *
   * Det er nok til at starten på siden
   * føles ferdig når reveal skjer.
   *
   * Resten blir preloadet videre av
   * ProjectModalWrapper slik du allerede gjør.
   */

  const initialImages = [project.src, project.src2].filter(
    (src): src is string => Boolean(src),
  );

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <ProjectDetailsLoadingGate initialImages={initialImages}>
      <SmoothScroll>
        <ProjectNavTitleSetter title={project.title} />

        <main
          className="
            min-h-screen
            bg-dark
            text-color
          "
        >
          <ProjectModalWrapper project={project} />
        </main>
      </SmoothScroll>
    </ProjectDetailsLoadingGate>
  );
}
