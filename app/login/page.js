"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        throw signInError;
      }

      router.push("/");
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
        src="/DSC01558.JPG"
        alt="Harvard Men's Club Soccer Team"
        fill
        className="object-cover"
        style={{ objectPosition: "25% center" }}
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 shadow-sm transition-all-smooth focus:outline-none focus:border-gray-300 hover:border-gray-300"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-sm text-[#A51C30] hover:text-[#8B1721] transition-all-smooth"
              >
                Forgot your password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#A51C30] hover:bg-[#8B1721] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] transition-all-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-[#A51C30] hover:text-[#8B1721] transition-all-smooth"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
