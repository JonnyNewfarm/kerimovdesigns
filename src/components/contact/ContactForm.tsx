"use client";

import { motion } from "framer-motion";
import { type ChangeEvent, type FormEvent, useState } from "react";

import ContactFormThreeButton from "./ContactFormThreeButton";
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
  const PANEL_EASE = [0.22, 1, 0.36, 1] as const;

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

      const nextErrors = {
        ...previous,
      };

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

      const nextErrors = {
        ...previous,
      };

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
        w-full
        min-w-0
        grid-cols-1

        gap-x-6
        gap-y-3

        md:grid-cols-2
        md:gap-x-7
        md:gap-y-4
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
        placeholder="Identity, motion, logo.."
        value={values.project}
        error={errors.project}
        autoComplete="off"
        onChangeAction={(value) => {
          handleChange("project", value);
        }}
        onBlurAction={() => {
          handleBlur("project");
        }}
      />

      <div
        className="
          min-w-0

          md:col-span-2
        "
      >
        <label
          htmlFor="message"
          className="
            mb-2
            block

            text-[12px]
            font-black
            uppercase
            tracking-[0.08em]

            text-[#e8e2d9]
          "
        >
          Tell me about the project
        </label>

        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          placeholder="Project details, timing and budget.."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? messageErrorId : undefined}
          onChange={handleMessageChange}
          onBlur={() => {
            handleBlur("message");
          }}
          className={`
            block

            min-h-[105px]
            w-full
            min-w-0
            max-w-full

            resize-none

            border-b

            bg-transparent

            pb-3

            font-bueno

            text-[1.15rem]
            font-semibold

            leading-[1.15]

            text-[#ecdfcc]

            outline-none

            transition-colors
            duration-300

            placeholder:font-normal
            placeholder:text-[#ecdfcc]/50

            sm:min-h-[120px]
            sm:text-[1.3rem]

            ${
              errors.message
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

        <div
          className="
            min-h-[16px]
            pt-1
          "
        >
          {errors.message ? (
            <motion.p
              id={messageErrorId}
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
              {errors.message}
            </motion.p>
          ) : null}
        </div>
      </div>

      <div
        className="
    flex
    min-w-0
    items-end
    justify-end

    pt-1

    sm:justify-between
    sm:gap-6

    md:col-span-2
  "
      >
        <div
          className="
      hidden
      flex-wrap
      items-center
      gap-x-4
      gap-y-2

      text-[8px]
      font-semibold
      uppercase
      leading-[1.45]
      tracking-[0.13em]

      text-[#ecdfcc]

      sm:flex
      sm:text-[10px]
    "
        >
          <a
            href="https://www.linkedin.com/in/rustam-kerimov-75bb5a331/"
            target="_blank"
            rel="noreferrer"
            className="
        transition-opacity
        duration-300
        hover:opacity-50
      "
          >
            LinkedIn
          </a>

          <a
            href="https://www.instagram.com/kerimov.designs/"
            target="_blank"
            rel="noreferrer"
            className="
        transition-opacity
        duration-300
        hover:opacity-50
      "
          >
            Instagram
          </a>

          <a
            href="mailto:rustam-98@hotmail.com"
            className="
        tracking-normal

        transition-opacity
        duration-300
        hover:opacity-50
      "
          >
            rustam-98@hotmail.com
          </a>
        </div>

        <div className="shrink-0">
          <ContactFormThreeButton type="submit">
            Submit inquiry
          </ContactFormThreeButton>
        </div>
      </div>
    </form>
  );
}
