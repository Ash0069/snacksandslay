import type { MenuItem } from "@/lib/menuData";

type CmsItemsListRowProps = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDeleteRequest: (item: MenuItem) => void;
};

export default function CmsItemsListRow({ item, onEdit, onDeleteRequest }: CmsItemsListRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div>
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="text-sm text-slate-600">
          {item.category} | {item.price}
        </p>
        <p className="mt-1 text-sm text-slate-500">{item.description}</p>
        {item.bestSeller && (
          <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            Best Seller
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 hover:bg-blue-300"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDeleteRequest(item)}
          className="rounded-lg border border-red-300 bg-red-700 px-3 py-1.5 text-sm text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
