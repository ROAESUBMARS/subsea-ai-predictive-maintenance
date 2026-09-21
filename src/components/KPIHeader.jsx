import React from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Clock,
  DollarSign,
  TrendingDown,
  Layers,
  Thermometer,
  Radio,
  Sparkles
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function KPIHeader({ latestData, onSelectAsset }) {
  if (!latestData || !latestData.assets) return null;

  const assetKeys = Object.keys(latestData.assets);
  const totalAssets = assetKeys.length;

  let totalHealth = 0;
  let criticalCount = 0;
  let warningCount = 0;
  let minRulAsset = null;
  let minRulDays = 9999;
  let minWallMm = 99;

  assetKeys.forEach(key => {
    const a = latestData.assets[key];
    totalHealth += a.healthScore;
    if (a.status === 'CRITICAL') criticalCount++;
    else if (a.status === 'WARNING') warningCount++;

    if (a.rulDays < minRulDays) {
      minRulDays = a.rulDays;
      minRulAsset = key;
    }

    if (a.wallThicknessMm && a.wallThicknessMm < minWallMm) {
      minWallMm = a.wallThicknessMm;
    }
  });

  const avgHealth = Math.round(totalHealth / totalAssets);
  const healthBadge = avgHealth >= 90
    ? 'badge-normal'
    : (avgHealth >= 70 ? 'badge-warning' : 'badge-critical');

  const pflAsset = latestData.assets['PFL-101'] || latestData.assets[assetKeys[0]];
  const cbiData = latestData.cbiCostAnalysis || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
      
      {/* 1. Fleet Subsea Flowline & Riser Health Index */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Flowline & Riser Health</span>
          <span className={`badge ${healthBadge}`}>
            {avgHealth >= 90 ? 'OPTIMAL' : (avgHealth >= 70 ? 'DEGRADED' : 'HIGH RISK')}
          </span>
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-3xl font-heading font-extrabold text-white tracking-tight">
            {avgHealth}%
          </span>
          <span className="text-xs text-slate-400 font-mono">/ 100</span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              avgHealth >= 90 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' :
              avgHealth >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
              'bg-gradient-to-r from-rose-600 to-red-500'
            }`}
            style={{ width: `${avgHealth}%` }}
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>6 Deepwater Lines</span>
          <span className="text-cyan-400">99.94% Reliability</span>
        </div>
      </div>

      {/* 2. Critical Anomaly Alerts */}
      <div className={`glass-panel p-4 flex flex-col justify-between relative ${criticalCount > 0 ? 'glass-panel-crit' : (warningCount > 0 ? 'glass-panel-warn' : '')}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">AI Anomaly Alerts</span>
          <AlertOctagon className={`w-4 h-4 ${criticalCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
        </div>

        <div className="my-2 flex items-baseline gap-3">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-heading font-extrabold ${criticalCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {criticalCount}
            </span>
            <span className="text-xs text-rose-400 font-mono">P1 Crit</span>
          </div>
          <span className="text-slate-600 font-mono">/</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-heading font-bold ${warningCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {warningCount}
            </span>
            <span className="text-xs text-amber-400 font-mono">P2 Warn</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Leak / Hydrate / VIV:</span>
          <span className={criticalCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
            {criticalCount > 0 ? 'ACTIVE HAZARD' : 'ALL CLEAR'}
          </span>
        </div>
      </div>

      {/* 3. Minimum RUL & Wall Thickness */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Min RUL & Pipe Wall</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className={`text-3xl font-heading font-extrabold ${minRulDays < 90 ? 'text-rose-400' : 'text-cyan-300'}`}>
            {minRulDays}
          </span>
          <span className="text-xs text-slate-400 font-mono">days ({minRulAsset})</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Min Wall Thickness:</span>
          <span className={minWallMm < 18 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {minWallMm?.toFixed(1)} mm
          </span>
        </div>
      </div>

      {/* 4. Hydrate Margin Buffer (ΔT) */}
      <div className={`glass-panel p-4 flex flex-col justify-between ${pflAsset.hydrateMarginDeltaTC < 0 ? 'glass-panel-crit' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Hydrate Safety Margin</span>
          <Thermometer className="w-4 h-4 text-amber-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className={`text-3xl font-heading font-extrabold ${pflAsset.hydrateMarginDeltaTC < 0 ? 'text-rose-400' : 'text-white'}`}>
            {pflAsset.hydrateMarginDeltaTC > 0 ? `+${pflAsset.hydrateMarginDeltaTC?.toFixed(1)}` : pflAsset.hydrateMarginDeltaTC?.toFixed(1)}°C
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Dynamic MEG Dosing:</span>
          <span className="text-amber-300 font-bold">{pflAsset.megInjectionRateLh || 38} L/h</span>
        </div>
      </div>

      {/* 5. Condition-Based Inspection Cost Savings */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">CBI Cost Avoidance</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-3xl font-heading font-extrabold text-emerald-400">
            ${((cbiData.totalCostAvoidanceUsd || 3836000) / 1000000).toFixed(2)}M
          </span>
          <span className="text-xs text-slate-400 font-mono">YTD</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>ROV Days Saved:</span>
          <span className="text-emerald-400 font-bold">{cbiData.daysSavedYtd || 28} Days</span>
        </div>
      </div>

    </div>
  );
}
