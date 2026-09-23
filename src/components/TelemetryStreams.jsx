import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Activity, 
  Gauge, 
  Sliders, 
  Download, 
  Flame, 
  Radio, 
  Zap, 
  Waves,
  RefreshCcw
} from 'lucide-react';
import { telemetryEngine } from '../services/telemetryEngine';

export default function TelemetryStreams({ latestData }) {
  const [activeChannel, setActiveChannel] = useState('ALL');
  const history = telemetryEngine.getHistory();

  if (!history || history.length === 0) return null;

  const timestamps = history.map(h => h.timestamp);

  // Common chart styling
  const getChartOptions = (yTitle, unit) => ({
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
        backgroundColor: 'rgba(6, 16, 34, 0.9)',
        borderColor: 'rgba(0, 242, 254, 0.3)',
        borderWidth: 1,
        titleColor: '#00f2fe',
        bodyColor: '#ffffff'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 6 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } },
        title: {
          display: true,
          text: yTitle,
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 10 }
        }
      }
    }
  });

  // Chart 1: Vibration & Harmonics
  const vibrationData = {
    labels: timestamps,
    datasets: [
      {
        label: 'MBP-01 Vibration RMS (mm/s)',
        data: history.map(h => h.assets['MBP-01']?.metrics.vibrationRMS || 0),
        borderColor: '#00f2fe',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'MBP-01 3X Harmonic Peak (g)',
        data: history.map(h => h.assets['MBP-01']?.metrics.harmonic3XPeak || 0),
        borderColor: '#ef4444',
        borderWidth: 1.8,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'XT-101 Choke Vibration (mm/s)',
        data: history.map(h => h.assets['XT-101']?.metrics.chokeVibrationRMS || 0),
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  // Chart 2: Pressure Dynamics
  const pressureData = {
    labels: timestamps,
    datasets: [
      {
        label: 'BOP Accumulator Bank (psi)',
        data: history.map(h => h.assets['BOP-01']?.metrics.accumulatorPressure || 0),
        borderColor: '#38bdf8',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'XT-101 Choke ΔP (psi)',
        data: history.map(h => h.assets['XT-101']?.metrics.chokeDeltaP || 0),
        borderColor: '#a855f7',
        borderWidth: 1.8,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'BOP Seal Hydraulic ΔP (psi)',
        data: history.map(h => h.assets['BOP-01']?.metrics.sealHydraulicDeltaP || 0),
        borderColor: '#ec4899',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  // Chart 3: Temperature & Cavitation Index
  const tempCavitationData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Booster Pump Bearing Temp (°C)',
        data: history.map(h => h.assets['MBP-01']?.metrics.bearingTempC || 0),
        borderColor: '#f97316',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'Suction Cavitation Index (%)',
        data: history.map(h => h.assets['MBP-01']?.metrics.cavitationIndex || 0),
        borderColor: '#eab308',
        borderWidth: 1.8,
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  // Chart 4: Acoustic Sand & Umbilical IR
  const acousticIRData = {
    labels: timestamps,
    datasets: [
      {
        label: 'XT-101 Sand Acoustic Emission (dB)',
        data: history.map(h => h.assets['XT-101']?.metrics.sandAcousticDb || 0),
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'Umbilical Insulation Resistance (MΩ / 10)',
        data: history.map(h => (h.assets['UMB-01']?.metrics.insulationResistanceMOhm || 0) / 10),
        borderColor: '#10b981',
        borderWidth: 1.8,
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  // Export CSV helper
  const exportTelemetryCSV = () => {
    let csv = 'Timestamp,BOP_Acc_Pressure_psi,XT101_Choke_DeltaP_psi,MBP_Vib_RMS_mms,MBP_Bearing_Temp_C,UMB_IR_MOhm\n';
    history.forEach(h => {
      csv += `${h.timestamp},${h.assets['BOP-01']?.metrics.accumulatorPressure},${h.assets['XT-101']?.metrics.chokeDeltaP},${h.assets['MBP-01']?.metrics.vibrationRMS},${h.assets['MBP-01']?.metrics.bearingTempC},${h.assets['UMB-01']?.metrics.insulationResistanceMOhm}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subsea_telemetry_${Date.now()}.csv`;
    a.click();
  };

  const curBop = latestData?.assets?.['BOP-01']?.metrics;
  const curXt = latestData?.assets?.['XT-101']?.metrics;
  const curMbp = latestData?.assets?.['MBP-01']?.metrics;
  const curUmb = latestData?.assets?.['UMB-01']?.metrics;

  return (
    <div className="space-y-5 mb-5">
      
      {/* Header with live statistics & CSV download */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="font-heading font-bold text-base text-white">
              Multi-Channel Subsea Telemetry Streams
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              High-frequency sensor acquisition with FFT vibration harmonics, acoustic sand monitoring, and hydraulic delta-P.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            20 Hz Subsea Bus Connected
          </span>

          <button
            onClick={exportTelemetryCSV}
            aria-label="Export high-frequency subsea telemetry streams to CSV"
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Live Numeric Gauges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="glass-panel p-3.5">
          <div className="text-[10px] font-mono text-slate-300 uppercase flex items-center justify-between">
            <span>BOP Acc Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-heading font-bold text-white mt-1">
            {curBop?.accumulatorPressure || 3000} <span className="text-xs text-slate-300 font-mono">psi</span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono mt-1">
            Min Limit: <span className="text-amber-400">2,400 psi</span>
          </div>
        </div>

        <div className="glass-panel p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Pump Vibration RMS</span>
            <Activity className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-heading font-bold text-white mt-1">
            {curMbp?.vibrationRMS || 2.4} <span className="text-xs text-slate-400 font-mono">mm/s</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            ISO Limit: <span className="text-rose-400">7.1 mm/s</span>
          </div>
        </div>

        <div className="glass-panel p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>XT-101 Sand Acoustic</span>
            <Waves className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-heading font-bold text-white mt-1">
            {curXt?.sandAcousticDb || 42} <span className="text-xs text-slate-400 font-mono">dB</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Erosion Alert: <span className="text-amber-400">&gt; 65 dB</span>
          </div>
        </div>

        <div className="glass-panel p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Umbilical IR (Phase C)</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-heading font-bold text-white mt-1">
            {curUmb?.insulationResistanceMOhm || 480} <span className="text-xs text-slate-400 font-mono">MΩ</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            IEEE Limit: <span className="text-amber-400">&gt; 50 MΩ</span>
          </div>
        </div>

      </div>

      {/* 2x2 Telemetry Streaming Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Stream 1: Vibration & FFT Spectrum */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Dynamic Vibration & Harmonic FFT Spectrum
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Velocity RMS / Peak (g)</span>
          </div>
          <div className="h-[230px] w-full relative">
            <Line data={vibrationData} options={getChartOptions('Velocity (mm/s)', 'mm/s')} />
          </div>
        </div>

        {/* Stream 2: Hydraulic & Choke Pressures */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-blue-400" />
              Subsea Pressure & Hydraulic Actuator Profiling
            </h3>
            <span className="text-[10px] font-mono text-slate-400">P (psi)</span>
          </div>
          <div className="h-[230px] w-full relative">
            <Line data={pressureData} options={getChartOptions('Pressure (psi)', 'psi')} />
          </div>
        </div>

        {/* Stream 3: Thermal & Cavitation Index */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              Thermal Dynamics & Cavitation Severity
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Temp (°C) / Cavitation (%)</span>
          </div>
          <div className="h-[230px] w-full relative">
            <Line data={tempCavitationData} options={getChartOptions('Value', '')} />
          </div>
        </div>

        {/* Stream 4: Acoustic Sand & Umbilical IR */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-teal-400" />
              Acoustic Sand Detector & Electrical Insulation
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Acoustic dB / MΩ (scaled)</span>
          </div>
          <div className="h-[230px] w-full relative">
            <Line data={acousticIRData} options={getChartOptions('dB / (MΩ/10)', '')} />
          </div>
        </div>

      </div>

    </div>
  );
}
