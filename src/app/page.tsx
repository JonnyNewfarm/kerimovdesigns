import { getProjects } from "@/app/actions";
import ResponsivePortfolio from "@/components/artboard/infinite-projects/ResponsivePortfolio";
import { type InfiniteProject } from "@/components/artboard/InfiniteProjectsScene";
import Smoothscroll from "@/components/SmoothScroll";

export default async function Home() {
  const projects = await getProjects();

  const items: InfiniteProject[] = projects.flatMap((project, index) => {
    if (typeof project.src !== "string" || !project.src.trim()) {
      return [];
    }

    const images = [
      project.src2,
      project.src3,
      project.src4,
      project.src5,
      project.src6,
      project.src7,
      project.src8,
      project.src9,
    ].filter(
      (src): src is string =>
        typeof src === "string" && src.trim().length > 0 && src !== project.src,
    );

    return [
      {
        id: String(project.id ?? index),
        title: String(project.title ?? "Untitled"),
        description:
          typeof project.description === "string" ? project.description : "",
        type: typeof project.type === "string" ? project.type : "",
        tools: typeof project.tools === "string" ? project.tools : "",
        tags: Array.isArray(project.tags) ? project.tags : [],
        src: project.src,
        images: [...new Set(images)],
        srcVideo:
          typeof project.srcVideo === "string" ? project.srcVideo.trim() : "",
      },
    ];
  });

  return (
    <Smoothscroll>
      <main className="relative min-h-screen w-full bg-dark text-color">
        {items.length > 0 && <ResponsivePortfolio projects={items} />}
      </main>
    </Smoothscroll>
  );
}
