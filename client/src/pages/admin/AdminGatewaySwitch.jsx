import React from 'react';
import { Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function AdminGatewaySwitch() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-[#D4AF6A]" /> Multi-Gateway Router & Auto Failover
        </h1>
        <p className="text-xs text-[#AEB4BC]">Live gateway monitoring and dynamic routing between Arkesel, Hubtel, and Twilio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2A3038]/70 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">Arkesel Gateway</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              PRIMARY
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">Active (100%)</div>
          <p className="text-xs text-[#AEB4BC]">Latency: 28ms • Delivery Rate: 99.8%</p>
        </div>

        <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">Hubtel Gateway</span>
            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
              STANDBY FAILOVER
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">Ready</div>
          <p className="text-xs text-[#AEB4BC]">Latency: 45ms • Delivery Rate: 99.2%</p>
        </div>
      </div>
    </div>
  );
}
