import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import KPIHeader from './components/KPIHeader';
import IndustrialControlRoomDashboard from './components/IndustrialControlRoomDashboard';
import FlowlineRiserIntegrityHub from './components/FlowlineRiserIntegrityHub';
import DigitalTwinHub from './components/DigitalTwinHub';
import ROVDeploymentHub from './components/ROVDeploymentHub';
import FaultClassificationPanel from './components/FaultClassificationPanel';
import FlowAssuranceOptimizer from './components/FlowAssuranceOptimizer';
import CorrosionErosionPrognostics from './components/CorrosionErosionPrognostics';
import RiserFatigueStructuralHealth from './components/RiserFatigueStructuralHealth';
import EarlyLeakDetectionHub from './components/EarlyLeakDetectionHub';
import AlertingAndEscalationHub from './components/AlertingAndEscalationHub';
import ConditionBasedInspectionROI from './components/ConditionBasedInspectionROI';
import RoleViewsContainer from './components/RoleViewsContainer';
import AssetDetailModal from './components/AssetDetailModal';
import ReportGeneratorModal from './components/ReportGeneratorModal';
import ArchitectureModal from './components/ArchitectureModal';
import { telemetryEngine, SIMULATION_SCENARIOS, ASSET_DEFINITIONS } from './services/telemetryEngine';

export default function App() {
  const [latestData, setLatestData] = useState(() => telemetryEngine.getLatestData());
  const [selectedAssetId, setSelectedAssetId] = useState('PFL-101');
  const [activeTab, setActiveTab] = useState('control-room'); // Default to 5-Zone Industrial Dashboard
  const [userRole, setUserRole] = useState('engineer'); // 'technician' | 'engineer' | 'manager'
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScenario, setCurrentScenario] = useState('NORMAL');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioCtxRef = useRef(null);

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
    } catch (e) {
      // Ignore audio errors
    }
  };

  let unacknowledgedCount = 0;
  if (latestData?.assets) {
    Object.values(latestData.assets).forEach(a => {
      if (a.status === 'CRITICAL' || a.status === 'WARNING') {
        unacknowledgedCount++;
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Top Operations Navbar with Segmented Control & Role Switcher */}
      <Navbar
        currentScenario={currentScenario}
        onSelectScenario={handleScenarioChange}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        unacknowledgedAlertsCount={unacknowledgedCount}
        userRole={userRole}
        onSelectRole={setUserRole}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-3.5 lg:p-5">
        
        {/* KPI Executive Summary Header */}
        <KPIHeader
          latestData={latestData}
          onSelectAsset={handleSelectAsset}
        />

        {/* Tailored Persona View when Technician or Manager is active */}
        {userRole !== 'engineer' && (
          <div className="mb-4">
            <RoleViewsContainer
              userRole={userRole}
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setUserRole('engineer');
              }}
            />
          </div>
        )}

        {/* Primary Tab: 5-Zone Industrial Control Room Dashboard (DELFI / Foundry Standard) */}
        {activeTab === 'control-room' && (
          <div className="animate-fade-in">
            <IndustrialControlRoomDashboard
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
              onSelectScenario={handleScenarioChange}
              userRole={userRole}
              onNavigateTab={setActiveTab}
            />
          </div>
        )}

        {/* Tab 1: Continuous Condition Monitoring & Flowline/Riser Spatial Profile */}
        {activeTab === 'condition-monitoring' && (
          <div className="animate-fade-in">
            <FlowlineRiserIntegrityHub
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
              onSelectScenario={handleScenarioChange}
            />
          </div>
        )}

        {/* Tab 2: 3D Seabed Digital Twin & Physics FEM Mesh */}
        {activeTab === 'digital-twin' && (
          <div className="animate-fade-in">
            <DigitalTwinHub
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 3: ROV & AUV Underwater Monitoring & 4K HUD Operations */}
        {activeTab === 'rov-deployment' && (
          <div className="animate-fade-in">
            <ROVDeploymentHub
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 4: Fault Classification, Severity Triage & Zone RUL */}
        {activeTab === 'fault-classification' && (
          <div className="animate-fade-in">
            <FaultClassificationPanel
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 5: Flow Assurance & Wax/Hydrate Dynamic Optimizer */}
        {activeTab === 'flow-assurance' && (
          <div className="animate-fade-in">
            <FlowAssuranceOptimizer
              latestData={latestData}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 6: Corrosion/Erosion Rate & Wall-Thickness RUL Prognostics */}
        {activeTab === 'corrosion-erosion' && (
          <div className="animate-fade-in">
            <CorrosionErosionPrognostics
              latestData={latestData}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 7: Riser Touchdown Zone (TDZ) Fatigue & Structural Health */}
        {activeTab === 'riser-fatigue' && (
          <div className="animate-fade-in">
            <RiserFatigueStructuralHealth
              latestData={latestData}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 8: Early Subsea Leak Detection & Acoustic NPW Localization */}
        {activeTab === 'leak-detection' && (
          <div className="animate-fade-in">
            <EarlyLeakDetectionHub
              latestData={latestData}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 9: Alerting, Escalation & Closed-Loop Maintenance Logging */}
        {activeTab === 'alerting-escalation' && (
          <div className="animate-fade-in">
            <AlertingAndEscalationHub
              latestData={latestData}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

        {/* Tab 10: Condition-Based Inspection (CBI) & ROV Cost Reduction */}
        {activeTab === 'inspection-cbi' && (
          <div className="animate-fade-in">
            <ConditionBasedInspectionROI
              latestData={latestData}
              onSelectAsset={handleSelectAsset}
            />
          </div>
        )}

      </main>

      {/* Footer System Status Bar with Model Version & Audit SHA-256 */}
      <footer className="bg-[#070b14] border-t border-slate-800/80 py-2 px-6 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DAS FIBER BUS: ONLINE (20 Hz)
          </span>
          <span className="text-slate-700">|</span>
          <span>IEEE 1588 PTP JITTER: <strong className="text-cyan-300">±8ns</strong></span>
          <span className="text-slate-700">|</span>
          <span>MODEL VER: <strong className="text-cyan-300">v4.2.8-prod</strong></span>
          <span className="text-slate-700">|</span>
          <span>AUDIT SHA-256: <strong className="text-slate-300">8f4b2a901c3e</strong></span>
          <span className="text-slate-700">|</span>
          <span>ROLE: <strong className="text-amber-300 uppercase">{userRole}</strong></span>
        </div>

        <div className="text-slate-500">
          SubseaGuard AI • Deepwater Subsea Predictive Maintenance • API 17D / DNV-RP-F116 / ISO 14224
        </div>
      </footer>

      {/* Architecture Flow Modal */}
      {isArchitectureOpen && (
        <ArchitectureModal
          onClose={() => setIsArchitectureOpen(false)}
        />
      )}

      {/* Asset Drill-Down Inspection Modal */}
      {isDetailModalOpen && (
        <AssetDetailModal
          assetId={selectedAssetId}
          latestData={latestData}
          onClose={() => setIsDetailModalOpen(false)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Audit Report Generator Modal */}
      {isReportOpen && (
        <ReportGeneratorModal
          latestData={latestData}
          onClose={() => setIsReportOpen(false)}
        />
      )}

    </div>
  );
}
