import React, { useState } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Send, 
  Wrench, 
  Anchor, 
  ShieldAlert, 
  Layers, 
  FileText,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function WorkOrdersAndAlerts({ 
  latestData, 
  onSelectAsset 
}) {
  const [activeWorkOrders, setActiveWorkOrders] = useState([
    {
      id: 'WO-SUB-8921',
      assetId: 'XT-101',
      title: 'Choke Valve Sand Erosion Inspection & Acoustic Profiling',
      priority: 'P2 - PREDICTIVE',
      status: 'ROV IN TRANSIT',
      progress: 45,
      tooling: 'Ultrasonic Wall Thickness Gauge & Class 4 Torque Tool',
      vessel: 'Skandi Constructor DSV',
      createdAt: '2026-08-28 18:30 UTC'
    },
    {
      id: 'WO-SUB-8918',
      assetId: 'MBP-01',
      title: 'Booster Pump Ceramic Bearing Lubricant Top-Off & Vibration Baseline',
      priority: 'P2 - PREDICTIVE',
      status: 'VERIFICATION',
      progress: 85,
      tooling: 'Dual-Port Hot Stab Lube Injection',
      vessel: 'DeepOcean Atlantic',
      createdAt: '2026-08-27 12:15 UTC'
    }
  ]);

  const [formAsset, setFormAsset] = useState('BOP-01');
  const [formMission, setFormMission] = useState('BOP Hydraulic Accumulator & MUX Pod Flush');
  const [formTooling, setFormTooling] = useState('High-Pressure Dual Hot Stab & Diagnostic Fluke Unit');
  const [formPriority, setFormPriority] = useState('P1 - CRITICAL INTERVENTION');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState(null);

  // Generate dynamic alerts based on current scenario
  const alerts = [];
  if (latestData?.assets) {
    Object.entries(latestData.assets).forEach(([assetId, data]) => {
      if (data.status === 'CRITICAL') {
        alerts.push({
          id: `ALT-${assetId}-CRIT`,
          assetId,
          severity: 'P1 - EMERGENCY',
          title: `Severe Anomaly on ${assetId} (${(data.anomalyScore * 100).toFixed(0)}% AI Score)`,
          desc: `RUL degraded to ${data.rulDays} days. Potential loss of safety barrier integrity. Immediate intervention advised.`,
          timestamp: 'Just now',
          timeToFail: `${data.rulDays} Days`
        });
      } else if (data.status === 'WARNING') {
        alerts.push({
          id: `ALT-${assetId}-WARN`,
          assetId,
          severity: 'P2 - PREDICTIVE',
          title: `Degradation Trend on ${assetId} (${(data.anomalyScore * 100).toFixed(0)}% AI Score)`,
          desc: `Sensor parameter drift detected. Projected maintenance required within ${data.rulDays} operating days.`,
          timestamp: '3m ago',
          timeToFail: `${data.rulDays} Days`
        });
      }
    });
  }

  // Handle new ROV Work Order Dispatch
  const handleDispatch = (e) => {
    e.preventDefault();
    setIsDispatching(true);

    setTimeout(() => {
      const newWO = {
        id: `WO-SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        assetId: formAsset,
        title: formMission,
        priority: formPriority,
        status: 'DEPLOYING TMS',
        progress: 10,
        tooling: formTooling,
        vessel: 'Subsea 7 Seven Arctic DSV',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      };

      setActiveWorkOrders(prev => [newWO, ...prev]);
      setIsDispatching(false);
      setDispatchSuccessMsg(`Work Order ${newWO.id} dispatched! Autonomous ROV Triton-XLX has received flight coordinates.`);

      setTimeout(() => setDispatchSuccessMsg(null), 6000);
    }, 900);
  };

  return (
    <div className="space-y-5 mb-5">
      
      {/* Alert Feed Section */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="font-heading font-bold text-base text-white">
              Active AI-Triaged Anomaly Alerts
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {alerts.length} Active Incident Signals
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            All subsea assets operating within standard ISO safety envelopes. No active P1/P2 alarm triggers.
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map(alt => (
              <div 
                key={alt.id}
                className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                  alt.severity.includes('P1') ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${alt.severity.includes('P1') ? 'badge-critical' : 'badge-warning'} text-[10px]`}>
                      {alt.severity}
                    </span>
                    <strong className="text-white font-heading text-sm">{alt.title}</strong>
                    <span className="text-[10px] font-mono text-slate-400">({alt.timestamp})</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300">
                    {alt.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-300">RUL: <strong className="text-white">{alt.timeToFail}</strong></span>
                  <button
                    onClick={() => onSelectAsset(alt.assetId)}
                    aria-label={`Diagnose subsea node ${alt.assetId} for ${alt.title}`}
                    className="btn-secondary text-[11px] py-1 px-2.5"
                  >
                    Diagnose Node &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ROV Intervention Dispatcher & Active Work Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Dispatch Form */}
        <div className="lg:col-span-5 glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Anchor className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                Dispatch Autonomous ROV Flight Mission
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-mono mb-4">
              Configure tooling payload and dispatch Tether Management System (TMS) launch for subsea predictive intervention.
            </p>

            {dispatchSuccessMsg && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                {dispatchSuccessMsg}
              </div>
            )}

            <form onSubmit={handleDispatch} className="space-y-3 text-xs font-mono">
              
              <div>
                <label htmlFor="wo-target-asset" className="block text-slate-300 uppercase text-[10px] mb-1">Target Subsea Asset</label>
                <select
                  id="wo-target-asset"
                  value={formAsset}
                  onChange={e => setFormAsset(e.target.value)}
                  className="w-full bg-[#081224] text-white p-2 rounded border border-cyan-500/20 focus:border-cyan-400 focus:outline-none"
                >
                  {ASSET_DEFINITIONS.map(a => (
                    <option key={a.id} value={a.id}>{a.id} - {a.name} (-{a.depth}m)</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="wo-mission-scope" className="block text-slate-300 uppercase text-[10px] mb-1">Intervention Mission Scope</label>
                <input
                  id="wo-mission-scope"
                  type="text"
                  value={formMission}
                  onChange={e => setFormMission(e.target.value)}
                  className="w-full bg-[#081224] text-white p-2 rounded border border-cyan-500/20 focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g. Hydraulic Seal Flush & Hot-Stab"
                  required
                />
              </div>

              <div>
                <label htmlFor="wo-tooling-pkg" className="block text-slate-300 uppercase text-[10px] mb-1">Tooling Package & Manipulator</label>
                <select
                  id="wo-tooling-pkg"
                  value={formTooling}
                  onChange={e => setFormTooling(e.target.value)}
                  className="w-full bg-[#081224] text-white p-2 rounded border border-cyan-500/20 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="High-Pressure Dual Hot Stab & Diagnostic Fluke Unit">High-Pressure Dual Hot Stab & Diagnostic Fluke Unit</option>
                  <option value="Class 4 Torque Tool & Subsea Laser Metrology">Class 4 Torque Tool & Subsea Laser Metrology</option>
                  <option value="Acoustic Ultrasonic Thickness Probe & CP Wand">Acoustic Ultrasonic Thickness Probe & CP Wand</option>
                  <option value="Hydraulic Barrier Fluid Flushing Skids">Hydraulic Barrier Fluid Flushing Skids</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="wo-priority" className="block text-slate-300 uppercase text-[10px] mb-1">Priority Tier</label>
                  <select
                    id="wo-priority"
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value)}
                    className="w-full bg-[#081224] text-white p-2 rounded border border-cyan-500/20 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="P1 - CRITICAL INTERVENTION">P1 - CRITICAL INTERVENTION</option>
                    <option value="P2 - PREDICTIVE">P2 - PREDICTIVE</option>
                    <option value="P3 - ROUTINE MAINTENANCE">P3 - ROUTINE MAINTENANCE</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="wo-vessel" className="block text-slate-300 uppercase text-[10px] mb-1">Assigned Dive Vessel</label>
                  <input
                    id="wo-vessel"
                    type="text"
                    disabled
                    value="Skandi Constructor DSV"
                    className="w-full bg-[#050c18] text-slate-300 p-2 rounded border border-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="w-full btn-primary text-xs justify-center py-2.5"
                >
                  {isDispatching ? (
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 animate-spin" /> Uplinking Flight Plan to ROV...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" /> Dispatch Autonomous ROV Flight Mission
                    </span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Right: Active Work Orders Table & Progress */}
        <div className="lg:col-span-7 glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm text-white">
                  Active Subsea Maintenance Work Orders
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeWorkOrders.length} Logged Tasks
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {activeWorkOrders.map(wo => (
                <div 
                  key={wo.id}
                  className="p-3.5 rounded-lg bg-[#09152b] border border-cyan-500/15 space-y-2.5 text-xs font-mono"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{wo.id}</span>
                        <span className="badge badge-cyan text-[10px]">{wo.assetId}</span>
                        <span className={`badge ${wo.priority.includes('P1') ? 'badge-critical' : 'badge-warning'} text-[9px]`}>
                          {wo.priority}
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs mt-0.5">
                        {wo.title}
                      </p>
                    </div>

                    <span className="text-cyan-300 font-bold text-xs bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {wo.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Intervention Progress</span>
                      <span className="text-cyan-400 font-bold">{wo.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${wo.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>Tool: <strong className="text-slate-300">{wo.tooling}</strong></span>
                    <span>Vessel: <strong className="text-slate-300">{wo.vessel}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 text-right pt-2">
            Automated sync with SAP Plant Maintenance & Maximo Oil & Gas
          </div>
        </div>

      </div>

    </div>
  );
}
