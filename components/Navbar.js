"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [showAlumniDropdown, setShowAlumniDropdown] = useState(false);

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
    { name: "Profile", href: "/alumni/profile" },
  ];

  return (
    <nav className="bg-[#A51C30]">
      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/HarvardLogo.svg"
                alt="Harvard Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>
          </div>

          {/* Primary Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
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
                    className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>

                  {/* Alumni Dropdown */}
                  {item.name === "Alumni" && showAlumniDropdown && (
                    <div className="absolute top-full left-0 bg-[#A51C30] shadow-lg z-50 min-w-48">
                      {alumniNavItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm text-white hover:bg-[#8B1721] transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
