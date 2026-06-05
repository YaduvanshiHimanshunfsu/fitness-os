'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { chartReveal } from '@/lib/animations'
import type { WeeklyChartData } from '@/services/analytics-service'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--zinc-900)', border: '1px solid var(--zinc-700)', borderRadius: 8, padding: '8px 12px' }}>
      <p style={{ color: 'var(--zinc-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>{label}</p>
      <p style={{ color: 'var(--zinc-100)', fontSize: 15, fontWeight: 700, marginTop: 4 }}>{payload[0].value} sets</p>
    </div>
  )
}

export function WeeklyChart({ data }: { data: WeeklyChartData[] }) {
  // Map data to use correct colors per bar
  const chartData = data.map(d => ({
    ...d,
    fill: d.completed ? '#d4d4d8' : '#3f3f46' // zinc-300 vs zinc-700
  }))

  return (
    <motion.div variants={chartReveal} initial="initial" animate="animate" className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
          <XAxis 
            dataKey="week" 
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
            radius={[4, 4, 0, 0]} 
            isAnimationActive={true}
            animationDuration={1000}
            // Fill comes from the data map
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
