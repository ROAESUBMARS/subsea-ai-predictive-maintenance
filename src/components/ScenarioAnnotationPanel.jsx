import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Gauge,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  Lock,
  Layers,
  Activity
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../services/telemetryEngine';

export default function ScenarioAnnotationPanel({
  currentScenario,
  latestData,
  onNavigateTab
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const scenarioMeta = SIMULATION_SCENARIOS[currentScenario] || SIMULATION_SCENARIOS.NORMAL;
  const explanation = scenarioMeta.teachableExplanation;

  if (!explanation) return null;

  const isNominal = currentScenario === 'NORMAL';

  return (
    <div className={`rounded-xl border transition-all duration-300 shadow-xl overflow-hidden ${
      isNominal
        ? 'bg-[#061021]/90 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.08)]'
        : 'bg-[#0d0d1e]/95 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20'
    }`}>
      
      {/* Top Bar Header */}
      <div className={`px-4 py-3 flex items-center justify-between gap-3 border-b ${
        isNominal ? 'bg-[#08152b] border-cyan-500/15' : 'bg-[#15122b] border-amber-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isNominal 
              ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400' 
              : 'bg-amber-500/15 border border-amber-400/40 text-amber-400 animate-pulse'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                isNominal 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isNominal ? 'NOMINAL STATE TELEMETRY' : 'WHY THE AI MODEL FLAGGED THIS // TEACHABLE MOMENT'}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">•</span>
              <span className="text-xs font-heading font-bold text-white">
                {explanation.scenarioTitle}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">
              Target Asset: <strong className="text-cyan-300 font-mono">{explanation.assetId}</strong> — {explanation.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-sans text-slate-200 transition-colors"
            aria-expanded={isExpanded}
            aria-label="Toggle explanation panel visibility"
          >
            <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Explain Physics'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Teachable Body */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          
          {/* Summary Banner */}
          <div className="p-3 rounded-lg bg-[#040814] border border-slate-800 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-200 leading-relaxed font-sans">
              <span className="font-bold text-cyan-300">Physics Diagnosis: </span>
              {explanation.whyFlagged}
            </div>
          </div>

          {/* Grid: 2 Columns (Left: Thresholds Crossed & UQ Posterior Shift, Right: Governing Physics & SHAP) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left Column: Physical Thresholds & UQ Posterior Shift */}
            <div className="space-y-3.5">
              
              {/* 1. Threshold Crossings Table */}
              <div className="glass-panel p-3.5 border border-slate-800 bg-[#050b1a]/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono text-cyan-300 uppercase font-bold flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    Physical Thresholds & Feature Breaches
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">DNV / API Standard</span>
                </div>

                <div className="space-y-2">
                  {explanation.thresholdCrossings.map((tc, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded border text-xs font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 ${
                        tc.status === 'CRITICAL'
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                          : tc.status === 'WARNING'
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                          : 'bg-emerald-950/15 border-emerald-500/30 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tc.status === 'CRITICAL' ? 'bg-rose-400 animate-ping' : tc.status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <div>
                          <span className="font-bold text-white">{tc.metric}:</span>{' '}
                          <strong className="font-mono">{tc.measured}</strong>{' '}
                          <span className="text-slate-400 text-[10px] font-mono">(Limit: {tc.threshold})</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 shrink-0">
                        {tc.deviation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Bayesian RUL Posterior Shift */}
              <div className="glass-panel p-3.5 border border-purple-500/20 bg-[#070b1c]/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-purple-300 uppercase font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    Bayesian UQ: Remaining Useful Life (RUL) Shift
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Weibull Prior → Likelihood</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2 text-center font-mono">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">PRIOR (P50)</div>
                    <div className="text-sm font-bold text-slate-300">
                      {explanation.rulPosteriorShift.priorNominalDays}d
                    </div>
                  </div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30">
                    <div className="text-[9px] text-amber-300">P10 (DISPATCH)</div>
                    <div className="text-sm font-bold text-rose-400">
                      {explanation.rulPosteriorShift.posteriorP10Days}d
                    </div>
                  </div>
                  <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30">
                    <div className="text-[9px] text-purple-300">POSTERIOR (P50)</div>
                    <div className="text-sm font-bold text-purple-300">
                      {explanation.rulPosteriorShift.posteriorMedianDays}d
                    </div>
                  </div>
                  <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30">
                    <div className="text-[9px] text-cyan-300">P90 (UPPER)</div>
                    <div className="text-sm font-bold text-cyan-300">
                      {explanation.rulPosteriorShift.posteriorP90Days}d
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  <strong className="text-white">Engineering Meaning:</strong> {explanation.rulPosteriorShift.interpretation}
                </p>
              </div>

            </div>

            {/* Right Column: Governing Physics & SHAP Explainability */}
            <div className="space-y-3.5">
              
              {/* 3. Governing Physics Box */}
              <div className="glass-panel p-3.5 border border-cyan-500/20 bg-[#040c1d]/90 font-mono">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-cyan-300 uppercase font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Governing First-Principles Physics
                  </span>
                  <span className="text-[9px] text-cyan-400/80 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    {explanation.governingPhysics.name}
                  </span>
                </div>

                {/* Mathematical Equation Display Box */}
                <div className="p-2.5 my-2 rounded bg-[#02050e] border border-cyan-400/30 text-center font-mono text-cyan-200 text-xs tracking-wider overflow-x-auto shadow-inner">
                  {explanation.governingPhysics.equation}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {explanation.governingPhysics.description}
                </p>
              </div>

              {/* 4. Live SHAP Feature Importance Attribution */}
              <div className="glass-panel p-3.5 border border-slate-800 bg-[#050b1a]/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Feature Contribution Attributions (SHAP Φ_i)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Normalized Importance %</span>
                </div>

                <div className="space-y-2">
                  {explanation.shapContributions.map((shap, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-300">
                        <span>{shap.feature}</span>
                        <span className="font-bold text-white">{shap.weight}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${shap.weight}%`, backgroundColor: shap.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Closed-Loop Action & HITL Gate Cue */}
              <div className="p-3 rounded-lg bg-[#061226] border border-cyan-500/20 text-xs font-sans space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Automated Guardrail & Human-in-the-Loop Gate</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  • <strong className="text-slate-200">Local Edge Action:</strong> {explanation.engineeringAction.automatedClamp}
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  • <strong className="text-amber-300">HITL Authorization Gate:</strong> {explanation.engineeringAction.hitlGateStatus}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
