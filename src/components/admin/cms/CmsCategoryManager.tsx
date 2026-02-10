import { type SubmitEvent, useState } from "react";

type CmsCategoryManagerProps = {
  categories: string[];
  deletingCategory: string | null;
  onCreateCategory: (name: string) => Promise<void>;
  onDeleteCategory: (name: string) => Promise<void>;
};

export default function CmsCategoryManager({
  categories,
  deletingCategory,
  onCreateCategory,
  onDeleteCategory,
}: CmsCategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCategory.trim();

    if (!name) {
      return;
    }

    setSubmitting(true);
    await onCreateCategory(name);
    setSubmitting(false);
    setNewCategory("");
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
      <p className="mt-1 text-sm text-slate-600">Create and delete categories.</p>

      <form onSubmit={handleCreate} className="mt-4 flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
          >
            <span className="text-sm text-slate-800">{category}</span>
            <button
              type="button"
              onClick={() => onDeleteCategory(category)}
              disabled={deletingCategory === category}
              className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingCategory === category ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
            No categories yet.
          </p>
        )}
      </div>
    </div>
  );
}
