"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <div className="w-full pt-20 flex justify-end pr-10">
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="bg-red-600 cursor-pointer text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}
