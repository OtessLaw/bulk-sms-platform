import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import {
  Bot,
  BrainCircuit,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  MessageSquare,
  Clock,
  ThumbsUp,
  Sliders,
  Sparkles,
  Layers,
  Save,
  User,
} from 'lucide-react';

export default function AdminAiManagement() {
  const [analytics, setAnalytics] = useState({
    totalQuestions: 0,
    satisfactionRate: '98.4%',
    avgResponseTime: '1.1s',
    escalationRate: '1.6%',
    totalKnowledgeDocs: 0,
    topTopics: [],
  });

  const [docs, setDocs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'General',
    targetPage: '',
    keywords: '',
    content: '',
  });

  useEffect(() => {
    fetchAiData();
  }, []);

  const fetchAiData = async () => {
    try {
      const analyticsRes = await API.get('/ai/admin/analytics');
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }

      const docsRes = await API.get('/ai/admin/knowledge');
      if (docsRes.data.success) {
        setDocs(docsRes.data.data);
      }

      const logsRes = await API.get('/ai/admin/user-logs');
      if (logsRes.data.success) {
        setUserLogs(logsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load AI analytics', err);
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/ai/admin/knowledge', newDoc);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAiData();
        setShowDocModal(false);
        setNewDoc({ title: '', category: 'General', targetPage: '', keywords: '', content: '' });
      }
    } catch (err) {
      toast.error('Failed to add document');
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this knowledge document?')) return;
    try {
      const res = await API.delete(`/ai/admin/knowledge/${id}`);
      if (res.data.success) {
        toast.success('Document deleted');
        fetchAiData();
      }
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#D4AF6A] shrink-0" /> AI Agent Management & RAG Engine
          </h1>
          <p className="text-xs text-[#AEB4BC]">Manage Knowledge Base RAG documents, review user questions, and monitor AI support performance</p>
        </div>

        <button
          onClick={() => setShowDocModal(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Document</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.25)] rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-[#AEB4BC] uppercase font-semibold flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF6A]" /> Total Questions
          </span>
          <span className="text-xl font-extrabold text-white">{analytics.totalQuestions || userLogs.length || 0}</span>
        </div>

        <div className="bg-[#2A3038]/70 border border-emerald-500/25 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Satisfaction Rate
          </span>
          <span className="text-xl font-extrabold text-emerald-400">{analytics.satisfactionRate}</span>
        </div>

        <div className="bg-[#2A3038]/70 border border-yellow-500/25 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-yellow-400 uppercase font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-yellow-400" /> Avg Response Time
          </span>
          <span className="text-xl font-extrabold text-yellow-400">{analytics.avgResponseTime}</span>
        </div>

        <div className="bg-[#2A3038]/70 border border-purple-500/25 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-purple-400 uppercase font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Escalation Rate
          </span>
          <span className="text-xl font-extrabold text-purple-400">{analytics.escalationRate}</span>
        </div>
      </div>

      {/* Admin User AI Questions & Chat Logs Monitor */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-[rgba(212,175,106,0.15)] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#D4AF6A]" /> User AI Questions & Support Logs ({userLogs.length})
          </h3>
          <span className="text-xs text-[#D4AF6A] font-mono">Live Admin Monitor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Question Asked</th>
                <th className="pb-3 px-3">Page Context</th>
                <th className="pb-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {userLogs.length > 0 ? (
                userLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-bold text-[#D4AF6A] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#AEB4BC]" />
                      <span>{log.userId?.name || 'Guest User'}</span>
                    </td>
                    <td className="py-3 px-3 text-white max-w-md">{log.content}</td>
                    <td className="py-3 px-3 font-mono text-[#AEB4BC]">{log.pageContext || '/dashboard'}</td>
                    <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-[#AEB4BC]">
                    No user questions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RAG Knowledge Base Document Manager */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-[rgba(212,175,106,0.15)] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF6A]" /> RAG Knowledge Base Documents ({docs.length})
          </h3>
          <span className="text-xs text-[#D4AF6A] font-mono">Vector Index Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Title</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Target Page</th>
                <th className="pb-3 px-3">Keywords</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {docs.map((d) => (
                <tr key={d._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3 px-3 font-bold text-[#D4AF6A]">{d.title}</td>
                  <td className="py-3 px-3 text-[#AEB4BC]">{d.category}</td>
                  <td className="py-3 px-3 font-mono text-white">{d.targetPage || 'All Pages'}</td>
                  <td className="py-3 px-3 truncate max-w-xs text-[#AEB4BC]">{(d.keywords || []).join(', ')}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeleteDoc(d._id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF6A]" /> Add Knowledge Base Document
            </h3>

            <form onSubmit={handleAddDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. Sender ID Approval Guidelines"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#AEB4BC] mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="General">General</option>
                    <option value="Send SMS">Send SMS</option>
                    <option value="Sender ID">Sender ID</option>
                    <option value="Wallet & Payments">Wallet & Payments</option>
                    <option value="Contacts & Groups">Contacts & Groups</option>
                    <option value="Reports & Delivery">Reports & Delivery</option>
                    <option value="Developer API">Developer API</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#AEB4BC] mb-1">Target Page Path</label>
                  <input
                    type="text"
                    value={newDoc.targetPage}
                    onChange={(e) => setNewDoc({ ...newDoc, targetPage: e.target.value })}
                    placeholder="/send-sms or /wallet"
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Search Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={newDoc.keywords}
                  onChange={(e) => setNewDoc({ ...newDoc, keywords: e.target.value })}
                  placeholder="header, approval, institution, status"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Document Content</label>
                <textarea
                  rows="5"
                  required
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  placeholder="Write documentation text here..."
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-4 py-2 rounded-xl">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
