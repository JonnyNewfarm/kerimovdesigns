"use client";

import { motion } from "framer-motion";

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
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        filter: "blur(4px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.62,
        delay,
        ease: contactEase,
      }}
      className="
        min-w-0
        will-change-[transform,opacity,filter]
      "
    >
      {/* =================================================
          LABEL
      ================================================= */}

      <label
        htmlFor={id}
        className="
          mb-2
          block

          text-[12px]
          font-black
          uppercase
          tracking-[0.08em]

          text-[#ece7e1]
        "
      >
        {label}
        {!required ? " / Optional" : ""}
      </label>

      {/* =================================================
          INPUT
      ================================================= */}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          onChangeAction(event.target.value);
        }}
        onBlur={onBlurAction}
        className={`
          block

          w-full
          min-w-0
          max-w-full

          border-b

          bg-transparent

          pb-2.5

          font-bueno

          text-[1.15rem]
          font-semibold

          leading-[1]

          text-[#ecdfcc]

          outline-none

          transition-colors
          duration-300

          placeholder:font-normal
          placeholder:text-[#ecdfcc]/50

          sm:text-[1.3rem]

          ${
            error
              ? `
                border-[#d6493a]
                focus:border-[#d6493a]
              `
              : `
                border-[#ecdfcc]/25
                focus:border-[#ecdfcc]/70
              `
          }
        `}
      />

      {/* =================================================
          ERROR
      ================================================= */}

      <div
        className="
          min-h-[16px]
          pt-1
        "
      >
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            initial={{
              opacity: 0,
              y: -3,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.28,
              ease: contactEase,
            }}
            className="
              text-[7px]
              font-black
              uppercase
              tracking-[0.08em]

              text-[#d6493a]

              sm:text-[8px]
            "
          >
            {error}
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}
