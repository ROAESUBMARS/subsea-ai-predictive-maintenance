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
  Thermometer,
  Wind,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Radio,
  Sliders,
  ChevronRight,
  TrendingDown,
  Layers,
  Droplets,
  Zap,
  CheckCircle2,
  Anchor
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

export default function FlowlineRiserIntegrityHub({
  latestData,
  selectedAssetId,
  onSelectAsset,
  onSelectScenario
}) {
  const [activeSegmentKp, setActiveSegmentKp] = useState(4.5);
  const [selectedSensorChannel, setSelectedSensorChannel] = useState('pressure');

  if (!latestData || !latestData.assets) return null;

  const currentAssetId = selectedAssetId && latestData.assets[selectedAssetId] ? selectedAssetId : 'PFL-101';
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentAssetId) || ASSET_DEFINITIONS[1];
  const telemetry = latestData.assets[currentAssetId] || latestData.assets['PFL-101'];
  const kpData = latestData.kpTelemetryProfile || [];
  const history = latestData.history || {};

  // Continuous Telemetry Profile along KP (Kilometer Post)
  const kpChartData = {
    labels: kpData.map(d => `KP ${d.kp}`),
    datasets: [
      {
        label: 'In-line Pressure (bar)',
        data: kpData.map(d => d.pressureBar),
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.1)',
        yAxisID: 'y',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 2
      },
      {
        label: 'Fluid Temperature (°C)',
        data: kpData.map(d => d.temperatureC),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        yAxisID: 'y1',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2
      },
      {
        label: 'Wall Thickness (mm)',
        data: kpData.map(d => d.wallThicknessMm),
        borderColor: '#10b981',
        borderDash: [4, 4],
        yAxisID: 'y2',
        borderWidth: 1.8,
        tension: 0.2,
        pointRadius: 0
      }
    ]
  };

  const kpChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
      },
      tooltip: {
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(0, 242, 254, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Pressure (bar)', color: '#00f2fe', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#00f2fe', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Temp (°C)', color: '#f59e0b', font: { size: 10 } },
        grid: { drawOnChartArea: false },
        ticks: { color: '#f59e0b', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y2: {
        type: 'linear',
        display: false,
        min: 10,
        max: 30
      }
    }
  };

  // Real-time rolling telemetry stream
  const timeLabels = history.timestamps || [];
  const streamChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: selectedSensorChannel === 'pressure' ? 'Inlet Pressure (bar)' :
               selectedSensorChannel === 'temp' ? 'Fluid Temp (°C)' :
               selectedSensorChannel === 'flow' ? 'Mass Flow (kg/s)' : 'TDZ Micro-Strain (µε)',
        data: selectedSensorChannel === 'pressure' ? history.inletPressure :
              selectedSensorChannel === 'temp' ? history.fluidTemp :
              selectedSensorChannel === 'flow' ? history.massFlowIn : history.tdzStrain,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 0
      }
    ]
  };

  return (
    <div className="space-y-5">
      {/* Subsea Flowline & Riser Selection Banner */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Anchor className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                {assetMeta.name}
              </h2>
              <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                {assetMeta.type}
              </span>
              <span className={`badge ${
                telemetry.status === 'OPTIMAL' ? 'badge-normal' :
                telemetry.status === 'WARNING' ? 'badge-warning' : 'badge-critical'
              } text-[10px] font-mono py-0.5 px-2`}>
                {telemetry.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              DEPTH: -{assetMeta.depth}m • OD: {assetMeta.outerDiameterInches}" • LENGTH: {assetMeta.lengthKm} km • GRADE: {assetMeta.materialGrade}
            </p>
          </div>
        </div>

        {/* Asset Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#050e20] p-1 rounded-lg border border-cyan-500/15 overflow-x-auto">
          {ASSET_DEFINITIONS.map(asset => {
            const isSelected = asset.id === currentAssetId;
            const assetStatus = latestData.assets[asset.id]?.status || 'OPTIMAL';
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  assetStatus === 'OPTIMAL' ? 'bg-emerald-400' :
                  assetStatus === 'WARNING' ? 'bg-amber-400 animate-ping' : 'bg-rose-500 animate-ping'
                }`} />
                {asset.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Real-time Sensor Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Pressure Gradient */}
        <div className="glass-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>INLET PRESSURE</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-heading font-extrabold text-white">
              {telemetry.inletPressureBar?.toFixed(1) || '215.0'}
            </span>
            <span className="text-[11px] text-cyan-400 font-mono ml-1">bar</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>ΔP: {telemetry.differentialPressureBar?.toFixed(1)} bar</span>
            <span className="text-emerald-400">NOMINAL</span>
          </div>
        </div>

        {/* 2. Fluid Temperature & Hydrate Margin */}
        <div className={`glass-panel p-3.5 flex flex-col justify-between ${
          telemetry.hydrateMarginDeltaTC < 0 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>FLUID TEMP</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2">
            <span className={`text-2xl font-heading font-extrabold ${
              telemetry.hydrateMarginDeltaTC < 0 ? 'text-rose-400' : 'text-white'
            }`}>
              {telemetry.fluidTempC?.toFixed(1) || '62.4'}°C
            </span>
          </div>
          <div className="text-[10px] font-mono flex items-center justify-between">
            <span className="text-slate-400">HYD BUFFER:</span>
            <span className={telemetry.hydrateMarginDeltaTC < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {telemetry.hydrateMarginDeltaTC > 0 ? `+${telemetry.hydrateMarginDeltaTC?.toFixed(1)}°C` : `${telemetry.hydrateMarginDeltaTC?.toFixed(1)}°C`}
            </span>
          </div>
        </div>

        {/* 3. Wall Thickness (UT) */}
        <div className={`glass-panel p-3.5 flex flex-col justify-between ${
          telemetry.wallThicknessMm < 18 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>WALL THICKNESS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className={`text-2xl font-heading font-extrabold ${
              telemetry.wallThicknessMm < 18 ? 'text-rose-400' : 'text-white'
            }`}>
              {telemetry.wallThicknessMm?.toFixed(1) || '24.5'}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono ml-1">mm</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>CRIT: {assetMeta.minAllowableWallMm} mm</span>
            <span className={telemetry.corrosionRateMmYear > 1.0 ? 'text-rose-400' : 'text-slate-300'}>
              {telemetry.corrosionRateMmYear?.toFixed(2)} mm/yr
            </span>
          </div>
        </div>

        {/* 4. Riser TDZ Strain & Bending Stress */}
        <div className={`glass-panel p-3.5 flex flex-col justify-between ${
          telemetry.tdzBendingStressMpa > 180 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TDZ BENDING STRESS</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-2">
            <span className={`text-2xl font-heading font-extrabold ${
              telemetry.tdzBendingStressMpa > 180 ? 'text-rose-400' : 'text-white'
            }`}>
              {Math.round(telemetry.tdzBendingStressMpa || 85)}
            </span>
            <span className="text-[11px] text-purple-400 font-mono ml-1">MPa</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>STRAIN: {Math.round(telemetry.tdzMicroStrain || 220)} µε</span>
            <span className="text-cyan-400">VIV: {telemetry.vivVibrationG?.toFixed(2)}g</span>
          </div>
        </div>

        {/* 5. Mass Balance Discrepancy & Leak Check */}
        <div className={`glass-panel p-3.5 flex flex-col justify-between ${
          telemetry.leakProbabilityPct > 50 ? 'glass-panel-crit' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>LEAK PROBABILITY</span>
            <Radio className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="my-2">
            <span className={`text-2xl font-heading font-extrabold ${
              telemetry.leakProbabilityPct > 50 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}>
              {telemetry.leakProbabilityPct?.toFixed(1)}%
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>ΔQ: {telemetry.massDiscrepancyKgS?.toFixed(2)} kg/s</span>
            <span className={telemetry.leakLocationKp ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {telemetry.leakLocationKp ? `KP ${telemetry.leakLocationKp}` : 'SEALED'}
            </span>
          </div>
        </div>

        {/* 6. Dynamic RUL Forecast */}
        <div className="glass-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PREDICTED RUL</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className={`text-2xl font-heading font-extrabold ${
              telemetry.rulDays < 90 ? 'text-rose-400' : (telemetry.rulDays < 180 ? 'text-amber-400' : 'text-cyan-300')
            }`}>
              {telemetry.rulDays}
            </span>
            <span className="text-[11px] text-slate-400 font-mono ml-1">days</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>CI: [{telemetry.confidenceInterval?.[0]}, {telemetry.confidenceInterval?.[1]}]d</span>
            <span className="text-cyan-400">AI PINN</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Elevation & Kilometer Post (KP) Spatial Profiler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Spatial KP Profile Chart */}
        <div className="lg:col-span-2 glass-panel p-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Subsea Pipeline Elevation & Multi-Channel Spatial Profile
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Continuous distributed quartz P/T, ultrasonic wall scan, and acoustic DAS along KP 0.0 → KP {assetMeta.lengthKm}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">Simulate Anomaly:</span>
              <button
                onClick={() => onSelectScenario('HYDRATE_RISK')}
                className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]"
              >
                Hydrate
              </button>
              <button
                onClick={() => onSelectScenario('TOUCHDOWN_FATIGUE')}
                className="px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px]"
              >
                VIV / TDZ
              </button>
              <button
                onClick={() => onSelectScenario('MICRO_LEAK')}
                className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px]"
              >
                Micro-Leak
              </button>
              <button
                onClick={() => onSelectScenario('NORMAL')}
                className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-[280px] w-full">
            <Line data={kpChartData} options={kpChartOptions} />
          </div>

          {/* Interactive KP Segment Strip */}
          <div className="mt-4 pt-3 border-t border-cyan-500/10">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>PIPELINE SEGMENT INSPECTION STRIP</span>
              <span className="text-cyan-400">ACTIVE: KP {activeSegmentKp} km</span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
              {kpData.slice(0, 12).map((pt, i) => {
                const isSelected = Math.abs(pt.kp - activeSegmentKp) < 0.3;
                const isAlert = (latestData.scenario === 'MICRO_LEAK' && Math.abs(pt.kp - 4.35) < 0.6) ||
                                (latestData.scenario === 'EROSION_WALL_LOSS' && pt.kp >= 11.0);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveSegmentKp(pt.kp)}
                    className={`py-2 px-1 rounded text-center font-mono text-[10px] transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(0,242,254,0.5)]'
                        : isAlert
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500 animate-pulse'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <div>KP {pt.kp}</div>
                    <div className="text-[8px] opacity-75">{pt.wallThicknessMm}mm</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: High-Frequency Telemetry Stream & Anomaly Diagnosis */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Sensor Telemetry Bus
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                20 Hz LIVE
              </span>
            </div>

            {/* Stream Channel Selector */}
            <div className="grid grid-cols-4 gap-1 bg-[#050e20] p-1 rounded-lg border border-cyan-500/15 mb-3 text-[10px] font-mono">
              {['pressure', 'temp', 'flow', 'strain'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setSelectedSensorChannel(ch)}
                  className={`py-1 rounded uppercase ${
                    selectedSensorChannel === ch
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {/* Rolling time-series chart */}
            <div className="h-[140px] w-full">
              <Line
                data={streamChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { display: false },
                    y: {
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* AI Condition Assessment & Actionable Prescription */}
          <div className="mt-3 p-3 rounded-lg bg-[#071328] border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-mono font-bold text-cyan-200">
                AI Physics Diagnostic Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {telemetry.failureMode === 'None (Nominal Base Condition)'
                ? 'System hydraulics, thermal insulation, and riser dynamic bending stresses are operating within nominal baseline parameters.'
                : telemetry.failureMode}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>INSPECTION DISPATCH:</span>
              <span className={telemetry.inspectionPriority === 'LOW' ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                {telemetry.inspectionPriority}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
