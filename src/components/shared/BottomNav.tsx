'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Dumbbell, 
  BarChart3, 
  History, 
  Settings,
  Trophy,
  Calendar,
  Scale
} from 'lucide-react';

const ITEMS = [
  { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', path: '/schedule', icon: Dumbbell },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'History', path: '/history', icon: Calendar },
  { name: 'Records', path: '/records', icon: History },
  { name: 'Metrics', path: '/metrics', icon: Scale },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Settings', path: '/settings', icon: Settings }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-zinc-50 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-t border-zinc-200 dark:border-[#1F1F1F] md:hidden flex justify-start sm:justify-around items-center px-2 overflow-x-auto hide-scrollbar gap-2">
      {ITEMS.map((item) => {
        const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg transition-all ${
              isActive ? 'text-[#FF6B35]' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-bold tracking-wide uppercase leading-none">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
