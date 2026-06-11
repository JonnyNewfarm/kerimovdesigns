"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import WaveLinkText from "./WaveLink";

const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-dark px-4 py-10 text-color md:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-between  pt-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-color/45 md:text-sm">
              Contact / Availability
            </p>

            <h2 className="max-w-[1200px] text-[12vw] font-black uppercase leading-[0.78] tracking-[-0.03em] text-color md:text-[6vw] lg:text-[6.5vw]">
              Let’s turn <br />
              ideas into visuals.{" "}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-1 md:justify-self-end md:text-right">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-color/40">
                Navigation
              </p>

              <div className="flex flex-col gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-color/80 md:text-3xl">
                <Link href="/" className="transition hover:text-color">
                  <WaveLinkText text="Home" />
                </Link>

                <Link href="/projects" className="transition hover:text-color">
                  <WaveLinkText text="My work" />
                </Link>

                <Link href="/contact" className="transition hover:text-color">
                  <WaveLinkText text="Contact" />
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-color/40">
                Socials
              </p>

              <div className="flex flex-col gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-color/80 md:text-3xl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.instagram.com/rustam.kerim0v?igsh=MTlhcjl5YzV0bm15cQ%3D%3D&utm_source=qr"
                  className="transition hover:text-color"
                >
                  <WaveLinkText text="Instagram" />
                </a>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://linkedin.com/in/rustam-kerimov-75bb5a331"
                  className="transition hover:text-color"
                >
                  <WaveLinkText text="LinkedIn" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-stone-400/20 pt-6 text-sm font-black uppercase tracking-[0.14em] text-color/70 md:grid-cols-4">
          <div>
            <p className="mb-1 text-color/35">Created by</p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.jonasnygaard.com/"
              className="transition hover:text-color"
            >
              <WaveLinkText text="Newfarm Studio" />
            </a>
          </div>

          <div>
            <p className="mb-1 text-color/35">Email</p>
            <a
              href="mailto:rustam-98@hotmail.com"
              className="normal-case tracking-normal transition hover:text-color"
            >
              rustam-98@hotmail.com
            </a>
          </div>

          <div>
            <p className="mb-1 text-color/35">Local time</p>
            <p>{time}</p>
          </div>

          <div className="md:text-right">
            <p className="mb-1 text-color/35">Location</p>
            <p>Oslo, Norway</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
