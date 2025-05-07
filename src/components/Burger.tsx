"use client";
import React from "react";

const Burger = () => {
  return (
    <div className="z-40 fixed right-0 top-0 h-[100vh] p-20 bg-[#ecebeb] text-[#443c3c]">
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col text-2xl text-#443c3c gap-3">
          <div className="flex gap-y-6 flex-col">
            <h1 className="text-3xl font-semibold">Navigation</h1>
            <a className="hover-underline" href={"/"}>
              Home
            </a>
            <a className="hover-underline" href={"/projects"}>
              My work
            </a>

            <a className="hover-underline" href={"/contact"}>
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Burger;
