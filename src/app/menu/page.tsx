'use client'
import { useState } from "react";
import MenuCategories from "@/components/MenuCategories";

type MenuItem = {
  name: string;
  price: string;
  category: string;
  description: string;
  bestSeller: boolean;
};

export default function MenuPage() {
  const categories = [
    "Best Seller",
    "Pasta",
    "Pizza",
    "Chinese",
    "Beverages",
    "Momos",
    "Sandwhich",
    "French Fries",
  ];

  const items: MenuItem[] = [
    { name: "Cold Coffee", price: "Rs 80", category: "Beverages", description: "Chilled espresso with milk", bestSeller: true },
    { name: "Iced Americano", price: "Rs 110", category: "Beverages", description: "Bold espresso over ice", bestSeller: false },
    { name: "White Sauce Pasta", price: "Rs 140", category: "Pasta", description: "Creamy and cheesy classic", bestSeller: false },
    { name: "Margherita Pizza", price: "Rs 190", category: "Pizza", description: "Fresh basil and mozzarella", bestSeller: true },
    { name: "Veg Hakka Noodles", price: "Rs 130", category: "Chinese", description: "Wok tossed with veggies", bestSeller: false },
    { name: "Steamed Momos", price: "Rs 100", category: "Momos", description: "Soft dumplings with chutney", bestSeller: false },
    { name: "Veg Sandwich", price: "Rs 90", category: "Sandwhich", description: "Fresh veggies and herbs", bestSeller: false },
    { name: "Loaded Fries", price: "Rs 120", category: "French Fries", description: "Crispy fries with toppings", bestSeller: false },
    { name: "Masala Tea", price: "Rs 20", category: "Beverages", description: "Traditional spiced chai", bestSeller: false },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredItems =
    activeCategory === "Best Seller"
      ? items.filter((item) => item.bestSeller)
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <div className="inline-block mb-4 overflow-hidden">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent animate-slide-down">
              Our Menu
            </h1>
          </div>
          <p className="text-gray-600 text-lg animate-fade-in-delayed">
            Crafted with love, served with care
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full animate-scale-in"></div>
        </div>

        <MenuCategories
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredItems.map((item, index) => (
            <div
              key={item.name}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden opacity-0 animate-float-in border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-md transform group-hover:scale-110 transition-transform duration-300">
                {item.category}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {item.price}
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No items available in this category.
          </p>
        )}

        <div className="text-center mt-16 mb-8 animate-fade-in-late">
          <p className="text-gray-500 text-sm">
            All prices inclusive of taxes
          </p>
        </div>
      </div>
    </div>
  );
}
