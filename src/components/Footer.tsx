"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import WaveLinkText from "./WaveLink";
import TextReveal from "@/components/TextReveal";
import TransitionLink from "./TransitionLink";

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
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-between pt-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <TextReveal
              as="p"
              mode="words"
              delay={0.04}
              className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-color/45 md:text-sm"
            >
              Contact / Availability
            </TextReveal>

            <TextReveal
              as="h2"
              mode="lines"
              delay={0.1}
              className="max-w-[1200px] text-[12vw] font-black uppercase leading-[0.78] tracking-[-0.03em] text-color md:text-[6vw] lg:text-[6.5vw]"
            >
              {`Let’s turn
ideas into visuals.`}
            </TextReveal>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-1 md:justify-self-end md:text-right">
            <div>
              <TextReveal
                as="p"
                mode="words"
                delay={0.12}
                className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-color/40"
              >
                Navigation
              </TextReveal>

              <div className="flex flex-col gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-color/80 md:text-3xl">
                <TransitionLink
                  href="/"
                  transitionLabel="Home"
                  className="transition hover:text-color"
                >
                  <WaveLinkText text="Home" />
                </TransitionLink>

                <TransitionLink
                  href="/projects"
                  transitionLabel="My work"
                  className="transition hover:text-color"
                >
                  <WaveLinkText text="My work" />
                </TransitionLink>

                <TransitionLink
                  href="/contact"
                  transitionLabel="Contact"
                  className="transition hover:text-color"
                >
                  <WaveLinkText text="Contact" />
                </TransitionLink>
              </div>
            </div>

            <div>
              <TextReveal
                as="p"
                mode="words"
                delay={0.16}
                className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-color/40"
              >
                Socials
              </TextReveal>

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
            <TextReveal
              as="p"
              mode="words"
              delay={0.05}
              className="mb-1 text-color/35"
            >
              Created by
            </TextReveal>

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
            <TextReveal
              as="p"
              mode="words"
              delay={0.08}
              className="mb-1 text-color/35"
            >
              Email
            </TextReveal>

            <a
              href="mailto:rustam-98@hotmail.com"
              className="normal-case tracking-normal transition hover:text-color"
            >
              rustam-98@hotmail.com
            </a>
          </div>

          <div>
            <TextReveal
              as="p"
              mode="words"
              delay={0.11}
              className="mb-1 text-color/35"
            >
              Local time
            </TextReveal>

            <p>{time}</p>
          </div>

          <div className="md:text-right">
            <TextReveal
              as="p"
              mode="words"
              delay={0.14}
              className="mb-1 text-color/35"
            >
              Location
            </TextReveal>

            <p>Oslo, Norway</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
