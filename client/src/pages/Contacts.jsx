import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Users, UserPlus, Trash2, Search, Upload, FolderPlus, Download, CheckCircle2, Filter, FileText } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Form States
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', groupName: 'General' });
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedContacts, setParsedContacts] = useState([]);
  const [bulkDefaultGroup, setBulkDefaultGroup] = useState('General');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/contacts');
      if (res.data.success) {
        setContacts(res.data.data.contacts || []);
        setGroups(res.data.data.groups || []);
      }
    } catch (err) {
      console.error('Failed to load contacts', err);
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/contacts', newContact);
      if (res.data.success) {
        toast.success('Contact added!');
        fetchData();
        setShowAddModal(false);
        setNewContact({ name: '', phone: '', email: '', groupName: 'General' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/contacts/groups', newGroup);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
        setShowGroupModal(false);
        setNewGroup({ name: '', description: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await API.delete(`/contacts/${id}`);
      toast.success('Contact deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Delete group '${groupName}'? Contacts inside will be moved to General.`)) return;
    try {
      await API.delete(`/contacts/groups/${groupId}`);
      toast.success('Group deleted');
      if (selectedGroup === groupName) setSelectedGroup('All');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete group');
    }
  };

  // Handle CSV / Excel File Reading
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkFile(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r\n|\n/);
      const parsed = [];

      // Detect header row or start reading
      let hasHeader = false;
      const firstLine = lines[0] ? lines[0].toLowerCase() : '';
      if (firstLine.includes('name') || firstLine.includes('phone') || firstLine.includes('mobile')) {
        hasHeader = true;
      }

      const startIndex = hasHeader ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by comma or tab or semicolon
        const cols = line.split(/[,;\t]/).map((c) => c.replace(/^["']|["']$/g, '').trim());

        if (cols.length >= 2) {
          const name = cols[0] || 'Unnamed Contact';
          const phone = cols[1] || '';
          const email = cols[2] && cols[2].includes('@') ? cols[2] : '';
          const groupName = cols[3] || bulkDefaultGroup;

          if (phone.length >= 7) {
            parsed.push({ name, phone, email, groupName });
          }
        } else if (cols.length === 1 && cols[0].length >= 7) {
          // Just phone number line
          parsed.push({ name: 'Contact', phone: cols[0], email: '', groupName: bulkDefaultGroup });
        }
      }

      setParsedContacts(parsed);
      if (parsed.length === 0) {
        toast.error('No valid contact phone numbers found in file');
      } else {
        toast.success(`Parsed ${parsed.length} contacts from file!`);
      }
    };

    reader.readAsText(file);
  };

  const handleBulkSubmit = async () => {
    if (parsedContacts.length === 0) {
      toast.error('No parsed contacts to import');
      return;
    }

    setImporting(true);
    try {
      const res = await API.post('/contacts/bulk', {
        contacts: parsedContacts,
        defaultGroup: bulkDefaultGroup,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
        setShowBulkModal(false);
        setBulkFile(null);
        setParsedContacts([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk import failed');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Name,Phone,Email,Group\nJohn Doe,0241112233,john@example.com,VIP Clients\nSarah Mensah,0509998877,sarah@example.com,Customers\nKwame Tech,0277778899,,General';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'FasReach_Contacts_Sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter contacts by group and search query
  const filteredContacts = contacts.filter((c) => {
    const matchesGroup = selectedGroup === 'All' || c.groupName === selectedGroup;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Calculate unique group names and counts
  const allGroupNames = Array.from(new Set(['General', ...groups.map((g) => g.name), ...contacts.map((c) => c.groupName)]));

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Contacts Directory & Groups
          </h1>
          <p className="text-xs text-[#AEB4BC]">Manage contact lists, import Excel/CSV files, and organize custom groups</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="bg-[#2A3038] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-[#D4AF6A] font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload CSV/Excel</span>
          </button>

          <button
            onClick={() => setShowGroupModal(true)}
            className="bg-[#2A3038] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md"
          >
            <FolderPlus className="w-4 h-4 text-[#D4AF6A]" />
            <span>New Group</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedGroup('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedGroup === 'All'
              ? 'bg-[#D4AF6A] text-black shadow-lg'
              : 'bg-[#2A3038] text-[#AEB4BC] border border-[rgba(212,175,106,0.15)] hover:text-white'
          }`}
        >
          <span>All Contacts</span>
          <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px]">{contacts.length}</span>
        </button>

        {allGroupNames.map((grpName) => {
          const count = contacts.filter((c) => c.groupName === grpName).length;
          const groupObj = groups.find((g) => g.name === grpName);
          const isSelected = selectedGroup === grpName;

          return (
            <div key={grpName} className="flex items-center shrink-0">
              <button
                onClick={() => setSelectedGroup(grpName)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#D4AF6A] text-black shadow-lg'
                    : 'bg-[#2A3038] text-[#AEB4BC] border border-[rgba(212,175,106,0.15)] hover:text-white'
                }`}
              >
                <span>{grpName}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px]">{count}</span>
              </button>

              {groupObj && (
                <button
                  onClick={() => handleDeleteGroup(groupObj._id, groupObj.name)}
                  className="ml-1 text-red-400 hover:text-red-300 p-1"
                  title="Delete Group"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Search Bar & Table Container */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#AEB4BC] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, or group..."
            className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#AEB4BC] focus:outline-none focus:border-[#D4AF6A]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Name</th>
                <th className="pb-3 px-3">Phone</th>
                <th className="pb-3 px-3">Email</th>
                <th className="pb-3 px-3">Group Tag</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((c) => (
                  <tr key={c._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-semibold truncate max-w-[150px]">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-[#D4AF6A] whitespace-nowrap">{c.phone}</td>
                    <td className="py-3 px-3 text-[#AEB4BC] truncate max-w-[180px]">{c.email || '—'}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {c.groupName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteContact(c._id)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-[#AEB4BC]">
                    {searchQuery ? 'No matching contacts found' : 'No contacts in this group directory.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Modal: Add Single Contact */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#D4AF6A]" /> Add Single Contact
            </h3>
            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="e.g. John Mensah"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="0241112233 or +233241112233"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Assign Group Tag</label>
                <select
                  value={newContact.groupName}
                  onChange={(e) => setNewContact({ ...newContact, groupName: e.target.value })}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white font-bold"
                >
                  {allGroupNames.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-4 py-2 rounded-xl">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Create New Group */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#D4AF6A]" /> Create Custom Contact Group
            </h3>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="e.g. VIP Clients, Church Members, Staff"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Short description for group category"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowGroupModal(false)} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-4 py-2 rounded-xl">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Bulk Upload CSV / Excel */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#D4AF6A]" /> Bulk Import Contacts (CSV / Excel)
              </h3>

              <button
                type="button"
                onClick={downloadSampleCsv}
                className="text-[#D4AF6A] hover:underline text-xs flex items-center gap-1 font-bold"
              >
                <Download className="w-3.5 h-3.5" /> Sample Template
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Target Group Segment</label>
                <select
                  value={bulkDefaultGroup}
                  onChange={(e) => setBulkDefaultGroup(e.target.value)}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white font-bold"
                >
                  {allGroupNames.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Select CSV / Excel File (.csv, .xlsx, .txt)</label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={handleFileChange}
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl p-2 text-white"
                />
                <p className="text-[11px] text-[#AEB4BC] mt-1">Columns order: Name, Phone, Email, Group (or just Phone numbers)</p>
              </div>

              {parsedContacts.length > 0 && (
                <div className="bg-[#1E232B] border border-emerald-500/30 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-bold text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ready to Import
                    </span>
                    <span>{parsedContacts.length} Contacts Found</span>
                  </div>

                  <div className="max-h-36 overflow-y-auto divide-y divide-[#2A3038] text-[11px]">
                    {parsedContacts.slice(0, 10).map((c, idx) => (
                      <div key={idx} className="py-1 flex justify-between text-[#AEB4BC]">
                        <span className="font-bold text-white">{c.name}</span>
                        <span className="font-mono text-[#D4AF6A]">{c.phone}</span>
                      </div>
                    ))}
                    {parsedContacts.length > 10 && (
                      <div className="py-1 text-center text-[#AEB4BC] italic">
                        ...and {parsedContacts.length - 10} more contacts
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowBulkModal(false)} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBulkSubmit}
                  disabled={importing || parsedContacts.length === 0}
                  className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-5 py-2.5 rounded-xl disabled:opacity-50"
                >
                  {importing ? 'Importing...' : `Import ${parsedContacts.length} Contacts`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
