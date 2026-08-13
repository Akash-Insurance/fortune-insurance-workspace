export type Role = 'admin' | 'advisor';

export type InsuranceCategory = 'health' | 'term' | 'motor' | 'travel';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
}

export interface SchemeParameters {
  sumInsured: string;
  entryAge: string;
  network: string;
  roomRent: string;
  restoration: string;
  waitingPED: string;
  csr: string;
  premium: string;
  ratePerLakh?: number;
  termRatePerLakh?: number;
}

export interface SchemeFinePrint {
  subLimits: string;
  deductibles: string;
  coPay: string;
  cancellationTerms?: string;
}

export interface HospitalNetwork {
  csrPercentage: string;
  cashlessGaragesOrHospitalsCount: string;
  settlementSpeed: string;
  tpaSupport: string;
}

export interface TargetProfile {
  bestFor: string;
  idealAgeRange: string;
  recommendedFamilyType: string;
}

export interface PremiumCalculatorParams {
  sumInsuredAmount: number; // e.g. 500000, 1000000, 2500000, 5000000, 10000000
  primaryAge: number; // e.g. 30
  policyType: 'individual' | 'floater_1a1c' | 'floater_2a' | 'floater_2a2c';
  tenureYears: 1 | 2 | 3;
  selectedRiders: string[]; // e.g. ['critical_illness', 'hospital_cash', 'ncb_super', 'opd_cover']
}

export interface CalculatedPremiumDetails {
  basePremium: number;
  riderPremium: number;
  subtotal: number;
  tenureDiscount: number;
  taxGst: number;
  netAnnualPremium: number;
  monthlyEmi: number;
  parameters: PremiumCalculatorParams;
}

export interface Scheme {
  id: string;
  insurer: string;
  category: InsuranceCategory;
  type: string;
  plan: string;
  tagline: string;
  csr: string;
  network: string;
  sumInsured: string;
  entryAge: string;
  roomRent: string;
  restoration: string;
  waitingPED: string;
  ratePerLakh?: number;
  termRatePerLakh?: number;
  logoUrl?: string;
  calculatedPremium?: CalculatedPremiumDetails;

  // 8-Section Comprehensive Fields
  financials: SchemeParameters;
  inclusions: string[];
  specialBenefits: string[];
  hospitalNetwork: HospitalNetwork;
  targetProfile: TargetProfile;
  finePrint: SchemeFinePrint;
  exclusions: string[];
  premiumNote?: string;
}

export interface FamilyMember {
  relation: string;
  age: number;
  name?: string;
  premiumShare?: number;
}

export interface ClientProfile {
  name: string;
  age: number;
  family: string;
  city: string;
  advisor: string;
  email?: string;
  phone?: string;
  members?: FamilyMember[];
}

export type ProposalStatus = 'Created' | 'Sent to Client' | 'Accepted' | 'Declined' | 'Purchased';

export interface StatusLogEntry {
  oldStatus: ProposalStatus | null;
  newStatus: ProposalStatus;
  changedBy: string;
  changedAt: string;
}

export interface Proposal {
  id: string;
  name: string;
  client: ClientProfile;
  compareIds: string[];
  createdBy: string; // User email or ID
  createdByDisplay: string;
  status: ProposalStatus;
  date: string;
  category?: InsuranceCategory;
  customNotes?: Record<string, string>;
  schemeCalculations?: Record<string, CalculatedPremiumDetails>;
  createdAt?: string;
  statusLog?: StatusLogEntry[];
  totalPremium?: number;
}

export interface AdvisorNote {
  id: string;
  schemeId: string;
  advisorId: string;
  advisorName?: string;
  noteText: string;
  updatedAt: string;
}

export interface AnalyticsMetrics {
  totalProposals: number;
  totalPremiumVolume: number;
  conversionRate: number;
  activeAdvisors: number;
  categoryDistribution: { category: string; count: number; volume: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  advisorPerformance: { name: string; proposals: number; volume: number; conversion: number }[];
  monthlyTrend: { month: string; volume: number; proposals: number }[];
}
