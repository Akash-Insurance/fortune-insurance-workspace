'use client';

import React, { useState, useMemo } from 'react';
import { Proposal, ProposalStatus } from '@/lib/types';
import { 
  Users, 
  FileText, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Send, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  ArrowUpDown,
  User,
  Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface AdvisorReportsViewProps {
  proposals: Proposal[];
  onViewProposalDoc?: (proposal: Proposal) => void;
}

export const AdvisorReportsView: React.FC<AdvisorReportsViewProps> = ({
  proposals,
  onViewProposalDoc,
}) => {
  // Filter States
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDatePreset, setSelectedDatePreset] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('reports-desc');
  const [expandedAdvisor, setExpandedAdvisor] = useState<string | null>(null);

  // Extract unique years & months from proposals
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    proposals.forEach((p) => {
      const dateObj = new Date(p.createdAt || p.date);
      if (!isNaN(dateObj.getFullYear())) {
        years.add(dateObj.getFullYear().toString());
      } else {
        years.add('2026');
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [proposals]);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filtering Logic based on Date, Month, Year, and Search
  const filteredProposals = useMemo(() => {
    const now = new Date();

    return proposals.filter((p) => {
      const pDate = new Date(p.createdAt || p.date);
      const isValidDate = !isNaN(pDate.getTime());
      
      // 1. Year Filter
      if (selectedYear !== 'all') {
        const year = isValidDate ? pDate.getFullYear().toString() : '2026';
        if (year !== selectedYear) return false;
      }

      // 2. Month Filter
      if (selectedMonth !== 'all') {
        const monthIdx = isValidDate ? pDate.getMonth() : 7; // Aug default
        if (monthIdx.toString() !== selectedMonth) return false;
      }

      // 3. Date Preset Filter
      if (selectedDatePreset !== 'all' && isValidDate) {
        const diffDays = (now.getTime() - pDate.getTime()) / (1000 * 3600 * 24);
        if (selectedDatePreset === 'today' && diffDays > 1) return false;
        if (selectedDatePreset === 'week' && diffDays > 7) return false;
        if (selectedDatePreset === 'month' && diffDays > 30) return false;
      }

      // 4. Search Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const advisorName = (p.createdByDisplay || p.createdBy).toLowerCase();
        const clientName = p.client.name.toLowerCase();
        const propTitle = p.name.toLowerCase();
        if (!advisorName.includes(query) && !clientName.includes(query) && !propTitle.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [proposals, selectedYear, selectedMonth, selectedDatePreset, searchQuery]);

  // Group filtered proposals by Advisor/Person
  const advisorGroups = useMemo(() => {
    const acc: {
      advisorName: string;
      proposals: Proposal[];
      statusCounts: Record<string, number>;
      totalVolume: number;
      purchasedCount: number;
    }[] = [];

    filteredProposals.forEach((p) => {
      const name = p.createdByDisplay || p.createdBy || 'Rahul Sharma';
      let group = acc.find(g => g.advisorName === name);
      if (!group) {
        group = {
          advisorName: name,
          proposals: [],
          statusCounts: { 'Created': 0, 'Sent to Client': 0, 'Accepted': 0, 'Purchased': 0, 'Declined': 0 },
          totalVolume: 0,
          purchasedCount: 0,
        };
        acc.push(group);
      }

      group.proposals.push(p);
      group.statusCounts[p.status] = (group.statusCounts[p.status] || 0) + 1;
      group.totalVolume += (p.totalPremium || 35000);
      if (p.status === 'Purchased') {
        group.purchasedCount += 1;
      }
    });

    // Sort Advisor List
    acc.sort((a, b) => {
      if (sortBy === 'reports-desc') return b.proposals.length - a.proposals.length;
      if (sortBy === 'reports-asc') return a.proposals.length - b.proposals.length;
      if (sortBy === 'name-asc') return a.advisorName.localeCompare(b.advisorName);
      if (sortBy === 'volume-desc') return b.totalVolume - a.totalVolume;
      if (sortBy === 'conversion-desc') {
        const rateA = a.proposals.length > 0 ? (a.purchasedCount / a.proposals.length) : 0;
        const rateB = b.proposals.length > 0 ? (b.purchasedCount / b.proposals.length) : 0;
        return rateB - rateA;
      }
      return 0;
    });

    return acc;
  }, [filteredProposals, sortBy]);

  // Total summary metrics
  const totalReportsCount = filteredProposals.length;
  const totalVolume = filteredProposals.reduce((acc, p) => acc + (p.totalPremium || 35000), 0);
  const totalPurchased = filteredProposals.filter((p) => p.status === 'Purchased').length;
  const overallConversion = totalReportsCount > 0 ? Math.round((totalPurchased / totalReportsCount) * 100) : 0;

  // Export to Excel Function
  const exportToExcel = () => {
    const data: any[] = [];
    
    advisorGroups.forEach((group) => {
      group.proposals.forEach((p) => {
        data.push({
          'Advisor Name': group.advisorName,
          'Total Reports': group.proposals.length,
          'Client Name': p.client.name,
          'Client Age': p.client.age,
          'City': p.client.city,
          'Proposal Name': p.name,
          'Status': p.status,
          'Date': p.date,
          'Est Premium (INR)': p.totalPremium || 35000,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advisor Reports");
    
    // Download the Excel file
    XLSX.writeFile(workbook, `Advisor_Client_Report_${selectedYear}_${selectedMonth}_${Date.now()}.xlsx`);
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'Created':
        return <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Created</span>;
      case 'Sent to Client':
        return <span className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 border border-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><Send className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Sent</span>;
      case 'Accepted':
        return <span className="bg-amber-50 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-600" /> Accepted</span>;
      case 'Purchased':
        return <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Purchased</span>;
      case 'Declined':
        return <span className="bg-rose-50 dark:bg-rose-900/40 text-rose-700 border border-rose-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-600" /> Declined</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Advisor & Client Reports Audit Matrix</h2>
            <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {advisorGroups.length} Active Advisors Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fetch exact report generation counts per advisor, analyze client status progression, and sort across date, month, and year.
          </p>
        </div>

        {/* Excel Export Button */}
        <button
          onClick={exportToExcel}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Export Excel Report
        </button>
      </div>

      {/* Summary KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50/60 dark:bg-blue-900/40 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase block">Total Advisors</span>
          <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 block mt-1">{advisorGroups.length}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Advisors with generated reports</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
          <span className="text-xs text-emerald-600 font-semibold uppercase block">Total Reports Generated</span>
          <span className="text-2xl font-extrabold text-emerald-900 block mt-1">{totalReportsCount}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Proposals created for clients</span>
        </div>

        <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100">
          <span className="text-xs text-purple-600 font-semibold uppercase block">Conversion Rate</span>
          <span className="text-2xl font-extrabold text-purple-900 block mt-1">{overallConversion}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{totalPurchased} closed / purchased</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
          <span className="text-xs text-amber-700 font-semibold uppercase block">Total Premium Volume</span>
          <span className="text-2xl font-extrabold text-amber-900 block mt-1">₹{(totalVolume / 1000).toFixed(1)}k</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Gross written premium value</span>
        </div>
      </div>

      {/* Multi-Dimensional Filter Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        
        {/* Search */}
        <div className="md:col-span-3 relative">
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Search Advisor / Client</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search person or client..."
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Year Filter */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Months</option>
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx.toString()}>{m}</option>
            ))}
          </select>
        </div>

        {/* Date Preset */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Date Range</label>
          <select
            value={selectedDatePreset}
            onChange={(e) => setSelectedDatePreset(e.target.value)}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        {/* Sort Option */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Sort Options</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="reports-desc">Reports Generated (High to Low)</option>
            <option value="reports-asc">Reports Generated (Low to High)</option>
            <option value="volume-desc">Premium Volume (High to Low)</option>
            <option value="conversion-desc">Conversion Rate (High to Low)</option>
            <option value="name-asc">Advisor Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Advisor & Client Report Cards Table */}
      {advisorGroups.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
          <Users className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No advisor reports found matching selected filters</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try changing your Year, Month, or Date Range filter options.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {advisorGroups.map((group) => {
            const isExpanded = expandedAdvisor === group.advisorName;
            const convRate = group.proposals.length > 0 
              ? Math.round((group.purchasedCount / group.proposals.length) * 100) 
              : 0;

            return (
              <div 
                key={group.advisorName}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 dark:border-slate-600 transition-all"
              >
                
                {/* Advisor Row Banner */}
                <div 
                  onClick={() => setExpandedAdvisor(isExpanded ? null : group.advisorName)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-gradient-to-r from-slate-50 to-slate-100/50 hover:bg-blue-50/40 dark:bg-blue-900/30 transition-colors"
                >
                  
                  {/* Advisor Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                      {group.advisorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{group.advisorName}</h3>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full">
                          Senior Wealth Advisor
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Generated <strong className="text-blue-700 font-bold">{group.proposals.length} Reports</strong> across selected timeline
                      </p>
                    </div>
                  </div>

                  {/* Status Pills Breakdown */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    
                    <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Created:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{group.statusCounts['Created'] || 0}</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5">
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Sent:</span>
                      <span className="font-bold text-blue-700">{group.statusCounts['Sent to Client'] || 0}</span>
                    </div>
                    
                    <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs flex items-center gap-1.5">
                      <span className="text-[11px] text-amber-700 font-medium">Accepted:</span>
                      <span className="font-bold text-amber-800">{group.statusCounts['Accepted'] || 0}</span>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs flex items-center gap-1.5">
                      <span className="text-[11px] text-emerald-700 font-medium">Purchased:</span>
                      <span className="font-bold text-emerald-800">{group.statusCounts['Purchased'] || 0}</span>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-900/40 px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs flex items-center gap-1.5">
                      <span className="text-[11px] text-rose-600 font-medium">Declined:</span>
                      <span className="font-bold text-rose-700">{group.statusCounts['Declined'] || 0}</span>
                    </div>

                    <div className="bg-purple-900 text-white px-3 py-1.5 rounded-xl shadow-2xs font-bold text-xs flex items-center gap-1">
                      <span>Conv. {convRate}%</span>
                    </div>

                    {/* Expand/Collapse Trigger */}
                    <div className="p-1.5 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 ml-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>

                  </div>

                </div>

                {/* Collapsible Client Proposals Detail List */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        Detailed Client Proposals Generated by {group.advisorName} ({group.proposals.length})
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Total Volume: <strong className="text-slate-900 dark:text-slate-100">₹{(group.totalVolume / 1000).toFixed(1)}k</strong>
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                            <th className="py-2.5 px-3">Client Name</th>
                            <th className="py-2.5 px-3">Proposal Title</th>
                            <th className="py-2.5 px-3">City & Family</th>
                            <th className="py-2.5 px-3">Date Generated</th>
                            <th className="py-2.5 px-3">Client Status</th>
                            <th className="py-2.5 px-3 text-right">Est. Premium</th>
                            <th className="py-2.5 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.proposals.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                              
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900 dark:text-slate-100">{p.client.name}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500">Age {p.client.age}</div>
                              </td>

                              <td className="py-3 px-3 font-semibold text-blue-900 dark:text-blue-100">
                                {p.name}
                              </td>

                              <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                                <div>{p.client.city}</div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">{p.client.family}</div>
                              </td>

                              <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                {p.date}
                              </td>

                              <td className="py-3 px-3">
                                {getStatusBadge(p.status)}
                              </td>

                              <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                ₹{((p.totalPremium || 35000)).toLocaleString('en-IN')}
                              </td>

                              <td className="py-3 px-3 text-center">
                                {onViewProposalDoc && (
                                  <button
                                    onClick={() => onViewProposalDoc(p)}
                                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:bg-blue-900/50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                                    title="View Proposal Document"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> View
                                  </button>
                                )}
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
