import React from 'react';
import {
  Activity,
  AlertTriangle,
  Compass,
  Download,
  Layers,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Anchor,
  Radio,
  Sliders,
  GitBranch,
  Droplets,
  ShieldAlert,
  DollarSign,
  Camera,
  Cpu,
  Gauge,
  Sparkles,
  Wrench,
  BarChart3,
  UserCheck,
  Bell,
  LayoutDashboard
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../services/telemetryEngine';

export default function Navbar({
  currentScenario,
  onSelectScenario,
  isPlaying,
  onTogglePlay,
  activeTab,
  onSelectTab,
  onOpenReport,
  onOpenArchitecture,
  soundEnabled,
  onToggleSound,
  unacknowledgedAlertsCount,
  userRole,
  onSelectRole
}) {
  const navItems = [
    {
      id: 'control-room',
      label: 'Control Room (5 Zones)',
      badge: 'DELFI Standard',
      icon: LayoutDashboard
    },
    {
      id: 'condition-monitoring',
      label: 'Flowline Spatial Profile',
      badge: 'Live P/T/Q',
      icon: Activity
    },
    {
      id: 'digital-twin',
      label: '3D Seabed Digital Twin',
      badge: 'FEM Sync',
      icon: Layers
    },
    {
      id: 'rov-deployment',
      label: 'ROV / AUV Operations',
      badge: '4K HUD',
      icon: Camera
    },
    {
      id: 'fault-classification',
      label: 'Fault Classification & XAI',
      badge: 'SHAP & UQ',
      icon: Sparkles
    },
    {
      id: 'flow-assurance',
      label: 'Flow Assurance & Hydrate',
      badge: 'Dynamic MEG',
      icon: Droplets
    },
    {
      id: 'corrosion-erosion',
      label: 'Corrosion & Wall RUL',
      badge: 'UT Prognostics',
      icon: ShieldAlert
    },
    {
      id: 'riser-fatigue',
      label: 'Touchdown Fatigue & VIV',
      badge: 'TDZ & Paris da/dN',
      icon: GitBranch
    },
    {
      id: 'leak-detection',
      label: 'Early Leak Detection',
      badge: currentScenario === 'MICRO_LEAK' ? 'CRIT ALERT' : 'NPW Acoustic',
      icon: Radio,
      isAlert: currentScenario === 'MICRO_LEAK'
    },
    {
      id: 'alerting-escalation',
      label: 'Alerts & Escalation',
      badge: unacknowledgedAlertsCount > 0 ? `${unacknowledgedAlertsCount} ACTIVE` : 'Twilio/SMTP',
      icon: Bell,
      isAlert: unacknowledgedAlertsCount > 0
    },
    {
      id: 'inspection-cbi',
      label: 'Cost & CBI Economics',
      badge: '-$3.8M Saved',
      icon: DollarSign
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      
      {/* Tier 1: Executive Operations & Status Bar */}
      <div className="border-b border-slate-800/80 px-4 lg:px-6 py-2">
        <div className="max-w-[1750px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Field Coordinates */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#111a2e] border border-cyan-400/40 text-cyan-400">
              <Anchor className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-white tracking-wider">
                  SUBSEA<span className="text-cyan-400">GUARD</span> AI
                </span>
                <span className="badge badge-cyan text-[9px] py-0.5 px-1.5">
                  DELFI / FOUNDRY SPEC
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <Radio className="w-2.5 h-2.5 text-cyan-400" />
                BLOCK-4 • DEPTH: -1,850m • API 17D / DNV-RP-F116 / ISO 14224
              </p>
            </div>
          </div>

          {/* Center: 4-Tier Role Persona Selector with Subsea / Offshore Engineer */}
          <div className="flex items-center gap-1 bg-[#0a0e17] p-1 rounded border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-2 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-cyan-400" />
              ROLE:
            </span>
            
            <button
              onClick={() => onSelectRole('technician')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'technician'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3 h-3" />
              Technician
            </button>

            <button
              onClick={() => onSelectRole('subsea_engineer')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'subsea_engineer'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 font-bold shadow-[0_0_10px_rgba(59,130,246,0.25)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Anchor className="w-3 h-3" />
              Subsea / Offshore Engineer
            </button>

            <button
              onClick={() => onSelectRole('engineer')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'engineer'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Reliability Engineer
            </button>

            <button
              onClick={() => onSelectRole('manager')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'manager'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Asset Manager
            </button>
          </div>

          {/* Right: Simulation Scenarios & Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Anomaly Scenario Selector */}
            <div className="flex items-center gap-1.5 bg-[#0a0e17] px-2.5 py-1 rounded border border-slate-800">
              <AlertTriangle className={`w-3.5 h-3.5 ${currentScenario !== 'NORMAL' ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
              <span className="text-[10px] font-mono text-slate-400 hidden xl:inline">ANOMALY:</span>
              <select
                value={currentScenario}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer pr-1"
              >
                {Object.entries(SIMULATION_SCENARIOS).map(([key, scn]) => (
                  <option key={key} value={key} className="bg-[#0a0e17] text-slate-200">
                    {scn.badge} • {scn.name.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Play / Pause Toggle */}
            <button
              onClick={onTogglePlay}
              className={`px-2 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-all ${
                isPlaying
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'LIVE' : 'PAUSE'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-1 rounded border transition-all ${
                soundEnabled
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? 'Disable Audio' : 'Enable Subsea Alarm Beeps'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Architecture Modal */}
            <button
              onClick={onOpenArchitecture}
              className="px-2.5 py-1 rounded bg-[#111a2e] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Architecture</span>
            </button>

            {/* Export Audit Report */}
            <button
              onClick={onOpenReport}
              className="btn-primary flex items-center gap-1.5 text-xs py-1 px-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ISO 14224 Audit</span>
            </button>

          </div>

        </div>
      </div>

      {/* Tier 2: Subsea Integrity Navigation Ribbon */}
      <div className="px-4 lg:px-6 py-1.5 bg-[#050912]">
        <div className="max-w-[1750px] mx-auto">
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center gap-2 px-3 py-1 rounded text-xs font-mono whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                  }`} />
                  
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${
                      isActive 
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30' 
                        : item.isAlert
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
}
