import Link from "next/link"
import { Home, Dumbbell, BarChart2, Trophy, User } from "lucide-react"

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-zinc-900 border-t border-zinc-800 sm:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <Link href="/dashboard" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-800 group">
          <Home className="w-5 h-5 mb-1 text-zinc-400 group-hover:text-zinc-50" />
          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-50">Home</span>
        </Link>
        <Link href="/workout" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-800 group">
          <Dumbbell className="w-5 h-5 mb-1 text-zinc-400 group-hover:text-zinc-50" />
          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-50">Workout</span>
        </Link>
        <Link href="/analytics" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-800 group">
          <BarChart2 className="w-5 h-5 mb-1 text-zinc-400 group-hover:text-zinc-50" />
          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-50">Stats</span>
        </Link>
        <Link href="/achievements" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-800 group">
          <Trophy className="w-5 h-5 mb-1 text-zinc-400 group-hover:text-zinc-50" />
          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-50">Achieve</span>
        </Link>
        <Link href="/profile" className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-800 group">
          <User className="w-5 h-5 mb-1 text-zinc-400 group-hover:text-zinc-50" />
          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-50">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
