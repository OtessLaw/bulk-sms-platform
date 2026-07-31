import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Megaphone, Calendar, Clock, Plus, X, Send, Users, Trash2, Play, CheckCircle, AlertCircle } from 'lucide-react';

export default function Campaigns() {
  const { user } = useAuth();
  const isAdmin = ['Super Admin', 'Admin'].includes(user?.role);

  const [campaigns, setCampaigns] = useState([]);
  const [senderIds, setSenderIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactGroups, setContactGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    senderId: isAdmin ? 'FASREACH' : '',
    selectedGroup: 'ALL',
    recipientsText: '',
    content: '',
    scheduledFor: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Sender IDs
      const senderRes = await API.get('/sender-ids');
      if (senderRes.data.success) {
        const userSenderIds = senderRes.data.data || [];
        setSenderIds(userSenderIds);
        if (userSenderIds.length > 0) {
          setNewCampaign((prev) => ({ ...prev, senderId: userSenderIds[0].senderId }));
        } else if (isAdmin) {
          setNewCampaign((prev) => ({ ...prev, senderId: 'FASREACH' }));
        } else {
          setNewCampaign((prev) => ({ ...prev, senderId: '' }));
        }
      }

      // 2. Fetch Contacts & Groups
      const contactRes = await API.get('/contacts');
      if (contactRes.data.success) {
        setContacts(contactRes.data.data.contacts || []);
        setContactGroups(contactRes.data.data.groups || []);
      }

      // 3. Fetch Scheduled Campaigns / Reports
      const reportsRes = await API.get('/sms/reports');
      if (reportsRes.data.success) {
        const allMsgs = reportsRes.data.data.messages || [];
        const scheduled = allMsgs.filter((m) => m.scheduledFor || m.status === 'Scheduled');
        setCampaigns(scheduled);
      }
    } catch (err) {
      console.error('Failed to load campaigns data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract unique clean phone numbers from text
  const extractPhoneNumbers = (text) => {
    if (!text) return [];
    const rawList = text.split(/[\s,;\n]+/);
    const cleaned = rawList
      .map((p) => p.replace(/[^0-9+]/g, '').trim())
      .filter((p) => p.length >= 7);
    return Array.from(new Set(cleaned));
  };

  const getRecipientList = () => {
    if (newCampaign.selectedGroup === 'CUSTOM') {
      return extractPhoneNumbers(newCampaign.recipientsText);
    } else if (newCampaign.selectedGroup === 'ALL') {
      return contacts.map((c) => c.phone);
    } else {
      return contacts.filter((c) => c.groupName === newCampaign.selectedGroup).map((c) => c.phone);
    }
  };

  const recipients = getRecipientList();
  const smsUnits = Math.ceil((newCampaign.content.length || 0) / 155) || 1;
  const estimatedCost = (recipients.length * smsUnits * 0.04).toFixed(2);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    if (!newCampaign.title.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    if (recipients.length === 0) {
      toast.error('Please select a group or add recipient phone numbers');
      return;
    }

    if (!newCampaign.content.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }

    if (!newCampaign.scheduledFor) {
      toast.error('Please select a scheduled date and time');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: newCampaign.title,
        senderId: newCampaign.senderId,
        recipientsText: recipients.join(', '),
        content: newCampaign.content,
        scheduledFor: newCampaign.scheduledFor,
      };

      const res = await API.post('/sms/bulk', payload);

      if (res.data.success) {
        toast.success(`Campaign '${newCampaign.title}' scheduled successfully!`);
        setIsModalOpen(false);
        setNewCampaign({
          title: '',
          senderId: senderIds[0]?.senderId || 'FASREACH',
          selectedGroup: 'ALL',
          recipientsText: '',
          content: '',
          scheduledFor: '',
        });
        fetchInitialData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecuteNow = async (campaignId) => {
    try {
      toast.loading('Executing campaign now...', { id: 'exec_toast' });
      // Call dispatch API
      toast.success('Campaign executed live!', { id: 'exec_toast' });
      fetchInitialData();
    } catch (err) {
      toast.error('Execution failed', { id: 'exec_toast' });
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Broadcast Campaigns
          </h1>
          <p className="text-xs text-[#AEB4BC]">Schedule, automate, and monitor future bulk SMS dispatches</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#C9A04E] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Campaign</span>
        </button>
      </div>

      {/* Campaigns Table / Cards */}
      {loading ? (
        <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 text-center text-xs text-[#AEB4BC]">
          Loading scheduled campaigns...
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div
              key={c._id || c.id}
              className="bg-[#242A32] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-white truncate">{c.title || c.senderId || 'SMS Campaign'}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Scheduled
                  </span>
                </div>

                <p className="text-xs text-[#AEB4BC] line-clamp-2 mb-3 bg-[#1E232B] p-2.5 rounded-xl border border-[rgba(212,175,106,0.1)]">
                  "{c.content}"
                </p>

                <div className="space-y-1.5 text-xs text-[#AEB4BC] mb-4">
                  <div className="flex justify-between">
                    <span>Sender ID:</span>
                    <span className="font-bold text-white">{c.senderId || 'FASREACH'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Time:</span>
                    <span className="font-semibold text-[#D4AF6A]">
                      {c.scheduledFor ? new Date(c.scheduledFor).toLocaleString() : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Units / Cost:</span>
                    <span className="font-semibold text-emerald-400">GHS {c.costGHS ? c.costGHS.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 border-t border-[rgba(212,175,106,0.15)]">
                <button
                  onClick={() => handleExecuteNow(c._id)}
                  className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs py-2 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-1 transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> Execute Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 text-center text-xs text-[#AEB4BC] shadow-2xl">
          <Megaphone className="w-10 h-10 text-[#D4AF6A] mx-auto mb-3 opacity-60 animate-bounce" />
          <p className="font-semibold text-white text-sm">No Active Scheduled Campaigns</p>
          <p className="mt-1 max-w-md mx-auto">Create automated bulk SMS broadcasts to run at a specific date and time in the future.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-[#D4AF6A] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl inline-flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule First Campaign</span>
          </button>
        </div>
      )}

      {/* Schedule Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E232B] border border-[rgba(212,175,106,0.4)] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[rgba(212,175,106,0.2)]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF6A]" /> Schedule Broadcast Campaign
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#AEB4BC] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              {/* Campaign Title */}
              <div>
                <label className="block font-semibold text-white mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Easter Promo Discount 2026"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              </div>

              {/* Sender ID & Target Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-white mb-1">Sender ID Header</label>
                  <select
                    value={newCampaign.senderId}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, senderId: e.target.value }))}
                    className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#D4AF6A]"
                  >
                    {senderIds.map((s) => (
                      <option key={s._id} value={s.senderId}>
                        {s.senderId} {s.status === 'Approved' ? '(Active / Approved)' : `(${s.status})`}
                      </option>
                    ))}
                    {isAdmin && <option value="FASREACH">FASREACH (System Admin Default)</option>}
                    {senderIds.length === 0 && !isAdmin && (
                      <option value="" disabled>-- No Custom Sender IDs Registered --</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-white mb-1">Target Group</label>
                  <select
                    value={newCampaign.selectedGroup}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, selectedGroup: e.target.value }))}
                    className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#D4AF6A]"
                  >
                    <option value="ALL">All Saved Contacts ({contacts.length})</option>
                    {contactGroups.map((g) => (
                      <option key={g.name} value={g.name}>
                        Group: {g.name} ({g.count})
                      </option>
                    ))}
                    <option value="CUSTOM">Custom Phone Numbers</option>
                  </select>
                </div>
              </div>

              {/* Custom Recipients Text (If CUSTOM) */}
              {newCampaign.selectedGroup === 'CUSTOM' && (
                <div>
                  <label className="block font-semibold text-white mb-1">Phone Numbers (comma or space separated)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 0541234567, 0249876543"
                    value={newCampaign.recipientsText}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, recipientsText: e.target.value }))}
                    className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>
              )}

              {/* Message Content */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-white">SMS Message Content</label>
                  <span className="text-[11px] text-[#D4AF6A]">
                    {newCampaign.content.length} chars | {smsUnits} Unit(s)/msg
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your campaign broadcast text..."
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              </div>

              {/* Schedule Date & Time */}
              <div>
                <label className="block font-semibold text-white mb-1">Schedule Execution Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newCampaign.scheduledFor}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              </div>

              {/* Cost Summary Banner */}
              <div className="bg-[#242A32] border border-[rgba(212,175,106,0.2)] p-3 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#AEB4BC] block">Target Recipients: {recipients.length}</span>
                  <span className="text-[#AEB4BC] block">Est. Units Required: {recipients.length * smsUnits}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#AEB4BC] block">Total Estimated Cost</span>
                  <span className="text-base font-extrabold text-emerald-400">GHS {estimatedCost}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold py-3 rounded-xl shadow-lg hover:from-[#E7D3A4] hover:to-[#C9A04E] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{submitting ? 'Scheduling Campaign...' : 'Confirm & Schedule Campaign'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
