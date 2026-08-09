"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { supabase } from "../../lib/supabase";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    graduationYear: "",
    accessCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    try {
      // Check the access code before creating anything. The signup trigger is
      // the real enforcement, but a failure there surfaces as an opaque
      // "Database error saving new user", so catch the common case here where
      // we can show something useful.
      const { data: codeIsValid, error: codeError } = await supabase.rpc(
        "check_access_code",
        { p_code: formData.accessCode }
      );

      if (codeError) {
        throw codeError;
      }
      if (!codeIsValid) {
        throw new Error(
          "That access code isn't valid. Codes are issued by the club — reach out if you need one."
        );
      }

      // `role` is derived server-side in handle_new_user() from the graduation
      // year, so it is deliberately not sent here.
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            graduation_year: parseInt(formData.graduationYear),
            access_code: formData.accessCode,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Show success message
      setSuccess("Account created successfully! Redirecting to login...");

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Full-screen background image */}
      <Image
        src="/images/DSC01096.JPG"
        alt="Harvard Men's Club Soccer Team"
        fill
        className="object-cover"
        style={{ objectPosition: "50% center" }}
        priority
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Centered form card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <Image
              src="/images/HarvardLogo.svg"
              alt="Harvard Logo"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join the HMCS community</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 shadow-sm transition-all-smooth focus:outline-none focus:border-gray-300 hover:border-gray-300"
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
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 shadow-sm transition-all-smooth focus:outline-none focus:border-gray-300 hover:border-gray-300"
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
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 shadow-sm transition-all-smooth focus:outline-none focus:border-gray-300 hover:border-gray-300"
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
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 shadow-sm transition-all-smooth focus:outline-none focus:border-gray-300 hover:border-gray-300"
                placeholder="Graduation Year"
                value={formData.graduationYear}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="accessCode" className="sr-only">
                Access Code
              </label>
              {/* The icon is positioned against this wrapper, which spans only
                  the input — the helper text below sits outside it so it does
                  not drag the vertical centering down. */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <VpnKeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="accessCode"
                  name="accessCode"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  required
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 shadow-sm transition-all-smooth focus:outline-none focus:border-gray-300 hover:border-gray-300"
                  placeholder="Access Code"
                  value={formData.accessCode}
                  onChange={handleInputChange}
                />
              </div>
              <p className="mt-2 px-1 text-xs text-gray-500">
                Don&apos;t have one?{" "}
                <a
                  href="mailto:cjmcconnon@college.harvard.edu"
                  className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-colors"
                >
                  Request access
                </a>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#A51C30] hover:bg-[#8B1721] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] transition-all-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-all-smooth"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
