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
  ShieldAlert,
  Activity,
  AlertTriangle,
  TrendingDown,
  Clock,
  Sparkles,
  Droplets,
  Layers,
  ChevronRight,
  Flame,
  Bug,
  Compass
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

export default function CorrosionErosionPrognostics({ latestData, selectedAssetId, onSelectAsset }) {
  if (!latestData || !latestData.assets) return null;

  const currentAssetKey = selectedAssetId || 'PFL-101';
  const assetTelemetry = latestData.assets[currentAssetKey] || latestData.assets['PFL-101'];
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentAssetKey) || ASSET_DEFINITIONS[1];

  const nominalWall = assetMeta.nominalWallThicknessMm || 24.5;
  const currentWall = assetTelemetry.wallThicknessMm || 24.2;
  const minAllowable = assetMeta.minAllowableWallMm || 15.2;
  const totalCorrosion = assetTelemetry.totalCorrosionRateMmYear || 0.06;
  const co2Rate = assetTelemetry.co2CorrosionRateMmYear || 0.04;
  const h2sRate = assetTelemetry.h2sCorrosionRateMmYear || 0.015;
  const micRate = assetTelemetry.micCorrosionRateMmYear || 0.005;

  // 1. Degradation Timeline Forecast (Historical -> Present -> End-of-Life Projection)
  const degradationLabels = ['Month -12', 'Month -8', 'Month -4', 'Now', 'Month +4', 'Month +8', 'Month +12', 'Month +18', 'Month +24'];
  const degradationData = [
    nominalWall,
    nominalWall - 0.1,
    nominalWall - 0.2,
    currentWall,
    Math.max(minAllowable - 1, currentWall - (totalCorrosion * (4 / 12))),
    Math.max(minAllowable - 2, currentWall - (totalCorrosion * (8 / 12))),
    Math.max(minAllowable - 3, currentWall - (totalCorrosion * (12 / 12))),
    Math.max(minAllowable - 4, currentWall - (totalCorrosion * (18 / 12))),
    Math.max(minAllowable - 5, currentWall - (totalCorrosion * (24 / 12)))
  ];

  const degradationChartData = {
    labels: degradationLabels,
    datasets: [
      {
        label: 'Ultrasonic Wall Thickness (mm)',
        data: degradationData,
        borderColor: currentWall <= minAllowable + 2.0 ? '#ef4444' : '#00f2fe',
        backgroundColor: currentWall <= minAllowable + 2.0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 242, 254, 0.15)',
        borderWidth: 2.5,
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#fff'
      },
      {
        label: 'ASME B31.8 / DNV-ST-F101 Minimum Allowable Limit (15.2 mm)',
        data: Array(degradationLabels.length).fill(minAllowable),
        borderColor: '#f43f5e',
        borderDash: [6, 4],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // 2. Multiphase Corrosion & Erosion Mechanism Decomposition
  const corrosionBreakdownData = {
    labels: ['de Waard CO₂ Sweet', 'NACE H₂S Sour Pitting', 'SRB Bio-Corrosion (MIC)', 'Tulsa Sand Erosion'],
    datasets: [
      {
        label: 'Degradation Velocity (mm/yr)',
        data: [
          co2Rate,
          h2sRate,
          micRate,
          Math.max(0.01, totalCorrosion - (co2Rate + h2sRate + micRate))
        ],
        backgroundColor: [
          'rgba(0, 242, 254, 0.8)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(239, 68, 68, 0.85)'
        ],
        borderRadius: 4
      }
    ]
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Corrosion / Erosion Kinetics & Multiphase Wall-Thickness RUL
              </h2>
              <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                STAGE 2 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              de Waard CO₂ + NACE H₂S Sour Pitting + SRB Bio-Corrosion (MIC) + Tulsa Sand Erosion Model
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono">
          <span className="text-slate-400">CURRENT TARGET: </span>
          <span className="text-cyan-300 font-bold">{assetMeta.name}</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">MEASURED WALL THICKNESS</div>
          <div className={`text-2xl font-extrabold font-heading my-1 ${
            currentWall <= minAllowable + 2.0 ? 'text-rose-400' : 'text-cyan-300'
          }`}>
            {currentWall.toFixed(2)} mm
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Nominal: {nominalWall.toFixed(1)} mm • Min: {minAllowable.toFixed(1)} mm</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">TOTAL DEGRADATION VELOCITY</div>
          <div className={`text-2xl font-extrabold font-heading my-1 ${
            totalCorrosion > 1.0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {totalCorrosion.toFixed(2)} mm/yr
          </div>
          <div className="text-[10px] text-slate-400 font-mono">CO₂ ({(co2Rate).toFixed(2)}) + H₂S ({(h2sRate).toFixed(2)}) + MIC ({(micRate).toFixed(2)})</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">PREDICTED RUL (DAYS TO LIMIT)</div>
          <div className={`text-2xl font-extrabold font-heading my-1 ${
            assetTelemetry.rulDays < 90 ? 'text-rose-400' : 'text-purple-300'
          }`}>
            {assetTelemetry.rulDays} Days
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Bayesian 90% Confidence Interval</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">SAND BREAKTHROUGH & VELOCITY</div>
          <div className="text-2xl font-extrabold text-amber-400 font-heading my-1">
            {assetTelemetry.sandProductionPpm?.toFixed(1) || 1.2} PPM
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Mixture Velocity: {assetTelemetry.erosionVelocityMs?.toFixed(1) || 3.8} m/s</div>
        </div>

      </div>

      {/* Main Charts: Degradation Timeline & Multiphase Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Wall Thickness Degradation Curve */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-400" />
                Ultrasonic Wall Thickness Degradation & RUL Breach Trajectory
              </h3>
              <span className="text-[10px] font-mono text-rose-400 font-bold">ASME B31.8 LIMIT</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-3">
              Forecasting remaining wall thickness versus statutory minimum design limit.
            </p>

            <div className="h-[250px] w-full">
              <Line
                data={degradationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } } },
                    y: {
                      title: { display: true, text: 'Wall Thickness (mm)', color: '#64748b', font: { size: 10 } },
                      min: 10,
                      max: 28,
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Mechanism Decomposition Bar */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Degradation Mechanism Rate Decomposition
              </h3>
              <span className="badge badge-purple text-[10px] font-mono">SOUR SERVICE</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-3">
              De Waard CO₂ sweet, NACE MR0175 H₂S sour pitting, SRB bio-corrosion, and Tulsa sand erosion.
            </p>

            <div className="h-[250px] w-full">
              <Bar
                data={corrosionBreakdownData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } } },
                    y: {
                      title: { display: true, text: 'Rate (mm/yr)', color: '#64748b', font: { size: 10 } },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
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
