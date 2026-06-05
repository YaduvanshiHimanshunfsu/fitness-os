'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { chartReveal } from '@/lib/animations'
import type { YearlyChartData } from '@/services/analytics-service'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--zinc-900)', border: '1px solid var(--zinc-700)', borderRadius: 8, padding: '12px' }}>
      <p style={{ color: 'var(--zinc-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold', marginBottom: 8 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, backgroundColor: p.color, borderRadius: 2 }} />
          <span style={{ color: 'var(--zinc-300)', fontSize: 13 }}>{p.name}:</span>
          <span style={{ color: 'var(--zinc-100)', fontSize: 14, fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function YearlyChart({ data }: { data: YearlyChartData[] }) {
  return (
    <motion.div variants={chartReveal} initial="initial" animate="animate" className="h-[220px] w-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }} 
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
            <Bar 
              dataKey="sets" 
              name="Sets"
              fill="#d4d4d8" 
              radius={[2, 2, 0, 0]} 
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Bar 
              dataKey="workouts" 
              name="Workouts"
              fill="#52525b" 
              radius={[2, 2, 0, 0]} 
              isAnimationActive={true}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend to match aesthetic exactly */}
      <div className="flex items-center justify-end gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-300" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Sets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-600" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Workouts</span>
        </div>
      </div>
    </motion.div>
  )
}
