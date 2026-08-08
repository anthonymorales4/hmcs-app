"use client";

import { useState } from "react";
import Image from "next/image";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      src: "/images/DSC01442.JPG",
      alt: "Chris Scazzero Vs Brown 2023",
    },
    {
      src: "/images/DSC00814.JPG",
      alt: "Alex Young Vs Princeton 2023",
    },
    {
      src: "/images/DSC00683.JPG",
      alt: "Alex Kim Vs Dartmouth 2023",
    },
    {
      src: "/images/DSC01113.JPG",
      alt: "Alex Kim Vs Yale 2023",
    },
    {
      src: "/images/DSC01341.JPG",
      alt: "Arjun Akwei Vs Brown 2023",
    },
  ];

  const contactEmails = [
    "cjmcconnon@college.harvard.edu",
    "oaschiff@college.harvard.edu",
    "fleonardi@college.harvard.edu",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass shadow-xl hover:shadow-2xl hover:scale-110 transition-all-smooth cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass shadow-xl hover:shadow-2xl hover:scale-110 transition-all-smooth cursor-pointer"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="relative h-[32rem] rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
              <Image
                src={carouselImages[currentSlide].src}
                alt={carouselImages[currentSlide].alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={currentSlide === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 flex items-center justify-center z-10">
                <div className="text-center text-white px-4 animate-slide-up">
                  <h1 className="text-5xl font-bold sm:text-7xl text-shadow-strong tracking-tight leading-tight">
                    Harvard Men&apos;s Club Soccer
                  </h1>
                  <p className="mt-6 text-2xl sm:text-3xl text-shadow-strong font-light tracking-wide">
                    Tradition. Excellence. Brotherhood.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex space-x-3">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all-smooth cursor-pointer ${
                        currentSlide === index
                          ? "bg-white hover:bg-white/95"
                          : "bg-white/60 hover:bg-white/90 hover:scale-125"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              About Us
            </h2>
            <div className="gradient-divider mx-auto mt-4 w-24"></div>
          </div>
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Harvard Men&apos;s Club Soccer is a student-run team open to
                every undergraduate on campus, no matter how you came to the
                game. We compete each fall in NIRSA Region 1 and at the Ivy
                League Championships, playing our home matches at Cumnock
                Fields.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <p className="text-lg text-gray-600 leading-relaxed">
                Rosters turn over, but the club doesn&apos;t. Players who pulled
                on the crimson years ago still follow the results, come back for
                games, and help the next group find their footing after
                graduation. Tryouts are held at the start of each fall season
                and everyone is welcome to come out.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                Tryouts
              </h2>
              <div className="gradient-divider mx-auto mt-4 w-24"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all-smooth hover:scale-[1.02] border-t-4 border-t-[#A51C30]">
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                      Day 1
                    </h3>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                        Date:
                      </span>
                      <span className="font-semibold text-gray-900">
                        September 6, 2025
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                        Time:
                      </span>
                      <span className="font-semibold text-gray-900">
                        2 PM - 5 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <LocationOnIcon sx={{ fontSize: 18 }} />
                        Location:
                      </span>
                      <a
                        href="https://www.google.com/maps/place/cumnock+fields/data=!4m2!3m1!1s0x89e3776444313839:0x3472833330f707fe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-colors"
                      >
                        Cumnock Fields
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all-smooth hover:scale-[1.02] border-t-4 border-t-[#A51C30]">
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                      Day 2
                    </h3>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                        Date:
                      </span>
                      <span className="font-semibold text-gray-900">
                        September 7, 2025
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                        Time:
                      </span>
                      <span className="font-semibold text-gray-900">
                        3:30 PM - 5:30 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <LocationOnIcon sx={{ fontSize: 18 }} />
                        Location:
                      </span>
                      <a
                        href="https://www.google.com/maps/place/cumnock+fields/data=!4m2!3m1!1s0x89e3776444313839:0x3472833330f707fe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-colors"
                      >
                        Cumnock Fields
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Contact Us
            </h2>
            <div className="gradient-divider mx-auto mt-4 w-24"></div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-lg hover:shadow-xl transition-all-smooth hover:scale-[1.02]">
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium text-lg flex items-center gap-2">
                    <EmailIcon sx={{ fontSize: 20 }} />
                    Email:
                  </span>
                  <div className="flex flex-col items-end gap-1 text-right">
                    {contactEmails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-colors break-all"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium text-lg flex items-center gap-2">
                    <InstagramIcon sx={{ fontSize: 20 }} />
                    Instagram:
                  </span>
                  <a
                    href="https://instagram.com/harvardmcsoc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-colors"
                  >
                    @harvardmcsoc
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
