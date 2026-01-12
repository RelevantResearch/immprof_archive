interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div id="categories" className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-full font-medium transition ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
