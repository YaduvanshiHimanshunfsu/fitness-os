'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Trophy, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Scale,
  Menu,
  Bot
} from 'lucide-react';
import { logout } from '@/actions/auth';
import { useUIStore } from '@/hooks/useUI';
import { createClient } from '@/lib/supabase/client';
import { getLevelFromXP } from '@/utils/level-calculator';

  { name: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard },
  { name: 'Schedule',     path: '/schedule',     icon: Dumbbell        },
  { name: 'AI Coach',     path: '/coach',        icon: Bot             },
  { name: 'Analytics',    path: '/analytics',    icon: BarChart3       },
  { name: 'History',      path: '/history',      icon: Calendar        },
  { name: 'Records',      path: '/records',      icon: History         },
  { name: 'Metrics',      path: '/metrics',      icon: Scale           },
  { name: 'Achievements', path: '/achievements', icon: Trophy          },
  { name: 'Settings',     path: '/settings',     icon: Settings        },
];

export default function Sidebar() {
  const pathname                              = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  // ── Dynamic user profile ──────────────────────────────────────────────
  const [displayName,  setDisplayName]  = useState('...');
  const [levelLabel,   setLevelLabel]   = useState('Loading...');
  const [avatarLetter, setAvatarLetter] = useState('?');
  const [avatarUrl,    setAvatarUrl]    = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const { data: profile } = await supabase.from()
          .select('name, xp_total, avatar_url')
          .eq('id', user.id)
          .single();

        if (cancelled) return;

        const name = profile?.name || user.email?.split('@')[0] || 'Athlete';
        const xp   = profile?.xp_total ?? 0;
        const { current } = getLevelFromXP(xp);

        setDisplayName(name);
        setAvatarLetter(name.charAt(0).toUpperCase());
        setLevelLabel(`${current.name} · Lv ${current.level}`);
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      } catch {
        /* silent */
      }
    };
    load();
    return () => { cancelled = true; };
  }, [pathname]); // Re-fetch when route changes (handles after profile update)

  const handleLogout = async () => { await logout(); };

  return (
    <aside 
      className={`fixed top-0 left-0 z-50 h-screen hidden md:flex flex-col bg-zinc-100 dark:bg-[#0D0D0D] border-r border-zinc-200 dark:border-[#1F1F1F] transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center px-4 border-b border-zinc-200 dark:border-[#1F1F1F] shrink-0 justify-between`}>
        {isSidebarCollapsed ? (
          <div className="flex items-center justify-center w-full">
            <button onClick={toggleSidebar} className="p-2 hover:bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-[#FF6B35]" />
              <span className="font-sans font-black tracking-wider text-lg text-zinc-900 dark:text-white">
                FITNESS <span className="text-[#FF6B35]">OS</span>
              </span>
            </Link>
            <button onClick={toggleSidebar} className="p-1.5 hover:bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={`relative flex items-center gap-3 py-3 rounded-lg text-sm font-medium transition-all group ${
                isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                isActive 
                  ? 'text-zinc-900 dark:text-white' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-white dark:bg-zinc-900/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-900/40 border-l-2 border-[#FF6B35] rounded-lg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 z-10 transition-colors ${
                isActive ? 'text-[#FF6B35]' : 'text-zinc-500 group-hover:text-[#FF6B35]'
              }`} />
              {!isSidebarCollapsed && (
                <span className="z-10 relative group-hover:translate-x-1 transition-transform duration-200 truncate">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col border-t border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950/40 shrink-0">
        {!isSidebarCollapsed && (
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-[#1F1F1F]/50">
            <div className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              <p className="text-zinc-600 dark:text-zinc-400 font-bold mb-0.5">Created by Himanshu Yadav</p>
              <p>&copy; {new Date().getFullYear()} Fitness OS</p>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className={`p-4 flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-4' : 'justify-between gap-3'}`}>
          <Link href="/profile" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#FF6B35]/20 to-[#FF6B35]/40 border border-[#FF6B35]/30 flex items-center justify-center font-mono font-bold text-zinc-900 dark:text-white text-base shadow-inner shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wide leading-tight truncate">
                  {displayName}
                </span>
                <span className="text-[11px] text-[#FF6B35] font-medium uppercase tracking-wider leading-none mt-1 truncate">
                  {levelLabel}
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={`p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ${isSidebarCollapsed ? 'w-full flex justify-center' : ''}`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
