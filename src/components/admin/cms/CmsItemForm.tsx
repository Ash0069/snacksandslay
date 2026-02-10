import type { SubmitEvent } from "react";

export type MenuFormState = {
  name: string;
  price: string;
  category: string;
  description: string;
  bestSeller: boolean;
};

type CmsItemFormProps = {
  form: MenuFormState;
  editingId: string | null;
  categories: string[];
  submitting: boolean;
  error: string;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onFormChange: <K extends keyof MenuFormState>(field: K, value: MenuFormState[K]) => void;
  onCancel: () => void;
};

export default function CmsItemForm({
  form,
  editingId,
  categories,
  submitting,
  error,
  onSubmit,
  onFormChange,
  onCancel,
}: CmsItemFormProps) {
  const categoryOptions = Array.from(new Set(categories.filter(Boolean))).sort();
  const selectedCategory = categoryOptions.includes(form.category) ? form.category : "";

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        {editingId ? "Edit Item" : "Add Item"}
      </h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          value={form.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          placeholder="Name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
        <input
          value={form.price}
          onChange={(e) => onFormChange("price", e.target.value)}
          placeholder="Price (e.g. Rs 120)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onFormChange("category", e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Pick existing category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
              v
            </span>
          </div>
          {categoryOptions.length === 0 && (
            <p className="text-xs text-amber-700">
              Create at least one category below before adding items.
            </p>
          )}
        </div>
        <textarea
          value={form.description}
          onChange={(e) => onFormChange("description", e.target.value)}
          rows={3}
          placeholder="Description"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.bestSeller}
            onChange={(e) => onFormChange("bestSeller", e.target.checked)}
          />
          Mark as best seller
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting || categoryOptions.length === 0}
            className="flex-1 rounded-lg bg-slate-900 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
