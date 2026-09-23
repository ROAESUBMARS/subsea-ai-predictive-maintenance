import React, { useState } from 'react';
import {
  Layers,
  Compass,
  Activity,
  GitBranch,
  ShieldAlert,
  Droplets,
  Thermometer,
  Gauge,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Sliders
} from 'lucide-react';
import SubseaMapCanvas from './SubseaMapCanvas';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function DigitalTwinHub({ latestData, selectedAssetId, onSelectAsset }) {
  const [activeTwinView, setActiveTwinView] = useState('BATHYMETRY_MAP'); // 'BATHYMETRY_MAP' | 'CROSS_SECTION_FEM' | 'CATENARY_ELEVATION'
  const [selectedSegmentKp, setSelectedSegmentKp] = useState(4.35);

  if (!latestData || !latestData.assets) return null;

  const currentAsset = latestData.assets[selectedAssetId] || latestData.assets['PFL-101'];
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === selectedAssetId) || ASSET_DEFINITIONS[1];
  const kpData = latestData.kpTelemetryProfile || [];

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Banner Card */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Subsea Digital Twin & 3D Bathymetric Physics Engine
              </h2>
              <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                TWIN SYNC (0.01s LATENCY)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Multi-Domain Physics Coupling • Boundary Condition Calibration • Real-Time Seabed Hydrodynamics (-1,850m)
            </p>
          </div>
        </div>

        {/* View Switcher (WAI-ARIA Tablist) */}
        <div role="tablist" aria-label="Digital twin view switcher" className="flex items-center gap-1 bg-[#050e20] p-1 rounded-lg border border-cyan-500/20 text-xs font-mono">
          <button
            type="button"
            role="tab"
            aria-selected={activeTwinView === 'BATHYMETRY_MAP'}
            onClick={() => setActiveTwinView('BATHYMETRY_MAP')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTwinView === 'BATHYMETRY_MAP'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            2.5D Seabed Bathymetry
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTwinView === 'CROSS_SECTION_FEM'}
            onClick={() => setActiveTwinView('CROSS_SECTION_FEM')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTwinView === 'CROSS_SECTION_FEM'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Pipe Cross-Section & Stress FEM
          </button>
        </div>
      </div>

      {/* 4 Twin Synchronized State Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>FINITE ELEMENT SYNC</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-heading font-extrabold text-cyan-300">
              100.0% CONVERGED
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Residual Norm:</span>
            <span className="text-emerald-400">0.00042 (Optimal)</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>COUPLED HYDRODYNAMICS</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-heading font-extrabold text-purple-300">
              1.85 knots Current
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Morison Drag Force:</span>
            <span className="text-cyan-400">14.2 kN / m</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>THERMAL BOUNDARY TWIN</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-heading font-extrabold text-amber-300">
              U = 0.85 W/m²K
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Pipe-in-Pipe Aerogel:</span>
            <span className="text-emerald-400">Intact (100%)</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SEABED CONTACT NONLINEARITY</span>
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-heading font-extrabold text-emerald-400">
              P-Y SOIL SPRINGS
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Clay Shear Strength:</span>
            <span className="text-slate-300">8.4 kPa at TDZ</span>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {activeTwinView === 'BATHYMETRY_MAP' && (
        <div className="animate-fade-in">
          <SubseaMapCanvas
            latestData={latestData}
            selectedAssetId={selectedAssetId}
            onSelectAsset={onSelectAsset}
          />
        </div>
      )}

      {activeTwinView === 'CROSS_SECTION_FEM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
          
          {/* Left 2 Cols: Pipe Cross-Sectional Geometry & Multi-Layer Thickness Mesh */}
          <div className="lg:col-span-2 glass-panel p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Pipe-in-Pipe (PiP) Cross-Sectional Digital Twin Mesh (KP {selectedSegmentKp})
                </h3>
                <span className="badge badge-cyan text-[9px] font-mono">
                  Super Duplex + Inconel Clad
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mb-4">
                Real-time stress tensor distribution and radial thermal gradient through insulation and steel barrier layers.
              </p>

              {/* Cross-Section Graphic */}
              <div className="relative w-full h-[280px] bg-[#020712] rounded-xl border border-cyan-500/20 flex items-center justify-center overflow-hidden">
                {/* Outer Pipe (Outer Jacket) */}
                <div className="w-56 h-56 rounded-full border-4 border-slate-600 bg-slate-800/40 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,242,254,0.1)]">
                  <span className="absolute top-2 text-[9px] font-mono text-slate-400">Outer Carbon Steel Jacket (18")</span>

                  {/* Annulus Insulation (Aerogel / PU Foam) */}
                  <div className="w-44 h-44 rounded-full border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center relative">
                    <span className="absolute top-2 text-[9px] font-mono text-amber-300">Annulus Aerogel Insulation</span>

                    {/* Inner Production Pipe Body */}
                    <div className="w-32 h-32 rounded-full border-4 border-cyan-400 bg-cyan-950/50 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                      <span className="absolute top-2 text-[9px] font-mono text-cyan-300">14" Super Duplex</span>

                      {/* Internal Multiphase Flow Core */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600/60 to-red-600/40 flex flex-col items-center justify-center text-center p-1 border border-orange-400/50">
                        <span className="text-[9px] font-bold text-white">MULTIPHASE</span>
                        <span className="text-[8px] font-mono text-amber-200">{currentAsset.fluidTempC?.toFixed(1)}°C • {currentAsset.inletPressureBar?.toFixed(0)} bar</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live UT Thickness Pinpoint Callout */}
                <div className="absolute bottom-4 right-4 bg-[#050e20]/95 backdrop-blur-md p-2.5 rounded-lg border border-cyan-500/30 text-xs font-mono">
                  <div className="text-slate-400 text-[10px]">CURRENT WALL THICKNESS:</div>
                  <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                    {currentAsset.wallThicknessMm?.toFixed(2)} mm
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Nominal: {assetMeta.nominalWallThicknessMm} mm</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300">
              <span>HOOP STRESS: <strong className="text-cyan-300">184.2 MPa</strong></span>
              <span>VON MISES EQUIVALENT: <strong className="text-purple-300">212.5 MPa</strong></span>
              <span>UTILIZATION RATIO: <strong className="text-emerald-400">0.58 (&lt; 0.72 Limit)</strong></span>
            </div>
          </div>

          {/* Right Col: Segment KP Selector & Boundary Parameters */}
          <div className="glass-panel p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-heading font-bold text-white mb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Seabed Traversal KP Selector
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-3">
                Select location along pipeline to inspect digital twin cross-section.
              </p>

              <div className="space-y-2">
                {kpData.slice(0, 7).map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSegmentKp(pt.kp)}
                    className={`w-full p-2.5 rounded-lg text-left font-mono text-xs transition-all flex items-center justify-between ${
                      selectedSegmentKp === pt.kp
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'bg-[#050e20] text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>KP {pt.kp} km</span>
                    <span className="text-[11px] text-slate-300">{pt.wallThicknessMm} mm | {pt.temperatureC}°C</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#061328] border border-cyan-500/20 text-[11px] font-mono text-slate-300">
              <span className="text-cyan-300 font-bold">FEM Solvers:</span> ABAQUS / ANSYS Coupled Thermal-Structural Subsea Pipeline Element.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
