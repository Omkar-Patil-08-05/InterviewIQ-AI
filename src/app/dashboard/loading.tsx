export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 pb-6 border-b border-white/5">
        <div className="h-10 w-64 bg-white/5 rounded-md animate-pulse" />
        <div className="h-5 w-96 bg-white/5 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 w-full rounded-xl bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] w-full rounded-xl bg-white/5 animate-pulse border border-white/5" />
        <div className="h-[400px] w-full rounded-xl bg-white/5 animate-pulse border border-white/5" />
      </div>
      
      <div className="h-[300px] w-full rounded-xl bg-white/5 animate-pulse border border-white/5" />
    </div>
  )
}
