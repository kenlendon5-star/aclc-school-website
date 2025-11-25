import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navbar */}
        <nav className="bg-white bg-opacity-90 shadow-md backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="ACLC Logo"
                width={48}
                height={48}
                className="cursor-pointer"
                priority
              />
              <span className="ml-3 text-xl font-semibold text-gray-800">
                ACLC School
              </span>
            </Link>
            <div>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex flex-col items-center justify-center flex-grow text-white p-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to ACLC School</h1>
          <p className="text-lg max-w-xl text-center">
            This is your homepage content. You can modify this section as needed
            for your school website.
          </p>
        </div>
      </div>
    </div>
  );
}
