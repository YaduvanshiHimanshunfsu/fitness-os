'use client';

import React, { useState, useEffect } from 'react';
import { BodyMetric, addBodyMetric } from '@/services/metrics-service';
import { useNotifications } from '@/hooks/useNotifications';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Save, Scale, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function BodyMetricsClient({ initialMetrics }: { initialMetrics: BodyMetric[] }) {
  const [metrics, setMetrics] = useState<BodyMetric[]>(initialMetrics);
  const [weight, setWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  // Load height from local storage if available
  useEffect(() => {
    const savedHeight = localStorage.getItem('fitness_os_height_cm');
    if (savedHeight) setHeightCm(savedHeight);
  }, []);

  const handleSaveHeight = (val: string) => {
    setHeightCm(val);
    localStorage.setItem('fitness_os_height_cm', val);
  };

  const currentBMI = React.useMemo(() => {
    if (!heightCm || metrics.length === 0) return null;
    const h = parseFloat(heightCm) / 100;
    const w = metrics[metrics.length - 1].weight_kg;
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return null;
  }, [heightCm, metrics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    setLoading(true);
    try {
      const wKg = parseFloat(weight);
      const bfPct = bodyFat ? parseFloat(bodyFat) : null;
      
      const newMetric = await addBodyMetric(wKg, bfPct);
      setMetrics(prev => [...prev, newMetric]);
      setWeight('');
      setBodyFat('');
      
      addNotification({
        type: 'success',
        title: 'Metric Saved',
        message: 'Your body metrics have been logged successfully!',
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to save metric.',
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = metrics.map(m => ({
    date: new Date(m.measured_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: m.weight_kg,
    bodyFat: m.body_fat_percentage,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Card */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2 mb-6">
            <Scale className="w-5 h-5 text-[#10B981]" />
            Log Metrics
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="e.g. 75.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={e => setBodyFat(e.target.value)}
                className="w-full bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="e.g. 15.2"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !weight}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-zinc-900 dark:text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Log Entry'}
            </motion.button>
          </form>

          {/* BMI Calculator Addon */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block flex justify-between">
               <span>Height (cm)</span>
               <span className="text-[#10B981]">For BMI</span>
             </label>
             <input
                type="number"
                value={heightCm}
                onChange={e => handleSaveHeight(e.target.value)}
                className="w-full bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="e.g. 180"
              />
             {currentBMI && (
               <div className="mt-4 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[#10B981] font-bold">
                   <Activity className="w-5 h-5" />
                   Current BMI
                 </div>
                 <div className="text-2xl font-black text-zinc-900 dark:text-white">{currentBMI}</div>
               </div>
             )}
          </div>
        </div>

        {/* Chart Card */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-6">Weight Trend</h3>
          
          <div className="flex-1 min-h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#fff', stroke: '#10B981' }}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest text-sm">
                No data available yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
