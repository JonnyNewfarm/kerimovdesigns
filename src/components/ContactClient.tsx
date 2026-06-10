"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[1fr_0.7fr] md:items-end lg:mb-24"
          >
            <div>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.28em] text-color/45 md:text-sm">
                Contact / Start a project
              </p>

              <h1 className="max-w-[1250px] text-[17vw] font-black uppercase leading-[0.78] tracking-[-0.05em] text-color md:text-[10vw] lg:text-[8vw]">
                Let&apos;s create <br />
                a project
                <br />
                together{" "}
              </h1>
            </div>

            <p className="max-w-[520px] text-base font-bold leading-[1.35] text-color/55 md:justify-self-end md:text-right md:text-lg">
              Send a message about identity, motion, logos or visual direction.
              Keep it simple — what you need, when you need it and what you want
              it to feel like.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <motion.aside
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-1 gap-10 text-sm font-black uppercase tracking-[0.18em] text-color/70 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1">
                <div>
                  <p className="mb-3 text-xs tracking-[0.24em] text-color/35">
                    Details
                  </p>

                  <div className="flex flex-col gap-2">
                    <p>Rustam Kerimov</p>

                    <a
                      href="mailto:rustam-98@hotmail.com"
                      className="normal-case tracking-normal transition hover:text-color"
                    >
                      rustam-98@hotmail.com
                    </a>

                    <a
                      href="tel:+4745268163"
                      className="transition hover:text-color"
                    >
                      +47 45 26 81 63
                    </a>

                    <p>Oslo, Norway</p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs tracking-[0.24em] text-color/35">
                    Socials
                  </p>

                  <div className="flex flex-col gap-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.instagram.com/rustam.kerim0v?igsh=MTlhcjl5YzV0bm15cQ%3D%3D&utm_source=qr"
                      className="transition hover:text-color"
                    >
                      Instagram
                    </a>

                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://linkedin.com/in/rustam-kerimov-75bb5a331"
                      className="transition hover:text-color"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs tracking-[0.24em] text-color/35">
                    Availability
                  </p>

                  <p className="max-w-[340px] text-base font-bold normal-case leading-[1.35] tracking-normal text-color/55">
                    Available for visual identities, motion pieces, logos and
                    selected design projects.
                  </p>
                </div>
              </div>
            </motion.aside>

            <motion.form
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 34, filter: "blur(7px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.95,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45">
                    Name
                  </label>

                  <input
                    className="w-full border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold text-color outline-none transition placeholder:text-color/25 focus:border-color md:text-xl"
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
                </div>

                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45">
                    Email
                  </label>

                  <input
                    className="w-full border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold text-color outline-none transition placeholder:text-color/25 focus:border-color md:text-xl"
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
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45">
                    Organization
                  </label>

                  <input
                    className="w-full border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold text-color outline-none transition placeholder:text-color/25 focus:border-color md:text-xl"
                    placeholder="Studio, company or brand — optional"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] text-color/45">
                    Message
                  </label>

                  <textarea
                    className="min-h-[220px] w-full resize-none border-b border-stone-400/30 bg-transparent py-5 text-lg font-bold leading-[1.35] text-color outline-none transition placeholder:text-color/25 focus:border-color md:text-xl"
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
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isSending}
                  className="group w-fit overflow-hidden bg-color border cursor-pointer px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-dark transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-[2px]">
                    {isSending ? "Sending..." : "Send message"}
                  </span>
                </button>

                <p className="max-w-[360px] text-sm font-bold leading-[1.35] text-color/40">
                  Usually replies within a short time.
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ContactClient;
