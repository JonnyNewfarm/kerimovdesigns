"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import WaveLinkText from "./WaveLink";
import TextReveal from "./TextReveal";

const ease = [0.22, 1, 0.36, 1] as const;

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 28,
  amount = 0.25,
}: FadeInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type AnimatedFieldProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

function AnimatedField({
  children,
  delay = 0,
  className = "",
}: AnimatedFieldProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 26,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.85,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const ContactClient = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (validationErrors[e.target.name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!form.name.trim()) errors.name = "Name is required.";

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Email must be valid.";
    }

    if (!form.message.trim()) {
      errors.message = "Message is required.";
    } else if (form.message.length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    setIsSending(true);

    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent!");
        setForm({ name: "", email: "", organization: "", message: "" });
        setValidationErrors({});
        setSubmitted(false);
      } else {
        toast.error("Something went wrong.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SmoothScroll>
      <section className="min-h-screen overflow-hidden bg-dark px-4 pb-12 pt-28 text-color md:px-10 md:pb-16 md:pt-36 lg:px-16">
        <div className="mx-auto w-full max-w-[1800px]">
          {/* HERO */}
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.7fr] md:items-end lg:mb-24">
            <div>
              <TextReveal
                as="p"
                mode="words"
                delay={0.05}
                className="mb-6 text-xs font-black uppercase tracking-[0.28em] text-color/45 md:text-sm"
              >
                Contact / Start a project
              </TextReveal>

              <TextReveal
                as="h1"
                mode="lines"
                delay={0.12}
                className="max-w-[1250px] text-[12vw] font-black uppercase leading-[0.86] tracking-[-0.02em] text-color md:text-[10vw] lg:text-[8vw]"
              >
                {`Let's create
a project
together`}
              </TextReveal>
            </div>

            <TextReveal
              as="p"
              mode="words"
              delay={0.35}
              className="max-w-[520px] text-base font-bold leading-[1.35] text-color/55 md:justify-self-end md:text-right md:text-lg"
            >
              Send a message about identity, motion, logos or visual direction.
              Keep it simple — what you need, when you need it and what you want
              it to feel like.
            </TextReveal>
          </div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            {/* DETAILS */}
            <aside className="order-2 lg:order-1">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
                className="grid grid-cols-1 gap-10 text-sm font-black uppercase tracking-[0.18em] text-color/70 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1"
              >
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.85,
                        ease,
                      },
                    },
                  }}
                >
                  <TextReveal
                    as="p"
                    mode="words"
                    className="mb-3 text-xs tracking-[0.24em] text-color/35"
                  >
                    Details
                  </TextReveal>

                  <div className="flex flex-col gap-2">
                    <p>Rustam Kerimov</p>

                    <a
                      href="mailto:rustam-98@hotmail.com"
                      className="w-fit normal-case tracking-normal"
                    >
                      <WaveLinkText text="rustam-98@hotmail.com" />
                    </a>

                    <a href="tel:+4745268163" className="w-fit">
                      <WaveLinkText text="+47 45 26 81 63" />
                    </a>

                    <p>Oslo, Norway</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.85,
                        ease,
                      },
                    },
                  }}
                >
                  <TextReveal
                    as="p"
                    mode="words"
                    className="mb-3 text-xs tracking-[0.24em] text-color/35"
                  >
                    Socials
                  </TextReveal>

                  <div className="flex flex-col gap-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.instagram.com/rustam.kerim0v?igsh=MTlhcjl5YzV0bm15cQ%3D%3D&utm_source=qr"
                      className="w-fit"
                    >
                      <WaveLinkText text="Instagram" />
                    </a>

                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://linkedin.com/in/rustam-kerimov-75bb5a331"
                      className="w-fit"
                    >
                      <WaveLinkText text="LinkedIn" />
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.85,
                        ease,
                      },
                    },
                  }}
                >
                  <TextReveal
                    as="p"
                    mode="words"
                    className="mb-3 text-xs tracking-[0.24em] text-color/35"
                  >
                    Availability
                  </TextReveal>

                  <p className="max-w-[340px] text-base font-bold normal-case leading-[1.35] tracking-normal text-color/55">
                    Available for visual identities, motion pieces, logos and
                    selected design projects.
                  </p>
                </motion.div>
              </motion.div>
            </aside>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2">
                <AnimatedField delay={0.02}>
                  <TextReveal
                    as="label"
                    htmlFor="name"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45"
                  >
                    Name
                  </TextReveal>

                  <input
                    id="name"
                    className="w-full border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold text-color outline-none transition duration-500 placeholder:text-color/25 focus:border-color md:text-xl"
                    placeholder="Your name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  {submitted && validationErrors.name && (
                    <p className="mt-3 text-sm font-bold text-red-500">
                      {validationErrors.name}
                    </p>
                  )}
                </AnimatedField>

                <AnimatedField delay={0.08}>
                  <TextReveal
                    as="label"
                    htmlFor="email"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45"
                  >
                    Email
                  </TextReveal>

                  <input
                    id="email"
                    className="w-full border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold text-color outline-none transition duration-500 placeholder:text-color/25 focus:border-color md:text-xl"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                  {submitted && validationErrors.email && (
                    <p className="mt-3 text-sm font-bold text-red-500">
                      {validationErrors.email}
                    </p>
                  )}
                </AnimatedField>

                <AnimatedField delay={0.14} className="md:col-span-2">
                  <TextReveal
                    as="label"
                    htmlFor="organization"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45"
                  >
                    Organization
                  </TextReveal>

                  <input
                    id="organization"
                    className="w-full border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold text-color outline-none transition duration-500 placeholder:text-color/25 focus:border-color md:text-xl"
                    placeholder="Studio, company or brand — optional"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                  />
                </AnimatedField>

                <AnimatedField delay={0.2} className="md:col-span-2">
                  <TextReveal
                    as="label"
                    htmlFor="message"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45"
                  >
                    Message
                  </TextReveal>

                  <textarea
                    id="message"
                    className="min-h-[220px] w-full resize-none border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold leading-[1.35] text-color outline-none transition duration-500 placeholder:text-color/25 focus:border-color md:text-xl"
                    placeholder="Tell me what you want to make..."
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />

                  {submitted && validationErrors.message && (
                    <p className="mt-3 text-sm font-bold text-red-500">
                      {validationErrors.message}
                    </p>
                  )}
                </AnimatedField>
              </div>

              <FadeIn
                delay={0.18}
                y={24}
                className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center"
              >
                <button
                  type="submit"
                  disabled={isSending}
                  className="group relative w-fit cursor-pointer overflow-hidden border border-color bg-color px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-dark transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <WaveLinkText
                    text={isSending ? "Sending..." : "Send message"}
                  />
                </button>

                <p className="max-w-[360px] text-sm font-bold leading-[1.35] text-color/40">
                  Usually replies within a short time.
                </p>
              </FadeIn>
            </form>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ContactClient;
