import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Activity,
  GitBranch,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RiserFatigueStructuralHealth({ latestData, onSelectAsset }) {
  const [activeAnalysisMode, setActiveAnalysisMode] = useState('VIV_SPECTRUM'); // 'VIV_SPECTRUM' | 'RAINFLOW_STRESS' | 'PARIS_CRACK'

  if (!latestData || !latestData.assets) return null;

  const scrAsset = latestData.assets['SCR-01'] || latestData.assets[ASSET_DEFINITIONS[0].id];
  const vivSpectrum = latestData.vivSpectrum || [];
  const rainflowData = latestData.rainflowHistogram || [];

  // 1. VIV Acceleration Spectrum Chart (Hz vs Amplitude g)
  const vivChartData = {
    labels: vivSpectrum.map(b => `${b.freqHz} Hz`),
    datasets: [
      {
        label: 'Riser Accelerometer Spectrum Amplitude (g)',
        data: vivSpectrum.map(b => b.amplitudeG),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderWidth: 2,
        fill: true,
        pointRadius: (ctx) => (vivSpectrum[ctx.dataIndex]?.isLockInPeak ? 5 : 0),
        pointBackgroundColor: '#ef4444',
        tension: 0.2
      }
    ]
  };

  // 2. Rainflow Stress Range Distribution (Cycle count per stress range bin)
  const rainflowChartData = {
    labels: rainflowData.map(d => `${d.stressRangeMpa} MPa`),
    datasets: [
      {
        label: 'Cyclic Stress Range Occurrences (per 10^5 cycles)',
        data: rainflowData.map(d => d.cycles),
        backgroundColor: rainflowData.map(d =>
          d.stressRangeMpa.includes('100') || d.stressRangeMpa.includes('140')
            ? 'rgba(239, 68, 68, 0.8)'
            : 'rgba(0, 242, 254, 0.6)'
        ),
        borderColor: '#00f2fe',
        borderWidth: 1
      }
    ]
  };

  // 3. Paris-Erdogan Crack Growth Projection (Cycles N vs Crack Length a)
  const crackLength = scrAsset.crackLengthMm || 0.45;
  const criticalCrack = scrAsset.criticalCrackMm || 8.5;
  const crackTimeline = ['N_0 (0M)', 'N+1 (2M)', 'N+2 (4M)', 'N+3 (6M)', 'N+4 (8M)', 'N+5 (10M)', 'N+6 (12M)'];
  const crackGrowthValues = [
    crackLength,
    crackLength * 1.15,
    crackLength * 1.38,
    crackLength * 1.72,
    crackLength * 2.25,
    crackLength * 3.10,
    crackLength * 4.45
  ];

  const crackChartData = {
    labels: crackTimeline,
    datasets: [
      {
        label: 'Micro-Crack Depth a (mm)',
        data: crackGrowthValues.map(v => Number(v.toFixed(2))),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 3
      },
      {
        label: `Critical Flaw Size a_crit (${criticalCrack} mm)`,
        data: crackTimeline.map(() => criticalCrack),
        borderColor: '#ef4444',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
            <GitBranch className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Riser Touchdown Zone (TDZ) Fatigue & Structural Health
              </h2>
              <span className="badge badge-purple text-[10px] font-mono py-0.5 px-2">
                DNV-RP-F204 / API 2RD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Triaxial Accelerometer / Strain Telemetry • VIV Modal Lock-in • Rainflow Cycle Counting • Paris-Erdogan Fracture Mechanics ($da/dN$)
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-[#050e20] p-1 rounded-lg border border-purple-500/20 text-xs font-mono">
          <button
            onClick={() => setActiveAnalysisMode('VIV_SPECTRUM')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeAnalysisMode === 'VIV_SPECTRUM'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            VIV Spectrum (FFT)
          </button>
          <button
            onClick={() => setActiveAnalysisMode('RAINFLOW_STRESS')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeAnalysisMode === 'RAINFLOW_STRESS'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rainflow S-N
          </button>
          <button
            onClick={() => setActiveAnalysisMode('PARIS_CRACK')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeAnalysisMode === 'PARIS_CRACK'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Crack Growth (da/dN)
          </button>
        </div>
      </div>

      {/* 4 Structural Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. TDZ Dynamic Bending Stress */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${
          scrAsset.tdzBendingStressMpa > 180 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TDZ BENDING STRESS</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              scrAsset.tdzBendingStressMpa > 180 ? 'text-rose-400' : 'text-white'
            }`}>
              {Math.round(scrAsset.tdzBendingStressMpa || 85)}
            </span>
            <span className="text-xs text-purple-400 font-mono ml-1">MPa</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Yield Stress (SAWL 450):</span>
            <span className="text-cyan-300">450 MPa</span>
          </div>
        </div>

        {/* 2. Vortex-Induced Vibration (VIV) Harmonic Lock-in */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${
          scrAsset.vivVibrationG > 0.2 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>VIV ACCELERATION</span>
            <Radio className={`w-4 h-4 ${scrAsset.vivVibrationG > 0.2 ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              scrAsset.vivVibrationG > 0.2 ? 'text-rose-400' : 'text-white'
            }`}>
              {scrAsset.vivVibrationG?.toFixed(2)}
            </span>
            <span className="text-xs text-cyan-400 font-mono ml-1">g RMS</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Harmonic Mode:</span>
            <span className={scrAsset.vivVibrationG > 0.2 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {scrAsset.vivVibrationG > 0.2 ? '2nd Modal Lock-in (0.38 Hz)' : 'Stochastic Low Current'}
            </span>
          </div>
        </div>

        {/* 3. Miner's Cumulative Fatigue Damage (D) */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${
          scrAsset.fatigueDamageAccumulated > 0.05 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>MINER'S DAMAGE (D)</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              scrAsset.fatigueDamageAccumulated > 0.05 ? 'text-rose-400' : 'text-white'
            }`}>
              {scrAsset.fatigueDamageAccumulated?.toFixed(3) || '0.012'}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">/ 1.0 DFF</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Design Fatigue Factor:</span>
            <span className="text-amber-300">10.0 (DNV Critical)</span>
          </div>
        </div>

        {/* 4. Paris Fracture Mechanics Crack Size */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${
          scrAsset.crackLengthMm > 2.0 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>FLAW DEPTH a (mm)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              scrAsset.crackLengthMm > 2.0 ? 'text-rose-400' : 'text-white'
            }`}>
              {scrAsset.crackLengthMm?.toFixed(2) || '0.45'}
            </span>
            <span className="text-xs text-purple-400 font-mono ml-1">mm</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Critical Limit a_c:</span>
            <span className="text-rose-400 font-bold">{scrAsset.criticalCrackMm || 8.5} mm</span>
          </div>
        </div>

      </div>

      {/* Main Structural Chart View */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            {activeAnalysisMode === 'VIV_SPECTRUM' && 'Vortex-Induced Vibration (VIV) Accelerometer Spectrum (0.0 - 2.0 Hz)'}
            {activeAnalysisMode === 'RAINFLOW_STRESS' && 'Rainflow Cycle Counting & Stress Range Distribution (MPa)'}
            {activeAnalysisMode === 'PARIS_CRACK' && 'Paris-Erdogan Flaw Propagation Forecast: da/dN = C(ΔK)^m'}
          </h3>
          <span className="badge badge-purple text-[9px] font-mono">
            TOUCHDOWN ZONE (KP 2.85)
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-3">
          {activeAnalysisMode === 'VIV_SPECTRUM' && 'Detects vortex shedding lock-in harmonics driving dynamic cyclic fatigue on the steel catenary riser.'}
          {activeAnalysisMode === 'RAINFLOW_STRESS' && 'Binned cyclic stress reversal counts feeding Miner rule cumulative fatigue life expenditure.'}
          {activeAnalysisMode === 'PARIS_CRACK' && 'Nonlinear linear elastic fracture mechanics projection to pre-emptively schedule ROV phased-array UT.'}
        </p>

        <div className="h-[280px] w-full">
          {activeAnalysisMode === 'VIV_SPECTRUM' && <Line data={vivChartData} options={{ responsive: true, maintainAspectRatio: false }} />}
          {activeAnalysisMode === 'RAINFLOW_STRESS' && <Bar data={rainflowChartData} options={{ responsive: true, maintainAspectRatio: false }} />}
          {activeAnalysisMode === 'PARIS_CRACK' && <Line data={crackChartData} options={{ responsive: true, maintainAspectRatio: false }} />}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-[#061328] border border-purple-500/20 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <span>CATENARY TOUCHDOWN POINT: <strong className="text-cyan-300">KP 2.85 km (-1,850m Seabed)</strong></span>
          <span>FLEX-JOINT ROTATION: <strong className="text-purple-300">2.4° RMS</strong></span>
          <span>ROV UT INSPECTION DISPATCH: <strong className={scrAsset.fatigueDamageAccumulated > 0.05 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{scrAsset.inspectionPriority}</strong></span>
        </div>
      </div>

    </div>
  );
}
