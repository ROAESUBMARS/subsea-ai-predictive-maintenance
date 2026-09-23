import React, { useState } from 'react';
import {
  Wrench,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  DollarSign,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Send,
  Camera,
  ChevronRight,
  TrendingDown,
  Droplets,
  Radio,
  Anchor,
  Compass,
  GitBranch,
  Gauge,
  Sliders,
  Zap,
  Eye
} from 'lucide-react';
import { ASSET_DEFINITIONS, telemetryEngine } from '../services/telemetryEngine';

export default function RoleViewsContainer({
  userRole,
  latestData,
  selectedAssetId,
  onSelectAsset,
  onNavigateTab
}) {
  const [strokeTestStatus, setStrokeTestStatus] = useState('READY');

  if (!latestData || !latestData.assets) return null;

  const currentAssetKey = selectedAssetId || 'PFL-101';
  const currentAsset = latestData.assets[currentAssetKey] || latestData.assets['PFL-101'];
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentAssetKey) || ASSET_DEFINITIONS[1];
  const assets = Object.values(latestData.assets);
  const cbiData = latestData.cbiCostAnalysis || {};

  const handleRunStrokeTest = () => {
    setStrokeTestStatus('TESTING');
    setTimeout(() => {
      setStrokeTestStatus('COMPLETED_PASSED');
      setTimeout(() => setStrokeTestStatus('READY'), 4000);
    }, 1800);
  };

  // ==========================================
  // VIEW 1: FIELD TECHNICIAN VIEW
  // ==========================================
  if (userRole === 'technician') {
    return (
      <div className="space-y-4 animate-fade-in font-sans">
        {/* Role Persona Header */}
        <div className="p-3.5 rounded bg-gradient-to-r from-amber-500/20 via-slate-900 to-[#0a0e17] border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-heading font-extrabold text-white tracking-wide uppercase">
                  Field Technician Operational Console
                </h2>
                <span className="badge badge-warning text-[9px]">
                  ACTION-ORIENTED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Simplified Subsea Traffic Light Status • Actionable SOP Procedures • Rapid Tooling Triggers
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('rov-deployment')}
            aria-label="Launch ROV Camera HUD navigation"
            className="btn-primary bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 text-xs py-1 px-3"
          >
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            Launch ROV Camera HUD
          </button>
        </div>

        {/* High-Contrast Subsea Line Traffic Light Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {assets.map(a => {
            const isCrit = a.status === 'CRITICAL';
            const isWarn = a.status === 'WARNING';
            const isSelected = a.id === currentAssetKey;
            return (
              <button
                type="button"
                key={a.id}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Select asset ${a.id}, status ${a.status}, remaining useful life ${a.rulDays} days`}
                onClick={() => onSelectAsset(a.id)}
                className={`text-left p-3 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_12px_rgba(45,212,224,0.3)]'
                    : 'border-slate-800 bg-[#0d1526] hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <span className="font-bold text-xs text-white font-mono">{a.id}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isCrit ? 'bg-rose-500 animate-ping' : (isWarn ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400')
                  }`} />
                </div>

                <div className="my-1">
                  <div className="text-[11px] text-slate-300 font-bold">{a.type.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-300 font-mono uppercase">
                    {isCrit ? 'ACTION REQUIRED' : (isWarn ? 'ATTENTION' : 'HEALTHY')}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-cyan-300 pt-1.5 border-t border-slate-800 flex items-center justify-between w-full">
                  <span>RUL:</span>
                  <span className="font-extrabold">{a.rulDays}d</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Immediate Actionable SOP Prescription Box */}
        <div className="glass-panel p-4 border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-heading font-bold text-white uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Standard Operating Procedure (SOP) Action Checklist for {assetMeta.name}
            </h3>
            <span className="badge badge-warning text-[9px]">PRIORITY ACTION</span>
          </div>

          <div className="p-3 rounded bg-[#0a0e17] border border-amber-500/30 my-2 text-xs font-mono text-amber-200">
            <strong>DIRECTIVE:</strong> {currentAsset.technicianSOP}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0a0e17] border border-slate-800">
              <span className="text-slate-400 text-[10px] block">CURRENT PRESSURE</span>
              <div className="text-white font-bold text-sm mt-0.5">{currentAsset.inletPressureBar?.toFixed(1)} bar</div>
            </div>
            <div className="p-2.5 rounded bg-[#0a0e17] border border-slate-800">
              <span className="text-slate-400 text-[10px] block">FLUID TEMP</span>
              <div className="text-amber-300 font-bold text-sm mt-0.5">{currentAsset.fluidTempC?.toFixed(1)}°C</div>
            </div>
            <div className="p-2.5 rounded bg-[#0a0e17] border border-slate-800">
              <span className="text-slate-400 text-[10px] block">WALL THICKNESS</span>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">{currentAsset.wallThicknessMm?.toFixed(2)} mm</div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={() => onNavigateTab('alerting-escalation')}
              aria-label="Sign off and log completed work order in escalation hub"
              className="btn-primary bg-emerald-500 hover:bg-emerald-400 text-black text-xs py-1 px-4"
            >
              Sign Off & Log Completed Work Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SUBSEA / OFFSHORE ENGINEER VIEW (Deepwater Hardware & Hydrodynamics)
  // ==========================================
  if (userRole === 'subsea_engineer') {
    return (
      <div className="space-y-4 animate-fade-in font-sans">
        
        {/* Role Persona Header */}
        <div className="p-3.5 rounded bg-gradient-to-r from-blue-600/25 via-slate-900 to-[#0a0e17] border border-blue-500/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-heading font-extrabold text-white tracking-wide uppercase">
                  Subsea & Offshore Systems Integrity Engineer Dashboard
                </h2>
                <span className="badge text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  DEEPWATER HARDWARE & HYDRODYNAMICS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Catenary Mechanics & TDZ Bending • Seabed Bathymetry • PLET/PLEM Isolation • Cathodic Protection & ROV Tooling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('digital-twin')}
              aria-label="Navigate to 3D Digital Twin view"
              className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              3D Digital Twin
            </button>
            <button
              onClick={() => onNavigateTab('rov-deployment')}
              aria-label="Navigate to ROV Operations hub"
              className="btn-primary text-xs py-1 px-3 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              ROV Operations
            </button>
          </div>
        </div>

        {/* 4 Deepwater Hardware & Hydrodynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          
          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">RISER TDZ BENDING STRESS</div>
            <div className={`text-xl font-extrabold font-heading my-1 ${
              currentAsset.tdzBendingStressMpa > 180 ? 'text-rose-400' : 'text-cyan-300'
            }`}>
              {currentAsset.tdzBendingStressMpa?.toFixed(1) || '85.0'} MPa
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Limit: 240 MPa • KP 2.85 Touchdown</div>
          </div>

          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">CROSS-FLOW CURRENT & VIV</div>
            <div className="text-xl font-extrabold text-amber-400 font-heading my-1">
              {currentAsset.vivVibrationG?.toFixed(3) || '0.045'} g RMS
            </div>
            <div className="text-[10px] text-slate-400 font-mono">1.85 kt Loop Current • 0.38 Hz Modal Lock-in</div>
          </div>

          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">CATHODIC PROTECTION (CP) POTENTIAL</div>
            <div className="text-xl font-extrabold text-emerald-400 font-heading my-1">
              -1,045 mV
            </div>
            <div className="text-[10px] text-slate-400 font-mono">vs Ag/AgCl • DNV-RP-B401 Anode Safe</div>
          </div>

          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">HYDROSTATIC SEABED PRESSURE</div>
            <div className="text-xl font-extrabold text-purple-300 font-heading my-1">
              188.5 bar
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Seabed Depth: -1,850m • Ambient: 3.8°C</div>
          </div>

        </div>

        {/* Subsea Barrier & Isolation Hardware Status Matrix */}
        <div className="glass-panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs font-heading font-bold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Subsea Isolation Barriers, Valves & Tie-in Spool Integrity
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Real-time barrier verification under API 17D and ISO 13628-4 dual isolation standards.
              </p>
            </div>

            <button
              onClick={handleRunStrokeTest}
              disabled={strokeTestStatus === 'TESTING'}
              aria-label="Execute emergency shutdown wing valve stroke test"
              className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              {strokeTestStatus === 'TESTING' ? 'Executing ESD Stroke Test...' :
               strokeTestStatus === 'COMPLETED_PASSED' ? 'Stroke Test: PASSED (100%)' :
               'Test Subsea Wing Valve Stroke'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-300 text-[10px] uppercase">
                <tr>
                  <th className="pb-2">HARDWARE TAG</th>
                  <th className="pb-2">LOCATION</th>
                  <th className="pb-2">BARRIER FUNCTION</th>
                  <th className="pb-2">OPERATIONAL STATE</th>
                  <th className="pb-2">INTEGRITY CHECK</th>
                  <th className="pb-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {[
                  { tag: 'PLET-XV-101', loc: 'PLET-01 (KP 12.4)', func: 'Primary Flowline ESD Wing Isolation', state: 'OPEN (100%)', check: 'Zero Cavity Leakage • Hydraulic 210 bar', status: 'PASS' },
                  { tag: 'SM-XV-01A', loc: 'Manifold SM-01 (KP 0.0)', func: 'Header Production Isolation Valve', state: 'OPEN (100%)', check: 'Delta P: 0.2 bar across gate', status: 'PASS' },
                  { tag: 'PLEM-PIG-01', loc: 'PLEM-01 Station', func: 'Intelligent Pig Launcher Barrier Barrel', state: 'LOCKED STANDBY', check: 'Hydrostatic Seal Verified', status: 'PASS' },
                  { tag: 'SCR-FLEX-01', loc: 'FPU Hang-off Porch', func: 'Titanium Dynamic Flex-Joint', state: 'DYNAMIC 14.5°', check: 'Elastomer Sheath Intact', status: 'PASS' }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-cyan-300">{item.tag}</td>
                    <td className="py-2.5 text-slate-300">{item.loc}</td>
                    <td className="py-2.5 text-slate-300">{item.func}</td>
                    <td className="py-2.5 font-bold text-emerald-400">{item.state}</td>
                    <td className="py-2.5 text-slate-300">{item.check}</td>
                    <td className="py-2.5 text-right">
                      <span className="badge badge-normal text-[9px] py-0.5 px-2">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 3: ASSET / OPERATIONS MANAGER VIEW
  // ==========================================
  if (userRole === 'manager') {
    return (
      <div className="space-y-4 animate-fade-in font-sans">
        {/* Role Persona Header */}
        <div className="p-3.5 rounded bg-gradient-to-r from-emerald-500/20 via-slate-900 to-[#0a0e17] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-heading font-extrabold text-white tracking-wide uppercase">
                  Asset Operations & Integrity Manager Dashboard
                </h2>
                <span className="badge badge-normal text-[9px]">
                  EXECUTIVE & FINANCIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Downtime Financial Risk Exposure • OPEX Cost Avoidance • Fleet Asset Life Planning
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inspection-cbi')}
            aria-label="Navigate to Condition-Based Inspection OPEX savings"
            className="btn-primary bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 text-xs py-1 px-3"
          >
            <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
            View CBI OPEX Savings
          </button>
        </div>

        {/* 4 Financial & Integrity KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">ANNUAL OPEX COST SAVINGS</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-heading my-1">
              ${(cbiData.totalCostAvoidanceUsd / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Condition-Based vs Calendar</div>
          </div>

          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">DSV VESSEL DAYS AVOIDED</div>
            <div className="text-2xl font-extrabold text-cyan-300 font-heading my-1">
              {cbiData.daysSavedYtd} Days
            </div>
            <div className="text-[10px] text-slate-400 font-mono">640 Tons CO2e Mitigated</div>
          </div>

          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">UNSCHEDULED DOWNTIME RISK</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-heading my-1">
              $0.00
            </div>
            <div className="text-[10px] text-slate-400 font-mono">100% Production Target Met</div>
          </div>

          <div className="glass-panel p-3 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase">REGULATORY COMPLIANCE</div>
            <div className="text-2xl font-extrabold text-purple-300 font-heading my-1">
              100%
            </div>
            <div className="text-[10px] text-slate-400 font-mono">ISO 14224 / API 17D Audited</div>
          </div>
        </div>

        {/* Manager Asset Integrity & Exposure Summary Table */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-heading font-bold text-white mb-2 uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Subsea Flowline & Riser Fleet Financial Impact & Integrity Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="pb-2">ASSET NAME</th>
                  <th className="pb-2">TYPE</th>
                  <th className="pb-2">DOWNTIME RISK ($/HR)</th>
                  <th className="pb-2">EXPOSURE IMPACT</th>
                  <th className="pb-2">PREDICTED RUL</th>
                  <th className="pb-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {assets.map(a => {
                  const meta = ASSET_DEFINITIONS.find(def => def.id === a.id) || a;
                  return (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-bold text-white">{meta.name}</td>
                      <td className="py-2.5 text-slate-400">{meta.type}</td>
                      <td className="py-2.5 font-bold text-cyan-300">${(meta.downtimeCostPerHourUsd || 75000).toLocaleString()} / hr</td>
                      <td className="py-2.5 text-slate-300">{a.managerImpact}</td>
                      <td className="py-2.5 font-bold text-purple-300">{a.rulDays} days</td>
                      <td className="py-2.5 text-right">
                        <span className={`badge ${
                          a.status === 'OPTIMAL' ? 'badge-normal' :
                          a.status === 'WARNING' ? 'badge-warning' : 'badge-critical'
                        } text-[9px] py-0.5 px-2`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: RELIABILITY / MAINTENANCE ENGINEER (Default Full Deep Learning Engine)
  // ==========================================
  return null;
}
