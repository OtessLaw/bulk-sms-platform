import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { ShieldCheck, Clock } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/admin/audit-logs');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#D4AF6A]" /> Security Audit Logs & Admin Trail
        </h1>
        <p className="text-xs text-[#AEB4BC]">Immutable record of all login events, wallet adjustments, and admin actions</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Action</th>
                <th className="pb-3 px-3">Details</th>
                <th className="pb-3 px-3">IP Address</th>
                <th className="pb-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3 px-3 font-semibold">{log.userId?.name || 'System'}</td>
                  <td className="py-3 px-3">
                    <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/30 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#AEB4BC]">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-[#AEB4BC]">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
