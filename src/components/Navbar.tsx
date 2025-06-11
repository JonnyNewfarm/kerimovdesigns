import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full hidden md:block fixed  top-0 z-[9999]">
      <div className="bg-dark  font-extrabold text-[16px] text-color md:px-20 md:py-3 flex  items-center  z-50 w-full justify-between">
        <div className="w-full h-full">
          <div className="flex items-center justify-between">
            <div className="tracking-tighter">
              <h1 className=" opacity-70 m-0 leading-none">Name:</h1>
              <p className=" m-0 leading-tight">Rustam Kerimov</p>
            </div>
            <div className="tracking-tighter">
              <h1 className=" opacity-70 m-0 leading-none">Occupation:</h1>
              <p className=" m-0 leading-tight">Graphic designer</p>
            </div>
            <div className="tracking-tighter">
              <h1 className=" opacity-70 m-0 leading-none">Location:</h1>
              <p className=" m-0 leading-tight">Oslo, Norway</p>
            </div>
            <div className="tracking-tighter">
              <h1 className=" opacity-70 m-0 leading-none">Naviation:</h1>
              <div className="flex gap-x-1  m-0 leading-tight">
                <Link href={"/"}>Home,</Link>
                <Link href={"/projects"}>My work,</Link>
                <Link href={"/contact"}>Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
