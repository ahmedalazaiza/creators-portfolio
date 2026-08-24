import React from "react";

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#151813] rounded-[28px] overflow-hidden border border-slate-300 dark:border-white/15 flex flex-col justify-between animate-pulse">
      <div className="space-y-3">
        {/* Cover Image Aspect Skeleton */}
        <div className="aspect-4/3 w-full bg-slate-200 dark:bg-[#1e231b]/80 relative" />

        {/* Info Area */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-full w-20" />
            <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-full w-10" />
          </div>
          <div className="h-5 bg-slate-200 dark:bg-[#1e231b] rounded-md w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-5/6" />
        </div>
      </div>

      {/* Footer / Creator Strip */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#1e231b]" />
          <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-16" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-8" />
          <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-8" />
        </div>
      </div>
    </div>
  );
}

export function ProjectGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySliderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1e231b]" />
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-32" />
            <div className="h-3 bg-slate-200 dark:bg-[#1e231b] rounded-md w-48" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-[#1e231b]" />
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-[#1e231b]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-md animate-pulse">
      <div className="h-48 sm:h-64 w-full bg-slate-200 dark:bg-[#171915]" />
      <div className="p-6 sm:p-10 -mt-16 sm:-mt-20 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-300 dark:bg-[#1e231b] border-4 border-background" />
            <div className="space-y-2 text-center sm:text-left">
              <div className="h-6 bg-slate-200 dark:bg-[#1e231b] rounded-md w-48 mx-auto sm:mx-0" />
              <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-32 mx-auto sm:mx-0" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-28 rounded-full bg-slate-200 dark:bg-[#1e231b]" />
            <div className="h-9 w-24 rounded-full bg-slate-200 dark:bg-[#1e231b]" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 dark:border-white/10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-[#1e231b]/60" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen pt-4 pb-20 max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 space-y-8 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-48" />
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 dark:bg-[#1e231b] rounded-md w-2/3" />
        <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-1/2" />
      </div>
      <div className="aspect-16/10 w-full rounded-3xl bg-slate-200 dark:bg-[#171915]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-full" />
          <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-[#1e231b] rounded-md w-4/6" />
        </div>
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-[#1e231b]/60" />
      </div>
    </div>
  );
}
