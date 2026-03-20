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
      <section className="min-h-screen border-b border-stone-400/20 bg-dark text-color">
        <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-7 pb-16 pt-32 sm:px-14 lg:px-20 xl:px-24">
          <div className="grid flex-1 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10 xl:gap-16">
            {/* Left side */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between"
            >
              <div>
                <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-white/45 sm:text-xs">
                  Contact / Start a project
                </p>

                <div className="max-w-[1100px]">
                  <h1 className="text-left  text-5xl uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl md:text-8xl xl:text-[10rem]">
                    Let&apos;s create
                  </h1>
                  <h1 className="text-left text-5xl uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl md:text-8xl xl:text-[10rem]">
                    a project
                  </h1>
                  <h1 className="text-left text-5xl uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl md:text-8xl xl:text-[10rem]">
                    together
                  </h1>
                </div>

                <p className="mt-8 max-w-[560px] text-sm leading-relaxed text-white/60 sm:text-base">
                  Have an idea, a brand, or a digital product that needs a
                  strong visual direction? Send a message and let&apos;s build
                  something with clarity, character, and intention.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-16 max-w-[900px]"
              >
                <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">
                      Name
                    </label>
                    <input
                      className="w-full border-b border-[#ecebeb]/60 bg-transparent px-0 py-5 text-base outline-none placeholder:text-white/25"
                      placeholder="Your name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    {submitted && validationErrors.name && (
                      <p className="mt-2 text-sm text-red-500">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">
                      Email
                    </label>
                    <input
                      className="w-full border-b border-[#ecebeb]/60 bg-transparent px-0 py-5 text-base outline-none placeholder:text-white/25"
                      placeholder="Your email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    {submitted && validationErrors.email && (
                      <p className="mt-2 text-sm text-red-500">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">
                      Organization
                    </label>
                    <input
                      className="w-full border-b border-[#ecebeb]/60 bg-transparent px-0 py-5 text-base outline-none placeholder:text-white/25"
                      placeholder="Studio, company or brand (optional)"
                      name="organization"
                      type="text"
                      value={form.organization}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">
                      Message
                    </label>
                    <textarea
                      className="min-h-[180px] w-full resize-none border-b border-[#ecebeb]/60 bg-transparent px-0 py-5 text-base outline-none placeholder:text-white/25"
                      placeholder="Tell me about your project, timeline, goals or ideas..."
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                    {submitted && validationErrors.message && (
                      <p className="mt-2 text-sm text-red-500">
                        {validationErrors.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="border border-[#ecebeb] px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSending
                      ? "Sending..."
                      : `Send ${window.innerWidth > 800 ? "message" : ""}`}
                  </button>

                  <p className="text-sm text-white/40">
                    Usually replies within a short time.
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Right side */}
            <motion.aside
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-4 xl:col-span-3 lg:pt-28"
            >
              <div className="flex h-full flex-col justify-between gap-14">
                <div className="space-y-12">
                  <div>
                    <h2 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/45 sm:text-xs">
                      Contact Details
                    </h2>
                    <span className="mb-4 block h-px w-full bg-[#ecebeb]/25" />
                    <div className="flex flex-col gap-2 text-sm sm:text-base">
                      <p>Rustam Kerimov</p>
                      <a
                        href="mailto:rustam-98@hotmail.com"
                        className="transition-opacity duration-300 hover:opacity-60"
                      >
                        rustam-98@hotmail.com
                      </a>
                      <a
                        href="tel:+4745268163"
                        className="transition-opacity duration-300 hover:opacity-60"
                      >
                        +47 45 26 81 63
                      </a>
                      <p>Oslo, Norway</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/45 sm:text-xs">
                      Socials
                    </h2>
                    <span className="mb-4 block h-px w-full bg-[#ecebeb]/25" />
                    <div className="flex flex-col gap-3 text-sm sm:text-base">
                      <a
                        className="transition-opacity duration-300 hover:opacity-60"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.instagram.com/rustam.kerim0v?igsh=MTlhcjl5YzV0bm15cQ%3D%3D&utm_source=qr"
                      >
                        Instagram
                      </a>
                      <a
                        className="transition-opacity duration-300 hover:opacity-60"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://linkedin.com/in/rustam-kerimov-75bb5a331"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>

                <div className="max-w-[260px]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 sm:text-xs">
                    Availability
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                    Available for freelance projects, visual identities, and
                    digital design work.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ContactClient;
