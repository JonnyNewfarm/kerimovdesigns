"use client";

import React, { useState } from "react";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      alert("Message sent!");
      window.location.reload();
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen w-full text-[#ecebeb] gap-y-16 flex flex-col-reverse lg:gap-x-10 lg:flex-row justify-between py-16 px-10 lg:px-30 xl:px-40 bg-[#242323]">
      <div className="flex flex-col gap-y-20">
        <div className="lg:text-7xl hidden lg:block xl:text-8xl sm:text-5xl text-5xl">
          <h1>Let&apos;s create a</h1>
          <h1>project together</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          <input
            className="py-6 border-b-1 px-4 border-b-[#ecebeb] border-t-1"
            placeholder="Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="py-6 border-b-1 px-4 border-b-[#ecebeb] "
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="py-6 border-b-1 px-4 border-b-[#ecebeb] "
            placeholder="Organization (optional)"
            name="organization"
            type="text"
            value={form.organization}
            onChange={handleChange}
          />
          <textarea
            className="min-h-[150px] px-4 py-6 border-b-1 border-b-[#ecebeb]"
            placeholder="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="mt-4 ml-5 border cursor-pointer max-w-[100px] border-[#ecebeb] py-2 px-6"
          >
            Send
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-y-10 mt-14 lg:mt-[215px] xl:mt-[260px]">
        <div className="sm:text-6xl text-5xl lg:hidden">
          <h1>Let&apos;s create a</h1>
          <h1>project together</h1>
        </div>
        <div className="gap-y-3 flex flex-col">
          <h1 className="opacity-70 ">Contact details</h1>
          <p>Rustam Kerimov</p>
          <p>kerimovrustam8@gmail.com</p>
          <p>+47 45 26 81 63</p>
          <p>Oslo, Norway</p>
        </div>

        <div className="gap-y-3 flex flex-col">
          <h1 className="opacity-70 ">Socials</h1>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default Page;
