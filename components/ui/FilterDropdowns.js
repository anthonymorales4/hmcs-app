"use client";

import { useState } from "react";
import {
  HOUSE_OPTIONS,
  FINAL_CLUB_OPTIONS,
  GRADUATION_YEAR_OPTIONS,
} from "../../lib/constants";

function Dropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  const displayValue = value || label;
  const hasValue = Boolean(value);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all-smooth cursor-pointer shadow-sm ${
          hasValue ? "rounded-l-lg border-r-0" : "rounded-lg"
        }`}
      >
        <span>{displayValue}</span>
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

      {hasValue && (
        <button
          onClick={handleClear}
          className="flex items-center justify-center px-2 py-2 bg-white border border-gray-200 text-gray-500 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 transition-all-smooth cursor-pointer shadow-sm"
          aria-label={`Clear ${label} filter`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden min-w-40 border border-gray-100 animate-slide-up max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`block w-full text-left px-5 py-3 text-sm font-medium whitespace-nowrap transition-all-smooth cursor-pointer ${
                  option === value || String(option) === value
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterDropdowns({
  filters,
  onFilterChange,
  dynamicOptions,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Dropdown
        label="House"
        value={filters.house}
        options={HOUSE_OPTIONS}
        onChange={(value) => onFilterChange("house", value)}
      />
      <Dropdown
        label="Final Club"
        value={filters.finalClub}
        options={FINAL_CLUB_OPTIONS}
        onChange={(value) => onFilterChange("finalClub", value)}
      />
      <Dropdown
        label="Graduation Year"
        value={filters.graduationYear}
        options={GRADUATION_YEAR_OPTIONS}
        onChange={(value) => onFilterChange("graduationYear", value)}
      />
      {dynamicOptions && (
        <>
          <Dropdown
            label="Concentration"
            value={filters.concentration}
            options={dynamicOptions.concentrations}
            onChange={(value) => onFilterChange("concentration", value)}
          />
          <Dropdown
            label="Job"
            value={filters.currentJob}
            options={dynamicOptions.jobs}
            onChange={(value) => onFilterChange("currentJob", value)}
          />
          <Dropdown
            label="Company"
            value={filters.currentCompany}
            options={dynamicOptions.companies}
            onChange={(value) => onFilterChange("currentCompany", value)}
          />
          <Dropdown
            label="Location"
            value={filters.currentLocation}
            options={dynamicOptions.locations}
            onChange={(value) => onFilterChange("currentLocation", value)}
          />
        </>
      )}
    </div>
  );
}
