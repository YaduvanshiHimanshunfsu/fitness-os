import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import AnimatedBackground from "@/components/layout/AnimatedBackground"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-zinc-950 min-h-screen">
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 sm:ml-64 pb-20 sm:pb-0 overflow-y-auto">
        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
