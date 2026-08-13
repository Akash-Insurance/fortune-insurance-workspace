'use client';

import React from 'react';
import { Proposal, Scheme } from '@/lib/types';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  User as UserIcon, 
  Building2, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Award, 
  HeartPulse, 
  Clock, 
  Car, 
  Plane,
  Check,
  Calculator,
  MessageCircle,
  Mail,
  Clock3
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getInsurerLogoUrl } from '@/lib/insurer-logos';

interface ProposalDetailViewProps {
  proposal: Proposal;
  allSchemes: Scheme[];
  onBack: () => void;
}

export const ProposalDetailView: React.FC<ProposalDetailViewProps> = ({
  proposal,
  allSchemes,
  onBack
}) => {
  // Get linked scheme details
  const selectedSchemes = allSchemes.filter((s) => proposal.compareIds.includes(s.id));

  // Group schemes by category
  const schemesByCategory = selectedSchemes.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Scheme[]>);

  // PDF Export via html2canvas & print trigger
  const handleExportPDF = async () => {
    const input = document.getElementById('proposal-document-canvas');
    if (!input) return;
    
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save(`Fortune_Proposal_${proposal.client?.name?.replace(/\s+/g, '_') || 'Client'}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to generate PDF");
    }
  };

  const draftMsg = `Hi ${proposal.client.name}, this is ${proposal.createdByDisplay || proposal.client.advisor} from Fortune Investment Services. Your insurance proposal report has been generated for you. Please find it attached. Feel free to reach out with any questions.`;

  const handleSendWhatsApp = () => {
    // Basic phone number extraction 
    let phoneStr = proposal.client.phone || "";
    const digits = phoneStr.replace(/\D/g, "");
    if (!digits) {
      alert("No valid mobile number found for this client.");
      return;
    }
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(draftMsg)}`, "_blank");
  };

  const handleSendEmail = () => {
    let emailStr = proposal.client.email;
    if (!emailStr) {
      alert("No email address found for this client.");
      return;
    }
    const subject = `Your customized insurance proposal from Fortune Investment Services`;
    window.open(`mailto:${emailStr}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftMsg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="bg-slate-900 text-white py-3 px-6 sticky top-16 z-40 shadow-lg no-print flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Client Proposal Document</span>
          
          <button
            onClick={handleSendWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
          
          <button
            onClick={handleSendEmail}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <Mail className="w-4 h-4" /> Email
          </button>

          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Save as PDF
          </button>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <main id="proposal-document-canvas" className="max-w-4xl mx-auto my-8 bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
        
        {/* ================= COVER PAGE ================= */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-10 md:p-14 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Header Brand */}
            <div className="flex items-center justify-between pb-8 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.jpeg" 
                  alt="Fortune Investment Services" 
                  className="h-12 w-auto bg-white rounded p-1 shadow-lg" 
                />
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Fortune Investment Services</h2>
                  <p className="text-[10px] text-blue-300 font-mono">IRDAI REGISTRATION NO: 10492/2026</p>
                </div>
              </div>
              <span className="bg-blue-500/20 text-blue-300 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
                CONFIDENTIAL PROPOSAL
              </span>
            </div>

            {/* Document Title */}
            <div className="mt-12">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest block mb-2">
                CUSTOMIZED ADVISORY PORTFOLIO
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {proposal.name}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                A tailored multi-category insurance portfolio designed specifically to secure your family's health, income, and assets.
              </p>
            </div>
          </div>

          {/* Cover Page Footer Grid */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Prepared For</span>
              <span className="font-bold text-white text-sm">{proposal.client.name}</span>
              <span className="text-slate-400 block text-[11px]">Age {proposal.client.age} • {proposal.client.city}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Family Profile</span>
              <span className="font-bold text-white text-sm">{proposal.client.family}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Wealth Advisor</span>
              <span className="font-bold text-blue-300 text-sm">{proposal.createdByDisplay || proposal.client.advisor}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Date of Issue</span>
              <span className="font-bold text-white text-sm">{proposal.date}</span>
            </div>
          </div>

        </div>

        <div className="p-8 md:p-12 space-y-12">
          
          {/* ================= SECTION A: EXECUTIVE PORTFOLIO SUMMARY ================= */}
          <section className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">SECTION A</span>
              <h2 className="text-xl font-bold text-slate-900">Executive Portfolio Summary & Recommendation Matrix</h2>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on our comprehensive financial needs analysis, we have selected and benchmarked the top performing IRDAI regulated insurance policies across {Object.keys(schemesByCategory).length} category domains.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3 font-semibold rounded-tl-xl">Category</th>
                    <th className="p-3 font-semibold">Recommended Insurer & Plan</th>
                    <th className="p-3 font-semibold">Base Sum Insured</th>
                    <th className="p-3 font-semibold">Key Standard Advantage</th>
                    <th className="p-3 font-semibold rounded-tr-xl">Est. Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-slate-50/50">
                  {selectedSchemes.map((s) => {
                    const logoUrl = getInsurerLogoUrl(s.insurer, s.logoUrl);
                    return (
                      <tr key={s.id}>
                        <td className="p-3 font-bold uppercase text-slate-700">{s.category}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={logoUrl}
                              alt={s.insurer}
                              className="w-7 h-7 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{s.plan}</span>
                              <span className="text-[10px] text-slate-500">{s.insurer}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-slate-800">{s.sumInsured}</td>
                        <td className="p-3 text-slate-600">{s.restoration}</td>
                        <td className="p-3 font-bold text-blue-700">
                          {proposal.schemeCalculations && proposal.schemeCalculations[s.id]
                            ? `₹${proposal.schemeCalculations[s.id].netAnnualPremium.toLocaleString('en-IN')}/yr`
                            : s.financials.premium}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================= SECTIONS B, C, D... CATEGORY DEEP DIVES ================= */}
          {Object.entries(schemesByCategory).map(([cat, schemes], catIdx) => (
            <section key={cat} className="space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                    SECTION {String.fromCharCode(66 + catIdx)}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 capitalize">
                    {cat} Insurance Category Breakdown
                  </h2>
                </div>
                <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full uppercase">
                  {schemes.length} Plan(s) Selected
                </span>
              </div>

              <div className="space-y-6">
                {schemes.map((s) => {
                  const logoUrl = getInsurerLogoUrl(s.insurer, s.logoUrl);
                  const calcDetails = proposal.schemeCalculations ? proposal.schemeCalculations[s.id] : undefined;

                  return (
                    <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={logoUrl}
                            alt={s.insurer}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0 shadow-2xs"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase">{s.insurer}</span>
                            <h3 className="text-lg font-bold text-slate-900">{s.plan}</h3>
                            <p className="text-xs text-slate-600 italic mt-0.5">"{s.tagline}"</p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full shrink-0">
                          CSR: {s.csr}
                        </span>
                      </div>

                      {/* Metric grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">Sum Insured</span>
                          <span className="font-bold text-slate-800">{s.sumInsured}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">Network Hospitals</span>
                          <span className="font-bold text-slate-800">{s.network}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">Restoration</span>
                          <span className="font-bold text-blue-600">{s.restoration}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">PED Waiting</span>
                          <span className="font-bold text-slate-800">{s.waitingPED}</span>
                        </div>
                      </div>

                      {/* Calculated Premium Breakdown Matrix if available */}
                      {calcDetails && (
                        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                              <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Premium Calculator Breakdown
                            </span>
                            <span className="text-[10px] text-slate-300 font-mono">
                              Tenure: {calcDetails.parameters.tenureYears} Yr | GST 18%
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Base Risk Premium:</span>
                              <span className="font-bold text-white">₹{calcDetails.basePremium.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Riders Cost:</span>
                              <span className="font-bold text-indigo-300">+₹{calcDetails.riderPremium.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">GST Tax (18%):</span>
                              <span className="font-bold text-amber-300">+₹{calcDetails.taxGst.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Calculated Net Premium:</span>
                              <span className="font-extrabold text-emerald-400 text-sm">₹{calcDetails.netAnnualPremium.toLocaleString('en-IN')}/yr</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Inclusions checklist */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Included Policy Coverage</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {s.inclusions.slice(0, 4).map((inc, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Advisor Note for this scheme */}
                      {proposal.customNotes && proposal.customNotes[s.id] && (
                        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-950 italic">
                          <span className="font-bold not-italic text-blue-800 block mb-0.5">Advisor Recommendation Note:</span>
                          "{proposal.customNotes[s.id]}"
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </section>
          ))}

          {/* ================= PREMIUM SUMMARY SECTION ================= */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">FINANCIAL OVERVIEW</span>
                <h2 className="text-lg font-bold text-white">Premium Summary & Payment Options</h2>
              </div>
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-mono">
                Annual Consolidated Breakdown
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="text-slate-400 font-semibold block">Member-wise Premium Distribution:</span>
                {proposal.client.members && proposal.client.members.length > 0 ? (
                  proposal.client.members.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl">
                      <span className="text-slate-300">{m.name || m.relation} (Age {m.age})</span>
                      <span className="font-bold text-white">₹{(m.premiumShare || 12000).toLocaleString('en-IN')}/yr</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-slate-800 rounded-xl text-slate-300">
                    Self + Spouse + Children Floater Allocation
                  </div>
                )}
              </div>

              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Total Annual Premium</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    ₹{(proposal.totalPremium || 45000).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Includes applicable GST (18%) & Regulatory stamp duty</span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Monthly EMI Option:</span>
                  <span className="font-bold text-blue-300">Est. ₹{Math.round((proposal.totalPremium || 45000) / 12).toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= DECISION GUIDE (3-STEP CHECKLIST) ================= */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Decision Guide & 3-Step Application Process</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-2">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Tele-Underwriting</h3>
                <p className="text-slate-600">Short 10-minute medical tele-call with insurer physician for instant approval.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-2">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-1">KYC & Document Upload</h3>
                <p className="text-slate-600">Submit Aadhaar, PAN card, and bank account details for direct debit setup.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Digital Payment</h3>
                <p className="text-slate-600">Instant digital policy issuance via official insurer payment link.</p>
              </div>
            </div>
          </section>

          {/* ================= FOOTER & COMPLIANCE DISCLAIMER ================= */}
          <footer className="pt-8 border-t border-slate-200 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <img src="/logo.jpeg" alt="Fortune" className="h-6 w-auto object-contain" />
              <span className="font-bold text-slate-900 text-sm">Fortune Investment Services Pvt Ltd</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
              <strong>IRDAI Compliance Disclaimer:</strong> Insurance is the subject matter of solicitation. All policy features, premiums, and benefits shown in this proposal are subject to final underwriting approval by respective insurer companies. Please read policy terms & conditions carefully before concluding a sale.
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Document ID: {proposal.id} • Generated by {proposal.createdByDisplay || proposal.client.advisor}
            </p>
          </footer>

        </div>

      </main>

      {/* Internal Advisor Status Log (Hidden on Print) */}
      <div className="max-w-4xl mx-auto my-8 bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden no-print">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-slate-500" /> Internal Status Audit Log
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {proposal.statusLog && proposal.statusLog.length > 0 ? (
            proposal.statusLog.map((log, idx) => (
              <div key={idx} className="flex items-center gap-4 text-xs">
                <div className="text-slate-400 font-mono w-40 shrink-0">
                  {new Date(log.changedAt).toLocaleString()}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">{log.changedBy}</span>
                  <span className="text-slate-500">changed status to</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold border border-blue-200">
                    {log.newStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic">No status changes recorded yet.</div>
          )}
        </div>
      </div>

    </div>
  );
};
