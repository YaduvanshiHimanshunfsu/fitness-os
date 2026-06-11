export default function AnalyticsLoading() {
  return (
    <div className="p-4 sm:p-8 w-full text-zinc-900 dark:text-white font-sans pb-12 relative animate-pulse">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center">
          <div className="h-10 w-1/4 bg-white/5 rounded-lg" />
          <div className="h-10 w-32 bg-white/5 rounded-lg" />
        </div>
        
        {/* Heatmap skeleton */}
        <div className="h-48 w-full bg-white/5 rounded-2xl" />

        {/* Top charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 w-full bg-white/5 rounded-2xl" />
          <div className="h-64 w-full bg-white/5 rounded-2xl" />
        </div>

        {/* Bottom charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 w-full bg-white/5 rounded-2xl" />
          <div className="h-64 w-full bg-white/5 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
