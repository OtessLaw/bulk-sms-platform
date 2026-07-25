import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Users, UserPlus, Trash2, Search, Upload } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', groupName: 'General' });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await API.get('/contacts');
      if (res.data.success) {
        setContacts(res.data.data.contacts);
      }
    } catch (err) {
      console.error('Failed to load contacts', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/contacts', newContact);
      if (res.data.success) {
        toast.success('Contact added!');
        fetchContacts();
        setShowModal(false);
        setNewContact({ name: '', phone: '', email: '', groupName: 'General' });
      }
    } catch (err) {
      toast.error('Failed to add contact');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/contacts/${id}`);
      toast.success('Contact removed');
      fetchContacts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts Directory</h1>
          <p className="text-xs text-[#AEB4BC]">Manage client contact lists, phone directories, and group segments</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Contact</span>
        </button>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Name</th>
                <th className="pb-3 px-3">Phone</th>
                <th className="pb-3 px-3">Email</th>
                <th className="pb-3 px-3">Group</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {contacts.length > 0 ? (
                contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-semibold">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-[#D4AF6A]">{c.phone}</td>
                    <td className="py-3 px-3 text-[#AEB4BC]">{c.email || '—'}</td>
                    <td className="py-3 px-3">
                      <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/20 px-2.5 py-0.5 rounded-full text-[10px]">
                        {c.groupName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-[#AEB4BC]">
                    No contacts saved yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add New Contact</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+233240001122"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2 rounded-xl">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
