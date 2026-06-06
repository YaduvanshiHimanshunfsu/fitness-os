import React from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Topbar from '@/components/shared/Topbar';
import BottomNav from '@/components/shared/BottomNav';
import PageTransitionWrapper from '@/components/shared/PageTransitionWrapper';
import MainLayoutWrapper from '@/components/shared/MainLayoutWrapper';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <Sidebar />

      {/* Main Layout Area Wrapper (handles dynamic left padding for sidebar) */}
      <MainLayoutWrapper>
        {/* Topbar */}
        <Topbar />

        {/* Scrollable Content Container */}
        <main className="flex-1 w-full pt-16 pb-20 md:pb-6 px-4 md:px-8 max-w-7xl mx-auto overflow-x-hidden">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </MainLayoutWrapper>
    </div>
  );
}
