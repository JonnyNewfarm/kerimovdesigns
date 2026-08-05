"use client";

import { motion } from "framer-motion";
import { type ChangeEvent, type FormEvent, useState } from "react";

import TextReveal from "@/components/TextReveal";
import MagneticComp from "@/components/MagneticComp";

import FormField from "./FormField";
import { contactEase } from "./contactAnimations";

type ContactFormValues = {
  name: string;
  email: string;
  company: string;
  project: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

type ContactFormTouched = Partial<Record<keyof ContactFormValues, boolean>>;

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  project: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (
  name: keyof ContactFormValues,
  value: string,
): string | undefined => {
  const trimmedValue = value.trim();

  switch (name) {
    case "name": {
      if (!trimmedValue) {
        return "Please enter your name.";
      }

      if (trimmedValue.length < 2) {
        return "Your name must contain at least 2 characters.";
      }

      return undefined;
    }

    case "email": {
      if (!trimmedValue) {
        return "Please enter your email address.";
      }

      if (!emailPattern.test(trimmedValue)) {
        return "Please enter a valid email address.";
      }

      return undefined;
    }

    case "company": {
      if (trimmedValue && trimmedValue.length < 2) {
        return "Company name must contain at least 2 characters.";
      }

      return undefined;
    }

    case "project": {
      if (!trimmedValue) {
        return "Please enter the type of project.";
      }

      if (trimmedValue.length < 3) {
        return "Project type must contain at least 3 characters.";
      }

      return undefined;
    }

    case "message": {
      if (!trimmedValue) {
        return "Please tell me a little about your project.";
      }

      if (trimmedValue.length < 20) {
        return "Please provide at least 20 characters.";
      }

      return undefined;
    }

    default:
      return undefined;
  }
};

const validateForm = (values: ContactFormValues): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  (Object.keys(values) as Array<keyof ContactFormValues>).forEach((name) => {
    const error = validateField(name, values[name]);

    if (error) {
      errors[name] = error;
    }
  });

  return errors;
};

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);

  const [errors, setErrors] = useState<ContactFormErrors>({});

  const [touched, setTouched] = useState<ContactFormTouched>({});

  const handleChange = (name: keyof ContactFormValues, value: string) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (!touched[name] && !errors[name]) {
      return;
    }

    const error = validateField(name, value);

    setErrors((previous) => {
      if (error) {
        return {
          ...previous,
          [name]: error,
        };
      }

      const nextErrors = { ...previous };

      delete nextErrors[name];

      return nextErrors;
    });
  };

  const handleBlur = (name: keyof ContactFormValues) => {
    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));

    const error = validateField(name, values[name]);

    setErrors((previous) => {
      if (error) {
        return {
          ...previous,
          [name]: error,
        };
      }

      const nextErrors = { ...previous };

      delete nextErrors[name];

      return nextErrors;
    });
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleChange("message", event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(values);

    setTouched({
      name: true,
      email: true,
      company: true,
      project: true,
      message: true,
    });

    setErrors(validationErrors);

    const firstErrorField = Object.keys(validationErrors)[0] as
      | keyof ContactFormValues
      | undefined;

    if (firstErrorField) {
      document.getElementById(firstErrorField)?.focus();

      return;
    }

    console.log("Valid form:", values);
  };

  const messageErrorId = "message-error";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="
        grid
        gap-x-10
        gap-y-12
        md:grid-cols-2
      "
    >
      <FormField
        id="name"
        name="name"
        label="Your name"
        type="text"
        placeholder="Name"
        value={values.name}
        error={errors.name}
        delay={0.54}
        autoComplete="name"
        onChangeAction={(value) => {
          handleChange("name", value);
        }}
        onBlurAction={() => {
          handleBlur("name");
        }}
      />

      <FormField
        id="email"
        name="email"
        label="Your email"
        type="email"
        placeholder="Email address"
        value={values.email}
        error={errors.email}
        delay={0.59}
        autoComplete="email"
        onChangeAction={(value) => {
          handleChange("email", value);
        }}
        onBlurAction={() => {
          handleBlur("email");
        }}
      />

      <FormField
        id="company"
        name="company"
        label="Company"
        type="text"
        placeholder="Company name"
        value={values.company}
        error={errors.company}
        required={false}
        delay={0.64}
        autoComplete="organization"
        onChangeAction={(value) => {
          handleChange("company", value);
        }}
        onBlurAction={() => {
          handleBlur("company");
        }}
      />

      <FormField
        id="project"
        name="project"
        label="Project type"
        type="text"
        placeholder="Identity, motion, logo..."
        value={values.project}
        error={errors.project}
        delay={0.69}
        autoComplete="off"
        onChangeAction={(value) => {
          handleChange("project", value);
        }}
        onBlurAction={() => {
          handleBlur("project");
        }}
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
            md:text-[16px]
            uppercase
            opacity-80
          "
        >
          Tell me about the project
        </TextReveal>

        <motion.textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          placeholder="Project details, timing and budget..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? messageErrorId : undefined}
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
          onChange={handleMessageChange}
          onBlur={() => {
            handleBlur("message");
          }}
          className={`
            w-full
            resize-none
            border-b
            bg-transparent
            pb-5
            text-2xl
            text-[#ecdfcc]
            outline-none
            transition-colors
            duration-300
            placeholder:text-[#ecdfcc]/30
            md:text-4xl
            ${
              errors.message
                ? "border-[#d6493a] focus:border-[#d6493a]"
                : "border-[#ecdfcc]/35 focus:border-[#ecdfcc]"
            }
          `}
        />

        <div className="min-h-6 pt-2">
          {errors.message ? (
            <motion.p
              id={messageErrorId}
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
              {errors.message}
            </motion.p>
          ) : null}
        </div>
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
              hover:border-[#4b503d]
            "
          >
            <span
              className="
                absolute
                inset-0
                origin-bottom
                scale-y-0
                bg-[#25221D]
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
