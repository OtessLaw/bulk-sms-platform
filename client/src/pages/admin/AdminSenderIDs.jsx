import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

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

  const handleApprove = async (id, header) => {
    try {
      const res = await API.put(`/sender-ids/${id}/approve`);
      if (res.data.success) {
        toast.success(`Sender ID '${header}' approved!`);
        fetchSenderIds();
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id, header) => {
    const reason = prompt(`Enter rejection reason for '${header}':`, 'Sample message did not meet guidelines');
    if (!reason) return;

    try {
      const res = await API.put(`/sender-ids/${id}/reject`, { reason });
      if (res.data.success) {
        toast.success(`Sender ID '${header}' rejected`);
        fetchSenderIds();
      }
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#D4AF6A]" /> Sender ID Approval Queue
        </h1>
        <p className="text-xs text-[#AEB4BC]">Review and approve or reject user-submitted custom 11-character SMS headers</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Sender ID</th>
                <th className="pb-3 px-3">Applicant User</th>
                <th className="pb-3 px-3">Purpose / Sample</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              <tr className="hover:bg-[#1E232B]/40">
                <td className="py-3 px-3 font-bold text-[#D4AF6A]">FASREACH</td>
                <td className="py-3 px-3 text-[#AEB4BC]">System Default</td>
                <td className="py-3 px-3 text-[#AEB4BC]">Platform Header</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Approved System Default
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-[#AEB4BC]">System</td>
              </tr>
              {senderIds.map((s) => (
                <tr key={s._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3 px-3 font-bold text-[#D4AF6A]">{s.senderId}</td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {s.userId?.name || 'User'}
                    <span className="block text-[10px] text-[#AEB4BC] font-normal">{s.userId?.email}</span>
                  </td>
                  <td className="py-3 px-3 text-[#AEB4BC] max-w-xs truncate">
                    <p className="font-semibold text-white">{s.purpose}</p>
                    <p className="text-[11px] italic">{s.sampleMessage || '—'}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : s.status === 'Rejected'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    {s.status !== 'Approved' && (
                      <button
                        onClick={() => handleApprove(s._id, s.senderId)}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                    )}

                    {s.status !== 'Rejected' && (
                      <button
                        onClick={() => handleReject(s._id, s.senderId)}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    )}
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
