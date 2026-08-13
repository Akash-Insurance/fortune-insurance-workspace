'use client';
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Shield, FileText, LayoutGrid, LogOut, Plus, ChevronRight, ChevronLeft,
  Check, X, Download, Send, MessageCircle, Mail, Pencil, Trash2,
  ArrowLeftRight, ClipboardList, Car, Heart, Plane, Save, FileBadge2,
  Star, Search,
} from "lucide-react";

/* ---/* ---------------------------------------------------------------- */
/* Design tokens — matches Fortune Investment Services brand system */
/* ---------------------------------------------------------------- */

const C = {
  bg: "#eef1f5",
  surface: "#fbfcfd",
  text: "#1b2230",
  textMuted: "rgba(27,34,48,0.6)",
  border: "rgba(27,34,48,0.12)",
  accent100: "#eaf2fc",
  accent500: "#3e7fc9",
  accent600: "#1b5fae",
  accent700: "#164d8c",
  accent800: "#113c6d",
  accent900: "#0c2a4d",
  green100: "#eef8e6",
  green600: "#5aa236",
  green700: "#457f29",
  green800: "#315c1e",
  amber100: "#fdf1d9",
  amber700: "#a3690f",
  red100: "#fbe4e1",
  red700: "#a5271f",
  neutral200: "#eef1f5",
  neutral400: "#c3c9d1",
  neutral500: "#9aa2ad",
  neutral800: "#333a47",
};

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fis-root, .fis-root * { font-family: 'Inter', system-ui, sans-serif; }
.fis-root h1, .fis-root h2, .fis-root h3 { letter-spacing: -0.015em; }
.fis-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.fis-scroll::-webkit-scrollbar-thumb { background: #c3c9d1; border-radius: 8px; }
`;

const CATEGORIES = ["Health", "Term", "Motor", "Travel"];
const CATEGORY_ICON = { Health: Heart, Term: FileBadge2, Motor: Car, Travel: Plane };

const SECTIONS = [
  { key: "financial", label: "Financial parameters" },
  { key: "coverage", label: "Coverage & inclusions" },
  { key: "benefits", label: "Benefits & multipliers" },
  { key: "claims", label: "Claims & network" },
  { key: "audience", label: "Target audience" },
  { key: "exclusions", label: "Exclusions & terms" },
  { key: "recommendations", label: "Advisor recommendations" },
];

const STATUSES = ["Created", "Sent to Client", "Accepted", "Declined", "Purchased"];

const STATUS_STYLE = {
  Created: { bg: C.neutral200, text: C.neutral800 },
  "Sent to Client": { bg: C.accent100, text: C.accent700 },
  Accepted: { bg: C.green100, text: C.green700 },
  Declined: { bg: C.red100, text: C.red700 },
  Purchased: { bg: C.green600, text: "#ffffff" },
};

const SEED_USERS = [
  { id: "u1", name: "Admin", role: "admin", email: "admin@fortune.co" },
  { id: "u2", name: "Priya Sharma", role: "adviser", email: "priya@fortune.co" },
  { id: "u3", name: "Arjun Mehta", role: "adviser", email: "arjun@fortune.co" },
  { id: "u4", name: "Fatima Khan", role: "adviser", email: "fatima@fortune.co" },
];

const uid = () => Math.random().toString(36).slice(2, 10);
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/* ---------------------------------------------------------------- */
/* Small UI atoms                                                    */
/* ---------------------------------------------------------------- */

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Created;
  return (
    <span style={{ background: s.bg, color: s.text }} className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap tracking-wide">
      {status}
    </span>
  );
}

function Tag({ children, variant = "neutral", style }) {
  const variants = {
    accent: { background: C.accent100, color: C.accent800 },
    accent2: { background: C.green100, color: C.green800 },
    neutral: { background: C.neutral200, color: C.neutral800 },
    outline: { background: "transparent", color: C.accent700, border: `1px solid ${C.accent600}` },
  };
  return (
    <span style={{ ...variants[variant], ...style }} className="inline-flex items-center text-[11px] tracking-wide px-2.5 py-[3px] rounded-md whitespace-nowrap">
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", className = "", disabled, type = "button", title }) {
  const base = "inline-flex items-center gap-1.5 justify-center rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed";
  const style = {
    primary: { background: C.accent600, color: "#ffffff", border: `1px solid ${C.accent600}` },
    secondary: { background: "transparent", color: C.text, border: `1px solid ${C.border}` },
    ghost: { background: "transparent", color: C.accent700, border: "1px solid transparent" },
    danger: { background: "transparent", color: C.red700, border: "1px solid #f3c2bd" },
  }[variant];
  return (
    <button
      type={type} title={title} disabled={disabled} onClick={onClick}
      className={`${base} ${className} hover:brightness-95`}
      style={style}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-[12px] mb-[5px]" style={{ color: C.textMuted }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", minHeight: 36, padding: "6px 10px", fontSize: 14,
  color: C.text, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
};
const Input = (props) => <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} className={`focus:outline-none ${props.className || ""}`} />;
const Select = (props) => <select {...props} style={{ ...inputStyle, ...(props.style || {}) }} className={`focus:outline-none ${props.className || ""}`} />;
const TextArea = (props) => <textarea {...props} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", ...(props.style || {}) }} className={`focus:outline-none ${props.className || ""}`} />;

function Card({ children, className = "", style }) {
  return (
    <div
      className={className}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 1px 0 rgba(27,34,48,0.08)", ...style }}
    >
      {children}
    </div>
  );
}

function seedSchemes() {
  const mk = (category, insurer, plan, premium, sumInsured, tenure, blurbs) => ({
    id: `${category}-${insurer}-${plan}`.replace(/\s+/g, "").toLowerCase(),
    category, insurer, plan, premium, sumInsured, tenure,
    sections: {
      financial: blurbs.financial, coverage: blurbs.coverage, benefits: blurbs.benefits,
      claims: blurbs.claims, audience: blurbs.audience, exclusions: blurbs.exclusions,
      recommendations: blurbs.recommendations,
    },
    lastEditedBy: "Admin",
    lastEditedAt: new Date().toISOString(),
  });

  return [
    /* ---- Health ---- */
    mk("Health", "Star Health & Allied Insurance", "Star Assure", 14000, 1000000, 1,
      { financial: "Premium ≈ ₹14,000/yr for ₹5L – ₹2Cr cover. Entry age: 91 days – 75 yrs.", coverage: "Sum insured automatically restores to 100% an unlimited number of times in a policy year, for related or unrelated claims. No room rent capping once the sum insured is ₹10 lakh or above.", benefits: "Unlimited, 100% each time. Cumulative bonus adds 25% of the sum insured for every claim-free year, up to a 100% increase.", claims: "Claim settlement ratio ~90%*. Network: 14,000+.", audience: "Larger joint families who want one floater covering parents, in-laws and children, with strong maternity benefits.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: No cap on ₹10L+ plans.", recommendations: "A 360° family floater built around unlimited restoration and maternity cover. Star Health also sells Super Star (its most customisable flagship, with 21 add-ons and an age-freeze feature) and dedicated senior-citizen and diabetes-focused plans." }),
    mk("Health", "HDFC ERGO General Insurance", "Optima Secure (+ Optima Secure Plus)", 15500, 1000000, 1,
      { financial: "Premium ≈ ₹15,500/yr for ₹5L – ₹2Cr cover. Entry age: 18 yrs – no upper limit (Secure); 18–60 (Secure Plus).", coverage: "Secure Benefit doubles your sum insured from day one at no extra cost — a ₹10L plan behaves like ₹20L immediately. Plus Benefit adds a further 50–100% to the base cover over the first two renewals, regardless of claims.", benefits: "Unlimited, 100% automatic. Protect Benefit pays for non-medical consumables (gloves, masks, syringes) that most policies exclude.", claims: "Claim settlement ratio ~97–99%*. Network: 13,000–16,000+.", audience: "Buyers under 60 who want the highest 'effective' cover per rupee of premium and plan to hold the policy long-term.", exclusions: "Waiting period / PED: 36 months (reduces with renewals). Room rent: No capping.", recommendations: "Coverage that multiplies itself — 2x from day one, growing further every claim-free year. HDFC ERGO also offers Optima Restore (simpler, lower-cost variant with a 100% restore benefit) for price-sensitive buyers." }),
    mk("Health", "Care Health Insurance", "Care Supreme", 13500, 1000000, 1,
      { financial: "Premium ≈ ₹13,500/yr for ₹3L – ₹1Cr cover. Entry age: 18–65 yrs (adult); floater covers whole family.", coverage: "No sub-limits on individual diseases or procedures — claims pay up to the full sum insured. Covers AYUSH in-patient treatment, day-care procedures, domiciliary care and organ-donor expenses as standard.", benefits: "Unlimited (via Cumulative Bonus Super add-on for extra growth). Instant Cover / Instant Cover Plus add-on can shrink the pre-existing-disease wait to just 30 days.", claims: "Claim settlement ratio ~96–99%*. Network: 14,000–21,000+.", audience: "Buyers with a diagnosed condition like diabetes or hypertension who want fast, unrestricted cover without loading.", exclusions: "Waiting period / PED: 36 months (reducible to 30 days via Instant Cover add-on). Room rent: No capping.", recommendations: "Straightforward, high-cover protection with no disease-wise sub-limits. Base Care Supreme does not include OPD or free health check-ups — these need to be added as riders." }),
    mk("Health", "Niva Bupa Health Insurance", "ReAssure 2.0 (Bronze+ / Platinum+ / Titanium+)", 13000, 1000000, 1,
      { financial: "Premium ≈ ₹13,000/yr for ₹5L – ₹1Cr cover. Entry age: 18–65 yrs.", coverage: "Lock the Clock freezes your premium at your entry age until you make your first claim, deferring age-based hikes. Booster+ lets unused sum insured carry forward and accumulate — up to 5x (Platinum+) or 10x (Titanium+) the base cover.", benefits: "ReAssure Forever — unlimited restore after the first paid claim. Some variants cover eligible treatments from just 2 hours of hospitalisation, rather than the usual 24.", claims: "Claim settlement ratio ~92%*. Network: 10,000–20,800+.", audience: "Younger, healthy buyers who want to lock in a low premium early and value long-term cover growth over immediate breadth of features.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: No capping.", recommendations: "Premium-locking and unused-cover carry-forward, aimed at younger long-term buyers. Older base variants of ReAssure 2.0 carried a sub-limit on modern treatments — this has since been removed in most current variants; confirm the exact clause for your chosen tier." }),
    mk("Health", "ICICI Lombard General Insurance", "Elevate", 16500, 1000000, 1,
      { financial: "Premium ≈ ₹16,500/yr for ₹5L – ₹6Cr (incl. unlimited option) cover. Entry age: 18 yrs and above (adult).", coverage: "Unlimited sum insured option removes the ceiling on lifetime in-patient, day-care and AYUSH claims. 100% cumulative bonus can grow the sum insured without an upper limit if no claim is made in the previous year.", benefits: "Unlimited restoration. Covers hospitalisation from as little as 2 hours, wider than the standard 24-hour minimum.", claims: "Claim settlement ratio ~88–92%*. Network: 10,000+.", audience: "Buyers with a lifestyle condition (diabetes, hypertension, obesity) seeking fast coverage, or anyone wanting a genuinely uncapped sum insured.", exclusions: "Waiting period / PED: Reduced to 30 days for select lifestyle conditions. Room rent: No capping.", recommendations: "A highly customisable plan with a genuinely unlimited sum-insured option. Flexibility comes with complexity — the add-on list is extensive, so read the specific variant's wording carefully." }),
    mk("Health", "Tata AIG General Insurance", "Medicare Premier", 15000, 1000000, 1,
      { financial: "Premium ≈ ₹15,000/yr for ₹5L – ₹3Cr cover. Entry age: 91 days (children) – 65+ (parents/parents-in-law).", coverage: "Maternity and OPD benefits are built into the base plan rather than sold as separate riders. Global emergency cover extends treatment outside India for sudden medical emergencies.", benefits: "Automatic restoration on exhaustion. Policy terms of 1, 2 or 3 years with lifetime renewability.", claims: "Claim settlement ratio ~92–97%*. Network: 8,000+.", audience: "Families who want maternity, OPD and global cover bundled in from day one, without shopping for add-ons.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: No capping.", recommendations: "A feature-complete plan that bundles maternity, OPD and global cover without needing add-ons. Network of ~8,000 hospitals is smaller than some standalone insurers — worth checking cashless availability in your city." }),
    mk("Health", "Aditya Birla Health Insurance", "Activ One Max", 14500, 1000000, 1,
      { financial: "Premium ≈ ₹14,500/yr for ₹5L – ₹3Cr cover. Entry age: 18–65 yrs (adult); children from 90 days.", coverage: "HealthReturns program can earn back up to 100% of the renewal premium through tracked fitness activity ('Activ Day'). Built-in cover for consumables and non-medical hospitalisation items.", benefits: "Automatic restoration on exhaustion. Access to gyms, yoga centres, nutritionists and wellness coaches through the insurer's health ecosystem.", claims: "Claim settlement ratio ~93%*. Network: 13,000+.", audience: "Fitness-conscious buyers who will actually use step-tracking and wellness challenges to earn meaningful renewal discounts.", exclusions: "Waiting period / PED: 36 months (standard); VYTL variant offers day-1 chronic disease cover. Room rent: No capping on higher sum insured tiers.", recommendations: "A wellness-linked plan that pays you back for staying healthy. Real-world savings depend on consistent app engagement — the headline discount is a ceiling, not a guarantee." }),
    mk("Health", "Bajaj Allianz General Insurance", "Health Guard (Silver / Gold / Platinum)", 12000, 1000000, 1,
      { financial: "Premium ≈ ₹12,000/yr for ₹1.5L – ₹50L (varies by tier) cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Three tiers (Silver/Gold/Platinum) let buyers scale sum insured and features to budget. One of the lowest industry complaint volumes per 10,000 claims, according to recent IRDAI disclosures.", benefits: "Automatic restore benefit on higher tiers. Restore benefit reinstates the sum insured after it is exhausted, available on the higher tiers.", claims: "Claim settlement ratio ~95%*. Network: 18,400+.", audience: "Buyers who want a dependable, moderately priced floater and prioritise low complaint rates over maximum feature depth.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped on lower tiers; higher tiers offer no capping.", recommendations: "A tiered, well-priced floater backed by one of the industry's lowest complaint rates. Entry-tier (Silver) plans carry more restrictions on room rent and sub-limits than the Platinum tier — compare tiers carefully before buying." }),
    mk("Health", "New India Assurance", "Floater Mediclaim Policy", 9500, 1000000, 1,
      { financial: "Premium ≈ ₹9,500/yr for ₹2L – ₹15L cover. Entry age: 18–65 yrs (adult); children 3 months–25 yrs.", coverage: "Covers 2 to 6 family members under a single floater sum insured. Cumulative bonus adds 25% of sum insured per claim-free year, up to a maximum of 50%.", benefits: "Not a standard feature. Daily hospital cash benefit and ambulance charges are built into the base policy.", claims: "Claim settlement ratio ~90%*. Network: 2,000–3,700+.", audience: "Budget-conscious buyers who want a straightforward, government-backed policy and don't need a very high sum insured.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped at 1% of sum insured per day.", recommendations: "A no-frills, government-backed floater at an accessible price point. Smaller cashless hospital network than private insurers, and room rent / disease sub-limits are more restrictive than newer private plans." }),
    mk("Health", "National Insurance Company", "National Parivar Mediclaim Plus", 9000, 1000000, 1,
      { financial: "Premium ≈ ₹9,000/yr for ₹4L – ₹15L (varies by zone) cover. Entry age: 18–65 yrs.", coverage: "Covers 140+ day-care procedures that don't require a 24-hour hospital stay. Air ambulance cover is included for emergency transport.", benefits: "Not a standard feature. No co-payment clause on the standard policy.", claims: "Claim settlement ratio ~93%*. Network: 3,200+.", audience: "Families wanting a PSU-backed floater with maternity and day-care coverage at a modest premium.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped at 1% of sum insured per day.", recommendations: "A family-first PSU floater with 140+ day-care procedures and optional critical-illness cover. Like most PSU plans, room rent and select procedures carry sub-limits — check the latest prospectus for your sum insured band." }),
    mk("Health", "Oriental Insurance Company", "Happy Family Floater (Silver / Gold / Diamond / Platinum)", 8500, 1000000, 1,
      { financial: "Premium ≈ ₹8,500/yr for ₹1L – ₹50L cover. Entry age: 18–65 yrs (adult); dependent children covered.", coverage: "Four tiers (Silver/Gold/Diamond/Platinum) span a wide sum-insured range from ₹1 lakh to ₹50 lakh. Optional geographical extension covers treatment while travelling in SAARC countries (Bangladesh, Bhutan, Maldives, Nepal, Pakistan, Sri Lanka, Afghanistan).", benefits: "Automatic restoration on select tiers. Automatic restoration of sum insured is available on the higher tiers.", claims: "Claim settlement ratio ~85–90%*. Network: ~2,500+.", audience: "Buyers wanting a low-cost entry-level policy with room to upgrade tiers as their needs grow, or with occasional SAARC-region travel.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped, varies by tier.", recommendations: "A tiered PSU floater with optional SAARC-region travel cover. Feature depth is noticeably lighter on the Silver/Gold tiers — the SAARC travel benefit is a genuine point of difference from most private plans." }),
    mk("Health", "Manipal Cigna Health Insurance", "ProHealth Prime", 15000, 1000000, 1,
      { financial: "Premium ≈ ₹15,000/yr for ₹5L – ₹3Cr cover. Entry age: 91 days and above.", coverage: "Unlimited automatic recharge restores the sum insured any number of times per year. 100% cumulative bonus with no upper cap for every claim-free year on select variants.", benefits: "Unlimited automatic recharge. Worldwide emergency hospitalisation cover on higher variants.", claims: "Claim settlement ratio ~89%*. Network: 8,500+.", audience: "Buyers who want frequent, low-friction access to teleconsultations alongside strong restoration benefits.", exclusions: "Waiting period / PED: 36 months (reducible via add-on). Room rent: No capping (higher variants).", recommendations: "Unlimited automatic recharge with worldwide emergency cover and unlimited teleconsultations. Entry-level ProHealth variants trade away some of the unlimited features found only on Prime/Preferred tiers." }),
    mk("Health", "Reliance General Insurance", "Health Infinity", 14000, 1000000, 1,
      { financial: "Premium ≈ ₹14,000/yr for ₹3L – ₹3Cr cover. Entry age: 91 days – 65 yrs (renewable for life).", coverage: "Booster benefit multiplies the base sum insured by up to 10x over consecutive claim-free years. No room rent capping across variants.", benefits: "Automatic restore plus multiplier benefit. Automatic restoration of sum insured once exhausted in a policy year.", claims: "Claim settlement ratio ~91%*. Network: 9,000+.", audience: "Long-term buyers chasing the largest possible effective cover growth from a modest starting sum insured.", exclusions: "Waiting period / PED: 36 months (standard); optional day-1 cover for select conditions. Room rent: No capping.", recommendations: "An 'infinite' multiplier plan that can grow cover up to 10x the base sum insured. The full 10x multiplier takes many consecutive claim-free years to reach — read the exact accrual schedule before buying." }),
    mk("Health", "Future Generali India Insurance", "Health Total", 12500, 1000000, 1,
      { financial: "Premium ≈ ₹12,500/yr for ₹3L – ₹50L cover. Entry age: 91 days – 65 yrs.", coverage: "Easy claim bonus adds 50% to the sum insured in the first claim-free year, up to 100% over time. AYUSH in-patient treatment covered up to the full sum insured.", benefits: "Automatic restore on top variant. Automatic restoration of sum insured available on the top (Elite) variant.", claims: "Claim settlement ratio ~88%*. Network: 7,500+.", audience: "Buyers wanting a dependable mid-market floater without needing the newest multiplier-style benefits.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped on base variant; no-cap on top variant.", recommendations: "A conventional, well-rounded family floater with a straightforward claims process. Base variant still carries room-rent and some disease sub-limits — the Elite variant removes most of these." }),
    mk("Health", "SBI General Insurance", "Arogya Premier", 11500, 1000000, 1,
      { financial: "Premium ≈ ₹11,500/yr for ₹5L – ₹1Cr cover. Entry age: 18–65 yrs (adult); dependent children from 91 days.", coverage: "No-claim bonus booster increases the sum insured by 50% for the first claim-free year, growing further after. Automatic restoration of the full sum insured once exhausted in a policy year.", benefits: "Automatic restoration on exhaustion. Covers organ donor expenses and domiciliary hospitalisation as standard.", claims: "Claim settlement ratio ~90%*. Network: 9,000+.", audience: "Existing SBI banking customers wanting a bundled, no-frills floater with solid restoration benefits.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: No capping.", recommendations: "A bank-backed floater with a straightforward no-claim bonus booster. Smaller add-on catalogue than the larger private insurers — fewer ways to customise beyond the base plan." }),
    mk("Health", "Universal Sompo General Insurance", "Complete HealthCare", 10500, 1000000, 1,
      { financial: "Premium ≈ ₹10,500/yr for ₹1L – ₹25L cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Modular structure lets buyers add hospital cash, OPD and critical-illness riders individually. Cumulative bonus of 10% per claim-free year, up to 50%.", benefits: "Available as an add-on. Restoration of sum insured available as an optional add-on rather than built in.", claims: "Claim settlement ratio ~86%*. Network: 5,000+.", audience: "Price-sensitive buyers who want to build up cover feature-by-feature rather than pay for a fully loaded plan.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped at 1–2% of sum insured per day.", recommendations: "A modular floater with hospital cash and OPD add-ons for budget-conscious buyers. Smaller hospital network than the market leaders — check cashless availability in your city before buying." }),
    mk("Health", "IFFCO Tokio General Insurance", "Health Protector Plus", 10000, 1000000, 1,
      { financial: "Premium ≈ ₹10,000/yr for ₹1L – ₹20L cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Leverages IFFCO's cooperative distribution network, giving stronger reach in semi-urban and rural India. Cumulative bonus for claim-free years, capped at 50% of the base sum insured.", benefits: "Not a standard feature. Daily cash allowance rider available for extended hospital stays.", claims: "Claim settlement ratio ~87%*. Network: 6,000+.", audience: "Buyers in semi-urban or rural locations who value network reach in smaller towns over metro-heavy hospital lists.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped at 1% of sum insured per day.", recommendations: "Strong semi-urban and rural network reach alongside standard floater benefits. Feature set is more basic than metro-focused private insurers — no automatic restoration benefit." }),
    mk("Health", "Cholamandalam MS General Insurance", "Health Insurance – Prime", 11500, 1000000, 1,
      { financial: "Premium ≈ ₹11,500/yr for ₹2L – ₹1Cr cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Flexible sum insured bands from ₹2 lakh up to ₹1 crore under one product line. Automatic restoration of sum insured once exhausted in a policy year.", benefits: "Automatic restore on exhaustion. AYUSH and modern treatment (robotic surgery, immunotherapy) covered as standard on higher variants.", claims: "Claim settlement ratio ~89%*. Network: 8,000+.", audience: "Buyers who want their pre-existing-disease waiting period to shrink automatically over time.", exclusions: "Waiting period / PED: 36 months, reduces by a year at each claim-free renewal. Room rent: No capping on higher variants.", recommendations: "A flexible-sum-insured floater with a restore benefit and shrinking PED wait. Lower sum-insured bands still carry room-rent capping — check the exact variant before assuming no-cap cover." }),
    mk("Health", "Royal Sundaram General Insurance", "Lifeline Supreme", 13000, 1000000, 1,
      { financial: "Premium ≈ ₹13,000/yr for ₹5L – ₹2Cr cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Unlimited automatic restoration of sum insured for related or unrelated illnesses. Free annual health check-up for every insured adult, independent of claims made.", benefits: "Unlimited automatic restore. Air ambulance and organ donor expenses covered as standard.", claims: "Claim settlement ratio ~90%*. Network: 9,500+.", audience: "Buyers who prioritise a long operating history and unlimited restore over the newest multiplier gimmicks.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: No capping.", recommendations: "A long-standing private floater with unlimited automatic restore and annual check-ups. Add-on catalogue is narrower than the largest private insurers, but the base plan is already fairly complete." }),
    mk("Health", "Liberty General Insurance", "Health Connect Care", 9500, 1000000, 1,
      { financial: "Premium ≈ ₹9,500/yr for ₹1L – ₹25L cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Bundled tele-OPD consultations included at no extra cost on most variants. Cumulative bonus for claim-free years, capped at 50%.", benefits: "Available on higher bands. Restoration benefit available once sum insured crosses a higher band.", claims: "Claim settlement ratio ~84%*. Network: 4,500+.", audience: "First-time buyers on a tight budget who'll make use of the bundled tele-OPD consultations.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: Capped on lower sum insured bands.", recommendations: "A budget-friendly floater with bundled tele-OPD consultations. Smaller hospital network and more sub-limits than larger insurers at the lower sum-insured bands." }),
    mk("Health", "Go Digit General Insurance", "Health Care Plus", 13500, 1000000, 1,
      { financial: "Premium ≈ ₹13,500/yr for ₹5L – ₹1Cr cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Entirely app-based policy issuance, endorsements and claim tracking, with minimal paperwork. Unlimited automatic restoration of sum insured for related or unrelated claims.", benefits: "Unlimited automatic restore. 100% bill cover for admissible in-patient expenses, without item-wise capping.", claims: "Claim settlement ratio ~92%*. Network: 11,000+.", audience: "Digitally comfortable buyers who value a fast, app-driven claims experience over branch/agent servicing.", exclusions: "Waiting period / PED: 36 months (standard); reduced for select conditions on top variant. Room rent: No capping.", recommendations: "A fully digital, app-first floater built around fast, paperless claims. Being a newer insurer, its long-run claims track record is shorter than the century-old PSU insurers." }),
    mk("Health", "Kotak Mahindra General Insurance", "Health Shield", 14500, 1000000, 1,
      { financial: "Premium ≈ ₹14,500/yr for ₹3L – ₹2Cr (with top-up) cover. Entry age: 18–65 yrs (adult); children from 91 days.", coverage: "Base plan can be paired with a Kotak super top-up for a much higher effective sum insured at lower marginal cost. Wellness cashback rewards tracked healthy activity toward the renewal premium.", benefits: "Automatic restore on higher variants. AYUSH and modern treatment covered as standard.", claims: "Claim settlement ratio ~88%*. Network: 7,000+.", audience: "Existing Kotak banking customers who want to layer a top-up for high cover at a manageable premium.", exclusions: "Waiting period / PED: 36 months (standard). Room rent: No capping on higher variants.", recommendations: "A flexible base-plus-top-up structure with wellness cashback. The lowest-tier base plan needs a top-up to reach genuinely high sum insured levels — factor that combined premium in." }),
    mk("Health", "Government of India — National Health Authority", "Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (PM-JAY)", 0, 500000, 1,
      { financial: "Premium ≈ ₹0/yr for ₹5L per family/year; +₹5L top-up for 70+ seniors cover. Entry age: No age limit; family-based eligibility.", coverage: "Provides cashless, paperless secondary and tertiary hospitalisation cover of ₹5 lakh per family per year. Eligibility for the core scheme is based on deprivation criteria from the Socio-Economic Caste Census (SECC) 2011, plus state-specific ration-card databases in some states.", benefits: "N/A. Pre-existing conditions such as diabetes, hypertension and heart disease are covered from the very first day, with no waiting period.", claims: "Claim settlement ratio N/A (government scheme). Network: 36,000+ empanelled hospitals.", audience: "Economically vulnerable families identified under SECC 2011, and separately, any Indian citizen aged 70 or above — regardless of income.", exclusions: "Waiting period / PED: None — pre-existing diseases covered from day one. Room rent: Not applicable — cashless at government package rates.", recommendations: "The world's largest government-funded health cover — free for eligible families, and now for every senior citizen 70+. This is a welfare scheme, not a purchasable commercial policy — eligibility must be checked at pmjay.gov.in or via the Ayushman App; those already on CGHS/ECHS must choose one scheme, not both." }),
    mk("Health", "Government of India — Ministry of Health & Family Welfare", "Central Government Health Scheme (CGHS)", 0, 500000, 1,
      { financial: "Premium ≈ ₹0/yr for No fixed sum insured — treatment at approved package rates cover. Entry age: Serving/retired central govt employees and eligible dependents.", coverage: "Covers outpatient, inpatient and specialist treatment for serving and retired central government employees and their dependents. Cashless treatment at CGHS wellness centres and empanelled private hospitals in covered cities.", benefits: "N/A. Covers AYUSH systems of medicine alongside allopathic treatment.", claims: "Claim settlement ratio N/A (government scheme). Network: CGHS wellness centres + empanelled private hospitals.", audience: "Serving and retired central government employees and their eligible dependents, in cities where CGHS operates.", exclusions: "Waiting period / PED: None for existing employees/pensioners. Room rent: N/A — package-rate based.", recommendations: "Comprehensive cashless healthcare for serving and retired central government employees and their dependents. Available only in CGHS-covered cities; those on CGHS generally cannot simultaneously claim under PM-JAY. Confirm current contribution slabs with your department." }),
    mk("Health", "Employees' State Insurance Corporation (ESIC)", "Employees' State Insurance Scheme", 0, 500000, 1,
      { financial: "Premium ≈ ₹0/yr for No fixed sum insured — full medical care while covered cover. Entry age: Employees earning up to the statutory wage ceiling, and dependents.", coverage: "Funded by a small employer + employee contribution on monthly wages, with no separate premium paid by the worker. Covers medical treatment for the insured worker and dependent family members at ESIC hospitals and dispensaries.", benefits: "N/A. Dependents' benefit provides a monthly payment to family members in the event of the insured person's death due to employment injury.", claims: "Claim settlement ratio N/A (statutory scheme). Network: ESIC hospitals & dispensaries + empanelled hospitals.", audience: "Organised-sector employees earning below the statutory wage ceiling, and their dependent family members.", exclusions: "Waiting period / PED: None once contribution conditions are met. Room rent: N/A.", recommendations: "Statutory medical, cash and disability cover for organised-sector workers below the wage threshold. Coverage is tied to active employment and contribution status — it lapses if contributions stop; not a substitute for a portable personal policy after a job change." }),
    /* ---- Term ---- */
    mk("Term", "LIC of India", "LIC Tech Term", 13000, 10000000, 30,
      { financial: "Premium ≈ ₹13,000/yr for ₹50L – ₹5Cr+ cover. Entry age: 18 – 65 yrs.", coverage: "Pure life cover with no maturity benefit, keeping premiums significantly lower than investment-linked plans. Lower premium slabs for non-smokers and for sums assured above ₹75 lakh.", benefits: "Lump sum, or lump sum + income options. Optional accidental death benefit rider available for additional lump sum payout.", claims: "Claim settlement ratio 98.5%*. Network: 40+ yrs (up to age 80 maturity).", audience: "Budget-conscious buyers who want maximum life cover per rupee of premium, without any investment component.", exclusions: "Waiting period / PED: None — only a 12-month suicide exclusion clause. Room rent: Accidental death benefit rider available.", recommendations: "A pure protection plan from India's largest life insurer, priced lower for non-smokers and online buyers. Illustrative only — actual premium depends on smoking status, medical history, occupation and sum assured; final rate is confirmed after underwriting." }),
    mk("Term", "HDFC Life", "Click 2 Protect Super (Return of Premium)", 21500, 10000000, 30,
      { financial: "Premium ≈ ₹21,500/yr for ₹50L – ₹10Cr cover. Entry age: 18 – 65 yrs.", coverage: "Return of premium option refunds total base premiums paid (excluding taxes and rider premium) at maturity. Multiple payout structures — lump sum, monthly income, or a mix of both for the nominee.", benefits: "100% of premiums paid returned on maturity if no claim. Critical illness rider covers 30+ major illnesses with a lump-sum payout on diagnosis.", claims: "Claim settlement ratio 99.4%*. Network: 10 – 40 yrs terms, up to age 85 maturity.", audience: "Clients who want life cover but are reluctant to \"lose\" premiums if they outlive the policy term.", exclusions: "Waiting period / PED: 90-day initial waiting period on critical illness rider only. Room rent: Critical illness & accidental disability riders available.", recommendations: "Term cover that returns all premiums paid if the life insured survives the policy term. Return-of-premium plans cost noticeably more than pure term plans for the same cover — compare against investing the difference separately." }),
    mk("Term", "ICICI Prudential Life", "iProtect Smart", 14500, 10000000, 30,
      { financial: "Premium ≈ ₹14,500/yr for ₹50L – ₹25Cr cover. Entry age: 18 – 65 yrs.", coverage: "In-built coverage for 34 critical illnesses, accidental death and disability, and terminal illness, without separate riders. Special premiums for women and non-tobacco users, plus a discount for salaried professionals.", benefits: "Lump sum with optional monthly income payout. Whole-life cover option available up to age 99, useful for estate and legacy planning conversations.", claims: "Claim settlement ratio 99.2%*. Network: 5 – 40 yrs terms, up to age 99 maturity.", audience: "Clients wanting a single comprehensive protection plan instead of stacking multiple standalone riders.", exclusions: "Waiting period / PED: 90 days for critical illness claims, none for base life cover. Room rent: In-built critical illness, disability & terminal illness cover.", recommendations: "Comprehensive term plan bundling life, critical illness and disability cover under one policy. Illustrative only — built-in benefits raise the base premium versus a pure term plan; compare total cost against term + separate riders." }),
    /* ---- Motor ---- */
    mk("Motor", "ACKO General Insurance", "Comprehensive Car Insurance", 10800, 800000, 1,
      { financial: "Premium ≈ ₹10,800/yr for IDV as per vehicle's current market value cover. Entry age: New cars, and used cars up to 15 yrs old.", coverage: "Covers own-damage to the insured vehicle plus mandatory third-party liability in a single comprehensive policy. Zero depreciation add-on ensures full claim value on replaced parts without deduction for wear and tear.", benefits: "Up to 50% NCB, with NCB protection add-on. No-claim bonus protection add-on preserves the accumulated NCB discount even after one claim in the year.", claims: "Claim settlement ratio 96%*. Network: 1,500+ cashless garages.", audience: "Car owners who want fast digital claims and are comfortable buying and managing the policy entirely online.", exclusions: "Waiting period / PED: 1 yr own-damage + 3 yr third-party (new car); OD renewed annually thereafter. Room rent: Own-damage + mandatory third-party liability.", recommendations: "Digital-first comprehensive cover with fully online claims and instant policy issuance. Illustrative only — actual premium depends on vehicle make/model, city (RTO zone), age, add-ons chosen and claim history." }),
    mk("Motor", "Bajaj Allianz General Insurance", "Standalone Third-Party Liability Cover", 2450, 0, 1,
      { financial: "Premium ≈ ₹2,450/yr for Unlimited third-party liability for death/injury; ₹7.5L for property damage (as per IRDAI tariff) cover. Entry age: Any registered vehicle owner.", coverage: "Meets the legal minimum insurance requirement under the Motor Vehicles Act to drive on Indian roads. Premium rates are set annually by IRDAI, so pricing is largely standardised across insurers for the same vehicle class.", benefits: "Not applicable (no own-damage claims to trigger NCB). Long-term (multi-year) third-party cover is mandatory for new cars and two-wheelers at the time of first registration.", claims: "Claim settlement ratio 94%*. Network: Not applicable — third-party claims are handled via the insurer directly, not cashless garages.", audience: "Budget-conscious owners of older vehicles where the vehicle's value no longer justifies comprehensive own-damage premiums.", exclusions: "Waiting period / PED: 1 yr (new car) / 5 yr (new two-wheeler) mandated long-term third-party cover. Room rent: No own-damage cover — third-party liability only.", recommendations: "The statutory minimum cover for driving legally in India, at the lowest possible premium. Third-party premiums are tariff-driven and largely fixed by IRDAI for the vehicle's engine/cubic-capacity class, so they vary little between insurers." }),
    mk("Motor", "Go Digit General Insurance", "Two-Wheeler Comprehensive Insurance", 3200, 90000, 1,
      { financial: "Premium ≈ ₹3,200/yr for IDV as per vehicle's current market value cover. Entry age: New two-wheelers, and used up to 15 yrs old.", coverage: "Covers accidental damage, fire, theft and natural calamities to the insured two-wheeler alongside third-party liability. Return-to-invoice add-on pays the original invoice value instead of depreciated IDV in case of total loss or theft.", benefits: "Up to 50% NCB, transferable across insurers on renewal. 24x7 roadside assistance add-on covers towing, flat tyre, minor repairs and battery jump-start.", claims: "Claim settlement ratio 97%*. Network: 3,700+ cashless garages.", audience: "Two-wheeler owners who want quick, largely paperless claims and the option to add specific protections as riders.", exclusions: "Waiting period / PED: 1 yr own-damage + 5 yr third-party (new two-wheeler). Room rent: Own-damage + mandatory third-party liability.", recommendations: "Comprehensive two-wheeler cover with quick photo-based claims and flexible add-ons. Illustrative only — actual premium depends on the two-wheeler's cubic capacity, city, age, add-ons and claim history." }),
    /* ---- Travel ---- */
    mk("Travel", "Tata AIG General Insurance", "Travel Guard (Single Trip — International)", 1450, 5000000, 1,
      { financial: "Premium ≈ ₹1,450/yr for $50,000 – $500,000 cover. Entry age: 3 months – 70 yrs (higher age needs medical declaration).", coverage: "Covers emergency medical treatment, hospitalisation and evacuation anywhere on the covered trip. Trip cancellation and interruption cover reimburses non-refundable costs for covered reasons like illness or visa denial.", benefits: "24x7 emergency medical evacuation & repatriation assistance. Cashless hospitalisation available at network hospitals in most major international destinations.", claims: "Claim settlement ratio 97%*. Network: Cashless network across 190+ countries.", audience: "Individuals and families travelling abroad once, wanting comprehensive medical and trip-protection cover for that specific trip.", exclusions: "Waiting period / PED: Pre-existing conditions covered only for emergency life-threatening situations, sub-limits apply. Room rent: Trip cancellation, interruption, delay & baggage loss cover.", recommendations: "Single-trip international travel cover with cashless hospitalisation and trip-protection benefits. Illustrative only — actual premium depends on destination, trip duration, traveller age and sum insured chosen." }),
    mk("Travel", "ICICI Lombard General Insurance", "Annual Multi-Trip Travel Insurance", 5200, 8000000, 1,
      { financial: "Premium ≈ ₹5,200/yr for $100,000 – $500,000 per trip cover. Entry age: 18 – 70 yrs.", coverage: "Single annual premium covers an unlimited number of international trips, each up to the policy's per-trip duration limit. Works out cheaper than buying single-trip cover separately for travellers making 3 or more international trips a year.", benefits: "Emergency medical evacuation & repatriation included on every trip. Emergency medical cover, evacuation and repatriation included for each trip without needing to re-declare travel plans.", claims: "Claim settlement ratio 96%*. Network: Cashless network worldwide (excluding sanctioned countries).", audience: "Frequent international travellers — business travellers, consultants, or families with recurring overseas trips.", exclusions: "Waiting period / PED: Pre-existing conditions excluded except emergency stabilisation. Room rent: Covers each trip up to a maximum duration (typically 30–45 days) within the policy year.", recommendations: "One policy covering unlimited international trips over a year, for frequent travellers. Illustrative only — actual premium depends on age, destinations covered, sum insured and maximum per-trip duration chosen." }),
    mk("Travel", "Bajaj Allianz General Insurance", "Student Travel Insurance", 12500, 4000000, 2,
      { financial: "Premium ≈ ₹12,500/yr for $50,000 – $250,000 cover. Entry age: 16 – 35 yrs (student visa holders).", coverage: "Long policy durations (up to 1–2 years) matching typical study-abroad program lengths, renewable if needed. Sponsor protection cover pays remaining tuition fees if the student's sponsor passes away during the policy period.", benefits: "Compassionate visit & bedside companion benefit for family in emergencies. Compassionate visit cover pays for a family member's travel if the student is hospitalised for an extended period.", claims: "Claim settlement ratio 95%*. Network: Cashless network in study destination country.", audience: "Students heading abroad for a semester-long or multi-year study program who need visa-compliant, long-duration cover.", exclusions: "Waiting period / PED: Pre-existing conditions generally excluded; mental health cover sub-limited. Room rent: Sponsor protection, study interruption & tuition-fee cover included.", recommendations: "Long-duration cover built for students studying abroad, often meeting university/visa insurance mandates. Illustrative only — actual premium depends on destination country, program duration, age and sum insured chosen." }),
  ];
}
/* ---------------------------------------------------------------- */
/* App                                                                */
/* ---------------------------------------------------------------- */

export default function App() {
  const [ready, setReady] = useState(false);
  const [users] = useState(SEED_USERS);
  const [schemes, setSchemes] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [selectedCoverage, setSelectedCoverage] = useState(1000000);

  const displaySchemes = useMemo(() => {
    return schemes.map(s => {
      if (s.category === 'Health' || s.category === 'Term' || s.category === 'Travel') {
        const ratio = selectedCoverage / s.sumInsured;
        return { ...s, sumInsured: selectedCoverage, premium: Math.round(s.premium * ratio) };
      }
      return s;
    });
  }, [schemes, selectedCoverage]);

  // navigation
  const [mode, setMode] = useState("browse"); // browse | detail | compare | proposal | myProposals | proposalDetail | dashboard | schemes
  const [category, setCategory] = useState("Health");
  const [activeSchemeId, setActiveSchemeId] = useState(null);
  const [activeProposalId, setActiveProposalId] = useState(null);

  // working cart (cross-category, mirrors compareIds in the reference app)
  const [compareIds, setCompareIds] = useState([]);
  const [favIds, setFavIds] = useState([]);
  const [notes, setNotes] = useState({});
  const [client, setClient] = useState({ name: "", mobile: "", email: "" });

  // sidebar controls
  const [search, setSearch] = useState("");
  const [filterInsurer, setFilterInsurer] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const [toast, setToast] = useState(null);
  const flash = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); }, []);

  useEffect(() => {
    (async () => {
      try {
        let schemesRes;
        try { schemesRes = await window.storage.get("schemes", true); } catch { schemesRes = null; }
        if (schemesRes && schemesRes.value) setSchemes(JSON.parse(schemesRes.value));
        else {
          const seeded = seedSchemes();
          setSchemes(seeded);
          await window.storage.set("schemes", JSON.stringify(seeded), true);
        }
      } catch (e) { console.error(e); setSchemes(seedSchemes()); }

      try {
        let propRes;
        try { propRes = await window.storage.get("proposals", true); } catch { propRes = null; }
        if (propRes && propRes.value) setProposals(JSON.parse(propRes.value));
      } catch (e) { console.error(e); }

      setReady(true);
    })();
  }, []);

  const persistSchemes = useCallback(async (next) => {
    setSchemes(next);
    try { await window.storage.set("schemes", JSON.stringify(next), true); } catch (e) { console.error(e); }
  }, []);

  const persistProposals = useCallback(async (next) => {
    setProposals(next);
    try { await window.storage.set("proposals", JSON.stringify(next), true); } catch (e) { console.error(e); }
  }, []);

  const goBrowse = (cat) => { if (cat) setCategory(cat); setMode("browse"); };
  const openScheme = (id) => { setActiveSchemeId(id); setMode("detail"); };
  const openProposalRecord = (id) => { setActiveProposalId(id); setMode("proposalDetail"); };

  const toggleCompare = (id) => setCompareIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  const toggleFav = (id) => setFavIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);

  if (!ready) {
    return (
      <div className="fis-root min-h-[400px] flex items-center justify-center rounded-xl" style={{ background: C.bg }}>
        <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />
        <div className="text-sm" style={{ color: C.accent800 }}>Loading workspace…</div>
      </div>
    );
  }

  if (!currentUser) return <LoginScreen users={users} onLogin={setCurrentUser} />;

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="fis-root min-h-[680px] rounded-xl overflow-hidden flex flex-col" style={{ background: C.bg, color: C.text }}>
      <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />
      <TopBar user={currentUser} mode={mode} setMode={setMode} compareCount={compareIds.length}
        onLogout={() => setCurrentUser(null)} isAdmin={isAdmin} />
      <CategoryBar active={category} onChange={(c) => { setCategory(c); setActiveSchemeId(null); if (mode === "detail") setMode("browse"); }} />

      {toast && (
        <div className="mx-5 mt-3 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2" style={{ background: C.surface, border: `1px solid ${C.accent600}`, color: C.text, boxShadow: "0 1px 0 rgba(27,34,48,0.06), 0 6px 18px rgba(27,34,48,0.12)" }}>
          <Check size={16} style={{ color: C.green600 }} /> {toast}
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        <Sidebar
          category={category} schemes={displaySchemes}
          search={search} setSearch={setSearch}
          selectedCoverage={selectedCoverage} setSelectedCoverage={setSelectedCoverage}
          filterInsurer={filterInsurer} setFilterInsurer={setFilterInsurer}
          sortBy={sortBy} setSortBy={setSortBy}
          favouritesOnly={favouritesOnly} setFavouritesOnly={setFavouritesOnly}
          favIds={favIds} onOpenScheme={openScheme}
        />
        <main className="flex-1 min-w-0 p-6 pb-16 overflow-y-auto fis-scroll" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {mode === "browse" && (
            <BrowseView
              category={category} schemes={displaySchemes} search={search} filterInsurer={filterInsurer}
              sortBy={sortBy} favouritesOnly={favouritesOnly} favIds={favIds} compareIds={compareIds}
              onOpen={openScheme} onToggleFav={toggleFav} onToggleCompare={toggleCompare}
              isAdmin={isAdmin} onAddScheme={() => setMode("schemes")}
            />
          )}
          {mode === "detail" && (
            <SchemeDetailView
              scheme={displaySchemes.find((s) => s.id === activeSchemeId)}
              isFav={favIds.includes(activeSchemeId)} isCmp={compareIds.includes(activeSchemeId)}
              note={notes[activeSchemeId] || ""}
              onNote={(v) => setNotes((n) => ({ ...n, [activeSchemeId]: v }))}
              onToggleFav={() => toggleFav(activeSchemeId)}
              onToggleCompare={() => toggleCompare(activeSchemeId)}
              onBack={() => setMode("browse")}
              onGoCompare={() => setMode("compare")}
              isAdmin={isAdmin}
              onEdit={() => setMode("schemes")}
            />
          )}
          {mode === "compare" && (
            <CompareView
              category={category} schemes={displaySchemes} compareIds={compareIds}
              onRemove={toggleCompare} onGoBrowse={() => setMode("browse")}
              onGoProposal={() => setMode("proposal")}
            />
          )}
          {mode === "proposal" && (
            <ProposalBuilderView
              schemes={displaySchemes} compareIds={compareIds} notes={notes}
              setNotes={setNotes} client={client} setClient={setClient}
              onGoBrowse={() => setMode("browse")}
              onSave={async (customPremiums) => {
                if (!client.name.trim() || !client.mobile.trim()) { flash("Add the client's name and mobile number first."); return; }
                const items = compareIds.map((id) => {
                  const s = displaySchemes.find((sc) => sc.id === id);
                  return { id: uid(), category: s.category, schemeId: s.id, schemeName: `${s.insurer} — ${s.plan}`, premium: customPremiums[s.id] || s.premium, includedInReport: true };
                });
                const now = new Date().toISOString();
                const proposal = {
                  id: uid(), adviserId: currentUser.id, clientName: client.name.trim(), clientMobile: client.mobile.trim(), clientEmail: client.email.trim(),
                  status: "Created", createdAt: now, updatedAt: now, items,
                  statusLog: [{ oldStatus: null, newStatus: "Created", changedBy: currentUser.name, changedAt: now }],
                };
                await persistProposals([proposal, ...proposals]);
                setCompareIds([]); setClient({ name: "", mobile: "", email: "" });
                flash("Proposal saved.");
                setMode("myProposals");
              }}
            />
          )}
          {mode === "myProposals" && (
            <MyProposalsView
              user={currentUser} proposals={proposals} users={users}
              onOpen={openProposalRecord} isAdmin={isAdmin} flash={flash}
            />
          )}
          {mode === "proposalDetail" && activeProposalId && (
            <ProposalDetailView
              proposal={proposals.find((p) => p.id === activeProposalId)}
              schemes={displaySchemes} user={currentUser}
              onBack={() => setMode("myProposals")}
              onUpdate={async (updated) => { await persistProposals(proposals.map((p) => (p.id === updated.id ? updated : p))); }}
              flash={flash}
            />
          )}
          {mode === "dashboard" && isAdmin && (
            <DashboardView proposals={proposals} users={users} />
          )}
          {mode === "schemes" && isAdmin && (
            <SchemeManagementView category={category} schemes={schemes} onChange={persistSchemes} flash={flash} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Login — split brand / form panel                                  */
/* ---------------------------------------------------------------- */

function LoginScreen({ users, onLogin }) {
  return (
    <div
      className="fis-root min-h-[640px] rounded-xl flex items-stretch justify-center p-6"
      style={{ background: `radial-gradient(1200px 600px at 12% -10%, rgba(255,255,255,0.10), transparent 60%), linear-gradient(135deg, ${C.accent900} 0%, ${C.accent700} 48%, ${C.accent500} 100%)` }}
    >
      <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />
      <div className="flex w-full max-w-3xl m-auto rounded-2xl overflow-hidden" style={{ boxShadow: "0 24px 70px rgba(12,42,77,0.45)" }}>
        <div className="flex-[1.05] min-w-[260px] p-9 text-white flex flex-col justify-between relative overflow-hidden hidden sm:flex"
          style={{ background: `linear-gradient(155deg, ${C.accent800} 0%, ${C.accent600} 55%, ${C.green600} 130%)` }}>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <Shield size={22} />
              <span className="text-lg font-bold">Fortune Investment Services</span>
            </div>
            <div className="text-2xl font-semibold leading-snug mt-8">Browse, compare and propose insurance — all in one workspace.</div>
            <ul className="list-none mt-7 flex flex-col gap-3">
              {["Browse 34 real schemes across 4 categories", "Compare side by side, then build a client proposal", "Track every proposal from draft to purchase"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[13px] opacity-90">
                  <span className="w-[22px] h-[22px] flex-none rounded-full flex items-center justify-center text-[12px]" style={{ background: "rgba(255,255,255,0.16)" }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[11.5px] opacity-75 relative z-10">Fortune Investment Services Pvt Ltd</div>
        </div>

        <div className="flex-1 min-w-[280px] p-9 flex flex-col justify-center" style={{ background: C.surface }}>
          <div className="w-full max-w-[320px] mx-auto">
            <h3 className="text-xl font-semibold mb-1" style={{ color: C.text }}>Welcome back</h3>
            <p className="text-[12.5px] mb-5" style={{ color: C.textMuted }}>Choose your profile to continue — demo login, no password needed.</p>
            <div className="flex flex-col gap-1.5">
              {users.map((u) => (
                <button key={u.id} onClick={() => onLogin(u)} className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-left transition hover:brightness-95" style={{ border: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white" style={{ background: C.accent600 }}>
                      {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-medium" style={{ color: C.text }}>{u.name}</div>
                      <div className="text-[11px]" style={{ color: C.textMuted }}>{u.email}</div>
                    </div>
                  </div>
                  <Tag variant={u.role === "admin" ? "accent2" : "accent"}>{u.role}</Tag>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Top bar — brand + segmented mode switcher                         */
/* ---------------------------------------------------------------- */

function TopBar({ user, mode, setMode, compareCount, onLogout, isAdmin }) {
  const tabs = [
    ["browse", "Browse"],
    ["compare", `Compare${compareCount ? ` (${compareCount})` : ""}`],
    ["proposal", "Proposal"],
    ["myProposals", "My proposals"],
    ...(isAdmin ? [["dashboard", "Dashboard"]] : []),
  ];
  const activeFor = (key) => {
    if (key === "browse") return mode === "browse" || mode === "detail";
    if (key === "myProposals") return mode === "myProposals" || mode === "proposalDetail";
    return mode === key;
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3 flex-wrap" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mr-2">
        <Shield size={20} style={{ color: C.accent600 }} />
        <span className="flex flex-col items-start">
          <span className="text-[16px] font-bold leading-tight" style={{ color: C.accent700 }}>Fortune Investment Services</span>
          <span className="text-[10.5px] opacity-70 leading-tight" style={{ color: C.text }}>Insurance advisor suite</span>
        </span>
      </div>

      <div className="inline-flex rounded-lg overflow-hidden mr-auto" style={{ border: `1px solid ${C.border}` }}>
        {tabs.map(([key, label], idx) => (
          <button key={key} onClick={() => setMode(key)} className="px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap"
            style={{ background: activeFor(key) ? C.accent600 : "transparent", color: activeFor(key) ? "#fff" : C.text, borderLeft: idx > 0 ? `1px solid ${C.border}` : "none" }}>
            {label}
          </button>
        ))}
      </div>

      {isAdmin && <Btn variant="secondary" onClick={() => setMode("schemes")}><LayoutGrid size={14} /> Manage schemes</Btn>}
      <Tag variant={isAdmin ? "accent2" : "accent"}>{isAdmin ? "Admin" : "Adviser"}</Tag>
      <span className="text-[13px] font-medium" style={{ color: C.text }}>{user.name}</span>
      <button onClick={onLogout} title="Log out" className="p-2 rounded-lg hover:brightness-95" style={{ border: `1px solid ${C.border}` }}>
        <LogOut size={15} style={{ color: C.text }} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Dark pill category bar                                            */
/* ---------------------------------------------------------------- */

function CategoryBar({ active, onChange }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 flex-wrap" style={{ background: C.accent900 }}>
      <span className="text-[11.5px] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.65)" }}>Insurance type</span>
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICON[c];
          const isActive = active === c;
          return (
            <button key={c} onClick={() => onChange(c)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold"
              style={{ border: `1px solid ${isActive ? "#fff" : "rgba(255,255,255,0.18)"}`, background: isActive ? "#fff" : "transparent", color: isActive ? C.accent800 : "rgba(255,255,255,0.75)" }}>
              <Icon size={13} /> {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Sidebar — search, filters, scheme list                            */
/* ---------------------------------------------------------------- */

function Sidebar({ category, schemes, search, setSearch, filterInsurer, setFilterInsurer, sortBy, setSortBy, favouritesOnly, setFavouritesOnly, favIds, onOpenScheme, selectedCoverage, setSelectedCoverage }) {
  const insurers = useMemo(() => [...new Set(schemes.filter((s) => s.category === category).map((s) => s.insurer))].sort(), [schemes, category]);

  const list = useMemo(() => {
    let items = schemes.filter((s) => s.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((s) => s.insurer.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q));
    }
    if (filterInsurer !== "all") items = items.filter((s) => s.insurer === filterInsurer);
    if (favouritesOnly) items = items.filter((s) => favIds.includes(s.id));
    items = [...items].sort((a, b) => {
      if (sortBy === "premium") return a.premium - b.premium;
      if (sortBy === "sumInsured") return b.sumInsured - a.sumInsured;
      return a.insurer.localeCompare(b.insurer);
    });
    return items;
  }, [schemes, category, search, filterInsurer, favouritesOnly, favIds, sortBy]);

  return (
    <aside className="w-[280px] flex-none p-4 overflow-y-auto fis-scroll" style={{ borderRight: `1px solid ${C.border}`, maxHeight: "calc(100vh - 260px)" }}>
      <Field label="Search insurer or scheme">
        <div className="relative">
          <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: C.textMuted }} />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. Star Health, Optima…" style={{ paddingLeft: 30 }} />
        </div>
      </Field>

      <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: C.neutral500 }}>Filters</div>
      <div className="flex flex-col gap-2 mb-4">
        {['Health', 'Term', 'Travel'].includes(category) && (
          <Field label="Coverage (Sum Insured)">
            <Select value={selectedCoverage} onChange={(e) => setSelectedCoverage(Number(e.target.value))}>
              <option value="500000">₹5 Lakhs</option>
              <option value="1000000">₹10 Lakhs</option>
              <option value="2500000">₹25 Lakhs</option>
              <option value="5000000">₹50 Lakhs</option>
              <option value="10000000">₹1 Crore</option>
            </Select>
          </Field>
        )}
        <Field label="Insurer">
          <Select value={filterInsurer} onChange={(e) => setFilterInsurer(e.target.value)}>
            <option value="all">All insurers</option>
            {insurers.map((i) => <option key={i} value={i}>{i}</option>)}
          </Select>
        </Field>
        <Field label="Sort by">
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default order</option>
            <option value="premium">Est. premium (low to high)</option>
            <option value="sumInsured">Sum insured (high to low)</option>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: C.text }}>
          <input type="checkbox" checked={favouritesOnly} onChange={(e) => setFavouritesOnly(e.target.checked)} />
          Favourites only
        </label>
      </div>

      <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: C.neutral500 }}>{category} schemes</div>
      <div className="flex flex-col gap-0.5">
        {list.map((s) => (
          <button key={s.id} onClick={() => onOpenScheme(s.id)} className="w-full text-left rounded-lg px-2 py-1.5 hover:brightness-95" style={{ background: "transparent" }}>
            <div className="flex items-center gap-1.5">
              {favIds.includes(s.id) && <Star size={11} fill={C.amber700} style={{ color: C.amber700, flexShrink: 0 }} />}
              <span className="text-[13px] font-medium truncate" style={{ color: C.text }}>{s.plan}</span>
            </div>
            <div className="text-[11px] truncate" style={{ color: C.textMuted }}>{s.insurer}</div>
          </button>
        ))}
        {list.length === 0 && <p className="text-[12px] px-2" style={{ color: C.textMuted }}>No schemes match your search.</p>}
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------- */
/* Browse — card grid                                                */
/* ---------------------------------------------------------------- */

function SchemeCard({ s, isFav, isCmp, onOpen, onToggleFav, onToggleCompare }) {
  return (
    <Card className="p-4 cursor-pointer hover:brightness-[0.99]" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="flex justify-between items-start" onClick={onOpen}>
        <Tag variant="accent">{s.insurer.split(" ")[0]}</Tag>
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={onToggleFav} title="Favourite" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${isFav ? C.accent600 : C.border}`, background: isFav ? C.accent600 : "transparent" }}>
            <Star size={14} fill={isFav ? "#fff" : "none"} style={{ color: isFav ? "#fff" : C.textMuted }} />
          </button>
          <button onClick={onToggleCompare} title="Add to compare" className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold" style={{ border: `1px solid ${isCmp ? C.accent600 : C.border}`, background: isCmp ? C.accent600 : "transparent", color: isCmp ? "#fff" : C.textMuted }}>
            {isCmp ? <Check size={14} /> : "+"}
          </button>
        </div>
      </div>
      <div onClick={onOpen}>
        <div className="text-[15px] font-semibold mt-1" style={{ color: C.text }}>{s.plan}</div>
        <div className="text-[12px]" style={{ color: C.textMuted }}>{s.insurer}</div>
        <p className="text-[12.5px] mt-2 mb-0" style={{ color: C.textMuted, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {s.sections.recommendations}
        </p>
        <div className="h-px my-2.5" style={{ background: C.border }} />
        <div className="flex gap-4 text-[12px]">
          <div><b className="block text-[13px]" style={{ color: C.text }}>{money(s.sumInsured)}</b><span style={{ color: C.textMuted }}>Sum insured</span></div>
          <div><b className="block text-[13px]" style={{ color: C.text }}>{s.tenure}yr</b><span style={{ color: C.textMuted }}>Tenure</span></div>
          <div><b className="block text-[13px]" style={{ color: C.accent700 }}>{money(s.premium)}</b><span style={{ color: C.textMuted }}>Est. premium</span></div>
        </div>
      </div>
    </Card>
  );
}

function BrowseView({ category, schemes, search, filterInsurer, sortBy, favouritesOnly, favIds, compareIds, onOpen, onToggleFav, onToggleCompare, isAdmin, onAddScheme }) {
  const list = useMemo(() => {
    let items = schemes.filter((s) => s.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((s) => s.insurer.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q));
    }
    if (filterInsurer !== "all") items = items.filter((s) => s.insurer === filterInsurer);
    if (favouritesOnly) items = items.filter((s) => favIds.includes(s.id));
    items = [...items].sort((a, b) => {
      if (sortBy === "premium") return a.premium - b.premium;
      if (sortBy === "sumInsured") return b.sumInsured - a.sumInsured;
      return a.insurer.localeCompare(b.insurer);
    });
    return items;
  }, [schemes, category, search, filterInsurer, favouritesOnly, favIds, sortBy]);

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>Browse · {category}</span>
        <div className="flex items-center gap-2">
          {isAdmin && <Btn variant="secondary" onClick={onAddScheme}><Plus size={13} /> Add scheme</Btn>}
          <Tag variant="neutral">{list.length} {list.length === 1 ? "scheme" : "schemes"}</Tag>
        </div>
      </div>
      <div className="mb-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: C.text }}>{category} insurance schemes</h1>
        <p className="text-[13px]" style={{ color: C.textMuted }}>
          Real schemes from major Indian insurers, ready to compare and shortlist for your client.
        </p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {list.map((s) => (
          <SchemeCard
            key={s.id} s={s} isFav={favIds.includes(s.id)} isCmp={compareIds.includes(s.id)}
            onOpen={() => onOpen(s.id)} onToggleFav={() => onToggleFav(s.id)} onToggleCompare={() => onToggleCompare(s.id)}
          />
        ))}
        {list.length === 0 && <p className="text-[13px]" style={{ color: C.textMuted }}>No schemes match your search or filters.</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Scheme detail — full page                                         */
/* ---------------------------------------------------------------- */

function SchemeDetailView({ scheme, isFav, isCmp, note, onNote, onToggleFav, onToggleCompare, onBack, onGoCompare, isAdmin, onEdit }) {
  if (!scheme) return <p style={{ color: C.textMuted }}>Scheme not found.</p>;
  const s = scheme;

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>
          <button onClick={onBack} className="font-medium" style={{ color: C.accent700 }}>All schemes</button> / {s.plan}
        </span>
        <Tag variant="neutral">{s.category}</Tag>
      </div>

      <Card className="p-6 max-w-3xl">
        <Tag variant="accent">{s.insurer.split(" ")[0]}</Tag>
        <h2 className="text-2xl font-semibold mt-3 mb-1" style={{ color: C.text }}>{s.plan}</h2>
        <div className="text-[13px] mb-3" style={{ color: C.textMuted }}>{s.insurer}</div>
        <p className="italic text-[13.5px] max-w-xl" style={{ color: C.text }}>"{s.sections.recommendations}"</p>
        <div className="h-px my-4" style={{ background: C.border }} />

        <div className="grid grid-cols-3 gap-px mb-6 rounded-lg overflow-hidden" style={{ background: C.border, border: `1px solid ${C.border}` }}>
          {[["Sum insured", money(s.sumInsured)], ["Tenure", `${s.tenure} yr`], ["Est. premium", money(s.premium)]].map(([k, v]) => (
            <div key={k} className="p-3" style={{ background: C.surface }}>
              <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: C.neutral500 }}>{k}</div>
              <div className="text-[15px] font-semibold" style={{ color: k === "Est. premium" ? C.accent700 : C.text }}>{v}</div>
            </div>
          ))}
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.key} className="mb-4">
            <h4 className="text-[14px] font-semibold mb-1" style={{ color: C.text }}>{sec.label}</h4>
            <p className="text-[13.5px]" style={{ color: C.textMuted }}>{s.sections[sec.key]}</p>
          </div>
        ))}

        <Field label="Advisor notes / recommendation for this client">
          <TextArea className="w-full h-20" value={note} onChange={(e) => onNote(e.target.value)} placeholder="e.g. Recommend as primary option — strong restoration benefit fits client's family size." />
        </Field>

        <div className="flex gap-2 flex-wrap mt-2">
          <Btn variant={isCmp ? "primary" : "secondary"} onClick={onToggleCompare}>{isCmp ? <><Check size={14} /> Added to compare</> : "+ Add to compare"}</Btn>
          <Btn variant={isFav ? "primary" : "secondary"} onClick={onToggleFav}>{isFav ? <><Star size={14} fill="#fff" /> Favourited</> : <><Star size={14} /> Add to favourites</>}</Btn>
          <Btn variant="secondary" onClick={onGoCompare}><ArrowLeftRight size={14} /> Go to compare</Btn>
          {isAdmin && <Btn variant="secondary" onClick={onEdit}><Pencil size={14} /> Edit scheme (admin)</Btn>}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Compare — full page table                                         */
/* ---------------------------------------------------------------- */

function CompareView({ category, schemes, compareIds, onRemove, onGoBrowse, onGoProposal }) {
  const items = schemes.filter((s) => compareIds.includes(s.id) && s.category === category);
  const otherCount = compareIds.filter((id) => { const s = schemes.find((x) => x.id === id); return s && s.category !== category; }).length;
  const countLabel = `${items.length} shown · ${compareIds.length} selected in total`;

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>Compare · side by side · {category}</span>
        <Tag variant="neutral">{countLabel}</Tag>
      </div>

      {otherCount > 0 && (
        <p className="text-[12px] max-w-2xl mb-4" style={{ color: C.textMuted }}>
          {otherCount} more selected scheme{otherCount === 1 ? " is" : "s are"} from other insurance types — switch category above to compare {otherCount === 1 ? "it" : "them"}. Everything selected, across every category, goes into the client proposal together.
        </p>
      )}

      {items.length === 0 ? (
        <div className="max-w-lg py-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: C.text }}>Nothing selected in this category yet</h2>
          <p className="text-[13.5px] mb-4" style={{ color: C.textMuted }}>Tick "Add to compare" on any scheme card or detail page to line it up here. Compare as many schemes as you like per category.</p>
          <Btn variant="primary" onClick={onGoBrowse}>Browse schemes</Btn>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg mb-6" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
            <table className="w-full text-[13px] border-collapse" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th className="text-left p-3 text-[11px] uppercase tracking-wide" style={{ color: C.neutral500, borderBottom: `1px solid ${C.border}` }}>Compare</th>
                  {items.map((s) => (
                    <th key={s.id} className="text-left p-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <div className="font-semibold" style={{ color: C.text }}>{s.plan}</div>
                      <div className="text-[11px] font-normal mt-0.5" style={{ color: C.neutral500 }}>{s.insurer}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="text-left p-3 text-[11px] uppercase tracking-wide whitespace-nowrap" style={{ color: C.neutral500, borderBottom: `1px solid ${C.border}` }}>Premium</th>
                  {items.map((s) => <td key={s.id} className="p-3 font-semibold" style={{ color: C.accent700, borderBottom: `1px solid ${C.border}` }}>{money(s.premium)}</td>)}
                </tr>
                <tr>
                  <th className="text-left p-3 text-[11px] uppercase tracking-wide whitespace-nowrap" style={{ color: C.neutral500, borderBottom: `1px solid ${C.border}` }}>Sum insured</th>
                  {items.map((s) => <td key={s.id} className="p-3" style={{ color: C.text, borderBottom: `1px solid ${C.border}` }}>{money(s.sumInsured)}</td>)}
                </tr>
                {SECTIONS.map((sec) => (
                  <tr key={sec.key}>
                    <th className="text-left p-3 text-[11px] uppercase tracking-wide whitespace-nowrap align-top" style={{ color: C.neutral500, borderBottom: `1px solid ${C.border}` }}>{sec.label}</th>
                    {items.map((s) => <td key={s.id} className="p-3 align-top" style={{ color: C.text, borderBottom: `1px solid ${C.border}` }}>{s.sections[sec.key]}</td>)}
                  </tr>
                ))}
                <tr>
                  <th className="text-left p-3 text-[11px] uppercase tracking-wide" style={{ color: C.neutral500 }}>Remove</th>
                  {items.map((s) => <td key={s.id} className="p-3"><Btn variant="secondary" onClick={() => onRemove(s.id)}>Remove</Btn></td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mb-8">
            <Btn variant="primary" onClick={onGoProposal}>Build client proposal</Btn>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Proposal builder                                                  */
/* ---------------------------------------------------------------- */


function ProposalBuilderView({ schemes, compareIds, notes, setNotes, client, setClient, onGoBrowse, onSave }) {
  const items = schemes.filter((s) => compareIds.includes(s.id)).sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
  
  // Health & Lifestyle Questionnaire State
  const [ped, setPed] = useState('No');
  const [tobacco, setTobacco] = useState('No');
  const [occupation, setOccupation] = useState('Standard');
  
  // Manual Premium Overrides State
  const [customPremiums, setCustomPremiums] = useState({});

  // Compute final premium for a scheme considering loadings and overrides
  const getFinalPremium = (s) => {
    if (customPremiums[s.id] !== undefined) {
      return customPremiums[s.id];
    }
    let base = s.premium;
    if (s.category === 'Health' || s.category === 'Term') {
      if (ped === 'Yes') base += s.premium * 0.20;
      if (tobacco === 'Yes') base += s.premium * 0.10;
      if (occupation === 'High Risk') base += s.premium * 0.05;
    }
    return Math.round(base);
  };

  const total = items.reduce((sum, s) => sum + getFinalPremium(s), 0);

  if (items.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <span className="text-[12px]" style={{ color: C.textMuted }}>Proposal · client-ready document</span>
        </div>
        <div className="max-w-lg py-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: C.text }}>No schemes selected for this proposal</h2>
          <p className="text-[13.5px] mb-4" style={{ color: C.textMuted }}>Add schemes to compare from Browse or a scheme's detail page — they'll appear here as a client-ready proposal.</p>
          <Btn variant="primary" onClick={onGoBrowse}>Browse schemes</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>Proposal · client-ready document</span>
        <Tag variant="neutral">{items.length} scheme{items.length === 1 ? "" : "s"}</Tag>
      </div>

      <Card className="p-4 mb-5 max-w-2xl">
        <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Client details</div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Client name"><Input value={client.name} onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))} placeholder="Full name" /></Field>
          <Field label="Mobile"><Input value={client.mobile} onChange={(e) => setClient((c) => ({ ...c, mobile: e.target.value }))} placeholder="10-digit mobile" /></Field>
          <Field label="Email"><Input value={client.email} onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))} placeholder="client@email.com" /></Field>
        </div>
      </Card>
      
      <Card className="p-4 mb-5 max-w-2xl bg-amber-50" style={{ background: C.amber100, border: `1px solid ${C.amber700}40` }}>
        <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.amber700 }}>Health & Lifestyle Underwriting</div>
        <div className="text-[12px] mb-3 opacity-80" style={{ color: C.amber700 }}>These answers will dynamically adjust the base premium for health and term plans (e.g. +20% for PED).</div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Pre-existing Illness (PED)">
            <Select value={ped} onChange={e => { setPed(e.target.value); setCustomPremiums({}); }}>
              <option value="No">No</option>
              <option value="Yes">Yes (+20%)</option>
            </Select>
          </Field>
          <Field label="Tobacco / Alcohol">
            <Select value={tobacco} onChange={e => { setTobacco(e.target.value); setCustomPremiums({}); }}>
              <option value="No">No</option>
              <option value="Yes">Yes (+10%)</option>
            </Select>
          </Field>
          <Field label="Occupation Risk">
            <Select value={occupation} onChange={e => { setOccupation(e.target.value); setCustomPremiums({}); }}>
              <option value="Standard">Standard</option>
              <option value="High Risk">High Risk (+5%)</option>
            </Select>
          </Field>
        </div>
      </Card>

      <div className="max-w-2xl">
        {CATEGORIES.filter((c) => items.some((s) => s.category === c)).map((c) => (
          <div key={c} className="mb-3">
            <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: C.neutral500 }}>{c}</div>
          </div>
        )).length > 0 && items.map((s, i) => {
          const finalPremium = getFinalPremium(s);
          return (
          <Card key={s.id} className="p-5 mb-4">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-none" style={{ background: C.accent100, color: C.accent700 }}>{i + 1}</div>
                <div>
                  <Tag variant="accent">{s.category}</Tag>
                  <h3 className="text-[16px] font-semibold mt-1.5 mb-0.5" style={{ color: C.text }}>{s.plan}</h3>
                  <div className="text-[12px]" style={{ color: C.textMuted }}>{s.insurer}</div>
                </div>
              </div>
              {i === 0 && <Tag variant="accent2">Advisor pick</Tag>}
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="text-[12.5px]"><b className="block" style={{ color: C.text }}>{money(s.sumInsured)}</b><span style={{ color: C.textMuted }}>Sum insured</span></div>
              <div className="text-[12.5px]"><b className="block" style={{ color: C.text }}>{s.tenure} yr</b><span style={{ color: C.textMuted }}>Tenure</span></div>
              <div className="p-2 rounded-md flex flex-col" style={{ background: C.accent100 }}>
                <span className="text-[11px] font-medium mb-1" style={{ color: C.accent700 }}>Est. premium (₹)</span>
                <input 
                  type="number" 
                  className="font-bold text-[14px] bg-white rounded border px-2 py-1 outline-none" 
                  style={{ color: C.accent800, borderColor: C.accent500 }}
                  value={finalPremium} 
                  onChange={e => setCustomPremiums(prev => ({ ...prev, [s.id]: Number(e.target.value) }))} 
                />
              </div>
            </div>

            <p className="text-[13px] mb-3" style={{ color: C.textMuted }}>{s.sections.recommendations}</p>

            <Field label="Advisor note for this scheme">
              <TextArea className="w-full h-16" value={notes[s.id] || ""} onChange={(e) => setNotes((n) => ({ ...n, [s.id]: e.target.value }))} placeholder="Add a recommendation note for this scheme…" />
            </Field>
          </Card>
        )})}

        <Card className="p-4 flex justify-between items-center mb-5">
          <span className="text-[14px] font-semibold" style={{ color: C.text }}>Total estimated premium</span>
          <span className="text-[18px] font-bold" style={{ color: C.accent700 }}>{money(total)}</span>
        </Card>

        <div className="flex gap-2">
          <Btn variant="secondary" onClick={onGoBrowse}>Add more schemes</Btn>
          <Btn variant="primary" onClick={() => {
            const finalPremiumsMap = {};
            items.forEach(s => finalPremiumsMap[s.id] = getFinalPremium(s));
            onSave(finalPremiumsMap);
          }}><Save size={15} /> Save proposal</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* My proposals — saved records list                                 */
/* ---------------------------------------------------------------- */

function MyProposalsView({ user, proposals, users, onOpen, isAdmin, flash }) {
  const mine = useMemo(() => proposals.filter((p) => (isAdmin ? true : p.adviserId === user.id)), [proposals, isAdmin, user.id]);
  const [filters, setFilters] = useState({ adviser: "all", category: "all", status: "all" });

  const filtered = useMemo(() => mine.filter((p) => {
    if (filters.adviser !== "all" && p.adviserId !== filters.adviser) return false;
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (filters.category !== "all" && !p.items.some((i) => i.category === filters.category)) return false;
    return true;
  }), [mine, filters]);

  const exportCSV = () => {
    const header = ["Client Name", "Mobile", "Email", "Category", "Schemes Selected", "Premium", "Status", "Adviser", "Created", "Updated"];
    const rows = filtered.map((p) => {
      const adviser = users.find((u) => u.id === p.adviserId)?.name || p.adviserId;
      const categories = [...new Set(p.items.map((i) => i.category))].join("; ");
      const schemeNames = p.items.map((i) => i.schemeName).join("; ");
      const premium = p.items.reduce((s, i) => s + (i.premium || 0), 0);
      return [p.clientName, p.clientMobile, p.clientEmail, categories, schemeNames, premium, p.status, adviser, fmtDate(p.createdAt), fmtDate(p.updatedAt)];
    });
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fortune-proposals-export.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash("CSV export downloaded.");
  };

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>My proposals · saved client records</span>
        <Tag variant="neutral">{filtered.length} proposal{filtered.length === 1 ? "" : "s"}</Tag>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="text-[15px] font-semibold flex items-center gap-2" style={{ color: C.text }}><ClipboardList size={16} /> Proposals</div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <Select className="!w-auto !text-[12px] !py-1.5" value={filters.adviser} onChange={(e) => setFilters((f) => ({ ...f, adviser: e.target.value }))}>
                <option value="all">All advisers</option>
                {users.filter((u) => u.role === "adviser").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Select>
            )}
            <Select className="!w-auto !text-[12px] !py-1.5" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select className="!w-auto !text-[12px] !py-1.5" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            {isAdmin && <Btn variant="secondary" onClick={exportCSV}><Download size={14} /> Export CSV</Btn>}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-sm" style={{ color: C.textMuted }}>No proposals yet. Build one from Browse or Compare to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th className="text-left text-[11px] uppercase tracking-wide py-2 pr-3 font-medium" style={{ color: C.neutral500 }}>Client</th>
                  <th className="text-left text-[11px] uppercase tracking-wide py-2 pr-3 font-medium" style={{ color: C.neutral500 }}>Categories</th>
                  {isAdmin && <th className="text-left text-[11px] uppercase tracking-wide py-2 pr-3 font-medium" style={{ color: C.neutral500 }}>Adviser</th>}
                  <th className="text-left text-[11px] uppercase tracking-wide py-2 pr-3 font-medium" style={{ color: C.neutral500 }}>Premium</th>
                  <th className="text-left text-[11px] uppercase tracking-wide py-2 pr-3 font-medium" style={{ color: C.neutral500 }}>Status</th>
                  <th className="text-left text-[11px] uppercase tracking-wide py-2 pr-3 font-medium" style={{ color: C.neutral500 }}>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const adviser = users.find((u) => u.id === p.adviserId)?.name || "—";
                  const premium = p.items.reduce((s, i) => s + (i.premium || 0), 0);
                  const cats = [...new Set(p.items.map((i) => i.category))];
                  return (
                    <tr key={p.id} className="cursor-pointer" style={{ borderBottom: `1px solid ${C.border}` }} onClick={() => onOpen(p.id)}>
                      <td className="py-2.5 pr-3">
                        <div className="font-medium" style={{ color: C.text }}>{p.clientName}</div>
                        <div className="text-[11.5px]" style={{ color: C.textMuted }}>{p.clientMobile}</div>
                      </td>
                      <td className="py-2.5 pr-3 text-[12px]" style={{ color: C.textMuted }}>{cats.join(", ")}</td>
                      {isAdmin && <td className="py-2.5 pr-3 text-[12px]" style={{ color: C.textMuted }}>{adviser}</td>}
                      <td className="py-2.5 pr-3">{money(premium)}</td>
                      <td className="py-2.5 pr-3"><StatusPill status={p.status} /></td>
                      <td className="py-2.5 pr-3 text-[11.5px]" style={{ color: C.textMuted }}>{fmtDate(p.createdAt)}</td>
                      <td className="py-2.5 pr-1 text-right"><ChevronRight size={16} style={{ color: C.neutral500 }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Dashboard (admin)                                                  */
/* ---------------------------------------------------------------- */

function StatCard({ label, value, variant = "blue" }) {
  const map = {
    blue: { icon: C.accent100, iconText: C.accent700 },
    green: { icon: C.green100, iconText: C.green700 },
    amber: { icon: C.amber100, iconText: C.amber700 },
    red: { icon: C.red100, iconText: C.red700 },
  }[variant];
  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="absolute rounded-full opacity-50" style={{ right: -18, bottom: -18, width: 70, height: 70, background: map.icon }} />
      <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px] font-bold mb-2 relative z-10" style={{ background: map.icon, color: map.iconText }}>{String(value).slice(0, 1)}</div>
      <div className="text-[28px] font-bold leading-none relative z-10" style={{ color: C.text }}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide mt-1 relative z-10" style={{ color: C.neutral500 }}>{label}</div>
    </Card>
  );
}

function DashboardView({ proposals, users }) {
  const stats = useMemo(() => {
    const byStatus = {}; STATUSES.forEach((s) => (byStatus[s] = 0));
    proposals.forEach((p) => (byStatus[p.status] = (byStatus[p.status] || 0) + 1));
    const total = proposals.length;
    const purchased = byStatus["Purchased"] || 0;
    const conversion = total ? Math.round((purchased / total) * 100) : 0;
    const byCategory = {}; CATEGORIES.forEach((c) => (byCategory[c] = 0));
    proposals.forEach((p) => p.items.forEach((i) => (byCategory[i.category] = (byCategory[i.category] || 0) + 1)));
    const byAdviser = {};
    proposals.forEach((p) => { byAdviser[p.adviserId] = (byAdviser[p.adviserId] || 0) + 1; });
    return { byStatus, total, conversion, byCategory, byAdviser };
  }, [proposals]);

  return (
    <div>
      <div className="rounded-2xl p-6 mb-5 text-white" style={{ background: `linear-gradient(120deg, ${C.accent800} 0%, ${C.accent600} 60%, ${C.green600} 130%)`, boxShadow: "0 1px 0 rgba(27,34,48,0.06), 0 6px 18px rgba(27,34,48,0.12)" }}>
        <h2 className="text-2xl font-semibold mb-1">Admin dashboard</h2>
        <p className="text-[13px] opacity-85 max-w-md m-0">All advisers' proposals and performance, in one place.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Total proposals" value={stats.total} variant="blue" />
        <StatCard label="Purchased" value={stats.byStatus["Purchased"] || 0} variant="green" />
        <StatCard label="Conversion rate" value={`${stats.conversion}%`} variant="amber" />
        <StatCard label="Sent to client" value={stats.byStatus["Sent to Client"] || 0} variant="red" />
      </div>

      <Card className="p-4 mb-5">
        <div className="text-[12px] font-medium mb-3" style={{ color: C.textMuted }}>Category split</div>
        <div className="space-y-2">
          {CATEGORIES.map((c) => {
            const max = Math.max(1, ...Object.values(stats.byCategory));
            const val = stats.byCategory[c] || 0;
            const Icon = CATEGORY_ICON[c];
            return (
              <div key={c} className="flex items-center gap-3">
                <div className="w-20 flex items-center gap-1.5 text-[12px]" style={{ color: C.textMuted }}><Icon size={13} /> {c}</div>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: C.neutral200 }}>
                  <div className="h-full" style={{ width: `${(val / max) * 100}%`, background: C.accent600 }} />
                </div>
                <div className="w-6 text-[12px] text-right" style={{ color: C.textMuted }}>{val}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-[12px] font-medium mb-3" style={{ color: C.textMuted }}>Proposals by adviser</div>
        <div className="space-y-2">
          {users.filter((u) => u.role === "adviser").map((u) => {
            const max = Math.max(1, ...users.filter((x) => x.role === "adviser").map((x) => stats.byAdviser[x.id] || 0));
            const val = stats.byAdviser[u.id] || 0;
            return (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-28 text-[12px] truncate" style={{ color: C.textMuted }}>{u.name}</div>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: C.neutral200 }}>
                  <div className="h-full" style={{ width: `${(val / max) * 100}%`, background: C.green600 }} />
                </div>
                <div className="w-6 text-[12px] text-right" style={{ color: C.textMuted }}>{val}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Proposal detail — status workflow, reports, send                  */
/* ---------------------------------------------------------------- */

function ProposalDetailView({ proposal, schemes, user, onBack, onUpdate, flash }) {
  const [reportMode, setReportMode] = useState(null);
  const [sendChannel, setSendChannel] = useState(null);
  const [draftMsg, setDraftMsg] = useState("");

  if (!proposal) return <div className="text-sm" style={{ color: C.textMuted }}>Proposal not found.</div>;

  const isAdmin = user.role === "admin";
  const canEditStatus = proposal.status !== "Purchased" || isAdmin;
  const total = proposal.items.reduce((s, i) => s + (i.premium || 0), 0);

  const changeStatus = (newStatus) => {
    const now = new Date().toISOString();
    const updated = { ...proposal, status: newStatus, updatedAt: now, statusLog: [...proposal.statusLog, { oldStatus: proposal.status, newStatus, changedBy: user.name, changedAt: now }] };
    onUpdate(updated);
    flash(`Status changed to "${newStatus}".`);
  };

  const toggleIncluded = (itemId) => {
    const updated = { ...proposal, items: proposal.items.map((i) => (i.id === itemId ? { ...i, includedInReport: !i.includedInReport } : i)), updatedAt: new Date().toISOString() };
    onUpdate(updated);
  };

  const openSend = (channel) => {
    setSendChannel(channel);
    setDraftMsg(`Hi ${proposal.clientName}, this is ${user.name} from Fortune Investment Services. Your insurance proposal report has been generated for you. Please find it attached. Feel free to reach out with any questions.`);
  };

  const doSend = () => {
    if (sendChannel === "whatsapp") {
      const digits = proposal.clientMobile.replace(/\D/g, "");
      window.open(`https://wa.me/${digits}?text=${encodeURIComponent(draftMsg)}`, "_blank");
    } else if (sendChannel === "email") {
      const subject = `Your insurance proposal from Fortune Investment Services`;
      window.open(`mailto:${proposal.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftMsg)}`, "_blank");
    }
    flash(`${sendChannel === "whatsapp" ? "WhatsApp" : "Email"} draft opened.`);
    setSendChannel(null);
    if (proposal.status === "Created") changeStatus("Sent to Client");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <button onClick={onBack} className="p-1.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}><ChevronLeft size={18} style={{ color: C.accent700 }} /></button>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: C.text }}>{proposal.clientName}</h1>
          <p className="text-[11.5px]" style={{ color: C.textMuted }}>{proposal.clientMobile}{proposal.clientEmail ? ` · ${proposal.clientEmail}` : ""}</p>
        </div>
        <div className="flex-1" />
        <StatusPill status={proposal.status} />
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4">
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Selected schemes</div>
            {CATEGORIES.filter((c) => proposal.items.some((i) => i.category === c)).map((c) => (
              <div key={c} className="mb-3">
                <div className="text-[11.5px] font-medium mb-1.5" style={{ color: C.textMuted }}>{c}</div>
                {proposal.items.filter((i) => i.category === c).map((i) => (
                  <div key={i.id} className="flex items-center justify-between py-1.5 text-[13.5px]" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <label className="flex items-center gap-2" style={{ color: C.text }}>
                      <input type="checkbox" checked={i.includedInReport} onChange={() => toggleIncluded(i.id)} />
                      {i.schemeName}
                    </label>
                    <span className="font-medium" style={{ color: C.accent700 }}>{money(i.premium)}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between text-[13.5px] font-semibold pt-2" style={{ color: C.text }}>
              <span>Total premium</span><span>{money(total)}</span>
            </div>
          </Card>

          {reportMode && <ReportPreview proposal={proposal} schemes={schemes} mode={reportMode} onClose={() => setReportMode(null)} />}

          <Card className="p-4">
            <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Status history</div>
            <div className="space-y-2">
              {proposal.statusLog.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[12px]" style={{ color: C.textMuted }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent600 }} />
                  {l.oldStatus ? `${l.oldStatus} → ${l.newStatus}` : `Created`} by {l.changedBy} on {fmtDate(l.changedAt)}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Status</div>
            <Select value={proposal.status} disabled={!canEditStatus} onChange={(e) => changeStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            {!canEditStatus && <p className="text-[11px] mt-1.5" style={{ color: C.textMuted }}>Purchased is terminal — only admin can change it.</p>}
          </Card>

          <Card className="p-4">
            <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Generate report</div>
            <div className="flex flex-col gap-2">
              <Btn variant="secondary" onClick={() => setReportMode("comparison")}><FileText size={14} /> Comparison report</Btn>
              <Btn variant="secondary" onClick={() => setReportMode("selection")}><FileText size={14} /> Selection report</Btn>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-[13.5px] font-semibold mb-3" style={{ color: C.text }}>Send report</div>
            <div className="flex flex-col gap-2">
              <Btn variant="secondary" onClick={() => openSend("whatsapp")}><MessageCircle size={14} /> WhatsApp</Btn>
              <Btn variant="secondary" onClick={() => openSend("email")} disabled={!proposal.clientEmail}><Mail size={14} /> Email</Btn>
            </div>
          </Card>
        </div>
      </div>

      {sendChannel && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ position: "absolute", background: "rgba(27,34,48,0.45)" }}>
          <div className="fis-root max-w-md w-full p-5 rounded-2xl" style={{ background: C.surface }}>
            <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13.5px] font-semibold flex items-center gap-2" style={{ color: C.text }}>
                {sendChannel === "whatsapp" ? <MessageCircle size={16} /> : <Mail size={16} />}
                Send via {sendChannel === "whatsapp" ? "WhatsApp" : "Email"}
              </div>
              <button onClick={() => setSendChannel(null)}><X size={18} style={{ color: C.textMuted }} /></button>
            </div>
            <TextArea className="h-32 w-full" value={draftMsg} onChange={(e) => setDraftMsg(e.target.value)} />
            <p className="text-[11px] mt-1.5" style={{ color: C.textMuted }}>
              {sendChannel === "whatsapp" ? "Opens a wa.me link with this message pre-filled." : "Opens your email client with this message pre-filled."}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Btn variant="ghost" onClick={() => setSendChannel(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={doSend}><Send size={14} /> Open draft</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportPreview({ proposal, schemes, mode, onClose }) {
  const included = proposal.items.filter((i) => i.includedInReport);
  const total = included.reduce((s, i) => s + (i.premium || 0), 0);

  return (
    <Card className="p-5" style={{ border: `2px solid ${C.accent600}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13.5px] font-semibold" style={{ color: C.text }}>{mode === "comparison" ? "Comparison report preview" : "Selection report preview"}</div>
        <button onClick={onClose}><X size={16} style={{ color: C.textMuted }} /></button>
      </div>
      <div className="rounded-lg p-4 text-[13.5px]" style={{ background: C.bg }}>
        <div className="text-center mb-4">
          <div className="font-semibold" style={{ color: C.accent700 }}>Fortune Investment Services</div>
          <div className="text-[11.5px]" style={{ color: C.textMuted }}>Portfolio executive summary for {proposal.clientName}</div>
        </div>
        {CATEGORIES.filter((c) => included.some((i) => i.category === c)).map((c) => (
          <div key={c} className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: C.green700 }}>{c}</div>
            {mode === "selection" ? (
              included.filter((i) => i.category === c).map((i) => (
                <div key={i.id} className="flex justify-between py-1" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <span>{i.schemeName}</span><span className="font-medium">{money(i.premium)}</span>
                </div>
              ))
            ) : (
              <table className="w-full text-[12px] border-collapse mt-1">
                <thead>
                  <tr>
                    <th className="text-left pb-1 pr-2" style={{ color: C.textMuted }}>Section</th>
                    {included.filter((i) => i.category === c).map((i) => <th key={i.id} className="text-left pb-1 pr-2" style={{ color: C.accent700 }}>{i.schemeName}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {SECTIONS.map((sec) => (
                    <tr key={sec.key} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td className="py-1 pr-2 align-top" style={{ color: C.textMuted }}>{sec.label}</td>
                      {included.filter((i) => i.category === c).map((i) => { const s = schemes.find((sc) => sc.id === i.schemeId); return <td key={i.id} className="py-1 pr-2 align-top">{s?.sections[sec.key]}</td>; })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
        <div className="flex justify-between font-semibold pt-2" style={{ borderTop: `1px solid ${C.border}`, color: C.text }}>
          <span>Premium summary</span><span>{money(total)}</span>
        </div>
        <div className="text-[11px] mt-3 pt-2" style={{ borderTop: `1px solid ${C.border}`, color: C.textMuted }}>
          Next steps: review terms, confirm selection with your adviser, complete KYC and payment to proceed with purchase.
        </div>
      </div>
      <p className="text-[11px] mt-2" style={{ color: C.textMuted }}>This is an on-screen preview. PDF export uses this same layout.</p>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Scheme management (admin)                                         */
/* ---------------------------------------------------------------- */

function SchemeManagementView({ category, schemes, onChange, flash }) {
  const [editing, setEditing] = useState(null);
  const list = schemes.filter((s) => s.category === category);

  const blankScheme = () => ({
    id: uid(), category, insurer: "", plan: "", premium: 0, sumInsured: 0, tenure: 1,
    sections: Object.fromEntries(SECTIONS.map((s) => [s.key, ""])),
  });

  const save = (scheme) => {
    const now = new Date().toISOString();
    const withMeta = { ...scheme, lastEditedBy: "Admin", lastEditedAt: now };
    const exists = schemes.some((s) => s.id === scheme.id);
    const next = exists ? schemes.map((s) => (s.id === scheme.id ? withMeta : s)) : [...schemes, withMeta];
    onChange(next);
    setEditing(null);
    flash("Scheme saved. Changes are live for all advisers.");
  };

  const remove = (id) => { onChange(schemes.filter((s) => s.id !== id)); flash("Scheme removed."); };

  return (
    <div>
      <div className="flex justify-between items-baseline pb-3 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[12px]" style={{ color: C.textMuted }}>Scheme management (admin) · {category}</span>
        <Btn variant="primary" onClick={() => setEditing(blankScheme())}><Plus size={14} /> Add scheme</Btn>
      </div>

      <div className="space-y-2 max-w-2xl">
        {list.map((s) => (
          <Card key={s.id} className="p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-medium" style={{ color: C.text }}>{s.insurer} — {s.plan}</div>
              <div className="text-[11.5px]" style={{ color: C.textMuted }}>{money(s.premium)}/yr · Sum insured {money(s.sumInsured)} · Tenure {s.tenure}yr</div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing(s)} className="p-2 rounded-lg" style={{ border: `1px solid ${C.border}` }}><Pencil size={15} style={{ color: C.accent700 }} /></button>
              <button onClick={() => remove(s.id)} className="p-2 rounded-lg" style={{ border: "1px solid #f3c2bd" }}><Trash2 size={15} style={{ color: C.red700 }} /></button>
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="text-[13.5px] text-center py-8" style={{ color: C.textMuted }}>No schemes in this category yet.</p>}
      </div>

      {editing && <SchemeEditor scheme={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function SchemeEditor({ scheme, onCancel, onSave }) {
  const [form, setForm] = useState(scheme);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSection = (k, v) => setForm((f) => ({ ...f, sections: { ...f.sections, [k]: v } }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ position: "absolute", background: "rgba(27,34,48,0.45)" }}>
      <div className="fis-root max-w-2xl w-full max-h-[85vh] overflow-auto p-5 rounded-2xl" style={{ background: C.surface }}>
        <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-semibold" style={{ color: C.text }}>{form.insurer ? "Edit scheme" : "Add scheme"}</div>
          <button onClick={onCancel}><X size={18} style={{ color: C.textMuted }} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Insurer"><Input value={form.insurer} onChange={(e) => set("insurer", e.target.value)} /></Field>
          <Field label="Plan name"><Input value={form.plan} onChange={(e) => set("plan", e.target.value)} /></Field>
          <Field label="Premium (₹/yr)"><Input type="number" value={form.premium} onChange={(e) => set("premium", Number(e.target.value))} /></Field>
          <Field label="Sum insured (₹)"><Input type="number" value={form.sumInsured} onChange={(e) => set("sumInsured", Number(e.target.value))} /></Field>
          <Field label="Tenure (years)"><Input type="number" value={form.tenure} onChange={(e) => set("tenure", Number(e.target.value))} /></Field>
        </div>
        {SECTIONS.map((sec) => (
          <Field key={sec.key} label={sec.label}><TextArea className="h-16 w-full" value={form.sections[sec.key]} onChange={(e) => setSection(sec.key, e.target.value)} /></Field>
        ))}
        <div className="flex justify-end gap-2 mt-3">
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant="primary" disabled={!form.insurer || !form.plan} onClick={() => onSave(form)}><Save size={14} /> Save scheme</Btn>
        </div>
      </div>
    </div>
  );
}

