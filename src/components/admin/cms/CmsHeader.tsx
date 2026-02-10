type CmsHeaderProps = {
  onLogout: () => void;
};

export default function CmsHeader({ onLogout }: CmsHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Menu CMS</h1>
        <p className="text-sm text-slate-600">Add, edit and remove menu items.</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-400"
      >
        Logout
      </button>
    </div>
  );
}
