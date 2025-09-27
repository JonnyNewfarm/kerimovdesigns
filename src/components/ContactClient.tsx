"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import MagneticComp from "./MagneticComp";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <div className="min-h-screen w-full md:pt-32 text-color border-b-[1px] border-white/50 gap-y-16 flex flex-col-reverse lg:gap-x-10 lg:flex-row justify-between py-16 px-10 lg:px-30 xl:px-40 bg-dark">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{
            scale: [0.8, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 0.7,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-20"
        >
          <div className="lg:text-7xl hidden lg:block uppercase font-semibold sm:text-5xl text-5xl">
            <h1>Let&apos;s create a</h1>
            <h1>project together</h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center"
            noValidate
          >
            <div>
              <input
                className="py-6 border-b-1 px-4 border-b-[#ecebeb] text-lg border-t-1 w-full"
                placeholder="Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
              {submitted && validationErrors.name && (
                <p className="text-red-700 text-sm mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <input
                className="py-6 border-b-1 px-4 text-lg border-b-[#ecebeb] w-full"
                placeholder="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {submitted && validationErrors.email && (
                <p className="text-red-700 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <input
                className="py-6 border-b-1 px-4 text-lg border-b-[#ecebeb] w-full"
                placeholder="Organization (optional)"
                name="organization"
                type="text"
                value={form.organization}
                onChange={handleChange}
              />
            </div>

            <div>
              <textarea
                className="min-h-[150px] px-4 py-6 text-lg border-b-1 border-b-[#ecebeb] w-full"
                placeholder="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              />
              {submitted && validationErrors.message && (
                <p className="text-red-700 text-sm mt-1">
                  {validationErrors.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 ml-5 border-2 hover:scale-103 transition-transform ease-in-out font-semibold max-w-[200px] text-lg cursor-pointer border-[#ecebeb] py-2 px-6"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{
            scale: [0.8, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.4, 1],
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-10  mt-14 lg:mt-[215px] xl:mt-[260px]"
        >
          <div className="sm:text-6xl text-4xl uppercase lg:hidden">
            <h1>Let&apos;s create a</h1>
            <h1>project together</h1>
          </div>
          <div className="gap-y-2 flex text-stone-50 flex-col">
            <h1 className="opacity-70 ">Contact details</h1>
            <p>Rustam Kerimov</p>
            <p>rustam-98@hotmail.com</p>
            <p>+47 45 26 81 63</p>
            <p>Oslo, Norway</p>
          </div>

          <div className="gap-y-2 flex text-stone-50 flex-col">
            <h1 className="opacity-70 ">Socials</h1>
            <a
              className="hover:scale-105 transition-transform ease-in-out"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/rustam.kerim0v?igsh=MTlhcjl5YzV0bm15cQ%3D%3D&utm_source=qr"
            >
              Instagram
            </a>
            <a
              className="hover:scale-105 transition-transform ease-in-out"
              target="_blank"
              rel="noopener noreferrer"
              href="https://linkedin.com/in/rustam-kerimov-75bb5a331"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </SmoothScroll>
  );
};

export default ContactClient;
