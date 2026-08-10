'use client';

import React, { useState } from 'react';
import { Scheme, InsuranceCategory } from '@/lib/types';
import { 
  Settings, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  Clock, 
  Car, 
  Plane,
  Calculator,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { getInsurerLogoUrl } from '@/lib/insurer-logos';

interface SchemeSettingsViewProps {
  schemes: Scheme[];
  onAddNewScheme: () => void;
  onEditScheme: (scheme: Scheme) => void;
  onDeleteScheme: (schemeId: string) => void;
  onOpenCalculator?: (scheme: Scheme) => void;
  onSelectScheme?: (scheme: Scheme) => void;
}

export const SchemeSettingsView: React.FC<SchemeSettingsViewProps> = ({
  schemes,
  onAddNewScheme,
  onEditScheme,
  onDeleteScheme,
  onOpenCalculator,
  onSelectScheme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsurer, setSelectedInsurer] = useState<string>('all');

  // Insurers list
  const insurers = Array.from(new Set(schemes.map((s) => s.insurer)));

  // Category counts
  const categoryCounts = {
    health: schemes.filter((s) => s.category === 'health').length,
    term: schemes.filter((s) => s.category === 'term').length,
    motor: schemes.filter((s) => s.category === 'motor').length,
    travel: schemes.filter((s) => s.category === 'travel').length,
  };

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesInsurer = selectedInsurer === 'all' || s.insurer === selectedInsurer;
    const matchesSearch =
      s.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.insurer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesInsurer && matchesSearch;
  });

  const getCategoryBadge = (cat: InsuranceCategory) => {
    switch (cat) {
      case 'health':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><HeartPulse className="w-3 h-3" /> Health</span>;
      case 'term':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Term</span>;
      case 'motor':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Car className="w-3 h-3" /> Motor</span>;
      case 'travel':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Plane className="w-3 h-3" /> Travel</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-400/30 mb-3">
              <Settings className="w-3.5 h-3.5" />
              Scheme Management & Settings Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Scheme Configuration Settings
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Dedicated settings panel to create new insurance policies, edit financial parameters, update logos & riders, or delete outdated schemes.
            </p>
          </div>

          <div>
            <button
              onClick={onAddNewScheme}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Scheme</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Active Schemes</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{schemes.length} Policies</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Partner Insurers</span>
            <span className="text-lg font-bold text-blue-400 mt-0.5 block">{insurers.length} Companies</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Health & Term Covers</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{categoryCounts.health + categoryCounts.term} Schemes</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Motor & Travel Covers</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">{categoryCounts.motor + categoryCounts.travel} Schemes</span>
          </div>
        </div>

      </div>

      {/* Settings Control Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        
        {/* Controls Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Active Schemes ({filteredSchemes.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filter, search, modify, or remove insurance policies from your suite database.</p>
          </div>

          <button
            onClick={onAddNewScheme}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Scheme
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by plan name or insurer..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Category Filters */}
          <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto">
            {(['all', 'health', 'term', 'motor', 'travel'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Insurer Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedInsurer}
              onChange={(e) => setSelectedInsurer(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Insurers ({insurers.length})</option>
              {insurers.map((ins) => (
                <option key={ins} value={ins}>{ins}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Scheme List Management */}
        {filteredSchemes.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No schemes found matching search criteria</p>
            <p className="text-xs text-slate-500 mt-1">Adjust search or filters above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchemes.map((scheme) => {
              const logoUrl = getInsurerLogoUrl(scheme.insurer, scheme.logoUrl);

              return (
                <div
                  key={scheme.id}
                  className="bg-white border border-slate-200 hover:border-purple-300 rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-md"
                >
                  
                  {/* Left Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={logoUrl}
                      alt={scheme.insurer}
                      className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1.5 shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getCategoryBadge(scheme.category)}
                        <span className="text-xs font-bold text-blue-600">{scheme.insurer}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {scheme.id}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 truncate">{scheme.plan}</h3>
                      <p className="text-xs text-slate-500 italic truncate mt-0.5">"{scheme.tagline}"</p>
                    </div>
                  </div>

                  {/* Middle Specs */}
                  <div className="grid grid-cols-3 gap-3 text-xs border-y md:border-y-0 md:border-x border-slate-100 py-2 md:py-0 md:px-5 shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Sum Insured</span>
                      <span className="font-bold text-slate-800">{scheme.sumInsured}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Est. Premium</span>
                      <span className="font-bold text-blue-700">{scheme.financials.premium}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">CSR %</span>
                      <span className="font-bold text-emerald-600">{scheme.csr}</span>
                    </div>
                  </div>

                  {/* Right Action Controls: EDIT & DELETE */}
                  <div className="flex items-center gap-2 shrink-0">
                    
                    {onSelectScheme && (
                      <button
                        onClick={() => onSelectScheme(scheme)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all"
                        title="View Policy Detail Page"
                      >
                        Details
                      </button>
                    )}

                    {onOpenCalculator && (
                      <button
                        onClick={() => onOpenCalculator(scheme)}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1 transition-all"
                        title="Open Interactive Premium Calculator"
                      >
                        <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Calc</span>
                      </button>
                    )}

                    {/* Dedicated Edit Button */}
                    <button
                      onClick={() => onEditScheme(scheme)}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                      title="Edit scheme parameters, riders, logos, and terms"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Edit Policy</span>
                    </button>

                    {/* Dedicated Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete scheme "${scheme.plan}"?`)) {
                          onDeleteScheme(scheme.id);
                        }
                      }}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 transition-all"
                      title="Delete scheme from database"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
