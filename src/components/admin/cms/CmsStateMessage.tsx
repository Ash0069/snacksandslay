type CmsStateMessageProps = {
  message: string;
};

export default function CmsStateMessage({ message }: CmsStateMessageProps) {
  return <div className="min-h-screen bg-slate-100 p-6">{message}</div>;
}
