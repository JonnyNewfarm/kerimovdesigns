import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/AuthOptions";
import DeleteProject from "@/components/admin/DeleteProject";
import UploadProject from "@/components/admin/UploadProject";
import { redirect } from "next/navigation";
import SignOut from "../../components/admin/SignOut";
import UpdateProject from "@/components/admin/UpdateProject";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rustam Kerimov | Projects",
  description:
    "Explore the projects and works of Rustam Kerimov, showcasing design and creative skills.",
  icons: {
    icon: "/favicon.ico",
  },
};

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="bg-[#242323]  z-[99999] text-white border-b border-w">
      <div className="bg-[#242323] sticky w-full z-50 h-12 top-0 left-0"></div>
      <SignOut />
      <div className="w-full flex justify-center">
        <h1 className="text-4xl font-semibold text-white">Manage Projects</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-y-20">
        <UploadProject />
        <UpdateProject />

        <DeleteProject />
      </div>
    </div>
  );
};

export default AdminPage;
