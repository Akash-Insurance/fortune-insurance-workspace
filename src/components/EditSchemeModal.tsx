'use client';

import React, { useState, useEffect } from 'react';
import { Scheme, InsuranceCategory } from '@/lib/types';
import { 
  X, 
  Save, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  UserCheck, 
  AlertTriangle,
  Hospital
} from 'lucide-react';

import { INSURER_LOGO_PRESETS, getInsurerLogoUrl } from '@/lib/insurer-logos';

interface EditSchemeModalProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedScheme: Scheme) => void;
  onDelete?: (schemeId: string) => void;
  isNewMode?: boolean;
}

const DEFAULT_BLANK_SCHEME: Scheme = {
  id: '',
  insurer: 'Star Health & Allied Insurance',
  category: 'health',
  type: 'standalone',
  plan: 'New Shield Advantage Plan',
  tagline: 'Comprehensive health coverage with unlimited restoration and cashless benefits.',
  csr: '95.0%',
  network: '10,000+ Cashless Hospitals',
  sumInsured: '₹5 Lakhs – ₹50 Lakhs',
  entryAge: '18 yrs – 65 yrs',
  roomRent: 'Single Private AC Room',
  restoration: '100% Unlimited Automatic Refill',
  waitingPED: '36 Months',
  ratePerLakh: 1400,
  logoUrl: '',
  financials: {
    sumInsured: '₹5L – ₹50L',
    entryAge: '18 yrs – 65 yrs',
    network: '10,000+ Hospitals',
    roomRent: 'Single Private AC Room',
    restoration: '100% Unlimited Refill',
    waitingPED: '36 Months',
    csr: '95.0%',
    premium: 'Est. ₹15,000/yr',
  },
  inclusions: [
    'In-patient hospitalisation and ICU room rent covered',
    'Pre and post hospitalisation expenses covered (60/90 days)',
    'All day-care medical procedures covered',
    'Emergency road ambulance cover up to ₹3,000',
  ],
  specialBenefits: [
    '100% Automatic restoration of sum insured upon exhaustion.',
    'No Claim Bonus up to 50% for claim-free policy years.',
  ],
  hospitalNetwork: {
    csrPercentage: '95.0% (IRDAI Audited)',
    cashlessGaragesOrHospitalsCount: '10,000+ Cashless Hospitals',
    settlementSpeed: '< 2 Hours via Express Desk',
    tpaSupport: 'In-house dedicated claims desk',
  },
  targetProfile: {
    bestFor: 'Families seeking affordable floater coverage with comprehensive restoration and maternity benefits.',
    idealAgeRange: '25 – 55 years',
    recommendedFamilyType: 'Self + Spouse + 2 Children',
  },
  finePrint: {
    subLimits: 'Cataract treatment capped at ₹35,000 per eye.',
    deductibles: 'Optional ₹10,000 voluntary deductible available for 10% discount.',
    coPay: 'No co-payment applicable for age below 60 years.',
  },
  exclusions: [
    'Cosmetic and plastic surgery unless medically necessary.',
    'Substance abuse or self-inflicted injuries.',
  ],
};

export const EditSchemeModal: React.FC<EditSchemeModalProps> = ({
  scheme,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isNewMode,
}) => {
  const [formData, setFormData] = useState<Scheme | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (scheme) {
        setFormData(JSON.parse(JSON.stringify(scheme)));
      } else if (isNewMode) {
        const newScheme: Scheme = {
          ...DEFAULT_BLANK_SCHEME,
          id: `scheme-${Date.now()}`,
        };
        setFormData(newScheme);
      }
    }
  }, [scheme, isOpen, isNewMode]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleFinancialsChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        financials: {
          ...prev.financials,
          [field]: value,
        },
      };
    });
  };

  const handleHospitalNetworkChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hospitalNetwork: {
          ...prev.hospitalNetwork,
          [field]: value,
        },
      };
    });
  };

  const handleTargetProfileChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        targetProfile: {
          ...prev.targetProfile,
          [field]: value,
        },
      };
    });
  };

  const handleFinePrintChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        finePrint: {
          ...prev.finePrint,
          [field]: value,
        },
      };
    });
  };

  // Array item handlers for Inclusions, Riders, Exclusions
  const handleArrayChange = (field: 'inclusions' | 'specialBenefits' | 'exclusions', index: number, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const handleAddArrayItem = (field: 'inclusions' | 'specialBenefits' | 'exclusions') => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: [...prev[field], ''] };
    });
  };

  const handleRemoveArrayItem = (field: 'inclusions' | 'specialBenefits' | 'exclusions', index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    // Sync root convenience fields with financials for consistency
    const updated: Scheme = {
      ...formData,
      sumInsured: formData.financials.sumInsured,
      csr: formData.financials.csr,
      network: formData.financials.network,
      entryAge: formData.financials.entryAge,
      roomRent: formData.financials.roomRent,
      restoration: formData.financials.restoration,
      waitingPED: formData.financials.waitingPED,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-400/30 uppercase">
                  Admin Edit Mode
                </span>
                <span className="text-xs text-slate-400">• ID: {formData.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Edit Scheme Details: {formData.plan}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          
          {/* Basic Overview */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-blue-600" />
              1. Basic Scheme Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Plan Name</label>
                <input
                  type="text"
                  value={formData.plan}
                  onChange={(e) => handleChange('plan', e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Insurer Name</label>
                <input
                  type="text"
                  value={formData.insurer}
                  onChange={(e) => handleChange('insurer', e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Insurance Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value as InsuranceCategory)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-semibold text-slate-800 capitalize"
                >
                  <option value="health">Health</option>
                  <option value="term">Term</option>
                  <option value="motor">Motor</option>
                  <option value="travel">Travel</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-slate-700 font-semibold mb-1">Tagline / Key Highlight</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium italic"
                  required
                />
              </div>

              {/* Insurer Logo Option & Presets */}
              <div className="md:col-span-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-800 font-bold">Scheme Brand Logo</label>
                  <span className="text-[10px] text-slate-500 font-medium">Select preset or paste SVG / Image URL</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Live Logo Preview */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    <img 
                      src={getInsurerLogoUrl(formData.insurer, formData.logoUrl)} 
                      alt="Logo Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="Enter custom image URL or data URI (or pick a preset below)..."
                    className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg font-mono text-[11px] focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Logo Presets Bar */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Preset IRDAI Insurer Logos:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {INSURER_LOGO_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleChange('logoUrl', preset.logoSvg)}
                        className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[10px] font-semibold text-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        <img src={preset.logoSvg} alt={preset.name} className="w-4 h-4 object-contain" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financials & Parameters */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              2. Financials & Core Parameters
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimated Base Premium</label>
                <input
                  type="text"
                  value={formData.financials.premium}
                  onChange={(e) => handleFinancialsChange('premium', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-blue-700"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sum Insured Range</label>
                <input
                  type="text"
                  value={formData.financials.sumInsured}
                  onChange={(e) => handleFinancialsChange('sumInsured', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Claim Settlement Ratio (CSR)</label>
                <input
                  type="text"
                  value={formData.financials.csr}
                  onChange={(e) => handleFinancialsChange('csr', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Network Size (Count)</label>
                <input
                  type="text"
                  value={formData.financials.network}
                  onChange={(e) => handleFinancialsChange('network', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Room Rent Limit</label>
                <input
                  type="text"
                  value={formData.financials.roomRent}
                  onChange={(e) => handleFinancialsChange('roomRent', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Restoration Benefit</label>
                <input
                  type="text"
                  value={formData.financials.restoration}
                  onChange={(e) => handleFinancialsChange('restoration', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">PED Waiting Period</label>
                <input
                  type="text"
                  value={formData.financials.waitingPED}
                  onChange={(e) => handleFinancialsChange('waitingPED', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Entry Age Limit</label>
                <input
                  type="text"
                  value={formData.financials.entryAge}
                  onChange={(e) => handleFinancialsChange('entryAge', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Hospital Network Details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Hospital className="w-4 h-4 text-purple-600" />
              3. Hospital Network & Claims Operations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">CSR Percentage Detail</label>
                <input
                  type="text"
                  value={formData.hospitalNetwork.csrPercentage}
                  onChange={(e) => handleHospitalNetworkChange('csrPercentage', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cashless Network Detail</label>
                <input
                  type="text"
                  value={formData.hospitalNetwork.cashlessGaragesOrHospitalsCount}
                  onChange={(e) => handleHospitalNetworkChange('cashlessGaragesOrHospitalsCount', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Express Settlement Speed</label>
                <input
                  type="text"
                  value={formData.hospitalNetwork.settlementSpeed}
                  onChange={(e) => handleHospitalNetworkChange('settlementSpeed', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">TPA / Desk Support</label>
                <input
                  type="text"
                  value={formData.hospitalNetwork.tpaSupport}
                  onChange={(e) => handleHospitalNetworkChange('tpaSupport', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Coverage & Inclusions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                4. Coverage & Inclusions List
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem('inclusions')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Inclusion
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {formData.inclusions.map((inc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inc}
                    onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    placeholder="Enter covered treatment or benefit..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('inclusions', index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Special Benefits & Riders */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                5. Special Benefits & Riders
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem('specialBenefits')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Special Benefit
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {formData.specialBenefits.map((ben, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ben}
                    onChange={(e) => handleArrayChange('specialBenefits', index, e.target.value)}
                    className="flex-1 p-2 bg-amber-50/40 border border-amber-200/80 rounded-lg"
                    placeholder="Enter special feature or rider benefit..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('specialBenefits', index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Target Profile */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              6. Target Client Profile ("Best For")
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">"Best For" Pitch Statement</label>
                <input
                  type="text"
                  value={formData.targetProfile.bestFor}
                  onChange={(e) => handleTargetProfileChange('bestFor', e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ideal Age Range</label>
                <input
                  type="text"
                  value={formData.targetProfile.idealAgeRange}
                  onChange={(e) => handleTargetProfileChange('idealAgeRange', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recommended Family Type</label>
                <input
                  type="text"
                  value={formData.targetProfile.recommendedFamilyType}
                  onChange={(e) => handleTargetProfileChange('recommendedFamilyType', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Terms & Fine Print */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-slate-700" />
              7. Important Terms & Fine Print
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sub-limits & Cappings</label>
                <textarea
                  rows={2}
                  value={formData.finePrint.subLimits}
                  onChange={(e) => handleFinePrintChange('subLimits', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deductibles</label>
                <textarea
                  rows={2}
                  value={formData.finePrint.deductibles}
                  onChange={(e) => handleFinePrintChange('deductibles', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Co-payment Terms</label>
                <textarea
                  rows={2}
                  value={formData.finePrint.coPay}
                  onChange={(e) => handleFinePrintChange('coPay', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Policy Exclusions */}
          <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                8. Policy Exclusions List
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem('exclusions')}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Exclusion
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {formData.exclusions.map((exc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exc}
                    onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                    className="flex-1 p-2 bg-rose-50/50 border border-rose-200 rounded-lg text-rose-900"
                    placeholder="Enter excluded treatment..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('exclusions', index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit & Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between sticky bottom-0 bg-white p-4 -mx-6 -mb-6 shadow-lg">
            <div>
              {onDelete && scheme && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete scheme "${formData.plan}"? This action cannot be undone.`)) {
                      onDelete(formData.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  Delete Scheme
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                {isNewMode ? 'Create New Scheme' : 'Save Scheme Changes'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
