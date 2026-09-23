import React from 'react';
import { 
  X, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Thermometer,
  Radio,
  Sparkles,
  GitBranch,
  Camera,
  Compass
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function AssetDetailModal({ assetId, latestData, onClose, onNavigateTab }) {
  if (!latestData || !latestData.assets) return null;

  const currentId = assetId || 'PFL-101';
  const assetMeta = ASSET_DEFINITIONS.find(a => a.id === currentId) || ASSET_DEFINITIONS[1];
  const telemetry = latestData.assets[currentId] || latestData.assets['PFL-101'];

  const handleInspectDigitalTwin = () => {
    if (onNavigateTab) onNavigateTab('digital-twin');
    onClose();
  };

  const handleDeployROV = () => {
    if (onNavigateTab) onNavigateTab('rov-deployment');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-modal-title"
        className="glass-panel w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.2)]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-500/20 bg-[#050c1b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="asset-modal-title" className="text-base font-heading font-bold text-white tracking-wide">
                  {assetMeta.name}
                </h2>
                <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                  {assetMeta.id}
                </span>
                <span className={`badge ${
                  telemetry.status === 'OPTIMAL' ? 'badge-normal' :
                  telemetry.status === 'WARNING' ? 'badge-warning' : 'badge-critical'
                } text-[10px] font-mono py-0.5 px-2`}>
                  {telemetry.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {assetMeta.type} • DEPTH: -{assetMeta.depth}m • LENGTH: {assetMeta.lengthKm} km
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset details modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          
          {/* Description */}
          <div className="p-3.5 rounded-xl bg-[#061328] border border-cyan-500/15 text-slate-300 leading-relaxed font-sans text-xs">
            {assetMeta.description}
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#050e20] border border-cyan-500/10">
              <span className="text-slate-300 text-[10px]">OUTER DIAMETER</span>
              <div className="text-white font-bold text-sm mt-1">{assetMeta.outerDiameterInches}"</div>
            </div>
            <div className="p-3 rounded-lg bg-[#050e20] border border-cyan-500/10">
              <span className="text-slate-300 text-[10px]">WALL THICKNESS</span>
              <div className="text-emerald-400 font-bold text-sm mt-1">{telemetry.wallThicknessMm?.toFixed(1)} mm</div>
            </div>
            <div className="p-3 rounded-lg bg-[#050e20] border border-cyan-500/10">
              <span className="text-slate-300 text-[10px]">DESIGN PRESSURE</span>
              <div className="text-cyan-300 font-bold text-sm mt-1">{assetMeta.designPressureBar} bar</div>
            </div>
            <div className="p-3 rounded-lg bg-[#050e20] border border-cyan-500/10">
              <span className="text-slate-300 text-[10px]">PREDICTED RUL</span>
              <div className="text-purple-300 font-bold text-sm mt-1">{telemetry.rulDays} days</div>
            </div>
          </div>

          {/* Quick Action Buttons for Digital Twin and ROV Deployment */}
          <div className="p-3.5 rounded-xl bg-[#071328] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-white font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Subsea Integrity Operations
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Inspect 3D physical FEM mesh or deploy autonomous ROV to this location.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInspectDigitalTwin}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                3D Digital Twin
              </button>
              <button
                onClick={handleDeployROV}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1.5 transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                Deploy ROV Inspection
              </button>
            </div>
          </div>

          {/* Subsea Sensors Mounted on Asset */}
          <div>
            <h4 className="text-xs font-heading font-bold text-white mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Integrated Subsea Sensors & Transducers
            </h4>
            <div className="space-y-1.5">
              {assetMeta.sensors?.map((s) => (
                <div key={s.id} className="p-2 rounded bg-[#050e20] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-200">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/20">
                    {s.type} ({s.unit})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Segment Components & Subsystems */}
          <div>
            <h4 className="text-xs font-heading font-bold text-white mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Subsea Pipe Sections & Component RUL
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assetMeta.components?.map((c) => (
                <div key={c.id} className="p-2.5 rounded bg-[#050e20] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">{c.name}</span>
                  <span className="text-cyan-400 font-bold text-[11px]">{c.normalRUL}d RUL</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#050c1b] flex items-center justify-between text-xs font-mono text-slate-300">
          <span>DNV-OS-F101 / API 17D VERIFIED</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
