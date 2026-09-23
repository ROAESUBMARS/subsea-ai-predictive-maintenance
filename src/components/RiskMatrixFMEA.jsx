import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function RiskMatrixFMEA({ latestData, onSelectAsset }) {
  if (!latestData || !latestData.assets) return null;

  // Compute FMEA coordinates for each asset based on real-time anomaly & criticality
  // Consequence (1-5): Safety/Environmental Impact
  // Likelihood (1-5): Probability of failure based on AI anomaly score
  const assetRiskPositions = ASSET_DEFINITIONS.map(asset => {
    const data = latestData.assets[asset.id] || {};
    const anomaly = data.anomalyScore || 0.05;

    // Severity mapping
    let consequence = 3;
    if (asset.criticality === 'CRITICAL_SAFETY') consequence = 5;
    else if (asset.criticality === 'CRITICAL_PRODUCTION') consequence = 4;
    else if (asset.criticality === 'HIGH') consequence = 3;
    else consequence = 2;

    // Likelihood mapping based on AI anomaly score (0.0 - 1.0)
    let likelihood = 1;
    if (anomaly > 0.75) likelihood = 5;
    else if (anomaly > 0.55) likelihood = 4;
    else if (anomaly > 0.35) likelihood = 3;
    else if (anomaly > 0.15) likelihood = 2;
    else likelihood = 1;

    // Risk Priority Number (RPN) = Consequence * Likelihood * (Detection Difficulty)
    const detectionScore = data.status === 'CRITICAL' ? 4 : 2;
    const rpn = consequence * likelihood * detectionScore * 4;

    return {
      ...asset,
      consequence,
      likelihood,
      rpn,
      status: data.status,
      anomaly
    };
  });

  const getCellColor = (c, l) => {
    const score = c * l;
    if (score >= 15) return 'bg-rose-600/30 border-rose-500/40 text-rose-300';
    if (score >= 8) return 'bg-amber-600/25 border-amber-500/35 text-amber-300';
    return 'bg-emerald-600/15 border-emerald-500/25 text-emerald-300';
  };

  const getRiskTier = (c, l) => {
    const score = c * l;
    if (score >= 15) return 'HIGH RISK';
    if (score >= 8) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
      
      {/* 5x5 FMEA Risk Grid */}
      <div className="lg:col-span-7 glass-panel p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-cyan-400" /> FMEA RISK ASSESSMENT
              </span>
              <h3 className="font-heading font-bold text-sm text-white">
                5x5 Subsea Barrier & Reliability Risk Matrix
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ISO 14224 / API 17D</span>
          </div>

          <p className="text-xs text-slate-400 font-mono mb-3">
            Real-time positioning of subsea assets dynamically calculated from AI Anomaly Scores & Safety Barrier Consequence.
          </p>

          {/* 5x5 Matrix Layout */}
          <div className="relative">
            {/* Y-Axis Label (Likelihood) */}
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center mb-1">
              Likelihood / Failure Probability &rarr;
            </div>

            <div className="grid grid-cols-5 gap-1.5 aspect-square max-h-[340px] w-full">
              {[5, 4, 3, 2, 1].map(l => (
                <React.Fragment key={`row-${l}`}>
                  {[1, 2, 3, 4, 5].map(c => {
                    const assetsHere = assetRiskPositions.filter(a => a.likelihood === l && a.consequence === c);
                    return (
                      <div 
                        key={`cell-${l}-${c}`}
                        className={`rounded-lg border p-1 flex flex-col items-center justify-center relative transition-all ${getCellColor(c, l)}`}
                      >
                        <span className="absolute top-1 left-1 text-[9px] font-mono opacity-40">
                          {c},{l}
                        </span>

                        {assetsHere.map(a => (
                          <button
                            key={a.id}
                            type="button"
                            aria-label={`Inspect asset ${a.id} in matrix cell Consequence ${c}, Likelihood ${l}`}
                            onClick={() => onSelectAsset(a.id)}
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg transition-transform hover:scale-110 mb-0.5 ${
                              a.status === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' :
                              a.status === 'WARNING' ? 'bg-amber-400 text-slate-900' :
                              'bg-slate-900/90 text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            {a.id}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* X-Axis Label (Consequence) */}
            <div className="text-[10px] font-mono text-slate-300 uppercase tracking-widest text-center mt-2">
              Consequence / Safety Impact (1: Insignificant &rarr; 5: Catastrophic)
            </div>
          </div>
        </div>

        {/* Legend strip */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-cyan-500/10 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-emerald-500" /> Low (Acceptable)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-500" /> ALARP (Monitor)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-rose-500 animate-ping" /> Unacceptable (Intervene)
          </div>
        </div>
      </div>

      {/* Right: RPN Table & Barrier Integrity */}
      <div className="lg:col-span-5 glass-panel p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-sm text-white">
              Risk Priority Number (RPN) Ranking
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Updated Live</span>
          </div>

          <div className="space-y-2 mt-3">
            {assetRiskPositions
              .sort((a, b) => b.rpn - a.rpn)
              .map((asset, idx) => (
                <div 
                  key={asset.id}
                  onClick={() => onSelectAsset(asset.id)}
                  className="p-2.5 rounded-lg bg-[#09152b] border border-cyan-500/15 hover:border-cyan-400/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-slate-400">#{idx + 1}</span>
                    <div>
                      <div className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                        {asset.id}
                        <span className="text-[10px] font-normal text-slate-400 font-mono truncate max-w-[120px]">
                          {asset.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Likelihood: <strong className="text-slate-200">{asset.likelihood}/5</strong> | Consequence: <strong className="text-slate-200">{asset.consequence}/5</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-bold text-sm ${
                      asset.rpn > 100 ? 'text-rose-400' : (asset.rpn > 50 ? 'text-amber-400' : 'text-emerald-400')
                    }`}>
                      RPN: {asset.rpn}
                    </div>
                    <span className={`text-[9px] font-mono font-semibold uppercase ${
                      asset.rpn > 100 ? 'text-rose-400' : (asset.rpn > 50 ? 'text-amber-400' : 'text-emerald-400')
                    }`}>
                      {getRiskTier(asset.consequence, asset.likelihood)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Safety Barrier Compliance Index */}
        <div className="mt-3 p-3 rounded-lg bg-[#071328] border border-cyan-500/20 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span>Primary Safety Barrier Integrity:</span>
            <strong className="text-cyan-300">99.4%</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Secondary Environmental Barrier:</span>
            <strong className="text-emerald-400">100.0% SEALED</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
