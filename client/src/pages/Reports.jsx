import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FileBarChart, CheckCircle2, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

export default function Reports() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, deliveredCount: 0, pendingCount: 0, failedCount: 0, deliveryRate: '100.0' });
  const [syncing, setSyncing] = useState(false);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 15000);
    return () => clearInterval(interval);
  }, [limit]);

  const fetchReports = async () => {
    setSyncing(true);
    try {
      const res = await API.get(`/reports?limit=${limit}`);
      if (res.data.success) {
        setMessages(res.data.data.messages || []);
        setStats(res.data.data.stats || {});
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleManualSync = () => {
    toast.loading('Syncing Live Delivery Receipts...', { id: 'sync-toast' });
    fetchReports().then(() => {
      toast.success('Real-Time Delivery Statuses Synchronized!', { id: 'sync-toast' });
    });
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Reports & Live Delivery Logs
          </h1>
          <p className="text-xs text-[#AEB4BC]">Real-time SMS status tracking synchronized live with direct telco networks</p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="bg-[#2A3038] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-[#D4AF6A] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync Live Statuses'}</span>
        </button>
      </div>

      {/* Delivery Stats Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-4">
          <span className="text-[11px] text-[#AEB4BC] uppercase block">Total Messages</span>
          <span className="text-xl font-extrabold text-white">{stats.totalSent || 0}</span>
        </div>
        <div className="bg-[#2A3038]/70 border border-emerald-500/20 rounded-2xl p-4">
          <span className="text-[11px] text-emerald-400 uppercase block">Delivered</span>
          <span className="text-xl font-extrabold text-emerald-400">{stats.deliveredCount || 0}</span>
        </div>
        <div className="bg-[#2A3038]/70 border border-yellow-500/20 rounded-2xl p-4">
          <span className="text-[11px] text-yellow-400 uppercase block">Pending / Submitted</span>
          <span className="text-xl font-extrabold text-yellow-400">{stats.pendingCount || 0}</span>
        </div>
        <div className="bg-[#2A3038]/70 border border-red-500/20 rounded-2xl p-4">
          <span className="text-[11px] text-red-400 uppercase block">Failed / Rejected</span>
          <span className="text-xl font-extrabold text-red-400">{stats.failedCount || 0}</span>
        </div>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
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
                messages.map((m) => {
                  const isDelivered = m.status === 'Delivered';
                  const isPending = ['Pending', 'Submitted'].includes(m.status);
                  const isFailed = m.status === 'Failed';

                  return (
                    <tr key={m._id} className="hover:bg-[#1E232B]/40">
                      <td className="py-3 px-3 font-mono text-[#D4AF6A] whitespace-nowrap">{m.recipientPhone}</td>
                      <td className="py-3 px-3 font-bold whitespace-nowrap">{m.senderId}</td>
                      <td className="py-3 px-3 truncate max-w-xs text-[#AEB4BC]">{m.content}</td>
                      <td className="py-3 px-3 font-mono text-white whitespace-nowrap">{m.smsUnits} Unit</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            isDelivered
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isPending
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {isPending && <Clock className="w-3 h-3" />}
                          {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                          {isFailed && <AlertTriangle className="w-3 h-3" />}
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#AEB4BC] whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
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
        
        {messages.length > 0 && messages.length >= limit && (
          <div className="flex justify-center pt-4 border-t border-[rgba(212,175,106,0.1)]">
            <button
              onClick={() => setLimit(prev => prev + 100)}
              className="text-xs font-bold text-[#D4AF6A] bg-[#D4AF6A]/10 hover:bg-[#D4AF6A]/20 px-6 py-2 rounded-xl transition-colors"
            >
              Load Older Records
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
