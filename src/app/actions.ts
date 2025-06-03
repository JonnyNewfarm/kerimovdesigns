'use server';

import prisma from "../../lib/prisma"; 
import { revalidatePath } from "next/cache";

export async function createProject(data: {
  title: string;
  
  src: string;
  src2?: string;
  src3?: string
  srcVideo?: string
  role?: string
  type?: string
  tools?: string
}) {
  try {
    console.log("Saving project with image src:", data.src, typeof data.src);

    if (!data.src || typeof data.src !== "string") {
      throw new Error("Invalid image src passed to DB.");
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        src: data.src,
        src2: data.src2!,
        src3: data.src3!,
        srcVideo: data.srcVideo!,
        role: data.role!,
        type: data.type!,
        tools: data.tools!


      },
    });

    revalidatePath("/projects"); 

    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Could not create project" };
  }
}




export async function updateProject(id: string, data: {
  title?: string;
  src?: string;
  src2?: string;
  src3?: string;
  srcVideo?: string;
  role?: string;
  type?: string;
  tools?: string;
}) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });

    revalidatePath("/projects");

    return { success: true, updatedProject };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Could not update project" };
  }
}



export const getProjects = async () => {
  try {
    const projects = await prisma.project.findMany(
      {orderBy: { createdAt: "desc" },}
    );
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};



export const getProjectsMobile = async () => {
  try {
    const projects = await prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};




export const getProjectById = async (id: string) => {
  try {
    const product = await prisma.project.findUnique({
      where: { id },
    });

    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product');
  }
};


;

export async function deleteProjectById(id: string) {
  try {
    const deleted = await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/projects');

    return { success: true, deleted };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}





export async function getLatestProject() {
  try {
    const latestProject = await prisma.project.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return latestProject;
  } catch (error) {
    console.error('Error fetching latest project:', error);
    throw new Error('Failed to fetch latest project');
  }
}



export const getProjectsPagnation = async (page = 1, limit = 3) => {
  try {
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, 
      }),
      prisma.project.count(),
    ]);

    return { projects, total };
  } catch (error) {
    console.error("Error fetching paginated projects:", error);
    throw new Error("Failed to fetch projects");
  }
};
