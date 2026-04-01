import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg border border-success/30 bg-white p-4 shadow-xl">
      <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
      <span className="text-sm font-medium text-neutral-900">{message}</span>
    </div>
  );
}