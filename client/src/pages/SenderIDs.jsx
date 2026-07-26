import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle2, Plus, ShieldCheck } from 'lucide-react';

export default function SenderIDs() {
  const [senderIds, setSenderIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSender, setNewSender] = useState({ senderId: '', purpose: '', sampleMessage: '' });

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

  const handleRequest = async (e) => {
    e.preventDefault();
    if (newSender.senderId.length > 11) {
      toast.error('Sender ID must be maximum 11 characters');
      return;
    }

    try {
      const res = await API.post('/sender-ids/request', newSender);
      if (res.data.success) {
        toast.success(res.data.message || 'Sender ID registered and approved instantly!');
        fetchSenderIds();
        setShowModal(false);
        setNewSender({ senderId: '', purpose: '', sampleMessage: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Custom Sender IDs</h1>
          <p className="text-xs text-[#AEB4BC]">Register custom 11-character branded SMS headers with instant Arkesel activation</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Sender ID</span>
        </button>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Sender ID</th>
                <th className="pb-3 px-3">Purpose</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Date Activated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              <tr className="hover:bg-[#1E232B]/40">
                <td className="py-3 px-3 font-bold text-[#D4AF6A]">FASREACH</td>
                <td className="py-3 px-3 text-[#AEB4BC]">Default Platform Header</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    Active (Default)
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-[#AEB4BC]">System</td>
              </tr>
              {senderIds.map((s) => (
                <tr key={s._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3 px-3 font-bold text-[#D4AF6A]">{s.senderId}</td>
                  <td className="py-3 px-3 text-[#AEB4BC]">{s.purpose}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {s.status === 'Approved' ? 'Active' : s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Register Sender ID Header</h3>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Sender ID Header (Max 11 Chars)</label>
                <input
                  type="text"
                  maxLength="11"
                  required
                  value={newSender.senderId}
                  onChange={(e) => setNewSender({ ...newSender, senderId: e.target.value.toUpperCase() })}
                  placeholder="e.g. MYBRAND"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Business Purpose</label>
                <input
                  type="text"
                  required
                  value={newSender.purpose}
                  onChange={(e) => setNewSender({ ...newSender, purpose: e.target.value })}
                  placeholder="Transactional order updates"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2 rounded-xl">
                  Register & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
