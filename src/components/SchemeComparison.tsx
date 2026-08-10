import React, { useState } from 'react';
import { Plus, X, Scale, ArrowRight } from 'lucide-react';
import { Scheme } from '@/lib/types';
import { getInsurerLogoUrl } from '@/lib/insurer-logos';

interface SchemeComparisonProps {
  schemes: Scheme[];
  compareIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectScheme: (scheme: Scheme) => void;
  onAddIdToCompare: (id: string) => void;
}

export const SchemeComparison: React.FC<SchemeComparisonProps> = ({
  schemes,
  compareIds,
  onRemoveFromCompare,
  onClearCompare,
  onSelectScheme,
  onAddIdToCompare,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Get schemes selected for comparison
  const selectedSchemes = schemes.filter((s) => compareIds.includes(s.id));
  const unselectedSchemes = schemes.filter((s) => !compareIds.includes(s.id));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      
      {/* Panel Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Compare Schemes</h2>
            <span className="bg-indigo-100 text-indigo-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              Side-by-Side Spec Matrix ({selectedSchemes.length}/4)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare key financials, inclusions, CSR %, room capping, restoration, and fine print across selected policies.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {selectedSchemes.length < 4 && (
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Scheme to Compare
            </button>
          )}

          {selectedSchemes.length > 0 && (
            <button
              onClick={onClearCompare}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all"
            >
              Clear Matrix
            </button>
          )}
        </div>
      </div>

      {/* Scheme Picker Dropdown Drawer */}
      {pickerOpen && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800">Select a scheme to add to comparison:</span>
            <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {unselectedSchemes.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onAddIdToCompare(s.id);
                  setPickerOpen(false);
                }}
                className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all text-xs"
              >
                <div className="font-bold text-slate-900">{s.plan}</div>
                <div className="text-[10px] text-slate-500">{s.insurer} • {s.category.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matrix Table */}
      {selectedSchemes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Scale className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No schemes selected for comparison</p>
          <p className="text-xs text-slate-500 mb-4">
            Select schemes from the Scheme Library above or click "+ Add Scheme to Compare" to build your side-by-side matrix.
          </p>
          <button
            onClick={() => setPickerOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            + Select Schemes to Compare
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 bg-slate-50 font-bold text-slate-700 w-48 shrink-0">Policy Parameters</th>
                {selectedSchemes.map((s) => {
                  const logoUrl = getInsurerLogoUrl(s.insurer, s.logoUrl);
                  return (
                    <th key={s.id} className="p-3 bg-slate-50/80 font-bold text-slate-900 min-w-[240px] relative">
                      <button
                        onClick={() => onRemoveFromCompare(s.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 bg-white rounded-full border border-slate-200"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={logoUrl}
                          alt={s.insurer}
                          className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-[10px] uppercase font-bold text-blue-600 block truncate">{s.insurer}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 block mt-0.5">{s.plan}</span>
                      <button
                        onClick={() => onSelectScheme(s)}
                        className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View 8-Section Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Category */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Category</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 uppercase font-bold text-slate-800">{s.category}</td>
                ))}
              </tr>

              {/* Sum Insured */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Sum Insured Range</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 font-bold text-slate-900">{s.sumInsured}</td>
                ))}
              </tr>

              {/* Est Premium */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Est. Premium</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 font-bold text-blue-700">{s.financials.premium}</td>
                ))}
              </tr>

              {/* Claim Settlement Ratio */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Claim Settlement Ratio (CSR)</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 font-bold text-emerald-600">{s.csr}</td>
                ))}
              </tr>

              {/* Hospital / Garage Network */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Cashless Network Size</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-slate-800">{s.network}</td>
                ))}
              </tr>

              {/* Room Rent Limits */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Room Rent Limits</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-slate-800">{s.roomRent}</td>
                ))}
              </tr>

              {/* Restoration Benefit */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Restoration Benefit</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-blue-800 font-semibold">{s.restoration}</td>
                ))}
              </tr>

              {/* Waiting Period */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">PED Waiting Period</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-slate-800">{s.waitingPED}</td>
                ))}
              </tr>

              {/* Key Rider Benefits */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Special Benefits & Riders</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-slate-700">
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      {s.specialBenefits.slice(0, 2).map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Fine Print & Deductibles */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Sub-limits & Deductibles</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-slate-700">
                    <div className="text-[11px]"><span className="font-semibold">Sub-limits:</span> {s.finePrint.subLimits}</div>
                    <div className="text-[11px] mt-1"><span className="font-semibold">Co-pay:</span> {s.finePrint.coPay}</div>
                  </td>
                ))}
              </tr>

              {/* Best For Profile */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Target Profile ("Best For")</td>
                {selectedSchemes.map((s) => (
                  <td key={s.id} className="p-3 text-slate-800 bg-blue-50/40 rounded-lg font-medium text-[11px]">
                    {s.targetProfile.bestFor}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
