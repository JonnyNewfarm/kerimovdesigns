"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Burger = () => {
  const menuTransition = {
    initial: { x: "100%" },
    enter: {
      x: "0%",
      transition: { duration: 0.8, ease: [0.6, 0, 0.2, 1] },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.8, ease: [0.6, 0, 0.2, 1] },
    },
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-screen w-[75vw] bg-[#ecebeb] z-40 p-20"
      variants={menuTransition}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col gap-6 text-2xl text-[#443c3c]">
          <h1 className="text-3xl font-semibold">Navigation</h1>
          <Link href="/" className="hover-underline">
            Home
          </Link>
          <Link href="/projects" className="hover-underline">
            My work
          </Link>
          <Link href="/contact" className="hover-underline">
            Contact
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Burger;
