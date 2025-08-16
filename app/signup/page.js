"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";
import { supabase } from "../../lib/supabase";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    graduationYear: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Determine role based on graduation year
      const currentYear = new Date().getFullYear();
      const role =
        parseInt(formData.graduationYear) > currentYear
          ? "current_player"
          : "alumni";

      // Sign up user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            graduation_year: parseInt(formData.graduationYear),
            role: role,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user && !data.user.email_confirmed_at) {
        // Email confirmation required
        setError(
          "Please check your email to confirm your account before logging in."
        );
      } else {
        // Redirect to profile completion or dashboard
        router.push("/login");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section */}
      <div className="hidden lg:flex lg:flex-1 lg:relative">
        <Image
          src="/DSC01096.JPG"
          alt="Harvard Men's Club Soccer Team"
          fill
          className="object-cover"
          style={{ objectPosition: "50% center" }}
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Sign Up Form Section*/}
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
            <h1 className="text-3xl font-bold text-gray-900">SIGN UP</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#A51C30] focus:border-[#A51C30] sm:text-sm"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlternateEmailIcon className="h-5 w-5 text-gray-400" />
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
                autoComplete="new-password"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#A51C30] focus:border-[#A51C30] sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="graduationYear" className="sr-only">
                Graduation Year
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SchoolIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min="2015"
                max="2030"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#A51C30] focus:border-[#A51C30] sm:text-sm"
                placeholder="Graduation Year"
                value={formData.graduationYear}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A51C30] hover:bg-[#8B1721] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#A51C30] hover:text-[#8B1721] transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
