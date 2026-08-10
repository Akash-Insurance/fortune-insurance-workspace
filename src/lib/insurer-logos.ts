// Preset brand logo definitions for top IRDAI insurers

export interface InsurerLogoPreset {
  name: string;
  insurerKeywords: string[];
  logoSvg: string; // SVG inline or data URI
  bgGradient: string;
}

export const INSURER_LOGO_PRESETS: InsurerLogoPreset[] = [
  {
    name: 'Star Health',
    insurerKeywords: ['star', 'star health'],
    bgGradient: 'from-blue-600 to-indigo-700',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%230F52BA"/><path d="M50 15L61.8 38.9L88 42.7L69 61.2L73.5 87.3L50 75L26.5 87.3L31 61.2L12 42.7L38.2 38.9L50 15Z" fill="gold"/><path d="M50 30L56 42L69 44L59.5 53.5L61.8 66.5L50 60L38.2 66.5L40.5 53.5L31 44L44 42L50 30Z" fill="white"/></svg>`,
  },
  {
    name: 'HDFC ERGO / HDFC Life',
    insurerKeywords: ['hdfc', 'hdfc ergo', 'hdfc life'],
    bgGradient: 'from-red-600 to-rose-700',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23C41230"/><rect x="25" y="25" width="50" height="50" fill="white"/><rect x="35" y="35" width="30" height="30" fill="%23004B87"/><path d="M35 35H65V65H35V35Z" fill="white"/><rect x="42" y="25" width="16" height="50" fill="%23C41230"/><rect x="25" y="42" width="50" height="16" fill="%23C41230"/></svg>`,
  },
  {
    name: 'Niva Bupa',
    insurerKeywords: ['niva', 'bupa', 'max bupa', 'niva bupa'],
    bgGradient: 'from-emerald-600 to-teal-700',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%2300A859"/><circle cx="40" cy="50" r="22" fill="%23FFD100"/><circle cx="60" cy="50" r="22" fill="white" opacity="0.9"/><path d="M50 32C58 40 58 60 50 68C42 60 42 40 50 32Z" fill="%23003A70"/></svg>`,
  },
  {
    name: 'ICICI Lombard / Prudential',
    insurerKeywords: ['icici', 'icici lombard', 'icici prudential'],
    bgGradient: 'from-amber-600 to-orange-700',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23F37021"/><path d="M25 75V25L75 75V25" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="10" fill="%23A6192E"/></svg>`,
  },
  {
    name: 'Care Health',
    insurerKeywords: ['care', 'religare', 'care health'],
    bgGradient: 'from-cyan-600 to-blue-700',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%230084BF"/><path d="M50 20C32 20 20 32 20 50C20 68 32 80 50 80C68 80 80 68 80 50C80 32 68 20 50 20ZM50 32C59.9 32 68 40.1 68 50C68 59.9 59.9 68 50 68C40.1 68 32 59.9 32 50C32 40.1 40.1 32 50 32Z" fill="white"/><circle cx="50" cy="50" r="10" fill="%2378BE20"/></svg>`,
  },
  {
    name: 'TATA AIG / Tata AIA',
    insurerKeywords: ['tata', 'tata aig', 'tata aia'],
    bgGradient: 'from-blue-800 to-indigo-900',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23003087"/><path d="M20 30H80V42H56V80H44V42H20V30Z" fill="white"/><circle cx="50" cy="20" r="6" fill="%2300A3E0"/></svg>`,
  },
  {
    name: 'SBI General / Life',
    insurerKeywords: ['sbi', 'sbi general', 'sbi life'],
    bgGradient: 'from-sky-600 to-blue-800',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%232A75D3"/><circle cx="50" cy="50" r="30" fill="white"/><circle cx="50" cy="50" r="14" fill="%230A2540"/><rect x="46" y="50" width="8" height="30" fill="%230A2540"/></svg>`,
  },
  {
    name: 'Bajaj Allianz',
    insurerKeywords: ['bajaj', 'bajaj allianz'],
    bgGradient: 'from-blue-700 to-sky-900',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23004A99"/><path d="M20 70L50 25L80 70H65L50 48L35 70H20Z" fill="white"/><circle cx="50" cy="35" r="5" fill="%23FFC72C"/></svg>`,
  },
  {
    name: 'Max Life Insurance',
    insurerKeywords: ['max', 'max life'],
    bgGradient: 'from-rose-600 to-red-800',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23D32F2F"/><path d="M25 30L50 70L75 30H62L50 50L38 30H25Z" fill="white"/><circle cx="50" cy="22" r="5" fill="%23FFD54F"/></svg>`,
  },
];

export function getInsurerLogoUrl(insurerName: string, customLogoUrl?: string): string {
  if (customLogoUrl && customLogoUrl.trim() !== '') {
    return customLogoUrl;
  }
  const cleanName = (insurerName || '').toLowerCase();
  const matched = INSURER_LOGO_PRESETS.find((preset) =>
    preset.insurerKeywords.some((kw) => cleanName.includes(kw))
  );
  if (matched) {
    return matched.logoSvg;
  }
  // Generic shield logo fallback
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%231E293B"/><path d="M50 20L75 30V50C75 66 64 78 50 83C36 78 25 66 25 50V30L50 20Z" fill="%232563EB"/><path d="M45 55L38 48L33 53L45 65L68 42L63 37L45 55Z" fill="white"/></svg>`;
}
