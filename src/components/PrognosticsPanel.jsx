import React from 'react';
import { 
  Line, 
  Bar 
} from 'react-chartjs-2';
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
  TrendingDown, 
  HelpCircle, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

// Register ChartJS modules
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

export default function PrognosticsPanel({ 
  latestData, 
  selectedAssetId, 
  onSelectAsset 
}) {
  if (!latestData || !latestData.assets) return null;

  const currentAssetKey = selectedAssetId || 'MBP-01';
  const assetTelemetry = latestData.assets[currentAssetKey] || latestData.assets['MBP-01'];
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentAssetKey) || ASSET_DEFINITIONS[0];

  const currentRUL = assetTelemetry.rulDays || 90;
  const [lowerCI, upperCI] = assetTelemetry.confidenceInterval || [currentRUL - 8, currentRUL + 12];

  // 1. Generate RUL Degradation Curve Data (Next 120 Days)
  const daysLabels = [];
  const expectedDegradation = [];
  const lowerBand = [];
  const upperBand = [];
  const criticalThreshold = [];

  // Generate 15 sample points across operating timeline
  const pointsCount = 14;
  for (let i = 0; i <= pointsCount; i++) {
    const day = Math.round((i / pointsCount) * 120);
    daysLabels.push(`Day +${day}`);
    
    // Non-linear degradation curve (Weibull/Exponential)
    const factor = Math.pow(day / 120, 1.6);
    const health = Math.max(0, assetTelemetry.healthScore - factor * 80);
    expectedDegradation.push(Number(health.toFixed(1)));
    
    const uncert = 4 + factor * 14;
    lowerBand.push(Number(Math.max(0, health - uncert).toFixed(1)));
    upperBand.push(Number(Math.min(100, health + uncert * 0.7).toFixed(1)));
    criticalThreshold.push(30); // 30% safety threshold
  }

  const rulChartData = {
    labels: daysLabels,
    datasets: [
      {
        label: 'Upper 90% Confidence Bound',
        data: upperBand,
        borderColor: 'transparent',
        backgroundColor: 'rgba(0, 242, 254, 0.08)',
        fill: '+1',
        pointRadius: 0,
        tension: 0.3
      },
      {
        label: 'Lower 90% Confidence Bound',
        data: lowerBand,
        borderColor: 'transparent',
        backgroundColor: 'rgba(0, 242, 254, 0.08)',
        fill: false,
        pointRadius: 0,
        tension: 0.3
      },
      {
        label: 'Predicted Health Trajectory (%)',
        data: expectedDegradation,
        borderColor: '#00f2fe',
        borderWidth: 2.5,
        backgroundColor: 'rgba(0, 242, 254, 0.2)',
        pointBackgroundColor: '#00f2fe',
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.3
      },
      {
        label: 'Critical Maintenance Limit (30%)',
        data: criticalThreshold,
        borderColor: '#ef4444',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const rulChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 11 },
          boxWidth: 12
        }
      },
      tooltip: {
        backgroundColor: 'rgba(6, 16, 34, 0.9)',
        titleColor: '#00f2fe',
        bodyColor: '#ffffff',
        borderColor: 'rgba(0, 242, 254, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
        title: {
          display: true,
          text: 'Asset Health Index (%)',
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 11 }
        }
      }
    }
  };

  // 2. Explainable AI (SHAP Feature Importance)
  const shapFeatures = assetTelemetry.shapContributors || [
    { feature: 'High-Frequency Vibration 3X', weight: 0.42 },
    { feature: 'Differential Bearing Temp', weight: 0.29 },
    { feature: 'Cavitation Acoustic Surge', weight: 0.18 },
    { feature: 'Hydraulic Seal Pressure', weight: 0.11 }
  ];

  const shapChartData = {
    labels: shapFeatures.map(f => f.feature),
    datasets: [
      {
        label: 'SHAP Contribution Weight',
        data: shapFeatures.map(f => Math.round(f.weight * 100)),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(0, 242, 254, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#00f2fe',
          '#a855f7'
        ],
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const shapChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Impact: ${context.raw}% on anomaly score`
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return (
    <div className="space-y-5 mb-5">
      
      {/* Top Header & Asset Selector Pills */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-heading font-bold text-base text-white">
              AI Prognostics & Remaining Useful Life (RUL) Modeling
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Continuous physics-informed machine learning estimating degradation rates, time-to-threshold, and root causes.
            </p>
          </div>
        </div>

        {/* Asset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#071328] p-1 rounded-lg border border-cyan-500/20">
          {ASSET_DEFINITIONS.map(asset => {
            const isSel = asset.id === currentAssetKey;
            const assetData = latestData.assets[asset.id];
            const isCrit = assetData?.status === 'CRITICAL';
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                  isSel 
                    ? 'bg-cyan-500/25 text-cyan-300 font-semibold border border-cyan-400/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {isCrit && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
                {asset.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Prognostics Split (RUL Trajectory & XAI Feature Attribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: RUL Degradation Trajectory Chart */}
        <div className="lg:col-span-7 glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                WEIBULL-EXPONENTIAL HYBRID MODEL
              </span>
              <h3 className="font-heading font-bold text-sm text-white">
                {assetMeta.name} — Health Degradation Trajectory
              </h3>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">Current Forecast:</span>
              <div className="text-lg font-bold text-cyan-300 flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-400" />
                {currentRUL} Days ({lowerCI} - {upperCI}d @ 90% CI)
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full relative">
            <Line data={rulChartData} options={rulChartOptions} />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono border-t border-cyan-500/10 pt-2.5">
            <div className="bg-[#081224] p-2 rounded">
              <span className="text-[10px] text-slate-400">DEGRADATION RATE</span>
              <div className="text-amber-400 font-semibold mt-0.5">
                {assetTelemetry.anomalyScore > 0.5 ? '-4.2% / 100hrs' : '-0.4% / 100hrs'}
              </div>
            </div>
            <div className="bg-[#081224] p-2 rounded">
              <span className="text-[10px] text-slate-400">INTERVENTION WINDOW</span>
              <div className="text-cyan-300 font-semibold mt-0.5">
                {Math.max(3, currentRUL - 14)} - {currentRUL} Days
              </div>
            </div>
            <div className="bg-[#081224] p-2 rounded">
              <span className="text-[10px] text-slate-400">MODEL ACCURACY (MAPE)</span>
              <div className="text-emerald-400 font-semibold mt-0.5">
                3.18% Loss
              </div>
            </div>
          </div>
        </div>

        {/* Right: Explainable AI (XAI / SHAP Feature Importance) */}
        <div className="lg:col-span-5 glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" /> EXPLAINABLE AI (XAI)
              </span>
              <h3 className="font-heading font-bold text-sm text-white">
                Root Cause Attribution (SHAP Importance)
              </h3>
            </div>
            <span className="badge badge-ai text-[10px]">Tree-SHAP</span>
          </div>

          <p className="text-xs text-slate-400 font-mono mb-2">
            Relative weight of physical sensor anomalies influencing the current health score degradation:
          </p>

          <div className="h-[210px] w-full relative">
            <Bar data={shapChartData} options={shapChartOptions} />
          </div>

          {/* AI Diagnostic Recommendation box */}
          <div className="mt-3 p-3 rounded-lg bg-[#0c1b38] border border-cyan-500/20 text-xs font-mono space-y-1">
            <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Prescriptive AI Recommendation:
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {assetTelemetry.status === 'CRITICAL' ? (
                `Immediate ROV dispatch recommended to inspect ${shapFeatures[0]?.feature}. Prepare Class-4 tooling package to prevent catastrophic subsea containment release.`
              ) : assetTelemetry.status === 'WARNING' ? (
                `Degradation trend on ${shapFeatures[0]?.feature} suggests scheduled intervention in next ${currentRUL} days. Throttle flowrate by 15% to mitigate cavitation.`
              ) : (
                `Asset health is within normal statistical tolerances. Baseline sensor readings steady with zero predicted unplanned downtime events.`
              )}
            </p>
          </div>
        </div>

      </div>

      {/* Fleet-wide Prognostic RUL Matrix Table */}
      <div className="glass-panel p-4">
        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3">
          Subsea Fleet Prognostic Health & RUL Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-[#081224] text-slate-400 uppercase text-[10px] border-b border-cyan-500/20">
              <tr>
                <th className="p-3">Asset ID / Name</th>
                <th className="p-3">Subsea Depth</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">AI Anomaly Score</th>
                <th className="p-3">Remaining Useful Life</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {ASSET_DEFINITIONS.map(asset => {
                const data = latestData.assets[asset.id];
                if (!data) return null;
                return (
                  <tr 
                    key={asset.id} 
                    onClick={() => onSelectAsset(asset.id)}
                    className="hover:bg-cyan-500/5 cursor-pointer transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-bold text-white">{asset.id}</div>
                      <div className="text-[11px] text-slate-400">{asset.name}</div>
                    </td>
                    <td className="p-3 text-slate-300">-{asset.depth}m</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{data.healthScore}%</span>
                        <div className="w-16 bg-slate-800 rounded-full h-1">
                          <div 
                            className="bg-cyan-400 h-full rounded-full" 
                            style={{ width: `${data.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`font-semibold ${
                        data.anomalyScore > 0.65 ? 'text-rose-400' :
                        data.anomalyScore > 0.35 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {(data.anomalyScore * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3 font-bold text-cyan-300">
                      {data.rulDays} Days
                    </td>
                    <td className="p-3">
                      <span className={`badge ${
                        data.status === 'CRITICAL' ? 'badge-critical' :
                        data.status === 'WARNING' ? 'badge-warning' : 'badge-normal'
                      }`}>
                        {data.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">
                      {data.status === 'CRITICAL' ? (
                        <span className="text-rose-400 font-semibold">Deploy ROV Priority 1</span>
                      ) : data.status === 'WARNING' ? (
                        <span className="text-amber-400">Schedule Intervention Window</span>
                      ) : (
                        <span className="text-emerald-400">Routine Continuous Monitoring</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
