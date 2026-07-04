'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientMuscleFocusPage({ category, drills }: { category: any, drills: any[] }) {

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-10 pb-32">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A160F] border border-[#FF6B35]/20 rounded-md mb-4">
            <Target className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF6B35] uppercase">
              Muscle Focus Training
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            {category.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
            Specialized exercises targeting {category.title.toLowerCase()}.
          </p>
        </div>

        {/* Drills List */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#1F1F1F] rounded-xl overflow-hidden">
            <div className="p-5 space-y-3">
              {drills.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-zinc-500 font-semibold tracking-wider uppercase text-sm">
                    No exercises assigned yet. Check back later!
                  </p>
                </div>
              ) : (
                drills.map((drill: any, idx: number) => {
                  return (
                  <div key={drill.id || idx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-[#1F1F1F] p-3 rounded-lg">
                    <div className="w-12 h-12 bg-white dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center hidden sm:flex">
                      <img src={drill.image_url || '/images/MARTIAL_ARTS/placeholder.png'} alt={drill.name} className="max-w-full max-h-full object-contain mix-blend-screen opacity-50" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wide text-sm">
                        {idx + 1}. {drill.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{drill.instruction}</p>
                      {drill.comment && (
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                            {drill.comment}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0 bg-zinc-200 dark:bg-zinc-800/50 p-2 rounded-md sm:bg-transparent sm:p-0">
                      <span className="block font-black text-zinc-900 dark:text-white">{drill.sets} SETS</span>
                      <span className="block font-bold text-[#FF6B35] text-xs">{drill.reps}</span>
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
