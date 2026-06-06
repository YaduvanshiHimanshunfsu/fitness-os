'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useNotifications, NotificationType } from '@/hooks/useNotifications';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount() > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF4500] rounded-full border-2 border-[#111111]"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-[#161616] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white tracking-tight">Notifications</h3>
              {unreadCount() > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-[#FF4500] hover:text-white transition-colors uppercase tracking-widest"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm font-medium">
                  You're all caught up!
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <motion.div 
                      layout
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 border-b border-white/5 flex gap-3 group transition-colors cursor-pointer ${
                        notif.read ? 'opacity-60 hover:opacity-100' : 'bg-white/5'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-white text-sm truncate">{notif.title}</h4>
                          <span className="text-[10px] text-zinc-500 font-bold whitespace-nowrap">
                            {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white transition-all shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
