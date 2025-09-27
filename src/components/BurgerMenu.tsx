"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="right-0 mr-5 absolute top-2 flex items-center justify-center lg:hidden cursor-pointer z-50"
      >
        <span
          className={`text-lg font-normal px-2 py-2 rounded flex items-center gap-2 ${
            isOpen ? "text-color" : "text-color"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#ecdfcc] inline-block" />
          {isOpen ? "Close" : "Menu"}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            key="menu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="z-40 fixed right-0 top-0 h-[100vh] w-[80vw] p-20 
             bg-gradient-to-br from-[#181c14] via-[#2d2d2ae6] to-[#1c1a17a9]
             backdrop-blur-md text-stone-300"
          >
            <div className="flex justify-center items-center h-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex flex-col text-xl text-white gap-3"
              >
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col gap-6 text-2xl text-stone-50">
                    <h1 className="text-3xl font-semibold">Navigation</h1>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/"
                      className="hover-underline"
                    >
                      Home
                    </Link>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/projects"
                      className="hover-underline"
                    >
                      My work
                    </Link>
                    <Link
                      onClick={() => setIsOpen(false)}
                      href="/contact"
                      className="hover-underline"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
