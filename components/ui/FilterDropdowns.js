import {
  HOUSE_OPTIONS,
  FINAL_CLUB_OPTIONS,
  GRADUATION_YEAR_OPTIONS,
} from "../../lib/constants";

export default function FilterDropdowns({ filters, onFilterChange }) {
  return (
    <div className="flex gap-4">
      <select
        value={filters.house}
        onChange={(e) => onFilterChange("house", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
      >
        <option value="">House</option>
        {HOUSE_OPTIONS.map((house) => (
          <option key={house} value={house}>
            {house}
          </option>
        ))}
      </select>

      <select
        value={filters.finalClub}
        onChange={(e) => onFilterChange("finalClub", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
      >
        <option value="">Final Club</option>
        {FINAL_CLUB_OPTIONS.map((club) => (
          <option key={club} value={club}>
            {club}
          </option>
        ))}
      </select>

      <select
        value={filters.graduationYear}
        onChange={(e) => onFilterChange("graduationYear", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
      >
        <option value="">Graduation Year</option>
        {GRADUATION_YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
