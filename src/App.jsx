import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import KPIHeader from './components/KPIHeader';
import RoleViewsContainer from './components/RoleViewsContainer';
import NotFound from './components/NotFound';
import { telemetryEngine, SIMULATION_SCENARIOS, ASSET_DEFINITIONS, SEABED_DEPTH_M } from './services/telemetryEngine';

const VALID_ROUTES = {
  '': 'control-room',
  '/': 'control-room',
  '/control-room': 'control-room',
  '/condition-monitoring': 'condition-monitoring',
  '/digital-twin': 'digital-twin',
  '/rov-deployment': 'rov-deployment',
  '/alerting-escalation': 'alerting-escalation',
  '/inspection-cbi': 'inspection-cbi',
  '/fault-classification': 'fault-classification',
  '/flow-assurance': 'flow-assurance',
  '/corrosion-erosion': 'corrosion-erosion',
  '/riser-fatigue': 'riser-fatigue',
  '/leak-detection': 'leak-detection',
};

function getRouteStateFromPath(pathname) {
  let clean = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  let appRelative = clean;
  if (clean === '/app') {
    appRelative = '/';
  } else if (clean.startsWith('/app/')) {
    appRelative = clean.slice(4); // /app/digital-twin -> /digital-twin
  }

  if (appRelative in VALID_ROUTES) {
    return { tab: VALID_ROUTES[appRelative], isNotFound: false, path: clean };
  }
  return { tab: 'control-room', isNotFound: true, path: clean };
}

// Code-splitting via React.lazy for performance (reduces first paint initial bundle)
const IndustrialControlRoomDashboard = lazy(() => import('./components/IndustrialControlRoomDashboard'));
const FlowlineRiserIntegrityHub = lazy(() => import('./components/FlowlineRiserIntegrityHub'));
const DigitalTwinHub = lazy(() => import('./components/DigitalTwinHub'));
const ROVDeploymentHub = lazy(() => import('./components/ROVDeploymentHub'));
const FaultClassificationPanel = lazy(() => import('./components/FaultClassificationPanel'));
const FlowAssuranceOptimizer = lazy(() => import('./components/FlowAssuranceOptimizer'));
const CorrosionErosionPrognostics = lazy(() => import('./components/CorrosionErosionPrognostics'));
const RiserFatigueStructuralHealth = lazy(() => import('./components/RiserFatigueStructuralHealth'));
const EarlyLeakDetectionHub = lazy(() => import('./components/EarlyLeakDetectionHub'));
const AlertingAndEscalationHub = lazy(() => import('./components/AlertingAndEscalationHub'));
const ConditionBasedInspectionROI = lazy(() => import('./components/ConditionBasedInspectionROI'));
const AssetDetailModal = lazy(() => import('./components/AssetDetailModal'));
const ReportGeneratorModal = lazy(() => import('./components/ReportGeneratorModal'));
const ArchitectureModal = lazy(() => import('./components/ArchitectureModal'));

function HubLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-16 min-h-[380px] space-y-3 font-sans">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
      <span className="text-xs text-slate-400 font-mono tracking-wide">
        Synchronizing subsea telemetry stream...
      </span>
    </div>
  );
}

export default function App() {
  const initialRoute = typeof window !== 'undefined'
    ? getRouteStateFromPath(window.location.pathname)
    : { tab: 'control-room', isNotFound: false, path: '/' };

  const [latestData, setLatestData] = useState(() => telemetryEngine.getLatestData());
  const [selectedAssetId, setSelectedAssetId] = useState('PFL-101');
  const [activeTab, setActiveTab] = useState(initialRoute.tab);
  const [isNotFound, setIsNotFound] = useState(initialRoute.isNotFound);
  const [currentPath, setCurrentPath] = useState(initialRoute.path);
  const [userRole, setUserRole] = useState('engineer'); // 'technician' | 'engineer' | 'subsea_engineer' | 'manager'
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScenario, setCurrentScenario] = useState('NORMAL');
  const [selectedKP, setSelectedKP] = useState(null); // Cross-filter state for bathymetric KP post
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioCtxRef = useRef(null);

  const playAlarmBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Ignore audio errors
    }
  };

  useEffect(() => {
    const unsubscribe = telemetryEngine.subscribe((data) => {
      setLatestData(data);
      if (soundEnabled && data.scenario !== 'NORMAL') {
        playAlarmBeep();
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  // Simulation tick timer (1.5 seconds per tick)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      telemetryEngine.step();
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleScenarioChange = (scenarioKey) => {
    setCurrentScenario(scenarioKey);
    telemetryEngine.setScenario(scenarioKey);
    const affected = SIMULATION_SCENARIOS[scenarioKey]?.affectedAsset;
    if (affected) {
      setSelectedAssetId(affected);
    }
  };

  const handleSelectAsset = (assetId, openModal = false) => {
    setSelectedAssetId(assetId);
    if (openModal) {
      setIsDetailModalOpen(true);
    }
  };

  // Popstate history listener for client-side routing
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteStateFromPath(window.location.pathname);
      setActiveTab(route.tab);
      setIsNotFound(route.isNotFound);
      setCurrentPath(route.path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsNotFound(false);
    const isAppPrefix = typeof window !== 'undefined' && (window.location.pathname.startsWith('/app') || window.location.pathname === '/app');
    const base = isAppPrefix ? '/app' : '';
    const targetUrl = tabId === 'control-room'
      ? (isAppPrefix ? '/app' : '/')
      : `${base}/${tabId}`;

    if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    setCurrentPath(targetUrl);
  };

  let unacknowledgedCount = 0;
  if (latestData?.activeAlerts) {
    unacknowledgedCount = latestData.activeAlerts.filter(a => !a.acknowledged && (a.severity === 'CRITICAL' || a.severity === 'WARNING')).length;
  }

  const isSimulationActive = currentScenario !== 'NORMAL';

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Operations Sticky Navbar */}
      <Navbar
        currentScenario={currentScenario}
        onSelectScenario={handleScenarioChange}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        activeTab={isNotFound ? '' : activeTab}
        onSelectTab={handleSelectTab}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        unacknowledgedAlertsCount={unacknowledgedCount}
        userRole={userRole}
        onSelectRole={setUserRole}
        latestData={latestData}
      />

      {/* Simulation Mode Active Banner */}
      {isSimulationActive && (
        <div className="demo-hatched-banner px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <div>
              <span className="font-bold text-amber-300">Simulation mode active:</span>{' '}
              Injected scenario <span className="font-mono font-bold text-white bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/40">
                {SIMULATION_SCENARIOS[currentScenario]?.name || currentScenario}
              </span>{' '}
              — Synthetic telemetry generated for validation. Live field instrumentation remains untouched.
            </div>
          </div>
          <button
            onClick={() => handleScenarioChange('NORMAL')}
            className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 text-xs font-bold font-sans transition-all flex items-center gap-1.5"
          >
            Return to live nominal
          </button>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-3.5 lg:p-5 space-y-4">
        
        {isNotFound ? (
          <NotFound
            currentPath={currentPath}
            onNavigateHome={() => handleSelectTab('control-room')}
            onSelectTab={handleSelectTab}
          />
        ) : (
          <>
            {/* KPI Executive Summary Header (Sentence-case + Tabular Numerals) */}
            <KPIHeader
              latestData={latestData}
              onSelectAsset={handleSelectAsset}
            />

            {/* Tailored Persona View for Technician or Manager */}
            {userRole !== 'engineer' && (
              <div className="mb-4">
                <RoleViewsContainer
                  userRole={userRole}
                  latestData={latestData}
                  selectedAssetId={selectedAssetId}
                  onSelectAsset={handleSelectAsset}
                  onNavigateTab={(tab) => {
                    handleSelectTab(tab);
                    setUserRole('engineer');
                  }}
                />
              </div>
            )}

            {/* Suspense Container for Code-Split Modules */}
            <Suspense fallback={<HubLoadingFallback />}>
              <section
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                tabIndex={0}
                className="focus:outline-none"
              >
              
              {/* Stage 1: Control Room Dashboard (5 Zones) */}
              {activeTab === 'control-room' && (
                <div className="animate-fade-in">
                  <IndustrialControlRoomDashboard
                    latestData={latestData}
                    selectedAssetId={selectedAssetId}
                    onSelectAsset={handleSelectAsset}
                    onSelectScenario={handleScenarioChange}
                    userRole={userRole}
                    onNavigateTab={handleSelectTab}
                    selectedKP={selectedKP}
                    onSelectKP={setSelectedKP}
                  />
                </div>
              )}

          {/* Stage 2: Routes & Spatial Profile */}
          {activeTab === 'condition-monitoring' && (
            <div className="animate-fade-in">
              <FlowlineRiserIntegrityHub
                latestData={latestData}
                selectedAssetId={selectedAssetId}
                onSelectAsset={handleSelectAsset}
                onSelectScenario={handleScenarioChange}
                selectedKP={selectedKP}
                onSelectKP={setSelectedKP}
              />
            </div>
          )}

          {/* Stage 3: 3D Seabed Digital Twin */}
          {activeTab === 'digital-twin' && (
            <div className="animate-fade-in">
              <DigitalTwinHub
                latestData={latestData}
                selectedAssetId={selectedAssetId}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {/* Stage 4: ROV / AUV Operations */}
          {activeTab === 'rov-deployment' && (
            <div className="animate-fade-in">
              <ROVDeploymentHub
                latestData={latestData}
                selectedAssetId={selectedAssetId}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {/* Stage 5: Alerts & Escalation */}
          {activeTab === 'alerting-escalation' && (
            <div className="animate-fade-in">
              <AlertingAndEscalationHub
                latestData={latestData}
                onSelectAsset={handleSelectAsset}
                onNavigateTab={handleSelectTab}
              />
            </div>
          )}

          {/* Stage 6: Economics & Condition-Based Inspection ROI */}
          {activeTab === 'inspection-cbi' && (
            <div className="animate-fade-in">
              <ConditionBasedInspectionROI
                latestData={latestData}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {/* Specialized Diagnostics */}
          {activeTab === 'fault-classification' && (
            <div className="animate-fade-in">
              <FaultClassificationPanel
                latestData={latestData}
                selectedAssetId={selectedAssetId}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {activeTab === 'flow-assurance' && (
            <div className="animate-fade-in">
              <FlowAssuranceOptimizer
                latestData={latestData}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {activeTab === 'corrosion-erosion' && (
            <div className="animate-fade-in">
              <CorrosionErosionPrognostics
                latestData={latestData}
                selectedAssetId={selectedAssetId}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {activeTab === 'riser-fatigue' && (
            <div className="animate-fade-in">
              <RiserFatigueStructuralHealth
                latestData={latestData}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

          {activeTab === 'leak-detection' && (
            <div className="animate-fade-in">
              <EarlyLeakDetectionHub
                latestData={latestData}
                onSelectAsset={handleSelectAsset}
              />
            </div>
          )}

              </section>
            </Suspense>
          </>
        )}

      </main>

      {/* Footer System Status Bar (Sentence Case) */}
      <footer className="bg-[#050912] border-t border-slate-800/80 py-2.5 px-6 text-xs font-sans text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-2.5">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DAS fiber acoustic bus: Online (20 Hz)
          </span>
          <span className="text-slate-700">|</span>
          <span>Seabed baseline: <strong className="text-slate-200 font-mono tabular-nums">-{SEABED_DEPTH_M} m</strong></span>
          <span className="text-slate-700">|</span>
          <span>PTP clock sync jitter: <strong className="text-cyan-300 font-mono tabular-nums">±8ns</strong></span>
          <span className="text-slate-700">|</span>
          <span>Model version: <strong className="text-cyan-300 font-mono">v4.2.8-prod</strong></span>
          <span className="text-slate-700">|</span>
          <span>Role active: <strong className="text-amber-300 capitalize">{userRole.replace('_', ' ')}</strong></span>
        </div>

        <div className="text-slate-300 text-[11px] font-sans">
          SubseaGuard AI • Deepwater Subsea Predictive Maintenance • API 17D / DNV-RP-F116 / ISO 14224
        </div>
      </footer>

      {/* Modals with Suspense */}
      <Suspense fallback={null}>
        {isArchitectureOpen && (
          <ArchitectureModal onClose={() => setIsArchitectureOpen(false)} />
        )}

        {isDetailModalOpen && (
          <AssetDetailModal
            assetId={selectedAssetId}
            latestData={latestData}
            onClose={() => setIsDetailModalOpen(false)}
            onNavigateTab={(tab) => handleSelectTab(tab)}
          />
        )}

        {isReportOpen && (
          <ReportGeneratorModal
            latestData={latestData}
            onClose={() => setIsReportOpen(false)}
          />
        )}
      </Suspense>

    </div>
  );
}
