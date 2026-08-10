'use client';

import React from 'react';
import { AnalyticsMetrics } from '@/lib/types';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Users, DollarSign, Award, Percent } from 'lucide-react';

interface AnalyticsOverviewProps {
  metrics: AnalyticsMetrics;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      
      {/* Panel Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Overview</h2>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              Real-Time Pipeline Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Performance analytics tracking proposal conversion rates, category distribution, advisor volume, and growth.
          </p>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Total Proposals</span>
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.totalProposals}</div>
          <span className="text-[10px] text-emerald-600 font-medium">↑ Active pipeline</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Total Premium Volume</span>
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(metrics.totalPremiumVolume / 1000).toFixed(1)}k
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Gross Written Premium</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Proposal Conversion</span>
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700">{metrics.conversionRate}%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Target: &gt; 30%</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Active Advisors</span>
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.activeAdvisors}</div>
          <span className="text-[10px] text-slate-500 font-medium">Senior & Wealth Advisors</span>
        </div>

      </div>

      {/* 2x2 Recharts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Proposal Conversion Rate (Pie/Donut) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-1">1. Proposal Status & Conversion Rate</h3>
          <p className="text-[11px] text-slate-500 mb-4">Breakdown of proposals by status (Draft, Sent, Purchased, Declined)</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={metrics.statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category-wise Distribution (Bar) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-1">2. Category-Wise Proposal Volume</h3>
          <p className="text-[11px] text-slate-500 mb-4">Distribution across Health, Term, Motor, and Travel categories</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={metrics.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" textAnchor="middle" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e50a2" radius={[6, 6, 0, 0]} name="Proposals Count" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Advisor Performance (Bar) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-1">3. Advisor Performance Comparison</h3>
          <p className="text-[11px] text-slate-500 mb-4">Proposals generated vs GWP Volume (in ₹ Thousands) by advisor</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={metrics.advisorPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="proposals" fill="#3b82f6" name="Proposals" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volume" fill="#10b981" name="Volume (₹k)" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Premium Volume (Line) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-1">4. Monthly Premium Volume Trend</h3>
          <p className="text-[11px] text-slate-500 mb-4">Growth trajectory of Gross Written Premium over recent months</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={3} name="Volume (₹k)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
