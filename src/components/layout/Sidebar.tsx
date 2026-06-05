import Link from "next/link"
import { Home, Dumbbell, BarChart2, Trophy, User } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-zinc-800 bg-zinc-950">
      <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-950 flex flex-col">
        <Link href="/dashboard" className="flex items-center ps-2 mb-8 mt-2">
          <span className="self-center text-xl font-bold whitespace-nowrap text-white tracking-wider">FITNESS OS</span>
        </Link>
        <ul className="space-y-2 font-medium flex-1">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white group">
              <Home className="w-5 h-5 text-zinc-500 transition duration-75 group-hover:text-white" />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/workout" className="flex items-center p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white group">
              <Dumbbell className="w-5 h-5 text-zinc-500 transition duration-75 group-hover:text-white" />
              <span className="ms-3">Workout</span>
            </Link>
          </li>
          <li>
            <Link href="/analytics" className="flex items-center p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white group">
              <BarChart2 className="w-5 h-5 text-zinc-500 transition duration-75 group-hover:text-white" />
              <span className="ms-3">Analytics</span>
            </Link>
          </li>
          <li>
            <Link href="/achievements" className="flex items-center p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white group">
              <Trophy className="w-5 h-5 text-zinc-500 transition duration-75 group-hover:text-white" />
              <span className="ms-3">Achievements</span>
            </Link>
          </li>
        </ul>
        <ul className="space-y-2 font-medium border-t border-zinc-800 pt-4 mt-4">
          <li>
            <Link href="/profile" className="flex items-center p-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white group">
              <User className="w-5 h-5 text-zinc-500 transition duration-75 group-hover:text-white" />
              <span className="ms-3">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
