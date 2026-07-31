import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle2, Plus, ShieldCheck, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const PROTECTED_BRANDS_EXACT = new Set([
  'MTN', 'MTNGHANA', 'TELECEL', 'VODAFONE', 'AIRTELTIGO', 'AIRTEL', 'TIGO', 'GLO',
  'GCB', 'ECOBANK', 'STANBIC', 'ABSA', 'CALBANK', 'FIDELITY', 'ZENITH', 'ACCESS', 'ACCESSBANK',
  'UBA', 'GTBANK', 'BOA', 'ADB', 'NIB', 'MOMO', 'MOBILEMONEY', 'GHIPSS', 'GIPSS', 'PAYSTACK', 'HUBTEL', 'ARKESEL',
  'GRA', 'SSNIT', 'ECG', 'GWCL', 'NCA', 'NIA', 'POLICE', 'MILITARY', 'GOVGHANA', 'DVLA', 'COCOBOD',
]);

export default function SenderIDs() {
  const [senderIds, setSenderIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
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

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await API.post('/sender-ids/sync');
      if (res.data.success) {
        setSenderIds(res.data.data);
        toast.success(res.data.message || 'Synced status with Arkesel Gateway!');
      }
    } catch (err) {
      toast.error('Failed to sync statuses');
    } finally {
      setSyncing(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const cleanHeader = newSender.senderId.trim().toUpperCase();

    if (cleanHeader.length > 11) {
      toast.error('Sender ID must be maximum 11 characters');
      return;
    }

    // Exact Match check ONLY
    if (PROTECTED_BRANDS_EXACT.has(cleanHeader)) {
      toast.error(`Sender ID '${cleanHeader}' is reserved and unavailable. Please choose your custom business header.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/sender-ids/request', newSender);
      if (res.data.success) {
        toast.success(res.data.message || 'Sender ID submitted successfully!');
        fetchSenderIds();
        setShowModal(false);
        setNewSender({ senderId: '', purpose: '', sampleMessage: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Custom Sender IDs
          </h1>
          <p className="text-xs text-[#AEB4BC]">Register custom 11-character branded SMS headers with live gateway status tracking</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-[#2A3038] hover:bg-[#343B45] text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-white/10 flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF6A] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Gateway Status'}</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Sender ID</span>
          </button>
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
                <th className="pb-3 px-3 text-right">Date Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {senderIds.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-[#AEB4BC] text-xs">
                    No custom Sender IDs registered yet. Click "Register New Sender ID" above to submit your business header.
                  </td>
                </tr>
              ) : (
                senderIds.map((s) => {
                  const isApproved = s.status === 'Approved';
                  const isPending = s.status === 'Pending';
                  const isRejected = s.status === 'Rejected';

                  return (
                    <tr key={s._id} className="hover:bg-[#1E232B]/40">
                      <td className="py-3 px-3 font-bold text-[#D4AF6A]">{s.senderId}</td>
                      <td className="py-3 px-3 text-[#AEB4BC]">{s.purpose}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isPending
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <Clock className="w-3 h-3" />}
                          {isRejected && <AlertCircle className="w-3 h-3" />}
                          {isApproved ? 'Active (Approved)' : isPending ? 'Pending Gateway Approval' : 'Rejected'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              )}
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
                <button type="button" onClick={() => setShowModal(false)} disabled={submitting} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-4 py-2 rounded-xl disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />}
                  <span>{submitting ? 'Submitting...' : 'Submit for Approval'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
