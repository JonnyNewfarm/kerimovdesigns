import { getProjectById } from "@/app/actions";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import ProjectModalWrapper from "@/components/ProjectModalWrapper";
import type { Metadata } from "next";

type ParamsType = Promise<{
  projectId: string;
}>;

type Props = {
  params: ParamsType;
};

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

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-dark text-color">
        <ProjectModalWrapper project={project} />
      </main>
    </SmoothScroll>
  );
};

export default Page;
