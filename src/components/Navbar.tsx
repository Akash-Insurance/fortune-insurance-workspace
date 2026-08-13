'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  ShieldCheck, 
  LogOut, 
  BarChart3, 
  Layers, 
  FileText, 
  Scale, 
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Check,
  Zap,
  Star
} from 'lucide-react';

interface NavbarProps {
  activeView: 'dashboard' | 'library' | 'proposals' | 'compare' | 'analytics' | 'reports' | 'settings';
  setActiveView: (view: 'dashboard' | 'library' | 'proposals' | 'compare' | 'analytics' | 'reports' | 'settings') => void;
  compareCount: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeView, 
  setActiveView, 
  compareCount,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const { user, logout, switchRole, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  interface NavItem {
    id: 'dashboard' | 'library' | 'proposals' | 'compare' | 'analytics' | 'reports' | 'settings';
    label: string;
    icon: React.ElementType;
    desc: string;
    badge?: number | string;
    tag?: string;
    color: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Scheme Library (Home)', icon: ShieldCheck, desc: 'Flagship policies across top IRDAI insurers', color: 'from-blue-500 to-indigo-600' },
    { id: 'proposals', label: 'Client Proposals', icon: FileText, desc: 'Create, track and export custom proposals', color: 'from-emerald-500 to-teal-600' },
    { id: 'compare', label: 'Compare Schemes', icon: Scale, badge: compareCount > 0 ? compareCount : undefined, desc: 'Side-by-side spec matrix & cappings', color: 'from-purple-500 to-indigo-600' },
    { id: 'analytics', label: 'Analytics Overview', icon: BarChart3, desc: 'Conversion metrics & portfolio volumes', color: 'from-cyan-500 to-blue-600' },
    { id: 'reports', label: 'Advisor Reports', icon: Users, desc: 'Advisor performance & client logs', color: 'from-amber-500 to-orange-600' },
    { id: 'settings', label: 'Scheme Settings', icon: Settings, tag: 'Admin', desc: 'Create, edit or delete insurance schemes', color: 'from-rose-500 to-pink-600' },
  ];

  const handleSelectView = (view: typeof navItems[number]['id']) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl text-white shadow-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Header Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleSelectView('dashboard')}
          >
            <img 
              src="/logo.jpeg" 
              alt="Fortune Investment Services" 
              className="h-10 w-auto object-contain bg-white rounded p-1"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-heading">Fortune</span>
                <span className="text-[10px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30 tracking-wide uppercase">
                  Advisor Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium">
                Fortune Investment Services Pvt Ltd • IRDAI Registered
              </p>
            </div>
          </div>

          {/* Right Header Controls: Theme Toggle + Menu Button + Profile */}
          <div className="flex items-center gap-3 relative" ref={menuRef}>
            
            {/* Quick Dark/Light Mode Switcher */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 text-xs font-semibold hover:border-amber-400/40 shadow-sm"
                title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span className="hidden sm:inline text-amber-300 font-bold">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-300" />
                    <span className="hidden sm:inline text-slate-300 font-bold">Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Menu Trigger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg transform hover:-translate-y-0.5 ${
                menuOpen 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-blue-500/30'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/20'
              }`}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Navigation Menu</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-800/90 pl-3 pr-2 py-1.5 rounded-xl border border-slate-700/80 shadow-inner">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-extrabold text-white shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{user.email}</div>
              </div>
              
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* ================= DROPDOWN MENU DRAWER ================= */}
            {menuOpen && (
              <div className="absolute right-0 top-14 w-84 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                
                {/* Menu Header Bar */}
                <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider font-heading">
                      Fortune Suite Portal
                    </span>
                  </div>
                  
                  {/* Quick Role Switcher Chip */}
                  <button
                    onClick={() => switchRole(isAdmin ? 'advisor' : 'admin')}
                    className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40 hover:bg-purple-500/30 transition-all"
                    title="Click to switch access role"
                  >
                    Role: {user.role} ⟳
                  </button>
                </div>

                {/* Vertical Navigation List */}
                <div className="p-2 space-y-1.5 max-h-[75vh] overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id || (activeView === 'library' && item.id === 'dashboard');

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectView(item.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3.5 group relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/25 to-indigo-600/20 border border-blue-500/50 text-white shadow-md'
                            : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 bg-gradient-to-br ${item.color} text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white block">{item.label}</span>
                            {item.badge && (
                              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                                {item.badge}
                              </span>
                            )}
                            {item.tag && (
                              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-rose-400/30 uppercase">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                        
                        {isActive && (
                          <div className="self-center">
                            <Check className="w-4 h-4 text-blue-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Theme Toggle Switch */}
                {onToggleDarkMode && (
                  <div className="p-3 bg-slate-950 border-t border-slate-800">
                    <button
                      onClick={() => {
                        onToggleDarkMode();
                      }}
                      className="w-full p-3 bg-slate-900 hover:bg-slate-850 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-200 transition-all border border-slate-800 shadow-inner"
                    >
                      <div className="flex items-center gap-2.5">
                        {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                        <span className="font-bold">{isDarkMode ? 'Dark Theme Enabled' : 'Light Theme Enabled'}</span>
                      </div>
                      
                      <div className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${isDarkMode ? 'bg-indigo-600 justify-end' : 'bg-slate-600 justify-start'}`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                      </div>
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
