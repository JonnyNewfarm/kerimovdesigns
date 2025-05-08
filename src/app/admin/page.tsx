import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/AuthOptions";
import DeleteProject from "@/components/admin/DeleteProject";
import UploadProject from "@/components/admin/UploadProject";
import { redirect } from "next/navigation";
import SignOut from "../../components/admin/SignOut";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="flex sticky bg-white top-0 w-full justify-between px-20 py-10">
        <h1 className="font-semibold text-lg md:text-xl">Admin page-RK</h1>
        <SignOut />
      </div>
      <UploadProject />
      <DeleteProject />
    </div>
  );
};

export default AdminPage;
