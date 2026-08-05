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
  value: string;
  error?: string;
  required?: boolean;
  delay?: number;
  autoComplete?: string;
  onChangeAction: (value: string) => void;
  onBlurAction: () => void;
};

export default function FormField({
  id,
  name,
  label,
  type,
  placeholder,
  value,
  error,
  required = true,
  delay = 0,
  autoComplete,
  onChangeAction,
  onBlurAction,
}: FormFieldProps) {
  const errorId = `${id}-error`;

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
          text-[12px]
          md:text-[16px]
          uppercase
          opacity-90
        "
      >
        {label}
        {!required ? " / Optional" : ""}
      </TextReveal>

      <motion.input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
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
        onChange={(event) => {
          onChangeAction(event.target.value);
        }}
        onBlur={onBlurAction}
        className={`
          w-full
          border-b
          bg-transparent
          pb-5
          text-2xl
          text-[#ecdfcc]
          outline-none
          transition-colors
          duration-300
          placeholder:text-[#ecdfcc]40
          md:text-4xl
          ${
            error
              ? "border-[#d6493a] focus:border-[#d6493a]"
              : "border-[#ecdfcc]/35 focus:border-[#ecdfcc]"
          }
        `}
      />

      <div className="min-h-6 pt-2">
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              ease: contactEase,
            }}
            className="
              text-[11px]
              uppercase
              tracking-[0.08em]
              text-[#d6493a]
            "
          >
            {error}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
