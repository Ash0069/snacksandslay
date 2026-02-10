type CmsToastProps = {
  message: string;
};

export default function CmsToast({ message }: CmsToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
