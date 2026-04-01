import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center shadow-sm">
      <Inbox className="mx-auto mb-4 h-10 w-10 text-neutral-600" aria-hidden="true" />
      <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-base text-neutral-600">{description}</p>
    </div>
  );
}