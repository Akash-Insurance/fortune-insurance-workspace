'use client';

import React, { useState } from 'react';
import { Proposal, ProposalStatus, InsuranceCategory } from '@/lib/types';
import {
  FileText,
  Plus,
  Calendar,
  User as UserIcon,
  CheckCircle,
  Clock,
  Send,
  XCircle,
  ChevronRight,
  Filter,
  Search,
  Trash2,
  Eye,
  Building2,
  Briefcase
} from 'lucide-react';

interface ClientProposalsProps {
  proposals: Proposal[];
  onViewProposal: (proposal: Proposal) => void;
  onCreateNewProposal: () => void;
  onUpdateStatus: (proposalId: string, status: ProposalStatus) => void;
  onDeleteProposal: (proposalId: string) => void;
  isAdmin: boolean;
}

export const ClientProposals: React.FC<ClientProposalsProps> = ({
  proposals,
  onViewProposal,
  onCreateNewProposal,
  onUpdateStatus,
  onDeleteProposal,
  isAdmin,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [advisorFilter, setAdvisorFilter] = useState<string>('all');

  // Extract unique advisors
  const advisors = Array.from(new Set(proposals.map((p) => p.createdByDisplay || p.createdBy)));

  const filteredProposals = proposals.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesAdvisor = advisorFilter === 'all' || (p.createdByDisplay || p.createdBy) === advisorFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesAdvisor && matchesSearch;
  });

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'Created':
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> Created</span>;
      case 'Sent to Client':
        return <span className="bg-blue-50 text-blue-700 border border-blue-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><Send className="w-3 h-3 text-blue-600" /> Sent</span>;
      case 'Accepted':
        return <span className="bg-amber-50 text-amber-700 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3 text-amber-600" /> Accepted</span>;
      case 'Purchased':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-600" /> Purchased</span>;
      case 'Declined':
        return <span className="bg-rose-50 text-rose-700 border border-rose-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-600" /> Declined</span>;
    }
  };

  return (
    <div className="bg-red rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">

      {/* Panel Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Client Proposals</h2>
            <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {filteredProposals.length} Proposals Saved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate, track, and export customized client proposals with IRDAI compliance documentation.
          </p>
        </div>

        {/* Create Proposal Trigger Button */}
        <button
          onClick={onCreateNewProposal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Client Proposal
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">

        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proposal title, client name, city..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Created">Created</option>
            <option value="Sent to Client">Sent to Client</option>
            <option value="Accepted">Accepted</option>
            <option value="Purchased">Purchased</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 capitalize"
          >
            <option value="all">All Categories</option>
            <option value="health">Health</option>
            <option value="term">Term</option>
            <option value="motor">Motor</option>
            <option value="travel">Travel</option>
          </select>
        </div>

        {/* Advisor Filter (for Admins or filtering) */}
        <div className="md:col-span-3">
          <select
            value={advisorFilter}
            onChange={(e) => setAdvisorFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Advisors ({advisors.length})</option>
            {advisors.map((adv) => (
              <option key={adv} value={adv}>{adv}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Proposal Cards List */}
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No client proposals found</p>
          <p className="text-xs text-slate-500 mb-4">Create your first client proposal or adjust filters.</p>
          <button
            onClick={onCreateNewProposal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            + Create Proposal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>

                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  {getStatusBadge(prop.status)}
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {prop.date}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1">{prop.name}</h3>

                {/* Client Meta */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Client:</span>
                    <span className="font-bold text-slate-900">{prop.client.name} (Age {prop.client.age})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Location:</span>
                    <span className="text-slate-700">{prop.client.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Family:</span>
                    <span className="text-slate-700 truncate max-w-[160px]">{prop.client.family}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Advisor:</span>
                    <span className="text-blue-700 font-semibold">{prop.createdByDisplay || 'Rahul Sharma'}</span>
                  </div>
                </div>

                {/* Compare Schemes Count */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
                  <span>Selected Schemes:</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                    {prop.compareIds.length} Schemes Included
                  </span>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2">

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProposal(prop)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Proposal Document
                  </button>

                  {/* Delete Option */}
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete proposal "${prop.name}"?`)) {
                        onDeleteProposal(prop.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Proposal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Status Update Selector */}
                <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Update Status:</span>
                  <select
                    value={prop.status}
                    onChange={(e) => onUpdateStatus(prop.id, e.target.value as ProposalStatus)}
                    className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Created">Created</option>
                    <option value="Sent to Client">Sent to Client</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Purchased">Purchased</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
