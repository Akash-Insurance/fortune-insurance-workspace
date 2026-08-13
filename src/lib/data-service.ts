import { Scheme, Proposal, AdvisorNote, User, AnalyticsMetrics, ProposalStatus } from './types';
import { SEED_SCHEMES, SEED_PROPOSALS, SEED_ADVISOR_NOTES, SEED_USERS } from './seed';
import { supabase, isSupabaseConfigured } from './supabase';

const SCHEMES_KEY = 'fortune_schemes_db';
const PROPOSALS_KEY = 'fortune_proposals_db';
const NOTES_KEY = 'fortune_notes_db';
const USERS_KEY = 'fortune_users_db';

// Helper for localStorage fallback
function getLocalItem<T>(key: string, seedDefault: T): T {
  if (typeof window === 'undefined') return seedDefault;
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(seedDefault));
      return seedDefault;
    }
    return JSON.parse(data) as T;
  } catch (err) {
    console.error('LocalStorage read error:', err);
    return seedDefault;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// ---------------- SCHEMES CRUD ----------------
export async function getSchemes(): Promise<Scheme[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('schemes').select('*');
    if (!error && data && data.length > 0) {
      return data as Scheme[];
    }
  }
  return getLocalItem<Scheme[]>(SCHEMES_KEY, SEED_SCHEMES);
}

export async function getSchemeById(id: string): Promise<Scheme | null> {
  const schemes = await getSchemes();
  return schemes.find((s) => s.id === id) || null;
}

export async function saveScheme(scheme: Scheme): Promise<Scheme> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('schemes').upsert(scheme).select().single();
    if (!error && data) return data as Scheme;
  }
  
  const schemes = getLocalItem<Scheme[]>(SCHEMES_KEY, SEED_SCHEMES);
  const idx = schemes.findIndex((s) => s.id === scheme.id);
  if (idx >= 0) {
    schemes[idx] = scheme;
  } else {
    schemes.unshift(scheme);
  }
  setLocalItem(SCHEMES_KEY, schemes);
  return scheme;
}

export async function deleteScheme(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('schemes').delete().eq('id', id);
    if (!error) return true;
  }

  const schemes = getLocalItem<Scheme[]>(SCHEMES_KEY, SEED_SCHEMES);
  const filtered = schemes.filter((s) => s.id !== id);
  setLocalItem(SCHEMES_KEY, filtered);
  return true;
}

// ---------------- PROPOSALS CRUD ----------------
export async function getProposals(): Promise<Proposal[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('proposals').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as Proposal[];
    }
  }
  return getLocalItem<Proposal[]>(PROPOSALS_KEY, SEED_PROPOSALS);
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  const proposals = await getProposals();
  return proposals.find((p) => p.id === id) || null;
}

export async function createProposal(proposal: Omit<Proposal, 'id' | 'createdAt'>): Promise<Proposal> {
  const newProposal: Proposal = {
    ...proposal,
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('proposals').insert(newProposal).select().single();
    if (!error && data) return data as Proposal;
  }

  const proposals = getLocalItem<Proposal[]>(PROPOSALS_KEY, SEED_PROPOSALS);
  proposals.unshift(newProposal);
  setLocalItem(PROPOSALS_KEY, proposals);
  return newProposal;
}

export async function updateProposalStatus(id: string, status: ProposalStatus, userName: string = 'Admin'): Promise<Proposal | null> {
  if (isSupabaseConfigured && supabase) {
    // Currently omitted, need raw SQL or RPC for appending JSONB in supabase
  }

  const proposals = getLocalItem<Proposal[]>(PROPOSALS_KEY, SEED_PROPOSALS);
  const idx = proposals.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const oldStatus = proposals[idx].status;
    proposals[idx].status = status;
    
    if (!proposals[idx].statusLog) {
      proposals[idx].statusLog = [];
    }
    
    proposals[idx].statusLog.push({
      oldStatus,
      newStatus: status,
      changedBy: userName,
      changedAt: new Date().toISOString()
    });
    
    setLocalItem(PROPOSALS_KEY, proposals);
    return proposals[idx];
  }
  return null;
}

export async function deleteProposal(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('proposals').delete().eq('id', id);
    if (!error) return true;
  }

  const proposals = getLocalItem<Proposal[]>(PROPOSALS_KEY, SEED_PROPOSALS);
  const filtered = proposals.filter((p) => p.id !== id);
  setLocalItem(PROPOSALS_KEY, filtered);
  return true;
}

// ---------------- ADVISOR NOTES CRUD ----------------
export async function getAdvisorNotes(schemeId?: string): Promise<AdvisorNote[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('advisor_notes').select('*');
    if (schemeId) query = query.eq('scheme_id', schemeId);
    const { data, error } = await query;
    if (!error && data) return data as AdvisorNote[];
  }
  const notes = getLocalItem<AdvisorNote[]>(NOTES_KEY, SEED_ADVISOR_NOTES);
  if (schemeId) return notes.filter((n) => n.schemeId === schemeId);
  return notes;
}

export async function saveAdvisorNote(schemeId: string, advisorId: string, advisorName: string, noteText: string): Promise<AdvisorNote> {
  const updatedAt = new Date().toISOString();
  const noteObj: AdvisorNote = {
    id: `note-${schemeId}-${advisorId}`,
    schemeId,
    advisorId,
    advisorName,
    noteText,
    updatedAt,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('advisor_notes').upsert({
      id: noteObj.id,
      scheme_id: schemeId,
      advisor_id: advisorId,
      advisor_name: advisorName,
      note_text: noteText,
      updated_at: updatedAt,
    }).select().single();
    if (!error && data) return noteObj;
  }

  const notes = getLocalItem<AdvisorNote[]>(NOTES_KEY, SEED_ADVISOR_NOTES);
  const idx = notes.findIndex((n) => n.schemeId === schemeId && n.advisorId === advisorId);
  if (idx >= 0) {
    notes[idx] = noteObj;
  } else {
    notes.push(noteObj);
  }
  setLocalItem(NOTES_KEY, notes);
  return noteObj;
}

// ---------------- USERS CRUD ----------------
export async function getUsers(): Promise<User[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('users').select('*');
    if (!error && data && data.length > 0) return data as User[];
  }
  return getLocalItem<User[]>(USERS_KEY, SEED_USERS);
}

// ---------------- ANALYTICS DATA ----------------
export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  const proposals = await getProposals();
  const schemes = await getSchemes();

  const totalProposals = proposals.length;
  const totalPremiumVolume = proposals.reduce((acc, p) => acc + (p.totalPremium || 35000), 0);
  const purchased = proposals.filter((p) => p.status === 'Purchased').length;
  const conversionRate = totalProposals > 0 ? Math.round((purchased / totalProposals) * 100) : 0;

  // Category distribution
  const catMap: Record<string, { count: number; volume: number }> = {
    health: { count: 0, volume: 0 },
    term: { count: 0, volume: 0 },
    motor: { count: 0, volume: 0 },
    travel: { count: 0, volume: 0 },
  };

  proposals.forEach((p) => {
    const cat = p.category || 'health';
    if (!catMap[cat]) catMap[cat] = { count: 0, volume: 0 };
    catMap[cat].count += 1;
    catMap[cat].volume += p.totalPremium || 35000;
  });

  const categoryDistribution = Object.entries(catMap).map(([category, val]) => ({
    category: category.toUpperCase(),
    count: val.count,
    volume: val.volume,
  }));

  // Status distribution
  const statusCounts: Record<ProposalStatus, number> = { 'Created': 0, 'Sent to Client': 0, 'Accepted': 0, 'Purchased': 0, 'Declined': 0 };
  proposals.forEach((p) => {
    if (statusCounts[p.status] !== undefined) statusCounts[p.status] += 1;
  });

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: totalProposals > 0 ? Math.round((count / totalProposals) * 100) : 0,
  }));

  // Advisor performance
  const advisorMap: Record<string, { name: string; proposals: number; volume: number; purchased: number }> = {};
  proposals.forEach((p) => {
    const advName = p.createdByDisplay || p.createdBy || 'Advisor';
    if (!advisorMap[advName]) {
      advisorMap[advName] = { name: advName, proposals: 0, volume: 0, purchased: 0 };
    }
    advisorMap[advName].proposals += 1;
    advisorMap[advName].volume += p.totalPremium || 35000;
    if (p.status === 'Purchased') advisorMap[advName].purchased += 1;
  });

  const advisorPerformance = Object.values(advisorMap).map((adv) => ({
    name: adv.name.split(' ')[0],
    proposals: adv.proposals,
    volume: Math.round(adv.volume / 1000), // in Thousands
    conversion: adv.proposals > 0 ? Math.round((adv.purchased / adv.proposals) * 100) : 0,
  }));

  const monthlyTrend = [
    { month: 'Apr 2026', volume: 120, proposals: 4 },
    { month: 'May 2026', volume: 180, proposals: 6 },
    { month: 'Jun 2026', volume: 240, proposals: 8 },
    { month: 'Jul 2026', volume: 310, proposals: 11 },
    { month: 'Aug 2026', volume: Math.round(totalPremiumVolume / 1000), proposals: totalProposals },
  ];

  return {
    totalProposals,
    totalPremiumVolume,
    conversionRate,
    activeAdvisors: Object.keys(advisorMap).length || 2,
    categoryDistribution,
    statusDistribution,
    advisorPerformance,
    monthlyTrend,
  };
}
