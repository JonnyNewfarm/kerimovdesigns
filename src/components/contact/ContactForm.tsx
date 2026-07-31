"use client";

import { motion } from "framer-motion";

import TextReveal from "@/components/TextReveal";

import MagneticComp from "@/components/MagneticComp";
import FormField from "./FormField";
import { contactEase } from "./contactAnimations";

export default function ContactForm() {
  return (
    <form
      className="
        grid
        gap-x-10
        gap-y-12
        md:grid-cols-2
      "
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FormField
        id="name"
        name="name"
        label="Your name"
        type="text"
        placeholder="Name"
        delay={0.54}
      />

      <FormField
        id="email"
        name="email"
        label="Your email"
        type="email"
        placeholder="Email address"
        delay={0.59}
      />

      <FormField
        id="company"
        name="company"
        label="Company"
        type="text"
        placeholder="Company name"
        required={false}
        delay={0.64}
      />

      <FormField
        id="project"
        name="project"
        label="Project type"
        type="text"
        placeholder="Identity, motion, logo..."
        delay={0.69}
      />

      <div className="md:col-span-2">
        <TextReveal
          as="label"
          htmlFor="message"
          viewport={false}
          delay={0.74}
          duration={0.65}
          y="100%"
          className="
            mb-4
            block
            text-[11px]
            uppercase
            opacity-80
          "
        >
          Tell me about the project
        </TextReveal>

        <motion.textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Project details, timing and budget..."
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.78,
            duration: 0.75,
            ease: contactEase,
          }}
          className="
            w-full
            resize-none
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

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.84,
          duration: 0.75,
          ease: contactEase,
        }}
        className="
          flex
          justify-end
          md:col-span-2
        "
      >
        <MagneticComp>
          <button
            type="submit"
            className="
              group
              relative
              flex
              cursor-pointer
              items-center
              justify-center
              overflow-hidden
              border
              border-[#ecdfcc]
              py-4
              text-xl
              uppercase
              hover:border-[#667a6c]
            "
          >
            <span
              className="
                absolute
                inset-0
                origin-bottom
                scale-y-0
                bg-[#667a6c]
                transition-transform
                duration-500
                ease-[cubic-bezier(0.76,0,0.24,1)]
                group-hover:scale-y-100
              "
            />

            <TextReveal
              as="span"
              viewport={false}
              delay={0.88}
              duration={0.7}
              y="100%"
              className="relative z-10 px-4"
            >
              Submit inquiry
            </TextReveal>
          </button>
        </MagneticComp>
      </motion.div>
    </form>
  );
}
