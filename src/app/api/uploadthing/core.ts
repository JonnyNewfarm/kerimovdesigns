import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// Initialize UploadThing
const f = createUploadthing();

// Temporary auth mock function
const auth = async () => {
  // Simulate checking authentication, as the user is already authenticated via NextAuth
  return { id: "admin" }; // Simulating an admin user
};

// Define file router
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
    .middleware(async () => { // Remove the `req` parameter since it's not used
      const user = await auth();

      if (!user) throw new UploadThingError("Unauthorized");

      // Attach the userId to metadata
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // You can return custom data here as well
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
