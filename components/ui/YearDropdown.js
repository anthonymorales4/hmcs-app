"use client";

import { useState, useEffect } from "react";

export default function YearDropdown({ selectedYear, onYearChange }) {
  const [years, setYears] = useState([]);

  useEffect(() => {
    async function fetchYears() {
      try {
        const academicYears = [
          "2024-2025",
          "2023-2024",
          "2022-2023",
          "2021-2022",
          "2019-2020",
          "2018-2019",
          "2017-2018",
        ];
        setYears(academicYears);
      } catch (error) {
        console.error("Error fetching available years:", error);
      }
    }

    fetchYears();
  }, []);

  return (
    <div className="flex justify-center mb-8">
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
