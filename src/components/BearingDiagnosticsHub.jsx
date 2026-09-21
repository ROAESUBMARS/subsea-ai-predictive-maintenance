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
  Gauge, 
  Flame, 
  Zap, 
  Droplets, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  Cpu, 
  Layers, 
  HelpCircle,
  Radio,
  Sliders
} from 'lucide-react';
import { ASSET_DEFINITIONS, SIMULATION_SCENARIOS } from '../services/telemetryEngine';

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

export default function BearingDiagnosticsHub({ 
  latestData, 
  selectedAssetId, 
  onSelectAsset,
  onSelectScenario 
}) {
  const [selectedBearingPart, setSelectedBearingPart] = useState('inner_ring');
  const [activeCursor, setActiveCursor] = useState('ALL');

  if (!latestData || !latestData.assets) return null;

  // Filter rotating equipment with bearing packages
  const rotatingAssets = ASSET_DEFINITIONS.filter(a => a.bearingSpecs);
  const currentAssetId = rotatingAssets.some(a => a.id === selectedAssetId) ? selectedAssetId : 'MBP-01';
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentAssetId) || ASSET_DEFINITIONS[0];
  const telemetry = latestData.assets[currentAssetId] || latestData.assets['MBP-01'];
  const metrics = telemetry.metrics || {};
  const bearingSpecs = assetMeta.bearingSpecs || ASSET_DEFINITIONS[0].bearingSpecs;
  const bearingDetails = telemetry.bearingHealthDetails || {};

  const spectrumBins = latestData.demodulationSpectrum || [];
  const timeWaveform = latestData.timeWaveform || [];

  // Frequency Envelope Demodulation Chart (HFRT / FFT)
  const spectrumChartData = {
    labels: spectrumBins.map(b => `${b.freq} Hz`),
    datasets: [
      {
        label: 'Demodulated Envelope Acceleration Amplitude (g pk)',
        data: spectrumBins.map(b => b.amplitude),
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.15)',
        borderWidth: 2,
        fill: true,
        pointRadius: (ctx) => {
          const index = ctx.dataIndex;
          const freq = spectrumBins[index]?.freq;
          // Highlight markers at 1X, 2X, 3X, BPFO, BPFI, BSF, FTF
          if (Math.abs(freq - 60) <= 5 || Math.abs(freq - 400) <= 10 || Math.abs(freq - 560) <= 10 || Math.abs(freq - 170) <= 10) {
            return 4;
          }
          return 0;
        },
        pointBackgroundColor: (ctx) => {
          const freq = spectrumBins[ctx.dataIndex]?.freq;
          if (Math.abs(freq - 560) <= 10) return '#ef4444'; // BPFI
          if (Math.abs(freq - 400) <= 10) return '#f59e0b'; // BPFO
          if (Math.abs(freq - 170) <= 10) return '#a855f7'; // BSF
          return '#00f2fe';
        },
        tension: 0.2
      }
    ]
  };

  const spectrumChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 10 },
          boxWidth: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(6, 16, 34, 0.95)',
        borderColor: 'rgba(0, 242, 254, 0.4)',
        borderWidth: 1,
        titleColor: '#00f2fe',
        bodyColor: '#ffffff',
        callbacks: {
          title: (items) => `Frequency: ${items[0].label}`,
          afterBody: (items) => {
            const freqVal = parseInt(items[0].label);
            if (Math.abs(freqVal - 560) <= 15) return '⚡ BPFI Marker (Inner Race Flaking)';
            if (Math.abs(freqVal - 400) <= 15) return '⚡ BPFO Marker (Outer Race Pitting)';
            if (Math.abs(freqVal - 170) <= 15) return '⚡ BSF Marker (Ball Spalling)';
            if (Math.abs(freqVal - 60) <= 10) return '⚡ 1X Shaft Running Speed (3,600 RPM)';
            if (Math.abs(freqVal - 120) <= 10) return '⚡ 2X Shaft Harmonic';
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 12 }
      },
      y: {
        min: 0,
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } },
        title: {
          display: true,
          text: 'Envelope Amplitude (g pk)',
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 10 }
        }
      }
    }
  };

  // High-Speed Time-Waveform Chart (Impact Shock Pulses)
  const timeWaveformData = {
    labels: timeWaveform.map((_, i) => `${(i * 0.4).toFixed(1)}ms`),
    datasets: [
      {
        label: 'Acceleration Waveform (g)',
        data: timeWaveform,
        borderColor: '#38bdf8',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.1
      }
    ]
  };

  const timeWaveformOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(6, 16, 34, 0.9)',
        titleColor: '#38bdf8'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 8 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } },
        title: {
          display: true,
          text: 'Impact (g)',
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 9 }
        }
      }
    }
  };

  // ISO 10816-7 Vibration Severity Zone Calculation
  const vibRms = metrics.vibrationRMS || 2.1;
  const isoZone = telemetry.isoZone || 'ZONE_A';

  return (
    <div className="space-y-5 mb-5 animate-fade-in">
      
      {/* Subsea Bearing Diagnostic Hub Header & Equipment Selector */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.15)]">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 text-cyan-300">
            <RotateCw className="w-6 h-6 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-lg text-white">
                Subsea Bearing Diagnostic Center & High-Frequency Demodulation (HFRT)
              </h2>
              <span className="badge badge-cyan text-[10px]">ISO 10816-7 / API 17D</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Continuous envelope demodulation, acoustic shock pulse analysis, and tribological barrier fluid health for deepwater turbomachinery.
            </p>
          </div>
        </div>

        {/* Rotating Asset Selector */}
        <div className="flex items-center gap-1.5 bg-[#071328] p-1.5 rounded-xl border border-cyan-500/25">
          <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-semibold">Asset:</span>
          {rotatingAssets.map(asset => {
            const isSel = asset.id === currentAssetId;
            const assetData = latestData.assets[asset.id];
            const isCrit = assetData?.status === 'CRITICAL';
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                  isSel 
                    ? 'bg-cyan-500/25 text-cyan-300 font-semibold border border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.25)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {isCrit && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                {asset.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Core Bearing Telemetry Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gauge 1: Vibration Severity (ISO 10816-7) */}
        <div className="glass-panel p-4 flex flex-col justify-between border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase font-semibold">Vibration Severity RMS</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-heading font-extrabold text-white flex items-baseline gap-1">
              {metrics.vibrationRMS} <span className="text-xs text-slate-400 font-mono font-normal">mm/s</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                isoZone === 'ZONE_A' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                isoZone === 'ZONE_B_ACCEPTABLE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                isoZone === 'ZONE_C_RESTRICTED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
              }`}>
                {isoZone.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: '23%' }} title="Zone A: <2.3" />
            <div className="bg-cyan-400 h-full" style={{ width: '22%' }} title="Zone B: 2.3-4.5" />
            <div className="bg-amber-400 h-full" style={{ width: '26%' }} title="Zone C: 4.5-7.1" />
            <div className="bg-rose-500 h-full" style={{ width: '29%' }} title="Zone D: >7.1" />
          </div>
        </div>

        {/* Gauge 2: Signal Kurtosis & Crest Factor */}
        <div className="glass-panel p-4 flex flex-col justify-between border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase font-semibold">Kurtosis & Crest Factor</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-heading font-extrabold text-white flex items-baseline gap-2">
              {metrics.kurtosis} <span className="text-xs text-slate-400 font-mono font-normal">Kurtosis</span>
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              Crest Factor: <strong className="text-cyan-300">{metrics.crestFactor}</strong> (Peak: {metrics.accPeakG}g)
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Baseline: ~3.0 • Impulsive Spalling: &gt; 5.0
          </div>
        </div>

        {/* Gauge 3: Thermal Gradient (DE vs NDE Bearings) */}
        <div className="glass-panel p-4 flex flex-col justify-between border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase font-semibold">Bearing Temperatures</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-heading font-extrabold text-white flex items-baseline gap-1">
              {metrics.bearingDeTempC}°C <span className="text-xs text-slate-400 font-mono font-normal">Drive-End</span>
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              Non-Drive End: <strong className="text-amber-300">{metrics.bearingNdeTempC}°C</strong> (ΔT: {(metrics.bearingDeTempC - metrics.bearingNdeTempC).toFixed(1)}°C)
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Max Thermal Trip: <span className="text-rose-400">95.0°C</span>
          </div>
        </div>

        {/* Gauge 4: Lubrication Film (Lambda Ratio) & Water Ingress */}
        <div className="glass-panel p-4 flex flex-col justify-between border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="uppercase font-semibold">Barrier Fluid Tribology</span>
            <Droplets className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-heading font-extrabold text-white flex items-baseline gap-1">
              {metrics.lambdaFilmRatio} <span className="text-xs text-slate-400 font-mono font-normal">Λ Film Ratio</span>
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              Water Content: <strong className={metrics.barrierWaterPpm > 500 ? 'text-rose-400' : 'text-emerald-400'}>{metrics.barrierWaterPpm} ppm</strong> ({metrics.barrierViscosityCst} cSt)
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Regime: <span className="text-cyan-300 font-semibold">{bearingDetails.lubricationRegime?.replace(/_/g, ' ')}</span>
          </div>
        </div>

      </div>

      {/* Main Analysis Section: Frequency Spectrum (HFRT) & Interactive 2.5D Bearing CAD Anatomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 7 Cols: Demodulated Envelope Frequency Spectrum */}
        <div className="lg:col-span-7 glass-panel p-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-cyan-400" /> HIGH FREQUENCY RESONANCE TECHNIQUE (HFRT)
              </span>
              <h3 className="font-heading font-bold text-sm text-white">
                Envelope Demodulation Defect Spectrum & Harmonics
              </h3>
            </div>

            {/* Defect Frequency Marker Badges */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-semibold" title="Ball Pass Frequency Inner Race">
                BPFI: {bearingSpecs.bpfiHz} Hz
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold" title="Ball Pass Frequency Outer Race">
                BPFO: {bearingSpecs.bpfoHz} Hz
              </span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-semibold" title="Ball Spin Frequency">
                BSF: {bearingSpecs.bsfHz} Hz
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-semibold" title="Fundamental Train Frequency">
                FTF: {bearingSpecs.ftfHz} Hz
              </span>
            </div>
          </div>

          <div className="h-[270px] w-full relative">
            <Line data={spectrumChartData} options={spectrumChartOptions} />
          </div>

          {/* Time Waveform Strip Below Spectrum */}
          <div className="mt-3 pt-3 border-t border-cyan-500/15">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Raw Shock Impact Waveform (Continuous 128-point Transient Burst)
              </span>
              <span>SPM Shock Pulse: <strong className="text-amber-300">{metrics.spmDb} dBm</strong></span>
            </div>
            <div className="h-[75px] w-full relative">
              <Line data={timeWaveformData} options={timeWaveformOptions} />
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Interactive 2.5D Subsea Bearing CAD & Tribological Inspector */}
        <div className="lg:col-span-5 glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> CAD CROSS-SECTION
              </span>
              <h3 className="font-heading font-bold text-sm text-white">
                Subsea Ceramic Hybrid Bearing Geometry
              </h3>
            </div>
            <span className="badge badge-ai text-[10px]">{bearingSpecs.model.split(' ')[0]}</span>
          </div>

          {/* Interactive SVG Subsea Bearing Radial Section */}
          <div className="relative w-full h-[220px] bg-[#050e1e] rounded-xl border border-cyan-500/20 p-2 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 300 220" className="w-full h-full">
              {/* Outer Housing Ring */}
              <circle cx="150" cy="110" r="95" fill="none" stroke="#1e293b" strokeWidth="20" />
              <circle cx="150" cy="110" r="90" fill="none" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
              
              {/* Outer Raceway Highlight (BPFO Zone) */}
              <circle 
                cx="150" 
                cy="110" 
                r="82" 
                fill="none" 
                stroke={bearingDetails.outerRaceCondition !== 'NOMINAL' ? '#ef4444' : '#38bdf8'} 
                strokeWidth="7"
                className="cursor-pointer transition-all hover:opacity-80"
                onClick={() => setSelectedBearingPart('outer_ring')}
              />

              {/* Ceramic Hybrid Silicon Nitride Balls (16 Balls distributed radially) */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * (360 / 12) * Math.PI) / 180;
                const bx = 150 + 64 * Math.cos(angle);
                const by = 110 + 64 * Math.sin(angle);
                const isDamagedBall = i === 2 && bearingDetails.rollingElementsCondition !== 'NOMINAL';
                return (
                  <g key={i} className="cursor-pointer" onClick={() => setSelectedBearingPart('rolling_elements')}>
                    <circle 
                      cx={bx} 
                      cy={by} 
                      r="10" 
                      fill={isDamagedBall ? '#ef4444' : '#0c2242'} 
                      stroke={isDamagedBall ? '#f87171' : '#00f2fe'} 
                      strokeWidth="1.5" 
                    />
                    <circle cx={bx - 3} cy={by - 3} r="2.5" fill="#ffffff" opacity="0.6" />
                  </g>
                );
              })}

              {/* Inner Raceway Highlight (BPFI Zone) */}
              <circle 
                cx="150" 
                cy="110" 
                r="46" 
                fill="none" 
                stroke={bearingDetails.innerRaceCondition !== 'NOMINAL' ? '#ef4444' : '#0ea5e9'} 
                strokeWidth="7"
                className="cursor-pointer transition-all hover:opacity-80"
                onClick={() => setSelectedBearingPart('inner_ring')}
              />

              {/* Shaft Center Core */}
              <circle cx="150" cy="110" r="32" fill="#091427" stroke="#334155" strokeWidth="2" />
              <text x="150" y="107" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">
                SUBSEA SHAFT
              </text>
              <text x="150" y="119" textAnchor="middle" fill="#00f2fe" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
                {metrics.rpm || 3600} RPM
              </text>

              {/* Active Sensor Pings */}
              <circle cx="150" cy="20" r="4" fill="#10b981" />
              <circle cx="150" cy="20" r="7" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
            </svg>

            {/* Click to inspect parts badge */}
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
              Interactive CAD: Click Components
            </span>
          </div>

          {/* Component Specification Card */}
          <div className="mt-3 p-3 bg-[#081224] rounded-lg border border-cyan-500/20 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">BEARING SPECIFICATION:</span>
              <span className="text-cyan-300 font-bold">{bearingSpecs.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Ball Count:</span> <strong className="text-white">{bearingSpecs.rollingElements} Elements (Si3N4)</strong>
              </div>
              <div>
                <span className="text-slate-500">Pitch Diameter:</span> <strong className="text-white">{bearingSpecs.pitchDiameterMm} mm</strong>
              </div>
              <div>
                <span className="text-slate-500">Contact Angle:</span> <strong className="text-white">{bearingSpecs.contactAngleDeg}° Angular</strong>
              </div>
              <div>
                <span className="text-slate-500">Running Freq 1X:</span> <strong className="text-cyan-300">{bearingSpecs.runningFreqHz} Hz</strong>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-400">Diagnosis: </span>
              {telemetry.status === 'CRITICAL' ? (
                <strong className="text-rose-400">
                  {bearingDetails.innerRaceCondition !== 'NOMINAL' ? 'Critical BPFI Flaking on Inner Ring.' :
                   bearingDetails.outerRaceCondition !== 'NOMINAL' ? 'Severe BPFO Surface Fatigue Pitting.' :
                   bearingDetails.rollingElementsCondition !== 'NOMINAL' ? 'Ceramic Ball Spalling & Cage Instability.' :
                   'Dangerous Seawater Ingress in Lubricant Loop.'}
                </strong>
              ) : telemetry.status === 'WARNING' ? (
                <strong className="text-amber-400">Early stage micro-pitting detected in load zone.</strong>
              ) : (
                <strong className="text-emerald-400">All bearing surfaces nominal. Healthy full-fluid elastohydrodynamic lubrication film.</strong>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Bearing Failure Mode Simulation Injector Grid */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Subsea Bearing Failure Mode & Anomaly Injection Testbench
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Instantaneous Physics Model Switching</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
          {Object.entries(SIMULATION_SCENARIOS)
            .filter(([_, sc]) => sc.category?.startsWith('BEARING') || sc.id === 'NORMAL')
            .map(([key, sc]) => {
              const isAct = latestData.scenario === key;
              return (
                <button
                  key={key}
                  onClick={() => onSelectScenario(key)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isAct 
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)] ring-1 ring-cyan-400' 
                      : 'bg-[#081224] border-cyan-500/15 text-slate-300 hover:bg-[#0c1b38] hover:border-cyan-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        sc.severity === 'NOMINAL' ? 'bg-emerald-500/20 text-emerald-300' :
                        sc.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                        {sc.severity}
                      </span>
                      {isAct && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    </div>
                    <div className="font-bold text-white text-[11px] leading-snug">
                      {sc.name}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                    {sc.description}
                  </p>
                </button>
              );
            })}
        </div>
      </div>

    </div>
  );
}
