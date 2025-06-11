import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className="text-color relative h-[420px] bg-dark"
    >
      <div className="relative h-[calc(100vh+420px)] -top-[100vh] flex-col justify-start">
        <div className="h-[420px] text-[#ecebeb] p-14 sticky top-[calc(100vh-420px)] flex flex-col justify-between">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between">
              <div className="">
                <div className="flex gap-x-10">
                  <div className="hidden md:block">
                    <div className="flex flex-col justify-start text-2xl font-light">
                      <h1 className="opacity-70">Navigation</h1>
                      <Link href={"/"}>Home</Link>
                      <Link href={"/projects"}>My Work</Link>
                      <Link href={"/contact"}>Contact</Link>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-start flex-col text-2xl font-light">
                      <h1 className="opacity-70">Socials</h1>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.instagram.com/rustam.kerim0v?igsh=MTlhcjl5YzV0bm15cQ%3D%3D&utm_source=qr"
                      >
                        Instagram
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://linkedin.com/in/rustam-kerimov-75bb5a331"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <h1 className="opacity-65">Created by:</h1>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex underline items-center gap-x-1"
                  href="https://www.jonasnygaard.com/"
                >
                  Newfarm Studio
                </a>
              </div>

              <div className="hidden md:block">
                <h1 className="opacity-65">Email:</h1>
                <h1>rustam-98@hotmail.com</h1>
              </div>

              <div className="hidden md:block">
                <h1 className="opacity-65">Phone:</h1>
                <h1>+47 45 26 81 63</h1>
              </div>

              <div>
                <h1 className="opacity-65">Location:</h1>
                <h1>Oslo, Norway</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
