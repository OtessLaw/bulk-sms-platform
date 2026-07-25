import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FileBarChart, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Reports() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, deliveredCount: 0, deliveryRate: '100.0' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get('/reports');
      if (res.data.success) {
        setMessages(res.data.data.messages);
        setStats(res.data.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Delivery Logs</h1>
        <p className="text-xs text-[#AEB4BC]">Real-time SMS delivery status and gateway response logs</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Recipient</th>
                <th className="pb-3 px-3">Sender ID</th>
                <th className="pb-3 px-3">Message Content</th>
                <th className="pb-3 px-3">Units</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {messages.length > 0 ? (
                messages.map((m) => (
                  <tr key={m._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-mono text-[#D4AF6A]">{m.recipientPhone}</td>
                    <td className="py-3 px-3 font-bold">{m.senderId}</td>
                    <td className="py-3 px-3 truncate max-w-xs text-[#AEB4BC]">{m.content}</td>
                    <td className="py-3 px-3 font-mono text-white">{m.smsUnits} Unit</td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(m.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-[#AEB4BC]">
                    No SMS messages dispatched yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
