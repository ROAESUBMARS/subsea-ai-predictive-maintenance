import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Clock,
  Compass,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Droplets,
  GitBranch,
  Gauge
} from 'lucide-react';

export default function GuidedTourModal({
  isOpen,
  onClose,
  currentScenario,
  onSelectScenario,
  onSelectAsset,
  onNavigateTab
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [progressSec, setProgressSec] = useState(0);

  const STEP_DURATION_SEC = 30; // 30s per step * 3 steps = 90s total tour

  const tourSteps = [
    {
      id: 'step-hydrate',
      scenarioKey: 'HYDRATE_RISK',
      assetId: 'PFL-101',
      title: 'Dynamic PVT Hydrate Subcooling & Bounded RL Dosing',
      badge: 'FLOW ASSURANCE',
      icon: Droplets,
      targetTab: 'control-room',
      headline: 'Thermodynamic Hydrate Risk at -1,850m with Clamped RL Dosing',
      bullets: [
        'Dynamic PVT phase boundary shifts as field Water Cut rises from 14.2% to 28.5%.',
        'Fluid temp (7.8°C) plunges 6.7°C inside the hydrate formation envelope.',
        'Reinforcement Learning dosing agent surges MEG inhibitor, strictly clamped to 185 L/h max safe envelope (±15 L/h/min limit) to prevent subsea umbilical rupture.',
        'Bayesian P10 RUL drops to 6 days until complete hydraulic freeze-up without intervention.'
      ],
      recruiterTakeaway: 'Proves thermodynamic flow assurance understanding, not just visual dashboards.'
    },
    {
      id: 'step-fatigue',
      scenarioKey: 'TOUCHDOWN_FATIGUE',
      assetId: 'SCR-01',
      title: 'SCR Catenary Touchdown Fatigue & 0.38 Hz VIV Modal Lock-in',
      badge: 'STRUCTURAL DYNAMICS',
      icon: GitBranch,
      targetTab: 'riser-fatigue',
      headline: 'Vortex-Induced Vibration (VIV) & Paris-Erdogan Fracture Mechanics',
      bullets: [
        '1.85-knot benthic loop current matches the 2nd cross-flow natural mode (0.38 Hz FFT peak on triaxial accelerometer).',
        'Rainflow stress cycle counting (ASTM E1049) reveals dynamic bending stress reversals (Δσ = 160 MPa).',
        'Paris-Erdogan flaw propagation law (da/dN = C(ΔK)^m) with BS 7910 marine welded steel constants forecasts micro-crack growth (a = 2.45 mm) toward critical limit (8.5 mm).',
        'Bayesian UQ provides P10/P50/P90 confidence envelopes, flagging urgent inspection at 26 days.'
      ],
      recruiterTakeaway: 'Demonstrates deep marine structural integrity, hydrodynamic lock-in, and fracture mechanics.'
    },
    {
      id: 'step-erosion',
      scenarioKey: 'EROSION_WALL_LOSS',
      assetId: 'PFL-101',
      title: 'Choke Sand Breakthrough & Erosion Wall Loss',
      badge: 'DEGRADATION PROGNOSTICS',
      icon: ShieldAlert,
      targetTab: 'corrosion-erosion',
      headline: 'Acoustic Sand Erosion, H2S Sour Pitting & HITL Sign-Off Gate',
      bullets: [
        'Acoustic probe detects 84.5 PPM silica sand at 11.8 m/s annular mist flow, breaching API 14E erosional limits.',
        'High particulate impingement strips protective FeCO3 film, accelerating sour H2S pitting to 2.85 mm/year.',
        'Bayesian RUL collapses from 450 days to 88 days (P10 = 68 days).',
        'Human-in-the-Loop (HITL) Gate: Rather than unreliably mobilizing a $115k/day ROV spread autonomously, the system generates an auditable sign-off dossier requiring the Chief Subsea Integrity Engineer authorization.'
      ],
      recruiterTakeaway: 'Shows practical offshore operational realism: algorithms recommend, but humans gate high-cost spreads.'
    }
  ];

  const activeStepObj = tourSteps[currentStep];

  // Sync dashboard with current step
  useEffect(() => {
    if (!isOpen) return;
    const step = tourSteps[currentStep];
    if (step) {
      onSelectScenario(step.scenarioKey);
      onSelectAsset(step.assetId);
    }
    setProgressSec(0);
  }, [currentStep, isOpen]);

  // 90s auto-advancing timer (30s per step)
  useEffect(() => {
    if (!isOpen || !isAutoAdvancing) return;

    const timer = setInterval(() => {
      setProgressSec((prev) => {
        if (prev >= STEP_DURATION_SEC) {
          if (currentStep < tourSteps.length - 1) {
            setCurrentStep((c) => c + 1);
            return 0;
          } else {
            setIsAutoAdvancing(false);
            return STEP_DURATION_SEC;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isAutoAdvancing, currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgressSec(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgressSec(0);
    }
  };

  const handleJumpToStep = (index) => {
    setCurrentStep(index);
    setProgressSec(0);
  };

  const progressPercent = Math.min(100, (progressSec / STEP_DURATION_SEC) * 100);
  const totalSecondsElapsed = currentStep * STEP_DURATION_SEC + progressSec;

  const StepIcon = activeStepObj.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-tour-title"
        className="glass-panel w-full max-w-3xl overflow-hidden border border-cyan-500/40 shadow-[0_0_60px_rgba(0,242,254,0.3)] bg-[#070d1e]"
      >
        
        {/* Header Ribbon */}
        <div className="p-4 border-b border-cyan-500/20 bg-[#040816] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="guided-tour-title" className="text-sm font-heading font-extrabold text-white tracking-wide uppercase">
                  90-Second Subsea Engineering Walkthrough
                </h2>
                <span className="badge badge-cyan text-[9px] py-0.5 px-2 font-mono">
                  STEP {currentStep + 1} OF 3
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Curated inspection hitting the 3 core physics differentiators (Recruiter & Reviewer Fast-Track)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close guided tour"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 30s Countdown Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-3 bg-[#050c1f] border-b border-slate-800/80 text-xs font-mono">
          {tourSteps.map((step, idx) => {
            const isCurrent = currentStep === idx;
            const isCompleted = currentStep > idx;
            return (
              <button
                key={step.id}
                onClick={() => handleJumpToStep(idx)}
                className={`p-3 text-left border-r border-slate-800/80 flex items-center justify-between gap-2 transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-white font-bold border-b-2 border-b-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <div className="truncate">
                  <div className="text-[10px] text-cyan-400/90 font-mono">SCENARIO 0{idx + 1}</div>
                  <div className="text-xs truncate font-sans">{step.badge}</div>
                </div>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Scenario Deep Dive */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto bg-[#030612]">
          
          {/* Step Hero */}
          <div className="p-4 rounded-xl bg-[#061127] border border-cyan-500/30 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <StepIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-400/30">
                  {activeStepObj.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Asset: <strong className="text-white">{activeStepObj.assetId}</strong>
                </span>
              </div>
              <h3 className="text-base font-heading font-bold text-white">
                {activeStepObj.headline}
              </h3>
            </div>
          </div>

          {/* Key Engineering Bullets */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              WHAT THE AI & FIRST-PRINCIPLES PHYSICS ARE DOING:
            </div>
            {activeStepObj.bullets.map((b, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#050c1e] border border-slate-800 text-xs font-sans text-slate-200 flex items-start gap-2.5 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Recruiter / Reviewer Callout */}
          <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-500/30 flex items-center gap-3 text-xs font-sans text-purple-200">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <strong className="text-purple-300">Why this matters: </strong>
              {activeStepObj.recruiterTakeaway}
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#040816] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          {/* Timer & Pause Controls */}
          <div className="flex items-center gap-3 text-slate-300">
            <button
              onClick={() => setIsAutoAdvancing(!isAutoAdvancing)}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isAutoAdvancing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoAdvancing ? 'Pause timer' : 'Resume timer'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">
              Auto-advancing in <strong className="text-white font-mono">{STEP_DURATION_SEC - progressSec}s</strong> (Total: {totalSecondsElapsed}/90s)
            </span>
          </div>

          {/* Stepping Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-sans flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {currentStep < tourSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn-primary text-xs py-1.5 px-4 font-sans flex items-center gap-1.5"
              >
                Next scenario
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-primary text-xs py-1.5 px-4 font-sans flex items-center gap-1.5"
              >
                Finish & Explore freely
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
