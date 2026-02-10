import type { MenuItem } from "@/lib/menuData";

type CmsDeleteConfirmModalProps = {
  item: MenuItem | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function CmsDeleteConfirmModal({
  item,
  deleting,
  onCancel,
  onConfirm,
}: CmsDeleteConfirmModalProps) {
  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-slate-900">Delete menu item?</h3>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <span className="font-semibold text-slate-900">{item.name}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
