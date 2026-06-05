'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { chartReveal } from '@/lib/animations'
import type { MonthlyChartData } from '@/services/analytics-service'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--zinc-900)', border: '1px solid var(--zinc-700)', borderRadius: 8, padding: '8px 12px' }}>
      <p style={{ color: 'var(--zinc-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>{label}</p>
      <p style={{ color: 'var(--zinc-100)', fontSize: 15, fontWeight: 700, marginTop: 4 }}>{payload[0].value} sets</p>
    </div>
  )
}

export function MonthlyChart({ data }: { data: MonthlyChartData[] }) {
  return (
    <motion.div variants={chartReveal} initial="initial" animate="animate" className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4d4d8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#d4d4d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} 
            dy={10}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }} 
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="sets" 
            stroke="#d4d4d8" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSets)" 
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
