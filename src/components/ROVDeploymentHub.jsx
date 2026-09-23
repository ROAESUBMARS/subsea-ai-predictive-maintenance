import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Radio,
  Eye,
  Camera,
  Layers,
  Activity,
  ShieldAlert,
  Sliders,
  Send,
  Play,
  Pause,
  RotateCw,
  Crosshair,
  Gauge,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Move,
  Navigation,
  Anchor,
  Sparkles,
  Terminal,
  Maximize2
} from 'lucide-react';
import { ASSET_DEFINITIONS } from '../services/telemetryEngine';

export default function ROVDeploymentHub({ latestData, selectedAssetId, onSelectAsset }) {
  const [activeRovId, setActiveRovId] = useState('ROV-HERCULES');
  const [rovMode, setRovMode] = useState('AUTONOMOUS_PATROL'); // 'AUTONOMOUS_PATROL' | 'MANUAL_STATION_KEEP' | 'INSPECTING_HOTSPOT'
  const [selectedTargetKp, setSelectedTargetKp] = useState(4.35);
  const [activePayloadTool, setActivePayloadTool] = useState('PAUT_SCANNER'); // 'PAUT_SCANNER' | 'CP_PROBE' | 'LASER_PROFILER' | 'OPTICAL_SNIFFER'
  const [cameraZoom, setCameraZoom] = useState(1);
  const [floodlightsOn, setFloodlightsOn] = useState(true);
  const [laserScalersOn, setLaserScalersOn] = useState(true);
  const [activeLog, setActiveLog] = useState([
    { time: '23:04:12', msg: 'ROV Hercules-IV deployed from DSV Deep Explorer at moonpool.', type: 'info' },
    { time: '23:05:40', msg: 'Tether Management System (TMS) parked at -1,810m seabed altitude.', type: 'info' },
    { time: '23:06:15', msg: 'Dual forward HD low-light cameras active with 4K stereo photogrammetry.', type: 'normal' },
    { time: '23:07:02', msg: 'Autonomous transit along PFL-101 flowline corridor initiated.', type: 'info' }
  ]);

  const hudCanvasRef = useRef(null);
  const animRef = useRef({
    headingDeg: 142,
    pitchDeg: -4.2,
    rollDeg: 1.1,
    depthM: 1832.4,
    altitudeM: 2.8,
    thrusterRpm: 1450,
    tetherTensionKn: 3.2,
    scanSweepAngle: 0,
    sonarParticles: []
  });

  const rovFleet = [
    {
      id: 'ROV-HERCULES',
      name: 'ROV Hercules-IV (Heavy Work-Class)',
      ratingDepth: '3,000m',
      powerKw: '250 HP Hydraulic + Electric',
      tooling: 'Dual Schilling 7-Function Titan Arms + Phased Array UT Scanner',
      status: 'UNDERWATER_MONITORING',
      currentLocation: 'PFL-101 Corridor (KP 4.35)',
      tetherLengthM: 180,
      batteryPct: 94
    },
    {
      id: 'AUV-ORCA',
      name: 'AUV Orca-Surveyor (Autonomous Swarm)',
      ratingDepth: '4,000m',
      powerKw: 'Lithium-Ion Autonomous Swarm',
      tooling: 'Synthetic Aperture Sonar (SAS) + Laser Bathymetric Profiler',
      status: 'MAPPING_SEABED',
      currentLocation: 'SCR-01 Touchdown Zone (KP 2.85)',
      tetherLengthM: 0,
      batteryPct: 86
    },
    {
      id: 'ROV-TRITON',
      name: 'ROV Triton-XL (Inspection Spread)',
      ratingDepth: '2,500m',
      powerKw: '150 HP Work-Class',
      tooling: 'Cathodic Protection Dip Probe + Optical Methane Sniffer',
      status: 'STANDBY_ON_TMS',
      currentLocation: 'PLEM-01 Station (-1,835m)',
      tetherLengthM: 40,
      batteryPct: 98
    }
  ];

  const currentRov = rovFleet.find(r => r.id === activeRovId) || rovFleet[0];

  // Dynamic ROV HUD Canvas Simulation
  useEffect(() => {
    const canvas = hudCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const renderHUD = () => {
      const width = canvas.width;
      const height = canvas.height;
      const state = animRef.current;

      state.scanSweepAngle = (state.scanSweepAngle + 0.03) % (Math.PI * 2);
      state.headingDeg = (state.headingDeg + Math.sin(Date.now() * 0.001) * 0.1) % 360;
      state.altitudeM = 2.8 + Math.sin(Date.now() * 0.0008) * 0.4;
      state.depthM = 1832.4 + Math.sin(Date.now() * 0.0005) * 0.6;

      // 1. Deep Abyssal Ocean Underwater Video Simulation
      const oceanGrad = ctx.createRadialGradient(
        width / 2, height / 2, 80,
        width / 2, height / 2, width / 1.5
      );
      if (floodlightsOn) {
        oceanGrad.addColorStop(0, '#0a2342');
        oceanGrad.addColorStop(0.4, '#051329');
        oceanGrad.addColorStop(0.8, '#020914');
        oceanGrad.addColorStop(1, '#01040a');
      } else {
        oceanGrad.addColorStop(0, '#040d1a');
        oceanGrad.addColorStop(1, '#010408');
      }
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Simulated Seabed & Flowline in Camera View
      ctx.save();
      
      // Seabed sediment floor
      const seabedY = height * 0.68;
      const sedimentGrad = ctx.createLinearGradient(0, seabedY, 0, height);
      sedimentGrad.addColorStop(0, '#152538');
      sedimentGrad.addColorStop(0.5, '#0d1825');
      sedimentGrad.addColorStop(1, '#070e17');
      ctx.fillStyle = sedimentGrad;
      ctx.fillRect(0, seabedY, width, height - seabedY);

      // Marine snow sediment particles floating underwater
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(i * 99 + Date.now() * 0.0005) * 0.5 + 0.5) * width;
        const py = ((i * 37 + Date.now() * 0.02) % height);
        const pSize = (i % 3) + 1;
        ctx.fillRect(px, py, pSize, pSize);
      }

      // Flowline / Riser Pipe in ROV Camera Perspective
      ctx.save();
      const pipeX1 = width * 0.2;
      const pipeY1 = height;
      const pipeX2 = width * 0.75;
      const pipeY2 = seabedY - 30;

      // Pipe shadow
      ctx.beginPath();
      ctx.moveTo(pipeX1, pipeY1 + 10);
      ctx.lineTo(pipeX2, pipeY2 + 10);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 42;
      ctx.stroke();

      // Pipe body (Super Duplex with yellow insulation coating)
      const pipeGrad = ctx.createLinearGradient(pipeX1, pipeY1, pipeX2, pipeY2);
      pipeGrad.addColorStop(0, '#b8860b');
      pipeGrad.addColorStop(0.5, '#d4af37');
      pipeGrad.addColorStop(1, '#8b6508');
      ctx.beginPath();
      ctx.moveTo(pipeX1, pipeY1);
      ctx.lineTo(pipeX2, pipeY2);
      ctx.strokeStyle = pipeGrad;
      ctx.lineWidth = 36;
      ctx.stroke();

      // Pipe highlight & field weld joints
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pipeX1 - 8, pipeY1 - 8);
      ctx.lineTo(pipeX2 - 8, pipeY2 - 8);
      ctx.stroke();

      // Field joint collars
      for (let j = 0.2; j < 0.9; j += 0.25) {
        const jx = pipeX1 + (pipeX2 - pipeX1) * j;
        const jy = pipeY1 + (pipeY2 - pipeY1) * j;
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(jx, jy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Active Anomaly Plume in Video Feed if Scenario is Micro-Leak
      if (latestData?.scenario === 'MICRO_LEAK') {
        const leakSiteX = width * 0.48;
        const leakSiteY = height * 0.76;

        for (let b = 0; b < 12; b++) {
          const bY = leakSiteY - ((Date.now() * 0.08 + b * 22) % 180);
          const bX = leakSiteX + Math.sin(bY * 0.05 + b) * 14;
          const bRadius = 3 + (b % 4);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
          ctx.beginPath();
          ctx.arc(bX, bY, bRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Anomaly Tag Target Box
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(leakSiteX - 40, leakSiteY - 50, 80, 70);
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText('AI DETECTED: MICRO-LEAK (KP 4.35)', leakSiteX - 90, leakSiteY - 60);
      }

      // Active Inspection Laser Scalers (Twin green parallel laser spots for size scaling)
      if (laserScalersOn) {
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(width / 2 - 35, height / 2 + 30, 3, 0, Math.PI * 2);
        ctx.arc(width / 2 + 35, height / 2 + 30, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      // 3. High-Tech ROV HUD Overlay Graphics
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 1;

      // Central Reticle & Crosshairs
      const cx = width / 2;
      const cy = height / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.moveTo(cx - 55, cy);
      ctx.lineTo(cx - 20, cy);
      ctx.moveTo(cx + 20, cy);
      ctx.lineTo(cx + 55, cy);
      ctx.moveTo(cx, cy - 55);
      ctx.lineTo(cx, cy - 20);
      ctx.moveTo(cx, cy + 20);
      ctx.lineTo(cx, cy + 55);
      ctx.stroke();

      // Horizon Pitch Ladder
      const pitchOffset = state.pitchDeg * 4;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy + pitchOffset);
      ctx.lineTo(cx - 30, cy + pitchOffset);
      ctx.moveTo(cx + 30, cy + pitchOffset);
      ctx.lineTo(cx + 70, cy + pitchOffset);
      ctx.stroke();

      // Top Heading Compass Tape
      ctx.fillStyle = 'rgba(5, 14, 32, 0.8)';
      ctx.fillRect(cx - 150, 15, 300, 28);
      ctx.strokeRect(cx - 150, 15, 300, 28);

      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`HDG: ${Math.round(state.headingDeg)}° | NNE`, cx, 33);
      ctx.textAlign = 'left';

      // Left HUD Strip: Depth & Altitude Gauges
      ctx.fillStyle = 'rgba(5, 14, 32, 0.85)';
      ctx.fillRect(20, 20, 150, 95);
      ctx.strokeRect(20, 20, 150, 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('SUBSEA NAVIGATION', 30, 36);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px JetBrains Mono';
      ctx.fillText(`-${state.depthM.toFixed(1)}m`, 30, 56);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`ALT: ${state.altitudeM.toFixed(1)}m AGL`, 30, 74);
      ctx.fillText(`TMS TENSION: ${state.tetherTensionKn} kN`, 30, 92);

      // Right HUD Strip: Tooling Payload Readouts
      ctx.fillStyle = 'rgba(5, 14, 32, 0.85)';
      ctx.fillRect(width - 190, 20, 170, 95);
      ctx.strokeRect(width - 190, 20, 170, 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('TOOLING PAYLOAD', width - 180, 36);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillText(activePayloadTool, width - 180, 54);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`CP: -1048 mV (Ag/AgCl)`, width - 180, 72);
      ctx.fillText(`UT GRID: 128 PTS (OK)`, width - 180, 90);

      // Bottom Right Sonar Radar Mini-Display
      const sonarX = width - 75;
      const sonarY = height - 75;
      const sonarRadius = 45;

      ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
      ctx.beginPath();
      ctx.arc(sonarX, sonarY, sonarRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Sonar sweep line
      ctx.beginPath();
      ctx.moveTo(sonarX, sonarY);
      ctx.lineTo(
        sonarX + Math.cos(state.scanSweepAngle) * sonarRadius,
        sonarY + Math.sin(state.scanSweepAngle) * sonarRadius
      );
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sonar target blips
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(sonarX + 15, sonarY - 12, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f2fe';
      ctx.font = '8px JetBrains Mono';
      ctx.fillText('360° SONAR', sonarX - 24, sonarY + 58);

      // Bottom Left Status Strip
      ctx.fillStyle = 'rgba(5, 14, 32, 0.85)';
      ctx.fillRect(20, height - 40, 240, 25);
      ctx.strokeRect(20, height - 40, 240, 25);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText('● LIVE 4K HD FEED (LATENCY 8.2ms)', 30, height - 24);

      ctx.restore();

      animationId = requestAnimationFrame(renderHUD);
    };

    renderHUD();

    return () => cancelAnimationFrame(animationId);
  }, [floodlightsOn, laserScalersOn, activePayloadTool, latestData]);

  const handleFlyToHotspot = (kp) => {
    setSelectedTargetKp(kp);
    setRovMode('INSPECTING_HOTSPOT');
    const newLog = {
      time: new Date().toISOString().slice(11, 19),
      msg: `ROV Thrusters locked on vector towards Hotspot at KP ${kp} km. Speed: 1.8 knots.`,
      type: 'action'
    };
    setActiveLog(prev => [newLog, ...prev]);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Operations Header */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                ROV & AUV Underwater Monitoring & Inspection Operations
              </h2>
              <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                4K SUBSEA HUD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live Deepwater Camera HUD • Thruster Navigation • Sonar 3D Reconstruction • Phased-Array UT Tooling
            </p>
          </div>
        </div>

        {/* Fleet Selection Buttons (WAI-ARIA Tablist) */}
        <div role="tablist" aria-label="ROV fleet selection" className="flex items-center gap-1.5 bg-[#050e20] p-1 rounded-lg border border-cyan-500/20 text-xs font-mono">
          {rovFleet.map(rov => (
            <button
              key={rov.id}
              type="button"
              role="tab"
              aria-selected={activeRovId === rov.id}
              aria-label={`Select ${rov.name}`}
              onClick={() => setActiveRovId(rov.id)}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                activeRovId === rov.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {rov.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main ROV Live Camera Feed & Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Live 4K HUD Canvas & Camera Controls */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] bg-black">
            <canvas
              ref={hudCanvasRef}
              width={900}
              height={480}
              className="w-full h-auto block"
            />

            {/* Quick On-Screen Overlay Action Bar */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#050e20]/90 backdrop-blur-md p-1.5 rounded-lg border border-cyan-500/20 text-xs font-mono">
              <button
                type="button"
                aria-pressed={floodlightsOn}
                aria-label="Toggle ROV high-intensity floodlights"
                onClick={() => setFloodlightsOn(!floodlightsOn)}
                className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                  floodlightsOn ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                Floodlights
              </button>
              <button
                type="button"
                aria-pressed={laserScalersOn}
                aria-label="Toggle ROV green laser scaling grid"
                onClick={() => setLaserScalersOn(!laserScalersOn)}
                className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                  laserScalersOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Crosshair className="w-3 h-3" />
                Laser Scaler
              </button>
            </div>
          </div>

          {/* Tooling Payload Control Strip (WAI-ARIA Radio Group) */}
          <div className="glass-panel p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div role="radiogroup" aria-label="Active sensor payload" className="flex items-center gap-2">
              <span className="text-slate-300">ACTIVE SENSOR PAYLOAD:</span>
              {['PAUT_SCANNER', 'CP_PROBE', 'LASER_PROFILER', 'OPTICAL_SNIFFER'].map(tool => (
                <button
                  key={tool}
                  type="button"
                  role="radio"
                  aria-checked={activePayloadTool === tool}
                  aria-label={`Select ${tool.replace('_', ' ')} payload tool`}
                  onClick={() => setActivePayloadTool(tool)}
                  className={`px-2.5 py-1 rounded transition-all ${
                    activePayloadTool === tool
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {tool.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFlyToHotspot(4.35)}
                className="px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3 h-3" />
                Fly to Leak Anomaly (KP 4.35)
              </button>
              <button
                onClick={() => handleFlyToHotspot(2.85)}
                className="px-3 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3 h-3" />
                Fly to TDZ Fatigue (KP 2.85)
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: ROV Vehicle Telemetry & Live Mission Terminal */}
        <div className="space-y-4">
          
          {/* ROV Vehicle Specifications */}
          <div className="glass-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-heading font-bold text-white">
                  {currentRov.name}
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ● {currentRov.status}
                </span>
              </div>
              <span className="badge badge-cyan text-[10px] font-mono">
                {currentRov.ratingDepth}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#050e20] border border-slate-800">
                <span className="text-slate-400 text-[10px]">CURRENT LOCATION</span>
                <div className="text-cyan-300 font-bold mt-0.5">{currentRov.currentLocation}</div>
              </div>
              <div className="p-2 rounded bg-[#050e20] border border-slate-800">
                <span className="text-slate-400 text-[10px]">TETHER EXTENSION</span>
                <div className="text-white font-bold mt-0.5">{currentRov.tetherLengthM} m (TMS)</div>
              </div>
              <div className="p-2 rounded bg-[#050e20] border border-slate-800">
                <span className="text-slate-400 text-[10px]">BATTERY / POWER</span>
                <div className="text-emerald-400 font-bold mt-0.5">{currentRov.batteryPct}% Nominal</div>
              </div>
              <div className="p-2 rounded bg-[#050e20] border border-slate-800">
                <span className="text-slate-400 text-[10px]">PAYLOAD STATUS</span>
                <div className="text-purple-300 font-bold mt-0.5">READY (ONLINE)</div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#061328] border border-cyan-500/15 text-[11px] font-mono text-slate-300">
              <span className="text-slate-400">TOOLING ARSENAL:</span> {currentRov.tooling}
            </div>
          </div>

          {/* Live Subsea Mission Terminal Log */}
          <div className="glass-panel p-4 flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Live Subsea Operations Terminal
                </h3>
                <span className="text-[9px] font-mono text-slate-400">ACOUSTIC MODEM 4.8 kbps</span>
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1">
                {activeLog.map((l, idx) => (
                  <div key={idx} className="text-[10px] font-mono leading-tight p-1.5 rounded bg-[#030814] border border-slate-800/80">
                    <span className="text-slate-500">[{l.time}]</span>{' '}
                    <span className={
                      l.type === 'action' ? 'text-cyan-300 font-bold' :
                      l.type === 'warn' ? 'text-rose-400' : 'text-slate-300'
                    }>
                      {l.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>DSV DEEP EXPLORER</span>
              <span className="text-cyan-400">SAT-LINK ONLINE</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
