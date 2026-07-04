'use client';

import React, { useState } from 'react';
import { ChevronDown, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientMartialArtsPage({ templates }: { templates: any[] }) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-10 pb-32">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A160F] border border-[#FF6B35]/20 rounded-md mb-4">
            <Swords className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF6B35] uppercase">
              Martial Arts Training
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            Muay Thai Phase 1
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
            45 Days Program — Master the fundamentals of Muay Thai.
          </p>
        </div>

        {/* Days List */}
        <div className="space-y-4">
          {templates.map((template) => {
            const isExpanded = expandedDay === template.day;
            const drills = template.drills || [];

            return (
              <div 
                key={template.day}
                className={`bg-white dark:bg-[#111111] border rounded-xl overflow-hidden transition-colors ${
                  isExpanded ? 'border-[#FF6B35]/50' : 'border-zinc-200 dark:border-[#1F1F1F] hover:border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Day Row Header */}
                <button
                  onClick={() => toggleDay(template.day)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div>
                    <h2 className="text-lg font-black tracking-wide text-zinc-900 dark:text-white uppercase flex items-center gap-2">
                      {template.day}
                    </h2>
                    <p className="text-sm font-semibold text-[#FF6B35] tracking-wide uppercase mt-1">
                      {template.title}
                    </p>
                    {template.description && (
                      <p className="text-xs text-zinc-500 mt-1">{template.description}</p>
                    )}
                  </div>
                  
                  <div className={`p-2 rounded-full bg-white dark:bg-zinc-900 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-[#2A160F] text-[#FF6B35]' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Expanded Drills List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950/50"
                    >
                      <div className="p-5 space-y-3">
                        {drills.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-zinc-500 font-semibold tracking-wider uppercase text-sm">
                              No drills assigned.
                            </p>
                          </div>
                        ) : (
                          drills.map((drill: any, idx: number) => {
                            return (
                            <div key={drill.id || idx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-[#1F1F1F] p-3 rounded-lg">
                              <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center hidden sm:flex">
                                <img src={drill.image_url || '/images/MARTIAL_ARTS/placeholder.png'} alt={drill.name} className="max-w-full max-h-full object-contain mix-blend-screen opacity-50" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wide text-sm">
                                  {idx + 1}. {drill.name}
                                </h3>
                                <p className="text-xs text-zinc-500 mt-0.5">{drill.instruction}</p>
                                {drill.comment && (
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                                      {drill.comment}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-left sm:text-right mt-2 sm:mt-0 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-md sm:bg-transparent sm:p-0">
                                <span className="block font-black text-zinc-900 dark:text-white">{drill.sets} SETS</span>
                                <span className="block font-bold text-[#FF6B35] text-xs">{drill.reps}</span>
                              </div>
                            </div>
                          )})
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
