import type { ReactNode } from "react";

type CmsPageContainerProps = {
  children: ReactNode;
};

export default function CmsPageContainer({ children }: CmsPageContainerProps) {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">{children}</div>
    </div>
  );
}
