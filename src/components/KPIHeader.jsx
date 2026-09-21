import React from 'react';
import {
  AlertOctagon,
  Clock,
  DollarSign,
  Thermometer,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

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
  const isHealthy = criticalCount === 0 && warningCount === 0;

  const pflAsset = latestData.assets['PFL-101'] || latestData.assets[assetKeys[0]];
  const cbiData = latestData.cbiCostAnalysis || {};
  const rulHours = Math.round(minRulDays * 24);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-2">
      
      {/* 1. Fleet Subsea Flowline & Riser Health Index */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">Flowline & riser health</span>
          <span className={`badge ${
            avgHealth >= 90 ? 'badge-normal' : avgHealth >= 70 ? 'badge-warning' : 'badge-critical'
          }`}>
            {avgHealth >= 90 ? 'Nominal' : avgHealth >= 70 ? 'Warning' : 'Critical'}
          </span>
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-3xl font-heading font-extrabold text-white tracking-tight tabular-nums">
            {avgHealth}%
          </span>
          <span className="text-xs text-slate-400 font-sans">fleet avg</span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              avgHealth >= 90 ? 'bg-emerald-400' :
              avgHealth >= 70 ? 'bg-amber-400' :
              'bg-rose-500'
            }`}
            style={{ width: `${avgHealth}%` }}
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between font-sans">
          <span>6 deepwater lines</span>
          <span className="text-emerald-400 font-mono tabular-nums flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +1.1% vs 7d
          </span>
        </div>
      </div>

      {/* 2. Critical Anomaly Alerts */}
      <div className={`glass-panel p-4 flex flex-col justify-between relative ${
        criticalCount > 0 ? 'glass-panel-crit' : warningCount > 0 ? 'glass-panel-warn' : ''
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">AI anomaly alerts</span>
          <AlertOctagon className={`w-4 h-4 ${criticalCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
        </div>

        <div className="my-2 flex items-baseline gap-3">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-heading font-extrabold tabular-nums ${
              criticalCount > 0 ? 'text-rose-400' : 'text-white'
            }`}>
              {criticalCount}
            </span>
            <span className="text-xs text-rose-400 font-sans">P1 crit</span>
          </div>
          <span className="text-slate-600 font-mono">/</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-heading font-bold tabular-nums ${
              warningCount > 0 ? 'text-amber-400' : 'text-slate-400'
            }`}>
              {warningCount}
            </span>
            <span className="text-xs text-amber-400 font-sans">P2 warn</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-sans">
          <span>Safety status:</span>
          <span className={`font-mono ${criticalCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
            {criticalCount > 0 ? 'Active anomaly' : 'All clear'}
          </span>
        </div>
      </div>

      {/* 3. Minimum RUL & Wall Thickness */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">Min RUL & pipe wall</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className={`text-3xl font-heading font-extrabold tabular-nums ${
            minRulDays < 90 ? 'text-rose-400' : 'text-white'
          }`}>
            {minRulDays}
          </span>
          <span className="text-xs text-slate-400 font-sans">
            days <span className="font-mono text-slate-500">({rulHours.toLocaleString()} h)</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-sans">
          <span>Min wall ({minRulAsset}):</span>
          <span className={`font-mono tabular-nums ${minWallMm < 18 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
            {minWallMm?.toFixed(1)} mm
          </span>
        </div>
      </div>

      {/* 4. Hydrate Margin Buffer (ΔT) */}
      <div className={`glass-panel p-4 flex flex-col justify-between ${
        pflAsset.hydrateMarginDeltaTC < 0 ? 'glass-panel-crit' : ''
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">Hydrate safety margin</span>
          <Thermometer className="w-4 h-4 text-amber-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className={`text-3xl font-heading font-extrabold tabular-nums ${
            pflAsset.hydrateMarginDeltaTC < 0 ? 'text-rose-400' : 'text-white'
          }`}>
            {pflAsset.hydrateMarginDeltaTC > 0 ? `+${pflAsset.hydrateMarginDeltaTC?.toFixed(1)}` : pflAsset.hydrateMarginDeltaTC?.toFixed(1)}°C
          </span>
          <span className="text-xs text-slate-400 font-sans">ΔT subcooling</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-sans">
          <span>Dynamic MEG dosing:</span>
          <span className="text-amber-300 font-mono tabular-nums font-bold">
            {pflAsset.megInjectionRateLh || 38} L/h
          </span>
        </div>
      </div>

      {/* 5. Condition-Based Inspection Cost Savings */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">CBI OPEX reduction</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-3xl font-heading font-extrabold text-emerald-400 tabular-nums">
            ${((cbiData.totalCostAvoidanceUsd || 3836000) / 1000000).toFixed(2)}M
          </span>
          <span className="text-xs text-slate-400 font-sans">YTD saved</span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-sans">
          <span>Avoided vessel time:</span>
          <span className="text-emerald-400 font-mono tabular-nums font-bold">
            {cbiData.daysSavedYtd || 28} ROV days
          </span>
        </div>
      </div>

    </div>
  );
}
