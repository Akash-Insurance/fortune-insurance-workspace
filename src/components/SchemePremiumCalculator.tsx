'use client';

import React, { useState, useMemo } from 'react';
import { Scheme, CalculatedPremiumDetails, PremiumCalculatorParams } from '@/lib/types';
import { getInsurerLogoUrl } from '@/lib/insurer-logos';
import { 
  Calculator, 
  X, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Users, 
  Calendar, 
  Award, 
  Percent,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface SchemePremiumCalculatorProps {
  scheme: Scheme;
  isOpen: boolean;
  onClose: () => void;
  onSaveCalculation?: (schemeId: string, details: CalculatedPremiumDetails) => void;
}

export const SchemePremiumCalculator: React.FC<SchemePremiumCalculatorProps> = ({
  scheme,
  isOpen,
  onClose,
  onSaveCalculation,
}) => {
  // Initial parameters state
  const [sumInsuredAmount, setSumInsuredAmount] = useState<number>(1000000); // Default 10L
  const [primaryAge, setPrimaryAge] = useState<number>(35);
  const [policyType, setPolicyType] = useState<PremiumCalculatorParams['policyType']>('floater_2a2c');
  const [tenureYears, setTenureYears] = useState<1 | 2 | 3>(1);
  const [selectedRiders, setSelectedRiders] = useState<string[]>(['ncb_super']);

  // Insurer logo
  const logoUrl = useMemo(() => getInsurerLogoUrl(scheme.insurer, scheme.logoUrl), [scheme]);

  // Dynamic calculation logic
  const calculation = useMemo<CalculatedPremiumDetails>(() => {
    // Base rate per lakh
    const ratePerLakh = scheme.ratePerLakh || 1400;

    // Age multiplier
    let ageMultiplier = 1.0;
    if (primaryAge > 65) ageMultiplier = 2.6;
    else if (primaryAge > 55) ageMultiplier = 2.0;
    else if (primaryAge > 45) ageMultiplier = 1.55;
    else if (primaryAge > 35) ageMultiplier = 1.25;

    // Policy Floater multiplier
    let floaterMultiplier = 1.0;
    if (policyType === 'floater_1a1c') floaterMultiplier = 1.35;
    else if (policyType === 'floater_2a') floaterMultiplier = 1.65;
    else if (policyType === 'floater_2a2c') floaterMultiplier = 2.05;

    // Raw Base Premium
    const baseLakhs = sumInsuredAmount / 100000;
    const basePremium = Math.round(baseLakhs * ratePerLakh * ageMultiplier * floaterMultiplier);

    // Rider additions
    const RIDER_PRICES: Record<string, number> = {
      critical_illness: 2500,
      hospital_cash: 1200,
      ncb_super: 1500,
      opd_cover: 3200,
    };

    const riderPremium = selectedRiders.reduce((acc, rId) => acc + (RIDER_PRICES[rId] || 0), 0);
    const subtotal = basePremium + riderPremium;

    // Tenure Multi-Year Discount
    let discountPct = 0;
    if (tenureYears === 2) discountPct = 0.075; // 7.5%
    if (tenureYears === 3) discountPct = 0.125; // 12.5%

    const tenureDiscount = Math.round(subtotal * discountPct);
    const afterDiscount = subtotal - tenureDiscount;
    const taxGst = Math.round(afterDiscount * 0.18); // 18% GST
    const netAnnualPremium = Math.round(afterDiscount + taxGst);
    const monthlyEmi = Math.round(netAnnualPremium / 12);

    return {
      basePremium,
      riderPremium,
      subtotal,
      tenureDiscount,
      taxGst,
      netAnnualPremium,
      monthlyEmi,
      parameters: {
        sumInsuredAmount,
        primaryAge,
        policyType,
        tenureYears,
        selectedRiders,
      },
    };
  }, [scheme, sumInsuredAmount, primaryAge, policyType, tenureYears, selectedRiders]);

  if (!isOpen) return null;

  const toggleRider = (rId: string) => {
    if (selectedRiders.includes(rId)) {
      setSelectedRiders(selectedRiders.filter((r) => r !== rId));
    } else {
      setSelectedRiders([...selectedRiders, rId]);
    }
  };

  const handleApply = () => {
    if (onSaveCalculation) {
      onSaveCalculation(scheme.id, calculation);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={logoUrl} 
              alt={scheme.insurer} 
              className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-white/20 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-400/30 uppercase">
                  Premium Calculator
                </span>
                <span className="text-xs text-slate-300 font-medium">{scheme.insurer}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {scheme.plan} Rate Calculator
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

        {/* Scrollable Calculator Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50 text-xs">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Sum Insured Selector */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span>1. Select Sum Insured (Coverage)</span>
                <span className="text-blue-700 font-extrabold text-sm">
                  ₹{(sumInsuredAmount / 100000).toFixed(0)} Lakhs
                </span>
              </label>

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSumInsuredAmount(amt)}
                    className={`py-2 px-1 rounded-lg font-bold text-[11px] transition-all text-center ${
                      sumInsuredAmount === amt
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amt >= 10000000 ? '1 Cr' : `${amt / 100000}L`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Primary Age Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">2. Primary Member Age</label>
                <span className="font-extrabold text-slate-900 text-sm">{primaryAge} Years</span>
              </div>
              <input
                type="range"
                min={18}
                max={75}
                value={primaryAge}
                onChange={(e) => setPrimaryAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>18 yrs (Base)</span>
                <span>45 yrs</span>
                <span>75 yrs (Senior)</span>
              </div>
            </div>

            {/* 3. Policy Type / Member Structure */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <label className="font-bold text-slate-800 block">3. Policy Coverage Structure</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'individual', label: '1 Adult (Individual)' },
                  { id: 'floater_1a1c', label: '1 Adult + 1 Child' },
                  { id: 'floater_2a', label: '2 Adults (Couples)' },
                  { id: 'floater_2a2c', label: '2 Adults + 2 Kids' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPolicyType(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left font-semibold text-xs transition-all ${
                      policyType === item.id
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Policy Tenure & Multi-Year Discount */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <label className="font-bold text-slate-800 block">4. Policy Tenure & Discount</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { yr: 1, label: '1 Year', disc: 'Standard' },
                  { yr: 2, label: '2 Years', disc: '7.5% OFF' },
                  { yr: 3, label: '3 Years', disc: '12.5% OFF' },
                ].map((item) => (
                  <button
                    key={item.yr}
                    type="button"
                    onClick={() => setTenureYears(item.yr as any)}
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                      tenureYears === item.yr
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{item.disc}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 5. Add-on Riders Checklist */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <span className="font-bold text-slate-800 block">5. Optional Add-on Protection Riders:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'ncb_super', label: 'No Claim Bonus Super (2x NCB)', price: 1500 },
                { id: 'critical_illness', label: 'Critical Illness Rider (₹5L Benefit)', price: 2500 },
                { id: 'hospital_cash', label: 'Hospital Daily Cash (₹2,000/day)', price: 1200 },
                { id: 'opd_cover', label: 'OPD & Doctor Consultations Cover', price: 3200 },
              ].map((r) => {
                const checked = selectedRiders.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleRider(r.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      checked ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      <span className="font-semibold">{r.label}</span>
                    </div>
                    <span className="font-bold text-indigo-700">+₹{r.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Calculated Summary Card */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Calculated Premium Breakdown</h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded border border-emerald-400/30">
                GST 18% Included
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Base Risk Premium</span>
                <span className="text-base font-bold text-white">₹{calculation.basePremium.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Riders Cost</span>
                <span className="text-base font-bold text-indigo-300">+₹{calculation.riderPremium.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Tenure Discount</span>
                <span className="text-base font-bold text-emerald-400">-₹{calculation.tenureDiscount.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">GST Tax (18%)</span>
                <span className="text-base font-bold text-amber-300">+₹{calculation.taxGst.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Total Calculated Net Premium</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
                  ₹{calculation.netAnnualPremium.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-400">/ year</span>
                </div>
              </div>

              <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 block">Monthly EMI Option</span>
                <span className="text-lg font-bold text-blue-300">Est. ₹{calculation.monthlyEmi.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
          >
            Close Calculator
          </button>

          {onSaveCalculation && (
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Apply Premium to Scheme / Report
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
