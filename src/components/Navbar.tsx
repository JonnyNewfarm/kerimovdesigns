import React from "react";
import BurgerMenu from "./BurgerMenu";

const Navbar = () => {
  return (
    <div className="bg-[#242323]  font-extrabold text-[16px] text-[#ecebeb] px-20 py-3 flex items-center sticky top-0 z-50 w-full justify-between">
      <div>
        <h1 className="font-serif lg:hidden font-semibold text-3xl fixed left-6 top-7">
          Rustam K
        </h1>
      </div>
      <BurgerMenu />
      <div className="w-full h-full hidden lg:block">
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
              <a href={"/"}>Home,</a>
              <a href={"/projects"}>My work,</a>
              <a href={"/contact"}>Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
