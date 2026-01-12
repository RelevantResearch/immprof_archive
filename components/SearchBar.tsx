interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <div className="mb-8">
      <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
