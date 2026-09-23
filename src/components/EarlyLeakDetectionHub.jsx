import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Radio,
  ShieldAlert,
  AlertOctagon,
  Gauge,
  Sparkles,
  TrendingDown,
  Lock,
  CheckCircle2,
  Zap,
  Clock,
  Compass,
  Layers
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EarlyLeakDetectionHub({ latestData, onSelectAsset }) {
  const [isolatedValve, setIsolatedValve] = useState(false);

  if (!latestData || !latestData.assets) return null;

  const currentAsset = latestData.assets['PFL-101'] || latestData.assets[ASSET_DEFINITIONS[1].id];
  const history = latestData.history || {};
  const kpData = latestData.kpTelemetryProfile || [];
  const isLeak = currentAsset.leakProbabilityPct > 50;

  // 1. Mass Balance Flow In vs Flow Out Chart
  const massChartData = {
    labels: history.timestamps || [],
    datasets: [
      {
        label: 'Flowline Inlet Mass Rate (kg/s)',
        data: history.massFlowIn || [],
        borderColor: '#00f2fe',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0
      },
      {
        label: 'Flowline Outlet Mass Rate (kg/s)',
        data: history.massFlowOut || [],
        borderColor: isLeak ? '#ef4444' : '#10b981',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0
      }
    ]
  };

  // 2. Negative Pressure Wave (NPW) Acoustic DAS Energy Profile along KP
  const dasAcousticChartData = {
    labels: kpData.map(d => `KP ${d.kp}`),
    datasets: [
      {
        label: 'Fiber-Optic Distributed Acoustic Energy (dB)',
        data: kpData.map(d => d.dasAcousticDb),
        borderColor: isLeak ? '#ef4444' : '#00f2fe',
        backgroundColor: isLeak ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 242, 254, 0.1)',
        fill: true,
        borderWidth: 2.5,
        tension: 0.2,
        pointRadius: (ctx) => (kpData[ctx.dataIndex]?.dasAcousticDb > 50 ? 5 : 1),
        pointBackgroundColor: '#ef4444'
      }
    ]
  };

  const handleTriggerIsolation = () => {
    setIsolatedValve(true);
    setTimeout(() => {
      setIsolatedValve(false);
    }, 8000);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Header Card */}
      <div className={`glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border ${
        isLeak ? 'glass-panel-crit border-rose-500/50' : 'border-rose-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLeak ? 'bg-rose-500/20 border border-rose-400 text-rose-400' : 'bg-rose-500/10 border border-rose-400/30 text-rose-400'
          }`}>
            <Radio className={`w-5 h-5 ${isLeak ? 'animate-ping' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Early Subsea Leak Detection & Acoustic NPW Localization
              </h2>
              <span className={`badge ${isLeak ? 'badge-critical' : 'badge-normal'} text-[10px] font-mono py-0.5 px-2`}>
                {isLeak ? 'LEAK ALARM (P1 CRIT)' : 'INTEGRITY SECURE'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Mass/Volume Balance Anomaly Engine • Negative Pressure Wave (NPW) Time-of-Flight • Subsea DAS Fiber Optics
            </p>
          </div>
        </div>

        {/* Rapid Isolation Trigger Button */}
        {isLeak && (
          <button
            type="button"
            aria-label="Execute emergency subsea ESD isolation sequence"
            onClick={handleTriggerIsolation}
            disabled={isolatedValve}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse"
          >
            <Lock className="w-4 h-4" />
            {isolatedValve ? 'ISOLATION SEQUENCE ACTIVE...' : 'EXECUTE SUBSEA ESD ISOLATION'}
          </button>
        )}
      </div>

      {/* 4 Telemetry Leak KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Leak Confidence */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${isLeak ? 'glass-panel-crit' : ''}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AI LEAK PROBABILITY</span>
            <AlertOctagon className={`w-4 h-4 ${isLeak ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              isLeak ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {currentAsset.leakProbabilityPct?.toFixed(1)}%
            </span>
          </div>
          <div className="text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-400">STATUS:</span>
            <span className={isLeak ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {isLeak ? 'ACTIVE CONTAINMENT BREACH' : 'ZERO LEAKAGE DETECTED'}
            </span>
          </div>
        </div>

        {/* 2. NPW Pinpoint Location */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${isLeak ? 'glass-panel-crit' : ''}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>NPW PINPOINT LOCATION</span>
            <Compass className={`w-4 h-4 ${isLeak ? 'text-rose-400' : 'text-cyan-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              isLeak ? 'text-rose-400' : 'text-slate-200'
            }`}>
              {currentAsset.leakLocationKp ? `KP ${currentAsset.leakLocationKp}` : 'N/A'}
            </span>
            {isLeak && <span className="text-xs text-rose-400 font-mono ml-1">km (±15m)</span>}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Acoustic Wave Speed:</span>
            <span className="text-cyan-300">1,120 m/s</span>
          </div>
        </div>

        {/* 3. Mass Balance Discrepancy */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${isLeak ? 'glass-panel-crit' : ''}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>MASS BALANCE DEFICIT (ΔQ)</span>
            <Gauge className={`w-4 h-4 ${isLeak ? 'text-rose-400' : 'text-slate-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              isLeak ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {currentAsset.massDiscrepancyKgS?.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">kg / s</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Volumetric Equivalent:</span>
            <span className={isLeak ? 'text-rose-400 font-bold' : 'text-slate-300'}>
              {isLeak ? '98.5 bbl/day' : '0.0 bbl/day'}
            </span>
          </div>
        </div>

        {/* 4. Subsea Optical Hydrocarbon Sniffer */}
        <div className={`glass-panel p-4 flex flex-col justify-between ${isLeak ? 'glass-panel-crit' : ''}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>OPTICAL HYDROCARBON SNIFFER</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-heading font-extrabold ${
              isLeak ? 'text-rose-400' : 'text-white'
            }`}>
              {currentAsset.sensorStreams?.opticalMethanePpm?.toFixed(1) || '0.4'}
            </span>
            <span className="text-xs text-cyan-400 font-mono ml-1">ppm-m</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Fluorometer Sensor:</span>
            <span className={isLeak ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {isLeak ? 'PLUME SIGNATURE' : 'BACKGROUND ZERO'}
            </span>
          </div>
        </div>

      </div>

      {/* Main Charts: Mass Balance & DAS Acoustic Wave Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Panel 1: Real-time Mass Balance Flow Comparison */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Real-Time Mass Balance Discrepancy Stream ($Q_{'{'}in{'}'} - Q_{'{'}out{'}'}$)
              </h3>
              <span className="badge badge-cyan text-[9px] font-mono">Mass Conservation</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-3">
              Catches micro-leaks in &lt; 8 seconds by identifying subtle mass flow diverging trends.
            </p>

            <div className="h-[250px] w-full">
              <Line
                data={massChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { display: false },
                    y: {
                      title: { display: true, text: 'Mass Rate (kg/s)', color: '#00f2fe', font: { size: 10 } },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#00f2fe', font: { family: 'JetBrains Mono', size: 9 } }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-[#061328] border border-cyan-500/20 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>INLET MULTIPHASE FLOW: <strong className="text-cyan-300">48.5 kg/s</strong></span>
            <span>OUTLET RECEIVER FLOW: <strong className={isLeak ? 'text-rose-400' : 'text-emerald-400'}>{(48.5 - (currentAsset.massDiscrepancyKgS || 0)).toFixed(2)} kg/s</strong></span>
          </div>
        </div>

        {/* Panel 2: Distributed Fiber-Optic Acoustic Sensor (DAS NPW) Profile */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                Negative Pressure Wave (NPW) Acoustic Energy along KP
              </h3>
              <span className="badge badge-critical text-[9px] font-mono">Time-of-Flight</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-3">
              Acoustic expansion wave arriving at dual ends localizes exact leak coordinate: x = (L + a · Δt) / 2.
            </p>

            <div className="h-[250px] w-full">
              <Line
                data={dasAcousticChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: { display: true, text: 'Kilometer Post (KP)', color: '#64748b', font: { size: 10 } },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } }
                    },
                    y: {
                      title: { display: true, text: 'DAS Acoustic Energy (dB)', color: '#ef4444', font: { size: 10 } },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#ef4444', font: { family: 'JetBrains Mono', size: 9 } }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-[#061328] border border-rose-500/20 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>ACOUSTIC BURST COORDINATE: <strong className={isLeak ? 'text-rose-400' : 'text-slate-400'}>{isLeak ? 'KP 4.35 km' : 'QUIET'}</strong></span>
            <span>PRESSURE DROP GRADIENT: <strong className={isLeak ? 'text-rose-400' : 'text-slate-400'}>{isLeak ? '-0.42 bar/s' : '0.00 bar/s'}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
}
