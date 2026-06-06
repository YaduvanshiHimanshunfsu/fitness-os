'use client';

import React from 'react';
import { useUIStore } from '@/hooks/useUI';

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-60'}`}>
      {children}
    </div>
  );
}
