import React from "react";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import { FaRegCopyright } from "react-icons/fa";

const NavbarMobile = () => {
  return (
    <div className="w-full z-50 text-color py-3 px-10 items-center bg-transparent fixed md:hidden flex justify-between">
      <Link
        href="/"
        className="text-lg flex items-center mt-1 justify-center gap-x-1"
      >
        <FaRegCopyright size={18} />
        <h1 className="">Kerimov Designs</h1>
      </Link>

      <BurgerMenu />
    </div>
  );
};

export default NavbarMobile;
