import React from "react";

const Footer = () => {
  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className=" text-white relative h-[420px]    bg-[#242323]"
    >
      <div className="relative  h-[calc(100vh+420px)] -top-[100vh]   flex-col justify-start">
        <div className="h-[420px] text-[#ecebeb] p-14 sticky top-[calc(100vh-420px)]">
          <div className="w-full h-[270px] text-2xl px-5 sm:text-3xl  md:text-6xl lg:text-7xl  flex flex-col justify-center items-center  font-semibold text-nowrap">
            <h1 className="whitespace-normal xl:text-6xl">Rustam Kerimov</h1>
            <h1 className="whitespace-nowrap">Graphic Designer</h1>
          </div>

          <div className="flex justify-between">
            <div>
              <h1 className="opacity-65">Created by:</h1>
              <a
                className="flex underline items-center gap-x-1"
                href="https://www.jonasnygaard.com/"
              >
                Code by Jonas
              </a>
            </div>

            <div className="hidden md:block">
              <h1 className="opacity-65 ">Email:</h1>
              <h1>rustamkerimov@gmail.com</h1>
            </div>

            <div className="hidden md:block">
              <h1 className="opacity-65">Phone:</h1>
              <h1>+47 45 26 81 63</h1>
            </div>

            <div>
              <h1 className="opacity-65">Location:</h1>
              <h1>Oslo, Norway</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
