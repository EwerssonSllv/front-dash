import { Skeleton } from "./skeleton"

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-8 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <Skeleton className="mt-6 h-64 w-full rounded-lg" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <Skeleton className="h-5 w-40" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1 h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
