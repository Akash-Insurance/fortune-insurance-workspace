'use client';

import React, { useState } from 'react';
import { Scheme, Proposal, InsuranceCategory } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { X, Plus, Trash2, Check, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface NewProposalModalProps {
  schemes: Scheme[];
  isOpen: boolean;
  onClose: () => void;
  onSaveProposal: (proposalData: Omit<Proposal, 'id' | 'createdAt'>) => void;
  preSelectedScheme?: Scheme | null;
}

export const NewProposalModal: React.FC<NewProposalModalProps> = ({
  schemes,
  isOpen,
  onClose,
  onSaveProposal,
  preSelectedScheme
}) => {
  const { user } = useAuth();
  
  // Step 1 Form fields
  const [clientName, setClientName] = useState('');
  const [clientAge, setClientAge] = useState(35);
  const [clientCity, setClientCity] = useState('Mumbai');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [category, setCategory] = useState<InsuranceCategory>('health');

  // Family members list
  const [members, setMembers] = useState([
    { relation: 'Self', age: 35, name: '', premiumShare: 15000 },
    { relation: 'Spouse', age: 32, name: '', premiumShare: 12000 },
  ]);

  // Selected scheme IDs
  const [selectedSchemeIds, setSelectedSchemeIds] = useState<string[]>(
    preSelectedScheme ? [preSelectedScheme.id] : ['star-assure', 'hdfc-optima-secure']
  );

  if (!isOpen) return null;

  const handleAddMember = () => {
    setMembers([...members, { relation: 'Child', age: 5, name: '', premiumShare: 8000 }]);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const toggleSchemeSelection = (id: string) => {
    if (selectedSchemeIds.includes(id)) {
      setSelectedSchemeIds(selectedSchemeIds.filter((sId) => sId !== id));
    } else {
      setSelectedSchemeIds([...selectedSchemeIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || selectedSchemeIds.length === 0) return;

    const familySummary = members.map((m) => `${m.relation} (${m.age})`).join(', ');

    const proposalObj: Omit<Proposal, 'id' | 'createdAt'> = {
      name: proposalTitle || `${clientName} Insurance Portfolio`,
      client: {
        name: clientName,
        age: Number(clientAge),
        family: familySummary,
        city: clientCity,
        advisor: user?.name || 'Rahul Sharma',
        email: clientEmail,
        phone: clientPhone,
        members: members.map((m) => ({
          ...m,
          name: m.name || m.relation,
        })),
      },
      compareIds: selectedSchemeIds,
      createdBy: user?.email || 'fortune.rahul@fortune.com',
      createdByDisplay: user?.name || 'Rahul Sharma (Senior Advisor)',
      status: 'Created',
      date: new Date().toISOString().split('T')[0],
      category,
      totalPremium: members.reduce((acc, m) => acc + (m.premiumShare || 10000), 0),
    };

    onSaveProposal(proposalObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Client Proposal</h2>
            <p className="text-xs text-slate-400">Configure client profile and select recommended insurance schemes.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Proposal Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Proposal Document Title</label>
            <input
              type="text"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="e.g. Sharma Family Comprehensive Shield"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-semibold"
              required
            />
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client Age</label>
              <input
                type="number"
                value={clientAge}
                onChange={(e) => setClientAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Location</label>
              <input
                type="text"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                placeholder="e.g. Mumbai, Delhi"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client Email ID</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="e.g. client@example.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client Phone Number</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InsuranceCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold capitalize"
              >
                <option value="health">Health Insurance</option>
                <option value="term">Term Insurance</option>
                <option value="motor">Motor Insurance</option>
                <option value="travel">Travel Insurance</option>
              </select>
            </div>
          </div>

          {/* Family Members Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">Family Members Covered:</span>
              <button
                type="button"
                onClick={handleAddMember}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Member
              </button>
            </div>

            <div className="space-y-2">
              {members.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    value={m.relation}
                    onChange={(e) => {
                      const updated = [...members];
                      updated[idx].relation = e.target.value;
                      setMembers(updated);
                    }}
                    placeholder="Relation (e.g. Spouse, Son)"
                    className="w-1/3 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="number"
                    value={m.age}
                    onChange={(e) => {
                      const updated = [...members];
                      updated[idx].age = Number(e.target.value);
                      setMembers(updated);
                    }}
                    placeholder="Age"
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="number"
                    value={m.premiumShare}
                    onChange={(e) => {
                      const updated = [...members];
                      updated[idx].premiumShare = Number(e.target.value);
                      setMembers(updated);
                    }}
                    placeholder="Est. Premium Share ₹"
                    className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-blue-700"
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schemes Selection */}
          <div>
            <span className="font-bold text-slate-800 block mb-2">Select Schemes to Include in Proposal:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
              {schemes.map((s) => {
                const selected = selectedSchemeIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSchemeSelection(s.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      selected
                        ? 'bg-blue-50 border-blue-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold">{s.insurer}</div>
                      <div className="font-bold text-slate-900">{s.plan}</div>
                      <div className="text-[10px] text-blue-700 font-semibold">{s.financials.premium}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {}}
                      className="rounded text-blue-600 focus:ring-0 mt-1"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save & Generate Proposal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
