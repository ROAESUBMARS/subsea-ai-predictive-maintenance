import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  DollarSign,
  Calendar,
  ShieldCheck,
  TrendingDown,
  Anchor,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Camera,
  UserCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { telemetryEngine } from '../services/telemetryEngine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ConditionBasedInspectionROI({ latestData, onSelectAsset }) {
  const [authorizedMissions, setAuthorizedMissions] = useState({
    'SCR-01': true,
    'PFL-101': false,
    'GEL-201': false
  });
  const [engineerSigner, setEngineerSigner] = useState('Chief Subsea Integrity Engineer (M. Chen, Simulated)');
  const [justificationNote, setJustificationNote] = useState('Verified against acoustic DAS anomaly threshold and DNV-RP-F116 guidelines.');

  if (!latestData) return null;

  const cbi = latestData.cbiCostAnalysis || {
    scheduledInspectionIntervalMonths: 24,
    conditionBasedInspectionIntervalMonths: 54,
    rovSpreadDayRateUsd: 115000,
    vesselFuelCostPerDayUsd: 22000,
    daysSavedYtd: 28,
    totalCostAvoidanceUsd: 3836000,
    carbonEmissionsMitigatedTons: 640,
    riskReductionPct: 78.4,
    plannedNextCbiTarget: 'SCR-01 Touchdown Zone (KP 2.85) Ultrasonic Phased Array Scan'
  };

  const auditLog = latestData.hitlAuditLog || [];

  // 1. Annual Cost Comparison (Calendar vs AI Condition-Based)
  const costComparisonData = {
    labels: ['2023 Actual (Calendar)', '2024 Actual (Calendar)', '2025 AI-CBI Pilot', '2026 AI-CBI Forecast'],
    datasets: [
      {
        label: 'Inspection OPEX ($ Millions)',
        data: [5.85, 6.20, 2.45, 1.95],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(0, 242, 254, 0.8)',
          'rgba(16, 185, 129, 0.85)'
        ],
        borderColor: '#00f2fe',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // 2. Before/After OPEX by Subsea Asset (Calendar vs CBI)
  const assetOpexComparisonData = {
    labels: ['Blowout Preventer (BOP)', 'SCR Riser & TDZ', 'Subsea Manifold (SM-01)'],
    datasets: [
      {
        label: 'Calendar-based Inspection ($k / yr)',
        data: [527, 407, 300],
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Condition-Based Inspection ($k / yr)',
        data: [307, 233, 173],
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  // 3. Breakdown of Savings
  const savingsBreakdownData = {
    labels: ['DSV Vessel Day Rates', 'ROV Crew Spread', 'Fuel & Marine Logistics', 'Unscheduled Deferment Avoided'],
    datasets: [
      {
        data: [55, 20, 15, 10],
        backgroundColor: [
          'rgba(0, 242, 254, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(168, 85, 247, 0.85)'
        ],
        borderWidth: 0
      }
    ]
  };

  const handleToggleAuthorization = (mission) => {
    const isAuth = authorizedMissions[mission.id];
    if (!isAuth && telemetryEngine.authorizeMission) {
      telemetryEngine.authorizeMission({
        missionId: mission.id,
        missionTitle: mission.title,
        engineerName: engineerSigner,
        reason: justificationNote || mission.reason
      });
    }
    setAuthorizedMissions(prev => ({
      ...prev,
      [mission.id]: !prev[mission.id]
    }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-emerald-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Condition-Based Inspection (CBI) Economics & Human-in-the-Loop Sign-Off
              </h2>
              <span className="badge badge-normal text-[10px] font-mono py-0.5 px-2">
                STAGE 4 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Replacing Fixed 2-Year Calendar Surveys with Risk-Targeted Dispatches • Stage 3 Model Feedback Loop
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono">
          <span className="text-slate-400">ANNUAL OPEX COST REDUCTION: </span>
          <span className="text-emerald-400 font-bold text-sm">-${(cbi.totalCostAvoidanceUsd / 1000000).toFixed(2)}M USD</span>
        </div>
      </div>

      {/* 4 Financial & Carbon KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">TOTAL COST AVOIDANCE</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-heading my-1">
            ${(cbi.totalCostAvoidanceUsd / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-slate-400 font-mono">-$3.83M vs Baseline Calendar Surveys</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">DSV VESSEL DAYS SAVED</div>
          <div className="text-2xl font-extrabold text-cyan-300 font-heading my-1">
            {cbi.daysSavedYtd} Days
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Spread Rate: $115k/day + Fuel</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">CARBON EMISSIONS MITIGATED</div>
          <div className="text-2xl font-extrabold text-purple-300 font-heading my-1">
            {cbi.carbonEmissionsMitigatedTons} t CO₂e
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Reduced Marine Vessel Fuel Burn</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">INSPECTION CADENCE EXTENSION</div>
          <div className="text-2xl font-extrabold text-amber-300 font-heading my-1">
            54 Months
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Extended from 24 Months (2.25X)</div>
        </div>
      </div>

      {/* Human-in-the-Loop (HITL) Engineer Authorization Gate Panel */}
      <div className="glass-panel p-4 border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Human-in-the-Loop (HITL) Subsea ROV/AUV Authorization Gate
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Mandatory engineer verification and digital sign-off before mobilizing high-cost subsea spreads ($115,000/day).
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            SIGNER: <span className="text-cyan-300 font-bold">{engineerSigner}</span>
          </div>
        </div>

        {/* Engineer Identity & Mandatory Justification Form Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-[#0a0e17] rounded-lg border border-slate-800 text-xs font-mono">
          <div>
            <label htmlFor="hitl-authorizer" className="text-slate-300 block mb-1 text-[10px] font-bold">AUTHORIZING ENGINEER NAME & TITLE</label>
            <input
              id="hitl-authorizer"
              type="text"
              value={engineerSigner}
              onChange={(e) => setEngineerSigner(e.target.value)}
              className="w-full bg-[#111a2e] border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label htmlFor="hitl-justification" className="text-slate-300 block mb-1 text-[10px] font-bold">MANDATORY ENGINEERING BASIS / JUSTIFICATION</label>
            <input
              id="hitl-justification"
              type="text"
              value={justificationNote}
              onChange={(e) => setJustificationNote(e.target.value)}
              className="w-full bg-[#111a2e] border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-400"
              placeholder="State regulatory or physics threshold..."
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            {
              id: 'SCR-01',
              title: 'SCR-01 Riser Touchdown Zone (KP 2.85) Phased-Array UT Survey',
              reason: 'Model Flagged: 0.38 Hz VIV lock-in modal excitation. Target: Verify Paris crack growth rate at dynamic seabed arc.',
              cost: '$115,000',
              vesselSpread: 'Subsea 7 Deep Constructor (DSV)',
              tooling: 'Dual Phased Array UT + HD Photogrammetry'
            },
            {
              id: 'PFL-101',
              title: 'PFL-101 PLET Elbow (KP 12.4) Ultrasonic Wall Thickness Scan',
              reason: 'Model Flagged: Sand breakthrough (84.5 PPM) at 11.8 m/s annular velocity. Target: Confirm remaining wall thickness (17.8 mm).',
              cost: '$115,000',
              vesselSpread: 'ROV Hercules-IV Workclass Spread',
              tooling: 'Rotary Ultrasonic Clamp (AUT)'
            },
            {
              id: 'GEL-201',
              title: 'GEL-201 Free-Span Seabed Vortex Suppression Strakes Check',
              reason: 'Model Flagged: Benthic current velocity elevation. Target: Verify aerodynamic fairings & helical strakes integrity.',
              cost: '$85,000',
              vesselSpread: 'AUV Autonomous Survey Drone',
              tooling: 'Multibeam Bathymetry + Laser Profiler'
            }
          ].map(mission => {
            const isAuthorized = authorizedMissions[mission.id];
            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all ${
                  isAuthorized
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-[#050e20] border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isAuthorized ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {isAuthorized ? 'AUTHORIZED & GATED' : 'PENDING ENGINEER SIGN-OFF'}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">{mission.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{mission.reason}</p>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-3">
                    <span>VESSEL: <strong className="text-slate-300">{mission.vesselSpread}</strong></span>
                    <span>TOOLING: <strong className="text-cyan-400">{mission.tooling}</strong></span>
                    <span>EST. COST: <strong className="text-emerald-400">{mission.cost}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAuthorization(mission)}
                    aria-label={`${isAuthorized ? 'Revoke authorization for' : 'Authorize ROV dispatch for'} ${mission.title}`}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      isAuthorized
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    {isAuthorized ? 'Sign-Off Approved' : 'Authorize ROV Dispatch'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Immutable Audit Log Table */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                Immutable Mission Authorization Audit Log
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              CRYPTOGRAPHIC INTEGRITY: SHA-256 HASH CHAIN
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="pb-2">LOG ID</th>
                  <th className="pb-2">TIMESTAMP</th>
                  <th className="pb-2">MISSION TARGET</th>
                  <th className="pb-2">AUTHORIZING ENGINEER</th>
                  <th className="pb-2">JUSTIFICATION BASIS</th>
                  <th className="pb-2">HASH</th>
                  <th className="pb-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLog.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-3 text-center text-slate-500">
                      No past mission authorizations recorded.
                    </td>
                  </tr>
                ) : (
                  auditLog.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 font-bold text-cyan-300">{entry.id}</td>
                      <td className="py-2.5 text-slate-400 text-[11px] whitespace-nowrap">{entry.timestamp}</td>
                      <td className="py-2.5 text-white font-sans max-w-[180px] truncate">{entry.missionTitle || entry.missionId}</td>
                      <td className="py-2.5 text-slate-300 whitespace-nowrap">{entry.engineerName}</td>
                      <td className="py-2.5 text-slate-400 font-sans text-[11px] max-w-[220px] truncate" title={entry.reason}>{entry.reason}</td>
                      <td className="py-2.5 text-emerald-400/80 text-[10px] font-mono">{entry.hash}</td>
                      <td className="py-2.5 text-right whitespace-nowrap">
                        <span className="badge badge-normal text-[9px] py-0.5 px-2">
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 3 Comparison Charts: OPEX Trend, Asset-by-Asset Before/After, & Savings Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Cost Comparison Bar Chart */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                Annual OPEX Trend (Calendar vs AI-CBI)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">-68% COST</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-3">
              Transition from blind $6M/yr vessel charters to AI-targeted campaigns.
            </p>

            <div className="h-[220px] w-full">
              <Bar
                data={costComparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 } } },
                    y: {
                      title: { display: true, text: '$ Millions USD', color: '#64748b', font: { size: 9 } },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Asset-by-Asset Before/After Grouped Bar Comparison */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Asset OPEX: Calendar vs CBI
              </h3>
              <span className="text-[10px] font-mono text-cyan-300">-42% AVERAGE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-3">
              BOP: $527k vs $307k • Riser: $407k vs $233k • Manifold: $300k vs $173k.
            </p>

            <div className="h-[220px] w-full">
              <Bar
                data={assetOpexComparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 } } },
                    y: {
                      title: { display: true, text: 'OPEX ($k USD)', color: '#64748b', font: { size: 9 } },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 }, boxWidth: 10 }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Savings Category Doughnut */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                OPEX Savings Distribution
              </h3>
              <span className="badge badge-cyan text-[10px] font-mono">$3.83M SAVED</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mb-3">
              Cost avoidance breakdown across vessel days, crew, fuel & deferment.
            </p>

            <div className="h-[220px] w-full flex items-center justify-center">
              <Doughnut
                data={savingsBreakdownData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 }, boxWidth: 10 }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
