"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <div className="w-full  pt-20 flex justify-end pr-10">
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="border-red-700 border-2  absolute cursor-pointer text-red-700 text-sm md:text-md px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}
