"use client";

import { useState } from "react";
import Burger from "./Burger";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 mr-5  flex items-center justify-center md:hidden cursor-pointer z-50"
      >
        <span
          className={`text-lg font-bold ${
            isOpen ? "text-black" : "text-white"
          }  px-4 py-2 rounded `}
        >
          {isOpen ? "Close" : "Menu"}
        </span>
      </div>
      {isOpen && <Burger />}
    </>
  );
};

export default BurgerMenu;
