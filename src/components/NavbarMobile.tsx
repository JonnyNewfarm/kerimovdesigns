import React from "react";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";

const NavbarMobile = () => {
  return (
    <div className="w-full z-50 text-white py-3 px-10 items-center bg-transparent fixed md:hidden flex justify-between">
      <Link href="/" className="text-xl">
        Rustam K
      </Link>

      <BurgerMenu />
    </div>
  );
};

export default NavbarMobile;
