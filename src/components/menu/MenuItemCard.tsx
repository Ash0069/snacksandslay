import type { CSSProperties } from "react";
import type { MenuItem } from "@/lib/menuData";

type MenuItemCardProps = {
  item: MenuItem;
  index: number;
};

export default function MenuItemCard({ item, index }: MenuItemCardProps) {
  return (
    <div
      className="group relative animate-float-in overflow-hidden rounded-2xl border border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-500 hover:shadow-2xl"
      style={{ animationDelay: `${index * 0.1}s` } as CSSProperties}
    >
      <div className="absolute top-4 right-4 transform rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
        {item.category}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
            {item.price}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-amber-500/5 to-orange-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
    </div>
  );
}
