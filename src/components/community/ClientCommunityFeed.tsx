'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flame, Trophy, Award, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface FeedEvent {
  id: string
  user_name: string
  action_type: 'workout_completed' | 'pr_hit' | 'achievement_unlocked' | 'streak_milestone'
  data: {
    workout_name?: string
    xp_earned?: number
    duration_minutes?: number
    sets_completed?: number
    new_record?: boolean
    achievement_name?: string
    streak?: number
  }
  created_at: string
}

function buildEventText(event: FeedEvent): string {
  const d = event.data
  switch (event.action_type) {
    case 'workout_completed':
      return [
        `completed "${d.workout_name || 'a workout'}"`,
        d.xp_earned ? `+${d.xp_earned} XP` : '',
        d.duration_minutes ? `in ${d.duration_minutes}m` : '',
        d.new_record ? 'New PR!' : '',
      ].filter(Boolean).join(' · ')
    case 'pr_hit':               return 'hit a new Personal Record!'
    case 'achievement_unlocked': return `unlocked "${d.achievement_name || 'an achievement'}" 🏅`
    case 'streak_milestone':     return `reached a ${d.streak}-day streak! 🔥`
    default:                     return 'did something awesome'
  }
}

interface Props {
  initialFeed: FeedEvent[]
}

export default function ClientCommunityFeed({ initialFeed }: Props) {
  const [events, setEvents] = useState<FeedEvent[]>(initialFeed)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('community-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' }, (payload) => {
        setEvents(prev => [payload.new as FeedEvent, ...prev].slice(0, 50))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  if (events.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500 font-semibold">
        No activity yet. Complete a workout to appear on the community feed!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C61] flex items-center justify-center font-black text-sm text-white shrink-0">
              {event.user_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-zinc-900 dark:text-white text-sm">{event.user_name}</span>
                {event.action_type === 'workout_completed'    && <Zap    className="w-4 h-4 text-[#FF4500]"    />}
                {event.action_type === 'pr_hit'               && <Trophy className="w-4 h-4 text-yellow-500"   />}
                {event.action_type === 'achievement_unlocked' && <Award  className="w-4 h-4 text-purple-400"   />}
                {event.action_type === 'streak_milestone'     && <Flame  className="w-4 h-4 text-orange-400" fill="currentColor" />}
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">{buildEventText(event)}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
