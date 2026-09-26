import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Clock,
  Radio
} from 'lucide-react';
import { telemetryEngine } from '../services/telemetryEngine';

export default function TimeControlsHUD({
  isPlaying,
  onTogglePlay,
  playbackSpeed = 1,
  onSelectSpeed,
  latestData
}) {
  const [scrubberValue, setScrubberValue] = useState(0);
  const [isScrubbingLocal, setIsScrubbingLocal] = useState(false);

  const snapshotCount = telemetryEngine.getSnapshotCount();
  const maxIndex = Math.max(0, snapshotCount - 1);
  const isScrubbing = telemetryEngine.isScrubbing;
  const currentTick = latestData?.tick || 0;

  useEffect(() => {
    if (!isScrubbing) {
      setScrubberValue(maxIndex);
    }
  }, [maxIndex, isScrubbing, latestData?.tick]);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setScrubberValue(val);
    setIsScrubbingLocal(true);
    telemetryEngine.scrubToIndex(val);
  };

  const handleResumeLive = () => {
    setIsScrubbingLocal(false);
    telemetryEngine.resumeLive();
    setScrubberValue(maxIndex);
  };

  const handleStepBackward = () => {
    const nextVal = Math.max(0, scrubberValue - 1);
    setScrubberValue(nextVal);
    telemetryEngine.scrubToIndex(nextVal);
  };

  const handleStepForward = () => {
    const nextVal = Math.min(maxIndex, scrubberValue + 1);
    setScrubberValue(nextVal);
    telemetryEngine.scrubToIndex(nextVal);
  };

  const speedOptions = [0.5, 1, 2, 5, 10];

  return (
    <div className="glass-panel p-2.5 sm:px-4 sm:py-2.5 border border-cyan-500/30 bg-[#060c1c]/95 shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      
      {/* Left: Playback & Step Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause telemetry progression' : 'Play telemetry progression'}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
            isPlaying
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
        </button>

        {/* Step Backward */}
        <button
          onClick={handleStepBackward}
          disabled={scrubberValue <= 0}
          title="Step 1 tick backward in history"
          className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Rewind className="w-3.5 h-3.5" />
        </button>

        {/* Step Forward */}
        <button
          onClick={handleStepForward}
          disabled={scrubberValue >= maxIndex}
          title="Step 1 tick forward in history"
          className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FastForward className="w-3.5 h-3.5" />
        </button>

        {/* Speed Multipliers */}
        <div className="hidden md:flex items-center gap-1 bg-[#030611] p-1 rounded-md border border-slate-800 text-[11px]">
          <span className="text-slate-300 px-1 font-sans text-[10px]">SPEED:</span>
          {speedOptions.map(spd => (
            <button
              key={spd}
              onClick={() => onSelectSpeed(spd)}
              className={`px-1.5 py-0.5 rounded transition-all ${
                playbackSpeed === spd
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Center: Timeline Scrubber Slider */}
      <div className="flex-1 min-w-[200px] flex items-center gap-3">
        <div className="text-[11px] text-slate-300 shrink-0 flex items-center gap-1 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>TICK <strong className="text-white">{currentTick}</strong></span>
        </div>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max={maxIndex}
            value={scrubberValue}
            onChange={handleSliderChange}
            aria-label="Scrub telemetry history timeline"
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>

        <div className="text-[10px] text-slate-300 shrink-0 font-mono">
          {snapshotCount > 1 ? `${scrubberValue + 1}/${snapshotCount} FRAMES` : 'RECORDING...'}
        </div>
      </div>

      {/* Right: Return to Live or Status Indicator */}
      <div className="flex items-center gap-2">
        {isScrubbing ? (
          <button
            onClick={handleResumeLive}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 text-[11px] font-bold font-sans flex items-center gap-1.5 animate-pulse transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          >
            <Radio className="w-3 h-3 text-amber-400 animate-spin" />
            <span>RETURN TO LIVE</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE SYNC</span>
          </div>
        )}

        {/* Reset Simulation Button */}
        <button
          onClick={() => telemetryEngine.resetSimulation()}
          title="Reset simulation to initial baseline"
          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Reset simulation telemetry"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
