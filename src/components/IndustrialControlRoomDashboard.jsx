import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Layers,
  ChevronRight,
  Radio,
  Sliders,
  DollarSign,
  UserCheck,
  Eye,
  Lock,
  ArrowRight,
  Compass,
  Cpu,
  Info,
  Maximize2,
  RefreshCw,
  Send,
  Zap,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { ASSET_DEFINITIONS, SIMULATION_SCENARIOS, telemetryEngine } from '../services/telemetryEngine';

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

export default function IndustrialControlRoomDashboard({
  latestData,
  selectedAssetId,
  onSelectAsset,
  onSelectScenario,
  userRole,
  onNavigateTab,
  selectedKP = null,
  onSelectKP
}) {
  const [timeWindow, setTimeWindow] = useState('1h');
  const [operatingMode, setOperatingMode] = useState('Autonomous AI-CBI');
  const [isRovDispatchModalOpen, setIsRovDispatchModalOpen] = useState(false);
  const [activeDispatchMission, setActiveDispatchMission] = useState(null);
  const [engineerSignoffConfirmed, setEngineerSignoffConfirmed] = useState(false);
  const [engineerName, setEngineerName] = useState('Lead Subsea Integrity Engineer (O. Smithson, PE)');
  const [justificationReason, setJustificationReason] = useState('Verified against acoustic DAS anomaly threshold and DNV-RP-F116 guidelines.');
  const [dispatchStatus, setDispatchStatus] = useState('READY');

  // Alert Acknowledgment Modal State
  const [ackAlertModal, setAckAlertModal] = useState(null);
  const [ackEngineerName, setAckEngineerName] = useState('O. Smithson, PE (Control Room Lead)');
  const [ackNote, setAckNote] = useState('Telemetry anomaly cross-referenced against acoustic DAS stream. Observation active.');

  if (!latestData || !latestData.assets) return null;

  const currentAssetKey = selectedAssetId || 'PFL-101';
  const assetTelemetry = latestData.assets[currentAssetKey] || latestData.assets['PFL-101'];
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentAssetKey) || ASSET_DEFINITIONS[1];
  const activeAlerts = latestData.activeAlerts || [];
  const filteredAlerts = selectedKP !== null
    ? activeAlerts.filter(a => a.kp === undefined || Math.abs(a.kp - selectedKP) <= 3)
    : activeAlerts;
  const kpProfile = latestData.kpTelemetryProfile || [];
  const history = telemetryEngine.history;

  // Real-Time Sensor Trend Chart (Multi-stream with physics reference threshold bands)
  const chartTimestamps = history.timestamps.length > 0 ? history.timestamps : ['13:30', '13:32', '13:34', '13:36', '13:38', '13:40'];
  const pressureStream = history.inletPressure.length > 0 ? history.inletPressure : [215, 214.8, 215.2, 215.1, 215.0, 214.9];
  const tempStream = history.fluidTemp.length > 0 ? history.fluidTemp : [52.4, 52.1, 52.0, 51.8, 51.5, 51.2];

  const trendChartData = {
    labels: chartTimestamps,
    datasets: [
      {
        label: 'Inlet Pressure (bar)',
        data: pressureStream,
        borderColor: '#2dd4e0',
        backgroundColor: 'rgba(45, 212, 224, 0.08)',
        borderWidth: 2,
        tension: 0.25,
        fill: false,
        pointRadius: 2,
        yAxisID: 'y'
      },
      {
        label: 'Fluid Temp (°C)',
        data: tempStream,
        borderColor: '#38bdf8',
        borderWidth: 2,
        tension: 0.25,
        fill: false,
        pointRadius: 2,
        yAxisID: 'y1'
      },
      {
        label: 'Hydrate Phase Boundary Limit (14.5°C)',
        data: Array(chartTimestamps.length).fill(14.5),
        borderColor: '#f59e0b',
        borderDash: [5, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  const handleOpenRovDispatch = (alert) => {
    setActiveDispatchMission({
      assetId: alert.assetId || currentAssetKey,
      title: alert.title || 'Targeted Anomaly Scan',
      location: alert.title.includes('KP') ? alert.title.match(/KP\s*[\d.]+/)?.[0] || 'KP 4.35' : 'KP 2.85 (Touchdown Zone)',
      tooling: alert.category === 'STRUCTURAL_HEALTH' ? 'Phased Array UT (AUT) + Laser Profiler' : 'High-Resolution UT Clamp + Optical Sniffer',
      dayRateEst: '$115,000 / day',
      vesselSpread: 'DSV Deep Constructor / ROV Hercules-IV',
      reason: alert.message || 'Critical threshold anomaly flagged by Stage 3 autoencoder.'
    });
    setJustificationReason(`Verified against ${alert.category || 'operational'} alert (${alert.id}). Mobilization compliant with DNV-RP-F116.`);
    setEngineerSignoffConfirmed(false);
    setDispatchStatus('READY');
    setIsRovDispatchModalOpen(true);
  };

  const handleExecuteDispatch = (e) => {
    e.preventDefault();
    if (!engineerSignoffConfirmed) return;
    setDispatchStatus('EXECUTING');
    setTimeout(() => {
      if (telemetryEngine.requestRovAuthorization) {
        telemetryEngine.requestRovAuthorization({
          assetId: activeDispatchMission.assetId,
          location: activeDispatchMission.location,
          reason: justificationReason || activeDispatchMission.reason,
          costEstimateUsd: 115000
        });
      }
      if (telemetryEngine.authorizeMission) {
        telemetryEngine.authorizeMission({
          missionId: activeDispatchMission.assetId,
          missionTitle: activeDispatchMission.title,
          engineerName,
          reason: justificationReason || activeDispatchMission.reason
        });
      }
      setDispatchStatus('DISPATCHED_CONFIRMED');
      setTimeout(() => {
        setIsRovDispatchModalOpen(false);
      }, 1200);
    }, 800);
  };

  const handleConfirmAcknowledge = (e) => {
    e.preventDefault();
    if (!ackAlertModal) return;
    telemetryEngine.acknowledgeAlert(ackAlertModal.id, ackEngineerName, ackNote);
    setAckAlertModal(null);
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-100">

      {/* ========================================================================= */}
      {/* ZONE 1: SYSTEM OVERVIEW HEADER (Industrial Control-Room Style) */}
      {/* ========================================================================= */}
      <div className="glass-panel p-3.5 border border-cyan-500/20 bg-[#0d1526]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Asset & Field Identifiers */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111a2e] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-heading font-extrabold text-white tracking-wide uppercase">
                  {assetMeta.name}
                </h1>
                <span className="badge badge-cyan text-[10px] py-0.5 px-2">
                  TAG: {assetMeta.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  DEPTH: -{assetMeta.depth}m • LENGTH: {assetMeta.lengthKm} km
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                <span>MAT: {assetMeta.materialGrade.slice(0, 30)}...</span>
                <span>•</span>
                <span>PTP CLOCK SYNC: <strong className="text-emerald-400">LOCKED (±8ns)</strong></span>
                <span>•</span>
                <span>MODEL VER: <strong className="text-cyan-300">v4.2.8-prod (SHA-256: 8f4b2a)</strong></span>
              </p>
            </div>
          </div>

          {/* Core System Status Pills */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            
            {/* Overall Health Score */}
            <div className="px-3 py-1.5 rounded bg-[#111a2e] border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase">HEALTH INDEX</span>
              <span className={`font-extrabold text-sm ${
                assetTelemetry.healthScore > 80 ? 'text-emerald-400' :
                assetTelemetry.healthScore > 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {assetTelemetry.healthScore}%
              </span>
            </div>

            {/* Active Alert Count */}
            <div className="px-3 py-1.5 rounded bg-[#111a2e] border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase">ACTIVE ALERTS</span>
              <span className={`font-extrabold text-sm ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {activeAlerts.length}
              </span>
            </div>

            {/* Operating Mode */}
            <div className="px-3 py-1.5 rounded bg-[#111a2e] border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase">MODE</span>
              <span className="text-cyan-300 font-bold text-xs">
                {operatingMode}
              </span>
            </div>

            {/* Last Sync UTC */}
            <div className="text-right text-[10px] text-slate-400 font-mono hidden md:block">
              <div>LAST TELEMETRY SYNC</div>
              <div className="text-slate-200">{latestData.timestamp?.slice(11, 19)} UTC</div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN CONSOLE: (Left: Schematic & Sensor Trends | Right: Diagnostics, RUL & Alert Queue) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* LEFT COLUMN (7 COLS): Schematic + Real-Time Sensor Trends */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* ========================================================================= */}
          {/* ZONE 2: LIVE SCHEMATIC PANEL (2D/3D Route Profile with Color-Coded Sensor Nodes) */}
          {/* ========================================================================= */}
          <div className="glass-panel p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  Flowline Bathymetric Route & Sensor Overlay (KP 0.0 to KP 12.4)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                SCALE: 1:1000 • 20 Hz DAS FIBER
              </span>
            </div>

            {/* Interactive Spatial Schematic Map Strip */}
            <div className="p-3 rounded bg-[#0a0e17] border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span className="text-cyan-300 font-bold">MANIFOLD SM-01 (KP 0.0)</span>
                <span>Seabed route (-1,850 m)</span>
                <span className="text-purple-300 font-bold">PLET-01 / SCR-01 (KP 12.4)</span>
              </div>

              {/* Schematic Elevation & Nodes Visualizer */}
              <div className="relative h-16 w-full flex items-center justify-between px-2">
                {/* Connecting Pipe Line */}
                <div className="absolute left-2 right-2 h-1.5 bg-slate-800 rounded">
                  <div
                    className={`h-full rounded transition-all duration-500 ${
                      assetTelemetry.status === 'CRITICAL' ? 'bg-gradient-to-r from-cyan-500 via-rose-500 to-cyan-500' : 'bg-cyan-500/60'
                    }`}
                  />
                </div>

                {/* Overlaid Sensor Points (Color-coded by health status) */}
                {[
                  { kp: 0.0, label: 'PT-01', name: 'Inlet Quartz P/T', status: 'HEALTHY' },
                  { kp: 2.85, label: 'TDZ-ACC', name: 'SCR Touchdown VIV Gauge', status: latestData.scenario === 'TOUCHDOWN_FATIGUE' ? 'CRITICAL' : 'HEALTHY' },
                  { kp: 4.35, label: 'DAS-NPW', name: 'DAS Acoustic / Optical Methane', status: latestData.scenario === 'MICRO_LEAK' ? 'CRITICAL' : 'HEALTHY' },
                  { kp: 6.2, label: 'DTS-HYD', name: 'Thermal DTS / Hydrate Probe', status: latestData.scenario === 'HYDRATE_RISK' ? 'CRITICAL' : 'HEALTHY' },
                  { kp: 9.0, label: 'WAX-DP', name: 'Differential Pressure / Wax Loop', status: latestData.scenario === 'WAX_DEPOSITION' ? 'WARNING' : 'HEALTHY' },
                  { kp: 12.4, label: 'UT-AUT', name: 'PLET Ultrasonic Wall Gauge', status: latestData.scenario === 'EROSION_WALL_LOSS' ? 'CRITICAL' : 'HEALTHY' }
                ].map((node, i) => {
                  const isCrit = node.status === 'CRITICAL';
                  const isWarn = node.status === 'WARNING';
                  const isSelected = selectedKP !== null && Math.abs(selectedKP - node.kp) < 0.1;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => onSelectKP && onSelectKP(isSelected ? null : node.kp)}
                      className={`relative z-10 flex flex-col items-center cursor-pointer group focus:outline-none transition-transform ${
                        isSelected ? 'scale-110' : 'hover:scale-105'
                      }`}
                      title={`${node.name} at KP ${node.kp} km — Click to filter console`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 border-[#0a0e17] flex items-center justify-center transition-all ${
                        isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0e17]' : ''
                      } ${
                        isCrit ? 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-ping' :
                        isWarn ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]' :
                        'bg-emerald-400 group-hover:scale-125'
                      }`} />
                      <span className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-cyan-300 underline' : 'text-slate-300'}`}>
                        KP {node.kp}
                      </span>
                      <span className="text-[8px] text-slate-500">
                        {node.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cross-filter status chip */}
              {selectedKP !== null && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-cyan-950/40 border border-cyan-500/40 rounded text-xs text-cyan-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Cross-filtering console by location: <strong className="font-mono">KP {selectedKP.toFixed(1)} km</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectKP && onSelectKP(null)}
                    className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 transition-colors"
                  >
                    Clear Filter ✕
                  </button>
                </div>
              )}

              {/* Live Spatial Telemetry Readout */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
                <div>
                  <span className="text-slate-500 block">INLET PRESSURE</span>
                  <span className="text-white font-bold">{assetTelemetry.inletPressureBar?.toFixed(1)} bar</span>
                </div>
                <div>
                  <span className="text-slate-500 block">OUTLET PRESSURE</span>
                  <span className="text-white font-bold">{assetTelemetry.outletPressureBar?.toFixed(1)} bar</span>
                </div>
                <div>
                  <span className="text-slate-500 block">FLUID TEMP</span>
                  <span className="text-cyan-300 font-bold">{assetTelemetry.fluidTempC?.toFixed(1)}°C</span>
                </div>
                <div>
                  <span className="text-slate-500 block">WALL THICKNESS</span>
                  <span className="text-emerald-400 font-bold">{assetTelemetry.wallThicknessMm?.toFixed(2)} mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ZONE 3: REAL-TIME SENSOR TREND PANEL (Multi-line Time-Series + Physics Bands) */}
          {/* ========================================================================= */}
          <div className="glass-panel p-4 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  Real-Time Sensor Drift Trends & Physics Reference Bands
                </h3>
              </div>

              {/* Time Window Buttons */}
              <div className="flex items-center gap-1 bg-[#0a0e17] p-0.5 rounded border border-slate-800 font-mono text-[10px]">
                {['5m', '1h', '24h', '7d'].map(tw => (
                  <button
                    key={tw}
                    onClick={() => setTimeWindow(tw)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      timeWindow === tw
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tw}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mb-2">
              Multi-channel time-series monitoring gradual pressure/thermal drift toward failure boundaries.
            </p>

            <div className="h-[210px] w-full">
              <Line
                data={trendChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { color: 'rgba(255, 255, 255, 0.04)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } }
                    },
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: { display: true, text: 'Pressure (bar)', color: '#2dd4e0', font: { size: 9 } },
                      grid: { color: 'rgba(255, 255, 255, 0.04)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: { display: true, text: 'Temp (°C)', color: '#38bdf8', font: { size: 9 } },
                      grid: { display: false },
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

          {/* ========================================================================= */}
          {/* DATA TRUST & COMPLIANCE CUE: Ground Truth vs Model Prediction Comparison */}
          {/* ========================================================================= */}
          <div className="p-3.5 rounded bg-[#0b1324] border border-cyan-500/20 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                LAST INSPECTION GROUND-TRUTH VS. MODEL PREDICTION
              </span>
              <span className="badge badge-normal text-[9px]">
                CALIBRATION ACCURACY: 99.58%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-[#060e1c] border border-slate-800">
                <span className="text-slate-400 block">ROV AUT WALL SCAN (KP 12.4)</span>
                <span className="text-white font-bold text-xs mt-0.5 block">23.80 mm</span>
                <span className="text-slate-500">Physical Ground Truth</span>
              </div>
              <div className="p-2 rounded bg-[#060e1c] border border-slate-800">
                <span className="text-slate-400 block">AI WEIBULL PROJECTION</span>
                <span className="text-cyan-300 font-bold text-xs mt-0.5 block">23.90 mm</span>
                <span className="text-slate-500">Residual Δ: +0.10 mm (0.42%)</span>
              </div>
              <div className="p-2 rounded bg-[#060e1c] border border-slate-800">
                <span className="text-slate-400 block">MODEL INTEGRITY STATUS</span>
                <span className="text-emerald-400 font-bold text-xs mt-0.5 block">DRIFT STABLE</span>
                <span className="text-slate-500">PSI = 0.024 (Limit: 0.10)</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 COLS): Diagnostic & RUL + Alert & Action Queue */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ========================================================================= */}
          {/* ZONE 4: DIAGNOSTIC & RUL PANEL (Classification, UQ Bounds, SHAP XAI Strip) */}
          {/* ========================================================================= */}
          <div className="glass-panel p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Diagnostic Classifier & Bayesian RUL
                  </h3>
                </div>
                <span className="badge badge-ai text-[9px]">
                  STAGE 3 AI
                </span>
              </div>

              {/* Dominant Fault Classification */}
              <div className="p-3 rounded bg-[#0a0e17] border border-slate-800 mb-3 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>PREDICTED FAULT TYPE:</span>
                  <span className="text-emerald-400 font-bold">CONFIDENCE: 98.4%</span>
                </div>
                <div className="text-rose-400 font-bold text-xs">
                  {assetTelemetry.failureMode}
                </div>
                <div className="text-[10px] text-slate-400">
                  Flow Regime: <strong className="text-cyan-300">{assetTelemetry.flowRegime}</strong>
                </div>
              </div>

              {/* Bayesian RUL with Uncertainty Bounds */}
              <div className="p-3 rounded bg-[#0a0e17] border border-slate-800 mb-3 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">REMAINING USEFUL LIFE (RUL):</span>
                  <span className="text-purple-300 font-extrabold text-sm">{assetTelemetry.rulDays} DAYS</span>
                </div>

                {/* Uncertainty Range Strip (P10 / P50 / P90) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>P10 (Conservative): <strong className="text-rose-400">{assetTelemetry.rulP10Days || assetTelemetry.rulDays - 25}d</strong></span>
                    <span>P50: <strong className="text-cyan-300">{assetTelemetry.rulP50Days || assetTelemetry.rulDays}d</strong></span>
                    <span>P90 (Optimistic): <strong className="text-emerald-400">{assetTelemetry.rulP90Days || assetTelemetry.rulDays + 30}d</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 via-cyan-400 to-emerald-400 h-full rounded"
                      style={{ width: `${Math.min(100, (assetTelemetry.rulDays / 450) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explainability Strip: Top Contributing Sensor Features */}
              <div className="space-y-1.5 font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  SHAP Explainability Strip (Top Key Drivers):
                </span>
                {(assetTelemetry.shapAttributions || []).slice(0, 3).map((shap, i) => (
                  <div key={i} className="p-2 rounded bg-[#0a0e17] border border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-white">{shap.feature}</span>
                    <span className="text-cyan-300 font-bold">{shap.desc}</span>
                    <span className="text-purple-400 font-bold">+{(shap.shapValue * 100).toFixed(0)}% Φ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ZONE 5: ALERT & ACTION QUEUE (Tiered Triage + 1-Click ROV Dispatch) */}
          {/* ========================================================================= */}
          <div className="glass-panel p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Tiered Alert & Action Queue
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  STAGE 4 ACTION GATE
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
                {filteredAlerts.length === 0 ? (
                  <div className="p-4 rounded bg-[#0a0e17] border border-slate-800 text-center text-slate-500 font-mono text-xs">
                    {selectedKP !== null 
                      ? `No active alerts within KP ${selectedKP.toFixed(1)} km vicinity.` 
                      : 'No active critical alerts. All baseline thresholds nominal.'}
                  </div>
                ) : (
                  filteredAlerts.map(alert => {
                    const isAck = alert.acknowledged || false;
                    const alertOwner = alert.owner || 'Unassigned';
                    return (
                      <div
                        key={alert.id}
                        className={`p-3 rounded border space-y-2 font-mono text-xs transition-all ${
                          isAck 
                            ? 'bg-slate-900/60 border-slate-700/60 opacity-85' 
                            : alert.severity === 'WARNING' 
                              ? 'bg-amber-950/20 border-amber-500/40' 
                              : 'bg-rose-950/30 border-rose-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`badge ${
                              isAck ? 'bg-slate-800 text-slate-300 border border-slate-600' :
                              alert.severity === 'WARNING' ? 'badge-warning' : 'badge-critical'
                            } text-[9px]`}>
                              {isAck ? 'ACKNOWLEDGED' : alert.severity} • {alert.id}
                            </span>
                            {alert.kp !== undefined && (
                              <span className="text-[9px] text-cyan-300 font-mono bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
                                KP {alert.kp} km
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{alert.timestamp?.slice(11, 19)}</span>
                        </div>

                        <div className="text-white font-bold text-xs">{alert.title}</div>
                        <p className="text-[11px] text-slate-300 font-sans leading-snug">{alert.message}</p>
                        
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <span>Owner: <strong className="text-cyan-300">{alertOwner}</strong></span>
                          <span>Asset: <strong className="text-slate-200">{alert.assetId || 'PFL-101'}</strong></span>
                        </div>

                        {/* Alert Action Toolbar: Acknowledge, Assign, Jump to Asset, ROV Dispatch */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setAckAlertModal(alert)}
                            className={`py-1 px-1.5 rounded text-[10px] font-mono font-medium border flex items-center justify-center gap-1 transition-colors ${
                              isAck 
                                ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' 
                                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-500/50'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {isAck ? 'Ack Details' : 'Acknowledge'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const newOwner = window.prompt(`Assign engineer/owner for ${alert.id}:`, alert.owner || 'Lead Engineer');
                              if (newOwner && newOwner.trim()) {
                                telemetryEngine.assignAlertOwner(alert.id, newOwner.trim());
                              }
                            }}
                            className="py-1 px-1.5 rounded text-[10px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                            Assign
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (alert.assetId && onSelectAsset) {
                                onSelectAsset(alert.assetId);
                              }
                              if (alert.targetTab && onNavigateTab) {
                                onNavigateTab(alert.targetTab);
                              }
                            }}
                            className="py-1 px-1.5 rounded text-[10px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Jump
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRovDispatch(alert)}
                            className="py-1 px-1.5 rounded text-[10px] font-mono bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-black font-bold flex items-center justify-center gap-1 transition-all"
                          >
                            <Camera className="w-3 h-3" />
                            ROV Gate
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>ESCALATION DISPATCH: <strong className="text-emerald-400">TWILIO / SMTP ACTIVE</strong></span>
              <button
                onClick={() => onNavigateTab('alerting-escalation')}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                View Full Alert Log <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: ALERT-TRIGGERED ROV DISPATCH CONFIRMATION (Human-in-the-Loop Sign-Off) */}
      {/* ========================================================================= */}
      {isRovDispatchModalOpen && activeDispatchMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono text-xs">
          <div className="glass-panel w-full max-w-xl flex flex-col overflow-hidden border border-rose-500/40 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#0a0e17] border-b border-rose-500/30">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
                <h3 className="text-sm font-heading font-bold text-white uppercase">
                  Subsea ROV Mission Authorization Gate (HITL)
                </h3>
              </div>
              <button onClick={() => setIsRovDispatchModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleExecuteDispatch} className="p-5 space-y-3.5 bg-[#0d1526]">
              <div className="p-3 rounded bg-rose-950/20 border border-rose-500/30 text-slate-300 text-xs">
                <span className="text-rose-400 font-bold block mb-1">TRIGGERING EVENT:</span>
                {activeDispatchMission.reason}
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-[#0a0e17] border border-slate-800">
                  <span className="text-slate-500 block">TARGET ASSET & LOCATION</span>
                  <span className="text-white font-bold block mt-0.5">{activeDispatchMission.assetId} • {activeDispatchMission.location}</span>
                </div>
                <div className="p-2.5 rounded bg-[#0a0e17] border border-slate-800">
                  <span className="text-slate-500 block">VESSEL SPREAD & RATE</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">{activeDispatchMission.dayRateEst}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#0a0e17] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TOOLING PAYLOAD</span>
                <span className="text-cyan-300 font-bold">{activeDispatchMission.tooling}</span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px]">AUTHORIZING ENGINEER SIGNATURE</label>
                <input
                  type="text"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded p-2 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px]">MANDATORY ENGINEERING JUSTIFICATION</label>
                <textarea
                  rows={2}
                  value={justificationReason}
                  onChange={(e) => setJustificationReason(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded p-2 text-white font-mono focus:outline-none text-xs"
                  placeholder="State engineering basis and compliance reference..."
                  required
                />
              </div>

              {/* Mandatory Human Checkbox Gate */}
              <label className="flex items-start gap-2 p-2.5 rounded bg-[#0a0e17] border border-amber-500/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={engineerSignoffConfirmed}
                  onChange={(e) => setEngineerSignoffConfirmed(e.target.checked)}
                  className="mt-0.5 accent-cyan-400"
                />
                <span className="text-[11px] text-amber-200 leading-snug">
                  I formally authorize mobilizing the ROV spread. I have verified model physics residuals and confirmed that condition-based inspection is warranted under DNV-RP-F116 guidelines.
                </span>
              </label>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRovDispatchModalOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!engineerSignoffConfirmed || dispatchStatus === 'EXECUTING'}
                  className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-1.5 transition-all ${
                    engineerSignoffConfirmed
                      ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {dispatchStatus === 'EXECUTING' ? 'Mobilizing Vessel...' : 'Sign & Execute ROV Dispatch'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ALERT ACKNOWLEDGMENT WITH AUDIT JUSTIFICATION */}
      {/* ========================================================================= */}
      {ackAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono text-xs">
          <div className="glass-panel w-full max-w-lg flex flex-col overflow-hidden border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-between p-4 bg-[#0a0e17] border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-heading font-bold text-white uppercase">
                  Acknowledge Alert ({ackAlertModal.id})
                </h3>
              </div>
              <button onClick={() => setAckAlertModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmAcknowledge} className="p-5 space-y-3 bg-[#0d1526]">
              <div className="p-3 rounded bg-[#0a0e17] border border-slate-800">
                <div className="text-white font-bold mb-1">{ackAlertModal.title}</div>
                <p className="text-[11px] text-slate-400 font-sans">{ackAlertModal.message}</p>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px]">ENGINEER NAME & CREDENTIALS</label>
                <input
                  type="text"
                  value={ackEngineerName}
                  onChange={(e) => setAckEngineerName(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded p-2 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[10px]">ACKNOWLEDGMENT BASIS / ACTION NOTE</label>
                <textarea
                  rows={3}
                  value={ackNote}
                  onChange={(e) => setAckNote(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded p-2 text-white font-mono focus:outline-none text-xs"
                  placeholder="Explain cross-referencing steps or observation protocols..."
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAckAlertModal(null)}
                  className="px-3.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Confirm Acknowledgment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
