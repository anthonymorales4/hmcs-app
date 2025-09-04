"use client";

import { ACADEMIC_YEAR_OPTIONS } from "../../lib/constants";

export default function YearDropdown({ selectedYear, onYearChange }) {

  return (
    <div className="flex justify-center mb-8">
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
      >
        {ACADEMIC_YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
