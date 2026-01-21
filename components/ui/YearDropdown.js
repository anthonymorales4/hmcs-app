"use client";

import { useState, useRef, useEffect } from "react";
import { ACADEMIC_YEAR_OPTIONS } from "../../lib/constants";

export default function YearDropdown({ selectedYear, onYearChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (year) => {
    onYearChange(year);
    setIsOpen(false);
  };

  return (
    <div className="mt-4 mb-4 relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all-smooth"
      >
        <span>{selectedYear}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-300 ${
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
        <div className="absolute top-full left-0 mt-2 bg-white shadow-2xl rounded-xl overflow-hidden z-50 min-w-40 border border-gray-100 animate-slide-up">
          {ACADEMIC_YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              onClick={() => handleSelect(year)}
              className={`block w-full text-left px-5 py-3 text-sm font-medium transition-all-smooth ${
                selectedYear === year
                  ? "bg-[#A51C30]/10 text-[#A51C30]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
