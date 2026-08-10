'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, KeyRound, Mail, ArrowRight, Lock, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Fortune@2026!');
    setLoading(true);
    await login(userEmail, 'Fortune@2026!');
    setLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetSuccessMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 shadow-lg shadow-blue-500/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fortune Advisor Suite</h1>
          <p className="text-xs text-slate-400 mt-1">Fortune Investment Services Pvt Ltd • IRDAI Portal</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Advisor Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@fortune.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email || 'fortune.rahul@fortune.com');
                  setResetModalOpen(true);
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Advisor Suite'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Quick Demo Login Chips */}
        <div className="mt-8 pt-6 border-t border-slate-700/60">
          <p className="text-[11px] text-slate-400 font-semibold mb-3 text-center uppercase tracking-wider">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('fortune.admin@fortune.com')}
              className="p-2.5 bg-slate-900/90 hover:bg-slate-700/60 border border-purple-500/30 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">Admin Portal</span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">ADMIN</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 group-hover:text-slate-300">
                fortune.admin@fortune.com
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin('fortune.rahul@fortune.com')}
              className="p-2.5 bg-slate-900/90 hover:bg-slate-700/60 border border-emerald-500/30 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Rahul (Senior Advisor)</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">ADVISOR</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 group-hover:text-slate-300">
                fortune.rahul@fortune.com
              </span>
            </button>
          </div>
        </div>

        {/* Password Reset Modal */}
        {resetModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-base font-bold text-white mb-2">Reset Advisor Password</h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your registered advisor email address to receive a secure recovery link.
              </p>

              {resetSuccessMsg ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium mb-4 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{resetSuccessMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    placeholder="advisor@fortune.com"
                    required
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setResetModalOpen(false);
                        setResetSuccessMsg('');
                      }}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}

              {resetSuccessMsg && (
                <div className="text-right">
                  <button
                    onClick={() => {
                      setResetModalOpen(false);
                      setResetSuccessMsg('');
                    }}
                    className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg text-xs"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
