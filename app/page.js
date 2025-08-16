"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      src: "/HarvardBrown2023.JPG",
      alt: "Harvard vs Brown 2023",
    },
    {
      src: "https://via.placeholder.com/800x400/A51C30/ffffff?text=Team+Photo+2024",
      alt: "Team Photo 2024",
    },
    {
      src: "https://via.placeholder.com/800x400/A51C30/ffffff?text=Training+Session",
      alt: "Training Session",
    },
    {
      src: "https://via.placeholder.com/800x400/A51C30/ffffff?text=Championship+Game",
      alt: "Championship Game",
    },
    {
      src: "https://via.placeholder.com/800x400/A51C30/ffffff?text=Alumni+Event",
      alt: "Alumni Event",
    },
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
      {/* Carousel Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors cursor-pointer"
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
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors cursor-pointer"
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

            {/* Image */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={carouselImages[currentSlide].src}
                alt={carouselImages[currentSlide].alt}
                fill
                className="object-cover"
                priority={currentSlide === 0}
              />

              {/* Title and Tagline */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold sm:text-6xl drop-shadow-lg">
                    Harvard Men&apos;s Club Soccer
                  </h1>
                  <p className="mt-4 text-xl sm:text-2xl drop-shadow-lg">
                    Tradition. Excellence. Brotherhood.
                  </p>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex space-x-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                        currentSlide === index
                          ? "bg-white hover:bg-white/90"
                          : "bg-white/50 hover:bg-white/80"
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

      {/* Content Sections */}
      <div className="bg-gray-50">
        {/* About Us Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          </div>
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <p className="text-lg text-gray-600">
                Harvard Men&apos;s Club Soccer represents the finest tradition
                of collegiate athletics, combining competitive excellence with
                academic achievement. Our team has been a cornerstone of
                Harvard&apos;s athletic community for decades.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We compete at the highest level while fostering lifelong
                friendships and professional networks that extend far beyond the
                soccer field.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="grid grid-cols-1 gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#A51C30]">
                    Excellence
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Striving for the highest standards in academics, athletics,
                    and character.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#A51C30]">
                    Brotherhood
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Building lifelong bonds through shared experiences and
                    mutual support.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#A51C30]">
                    Legacy
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Creating lasting impact that extends beyond our time at
                    Harvard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fall Tryouts Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Fall Tryouts 2025
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Tryout Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">September 1-3, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">4:00 PM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">Harvard Athletic Fields</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">What to bring:</span>
                    <span className="font-medium">
                      Cleats, shin guards, water
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">hmcs@harvard.edu</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instagram:</span>
                  <span className="font-medium">@harvardmensclubsoccer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">For tryouts:</span>
                  <span className="font-medium">Contact our captains</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
