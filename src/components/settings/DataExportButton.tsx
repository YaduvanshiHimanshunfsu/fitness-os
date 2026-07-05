'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function DataExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // Fetch workouts
      const { data: workouts } = await supabase
        .from('workouts_v5')
        .select(`
          *,
          exercises:workout_exercises_v5(
            *,
            sets:workout_sets_v5(*)
          )
        `)
        .eq('profile_id', user.id);

      // Create JSON blob
      const exportData = {
        exportDate: new Date().toISOString(),
        user: user.id,
        version: '6.0',
        workouts: workouts || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitness_os_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-200 dark:border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-left bg-transparent"
    >
      <div className="flex items-center gap-3">
        {isExporting ? (
          <Loader2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400 animate-spin" />
        ) : (
          <Download className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Export Workout Data</span>
          <span className="text-xs text-zinc-500">Download your history as JSON</span>
        </div>
      </div>
    </button>
  );
}
