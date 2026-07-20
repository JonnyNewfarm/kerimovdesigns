import React from "react";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import { FaRegCopyright } from "react-icons/fa";
import TransitionLink from "./TransitionLink";

const NavbarMobile = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between  transparent px-6 py-4 text-color  lg:hidden">
      <TransitionLink
        href="/"
        transitionLabel="Home"
        className="flex items-center justify-center gap-x-2 text-sm uppercase tracking-[0.18em]"
      >
        {" "}
        <h1 className="tracking-[-0.02em] font-black"> Kerimov Designs</h1>
      </TransitionLink>
      <Link href="/"></Link>

      <BurgerMenu />
    </div>
  );
};

export default NavbarMobile;
