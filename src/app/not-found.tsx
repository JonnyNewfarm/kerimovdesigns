import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#242323] border-b border-white/60 text-white flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold">404</h1>
      <h2 className="text-4xl">Page Not Found</h2>
      <p className=" text-2xl mt-2">
        The page you're looking for doesn't exist.
      </p>
      <Link className="underline text-2xl mt-10" href={"/"}>
        Go back to the homepage
      </Link>
    </div>
  );
}
