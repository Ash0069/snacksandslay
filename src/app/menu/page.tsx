'use client';

import { useEffect, useState } from "react";
import MenuCategories from "@/components/MenuCategories";
import MenuHero from "@/components/menu/MenuHero";
import MenuItemCard from "@/components/menu/MenuItemCard";
import type { MenuItem } from "@/lib/menuData";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Best Seller");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      const response = await fetch("/api/menu", { cache: "no-store" });

      if (!response.ok) {
        setError("Unable to load menu right now.");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { items: MenuItem[]; categories: string[] };
      setItems(data.items);
      setCategories(["Best Seller", ...data.categories]);
      setLoading(false);
    };

    void loadMenu();
  }, []);

  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : "Best Seller";

  const filteredItems =
    selectedCategory === "Best Seller"
      ? items.filter((item) => item.bestSeller)
      : items.filter((item) => item.category === selectedCategory);

  if (loading) {
    return <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">Loading menu...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <MenuHero />

        <MenuCategories
          categories={categories}
          activeCategory={selectedCategory}
          onCategorySelect={setActiveCategory}
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filteredItems.map((item, index) => (
            <MenuItemCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {filteredItems.length === 0 && selectedCategory !== "Best Seller" && (
          <p className="text-center text-gray-500 mt-8">
            Coming soon in {selectedCategory}.
          </p>
        )}
        {filteredItems.length === 0 && selectedCategory === "Best Seller" && (
          <p className="text-center text-gray-500 mt-8">No best sellers available right now.</p>
        )}

        <div className="text-center mt-16 mb-8 animate-fade-in-late">
          <p className="text-gray-500 text-sm">All prices inclusive of taxes</p>
        </div>
      </div>
    </div>
  );
}
