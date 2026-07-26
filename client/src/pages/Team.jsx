import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Shield, Trash2, Mail, CheckCircle2 } from 'lucide-react';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Dispatcher' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get('/team');
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load team members', err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/team/invite', formData);
      if (res.data.success) {
        toast.success(res.data.message || 'Team member invited!');
        fetchMembers();
        setShowModal(false);
        setFormData({ name: '', email: '', role: 'Dispatcher' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invitation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove '${name}' from your organization team?`)) return;

    try {
      const res = await API.delete(`/team/${id}`);
      if (res.data.success) {
        toast.success(`Team member '${name}' removed`);
        fetchMembers();
      }
    } catch (err) {
      toast.error('Failed to remove team member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members & Operator Roles</h1>
          <p className="text-xs text-[#AEB4BC]">Invite staff members to manage contact directories and send broadcasts</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Member Name</th>
                <th className="pb-3 px-3">Email Address</th>
                <th className="pb-3 px-3">Role & Permissions</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {members.length > 0 ? (
                members.map((m) => (
                  <tr key={m._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-bold text-white">{m.name}</td>
                    <td className="py-3 px-3 text-[#AEB4BC]">{m.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.role === 'Manager'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : m.role === 'Dispatcher'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleRemove(m._id, m.name)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Team Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#AEB4BC]">
                    <Shield className="w-8 h-8 text-[#D4AF6A] mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-white">No Team Members Added Yet</p>
                    <p className="text-[11px] mt-0.5">Click 'Invite Team Member' above to grant team members access to your organization.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#D4AF6A]" /> Invite Team Member
            </h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Mensah"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@company.com"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Role & Permissions</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                >
                  <option value="Manager">Manager (Full Access & Wallet Controls)</option>
                  <option value="Dispatcher">Dispatcher (Send SMS & Manage Contacts)</option>
                  <option value="Viewer">Viewer (Read-Only Reports Access)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-[#AEB4BC]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Inviting...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
