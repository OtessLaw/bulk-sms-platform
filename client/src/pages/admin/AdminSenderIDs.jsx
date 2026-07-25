import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AdminSenderIDs() {
  const [senderIds, setSenderIds] = useState([]);

  useEffect(() => {
    fetchSenderIds();
  }, []);

  const fetchSenderIds = async () => {
    try {
      const res = await API.get('/sender-ids');
      if (res.data.success) {
        setSenderIds(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load Sender IDs', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sender ID Approval Queue</h1>
        <p className="text-xs text-[#AEB4BC]">Review and approve custom branded SMS headers</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Sender ID</th>
                <th className="pb-3 px-3">Purpose</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              <tr className="hover:bg-[#1E232B]/40">
                <td className="py-3 px-3 font-bold text-[#D4AF6A]">BULKSMS</td>
                <td className="py-3 px-3 text-[#AEB4BC]">Platform Header</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Approved System Default
                  </span>
                </td>
              </tr>
              {senderIds.map((s) => (
                <tr key={s._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3 px-3 font-bold text-[#D4AF6A]">{s.senderId}</td>
                  <td className="py-3 px-3 text-[#AEB4BC]">{s.purpose}</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
