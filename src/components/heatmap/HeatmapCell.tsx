export function HeatmapCell({ 
  date, 
  completed, 
  isRestDay, 
  isFuture, 
  isToday 
}: { 
  date: string
  completed: boolean
  isRestDay: boolean
  isFuture: boolean
  isToday: boolean 
}) {
  let bgClass = 'bg-zinc-800'
  
  if (isFuture) {
    bgClass = 'bg-transparent border border-zinc-800'
  } else if (completed) {
    bgClass = 'bg-zinc-300'
  } else if (isRestDay) {
    // using inline style for diagonal stripe in the parent or tailwind custom class
    // using arbitrary variant for background
    bgClass = 'bg-zinc-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.04)_3px,rgba(255,255,255,0.04)_4px)]'
  }
  
  let ringClass = ''
  if (isToday) ringClass = 'ring-1 ring-zinc-400 ring-offset-1 ring-offset-zinc-900 z-10 relative'

  const title = isFuture ? date : `${date} — ${completed ? 'Completed' : isRestDay ? 'Rest Day' : 'Missed'}`

  return (
    <div
      title={title}
      className={`w-[11px] h-[11px] rounded-[2px] transition-colors hover:ring-1 hover:ring-zinc-500 ${bgClass} ${ringClass}`}
    />
  )
}
