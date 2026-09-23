import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Anchor,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  Cpu,
  DollarSign,
  Download,
  Droplets,
  GitBranch,
  Layers,
  LayoutDashboard,
  Pause,
  Play,
  Radio,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Volume2,
  VolumeX,
  Wrench
} from 'lucide-react';
import { SIMULATION_SCENARIOS, SEABED_DEPTH_M } from '../services/telemetryEngine';

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
  unacknowledgedAlertsCount = 0,
  userRole,
  onSelectRole,
  latestData
}) {
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [lastSyncUtc, setLastSyncUtc] = useState('14:32:07 UTC');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Update last sync time whenever new data arrives
  useEffect(() => {
    if (latestData?.timestamp) {
      const d = new Date(latestData.timestamp);
      setLastSyncUtc(d.toTimeString().slice(0, 8) + ' UTC');
      setSecondsAgo(0);
    }
  }, [latestData?.tick, latestData?.timestamp]);

  // Periodic delta counter every 1s
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Primary 6 high-level stages
  const primaryTabs = [
    {
      id: 'control-room',
      label: 'Overview (5 Zones)',
      badge: 'DELFI Standard',
      icon: LayoutDashboard
    },
    {
      id: 'condition-monitoring',
      label: 'Routes & Spatial',
      badge: `-${SEABED_DEPTH_M}m`,
      icon: Activity
    },
    {
      id: 'digital-twin',
      label: 'Digital Twin',
      badge: 'FEM Sync',
      icon: Layers
    },
    {
      id: 'alerting-escalation',
      label: 'Alerts',
      badge: unacknowledgedAlertsCount > 0 ? `${unacknowledgedAlertsCount} ACTIVE` : 'Nominal',
      icon: Bell,
      isCriticalAlert: unacknowledgedAlertsCount > 0
    },
    {
      id: 'rov-deployment',
      label: 'ROV & Robotics',
      badge: '4K HUD',
      icon: Camera
    },
    {
      id: 'inspection-cbi',
      label: 'Economics & ROI',
      badge: '-68% OPEX',
      icon: DollarSign
    }
  ];

  // Specialized Diagnostic Sub-Modules
  const specializedModules = [
    { id: 'fault-classification', label: 'Fault Classification & XAI', icon: Sparkles },
    { id: 'flow-assurance', label: 'Flow Assurance & Hydrate', icon: Droplets },
    { id: 'corrosion-erosion', label: 'Corrosion & Wall RUL', icon: ShieldAlert },
    { id: 'riser-fatigue', label: 'Touchdown Fatigue & VIV', icon: GitBranch },
    { id: 'leak-detection', label: 'Early Leak Detection', icon: Radio }
  ];

  const activeSpecialized = specializedModules.find(m => m.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      
      {/* Tier 1: Global Operations Header & Live Sync Strip */}
      <div className="border-b border-slate-800/70 px-3.5 lg:px-6 py-2">
        <div className="max-w-[1750px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Brand & Field Identifier */}
          <a href="/" title="Return to SubseaGuard AI Overview" className="flex items-center gap-3 group hover:opacity-90 transition-opacity text-inherit no-underline">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#111a2e] border border-cyan-400/30 text-cyan-400 shadow-inner group-hover:border-cyan-400/60 transition-colors">
              <Anchor className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-white tracking-wide">
                  Subsea<span className="text-cyan-400">Guard</span> AI
                </span>
                <span className="badge badge-cyan text-[9px] py-0.5 px-1.5 font-mono">
                  DELFI / Foundry Spec
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Block-4 Deepwater • Seabed: <strong className="text-slate-200 font-mono tabular-nums">-{SEABED_DEPTH_M} m</strong> • API 17D / DNV-RP-F116
              </p>
            </div>
          </a>

          {/* Center: Role Persona Switcher (WAI-ARIA Radio Group) */}
          <div role="radiogroup" aria-label="Operator role persona" className="flex items-center gap-1 bg-[#0a0e17] p-1 rounded-lg border border-slate-800 text-xs font-sans">
            <span className="text-[11px] text-slate-300 px-2 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-cyan-400" />
              Role:
            </span>
            
            <button
              type="button"
              role="radio"
              aria-checked={userRole === 'technician'}
              onClick={() => onSelectRole('technician')}
              aria-label="Switch to Technician role"
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'technician'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Wrench className="w-3 h-3" />
              Technician
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={userRole === 'engineer'}
              onClick={() => onSelectRole('engineer')}
              aria-label="Switch to Reliability Engineer role"
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'engineer'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Reliability engineer
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={userRole === 'subsea_engineer'}
              onClick={() => onSelectRole('subsea_engineer')}
              aria-label="Switch to Subsea Engineer role"
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 hidden md:flex ${
                userRole === 'subsea_engineer'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Anchor className="w-3 h-3" />
              Subsea engineer
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={userRole === 'manager'}
              onClick={() => onSelectRole('manager')}
              aria-label="Switch to Asset Manager role"
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                userRole === 'manager'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Asset manager
            </button>
          </div>

          {/* Right: Simulation Controls, Demo Pill & Last Updated Component */}
          <div className="flex items-center gap-2">
            
            {/* Last updated component (Sentence Case, DM Sans) */}
            <div className="hidden xl:flex flex-col text-right font-sans">
              <span className={`text-[11px] font-mono tabular-nums ${secondsAgo > 60 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                Last sync {lastSyncUtc}
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                Updated <span className="font-mono tabular-nums">{secondsAgo}s</span> ago
              </span>
            </div>

            {/* DEMO DATA Pill: Amber outline with pulsing dot */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/60 bg-amber-500/10 text-amber-300 text-[11px] font-mono tracking-wide"
              title="Synthetic physics telemetry active for simulation and verification"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold">DEMO DATA</span>
            </div>

            {/* Anomaly Scenario Selector */}
            <div className="flex items-center gap-1.5 bg-[#0a0e17] px-2.5 py-1 rounded-lg border border-slate-800">
              <AlertTriangle className={`w-3.5 h-3.5 ${currentScenario !== 'NORMAL' ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`} />
              <span className="text-[11px] text-slate-300 font-sans hidden sm:inline">Scenario:</span>
              <select
                aria-label="Select simulation anomaly scenario"
                value={currentScenario}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-xs font-sans text-cyan-300 focus:outline-none cursor-pointer pr-1"
              >
                {Object.entries(SIMULATION_SCENARIOS).map(([key, scn]) => (
                  <option key={key} value={key} className="bg-[#0a0e17] text-slate-200">
                    {scn.badge} • {scn.name.slice(0, 26)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Play / Pause Toggle */}
            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause telemetry simulation' : 'Resume telemetry simulation'}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono tabular-nums flex items-center gap-1 transition-all ${
                isPlaying
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isPlaying ? 'Live' : 'Paused'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute alarm audio' : 'Enable subsea alarm audio'}
              className={`p-1.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Architecture Modal */}
            <button
              onClick={onOpenArchitecture}
              aria-label="View system architecture modal"
              className="px-2.5 py-1 rounded-lg bg-[#111a2e] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-sans transition-all hidden lg:flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Architecture
            </button>

            {/* Export Audit Report */}
            <button
              onClick={onOpenReport}
              aria-label="Export ISO 14224 audit dossier"
              className="btn-primary text-xs py-1 px-2.5 hidden sm:flex"
            >
              <Download className="w-3.5 h-3.5" />
              Audit log
            </button>

          </div>

        </div>
      </div>

      {/* Tier 2: Sticky Stage Navigation Ribbon (WAI-ARIA Tablist Pattern) */}
      <div className="px-3.5 lg:px-6 py-1 bg-[#050912]">
        <div className="max-w-[1750px] mx-auto flex items-center justify-between gap-2">
          
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5" role="tablist" aria-label="Operational views">
            {primaryTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-slate-300 group-hover:text-cyan-400'
                  }`} />
                  
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                      isActive 
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30' 
                        : item.isCriticalAlert
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse font-bold'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Specialized Sub-Modules Dropdown (WAI-ARIA Listbox Pattern) */}
            <div className="relative">
              <button
                id="diagnostics-menu-trigger"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                aria-haspopup="listbox"
                aria-expanded={isMoreMenuOpen}
                aria-label="Toggle specialized diagnostic modules dropdown"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all ${
                  activeSpecialized
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{activeSpecialized ? activeSpecialized.label : 'Diagnostics'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreMenuOpen && (
                <div 
                  role="listbox" 
                  aria-labelledby="diagnostics-menu-trigger" 
                  className="absolute top-full left-0 mt-1 w-56 bg-[#0a0e17] border border-slate-800 rounded-lg shadow-2xl py-1 z-50"
                >
                  {specializedModules.map(mod => {
                    const ModIcon = mod.icon;
                    return (
                      <button
                        key={mod.id}
                        role="option"
                        aria-selected={activeTab === mod.id}
                        onClick={() => {
                          onSelectTab(mod.id);
                          setIsMoreMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-sans flex items-center gap-2 hover:bg-slate-800/60 transition-colors ${
                          activeTab === mod.id ? 'text-cyan-300 font-bold bg-cyan-500/10' : 'text-slate-200'
                        }`}
                      >
                        <ModIcon className="w-3.5 h-3.5 text-cyan-400" />
                        {mod.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </nav>

          {/* Quick Context Stat */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-sans text-slate-300 shrink-0">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              DAS fiber bus online (20 Hz)
            </span>
          </div>

        </div>
      </div>

    </header>
  );
}
