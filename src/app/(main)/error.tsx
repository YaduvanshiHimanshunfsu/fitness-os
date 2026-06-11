'use client';

import React, { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Log the error to our self-healing Notification system
    console.error('Self-healing caught an error:', error);
    
    addNotification({
      type: 'error',
      title: 'System Exception Intercepted',
      message: error.message || 'An unexpected error occurred during execution.',
    });
  }, [error, addNotification]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-white">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-center">
        System Error Prevented
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-8 max-w-md text-center">
        Our self-healing system intercepted a fatal exception. We've logged it to your Notification Bell for review.
      </p>
      
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold tracking-widest text-sm uppercase transition-colors"
      >
        <RefreshCcw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}
