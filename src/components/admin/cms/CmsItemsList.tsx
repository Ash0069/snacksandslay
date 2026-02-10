import type { MenuItem } from "@/lib/menuData";
import CmsItemsListRow from "@/components/admin/cms/CmsItemsListRow";

type CmsItemsListProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDeleteRequest: (item: MenuItem) => void;
};

export default function CmsItemsList({ items, onEdit, onDeleteRequest }: CmsItemsListProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">Current Items ({items.length})</h2>
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <CmsItemsListRow
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
        {items.length === 0 && <p className="p-6 text-sm text-slate-500">No menu items yet.</p>}
      </div>
    </div>
  );
}
