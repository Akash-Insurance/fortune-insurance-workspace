import { Scheme, User, Proposal, AdvisorNote } from './types';

export const SEED_USERS: User[] = [
  {
    id: 'usr_admin',
    email: 'fortune.admin@fortune.com',
    name: 'Fortune Admin',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_rahul',
    email: 'fortune.rahul@fortune.com',
    name: 'Rahul Sharma (Senior Advisor)',
    role: 'advisor',
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'usr_priya',
    email: 'fortune.priya@fortune.com',
    name: 'Priya Mehta (Wealth Advisor)',
    role: 'advisor',
    createdAt: '2026-01-03T00:00:00Z',
  },
];

export const SEED_SCHEMES: Scheme[] = [
  // HEALTH SCHEMES
  {
    id: 'star-assure',
    category: 'health',
    insurer: 'Star Health & Allied Insurance',
    type: 'standalone',
    plan: 'Star Assure',
    tagline: 'A 360° family floater built around unlimited restoration and maternity cover.',
    csr: '90.2%',
    network: '14,000+ Cashless Hospitals',
    sumInsured: '₹5 Lakhs – ₹2 Crores',
    entryAge: '91 days – 75 yrs',
    roomRent: 'No capping on ₹10L+ plans',
    restoration: 'Unlimited, 100% each time',
    waitingPED: '36 months (standard)',
    ratePerLakh: 1400,
    financials: {
      sumInsured: '₹5L – ₹2Cr',
      entryAge: '91 days – 75 yrs',
      network: '14,000+ Hospitals',
      roomRent: 'No cap (₹10L+ plans)',
      restoration: '100% Unlimited',
      waitingPED: '36 Months',
      csr: '90.2%',
      premium: 'Est. ₹14,000/yr (5L floater)',
    },
    inclusions: [
      'In-patient hospitalisation & ICU room rent without sub-limits',
      'Day-care procedures (all 500+ listed day-care treatments)',
      'Pre-hospitalisation (60 days) and Post-hospitalisation (90 days)',
      'Road ambulance cover up to ₹5,000 per hospitalisation',
      'AYUSH treatment (Ayurveda, Yoga, Unani, Siddha & Homeopathy)',
      'Organ donor in-patient treatment expenses covered',
      'Newborn baby cover from Day 1 up to 10% of base sum insured'
    ],
    specialBenefits: [
      'Unlimited 100% Automatic Restoration of Sum Insured for related and unrelated illnesses.',
      'Cumulative Bonus adds 25% of Sum Insured for every claim-free year up to 100%.',
      'Maternity Cover included (up to ₹50,000 normal / ₹1,00,000 C-section) after 24 months.',
      'In-Utero Foetal Surgical procedures covered under special rider.',
      'Star Wellness Program: Up to 20% discount on renewal premium based on fitness steps tracked via mobile app.'
    ],
    hospitalNetwork: {
      csrPercentage: '90.2% (IRDAI Annual Report)',
      cashlessGaragesOrHospitalsCount: '14,200+ Pan-India Cashless Hospitals',
      settlementSpeed: '< 2 Hours via Star Express Cashless Desk',
      tpaSupport: 'In-house dedicated claims management (No Third Party Administrator)'
    },
    targetProfile: {
      bestFor: 'Larger joint families wanting one comprehensive floater covering parents, in-laws and children with strong maternity benefits.',
      idealAgeRange: '25 – 60 years',
      recommendedFamilyType: 'Self + Spouse + Children + Parents / In-laws'
    },
    finePrint: {
      subLimits: 'Cataract capped at ₹40,000 per eye. Modern treatments (robotic surgeries, stem cell) capped at 50% sum insured.',
      deductibles: 'Optional ₹25,000 voluntary deductible provides 15% premium discount.',
      coPay: '20% co-payment applicable for entry age 65 years and above across all claims.'
    },
    exclusions: [
      'Cosmetic surgery, plastic surgery, and weight loss / bariatric treatments (unless medically mandated).',
      'Hazardous extreme sports and intentional self-injury.',
      'Substance abuse or alcohol addiction rehab treatments.',
      'Unproven or experimental medical procedures.'
    ],
    premiumNote: 'Star Health also sells Super Star variant with 21 optional riders and age-freeze protection.'
  },
  {
    id: 'hdfc-optima-secure',
    category: 'health',
    insurer: 'HDFC ERGO General Insurance',
    type: 'private',
    plan: 'Optima Secure',
    tagline: 'Coverage that multiplies itself — 2x from day one, growing up to 4x over 2 claim-free renewals.',
    csr: '98.4%',
    network: '13,000+ Cashless Hospitals',
    sumInsured: '₹5 Lakhs – ₹2 Crores',
    entryAge: '91 days – 65 yrs',
    roomRent: 'Any room (Single Private AC room guaranteed)',
    restoration: '100% Instant & Automatic',
    waitingPED: '36 months (reducible to 24m with rider)',
    ratePerLakh: 1650,
    financials: {
      sumInsured: '₹5L – ₹2Cr',
      entryAge: '91 days – 65 yrs',
      network: '13,000+ Hospitals',
      roomRent: 'Single Private AC',
      restoration: '100% Instant',
      waitingPED: '36 Months (Option: 24m)',
      csr: '98.4%',
      premium: 'Est. ₹16,500/yr (5L floater)',
    },
    inclusions: [
      'Secure Benefit: Instantly doubles base cover on day 1 (₹5L policy becomes ₹10L cover).',
      'Plus Benefit: Adds 50% extra sum insured after Year 1, 100% after Year 2 (up to 4x total cover).',
      'Protect Benefit: Zero deduction for non-medical consumables (gloves, masks, PPE, syringes).',
      'Pre-hospitalisation 60 days & Post-hospitalisation 180 days (highest in market).',
      'Air ambulance cover up to ₹5 Lakhs per emergency hospitalization.'
    ],
    specialBenefits: [
      'Automatic 4X Sum Insured Multiplier without paying extra premium.',
      'Zero-deductible consumable add-on built into base plan.',
      'Preventive health check-ups every single year for all covered members, regardless of claims.',
      'Global Emergency Cover rider available up to base sum insured.'
    ],
    hospitalNetwork: {
      csrPercentage: '98.4% (Industry leader in claim approval rate)',
      cashlessGaragesOrHospitalsCount: '13,000+ Verified Hospitals',
      settlementSpeed: '< 1 Hour Express Approval via HDFC ERGO App',
      tpaSupport: 'Direct in-house claim desk with zero TPA friction'
    },
    targetProfile: {
      bestFor: 'High-net-worth individuals and young families looking for maximum cover multiplier without rising premiums.',
      idealAgeRange: '22 – 55 years',
      recommendedFamilyType: 'Self + Spouse + 2 Children'
    },
    finePrint: {
      subLimits: 'No sub-limits on hospital room rent, ICU charges, or specific surgeries.',
      deductibles: 'Zero mandatory deductible. Aggregate deductible variants available up to ₹1L for extra savings.',
      coPay: 'Zero co-pay for all entry ages up to 65 years.'
    },
    exclusions: [
      'Treatments outside India unless Global Cover rider is purchased.',
      'Routine dental care and cosmetic procedures.',
      'War, invasion, nuclear exposure or biological contamination.'
    ],
    premiumNote: 'HDFC ERGO Optima Secure offers a 10% online family discount when insuring 2 or more members.'
  },
  {
    id: 'niva-bupa-reassure-2',
    category: 'health',
    insurer: 'Niva Bupa Health Insurance',
    type: 'standalone',
    plan: 'ReAssure 2.0',
    tagline: 'Lock your entry age premium forever and rollover unused sum insured infinitely.',
    csr: '92.5%',
    network: '10,000+ Cashless Hospitals',
    sumInsured: '₹5 Lakhs – ₹1 Crore',
    entryAge: '91 days – 65 yrs',
    roomRent: 'Any Room Category (No Limit)',
    restoration: 'Unlimited ReAssure Forever',
    waitingPED: '36 months (reducible to 12m via rider)',
    ratePerLakh: 1350,
    financials: {
      sumInsured: '₹5L – ₹1Cr',
      entryAge: '91 days – 65 yrs',
      network: '10,000+ Hospitals',
      roomRent: 'Any Room (No Cap)',
      restoration: 'Unlimited Forever',
      waitingPED: '36 Months (Option: 12m)',
      csr: '92.5%',
      premium: 'Est. ₹13,500/yr (5L floater)',
    },
    inclusions: [
      'Age Lock+ Feature: Pay premium based on your entry age until you make your first claim.',
      'ReAssure Forever: Unlimited automatic restorations triggered after the very 1st claim, applicable for same/different illness.',
      'Carry Forward Bonus: Unused base sum insured rolls over to next policy year infinitely up to 10x base cover.',
      'Pre-hospitalisation 60 days & Post-hospitalisation 180 days covered.',
      'Smart Health+ OPD wellness discounts.'
    ],
    specialBenefits: [
      'Age-Lock feature saves up to 40% premium in initial years.',
      'Live-Well discount: Up to 30% discount on renewal premium by achieving step counts.',
      'Safeguard+ Add-on: Covers non-medical expenses & CPI-indexed Inflation Protector.'
    ],
    hospitalNetwork: {
      csrPercentage: '92.5% Claim Settlement Ratio',
      cashlessGaragesOrHospitalsCount: '10,000+ Cashless Hospitals',
      settlementSpeed: 'Cashless pre-authorization approved within 30 minutes',
      tpaSupport: 'Direct claim settlement by Niva Bupa internal team'
    },
    targetProfile: {
      bestFor: 'Young professionals in their 20s and 30s who want to lock lower premiums early and build a massive coverage pool.',
      idealAgeRange: '21 – 45 years',
      recommendedFamilyType: 'Self + Spouse + Children'
    },
    finePrint: {
      subLimits: 'No room capping. Cyber/OPD coverage subject to selected rider limits.',
      deductibles: 'Optional Smart Deductible from ₹25k to ₹1L.',
      coPay: 'Zero co-pay if enrolled before age 60.'
    },
    exclusions: [
      'Self-inflicted injuries or suicide attempts.',
      'Infertility or IVF treatments unless explicitly added via rider.',
      'Experimental or non-scientific therapies.'
    ],
    premiumNote: 'ReAssure 2.0 Platinum tier includes free annual health checkups for all family members.'
  },
  {
    id: 'care-supreme',
    category: 'health',
    insurer: 'Care Health Insurance',
    type: 'standalone',
    plan: 'Care Supreme',
    tagline: 'Maximum coverage flexibility with 500% cumulative bonus and unlimited e-consultations.',
    csr: '95.2%',
    network: '11,400+ Cashless Hospitals',
    sumInsured: '₹7 Lakhs – ₹1 Crore',
    entryAge: '91 days – No upper limit',
    roomRent: 'Single Private Room',
    restoration: '100% Unlimited Automatic',
    waitingPED: '36 months (reducible to 12m)',
    ratePerLakh: 1280,
    financials: {
      sumInsured: '₹7L – ₹1Cr',
      entryAge: '91 days – Unlimited',
      network: '11,400+ Hospitals',
      roomRent: 'Single Private AC',
      restoration: 'Unlimited 100%',
      waitingPED: '36 Months (Option: 12m)',
      csr: '95.2%',
      premium: 'Est. ₹12,800/yr (7L floater)',
    },
    inclusions: [
      'Cumulative Bonus Super: 100% sum insured increase per year up to 500% max bonus.',
      'No Sub-limit on ICU charges, physician fees, surgeon fees, and OT expenses.',
      'Advance Technology Methods: Robotic surgery, laser surgery, stem cell therapy covered up to sum insured.',
      'Organ Donor Cover and Domiciliary Hospitalization covered in full.',
      'Unlimited Online Doctor Consultations 24x7 through Care Health App.'
    ],
    specialBenefits: [
      '500% Cumulative Bonus Super booster.',
      'Instant PED waiting period reduction rider from 36 to 12 months.',
      'Every Day Care Benefit add-on for OPD prescription discounts.'
    ],
    hospitalNetwork: {
      csrPercentage: '95.2% Claim Settlement Ratio',
      cashlessGaragesOrHospitalsCount: '11,400+ Cashless Network Hospitals',
      settlementSpeed: 'Cashless claims approved within 2 hours',
      tpaSupport: 'Direct Care Health Claims Desk'
    },
    targetProfile: {
      bestFor: 'Families seeking comprehensive sum insured with fast cumulative bonus growth and no age entry bar.',
      idealAgeRange: '25 – 65 years',
      recommendedFamilyType: 'Self + Spouse + Children + Elderly Parents'
    },
    finePrint: {
      subLimits: 'No sub-limits on room rent or specific organ transplants.',
      deductibles: 'Flexible deductible options available.',
      coPay: 'Co-pay applicable only if entry age is 61+.'
    },
    exclusions: [
      'Weight control treatments or cosmetic modifications.',
      'Injuries resulting from illegal acts or hazardous sports.'
    ],
    premiumNote: 'Care Supreme offers multi-year policy discounts (up to 10% off for 3-year term).'
  },

  // TERM SCHEMES
  {
    id: 'icici-iprotect-smart',
    category: 'term',
    insurer: 'ICICI Prudential Life Insurance',
    type: 'private',
    plan: 'iProtect Smart',
    tagline: 'Comprehensive pure term cover with accelerating critical illness payout & terminal illness benefit.',
    csr: '99.1%',
    network: '34 Critical Illness Hospitals',
    sumInsured: '₹50 Lakhs – ₹5 Crores',
    entryAge: '18 – 65 yrs',
    roomRent: 'N/A (Pure Life Cover)',
    restoration: 'N/A',
    waitingPED: '90 days (for Critical Illness)',
    termRatePerLakh: 220,
    financials: {
      sumInsured: '₹50L – ₹5Cr',
      entryAge: '18 – 65 yrs',
      network: 'Pan-India Claim Desks',
      roomRent: 'N/A',
      restoration: 'N/A',
      waitingPED: '90 Days (CI Rider)',
      csr: '99.1%',
      premium: 'Est. ₹22,000/yr (₹1 Cr cover, age 30)',
    },
    inclusions: [
      'Pure Death Benefit: 100% sum assured paid out as lump sum, monthly income, or combination.',
      'Terminal Illness Benefit: 100% sum assured paid out immediately upon diagnosis of terminal condition.',
      'Waiver of Premium on Total & Permanent Disability included in base plan.',
      'Special discounted rates for non-smokers and female lives.',
      'Flexible payout options: Lump sum, Monthly Income (up to 30 yrs), or Increasing Monthly Income.'
    ],
    specialBenefits: [
      'Accelerated Critical Illness Cover: Covers 34 critical illnesses with lump sum payout on diagnosis.',
      'Accidental Death Benefit Rider: Doubles payout in case of accidental death.',
      'Life Stage Upgrade: Increase cover by 50% on Marriage and 25% on Birth of Children without medical re-examination.'
    ],
    hospitalNetwork: {
      csrPercentage: '99.1% Claim Settlement Ratio (IRDAI 2024-25)',
      cashlessGaragesOrHospitalsCount: 'Pan-India 1,000+ ICICI Pru Life Branches',
      settlementSpeed: '1-Day Claim Express for eligible policies',
      tpaSupport: 'Direct in-house claims processing'
    },
    targetProfile: {
      bestFor: 'Breadwinners and salaried professionals looking for bulletproof financial security for their dependents.',
      idealAgeRange: '25 – 45 years',
      recommendedFamilyType: 'Self + Dependents'
    },
    finePrint: {
      subLimits: 'Critical illness rider benefit capped at ₹1 Crore.',
      deductibles: 'N/A for life cover.',
      coPay: 'N/A'
    },
    exclusions: [
      'Suicide within 12 months from policy inception (100% premiums paid returned).',
      'Death due to intentional violation of law or participation in war/riot.'
    ],
    premiumNote: 'Tax benefits under Section 80C and Section 10(10D) of Income Tax Act.'
  },
  {
    id: 'hdfc-life-click-2-protect',
    category: 'term',
    insurer: 'HDFC Life Insurance',
    type: 'private',
    plan: 'Click 2 Protect Super',
    tagline: 'Customizable term insurance with return of premium option and income replacement benefits.',
    csr: '99.5%',
    network: 'Pan-India Service Desks',
    sumInsured: '₹50 Lakhs – ₹10 Crores',
    entryAge: '18 – 65 yrs',
    roomRent: 'N/A',
    restoration: 'N/A',
    waitingPED: '90 days (CI)',
    termRatePerLakh: 240,
    financials: {
      sumInsured: '₹50L – ₹10Cr',
      entryAge: '18 – 65 yrs',
      network: 'HDFC Life Network',
      roomRent: 'N/A',
      restoration: 'N/A',
      waitingPED: '90 Days (CI)',
      csr: '99.5%',
      premium: 'Est. ₹24,000/yr (₹1 Cr cover, age 30)',
    },
    inclusions: [
      'Life Goal Option: Option to receive 100% of premiums paid back at age 60/65 (Return of Premium).',
      'Smart Exit Option: Allows surrendering the policy and getting all base premiums back during specific policy windows.',
      'Comprehensive Critical Illness option covering 60 critical illnesses.',
      'Spouse Cover: Add spouse under single policy at discounted rates.',
      'Increasing Cover Option: Sum assured increases automatically by 10% every year to combat inflation.'
    ],
    specialBenefits: [
      'Return of Premium (ROP) at maturity option.',
      'Waiver of Premium on Critical Illness diagnosis.',
      '60 Critical Illnesses covered under comprehensive rider.'
    ],
    hospitalNetwork: {
      csrPercentage: '99.5% Claim Settlement Ratio (Highest among private life insurers)',
      cashlessGaragesOrHospitalsCount: '500+ HDFC Life Branches & Digital Claims Desk',
      settlementSpeed: 'Same-day claim approval for 3+ year old policies',
      tpaSupport: 'In-house specialized claim assistance team'
    },
    targetProfile: {
      bestFor: 'High earners seeking flexible life protection with return-of-premium safety net.',
      idealAgeRange: '25 – 50 years',
      recommendedFamilyType: 'Self + Spouse + Children'
    },
    finePrint: {
      subLimits: 'Return of premium excludes rider premiums and GST.',
      deductibles: 'N/A',
      coPay: 'N/A'
    },
    exclusions: [
      'Suicide within 1st policy year.',
      'Aviation hazardous activities unless commercial pilot.'
    ],
    premiumNote: 'HDFC Life Click 2 Protect offers a 5% discount for salaried policyholders.'
  },
  {
    id: 'max-life-smart-secure-plus',
    category: 'term',
    insurer: 'Max Life Insurance',
    type: 'private',
    plan: 'Smart Secure Plus Plan',
    tagline: 'High sum assured protection with terminal illness payout and voluntary sum assured top-ups.',
    csr: '99.65%',
    network: 'Max Life Service Centers',
    sumInsured: '₹50 Lakhs – ₹5 Crores',
    entryAge: '18 – 65 yrs',
    roomRent: 'N/A',
    restoration: 'N/A',
    waitingPED: '90 days (CI)',
    termRatePerLakh: 210,
    financials: {
      sumInsured: '₹50L – ₹5Cr',
      entryAge: '18 – 65 yrs',
      network: 'Max Life Network',
      roomRent: 'N/A',
      restoration: 'N/A',
      waitingPED: '90 Days (CI)',
      csr: '99.65%',
      premium: 'Est. ₹21,000/yr (₹1 Cr cover, age 30)',
    },
    inclusions: [
      'Death Benefit with dual payout structure (Lump sum + monthly income).',
      'Accelerated Terminal Illness Benefit up to ₹1 Crore.',
      'Special low premium rates for non-tobacco users.',
      'Premium Break Option: Skip paying premium once every 10 years after completing 10 policy years.',
      'Joint Life Option: Protect both husband and wife under a single plan.'
    ],
    specialBenefits: [
      'Special 10% premium discount for non-smoker females.',
      'Premium Break feature for financial flexibility during career transitions.'
    ],
    hospitalNetwork: {
      csrPercentage: '99.65% Claim Settlement Ratio (Industry Benchmark)',
      cashlessGaragesOrHospitalsCount: 'Pan-India Max Life Network',
      settlementSpeed: 'InstaClaim approval in 5 hours for amounts up to ₹1 Crore',
      tpaSupport: 'Direct in-house claim management'
    },
    targetProfile: {
      bestFor: 'Families looking for maximum reliability and high claim settlement record.',
      idealAgeRange: '25 – 48 years',
      recommendedFamilyType: 'Self + Spouse + Children'
    },
    finePrint: {
      subLimits: 'InstaClaim applies to policies active for 3+ continuous years.',
      deductibles: 'N/A',
      coPay: 'N/A'
    },
    exclusions: [
      'Suicide within 12 months of risk commencement date.'
    ],
    premiumNote: 'Eligible for Section 80C tax deduction up to ₹1.5 Lakhs annually.'
  },

  // MOTOR SCHEMES
  {
    id: 'bajaj-allianz-drive-smart',
    category: 'motor',
    insurer: 'Bajaj Allianz General Insurance',
    type: 'private',
    plan: 'DriveSmart Private Car Package',
    tagline: 'Comprehensive car insurance with zero depreciation, engine protector, and 24x7 roadside assistance.',
    csr: '98.1%',
    network: '7,200+ Cashless Garages',
    sumInsured: 'IDV based (Up to ₹50L car value)',
    entryAge: 'Vehicles 0 – 10 yrs',
    roomRent: 'N/A',
    restoration: 'Unlimited claims per year',
    waitingPED: '0 days (Instant coverage)',
    ratePerLakh: 3200,
    financials: {
      sumInsured: 'Vehicle IDV',
      entryAge: '0 – 10 yrs vehicle',
      network: '7,200+ Cashless Garages',
      roomRent: 'N/A',
      restoration: 'Unlimited Claims',
      waitingPED: '0 Days',
      csr: '98.1%',
      premium: 'Est. ₹16,000/yr (₹5L IDV Car)',
    },
    inclusions: [
      'Comprehensive Own Damage (OD) + Mandatory Third Party (TP) liability cover.',
      'Zero Depreciation Add-on: 100% claim payout for rubber, plastic, fiber, and glass parts without depreciation.',
      'Engine & Gearbox Protector: Covers water ingression (hydrostatic lock) and oil leakage damages.',
      '24x7 Roadside Assistance: Fuel delivery, towing, battery jump-start, flat tire change, key unlock.',
      'Personal Accident Cover up to ₹15 Lakhs for owner-driver.'
    ],
    specialBenefits: [
      'DriveSmart Telematics Device rider: Pay premium based on real-time driving behavior score.',
      'Consequential damage engine cover.',
      'Key & Lock Replacement Cover up to ₹10,000.'
    ],
    hospitalNetwork: {
      csrPercentage: '98.1% Motor Claim Settlement Ratio',
      cashlessGaragesOrHospitalsCount: '7,200+ Cashless Network Garages',
      settlementSpeed: 'Digital Spot Survey & cashless approval in 4 hours',
      tpaSupport: 'Direct in-house Motor Claims Team'
    },
    targetProfile: {
      bestFor: 'Car owners looking for complete hassle-free repair experience in top authorized service centers.',
      idealAgeRange: 'Any licensed driver',
      recommendedFamilyType: 'Individual / Family Vehicle'
    },
    finePrint: {
      subLimits: 'Compulsory deductible of ₹1,000 to ₹2,000 per claim depending on engine cubic capacity.',
      deductibles: 'Voluntary deductible options up to ₹10,000 for discount.',
      coPay: 'N/A'
    },
    exclusions: [
      'Driving under influence of alcohol or drugs.',
      'Driving without a valid driver license.',
      'Normal wear and tear, mechanical breakdown without accident.'
    ],
    premiumNote: 'No Claim Bonus (NCB) retention rider saves up to 50% NCB even after 1 claim.'
  },
  {
    id: 'tata-aig-auto-secure',
    category: 'motor',
    insurer: 'TATA AIG General Insurance',
    type: 'private',
    plan: 'Auto Secure Private Car Package',
    tagline: '13 optional add-ons including Repair of Glass/Fiber and Consumables cover.',
    csr: '97.6%',
    network: '7,500+ Cashless Garages',
    sumInsured: 'IDV based',
    entryAge: 'Vehicles 0 – 12 yrs',
    roomRent: 'N/A',
    restoration: 'Unlimited claims',
    waitingPED: '0 days',
    ratePerLakh: 3100,
    financials: {
      sumInsured: 'Vehicle IDV',
      entryAge: '0 – 12 yrs vehicle',
      network: '7,500+ Garages',
      roomRent: 'N/A',
      restoration: 'Unlimited Claims',
      waitingPED: '0 Days',
      csr: '97.6%',
      premium: 'Est. ₹15,500/yr (₹5L IDV Car)',
    },
    inclusions: [
      'Full Own Damage & Third Party Cover.',
      'Consumables Cover: Pays for engine oil, coolant, brake oil, nuts, bolts, and washers during repair.',
      'Return to Invoice (RTI) Add-on: Pays full original invoice price of car (including road tax & registration) in case of total loss or theft.',
      'Loss of Personal Belongings cover up to ₹50,000.',
      'Tyre Secure Cover: Covers un-repairable damage or cuts to tires and tubes.'
    ],
    specialBenefits: [
      'Return to Invoice (RTI) covers 100% original purchase price on theft.',
      'Tyre & Rim protection rider.'
    ],
    hospitalNetwork: {
      csrPercentage: '97.6% Motor Claims Settlement',
      cashlessGaragesOrHospitalsCount: '7,500+ Network Garages across India',
      settlementSpeed: 'Instant self-survey claim approval via TATA AIG Auto Inspector App',
      tpaSupport: 'Direct in-house surveyor network'
    },
    targetProfile: {
      bestFor: 'New vehicle buyers who want invoice price recovery in case of theft or total loss.',
      idealAgeRange: 'Car Owners',
      recommendedFamilyType: 'Personal / Luxury Car Owners'
    },
    finePrint: {
      subLimits: 'Personal belongings cover capped at ₹50,000 per incident.',
      deductibles: 'Standard IRDAI compulsory deductible applies.',
      coPay: 'N/A'
    },
    exclusions: [
      'Consequential damage if engine is started after flood submergence.',
      'Commercial usage of private car.'
    ],
    premiumNote: 'Tata AIG offers a special 15% discount for EV (Electric Vehicle) owners.'
  },

  // TRAVEL SCHEMES
  {
    id: 'digit-global-travel',
    category: 'travel',
    insurer: 'Go Digit General Insurance',
    type: 'private',
    plan: 'Digit International Travel Care',
    tagline: 'Zero-deductible overseas medical cover with flight delay and passport loss protection.',
    csr: '96.8%',
    network: 'Global Healthcare Network',
    sumInsured: '$50,000 – $500,000 USD',
    entryAge: '6 months – 99 yrs',
    roomRent: 'Usual & Customary overseas hospital room',
    restoration: 'Single / Multi-trip',
    waitingPED: 'Covered in life-threatening emergency',
    ratePerLakh: 950,
    financials: {
      sumInsured: '$100,000 USD',
      entryAge: '6 months – 99 yrs',
      network: 'Global Hospital Network',
      roomRent: 'Semi-private / Private AC',
      restoration: 'Per Trip Cover',
      waitingPED: 'Emergency covered',
      csr: '96.8%',
      premium: 'Est. ₹1,800 / 15-day trip',
    },
    inclusions: [
      'Emergency Overseas Medical Expenses & Hospitalization up to $500,000 USD.',
      'Zero Deductible: Unlike traditional travel plans, Digit pays from the very first dollar of claim.',
      'Flight Delay & Cancellation: Automatic compensation paid if flight is delayed by more than 75 minutes.',
      'Loss of Checked-in Baggage & Passport Replacement costs covered in full.',
      'Emergency Medical Evacuation & Repatriation back to home country.'
    ],
    specialBenefits: [
      'Flight Delay claim auto-trigger via smartphone boarding pass scan.',
      'Zero deductible across all medical and non-medical claim categories.',
      'Adventure Sports Coverage add-on for skiing, scuba diving, and trekking.'
    ],
    hospitalNetwork: {
      csrPercentage: '96.8% Global Claim Approval Rate',
      cashlessGaragesOrHospitalsCount: 'Global Cashless Network in 180+ Countries',
      settlementSpeed: '24x7 WhatsApp & Phone Support with instant cashless guarantee',
      tpaSupport: 'Direct Digit Overseas Assistance Desk'
    },
    targetProfile: {
      bestFor: 'Vacationers, business travelers, and students traveling to USA, Europe (Schengen), UK or Asia.',
      idealAgeRange: 'All ages',
      recommendedFamilyType: 'Solo / Couple / Family Travel'
    },
    finePrint: {
      subLimits: 'Dental emergency treatment capped at $500 USD.',
      deductibles: '$0 Zero Deductible on base plan.',
      coPay: 'Nil'
    },
    exclusions: [
      'Travel taken against medical advice of a registered doctor.',
      'Pre-existing conditions unless life-threatening emergency stabilization.'
    ],
    premiumNote: 'Complies 100% with mandatory Schengen Visa insurance requirements (30,000 EUR minimum medical).'
  },
  {
    id: 'reliance-travel-care',
    category: 'travel',
    insurer: 'Reliance General Insurance',
    type: 'private',
    plan: 'Reliance Annual Multi-Trip Executive',
    tagline: 'Annual multi-trip insurance designed for frequent corporate travelers.',
    csr: '95.4%',
    network: 'Worldwide Assistance Desk',
    sumInsured: '$100,000 – $1,000,000 USD',
    entryAge: '18 – 70 yrs',
    roomRent: 'Standard Private Room',
    restoration: 'Annual Multi-trip (30/45/60 days per trip)',
    waitingPED: 'Pre-existing emergency covered',
    ratePerLakh: 1100,
    financials: {
      sumInsured: '$250,000 USD',
      entryAge: '18 – 70 yrs',
      network: 'Global Network',
      roomRent: 'Standard Room',
      restoration: 'Multi-Trip Cover',
      waitingPED: 'PED Emergency Cover',
      csr: '95.4%',
      premium: 'Est. ₹8,500 / Annual Pass',
    },
    inclusions: [
      'Unlimited international trips per year (up to 45 days continuous duration per trip).',
      'Overseas Sickness & Accident Medical Expenses up to $1,000,000 USD.',
      'Trip Interruption & Missed Connection flight reimbursement.',
      'Baggage Delay & Total Loss of Checked Baggage indemnity.',
      'Personal Liability Cover up to $200,000 USD for accidental third-party damage abroad.'
    ],
    specialBenefits: [
      'Annual Multi-Trip convenience: Buy once, travel unlimited times for 365 days.',
      'High sum insured suitable for US & Canada travel.'
    ],
    hospitalNetwork: {
      csrPercentage: '95.4% Claim Settlement',
      cashlessGaragesOrHospitalsCount: 'International SOS / Allianz Global Assistance Desk',
      settlementSpeed: 'Cashless pre-approval within 1 hour globally',
      tpaSupport: 'International SOS 24x7 Hotline'
    },
    targetProfile: {
      bestFor: 'Corporate executives, consultants, and frequent international flyers.',
      idealAgeRange: '25 – 65 years',
      recommendedFamilyType: 'Individual Business Traveler'
    },
    finePrint: {
      subLimits: 'Maximum trip duration capped at 45 days per individual trip.',
      deductibles: '$50 USD deductible per medical claim.',
      coPay: 'Nil'
    },
    exclusions: [
      'Participation in professional sports or dangerous stunt activities.',
      'Losses due to war or political unrest in banned country zones.'
    ],
    premiumNote: 'Includes free global SIM card discount and lounge access vouchers.'
  }
];

export const SEED_PROPOSALS: Proposal[] = [
  {
    id: 'prop-101',
    name: 'Sharma Family Comprehensive Shield',
    client: {
      name: 'Amit Sharma',
      age: 38,
      family: 'Self (38), Spouse (35), Son (8)',
      city: 'Mumbai',
      advisor: 'Rahul Sharma',
      email: 'amit.sharma@gmail.com',
      phone: '+91 98200 12345',
      members: [
        { relation: 'Self', age: 38, name: 'Amit Sharma', premiumShare: 18000 },
        { relation: 'Spouse', age: 35, name: 'Neha Sharma', premiumShare: 14000 },
        { relation: 'Child 1', age: 8, name: 'Aarav Sharma', premiumShare: 8000 }
      ]
    },
    compareIds: ['star-assure', 'hdfc-optima-secure', 'icici-iprotect-smart'],
    createdBy: 'fortune.rahul@fortune.com',
    createdByDisplay: 'Rahul Sharma (Senior Advisor)',
    status: 'sent',
    date: '2026-08-01',
    category: 'health',
    totalPremium: 40000,
    customNotes: {
      'star-assure': 'Highly recommended for the unlimited restoration feature as Amit has elderly parents visiting frequently.',
      'hdfc-optima-secure': 'Excellent 4x cover multiplier for long term inflation protection.'
    },
    createdAt: '2026-08-01T10:30:00Z'
  },
  {
    id: 'prop-102',
    name: 'Verma Executive Life & Motor Plan',
    client: {
      name: 'Vikram Verma',
      age: 42,
      family: 'Self (42), Spouse (40), Daughter (12)',
      city: 'Bengaluru',
      advisor: 'Priya Mehta',
      email: 'vikram.v@techcorp.io',
      phone: '+91 99000 87654',
      members: [
        { relation: 'Self', age: 42, name: 'Vikram Verma', premiumShare: 24000 },
        { relation: 'Spouse', age: 40, name: 'Ananya Verma', premiumShare: 18000 }
      ]
    },
    compareIds: ['icici-iprotect-smart', 'hdfc-life-click-2-protect', 'bajaj-allianz-drive-smart'],
    createdBy: 'fortune.priya@fortune.com',
    createdByDisplay: 'Priya Mehta (Wealth Advisor)',
    status: 'purchased',
    date: '2026-07-25',
    category: 'term',
    totalPremium: 57500,
    customNotes: {
      'icici-iprotect-smart': 'Purchased with ₹1.5 Cr sum assured and Critical Illness rider.'
    },
    createdAt: '2026-07-25T14:15:00Z'
  },
  {
    id: 'prop-103',
    name: 'Kulkarni International Travel & Health Portfolio',
    client: {
      name: 'Dr. Suresh Kulkarni',
      age: 50,
      family: 'Self (50), Spouse (48)',
      city: 'Pune',
      advisor: 'Rahul Sharma',
      email: 'dr.kulkarni@healthclinic.org',
      phone: '+91 94220 55432',
      members: [
        { relation: 'Self', age: 50, name: 'Dr. Suresh Kulkarni', premiumShare: 22000 },
        { relation: 'Spouse', age: 48, name: 'Sunita Kulkarni', premiumShare: 19000 }
      ]
    },
    compareIds: ['care-supreme', 'digit-global-travel', 'reliance-travel-care'],
    createdBy: 'fortune.rahul@fortune.com',
    createdByDisplay: 'Rahul Sharma (Senior Advisor)',
    status: 'draft',
    date: '2026-08-05',
    category: 'travel',
    totalPremium: 41000,
    customNotes: {
      'digit-global-travel': 'Selected for Europe vacation with zero deductible.'
    },
    createdAt: '2026-08-05T09:00:00Z'
  }
];

export const SEED_ADVISOR_NOTES: AdvisorNote[] = [
  {
    id: 'note-1',
    schemeId: 'star-assure',
    advisorId: 'usr_rahul',
    advisorName: 'Rahul Sharma',
    noteText: 'Best choice for families with high hospitalisation risks. Mention the no-room-rent-capping benefit on ₹10L+ plans to clients who prefer tier-1 private hospitals like Fortis or Apollo.',
    updatedAt: '2026-08-02T11:20:00Z'
  },
  {
    id: 'note-2',
    schemeId: 'hdfc-optima-secure',
    advisorId: 'usr_priya',
    advisorName: 'Priya Mehta',
    noteText: 'Pitch the 2x instant sum insured multiplier to young tech couples. High claim settlement ratio (98.4%) makes it easy to close with risk-averse HNI clients.',
    updatedAt: '2026-08-04T16:45:00Z'
  }
];
