'use client';

import React, { useState } from 'react';
import { Scheme, InsuranceCategory } from '@/lib/types';
import { 
  Shield, 
  Search, 
  Filter, 
  Check, 
  Plus, 
  ChevronRight, 
  Building2, 
  Award, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpDown,
  Layers,
  HeartPulse,
  Clock,
  Car,
  Plane,
  Calculator,
  Trash2
} from 'lucide-react';
import { getInsurerLogoUrl } from '@/lib/insurer-logos';

interface SchemeLibraryProps {
  schemes: Scheme[];
  onSelectScheme: (scheme: Scheme) => void;
  onToggleCompare: (schemeId: string) => void;
  compareIds: string[];
  onCreateProposalWithScheme?: (scheme: Scheme) => void;
  onEditScheme?: (scheme: Scheme) => void;
  onAddNewScheme?: () => void;
  onDeleteScheme?: (schemeId: string) => void;
  onOpenCalculator?: (scheme: Scheme) => void;
  isAdmin?: boolean;
}

export const SchemeLibrary: React.FC<SchemeLibraryProps> = ({
  schemes,
  onSelectScheme,
  onToggleCompare,
  compareIds,
  onCreateProposalWithScheme,
  onEditScheme,
  onAddNewScheme,
  onDeleteScheme,
  onOpenCalculator,
  isAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsurer, setSelectedInsurer] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique insurers
  const insurers = Array.from(new Set(schemes.map((s) => s.insurer)));

  // Filter logic
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
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><HeartPulse className="w-3 h-3" /> Health</span>;
      case 'term':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Term Life</span>;
      case 'motor':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><Car className="w-3 h-3" /> Motor</span>;
      case 'travel':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><Plane className="w-3 h-3" /> Travel</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      
      {/* Panel Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Scheme Library</h2>
            <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {filteredSchemes.length} Schemes Available
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse flagship health, term, motor & travel insurance policies across top IRDAI insurers.
          </p>
        </div>

        {/* Header View Toggle */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plan name, insurer or benefit..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="md:col-span-5 flex items-center gap-1 overflow-x-auto">
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

      {/* Schemes Container */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Shield className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No schemes found matching your search filter</p>
          <p className="text-xs text-slate-500">Try adjusting your category selection or insurer filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            const isCompared = compareIds.includes(scheme.id);
            const logoUrl = getInsurerLogoUrl(scheme.insurer, scheme.logoUrl);

            return (
              <div
                key={scheme.id}
                className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle Gradient Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  
                  {/* Card Top Header with Scheme Brand Logo */}
                  <div className="flex items-start justify-between gap-3 mb-3.5 pt-1">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 shrink-0 shadow-sm flex items-center justify-center">
                        <img
                          src={logoUrl}
                          alt={scheme.insurer}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-0.5 tracking-wide uppercase">
                          <span>{scheme.insurer}</span>
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-heading truncate">
                          {scheme.plan}
                        </h3>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getCategoryBadge(scheme.category)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 italic leading-relaxed">
                    "{scheme.tagline}"
                  </p>

                  {/* Highlights Grid Box */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/80 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60 mb-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold block uppercase">Sum Insured</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{scheme.sumInsured}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold block uppercase">Claim Ratio (CSR)</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{scheme.csr}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold block uppercase">Cashless Network</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{scheme.network}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold block uppercase">Restoration</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 truncate block">{scheme.restoration}</span>
                    </div>
                  </div>

                  {/* Key Benefits Preview */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">Key Feature Highlight</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{scheme.inclusions[0]}</span>
                    </p>
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  
                  {/* Compare Toggle Pill */}
                  <button
                    onClick={() => onToggleCompare(scheme.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                      isCompared
                        ? 'bg-blue-500/15 border-blue-400/40 text-blue-600 dark:text-blue-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => {}}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>

                  {/* Calculator trigger */}
                  {onOpenCalculator && (
                    <button
                      onClick={() => onOpenCalculator(scheme)}
                      className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-xs"
                      title="Calculate Premium"
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Calc</span>
                    </button>
                  )}

                  {/* View 8-Section Details */}
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="flex-1 bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-extrabold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md group/btn"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      ) : (

        /* List Layout */
        <div className="space-y-3">
          {filteredSchemes.map((scheme) => {
            const isCompared = compareIds.includes(scheme.id);
            const logoUrl = getInsurerLogoUrl(scheme.insurer, scheme.logoUrl);

            return (
              <div
                key={scheme.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <img
                    src={logoUrl}
                    alt={scheme.insurer}
                    className="w-10 h-10 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryBadge(scheme.category)}
                      <span className="text-xs font-semibold text-slate-500">{scheme.insurer}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{scheme.plan}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 italic">"{scheme.tagline}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs border-x border-slate-100 px-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sum Insured</span>
                    <span className="font-bold text-slate-800">{scheme.sumInsured}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">CSR %</span>
                    <span className="font-bold text-emerald-600">{scheme.csr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Network</span>
                    <span className="font-bold text-slate-800">{scheme.network}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleCompare(scheme.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      isCompared ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {isCompared ? 'In Compare' : '+ Compare'}
                  </button>

                  {onOpenCalculator && (
                    <button
                      onClick={() => onOpenCalculator(scheme)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2 rounded-lg border border-emerald-300 transition-all flex items-center gap-1"
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                      Calc
                    </button>
                  )}

                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                  >
                    8-Section Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
