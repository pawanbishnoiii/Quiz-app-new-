import React from "react";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-zinc-800 ${className}`} />
);

export const TestSeriesCardSkeleton = () => (
  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-2">
    <Skeleton className="aspect-video w-full rounded-2xl" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </div>
);

export const TestRowSkeleton = () => (
  <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-8 w-24 rounded-xl" />
  </div>
);
