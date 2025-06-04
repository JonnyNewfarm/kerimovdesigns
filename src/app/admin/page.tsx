import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/AuthOptions";
import DeleteProject from "@/components/admin/DeleteProject";
import UploadProject from "@/components/admin/UploadProject";
import { redirect } from "next/navigation";
import SignOut from "../../components/admin/SignOut";
import UpdateProject from "@/components/admin/UpdateProject";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="bg-[#242323]  z-[99999999] text-white border-b border-w">
      <SignOut />
      <div className="w-full flex justify-center">
        <h1 className="text-4xl font-semibold text-white">Manage Projects</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-y-20">
        <UploadProject />
        <div className="h-[1px] w-[80%] bg-white/60" />
        <UpdateProject />
        <div className="h-[1px] w-[80%] bg-white/60" />

        <DeleteProject />
      </div>
    </div>
  );
};

export default AdminPage;
