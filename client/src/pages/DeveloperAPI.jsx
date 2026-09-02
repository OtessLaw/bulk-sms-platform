import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Key, Plus, Copy, Check, Trash2, Code, Terminal, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function DeveloperAPI() {
  const [keys, setKeys] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('curl');
  const [keyName, setKeyName] = useState('');
  const [newRawKey, setNewRawKey] = useState(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await API.get('/settings/api-keys');
      if (res.data.success) {
        setKeys(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load API keys', err);
    }
  };

  const handleGenerate = async () => {
    try {
      const nameToUse = keyName.trim() || 'Live Website Integration Key';
      const res = await API.post('/settings/api-keys', { name: nameToUse });
      if (res.data.success) {
        toast.success('API Key generated!');
        setNewRawKey(res.data.data.rawKey);
        setKeyName('');
        fetchKeys();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate key: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this API Key? External sites using this key will be disconnected.')) return;
    try {
      const res = await API.delete(`/settings/api-keys/${id}`);
      if (res.data.success) {
        toast.success('API Key revoked');
        fetchKeys();
      }
    } catch (err) {
      toast.error('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sampleKey = newRawKey || (keys.length > 0 ? (keys[0].keyPrefix || 'bms_live_YOUR_API_KEY_HERE') : 'bms_live_YOUR_API_KEY_HERE');
  const apiBase = window.location.origin.includes('localhost')
    ? 'http://localhost:5000/api'
    : 'https://fasreach.com/api';

  const codeSnippets = {
    curl: `curl -X POST "${apiBase}/sms/send" \\
  -H "x-api-key: ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "0240000000",
    "message": "Your order #1082 has been confirmed!",
    "sender": "FASREACH"
  }'`,
    js: `// Browser JavaScript / Fetch API
fetch('${apiBase}/sms/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${sampleKey}'
  },
  body: JSON.stringify({
    to: '0240000000',
    message: 'Your verification code is 482910',
    sender: 'FASREACH'
  })
})
.then(res => res.json())
.then(data => console.log('SMS Result:', data));`,
    node: `// Node.js (Axios)
const axios = require('axios');

async function sendSMS() {
  const response = await axios.post('${apiBase}/sms/send', {
    to: '0240000000',
    message: 'Welcome to our platform!',
    sender: 'FASREACH'
  }, {
    headers: { 'x-api-key': '${sampleKey}' }
  });
  console.log(response.data);
}
sendSMS();`,
    php: `<?php
// PHP cURL (WooCommerce / Custom Website)
$ch = curl_init('${apiBase}/sms/send');
$payload = json_encode([
    'to' => '0240000000',
    'message' => 'Payment received successfully!',
    'sender' => 'FASREACH'
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'x-api-key: ${sampleKey}'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
    python: `# Python (Requests)
import requests

url = "${apiBase}/sms/send"
headers = {
    "x-api-key": "${sampleKey}",
    "Content-Type": "application/json"
}
payload = {
    "to": "0240000000",
    "message": "Your appointment is set for tomorrow at 10 AM",
    "sender": "FASREACH"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#1A1F26] via-[#242A34] to-[#1E242D] border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-[rgba(212,175,106,0.15)] rounded-xl border border-[rgba(212,175,106,0.3)]">
              <Key className="w-5 h-5 text-[#D4AF6A]" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Developer REST API Gateway</h1>
          </div>
          <p className="text-xs text-[#AEB4BC]">
            Integrate FasReach Bulk SMS dispatches seamlessly into external web applications, e-commerce stores, CRMs, and mobile apps.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#171B22] p-2 rounded-2xl border border-[rgba(255,255,255,0.05)]">
          <input
            type="text"
            placeholder="Key name (e.g. WooCommerce Store)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="bg-[#212630] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF6A] border border-transparent w-48"
          />
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 hover:opacity-90 transition shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Key</span>
          </button>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF6A]" />
            <span>Active Secret API Keys ({keys.length})</span>
          </h2>
          <span className="text-[11px] text-[#8E95A2]">API Gateway v1 Active</span>
        </div>

        {newRawKey && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-2xl space-y-3 mb-6">
            <h3 className="text-emerald-400 font-bold text-sm">New API Key Generated!</h3>
            <p className="text-xs text-[#AEB4BC]">Please copy this key immediately. For security reasons, it will never be shown again.</p>
            <div className="flex items-center space-x-2">
              <input type="text" readOnly value={newRawKey} className="flex-1 bg-[#1A1F26] text-[#D4AF6A] font-mono text-xs px-3 py-2 rounded-xl border border-[rgba(212,175,106,0.3)]" />
              <button onClick={() => copyToClipboard(newRawKey, 'new')} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-2 rounded-xl transition">
                {copiedId === 'new' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {keys.length === 0 ? (
          <div className="text-center py-8 text-[#AEB4BC] text-xs space-y-2 border border-dashed border-[rgba(212,175,106,0.2)] rounded-2xl">
            <Key className="w-8 h-8 text-[#D4AF6A]/50 mx-auto" />
            <p>No API keys generated yet. Click "Generate Key" above to create your first API key for external sites.</p>
          </div>
        ) : (
          keys.map((k) => (
            <div key={k._id} className="p-4 bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#D4AF6A]/50 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-white text-xs">{k.name}</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    k.status === 'Active'
                      ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                      : 'text-rose-400 border-rose-500/20 bg-rose-500/10'
                  }`}>
                    {k.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-[#D4AF6A] text-xs font-medium select-all">{k.keyPrefix}</p>
                </div>
                {k.lastUsedAt && (
                  <p className="text-[10px] text-[#7A818E]">Last used: {new Date(k.lastUsedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => copyToClipboard(k.keyPrefix, k._id)}
                  className="bg-[#2A3038] hover:bg-[#343B45] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-1.5 transition"
                >
                  {copiedId === k._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF6A]" />}
                  <span>{copiedId === k._id ? 'Copied' : 'Copy Key'}</span>
                </button>

                {k.status === 'Active' && (
                  <button
                    onClick={() => handleRevoke(k._id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-500/20 flex items-center space-x-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Endpoint Specifications & Field Aliases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#D4AF6A]" />
            <span>Supported API Endpoints</span>
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-[#1E232B] rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">POST</span>
                <span className="font-mono text-xs text-white font-semibold">/api/sms/send</span>
              </div>
              <p className="text-[11px] text-[#A0A6B1]">Dispatches immediate or scheduled SMS to a recipient.</p>
            </div>

            <div className="p-3 bg-[#1E232B] rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">POST</span>
                <span className="font-mono text-xs text-white font-semibold">/api/sms/bulk</span>
              </div>
              <p className="text-[11px] text-[#A0A6B1]">Dispatches SMS to multiple recipients (accepts array or comma-separated string).</p>
            </div>

            <div className="p-3 bg-[#1E232B] rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-sky-500/20 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded-md">GET</span>
                <span className="font-mono text-xs text-white font-semibold">/api/wallet/balance</span>
              </div>
              <p className="text-[11px] text-[#A0A6B1]">Returns current account balance and remaining SMS credits.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#D4AF6A]" />
            <span>Accepted Authentication & Field Aliases</span>
          </h2>

          <div className="space-y-3 text-xs text-[#AEB4BC]">
            <div className="p-3 bg-[#1E232B] rounded-xl border border-white/5 space-y-1">
              <p className="font-bold text-white text-xs">Authentication Options:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#C5C9D0]">
                <li>Header: <code className="bg-[#282E37] text-[#D4AF6A] px-1 py-0.5 rounded">x-api-key: bms_live_...</code></li>
                <li>Header: <code className="bg-[#282E37] text-[#D4AF6A] px-1 py-0.5 rounded">Authorization: Bearer bms_live_...</code></li>
                <li>Query parameter: <code className="bg-[#282E37] text-[#D4AF6A] px-1 py-0.5 rounded">?api_key=bms_live_...</code> or <code className="bg-[#282E37] text-[#D4AF6A] px-1 py-0.5 rounded">?key=bms_live_...</code></li>
              </ul>
            </div>

            <div className="p-3 bg-[#1E232B] rounded-xl border border-white/5 space-y-1">
              <p className="font-bold text-white text-xs">Accepted Field Names:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#C5C9D0]">
                <li><strong className="text-white">Recipient:</strong> <code className="text-[#D4AF6A]">to</code>, <code className="text-[#D4AF6A]">phone</code>, <code className="text-[#D4AF6A]">recipientPhone</code>, <code className="text-[#D4AF6A]">recipient</code></li>
                <li><strong className="text-white">Message Body:</strong> <code className="text-[#D4AF6A]">message</code>, <code className="text-[#D4AF6A]">content</code>, <code className="text-[#D4AF6A]">text</code>, <code className="text-[#D4AF6A]">body</code></li>
                <li><strong className="text-white">Sender ID:</strong> <code className="text-[#D4AF6A]">sender</code>, <code className="text-[#D4AF6A]">senderId</code>, <code className="text-[#D4AF6A]">from</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Code Generator Tabs */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-[#D4AF6A]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Integration Quickstart Code Snippets</h2>
          </div>

          <div className="flex items-center space-x-1 bg-[#1A1F26] p-1 rounded-xl border border-white/10 shrink-0">
            {['curl', 'js', 'node', 'php', 'python'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black shadow-md'
                    : 'text-[#8E95A2] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-[#16191F] border border-[rgba(212,175,106,0.15)] rounded-2xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
          <button
            onClick={() => copyToClipboard(codeSnippets[activeTab], 'snippet')}
            className="absolute top-3 right-3 bg-[#262C36] hover:bg-[#323945] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 flex items-center space-x-1"
          >
            {copiedId === 'snippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D4AF6A]" />}
            <span>Copy Code</span>
          </button>
          <pre className="pr-20 pt-1 leading-relaxed whitespace-pre-wrap">{codeSnippets[activeTab]}</pre>
        </div>
      </div>
    </div>
  );
}
