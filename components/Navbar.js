"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [showAlumniDropdown, setShowAlumniDropdown] = useState(false);
  const { user, signOut } = useAuth();

  const primaryNavItems = [
    { name: "About Us", href: "/" },
    { name: "Roster", href: "/roster" },
    { name: "Board", href: "/board" },
    { name: "Schedule", href: "/schedule" },
    { name: "Standings", href: "/standings" },
    { name: "Alumni", href: "/alumni/directory" },
  ];

  const alumniNavItems = [
    { name: "Alumni Directory", href: "/alumni/directory" },
    { name: "Announcements", href: "/alumni/announcements" },
    { name: "Donations", href: "/alumni/donations" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="bg-[#A51C30] shadow-md relative">
      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="block transition-transform hover:scale-110 duration-300"
            >
              <Image
                src="/images/HarvardLogo.svg"
                alt="Harvard Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>
          </div>

          {/* Primary Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {primaryNavItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.name === "Alumni" && setShowAlumniDropdown(true)
                  }
                  onMouseLeave={() =>
                    item.name === "Alumni" && setShowAlumniDropdown(false)
                  }
                >
                  <Link
                    href={item.href}
                    className="text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all-smooth hover:shadow-lg"
                  >
                    {item.name}
                  </Link>

                  {/* Alumni Dropdown */}
                  {item.name === "Alumni" && showAlumniDropdown && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white shadow-2xl rounded-xl overflow-hidden min-w-56 border border-gray-100 animate-slide-up">
                        {alumniNavItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-black transition-all-smooth"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Authentication Section */}
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={signOut}
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all-smooth cursor-pointer hover:shadow-lg"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all-smooth hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
