"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Burger from "./Burger";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 mr-5 z-50 cursor-pointer"
      >
        <span
          className={`text-lg font-semibold ${isOpen ? "text-black" : "text-white"}`}
        >
          {isOpen ? "Close" : "Menu"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && <Burger key="burger" />}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
