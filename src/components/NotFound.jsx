import React from 'react';
import { AlertOctagon, ArrowLeft, LayoutDashboard, Layers, Bell, Compass, Radio } from 'lucide-react';

export default function NotFound({ currentPath = '', onNavigateHome, onSelectTab }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-xl w-full p-8 md:p-10 border border-slate-800/80 bg-[#0b1222]/90 backdrop-blur-xl rounded-xl shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>404 // TELEMETRY LINK LOSS</span>
          </div>
          <span className="text-[11px] font-mono text-slate-300 tracking-wider">
            SUBSEAGUARD OPS // DNV-RP-F116
          </span>
        </div>

        {/* Icon & Heading */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
              Route Not Found
            </h1>
            <p className="text-sm text-slate-300 mt-1 font-sans">
              The requested subsea operational terminal or bathymetric asset route does not exist.
            </p>
          </div>
        </div>

        {/* Invalid Path Display Box */}
        <div className="my-5 p-3.5 rounded-lg bg-[#070b14] border border-slate-800 font-mono text-xs space-y-1">
          <div className="text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-rose-400" />
            Unresolved Endpoint
          </div>
          <div className="text-rose-300 font-semibold truncate">
            {currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/unknown')}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
          Verify the URL path or return to primary command stations below. All deepwater flowline sensors, riser acoustic nodes, and ROV dive operations remain nominal on the primary control loop.
        </p>

        {/* Primary Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm font-sans flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Control Room Dashboard</span>
          </button>

          {/* Quick Alternate Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('digital-twin')}
              className="py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-sans text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Digital Twin</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('alerting-escalation')}
              className="py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-sans text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Alerts</span>
            </button>
          </div>
        </div>

        {/* Footer Diagnostic Ping */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-cyan-400" />
            PTP Clock: Locked (±8ns)
          </span>
          <span>HTTP 404 // SPA ROUTER</span>
        </div>

      </div>
    </div>
  );
}
