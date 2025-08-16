"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // TODO: Implement authentication logic
  };

  return (
    <div className="min-h-screen flex">
      {/* Login Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white">
        <div className="w-full max-w-sm mx-auto">
          {/* Harvard Logo */}
          <div className="text-center mb-8">
            <Image
              src="/HarvardLogo.svg"
              alt="Harvard Logo"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">LOGIN</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#A51C30] focus:border-[#A51C30] sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#A51C30] focus:border-[#A51C30] sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-sm text-[#A51C30] hover:text-[#8B1721] transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A51C30] hover:bg-[#8B1721] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] transition-colors"
              >
                Login
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-[#A51C30] hover:text-[#8B1721] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex lg:flex-1 lg:relative">
        <Image
          src="/DSC01558.JPG"
          alt="Harvard Men's Club Soccer Team"
          fill
          className="object-cover"
          style={{ objectPosition: "25% center" }}
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    </div>
  );
}
