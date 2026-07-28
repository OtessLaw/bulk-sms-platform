import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AiSupportWidget from '../ai/AiSupportWidget';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1E232B] flex flex-col font-sans text-white relative">
      <Navbar onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      {/* Floating Production AI Support Widget */}
      <AiSupportWidget />
    </div>
  );
}
