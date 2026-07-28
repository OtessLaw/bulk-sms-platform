import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle2, Plus, ShieldCheck, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

const PROTECTED_BRANDS = [
  'MTN', 'TELECEL', 'VODAFONE', 'AIRTELTIGO', 'AIRTEL', 'TIGO', 'GLO',
  'GCB', 'ECOBANK', 'STANBIC', 'ABSA', 'CALBANK', 'FIDELITY', 'ZENITH', 'ACCESS',
  'UBA', 'GTBANK', 'BOA', 'ADB', 'NIB', 'MOMO', 'GHIPSS', 'PAYSTACK', 'HUBTEL', 'ARKESEL',
  'GRA', 'SSNIT', 'ECG', 'GWCL', 'NCA', 'NIA', 'POLICE', 'MILITARY', 'GOVGHANA', 'DVLA', 'COCOBOD',
];

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

  const isProtectedInput = PROTECTED_BRANDS.some((brand) => {
    const clean = newSender.senderId.trim().toUpperCase();
    return clean && (clean === brand || clean.includes(brand) || (brand.length >= 3 && clean.startsWith(brand)));
  });

  const handleRequest = async (e) => {
    e.preventDefault();
    const cleanHeader = newSender.senderId.trim().toUpperCase();

    if (cleanHeader.length > 11) {
      toast.error('Sender ID must be maximum 11 characters');
      return;
    }

    if (isProtectedInput) {
      toast.error(`Security Warning: Sender ID '${cleanHeader}' is reserved for a reputable institution to prevent fraud.`);
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
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Custom Sender IDs
          </h1>
          <p className="text-xs text-[#AEB4BC]">Register custom 11-character branded SMS headers with anti-fraud security protection</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Sender ID</span>
        </button>
      </div>

      {/* Anti-Fraud Security Information Notice */}
      <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.3)] rounded-3xl p-5 shadow-2xl flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-[#D4AF6A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#AEB4BC] space-y-1">
          <span className="font-bold text-white block">Anti-Phishing & Anti-Fraud Security Protection</span>
          <p>
            To prevent fraud and impersonation, Sender IDs of reputable institutions (banks, telecoms, government agencies, utilities) are restricted against unauthorized registration.
          </p>
        </div>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
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
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF6A]" /> Register Sender ID Header
            </h3>

            <div className="bg-[#1E232B] border border-amber-500/30 rounded-2xl p-3 text-[11px] text-[#AEB4BC]">
              <span className="text-amber-400 font-bold block mb-0.5">🔒 Anti-Fraud Security Protection</span>
              Institutional headers (e.g. ECG, MTN, GCB, GRA, SSNIT) are protected against unauthorized registration.
            </div>

            <form onSubmit={handleRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Sender ID Header (Max 11 Chars)</label>
                <input
                  type="text"
                  maxLength="11"
                  required
                  value={newSender.senderId}
                  onChange={(e) => setNewSender({ ...newSender, senderId: e.target.value.toUpperCase() })}
                  placeholder="e.g. MYBRAND"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white uppercase font-mono"
                />

                {isProtectedInput && (
                  <div className="mt-2 bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-[11px] font-bold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>This header is reserved for a reputable institution and cannot be registered to prevent fraud.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Business Purpose</label>
                <input
                  type="text"
                  required
                  value={newSender.purpose}
                  onChange={(e) => setNewSender({ ...newSender, purpose: e.target.value })}
                  placeholder="Transactional order updates"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProtectedInput}
                  className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                >
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
