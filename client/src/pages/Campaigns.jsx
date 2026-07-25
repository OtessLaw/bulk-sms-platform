import React from 'react';
import { Megaphone, Calendar, Clock, Plus } from 'lucide-react';

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaign Scheduler</h1>
          <p className="text-xs text-[#AEB4BC]">Schedule broadcast campaigns for future execution</p>
        </div>

        <button className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Schedule Campaign</span>
        </button>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 text-center text-xs text-[#AEB4BC] shadow-2xl">
        <Megaphone className="w-10 h-10 text-[#D4AF6A] mx-auto mb-3 opacity-60" />
        <p className="font-semibold text-white">No Scheduled Broadcast Campaigns Active</p>
        <p className="mt-1">Create your first automated SMS campaign by clicking "Schedule Campaign".</p>
      </div>
    </div>
  );
}
