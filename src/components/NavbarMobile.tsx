import React from "react";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import { FaRegCopyright } from "react-icons/fa";

const NavbarMobile = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between  bg-dark/70 px-6 py-4 text-color backdrop-blur-md md:hidden">
      <Link
        href="/"
        className="flex items-center justify-center gap-x-2 text-sm uppercase tracking-[0.18em]"
      >
        <FaRegCopyright size={14} />
        <h1>Kerimov Designs</h1>
      </Link>

      <BurgerMenu />
    </div>
  );
};

export default NavbarMobile;
