"use client";

import React, { useEffect, useRef, useState } from "react";
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

type SentenceInputProps = {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  type?: "text" | "email";
  required?: boolean;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

function SentenceInput({
  id,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  className = "",
  inputRef,
  onChange,
}: SentenceInputProps) {
  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`mx-2 mb-2 inline-block min-w-[220px] max-w-full border-0 bg-transparent px-1 pb-1 text-[0.82em] font-black leading-none text-[#a3b18a] outline-none transition placeholder:text-[#a3b18a]/65 focus:text-color md:min-w-[320px] ${className}`}
    />
  );
}

type SentenceTextareaProps = {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

function SentenceTextarea({
  id,
  name,
  value,
  placeholder,
  required = false,
  onChange,
}: SentenceTextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        scrollbarColor: "rgba(245, 236, 220, 0.35) transparent",
        scrollbarWidth: "thin",
      }}
      className="max-h-[360px] min-h-[100px] w-full resize-none overflow-y-auto border-0 bg-transparent px-0 pb-4 pr-5 text-[clamp(2rem,4.4vw,5rem)] font-black normal-case leading-[1.08] tracking-[-0.035em] text-[#a3b18a] outline-none transition placeholder:text-[#a3b18a]/65 focus:text-color [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-color/25 [&::-webkit-scrollbar-thumb]:transition [&::-webkit-scrollbar-thumb:hover]:bg-color/45"
    />
  );
}

const ContactClient = () => {
  const nameInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    nameInputRef.current?.focus({ preventScroll: true });
  }, []);

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

        requestAnimationFrame(() => {
          nameInputRef.current?.focus({ preventScroll: true });
        });
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
      <section className="min-h-screen overflow-clip bg-dark px-4 pb-12 pt-28 text-color md:px-10 md:pb-16 md:pt-36 lg:px-16">
        <div className="mx-auto w-full max-w-[1800px]">
          {/* HERO */}
          {/* HERO */}
          <div className="grid min-h-[calc(100svh-7rem)] grid-cols-1 items-end gap-8 pb-16 md:grid-cols-[1fr_0.7fr] md:pb-20 lg:pb-24">
            <div>
              <TextReveal
                as="p"
                mode="words"
                delay={0.05}
                className="mb-6 text-xs font-black uppercase tracking-[0.28em] text-color/45 "
              >
                Contact / Start a project
              </TextReveal>

              <TextReveal
                as="h1"
                mode="lines"
                delay={0.12}
                className="max-w-[1050px] text-[clamp(3.6rem,6.2vw,7.2rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-color"
              >
                {`Let's 
work on a project
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

          {/* BRIEF */}
          {/* BRIEF */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-20">
            {" "}
            {/* LEFT SIDE */}
            <aside className="order-2 lg:sticky lg:top-28 lg:order-1">
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
                className="grid grid-cols-1 gap-10 text-sm font-black uppercase tracking-[0.18em] text-color/70 sm:grid-cols-2 lg:grid-cols-1"
              >
                {/* DETAILS */}
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

                {/* SOCIALS */}
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

                {/* AVAILABILITY */}
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
            {/* RIGHT SIDE / FORM */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="order-1 lg:order-2"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                  filter: "blur(8px)",
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.9,
                  ease,
                }}
              >
                <div className="max-w-[1250px]">
                  <TextReveal
                    as="p"
                    mode="words"
                    className="mb-10 text-xs font-black uppercase tracking-[0.24em] text-color/35"
                  >
                    Fill the brief
                  </TextReveal>

                  <div className="text-[clamp(2.25rem,5.4vw,5.9rem)] font-black normal-case leading-[1.12] tracking-[-0.035em] text-color">
                    <p>
                      Hey Rustam, my name is{" "}
                      <SentenceInput
                        inputRef={nameInputRef}
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="your name"
                        required
                      />
                    </p>

                    <p className="mt-2 md:mt-3">
                      and I’m from{" "}
                      <SentenceInput
                        id="organization"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="studio / company"
                      />
                    </p>

                    <p className="mt-2 md:mt-3">
                      You can reach me at{" "}
                      <SentenceInput
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your email"
                        required
                        className="md:min-w-[440px]"
                      />
                    </p>
                  </div>

                  <div className="mt-10 md:mt-12">
                    <label
                      htmlFor="message"
                      className="mb-4 block text-[clamp(2.25rem,5.4vw,5.9rem)] font-black normal-case leading-[1.12] tracking-[-0.035em] text-color"
                    >
                      Message
                    </label>

                    <SentenceTextarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me what you want to make..."
                      required
                    />
                  </div>

                  {submitted &&
                    (validationErrors.name ||
                      validationErrors.email ||
                      validationErrors.message) && (
                      <div className="mt-10 flex flex-col gap-2 text-sm font-black uppercase tracking-[0.16em] text-red-500">
                        {validationErrors.name && (
                          <p>{validationErrors.name}</p>
                        )}

                        {validationErrors.email && (
                          <p>{validationErrors.email}</p>
                        )}

                        {validationErrors.message && (
                          <p>{validationErrors.message}</p>
                        )}
                      </div>
                    )}

                  <FadeIn
                    delay={0.18}
                    y={24}
                    className="mt-8 flex flex-col gap-5 pb-24 sm:flex-row sm:items-center lg:pb-40"
                  >
                    <button
                      type="submit"
                      disabled={isSending}
                      className="group relative w-fit cursor-pointer overflow-hidden border border-color bg-color px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-dark transition disabled:cursor-not-allowed disabled:opacity-40 md:text-lg"
                    >
                      <WaveLinkText
                        text={isSending ? "Sending..." : "Send message"}
                      />
                    </button>

                    <p className="max-w-[420px] text-sm font-bold leading-[1.35] text-color/40">
                      Start with your name and send your project message.
                    </p>
                  </FadeIn>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ContactClient;
