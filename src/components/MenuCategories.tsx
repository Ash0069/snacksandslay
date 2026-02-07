type MenuCategoriesProps = {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
};

export default function MenuCategories({
  categories,
  activeCategory,
  onCategorySelect,
}: MenuCategoriesProps) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategorySelect(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
