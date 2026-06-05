'use client'
import { useRouter } from 'next/navigation'
import { isRestDay } from '@/utils/date-utils'

export function StartWorkoutButton() {
  const router = useRouter()
  const rest = isRestDay()

  return (
    <div className="mb-8 relative flex justify-center w-full">
      {/* Pulse animation for the ring */}
      <div className="absolute inset-0 rounded-xl border border-zinc-500 pointer-events-none animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
      
      <button
        onClick={() => router.push(rest ? '/dashboard' : '/workout/posture')}
        className={`w-full py-5 rounded-xl border font-bold tracking-widest uppercase text-sm transition-all duration-300 active:scale-95
          ${rest 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed' 
            : 'bg-zinc-800 border-zinc-600 text-zinc-100 hover:scale-[1.02] hover:border-zinc-400 hover:bg-zinc-700 shadow-lg shadow-black/50'
          }`}
        disabled={rest}
      >
        {rest ? 'Rest Day Active' : 'Start Workout →'}
      </button>
    </div>
  )
}
