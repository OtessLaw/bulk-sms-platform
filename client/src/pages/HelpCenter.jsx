import React from 'react';
import { HelpCircle, MessageSquare, PhoneCall, BookOpen } from 'lucide-react';

export default function HelpCenter() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Help Center & Support Desk</h1>
        <p className="text-xs text-[#AEB4BC]">24/7 technical support and platform documentation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-2">
          <MessageSquare className="w-6 h-6 text-[#D4AF6A]" />
          <h3 className="text-sm font-bold text-white">Live Support Ticket</h3>
          <p className="text-xs text-[#AEB4BC]">Open a priority ticket with our engineering team.</p>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-2">
          <BookOpen className="w-6 h-6 text-[#D4AF6A]" />
          <h3 className="text-sm font-bold text-white">Developer API Docs</h3>
          <p className="text-xs text-[#AEB4BC]">Explore REST API endpoints for external website integrations.</p>
        </div>
      </div>
    </div>
  );
}
