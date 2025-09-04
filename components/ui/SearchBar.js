export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="flex-1 max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search"
        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
      />
    </div>
  );
}