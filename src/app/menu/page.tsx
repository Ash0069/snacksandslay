'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MenuCategories from "@/components/MenuCategories";
import MenuHero from "@/components/menu/MenuHero";
import MenuItemCard from "@/components/menu/MenuItemCard";
import type { MenuItem } from "@/lib/menuData";

type MenuResponse = {
  items: MenuItem[];
  categories: string[];
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Best Seller");

  const { data, isLoading, isError } = useQuery<MenuResponse>({
    queryKey: ["menu"],
    queryFn: async () => {
      const response = await fetch("/api/menu");

      if (!response.ok) {
        throw new Error("Unable to load menu");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });

  const items = data?.items ?? [];
  const categories = data
    ? ["Best Seller", ...data.categories]
    : [];

  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : "Best Seller";

  const filteredItems =
    selectedCategory === "Best Seller"
      ? items.filter((item) => item.bestSeller)
      : items.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
        Loading menu...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 p-6">
        Unable to load menu right now.
      </div>
    );
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
          <p className="text-center text-gray-500 mt-8">
            No best sellers available right now.
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