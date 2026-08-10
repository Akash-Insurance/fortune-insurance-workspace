import React, { useState, useEffect } from 'react';
import { Scheme, AdvisorNote } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { saveAdvisorNote, getAdvisorNotes } from '@/lib/data-service';
import { getInsurerLogoUrl } from '@/lib/insurer-logos';
import { 
  ArrowLeft, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Award, 
  Clock, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  Save, 
  Check, 
  Sparkles, 
  Hospital, 
  Zap, 
  HelpCircle,
  Calculator,
  Trash2
} from 'lucide-react';

interface SchemeDetailViewProps {
  scheme: Scheme;
  onBack: () => void;
  onEditScheme?: (scheme: Scheme) => void;
  onDeleteScheme?: (schemeId: string) => void;
  onOpenCalculator?: (scheme: Scheme) => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({ 
  scheme, 
  onBack, 
  onEditScheme,
  onDeleteScheme,
  onOpenCalculator,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('sec-financials');
  
  // Advisor note state
  const [noteText, setNoteText] = useState('');
  const [savingStatus, setSavingStatus] = useState<string>('');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  const logoUrl = getInsurerLogoUrl(scheme.insurer, scheme.logoUrl);

  // Load existing note on mount
  useEffect(() => {
    async function loadNote() {
      if (!user) return;
      const notes = await getAdvisorNotes(scheme.id);
      const userNote = notes.find((n) => n.advisorId === user.id);
      if (userNote) {
        setNoteText(userNote.noteText);
        setLastSavedTime(new Date(userNote.updatedAt).toLocaleTimeString());
      }
    }
    loadNote();
  }, [scheme.id, user]);

  // Auto-save advisor note handler
  const handleNoteChange = (text: string) => {
    setNoteText(text);
    setSavingStatus('Typing...');

    const timeoutId = setTimeout(async () => {
      if (!user) return;
      setSavingStatus('Auto-saving to backend...');
      const updated = await saveAdvisorNote(scheme.id, user.id, user.name, text);
      const timeStr = new Date(updated.updatedAt).toLocaleTimeString();
      setLastSavedTime(timeStr);
      setSavingStatus(`Auto-saved at ${timeStr}`);
    }, 800);

    return () => clearTimeout(timeoutId);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140; // account for fixed header + pill bar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header Bar */}
      <div className="bg-slate-900 text-white pt-6 pb-8 border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="flex items-center gap-2">
              {onOpenCalculator && (
                <button
                  onClick={() => onOpenCalculator(scheme)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 px-3.5 py-1.5 rounded-lg border border-emerald-500/40 transition-all shadow-sm"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Interactive Premium Calculator
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={logoUrl}
                alt={scheme.insurer}
                className="w-14 h-14 rounded-2xl object-contain bg-white/10 p-1.5 border border-white/20 shrink-0 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    {scheme.insurer}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono uppercase">
                    {scheme.category}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{scheme.plan}</h1>
                <p className="text-xs text-slate-300 italic mt-1 max-w-2xl">"{scheme.tagline}"</p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Claim Ratio</span>
                <span className="font-bold text-emerald-400 text-sm">{scheme.csr}</span>
              </div>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Est. Premium</span>
                <span className="font-bold text-blue-300 text-sm">{scheme.financials.premium}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky 8-Pill Navigation Bar */}
      <div className="sticky top-[138px] z-20 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'sec-financials', label: '1. Financials & Parameters' },
              { id: 'sec-inclusions', label: '2. Coverage & Inclusions' },
              { id: 'sec-riders', label: '3. Benefits & Riders' },
              { id: 'sec-claims', label: '4. Claims & Hospital Network' },
              { id: 'sec-target', label: '5. Target Client Profile' },
              { id: 'sec-terms', label: '6. Terms & Fine Print' },
              { id: 'sec-exclusions', label: '7. Policy Exclusions' },
              { id: 'sec-notes', label: '8. Advisor Notes & Recs' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => scrollToSection(pill.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === pill.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 8 Sections Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* SECTION 1: Policy Parameters & Financials (8-Metric Grid) */}
        <section id="sec-financials" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">1. Policy Parameters & Financials</h2>
            </div>

            {onOpenCalculator && (
              <button
                onClick={() => onOpenCalculator(scheme)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
              >
                <Calculator className="w-4 h-4 text-white" />
                <span>Launch Premium Calculator</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-6">Key quantitative parameters and pricing structure for {scheme.plan}.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
              <span className="text-[11px] text-blue-600 font-semibold uppercase block">Est. Premium</span>
              <span className="text-lg font-extrabold text-blue-900 block mt-1">{scheme.financials.premium}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Indicative base floater</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Sum Insured</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{scheme.financials.sumInsured}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Coverage range</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Entry Age</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{scheme.financials.entryAge}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Eligibility window</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">PED Waiting Period</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{scheme.financials.waitingPED}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Pre-existing illness</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Room Rent Limit</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{scheme.financials.roomRent}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ICU & Private Room</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Restoration</span>
              <span className="text-base font-bold text-blue-700 block mt-1">{scheme.financials.restoration}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Automatic refill</span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-600 font-semibold uppercase block">CSR Percentage</span>
              <span className="text-base font-extrabold text-emerald-800 block mt-1">{scheme.financials.csr}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">IRDAI audited</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">Network Size</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{scheme.financials.network}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cashless pan-India</span>
            </div>

          </div>
        </section>

        {/* SECTION 2: Coverage & Inclusions */}
        <section id="sec-inclusions" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">2. Coverage & Inclusions</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Comprehensive checklist of treatments and expenses covered under the policy.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scheme.inclusions.map((inc, index) => (
              <div key={index} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-800 leading-relaxed">{inc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Special Benefits & Riders */}
        <section id="sec-riders" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">3. Special Benefits & Riders</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Unique value propositions, cover multipliers, restoration benefits, and riders.</p>

          <div className="space-y-3">
            {scheme.specialBenefits.map((benefit, index) => (
              <div key={index} className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-slate-800 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Claim Settlement & Hospital Network */}
        <section id="sec-claims" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Hospital className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">4. Claim Settlement & Hospital Network</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Claim Settlement Ratio (CSR)</span>
                <span className="text-sm font-bold text-emerald-700">{scheme.hospitalNetwork.csrPercentage}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Cashless Network Count</span>
                <span className="text-sm font-bold text-slate-900">{scheme.hospitalNetwork.cashlessGaragesOrHospitalsCount}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Express Settlement Speed</span>
                <span className="text-sm font-bold text-blue-700">{scheme.hospitalNetwork.settlementSpeed}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">TPA / Claims Management</span>
                <span className="text-sm font-bold text-slate-900">{scheme.hospitalNetwork.tpaSupport}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Target Client Profile ("Best For") */}
        <section id="sec-target" className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-5 h-5 text-blue-300" />
            <h2 className="text-lg font-bold text-white">5. Target Client Profile</h2>
          </div>
          
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 mb-4">
            <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wider block mb-1">
              "Best For" Highlighted Profile
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">{scheme.targetProfile.bestFor}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-300 block font-medium">Ideal Age Group:</span>
              <span className="font-bold text-white text-sm">{scheme.targetProfile.idealAgeRange}</span>
            </div>
            <div>
              <span className="text-slate-300 block font-medium">Recommended Family Structure:</span>
              <span className="font-bold text-white text-sm">{scheme.targetProfile.recommendedFamilyType}</span>
            </div>
          </div>
        </section>

        {/* SECTION 6: Important Terms & Fine Print */}
        <section id="sec-terms" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">6. Important Terms & Fine Print</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Sub-limits & Cappings</span>
              <p className="text-slate-700 leading-relaxed">{scheme.finePrint.subLimits}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Deductibles</span>
              <p className="text-slate-700 leading-relaxed">{scheme.finePrint.deductibles}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Co-payment Terms</span>
              <p className="text-slate-700 leading-relaxed">{scheme.finePrint.coPay}</p>
            </div>
          </div>
        </section>

        {/* SECTION 7: Policy Exclusions */}
        <section id="sec-exclusions" className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">7. Policy Exclusions</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Explicit list of treatments, situations, and pre-conditions NOT covered under this plan.</p>

          <div className="space-y-2">
            {scheme.exclusions.map((exc, idx) => (
              <div key={idx} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-start gap-2.5 text-xs text-rose-900 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                <span>{exc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: Advisor Recommendation & Notes (Auto-Saving Textarea) */}
        <section id="sec-notes" className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">8. Advisor Recommendation & Confidential Notes</h2>
            </div>
            {savingStatus && (
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {savingStatus}
              </span>
            )}
          </div>
          
          <p className="text-xs text-slate-400 mb-4">
            Notes written here automatically save to your logged-in advisor profile ({user?.name || 'Advisor'}) and persist across sessions.
          </p>

          <textarea
            value={noteText}
            onChange={(e) => handleNoteChange(e.target.value)}
            rows={5}
            placeholder={`Type your custom advisor notes for ${scheme.plan} here... (e.g., Ideal pitch angle, client objection handling, family floater recommendation)`}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Advisor ID: {user?.id || 'usr_rahul'}</span>
            <span>{lastSavedTime ? `Last saved at ${lastSavedTime}` : 'Auto-saves as you type'}</span>
          </div>
        </section>

      </main>

    </div>
  );
};
