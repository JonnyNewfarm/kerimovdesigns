import React from "react";
import BurgerMenu from "./BurgerMenu";

const NavbarMobile = () => {
  return (
    <div className="w-full z-50 text-white py-3 px-10 items-center bg-transparent fixed md:hidden flex justify-between">
      <div className="text-xl">Rustam K</div>

      <BurgerMenu />
    </div>
  );
};

export default NavbarMobile;
