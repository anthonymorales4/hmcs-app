"use client";

import { useState } from "react";
import { ACADEMIC_YEAR_OPTIONS } from "../../lib/constants";

export default function YearDropdown({ selectedYear, onYearChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (year) => {
    onYearChange(year);
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all-smooth cursor-pointer shadow-sm">
        <span>{selectedYear}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden min-w-40 border border-gray-100 animate-slide-up">
            {ACADEMIC_YEAR_OPTIONS.map((year) => (
              <button
                key={year}
                onClick={() => handleSelect(year)}
                className={`block w-full text-left px-5 py-3 text-sm font-medium transition-all-smooth cursor-pointer ${
                  year === selectedYear
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
