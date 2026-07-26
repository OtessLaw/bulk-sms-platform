import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Users, UserCheck, Key, Wallet, ShieldAlert, ArrowLeftRight, Trash2, Edit3 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { impersonate } = useAuth();

  // Wallet adjustment modal state
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletForm, setWalletForm] = useState({ amount: 100, smsUnits: 2500, action: 'credit' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleImpersonate = async (userId) => {
    try {
      const res = await API.post(`/admin/impersonate/${userId}`);
      if (res.data.success) {
        toast.success(`Logging in as ${res.data.data.targetUser.name}...`);
        impersonate(res.data.data.token);
      }
    } catch (err) {
      toast.error('Impersonation failed');
    }
  };

  const handleAdjustWallet = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await API.post('/admin/wallet/adjust', {
        userId: selectedUser._id,
        ...walletForm,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowWalletModal(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Wallet adjustment failed');
    }
  };

  const handleResetPassword = async (userId, userEmail) => {
    const newPassword = prompt(`Enter new password for ${userEmail}:`, 'Password123!');
    if (!newPassword) return;

    try {
      const res = await API.post(`/admin/users/${userId}/reset-password`, { newPassword });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Reset password failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 break-words">
          <Users className="w-6 h-6 text-[#D4AF6A] shrink-0" /> User Directory & Account Control
        </h1>
        <p className="text-xs text-[#AEB4BC]">View all accounts, reset passwords, adjust wallets, or login as any user</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Wallet Balance</th>
                <th className="pb-3 px-3">SMS Credits</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3.5 px-3 max-w-[160px] sm:max-w-xs min-w-0">
                    <p className="font-bold text-white truncate">{u.name}</p>
                    <p className="text-[11px] text-[#AEB4BC] break-all truncate">{u.email}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="bg-[#D4AF6A]/10 text-[#D4AF6A] border border-[#D4AF6A]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">GHS {u.wallet?.balance?.toFixed(2) || '0.00'}</td>
                  <td className="py-3.5 px-3 text-[#E7D3A4] font-mono whitespace-nowrap">{u.wallet?.smsCredit?.toLocaleString() || '0'} Units</td>
                  <td className="py-3.5 px-3">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => handleImpersonate(u._id)}
                      title="Login as User"
                      className="bg-[#D4AF6A] text-black font-bold text-[10px] px-2.5 py-1 rounded-lg hover:bg-[#E7D3A4]"
                    >
                      Login as User
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setShowWalletModal(true);
                      }}
                      title="Adjust Wallet"
                      className="p-1 text-[#D4AF6A] hover:bg-[#1E232B] rounded-lg"
                    >
                      <Wallet className="w-4 h-4 inline" />
                    </button>

                    <button
                      onClick={() => handleResetPassword(u._id, u.email)}
                      title="Reset Password"
                      className="p-1 text-blue-400 hover:bg-[#1E232B] rounded-lg"
                    >
                      <Key className="w-4 h-4 inline" />
                    </button>

                    {u.role !== 'Super Admin' && (
                      <button
                        onClick={() => handleDelete(u._id)}
                        title="Delete Account"
                        className="p-1 text-red-400 hover:bg-[#1E232B] rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Adjustment Modal */}
      {showWalletModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white truncate">Adjust Wallet for {selectedUser.name}</h3>
            <form onSubmit={handleAdjustWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Action</label>
                <select
                  value={walletForm.action}
                  onChange={(e) => setWalletForm({ ...walletForm, action: e.target.value })}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="credit">Credit (Add Funds/Units)</option>
                  <option value="debit">Debit (Deduct Funds/Units)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Cash Balance Adjustment (GHS)</label>
                <input
                  type="number"
                  value={walletForm.amount}
                  onChange={(e) => setWalletForm({ ...walletForm, amount: Number(e.target.value) })}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">SMS Credit Units Adjustment</label>
                <input
                  type="number"
                  value={walletForm.smsUnits}
                  onChange={(e) => setWalletForm({ ...walletForm, smsUnits: Number(e.target.value) })}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowWalletModal(false)} className="px-4 py-2 text-xs text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-5 py-2 rounded-xl">
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
