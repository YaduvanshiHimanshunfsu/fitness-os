export default function DashboardLoading() {
  return (
    <div className="w-full text-zinc-900 dark:text-white font-sans pb-12 relative animate-pulse">
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 p-4 sm:p-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-16 w-3/4 bg-white/5 rounded-xl" />
          <div className="h-64 w-full bg-white/5 rounded-3xl" />
          <div className="h-8 w-1/3 bg-white/5 rounded-md mt-4" />
          <div className="h-48 w-full bg-white/5 rounded-3xl" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-40 w-full bg-white/5 rounded-2xl" />
          <div className="h-64 w-full bg-white/5 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
