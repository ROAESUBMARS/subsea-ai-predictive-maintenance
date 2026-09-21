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
  Droplets,
  Flame,
  Activity,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sliders
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

export default function FlowAssuranceOptimizer({ latestData, onSelectAsset }) {
  if (!latestData || !latestData.assets) return null;

  const pfl = latestData.assets['PFL-101'] || latestData.assets[ASSET_DEFINITIONS[1].id];
  const fluidTemp = pfl.fluidTempC || 52.4;
  const pressure = pfl.inletPressureBar || 215.0;
  const hydrateEqTemp = pfl.hydrateEquilibriumTempC || 14.5;
  const hydrateMargin = pfl.hydrateMarginDeltaTC || 18.2;
  const waxLayer = pfl.waxLayerThicknessMm || 0.2;
  const megDosing = pfl.megInjectionRateLh || 38;
  const dynamicSavings = pfl.dynamicMegSavingsPerDay || 1850;
  const waterCut = pfl.waterCutPct || 14.2;
  const gor = pfl.gorScfStb || 1680;

  // 1. Dynamic PVT Hydrate Phase Envelope Curve
  const pvtCurve = latestData.hydrateEnvelopeCurve || [];
  const pressures = pvtCurve.map(p => p.pressureBar);
  const hydrateTemps = pvtCurve.map(p => p.hydrateTempC);

  const phaseEnvelopeData = {
    labels: pressures,
    datasets: [
      {
        label: `Dynamic PVT Hydrate Formation Boundary (WC: ${waterCut}%, GOR: ${gor})`,
        data: hydrateTemps,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0
      },
      {
        label: `Current Flowline Operating State (${pressure.toFixed(1)} bar, ${fluidTemp.toFixed(1)}°C)`,
        data: pressures.map(p => Math.abs(p - Math.round(pressure / 15) * 15) < 8 ? fluidTemp : null),
        borderColor: fluidTemp <= hydrateEqTemp ? '#ef4444' : '#00f2fe',
        backgroundColor: fluidTemp <= hydrateEqTemp ? '#ef4444' : '#00f2fe',
        pointRadius: 7,
        pointHoverRadius: 9,
        showLine: false
      }
    ]
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Dynamic PVT Hydrate Phase Envelope & Bounded RL Dosing Optimizer
              </h2>
              <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                STAGE 2 & 3 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live Compositional Hydrate Curve (Water Cut: {waterCut}%) • Constrained RL Action Envelope [20, 200] L/h
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono">
          <span className="text-slate-400">CHEMICAL OPEX OPTIMIZATION: </span>
          <span className="text-emerald-400 font-bold text-sm">+${dynamicSavings.toLocaleString()} / day</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">DYNAMIC PVT HYDRATE MARGIN</div>
          <div className={`text-2xl font-extrabold font-heading my-1 ${
            hydrateMargin < 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {hydrateMargin > 0 ? `+${hydrateMargin.toFixed(1)}°C` : `${hydrateMargin.toFixed(1)}°C`}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">T_fluid ({fluidTemp.toFixed(1)}°C) - T_hyd ({hydrateEqTemp.toFixed(1)}°C)</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">BOUNDED RL MEG INHIBITOR RATE</div>
          <div className="text-2xl font-extrabold text-cyan-300 font-heading my-1">
            {megDosing.toFixed(0)} L/h
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Clamped Rate Limit: ±15 L/h/min</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">WAX CRYSTAL LAYER THICKNESS</div>
          <div className={`text-2xl font-extrabold font-heading my-1 ${
            waxLayer > 2.0 ? 'text-amber-400' : 'text-cyan-300'
          }`}>
            {waxLayer.toFixed(2)} mm
          </div>
          <div className="text-[10px] text-slate-400 font-mono">WAT: 37.5°C • Deposition Model</div>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">LIVE WATER CUT & GOR</div>
          <div className="text-2xl font-extrabold text-purple-300 font-heading my-1">
            {waterCut}% / {gor}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Dynamic Thermodynamic Shift Factor</div>
        </div>
      </div>

      {/* Main Charts: Dynamic PVT Hydrate Phase Envelope */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Dynamic Compositional Pressure-Temperature ($P-T$) Hydrate Phase Envelope
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live phase boundary automatically recalculated based on reservoir Water Cut (WC) and Gas-Oil Ratio (GOR).
            </p>
          </div>
          <span className="badge badge-warning text-[10px] font-mono">
            THERMODYNAMIC ENVELOPE
          </span>
        </div>

        <div className="h-[280px] w-full mt-3">
          <Line
            data={phaseEnvelopeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: { display: true, text: 'Operating Pressure (bar)', color: '#64748b', font: { size: 10 } },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' },
                  ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } }
                },
                y: {
                  title: { display: true, text: 'Equilibrium Temperature (°C)', color: '#64748b', font: { size: 10 } },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' },
                  ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
                }
              }
            }}
          />
        </div>
      </div>

    </div>
  );
}
