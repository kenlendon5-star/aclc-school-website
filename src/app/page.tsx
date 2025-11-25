"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const sliderImages = ["/1.jpg", "/2.jpg", "/3.jpg"];

const courses = [
  { id: 1, name: "Culinary Arts", category: "Culinary" },
  { id: 2, name: "Computer Science", category: "Computer" },
  { id: 3, name: "Graphic Design", category: "Other" },
  { id: 4, name: "Baking and Pastry", category: "Culinary" },
  { id: 5, name: "Information Technology", category: "Computer" },
  { id: 6, name: "Business Management", category: "Other" },
];

export default function HomePage() {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Slider navigation
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navbar */}
        <nav className="bg-white/95 shadow-md backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="#top" className="flex items-center">
              <Image
                src="/logo.png"
                alt="ACLC Logo"
                width={48}
                height={48}
                className="cursor-pointer"
                priority
              />
              <span className="ml-3 text-2xl font-extrabold text-gray-800">
                ACLC School
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="#functionalities"
                className="text-gray-700 hover:text-blue-600 font-semibold transition"
              >
                Functionalities
              </Link>
              <Link
                href="#about"
                className="text-gray-700 hover:text-blue-600 font-semibold transition"
              >
                About
              </Link>
              <Link
                href="#courses"
                className="text-gray-700 hover:text-blue-600 font-semibold transition"
              >
                Courses
              </Link>
              <Link
                href="#highlights"
                className="text-gray-700 hover:text-blue-600 font-semibold transition"
              >
                Highlights
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-blue-600 font-semibold transition"
              >
                Contact
              </Link>
              <Link
                href="/sign-in"
                className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition font-semibold"
              >
                Sign In
              </Link>
            </div>
            {/* Mobile menu placeholder */}
            <div className="md:hidden text-gray-700 font-semibold">
              Menu
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main id="top" className="flex-grow container mx-auto px-6 py-10 text-white">
          {/* Welcome Section */}
          <section className="text-center mb-28 max-w-4xl mx-auto">
            <h1 className="text-6xl font-extrabold mb-6 drop-shadow-xl leading-tight">
              Welcome to ACLC School
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
              Empowering students with innovative learning solutions and a vibrant community. Discover
              excellence in education with ACLC School.
            </p>
            <Link
              href="#functionalities"
              className="inline-block mt-2 px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg text-lg transition font-semibold"
            >
              Explore Features
            </Link>
          </section>

          {/* Functionalities Section */}
          <section id="functionalities" className="mb-32 max-w-5xl mx-auto text-gray-800">
            <h2 className="text-4xl font-bold mb-10 text-center drop-shadow-md text-white">
              Our System Functionalities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[{
                img: "/attendance.png",
                title: "Attendance Tracking",
                desc: "Easily record and monitor student attendance with real-time updates and detailed reports.",
              }, {
                img: "/assignment.png",
                title: "Assignments Management",
                desc: "Create, assign, and review assignments seamlessly, supporting student learning progress.",
              }, {
                img: "/announcement.png",
                title: "Announcements",
                desc: "Keep everyone informed with timely announcements about school events and updates.",
              }].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center text-center hover:scale-105 transform transition duration-300"
                >
                  <Image src={item.img} alt={item.title} width={80} height={80} className="mb-5" />
                  <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Courses Section */}
          <section id="courses" className="mb-32 max-w-5xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-10 text-center drop-shadow-md">Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course) => {
                const isHighlighted =
                  course.category === "Culinary" || course.category === "Computer";
                return (
                  <div
                    key={course.id}
                    className={`p-6 rounded-xl shadow-lg text-center cursor-pointer transition transform hover:scale-105 ${
                      isHighlighted
                        ? "bg-yellow-400 text-gray-900 font-semibold"
                        : "bg-gray-700 bg-opacity-70"
                    }`}
                  >
                    {course.name}
                  </div>
                );
              })}
            </div>
          </section>

          {/* About Us Section */}
          <section id="about" className="bg-white rounded-xl p-16 mb-32 max-w-5xl mx-auto text-gray-800 shadow-xl">
            <h2 className="text-4xl font-bold mb-8 text-center">About Us</h2>
            <p className="text-lg leading-relaxed text-center opacity-90 mb-6">
              ACLC School is dedicated to providing high-quality education through innovative technologies
              and personalized learning experiences. Our mission is to foster academic excellence,
              creativity, and community engagement in every student.
            </p>
            <p className="text-lg leading-relaxed text-center opacity-90 mb-6">
              Established with a vision to empower the youth, ACLC School integrates advanced educational tools
              with experienced faculty to nurture talents and skills critical for the future.
            </p>
            <p className="text-lg leading-relaxed text-center opacity-90">
              Join our diverse community and benefit from a wide range of programs designed to support academic growth,
              personal development, and social responsibility.
            </p>
          </section>

          {/* Highlights Section with Slider */}
          <section id="highlights" className="mb-32 max-w-5xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-10 text-center drop-shadow-md">
              Explore Our Highlights
            </h2>
            <div className="relative overflow-hidden rounded-xl shadow-lg max-w-4xl mx-auto">
              {/* Slides */}
              <div className="flex transition-transform duration-700 ease-in-out"
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {sliderImages.map((src, idx) => (
                  <div key={idx} className="min-w-full">
                    <Image
                      src={src}
                      alt={`Highlight ${idx + 1}`}
                      width={800}
                      height={400}
                      className="object-cover w-full h-96 rounded-xl"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute top-1/2 left-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
              >
                &#8249;
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute top-1/2 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
              >
                &#8250;
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-3 w-3 rounded-full transition-colors ${
                      currentSlide === idx ? "bg-blue-600" : "bg-white/70"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Contact Us Section */}
          <section
            id="contact"
            className="bg-white rounded-xl p-16 w-full text-gray-800 shadow-xl"
          >
            <h2 className="text-4xl font-bold mb-12 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-full mx-0">
              {[{
                icon: "/mail.png",
                text: "contact@aclcschool.edu",
              }, {
                icon: "/phone.png",
                text: "(053) 560 8000",
              }, {
                icon: "/search.png",
                text: "Community College Lilia Avenue, Brgy. Cogon, Ormoc City, Philippines",
              }].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 hover:scale-105 transform transition duration-300"
                >
                  <Image src={item.icon} alt="Icon" width={54} height={54} />
                  <span className="text-lg font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
          <div className="container mx-auto px-6 text-center max-w-4xl space-y-2">
            <p className="font-semibold">ACLC School</p>
            <p>Community College Lilia Avenue, Brgy. Cogon, Ormoc City, Philippines</p>
            <p>Phone: (053) 560 8000</p>
            <p className="text-sm mt-4 opacity-60">&copy; {new Date().getFullYear()} ACLC School. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
