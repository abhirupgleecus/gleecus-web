export function SkeletonBlock({ className = "h-4 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-200 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <SkeletonBlock className="mb-4 h-5 w-2/3" />
      <SkeletonBlock className="mb-2 h-4 w-1/3" />
      <SkeletonBlock className="mb-2 h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="grid grid-cols-5 gap-4 border-b border-neutral-200 bg-neutral-50 p-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonBlock key={index} className="h-4 w-full" />
        ))}
      </div>
      <div className="space-y-3 p-4">
        {[...Array(rows)].map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}