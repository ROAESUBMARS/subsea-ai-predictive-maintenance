import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  Activity, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Droplets,
  GitBranch,
  Gauge,
  Clock,
  Lock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  FileCheck
} from 'lucide-react';

export default function ArchitectureModal({ onClose }) {
  const [activeStage, setActiveStage] = useState('STAGE_1');

  const architectureStages = [
    {
      id: 'STAGE_1',
      num: '01',
      title: 'Subsea Sensor Ingestion & Edge Preprocessing',
      badge: 'IEEE 1588 PTP & DAS Edge Mesh',
      icon: Radio,
      shortSummary: 'Data validation sub-layer, sensor self-diagnostics, edge wavelet compression, and nanosecond PTP clock sync.',
      highlights: [
        {
          name: 'Sensor Self-Diagnostics & Data Quality Sub-Layer',
          detail: 'Validates quartz gauge stability, fiber DAS channel attenuation, and outlier rejection before bad data can corrupt downstream fracture & RUL models.'
        },
        {
          name: 'Subsea Edge Bandwidth Compression (128:1)',
          detail: '25 kHz raw fiber DAS acoustic data is reduced at subsea edge canisters using Discrete Wavelet Transforms (DWT) & FFT spectral extraction, transmitting 20 Hz telemetry over copper/fiber umbilicals.'
        },
        {
          name: 'IEEE 1588 PTP Sub-Microsecond Clock Sync',
          detail: 'Guarantees tight time synchronization across heterogeneous sensors (NPW acoustic time-of-flight, riser accelerometers, pressure transients) for pinpoint leak localization.'
        }
      ]
    },
    {
      id: 'STAGE_2',
      num: '02',
      title: 'Physics-Informed Feature Engineering',
      badge: 'Dynamic PVT & Sour H2S/MIC',
      icon: Gauge,
      shortSummary: 'Dynamic compositional hydrate envelope, H2S/MIC sour bio-corrosion, and multiphase flow regime classification.',
      highlights: [
        {
          name: 'Dynamic PVT Compositional Hydrate Envelope',
          detail: 'Thermodynamically shifts the hydrate dissociation boundary as field Water Cut (WC) and GOR evolve over field life, eliminating static curve errors.'
        },
        {
          name: 'Sour Service H2S & MIC Bio-Corrosion Modeling',
          detail: 'Extends beyond de Waard CO2 sweet corrosion to incorporate NACE MR0175 H2S sour pitting and Sulfate-Reducing Bacteria (SRB) bio-corrosion kinetics.'
        },
        {
          name: 'Multiphase Flow Regime Classification',
          detail: 'Classifies live hydrodynamic slugging vs stratified wavy vs annular mist flow, dynamically scaling erosion kinetics and cyclic Rainflow stress counts.'
        }
      ]
    },
    {
      id: 'STAGE_3',
      num: '03',
      title: 'Deep Learning, Fracture Mechanics & UQ',
      badge: 'Bayesian UQ & SHAP Explainability',
      icon: Sparkles,
      shortSummary: 'Bayesian uncertainty quantification (P10/P50/P90), RL guardrails, SHAP feature importance, and PSI model drift tracking.',
      highlights: [
        {
          name: 'Bayesian Uncertainty Quantification (UQ)',
          detail: 'Provides P10, P50, and P90 confidence bounds on Remaining Useful Life (RUL) and autoencoder reconstruction loss for safety-critical decision integrity.'
        },
        {
          name: 'Constrained RL Chemical Dosing Guardrails',
          detail: 'Reinforcement learning chemical dosing agent is strictly bounded within safe action spaces [Q_min, Q_max] with rate-of-change clamps (±15 L/h/min) and rule-based fallback.'
        },
        {
          name: 'Explainability Layer (SHAP Attributions)',
          detail: 'Quantifies exact feature importance contributions (sand PPM, velocity, subcooling ΔT, H2S) so engineers can verify why a fault was flagged.'
        },
        {
          name: 'Online Model Drift (PSI / KS) & Retraining Pipeline',
          detail: 'Monitors Population Stability Index (PSI); triggers automated scheduled retraining when reservoir conditions evolve to prevent silent accuracy decay.'
        }
      ]
    },
    {
      id: 'STAGE_4',
      num: '04',
      title: 'Condition-Based Inspection & Closed-Loop Ops',
      badge: 'Bidirectional Retrain & HITL Gate',
      icon: ShieldCheck,
      shortSummary: 'Bidirectional model calibration from ROV ground truth and Human-in-the-Loop (HITL) engineer authorization gates.',
      highlights: [
        {
          name: 'Bidirectional Model Calibration from Inspection Ground Truth',
          detail: 'ROV/AUV physical UT wall scans, CP potentials, and crack photogrammetry feed back directly into Stage 3, updating priors and calibrating physics models.'
        },
        {
          name: 'Human-in-the-Loop (HITL) Authorization Gate',
          detail: 'Enforces mandatory engineer review and formal sign-off before dispatching high-cost ROV/AUV spreads, preventing unnecessary mobilizations.'
        },
        {
          name: 'Condition-Based vs Calendar-Based Optimization',
          detail: 'Replaces blind 2-year calendar surveys with risk-targeted anomaly sweeps, achieving $3.83M+ annual OPEX savings and mitigating 640t CO2e.'
        }
      ]
    },
    {
      id: 'STAGE_5',
      num: '05',
      title: 'Autonomous Remediation & Regulatory Compliance',
      badge: 'Closed-Loop Actuation & ISO 14224',
      icon: FileCheck,
      shortSummary: 'Closed-loop chemical dosing surge, ESD valve isolation, dynamic pigging, digital twin sync, and automated regulatory audit generation.',
      highlights: [
        {
          name: 'Closed-Loop Autonomous Dosing & ESD Subsea Valve Isolation',
          detail: 'Executes automated inhibitor flow rate adjustments and emergency subsea isolation valve actuation (ESD-1) upon acoustic NPW leak detection.'
        },
        {
          name: 'Condition-Driven Dynamic Intelligent Pigging',
          detail: 'Switches from arbitrary 30-day calendar pigging to condition-driven launcher management based on real-time wax layer deposition kinetics.'
        },
        {
          name: '3D Digital Twin Sync & ISO 14224 / API 17D Regulatory Audits',
          detail: 'Synchronizes live telemetry with Pipe-in-Pipe FEM meshes and outputs standardized regulatory compliance reports with cryptographic SHA-256 audit hashes.'
        }
      ]
    }
  ];

  const currentStageObj = architectureStages.find(s => s.id === activeStage) || architectureStages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.25)]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-[#050c1b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#111a2e] border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-extrabold text-white tracking-wider uppercase">
                5-Stage Subsea AI Architecture & Physics Pipeline
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Sensor Validation → Feature Engineering → Bayesian ML → HITL Inspection → Autonomous Remediation & Compliance
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Stage Segmented Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-[#061329] border-b border-slate-800">
          {architectureStages.map(stage => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-3 text-left border-r border-slate-800/80 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-cyan-500/15 border-b-2 border-b-cyan-400 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                    STAGE {stage.num}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-xs font-heading line-clamp-1">{stage.title.split('&')[0]}</div>
                <div className="text-[9px] font-mono text-cyan-400/80 mt-0.5">{stage.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Stage Deep-Dive */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#030712]">
          
          {/* Stage Hero Banner */}
          <div className="p-3.5 rounded bg-[#061328] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="badge badge-cyan text-[9px] py-0.5 px-2">
                STAGE {currentStageObj.num} SPECIFICATION
              </span>
              <h3 className="text-sm font-heading font-bold text-white mt-1">
                {currentStageObj.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-2xl">
                {currentStageObj.shortSummary}
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400">STATUS: </span>
              <span className="text-emerald-400 font-bold">OPERATIONAL</span>
            </div>
          </div>

          {/* Deep Architectural Features List */}
          <div className="space-y-2.5">
            {currentStageObj.highlights.map((h, idx) => (
              <div key={idx} className="p-3.5 rounded bg-[#050e20] border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    {h.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {h.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Implementation Codec / Formula Box */}
          <div className="p-3.5 rounded bg-[#020610] border border-cyan-500/15 font-mono text-xs text-slate-300 space-y-1.5">
            <div className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase">UNDERLYING MATHEMATICAL & PHYSICS PIPELINE:</div>
            {activeStage === 'STAGE_1' && (
              <div className="text-[11px] text-slate-300">
                • IEEE 1588 PTP Jitter: |t_NPW - t_Accel| &lt; 15ns • Wavelet DWT Compression: 25.6 kHz → 20 Hz Wavelet Packets (128:1 Ratio) • Sensor Trust Index: J_sensor = f(SNR, drift, plausibility).
              </div>
            )}
            {activeStage === 'STAGE_2' && (
              <div className="text-[11px] text-slate-300">
                • Dynamic PVT: T_hyd = 8.9·log10(P) + 0.018·P - 7.5 + ΔT_PVT(WC, GOR) • Sour Corrosion: CR_total = CR_CO2(de Waard) + CR_H2S(NACE) + CR_MIC(SRB) • Flow Regime: Baker/Taitel-Dukler Map.
              </div>
            )}
            {activeStage === 'STAGE_3' && (
              <div className="text-[11px] text-slate-300">
                {'• Bayesian UQ: RUL ~ Weibull(η, β) with P10/P50/P90 • RL Dosing Safety Envelope: Q_opt ∈ [20, 200] L/h, |dQ/dt| ≤ 15 L/h/min • SHAP Feature Explainer: Φ_i = Σ (|S|!(M-|S|-1)!)/M! · [f(S ∪ {i}) - f(S)].'}
              </div>
            )}
            {activeStage === 'STAGE_4' && (
              <div className="text-[11px] text-slate-300">
                • Closed-Loop Bayesian Retraining: P(θ | D_ROV) ∝ P(D_ROV | θ) · P(θ) • HITL Gate: Strict digital authorization tokens required prior to ROV spread mobilization ($115k/day).
              </div>
            )}
            {activeStage === 'STAGE_5' && (
              <div className="text-[11px] text-slate-300">
                • Closed-Loop Actuation: u(t) = K_p·e(t) + K_i·∫e(τ)dτ + u_safe • Dynamic Pigging Trigger: ΔP_wax &gt; 25 bar ∨ δ_wax &gt; 3.0mm • ISO 14224 Failure Taxonomy & Cryptographic SHA-256 Audit Trail.
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-cyan-500/20 bg-[#050c1b] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>API 17D • DNV-RP-F116 • ISO 14224 • DNV-RP-F204 COMPLIANT</span>
          </div>

          <button
            onClick={onClose}
            className="btn-primary text-xs py-1 px-4"
          >
            Close Architecture
          </button>
        </div>

      </div>
    </div>
  );
}
