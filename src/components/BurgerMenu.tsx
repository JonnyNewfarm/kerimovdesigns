"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Burger from "./Burger";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 mr-5 z-50 cursor-pointer"
      >
        <span
          className={`flex items-center gap-2 text-lg font-semibold ${
            isOpen ? "text-black" : "text-color"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-[#ecdfcc] block" />
          {isOpen ? "Close" : "Menu"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <div ref={menuRef}>
            <Burger key="burger" closeMenu={() => setIsOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
