import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Radio,
  Send,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  FileCheck,
  Layers,
  History
} from 'lucide-react';
import { ASSET_DEFINITIONS, telemetryEngine } from '../services/telemetryEngine';

export default function AlertingAndEscalationHub({ latestData, onSelectAsset }) {
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [interventionAssetId, setInterventionAssetId] = useState('PFL-101');
  const [interventionAction, setInterventionAction] = useState('Ultrasonic Phased Array Inspection');
  const [interventionFindings, setInterventionFindings] = useState('Pipe wall verified intact at 24.2 mm. No active micro-leak detected.');
  const [newWallMm, setNewWallMm] = useState('24.2');
  const [technicianName, setTechnicianName] = useState('Lead ROV Operator J. Vance');

  if (!latestData) return null;

  const activeAlerts = latestData.activeAlerts || [];
  const alertHistory = latestData.alertHistory || [];
  const escalationLog = latestData.escalationLog || [];
  const interventionHistory = latestData.interventionHistory || [];

  const allAlerts = [...activeAlerts, ...alertHistory];
  const filteredAlerts = selectedTierFilter === 'ALL'
    ? allAlerts
    : allAlerts.filter(a => a.tier === selectedTierFilter || a.severity === selectedTierFilter);

  const handleSubmitIntervention = (e) => {
    e.preventDefault();
    telemetryEngine.logCompletedIntervention({
      assetId: interventionAssetId,
      action: interventionAction,
      findings: interventionFindings,
      newWallThicknessMm: Number(newWallMm),
      technician: technicianName
    });
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Banner Card */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-rose-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                Tiered Alerting, Twilio/SMTP Escalation & Closed-Loop Maintenance
              </h2>
              <span className="badge badge-critical text-[10px] font-mono py-0.5 px-2">
                AUTOMATED DISPATCH
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Multi-Tier Escalation • SMS / Email Automated Paging • Inspection Feedback Loop Integration
            </p>
          </div>
        </div>

        {/* Log Completed Maintenance Button */}
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs font-mono hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Log Completed Intervention
        </button>
      </div>

      {/* 3 Tier Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Critical Tier */}
        <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <div className="text-xs font-mono text-slate-400">CRITICAL (IMMEDIATE ACTION)</div>
            <div className="text-2xl font-extrabold text-rose-400 font-heading mt-1">
              {activeAlerts.filter(a => a.severity === 'CRITICAL').length} Active
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Automated SMS/Email Dispatched</div>
          </div>
          <AlertOctagon className="w-8 h-8 text-rose-400 opacity-70" />
        </div>

        {/* Warning Tier */}
        <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <div className="text-xs font-mono text-slate-400">WARNING (APPROACHING LIMIT)</div>
            <div className="text-2xl font-extrabold text-amber-400 font-heading mt-1">
              {activeAlerts.filter(a => a.severity === 'WARNING').length} Active
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Condition Monitoring Watch</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-400 opacity-70" />
        </div>

        {/* Informational Tier */}
        <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-cyan-500">
          <div>
            <div className="text-xs font-mono text-slate-400">INFORMATIONAL (DRIFT DETECTED)</div>
            <div className="text-2xl font-extrabold text-cyan-300 font-heading mt-1">
              2 Logged
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Baseline Calibration Tracked</div>
          </div>
          <Radio className="w-8 h-8 text-cyan-400 opacity-70" />
        </div>

      </div>

      {/* Alert Feed & Escalation Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Tiered Alert Log */}
        <div className="lg:col-span-2 glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Alert History & Anomaly Triage Feed
              </h3>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1 bg-[#050e20] p-1 rounded-lg border border-slate-800 text-xs font-mono">
                {['ALL', 'CRITICAL', 'WARNING', 'INFORMATIONAL'].map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTierFilter(t)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase transition-all ${
                      selectedTierFilter === t
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="p-6 text-center text-slate-500 font-mono text-xs">
                  No active or historical alerts matching filter.
                </div>
              ) : (
                filteredAlerts.map(alert => {
                  const isCrit = alert.severity === 'CRITICAL' || alert.tier === 'CRITICAL';
                  const isWarn = alert.severity === 'WARNING' || alert.tier === 'WARNING';
                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                        isCrit ? 'bg-rose-950/30 border-rose-500/40' :
                        isWarn ? 'bg-amber-950/30 border-amber-500/40' :
                        'bg-[#050e20] border-cyan-500/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`badge ${
                            isCrit ? 'badge-critical' : (isWarn ? 'badge-warning' : 'badge-cyan')
                          } text-[9px] font-mono py-0.2 px-1.5`}>
                            {alert.tier || alert.severity}
                          </span>
                          <span className="text-xs font-bold text-white font-mono">{alert.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{alert.assetId}]</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug font-sans">
                          {alert.message}
                        </p>
                        <div className="text-[10px] text-cyan-400 font-mono">
                          Action: {alert.action || alert.actionTaken}
                        </div>
                      </div>

                      <div className="text-right text-[10px] font-mono text-slate-400 shrink-0">
                        <div>{alert.timestamp}</div>
                        <div className={alert.status === 'RESOLVED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {alert.status || 'ACTIVE_TRIGGER'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Automated Twilio/SMTP Escalation Gateway */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-1.5">
                <Send className="w-4 h-4 text-cyan-400" />
                Automated Escalation Gateway
              </h3>
              <span className="text-[9px] font-mono text-emerald-400">TWILIO / SMTP</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-3">
              Automated dispatch log sending critical alerts to on-call subsea superintendents.
            </p>

            <div className="space-y-2 overflow-y-auto max-h-[220px]">
              {escalationLog.length === 0 ? (
                <div className="p-4 rounded-lg bg-[#050e20] border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
                  Gateway standby. Critical alerts automatically page on-call engineers.
                </div>
              ) : (
                escalationLog.map((esc, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#050e20] border border-cyan-500/15 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="text-rose-400 font-bold">{esc.id}</span>
                      <span>{esc.timestamp}</span>
                    </div>
                    <div className="text-white font-bold text-[11px]">{esc.alertTitle}</div>
                    <div className="space-y-0.5 pt-1">
                      {esc.channels?.map((ch, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] text-slate-300">
                          <span>{ch.type}: {ch.recipient}</span>
                          <span className="text-emerald-400 font-bold">{ch.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-[#061328] border border-cyan-500/20 text-[10px] font-mono text-slate-300 flex items-center justify-between">
            <span>ESCALATION ROSTER:</span>
            <span className="text-cyan-300 font-bold">24/7 Deepwater Desk Online</span>
          </div>
        </div>

      </div>

      {/* Closed-Loop Completed Interventions Table */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Closed-Loop Maintenance & Completed Work Order Log
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Verifications logged here close the loop, updating live model degradation baselines.
            </p>
          </div>
          <span className="badge badge-normal text-[10px] font-mono py-0.5 px-2">
            MODEL RETRAIN SYNC
          </span>
        </div>

        {interventionHistory.length === 0 ? (
          <div className="p-4 rounded-lg bg-[#050e20] border border-slate-800 text-center text-slate-400 font-mono text-xs">
            No completed interventions logged yet. Click "Log Completed Intervention" above to submit verified field inspection data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-2 font-semibold">WORK ORDER ID</th>
                  <th className="pb-2 font-semibold">TIMESTAMP</th>
                  <th className="pb-2 font-semibold">TARGET ASSET</th>
                  <th className="pb-2 font-semibold">ACTION COMPLETED</th>
                  <th className="pb-2 font-semibold">VERIFIED FINDINGS</th>
                  <th className="pb-2 font-semibold">TECHNICIAN</th>
                  <th className="pb-2 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {interventionHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-bold text-cyan-300">{item.id}</td>
                    <td className="py-2.5 text-slate-400">{item.timestamp}</td>
                    <td className="py-2.5 font-bold text-white">{item.assetId}</td>
                    <td className="py-2.5 text-slate-200">{item.action}</td>
                    <td className="py-2.5 text-slate-300">{item.findings}</td>
                    <td className="py-2.5 text-slate-400">{item.technician}</td>
                    <td className="py-2.5 text-right">
                      <span className="badge badge-normal text-[9px] py-0.5 px-2">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Log Completed Inspection / Intervention */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-xl flex flex-col overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.2)]">
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-[#050c1b]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-heading font-bold text-white">Log Completed Maintenance Intervention</h3>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitIntervention} className="p-5 space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">TARGET SUBSEA ASSET</label>
                <select
                  value={interventionAssetId}
                  onChange={(e) => setInterventionAssetId(e.target.value)}
                  className="w-full bg-[#050e20] border border-cyan-500/20 rounded p-2 text-white font-mono focus:outline-none"
                >
                  {ASSET_DEFINITIONS.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">INTERVENTION ACTION EXECUTED</label>
                <input
                  type="text"
                  value={interventionAction}
                  onChange={(e) => setInterventionAction(e.target.value)}
                  className="w-full bg-[#050e20] border border-cyan-500/20 rounded p-2 text-white font-mono focus:outline-none"
                  placeholder="e.g. ROV Phased Array Scan, Inhibitor Surge Flush"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">VERIFIED WALL THICKNESS (mm) [IF MEASURED]</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWallMm}
                  onChange={(e) => setNewWallMm(e.target.value)}
                  className="w-full bg-[#050e20] border border-cyan-500/20 rounded p-2 text-white font-mono focus:outline-none"
                  placeholder="24.5"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">FIELD FINDINGS & NOTES</label>
                <textarea
                  value={interventionFindings}
                  onChange={(e) => setInterventionFindings(e.target.value)}
                  rows={3}
                  className="w-full bg-[#050e20] border border-cyan-500/20 rounded p-2 text-white font-mono focus:outline-none"
                  placeholder="Details of inspection verification..."
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">AUTHOR / TECHNICIAN</label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full bg-[#050e20] border border-cyan-500/20 rounded p-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Submit & Retrain Model Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
