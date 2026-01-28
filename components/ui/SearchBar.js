export default function SearchBar({ searchTerm, onSearchChange, placeholder = "Search", className = "" }) {
  return (
    <div className={`flex-1 ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
      />
    </div>
  );
}