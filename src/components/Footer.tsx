"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className="text-color relative h-[420px] bg-dark"
    >
      <div className="relative h-[calc(100vh+420px)] -top-[100vh]">
        <div
          className="sticky top-[calc(100vh-420px)] h-[420px] flex flex-col justify-between p-6 md:p-14 text-[#ecebeb]"
          style={{
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-x-10">
            <div className="hidden md:flex flex-col text-2xl font-light">
              <h1 className="opacity-70 mb-2">Navigation</h1>
              <Link href={"/"}>Home</Link>
              <Link href={"/projects"}>My Work</Link>
              <Link href={"/contact"}>Contact</Link>
            </div>

            <div className="flex flex-col text-2xl font-light">
              <h1 className="opacity-70 mb-2">Socials</h1>
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

          {/* Bottom section: Info */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-x-4">
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
              <h1 className="opacity-65">My time:</h1>
              <h1>{time}</h1>
            </div>

            <div>
              <h1 className="opacity-65">Location:</h1>
              <h1>Oslo, Norway</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
