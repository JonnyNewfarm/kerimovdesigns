import { getProjectById } from "@/app/actions";
import React from "react";
import SmoothScroll from "../../../components/SmoothScroll";
import MotionImage from "@/components/MotionImage";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const project = await getProjectById((await params).projectId);
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#242323] p-20">
        <div className="w-full flex flex-col min-h-screen  items-center gap-y-20 justify-center text-[#ecebeb]">
          <h1 className="text-5xl text-nowrap sm:text-8xl">{project?.title}</h1>
          <div className="flex flex-col sm:flex-row gap-x-5">
            <div className="">
              <h1 className="mb-2">Role</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project?.role}</p>
            </div>

            <div className="">
              <h1 className="mb-2">Type</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project?.type}</p>
            </div>

            <div className="">
              <h1 className="mb-2">Tools</h1>
              <span className="bg-[#ecebeb] h-[1px] w-[200px] block" />
              <p className="mt-2">{project?.tools}</p>
            </div>
          </div>

          <img className="w-[800px]" src={`${project?.src}`} alt="" />
        </div>

        <div className="min-h-screen mt-30 items-center flex justify-center flex-col gap-y-40">
          {project?.src2 && (
            <MotionImage>
              <img className="md:max-w-[800px]" src={project.src2} alt="" />
            </MotionImage>
          )}
          {project?.src3 && (
            <MotionImage>
              <img className="md:w-[800px]" src={project.src3} alt="" />
            </MotionImage>
          )}
          {project?.srcVideo && (
            <MotionImage>
              <video
                className="md:w-[800px]"
                autoPlay
                muted
                loop
                playsInline
                src={project.srcVideo}
              />
            </MotionImage>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
};

export default page;
