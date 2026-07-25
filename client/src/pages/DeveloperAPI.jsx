import React, { useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Key, Plus, Copy, Check } from 'lucide-react';

export default function DeveloperAPI() {
  const [keys, setKeys] = useState([]);

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
      const res = await API.post('/settings/api-keys', { name: 'Live Production Key' });
      if (res.data.success) {
        toast.success('API Key generated!');
        fetchKeys();
      }
    } catch (err) {
      toast.error('Failed to generate key');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Developer REST API</h1>
          <p className="text-xs text-[#AEB4BC]">Generate secret API keys for website, mobile, and CRM integrations</p>
        </div>

        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New API Key</span>
        </button>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        {keys.map((k) => (
          <div key={k._id} className="p-4 bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">{k.name}</p>
              <p className="font-mono text-[#D4AF6A] text-xs mt-1">{k.key}</p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {k.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
