"use server";

import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

type ProjectData = {
  title: string;
  src: string;
  src2?: string;
  src3?: string;
  src4?: string;
  src5?: string;
  src6?: string;
  src7?: string;
  src8?: string;
  src9?: string;
  srcVideo?: string;
  role?: string;
  type?: string;
  tools?: string;
};

type UpdateProjectData = {
  title?: string;
  src?: string;
  src2?: string;
  src3?: string;
  src4?: string;
  src5?: string;
  src6?: string;
  src7?: string;
  src8?: string;
  src9?: string;
  srcVideo?: string;
  role?: string;
  type?: string;
  tools?: string;
};

export async function createProject(data: ProjectData) {
  try {
    if (!data.title || typeof data.title !== "string") {
      throw new Error("Invalid title passed to DB.");
    }

    if (!data.src || typeof data.src !== "string") {
      throw new Error("Invalid image src passed to DB.");
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        src: data.src,
        src2: data.src2 || "",
        src3: data.src3 || "",
        src4: data.src4 || "",
        src5: data.src5 || "",
        src6: data.src6 || "",
        src7: data.src7 || "",
        src8: data.src8 || "",
        src9: data.src9 || "",
        srcVideo: data.srcVideo || "",
        role: data.role || "",
        type: data.type || "",
        tools: data.tools || "",
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin");

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error creating project:", error);

    return {
      success: false,
      error: "Could not create project",
    };
  }
}

export async function updateProject(id: string, data: UpdateProjectData) {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.src !== undefined && { src: data.src }),
        ...(data.src2 !== undefined && { src2: data.src2 }),
        ...(data.src3 !== undefined && { src3: data.src3 }),
        ...(data.src4 !== undefined && { src4: data.src4 }),
        ...(data.src5 !== undefined && { src5: data.src5 }),
        ...(data.src6 !== undefined && { src6: data.src6 }),
        ...(data.src7 !== undefined && { src7: data.src7 }),
        ...(data.src8 !== undefined && { src8: data.src8 }),
        ...(data.src9 !== undefined && { src9: data.src9 }),
        ...(data.srcVideo !== undefined && { srcVideo: data.srcVideo }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.tools !== undefined && { tools: data.tools }),
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin");
    revalidatePath(`/project/${id}`);

    return {
      success: true,
      updatedProject,
    };
  } catch (error) {
    console.error("Error updating project:", error);

    return {
      success: false,
      error: "Could not update project",
    };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        src: true,
        role: true,
        type: true,
        tools: true,
        createdAt: true,
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectsMobile() {
  try {
    const projects = await prisma.project.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        src: true,
        role: true,
        type: true,
        tools: true,
        createdAt: true,
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching mobile projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectById(id: string) {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    return project;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Failed to fetch project");
  }
}

export async function deleteProjectById(id: string) {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    const deleted = await prisma.project.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin");

    return {
      success: true,
      deleted,
    };
  } catch (error) {
    console.error("Error deleting project:", error);

    return {
      success: false,
      error: "Failed to delete project",
    };
  }
}

export async function getLatestProject() {
  try {
    const latestProject = await prisma.project.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        src: true,
        role: true,
        type: true,
        tools: true,
        createdAt: true,
      },
    });

    return latestProject;
  } catch (error) {
    console.error("Error fetching latest project:", error);
    throw new Error("Failed to fetch latest project");
  }
}

export async function getProjectsPagination(page = 1, limit = 5) {
  try {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);
    const skip = (safePage - 1) * safeLimit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: safeLimit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          src: true,
          role: true,
          type: true,
          tools: true,
          createdAt: true,
        },
      }),
      prisma.project.count(),
    ]);

    return {
      projects,
      total,
    };
  } catch (error) {
    console.error("Error fetching paginated projects:", error);
    throw new Error("Failed to fetch projects");
  }
}