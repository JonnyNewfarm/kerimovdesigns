"use client";

import { motion } from "framer-motion";

import TextReveal from "@/components/TextReveal";

import { contactEase } from "./contactAnimations";

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email";
  placeholder: string;
  required?: boolean;
  delay?: number;
};

export default function FormField({
  id,
  name,
  label,
  type,
  placeholder,
  required = true,
  delay = 0,
}: FormFieldProps) {
  return (
    <div>
      <TextReveal
        as="label"
        htmlFor={id}
        viewport={false}
        delay={delay}
        duration={0.65}
        y="100%"
        className="
          mb-4
          block
          text-[11px]
          uppercase
          opacity-90
        "
      >
        {label}
      </TextReveal>

      <motion.input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: delay + 0.04,
          duration: 0.75,
          ease: contactEase,
        }}
        className="
          w-full
          border-b
          border-[#ecdfcc]/35
          bg-transparent
          pb-5
          text-2xl
          text-[#ecdfcc]
          outline-none
          transition-colors
          duration-300
          placeholder:text-[#ecdfcc]/30
          focus:border-[#ecdfcc]
          md:text-4xl
        "
      />
    </div>
  );
}
