import React, { useRef, useEffect, useState } from 'react';
import {
  Maximize2,
  Compass,
  Zap,
  Activity,
  Layers,
  Search,
  Crosshair,
  GitBranch,
  ShieldAlert,
  Droplets,
  Radio,
  Eye
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function SubseaMapCanvas({
  latestData,
  selectedAssetId,
  onSelectAsset
}) {
  const canvasRef = useRef(null);
  const [hoveredAsset, setHoveredAsset] = useState(null);
  const [layers, setLayers] = useState({
    flowlines: true,
    riserCatenary: true,
    sonarPings: true,
    rovPatrol: true,
    bathymetry: true,
    leakAcousticZone: true
  });

  // Animation references
  const animState = useRef({
    flowOffset: 0,
    sonarRadius: 0,
    sonarAngle: 0,
    rovPos: { x: 500, y: 260, targetX: 500, targetY: 260 },
    catenaryWave: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const state = animState.current;

      // Increment animation clocks
      state.flowOffset = (state.flowOffset + 1.2) % 40;
      state.sonarRadius = (state.sonarRadius + 1.2) % 320;
      state.catenaryWave += 0.03;

      // ROV Patrol path
      const targetX = 520 + Math.sin(Date.now() * 0.0006) * 220;
      const targetY = 280 + Math.cos(Date.now() * 0.0004) * 100;
      state.rovPos.x += (targetX - state.rovPos.x) * 0.02;
      state.rovPos.y += (targetY - state.rovPos.y) * 0.02;

      // 1. Clear background abyssal oceanic gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030814');
      bgGrad.addColorStop(0.5, '#051226');
      bgGrad.addColorStop(1, '#020610');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Bathymetric Seabed Contours
      if (layers.bathymetry) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)';
        ctx.lineWidth = 1;
        for (let y = 60; y < height; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x < width; x += 40) {
            const dy = Math.sin((x + y) * 0.015) * 12;
            ctx.lineTo(x, y + dy);
          }
          ctx.stroke();
          ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
          ctx.font = '9px JetBrains Mono';
          ctx.fillText(`-${1800 + Math.round(y * 0.15)}m`, 15, y - 3);
        }

        // Seabed isometric grid dots
        for (let x = 40; x < width; x += 60) {
          for (let y = 40; y < height; y += 60) {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.06)';
            ctx.fillRect(x, y, 1.5, 1.5);
          }
        }
        ctx.restore();
      }

      // 3. Draw Steel Catenary Riser (SCR-01) from Topside FPSO to Touchdown Zone (TDZ)
      if (layers.riserCatenary) {
        ctx.save();
        const fpsoX = 850;
        const fpsoY = 60;
        const tdzX = 640;
        const tdzY = 320;
        const pletX = 550;
        const pletY = 340;

        // Topside Floating Production Unit (FPSO) Hull
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fillRect(fpsoX - 50, fpsoY - 20, 100, 30);
        ctx.strokeRect(fpsoX - 50, fpsoY - 20, 100, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('FPSO SURFACE HULL', fpsoX - 45, fpsoY - 26);

        // Dynamic Catenary Curve
        const isFatigue = latestData?.scenario === 'TOUCHDOWN_FATIGUE';
        const waveFlex = Math.sin(state.catenaryWave) * (isFatigue ? 8 : 3);

        ctx.beginPath();
        ctx.moveTo(fpsoX, fpsoY + 10);
        ctx.bezierCurveTo(
          fpsoX - 40, fpsoY + 160 + waveFlex,
          tdzX + 30, tdzY - 40 + waveFlex,
          tdzX, tdzY
        );
        ctx.strokeStyle = isFatigue ? '#a855f7' : '#00f2fe';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Seabed Lay-Down Section (TDZ to PLET)
        ctx.beginPath();
        ctx.moveTo(tdzX, tdzY);
        ctx.lineTo(pletX, pletY);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Touchdown Zone Marker
        ctx.beginPath();
        ctx.arc(tdzX, tdzY, isFatigue ? 10 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isFatigue ? 'rgba(239, 68, 68, 0.8)' : 'rgba(168, 85, 247, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isFatigue ? '#ef4444' : '#a855f7';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText('TDZ (KP 2.85)', tdzX - 70, tdzY - 10);

        ctx.restore();
      }

      // 4. Draw Seabed Production Flowlines (PFL-101, GEL-201, WIF-301)
      if (layers.flowlines) {
        ctx.save();

        // Flowline 1: PFL-101 (Manifold SM-01 at 200, 320 to PLEM at 550, 340)
        const smX = 180;
        const smY = 320;
        const plemX = 550;
        const plemY = 340;

        const isLeak = latestData?.scenario === 'MICRO_LEAK';
        const isWax = latestData?.scenario === 'WAX_DEPOSITION';

        ctx.beginPath();
        ctx.moveTo(smX, smY);
        ctx.bezierCurveTo(smX + 120, smY - 30, plemX - 120, plemY + 30, plemX, plemY);
        ctx.strokeStyle = isLeak ? '#ef4444' : (isWax ? '#f59e0b' : '#00f2fe');
        ctx.lineWidth = 4;
        ctx.stroke();

        // Animated multiphase flow pulses
        ctx.setLineDash([8, 16]);
        ctx.lineDashOffset = -state.flowOffset;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Flowline 2: GEL-201 Gas Export (550, 340 to 880, 420)
        ctx.beginPath();
        ctx.moveTo(plemX, plemY);
        ctx.lineTo(880, 420);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Flowline 3: WIF-301 Water Injection (180, 440 to 450, 460)
        ctx.beginPath();
        ctx.moveTo(180, 440);
        ctx.lineTo(450, 460);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.restore();
      }

      // 5. Draw Leak Plume & DAS Acoustic Waves if Micro-Leak Scenario
      if (layers.leakAcousticZone && latestData?.scenario === 'MICRO_LEAK') {
        ctx.save();
        const leakX = 350;
        const leakY = 315;

        // Acoustic shockwaves
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.8 - (state.sonarRadius % 80) / 80})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(leakX, leakY, state.sonarRadius % 80, 0, Math.PI * 2);
        ctx.stroke();

        // Hydrocarbon sniffer plume bubbles
        for (let i = 0; i < 5; i++) {
          const plumeY = leakY - ((state.flowOffset * 2 + i * 20) % 70);
          const plumeX = leakX + Math.sin(plumeY * 0.08) * 12;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.beginPath();
          ctx.arc(plumeX, plumeY, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText('LEAK EPICENTER: KP 4.35 km', leakX - 70, leakY - 25);
        ctx.restore();
      }

      // 6. Draw Sonar Expanding Rings from Hub PLEM-01
      if (layers.sonarPings) {
        ctx.save();
        const hubX = 550;
        const hubY = 340;
        ctx.strokeStyle = `rgba(0, 242, 254, ${Math.max(0, 0.3 - state.sonarRadius / 320)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(hubX, hubY, state.sonarRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 7. Draw Subsea Nodes & Assets
      ASSET_DEFINITIONS.forEach(asset => {
        const isSelected = asset.id === selectedAssetId;
        const telemetry = latestData?.assets?.[asset.id];
        const status = telemetry?.status || 'OPTIMAL';
        const { x, y } = asset.coordinates;

        ctx.save();

        // Glowing outer halo
        if (isSelected || status !== 'OPTIMAL') {
          ctx.beginPath();
          ctx.arc(x, y, 22, 0, Math.PI * 2);
          ctx.fillStyle = status === 'CRITICAL'
            ? 'rgba(239, 68, 68, 0.25)'
            : (status === 'WARNING' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 242, 254, 0.25)');
          ctx.fill();
        }

        // Asset Node Box / Circle
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = status === 'CRITICAL' ? '#ef4444' : (status === 'WARNING' ? '#f59e0b' : '#00f2fe');
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : '#040b18';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText(asset.id, x + 16, y - 2);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(asset.type, x + 16, y + 10);

        ctx.restore();
      });

      // 8. Draw Patrolling Inspection ROV / AUV
      if (layers.rovPatrol) {
        ctx.save();
        const rx = state.rovPos.x;
        const ry = state.rovPos.y;

        // ROV Light Cone
        const coneGrad = ctx.createRadialGradient(rx, ry, 5, rx + 40, ry + 40, 70);
        coneGrad.addColorStop(0, 'rgba(0, 242, 254, 0.3)');
        coneGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.arc(rx, ry, 60, 0.2, 0.9);
        ctx.fill();

        // ROV Body
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.fillRect(rx - 8, ry - 6, 16, 12);
        ctx.strokeRect(rx - 8, ry - 6, 16, 12);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText('AUTONOMOUS ROV-ALPHA', rx - 40, ry - 10);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [layers, selectedAssetId, latestData]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    ASSET_DEFINITIONS.forEach(asset => {
      const { x, y } = asset.coordinates;
      const dist = Math.hypot(clickX - x, clickY - y);
      if (dist <= 25) {
        onSelectAsset(asset.id);
      }
    });
  };

  return (
    <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            2.5D Subsea Bathymetric Digital Twin (Flowlines, Risers & Touchdown Zones)
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Interactive deepwater ocean floor terrain (-1,850m) with live multiphase flowlines, catenary dynamics & ROV tracking.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 bg-[#050e20] p-1 rounded-lg border border-cyan-500/20 text-xs font-mono">
          <button
            onClick={() => setLayers(l => ({ ...l, flowlines: !l.flowlines }))}
            className={`px-2 py-1 rounded ${layers.flowlines ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'}`}
          >
            Flowlines
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, riserCatenary: !l.riserCatenary }))}
            className={`px-2 py-1 rounded ${layers.riserCatenary ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500'}`}
          >
            SCR Riser
          </button>
          <button
            onClick={() => setLayers(l => ({ ...l, rovPatrol: !l.rovPatrol }))}
            className={`px-2 py-1 rounded ${layers.rovPatrol ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500'}`}
          >
            ROV Patrol
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/25 bg-[#020712]">
        <canvas
          ref={canvasRef}
          width={1000}
          height={500}
          onClick={handleCanvasClick}
          className="w-full h-auto cursor-pointer block"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-[#050e20]/90 backdrop-blur-md p-2 rounded-lg border border-cyan-500/20 text-[10px] font-mono text-slate-300 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Flowlines</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>SCR Riser</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Touchdown (TDZ)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Active Anomaly</span>
          </div>
        </div>
      </div>

    </div>
  );
}
