import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();


const auth = async () => {
  return { id: "admin" }; 
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4GB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "4GB",
    },
  })
    .middleware(async () => { 
      const user = await auth();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
