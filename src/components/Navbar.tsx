"use client";

import React from "react";
import { usePathname } from "next/navigation";
import WaveLinkText from "./WaveLink";
import TransitionLink from "./TransitionLink";
import { useProjectNav } from "./ProjectNavContext";

const Navbar = () => {
  const pathname = usePathname();
  const { projectTitle } = useProjectNav();

  const isProjectDetailPage = pathname.startsWith("/project/");

  const getLinkClassName = (href: string) => {
    const isActive =
      pathname === href ||
      (href === "/projects" &&
        (pathname.startsWith("/projects") || pathname.startsWith("/project/")));

    return [
      "inline-block transition-opacity duration-300",
      isActive ? "opacity-100" : "opacity-80 hover:opacity-100",
    ].join(" ");
  };

  return (
    <div className="fixed top-0 z-[9999] hidden w-full md:block">
      <div className="bg-dark text-color z-50 flex w-full items-start justify-between px-20 py-3 text-[16px] font-extrabold">
        <div className="h-full w-full">
          <div className="flex items-start justify-between">
            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Name:</h1>
              <p className="m-0 leading-tight">Rustam Kerimov</p>
            </div>

            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Occupation:</h1>
              <p className="m-0 leading-tight">Graphic designer</p>
            </div>

            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Location:</h1>
              <p className="m-0 leading-tight">Oslo, Norway</p>
            </div>

            <div className="tracking-tighter">
              <h1 className="m-0 leading-none opacity-70">Navigation:</h1>

              <div className="m-0 flex gap-x-1 leading-tight">
                <TransitionLink
                  href="/"
                  transitionLabel="Welcome Back"
                  direction="right"
                  className={getLinkClassName("/")}
                >
                  <WaveLinkText text="Home," />
                </TransitionLink>

                <div className="relative inline-block">
                  <TransitionLink
                    href="/projects"
                    transitionLabel="Selected Work"
                    direction="left"
                    className={getLinkClassName("/projects")}
                  >
                    <WaveLinkText text="My work," />
                  </TransitionLink>

                  {isProjectDetailPage && projectTitle && (
                    <div className="absolute left-1/2 top-full mt-[3px] whitespace-nowrap">
                      <div className="flex items-end -translate-x-full">
                        <span className="mr-2 mb-[-2px] max-w-[240px] truncate text-[10px] font-black uppercase leading-none tracking-[0.18em] opacity-55">
                          {projectTitle}
                        </span>

                        <span
                          aria-hidden="true"
                          className="block h-[1.5px] w-10 bg-current opacity-55"
                        />

                        <span
                          aria-hidden="true"
                          className="block h-7 w-[1.5px] bg-current opacity-55"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <TransitionLink
                  href="/contact"
                  transitionLabel="Let's Collaborate"
                  direction="right"
                  className={getLinkClassName("/contact")}
                >
                  <WaveLinkText text="Contact" />
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
