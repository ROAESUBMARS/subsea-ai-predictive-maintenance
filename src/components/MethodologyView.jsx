import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  BookOpen,
  Cpu,
  Layers,
  Activity,
  Radio,
  Sparkles,
  ShieldCheck,
  Droplets,
  GitBranch,
  Gauge,
  Clock,
  Lock,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  FileText,
  Table,
  Terminal
} from 'lucide-react';
import {
  getHydrateEnvelopeSampleData,
  getRulFanChartSampleData,
  getParisCrackSampleData
} from '../services/telemetryEngine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MethodologyView({ onNavigateTab }) {
  const [activeTab, setActiveTab] = useState('physics-fracture');
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Sample data generators
  const hydrateData = getHydrateEnvelopeSampleData();
  const rulFanData = getRulFanChartSampleData();
  const parisData = getParisCrackSampleData();

  // 1. Chart: Dynamic PVT Hydrate Phase Envelope
  const hydrateChartConfig = {
    labels: hydrateData.labels,
    datasets: [
      {
        label: 'Pure Methane Clathrate Baseline',
        data: hydrateData.pureWaterBaseline,
        borderColor: '#94a3b8',
        borderDash: [4, 4],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 2
      },
      {
        label: 'Field Composition PVT (WC 14.2%, GOR 1680)',
        data: hydrateData.nominalPVT,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 2.5,
        fill: '+1', // Fill down to MEG curve
        tension: 0.25,
        pointRadius: 3
      },
      {
        label: 'Sour High-WC Shifted Boundary (WC 28.5%)',
        data: hydrateData.highWaterCutPVT,
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderDash: [6, 2],
        fill: false,
        pointRadius: 2
      },
      {
        label: '30 wt% MEG Inhibitor Suppressed Curve',
        data: hydrateData.megSuppressedCurve,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 2,
        fill: true,
        pointRadius: 2
      }
    ]
  };

  // 2. Chart: Bayesian RUL Fan Chart with P10/P50/P90
  const rulFanChartConfig = {
    labels: rulFanData.labels,
    datasets: [
      {
        label: 'P90 Optimistic Bound (10% Risk)',
        data: rulFanData.p90Degradation,
        borderColor: 'rgba(56, 189, 248, 0.5)',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 1.5,
        fill: '+1',
        pointRadius: 2
      },
      {
        label: 'P50 Median Lifetime Trajectory',
        data: rulFanData.p50Degradation,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderWidth: 3,
        fill: '+1',
        pointRadius: 3
      },
      {
        label: 'P10 Conservative Bound (Safety Dispatch Limit)',
        data: rulFanData.p10Degradation,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.15)',
        borderWidth: 2,
        fill: false,
        pointRadius: 3
      },
      {
        label: 'Post-ROV Calibrated P50 (Ground Truth Retrained)',
        data: rulFanData.calibratedP50,
        borderColor: '#34d399',
        borderWidth: 2.5,
        borderDash: [4, 4],
        fill: false,
        pointRadius: 3
      },
      {
        label: 'Critical Intervention Threshold (60 Days)',
        data: rulFanData.timelineDays.map(() => 60),
        borderColor: '#ef4444',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // 3. Chart: Paris-Erdogan Flaw Propagation
  const parisChartConfig = {
    labels: parisData.labels,
    datasets: [
      {
        label: 'Nominal Wave Cyclic Growth (Δσ = 42 MPa)',
        data: parisData.crackNominal,
        borderColor: '#38bdf8',
        borderWidth: 2,
        fill: false,
        pointRadius: 2
      },
      {
        label: 'VIV 0.38 Hz Modal Lock-in Acceleration (Δσ = 160 MPa)',
        data: parisData.crackVIVLockIn,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.15)',
        borderWidth: 3,
        fill: true,
        pointRadius: 3
      },
      {
        label: `Critical Flaw Depth a_crit (${parisData.criticalLimitAcrit} mm)`,
        data: parisData.cyclesMillion.map(() => parisData.criticalLimitAcrit),
        borderColor: '#ef4444',
        borderDash: [6, 4],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      },
      {
        label: `Autonomous CBI Inspection Trigger (${parisData.inspectionThreshold} mm)`,
        data: parisData.cyclesMillion.map(() => parisData.inspectionThreshold),
        borderColor: '#f59e0b',
        borderDash: [3, 3],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const mermaidPipelineCode = `flowchart TD
    subgraph Subsea_Sensors["1. Subsea High-Frequency Ingestion (-1,850m)"]
        A1["Fiber DAS Distributed Acoustics<br/>(25 kHz Raw Optical Pulse)"]
        A2["Quartz Resonant Pressure / Temp<br/>(100 Hz Continuous Gradient)"]
        A3["SCR Touchdown Triaxial Accelerometers<br/>(200 Hz VIV Bending Sensor)"]
        A4["Acoustic Sand Erosion Probe<br/>(Impact Energy Count)"]
    end

    subgraph Edge_Canister["2. Subsea Edge Compression (128:1 Reduction)"]
        B1["IEEE 1588 PTP Clock Sync<br/>(&plusmn;8ns Time-of-Flight Offset)"]
        B2["Discrete Wavelet Transform (DWT)<br/>& FFT Spectral Extraction"]
        B3["Sensor Trust Quality Gate<br/>(Outlier & Drift Rejection)"]
    end

    subgraph Umbilical["3. Telemetry Bus"]
        C1["20 Hz Serial Bandwidth Stream<br/>(Over Subsea Umbilical Copper/Fiber)"]
    end

    subgraph Hybrid_Inference["4. Physics-Informed Prognostic Engine"]
        D1["Dynamic PVT Clathrate Hydrate Boundary<br/>T_hyd = f(P, WaterCut, GOR)"]
        D2["Paris-Erdogan da/dN Flaw Growth<br/>& Rainflow Cyclic Counting"]
        D3["NPW Acoustic Time-of-Flight Leak Triangulation<br/>X_leak = (L + a*Δt)/2"]
        D4["Bayesian Uncertainty Quantification (UQ)<br/>Weibull Prior &rarr; P10/P50/P90 Posteriors"]
        D5["SHAP Explainability Layer<br/>(Feature Attributions &Psi;_i)"]
    end

    subgraph Decision_Control["5. Actionable Closed-Loop Execution"]
        E1["Bounded RL Chemical Dosing Surge<br/>Clamped at [20, 200] L/h, &plusmn;15 L/h/min"]
        E2{"Human-in-the-Loop (HITL) Gate<br/>$115k/day ROV Spread Authorization"}
        E3["Emergency Subsea Isolation Valve<br/>(ESD-1 Trip on Severe Breach)"]
    end

    subgraph Feedback_Loop["6. Inspection Ground Truth Calibration"]
        F1["ROV Phased-Array UT Scans & CP Potentials"]
        F2["Bayesian Prior Recalibration<br/>(P(θ|D_ROV) &prop; P(D_ROV|θ)*P(θ))"]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2 --> B3 --> C1
    C1 --> D1 & D2 & D3 --> D4 --> D5
    D5 --> E1
    D5 --> E2
    D5 --> E3
    E2 -- "Engineer Digital Sign-off" --> F1
    F1 --> F2 --> D4`;

  const copyMermaidCode = () => {
    navigator.clipboard.writeText(mermaidPipelineCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2500);
  };

  const handleDownloadWhitepaper = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/METHODOLOGY.md');
    element.setAttribute('download', 'SubseaGuard_AI_Engineering_Methodology_Whitepaper.md');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sections = [
    { id: 'physics-fracture', label: '1. Fracture & VIV Lock-in', icon: GitBranch },
    { id: 'physics-hydrate', label: '2. Dynamic PVT Hydrate', icon: Droplets },
    { id: 'physics-uq', label: '3. Bayesian UQ (P10/P50/P90)', icon: Activity },
    { id: 'physics-leak', label: '4. NPW Acoustic Localization', icon: Radio },
    { id: 'architecture-pipeline', label: '5. Edge-to-Action Pipeline', icon: Cpu },
    { id: 'iso-taxonomy', label: '6. ISO 14224 Taxonomy', icon: Table }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-[1600px] mx-auto">
      
      {/* Paper Hero Header */}
      <div className="glass-panel p-6 border border-cyan-500/30 bg-[#060c1d] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-cyan text-[10px] font-mono py-0.5 px-2">
                TECHNICAL ENGINEERING WHITEPAPER
              </span>
              <span className="text-xs text-slate-400 font-mono">DNV-RP-F116 • API 17D • BS 7910 • ISO 14224</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-heading font-extrabold text-white tracking-tight">
              SubseaGuard AI: Engineering Methodology & Physics Foundations
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-4xl leading-relaxed">
              A comprehensive technical specification of first-principles structural mechanics, dynamic compositional PVT flow assurance, Bayesian uncertainty quantification (P10/P50/P90), subsea edge wavelet compression (128:1), and human-in-the-loop operational gating.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadWhitepaper}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Whitepaper (.md)</span>
            </button>
          </div>
        </div>

        {/* Engineering Abstract Box */}
        <div className="mt-5 p-4 rounded-xl bg-[#030612] border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
          <strong className="text-cyan-300 font-mono">EXECUTIVE ABSTRACT: </strong>
          Deepwater subsea operations at water depths of -1,850 m present extreme challenges where blind calendar maintenance incurs unsustainable vessel OPEX ($115,000/day ROV spreads) and catastrophic environmental risk. SubseaGuard AI replaces heuristic dashboards with an integrated physics-informed edge pipeline: high-frequency distributed acoustic sensing (DAS) compressed 128:1 via discrete wavelet transforms (DWT), vortex-induced vibration (VIV) resonant lock-in mapping into Paris-Erdogan crack propagation ($da/dN = C(\Delta K)^m$), dynamic compositional hydrate envelopes with Water Cut shifting, and Bayesian uncertainty quantification bounding Remaining Useful Life (RUL) into actionable P10, P50, and P90 quantiles.
        </div>
      </div>

      {/* Segmented Section Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-[#050b18] p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: FRACTURE MECHANICS & VIV LOCK-IN */}
      {activeTab === 'physics-fracture' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Theoretical Derivation */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel p-5 border border-purple-500/30 bg-[#070b1a]">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  1.1 Paris-Erdogan Fatigue Crack Growth & Stress Mapping
                </h3>
                
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Dynamic steel catenary risers (SCRs) at seabed touchdown zones (TDZs) experience intense cyclic bending fatigue driven by sea-surface vessel heave and benthic current shedding. Flaw extension follows linear elastic fracture mechanics (LEFM) governed by the Paris-Erdogan power law:
                </p>

                <div className="p-3.5 my-3 rounded-lg bg-[#030612] border border-purple-500/30 text-center font-mono text-purple-200 text-sm tracking-wider">
                  {"\\frac{da}{dN} = C \\cdot (\\Delta K)^m = C \\cdot \\left( Y \\cdot \\Delta \\sigma \\cdot \\sqrt{\\pi a} \\right)^m"}
                </div>

                <div className="text-xs text-slate-300 font-sans space-y-2 leading-relaxed">
                  <p>
                    Where <strong className="text-white">a</strong> is crack depth (mm), <strong className="text-white">N</strong> is elapsed cycles, <strong className="text-white">Δσ</strong> is dynamic cyclic bending stress range (MPa), <strong className="text-white">Y = 1.12</strong> is the boundary correction factor for semi-elliptical external surface flaws, and <strong className="text-white">ΔK</strong> is the stress intensity factor range.
                  </p>
                  <p>
                    Cumulative damage accumulation before macroscopic crack initiation is modeled with the ASTM E1049-85 Rainflow cycle counting algorithm combined with Palmgren-Miner linear summation against DNV-RP-C203 Curve F3:
                  </p>
                </div>

                <div className="p-3 my-2 rounded-lg bg-[#030612] border border-slate-800 text-center font-mono text-cyan-300 text-xs">
                  {"D = \\sum_{i=1}^{k} \\frac{n_i}{N_i} \\le \\frac{1}{\\text{DFF}}, \\quad \\text{where } \\text{DFF} = 10.0 \\text{ for Non-Retrievable Subsea SCR Touchdown Arc}"}
                </div>
              </div>

              {/* Material Constants Reference Table */}
              <div className="glass-panel p-4 border border-slate-800 bg-[#050b18]">
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase mb-2 flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  BS 7910 / DNV-RP-F108 Welded Marine Steel Constants (Cathodically Protected in Seawater)
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#030612] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2">Parameter</th>
                        <th className="p-2">Symbol</th>
                        <th className="p-2">Numerical Value</th>
                        <th className="p-2">Engineering Standard / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="p-2 font-bold text-white">Paris Material Constant</td>
                        <td className="p-2 text-cyan-300">C</td>
                        <td className="p-2 font-bold text-purple-300">5.21 × 10⁻¹³ mm/cycle·(MPa√m)⁻ᵐ</td>
                        <td className="p-2">BS 7910 Mean + 2SD Welded Marine Steel</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-white">Paris Exponent</td>
                        <td className="p-2 text-cyan-300">m</td>
                        <td className="p-2 font-bold text-purple-300">3.00 (Stage II Paris Regime)</td>
                        <td className="p-2">Linear elastic crack growth exponent</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-white">Threshold Stress Intensity</td>
                        <td className="p-2 text-cyan-300">ΔK_th</td>
                        <td className="p-2">2.00 MPa√m</td>
                        <td className="p-2">Below this threshold, flaw growth rate is negligible</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-white">Critical Flaw Depth</td>
                        <td className="p-2 text-rose-300">a_crit</td>
                        <td className="p-2 font-bold text-rose-400">8.50 mm</td>
                        <td className="p-2">Brittle fracture / plastic collapse limit (API 579)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-white">Nominal Initial Surface Flaw</td>
                        <td className="p-2 text-slate-300">a_0</td>
                        <td className="p-2">0.45 mm</td>
                        <td className="p-2">Post-fabrication NDT inspection resolution limit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* VIV 0.38 Hz Modal Lock-in Derivation */}
            <div className="space-y-4">
              <div className="glass-panel p-5 border border-cyan-500/20 bg-[#060e22]">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  1.2 Vortex Shedding & 0.38 Hz Modal Lock-in
                </h4>

                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Deepwater benthic current flow (<strong className="text-white">U = 1.85 knots ≈ 0.95 m/s</strong>) shed vortices along the outer diameter (<strong className="text-white">D_o = 0.324 m</strong>) at Strouhal frequency:
                </p>

                <div className="p-2.5 my-2 rounded bg-[#02050f] border border-slate-800 text-center font-mono text-cyan-200 text-xs">
                  {"f_s = \\frac{St \\cdot U}{D_o} = \\frac{0.19 \\cdot 0.95}{0.324} \\approx 0.55\\text{ Hz}"}
                </div>

                <div className="text-xs text-slate-300 font-sans space-y-2 leading-relaxed">
                  <p>
                    As the shed vortices match the riser's 2nd natural transverse bending mode (<strong className="text-cyan-300 font-mono">f_n2 = 0.38 Hz</strong>), vortex shedding locks onto the riser natural frequency.
                  </p>
                  <p>
                    Cross-flow oscillation amplitude reaches <strong className="text-white">A_y / D_o ≈ 0.85</strong>, creating dynamic riser curvature <strong className="text-white">κ = d²w/ds²</strong>. Dynamic bending strain maps directly to dynamic stress range:
                  </p>
                </div>

                <div className="p-2 my-2 rounded bg-[#02050f] border border-cyan-500/20 text-center font-mono text-purple-300 text-xs">
                  {"\\Delta \\sigma = E \\cdot \\frac{D_o}{2} \\cdot \\kappa \\approx 160\\text{ MPa} \\implies \\sigma_{\\text{peak}} = 245\\text{ MPa}"}
                </div>

                <p className="text-[11px] text-amber-200 bg-amber-500/10 p-2 rounded border border-amber-500/20 font-sans">
                  <strong>Operational Insight:</strong> The 4-fold increase in cyclic stress range accelerates flaw propagation rate da/dN by a factor of 160³ / 42³ ≈ <strong>55x</strong>, converting a 20-year fatigue life into weeks.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Chart: Paris Law Crack Growth */}
          <div className="glass-panel p-5 border border-slate-800 bg-[#050b18]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Sample Model Output: Paris-Erdogan Flaw Propagation Curve (N vs Depth a)
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Comparison of nominal baseline wave loading fatigue versus 0.38 Hz VIV resonant lock-in acceleration.
                </p>
              </div>
              <span className="badge badge-purple text-[10px] font-mono">BS 7910 MODEL</span>
            </div>

            <div className="h-[300px] w-full">
              <Line 
                data={parisChartConfig} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } } },
                    y: { 
                      grid: { color: 'rgba(255,255,255,0.05)' }, 
                      ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } },
                      title: { display: true, text: 'Crack Depth a (mm)', color: '#94a3b8', font: { size: 11 } }
                    }
                  }
                }} 
              />
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: DYNAMIC PVT HYDRATE PHASE EQUILIBRIUM */}
      {activeTab === 'physics-hydrate' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel p-5 border border-cyan-500/30 bg-[#060e22]">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  2.1 Dynamic Compositional Hydrate Phase Envelope Formulation
                </h3>

                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Deepwater subsea flowlines transport multiphase hydrocarbons at benthic seabed temperatures (3.6°C) and high hydrostatic pressures (up to 345 bar). Conventional software assumes static hydrate dissociation boundaries. In reality, as a reservoir matures, Water Cut (WC) and Gas-to-Oil Ratio (GOR) shift continuously, altering Structure sII hydrate thermodynamic equilibria:
                </p>

                <div className="p-3.5 my-3 rounded-lg bg-[#02050f] border border-cyan-400/30 text-center font-mono text-cyan-200 text-sm tracking-wider">
                  {"T_{\\text{hyd}}(P) = 8.9 \\cdot \\log_{10}(P) + 0.018 \\cdot P - 7.5 + \\Delta T_{\\text{PVT}}(\\text{WC}, \\text{GOR})"}
                </div>

                <div className="text-xs text-slate-300 font-sans space-y-2 leading-relaxed">
                  <p>
                    Where the dynamic compositional shift factor <strong className="text-cyan-300 font-mono">ΔT_PVT</strong> is continuously calibrated from multiphase flowmeter telemetry:
                  </p>
                </div>

                <div className="p-3 my-2 rounded-lg bg-[#02050f] border border-slate-800 text-center font-mono text-amber-300 text-xs">
                  {"\\Delta T_{\\text{PVT}} = (\\text{WC} - 10) \\cdot 0.12 + (\\text{GOR} - 1500) \\cdot 0.002 \\quad (^{\\circ}\\text{C})"}
                </div>

                <div className="text-xs text-slate-300 font-sans space-y-2 leading-relaxed mt-3">
                  <p>
                    The instantaneous subcooling driving force is calculated as:
                  </p>
                  <div className="p-2 rounded bg-[#02050f] border border-slate-800 text-center font-mono text-white text-xs">
                    {"\\Delta T_{\\text{sub}} = T_{\\text{fluid}} - T_{\\text{hyd}}(P)"}
                  </div>
                  <p>
                    When <strong className="text-rose-400 font-mono">ΔT_sub &lt; 0</strong>, the fluid core enters the hydrate metastable nucleation zone. Clathrate hydrate crystal agglomeration begins adhering to pipe inner walls.
                  </p>
                </div>
              </div>

              {/* Hammerschmidt Equation Box */}
              <div className="glass-panel p-4 border border-emerald-500/20 bg-[#040d1a]">
                <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Thermodynamic Inhibitor (MEG) Suppression — Hammerschmidt Kinetics
                </h4>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Thermodynamic prevention requires depressing the hydrate freezing temperature via monoethylene glycol (MEG, C2H6O2) dosing. The freezing point depression is governed by the classical Hammerschmidt formulation:
                </p>

                <div className="p-2.5 my-2 rounded bg-[#020610] border border-emerald-500/30 text-center font-mono text-emerald-300 text-xs">
                  {"\\Delta T_{\\text{freeze}} = \\frac{K_h \\cdot W}{M \\cdot (100 - W)}"}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Where <strong className="text-white">K_h = 1297</strong> for MEG, <strong className="text-white">M = 62.07 g/mol</strong> is molecular weight, and <strong className="text-white">W</strong> is the weight percent of inhibitor in the free aqueous phase. SubseaGuard AI calculates required inhibitor flow in real time to maintain a mandatory <strong className="text-emerald-300 font-mono">+3.0°C safety buffer</strong>.
                </p>
              </div>
            </div>

            {/* PVT Sensitivity Metrics */}
            <div className="space-y-4">
              <div className="glass-panel p-5 border border-slate-800 bg-[#050b18]">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Operating State Sensitivities
                </h4>

                <div className="space-y-3 mt-3 text-xs font-mono">
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">NOMINAL SAFE STATE</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">P = 215 bar • T = 52.4°C</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      ΔT_sub = +37.6°C safe buffer. Clear of hydrate stability zone.
                    </div>
                  </div>

                  <div className="p-3 rounded bg-rose-950/20 border border-rose-500/40">
                    <div className="text-rose-400 text-[10px]">SUBCOOLED ANOMALY STATE</div>
                    <div className="text-sm font-bold text-rose-300 mt-1">P = 195 bar • T = 7.8°C</div>
                    <div className="text-[11px] text-rose-200/90 font-sans mt-0.5">
                      ΔT_sub = -6.7°C inside hydrate envelope! Clathrate nucleation imminent.
                    </div>
                  </div>

                  <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/30">
                    <div className="text-emerald-400 text-[10px]">POST-MEG SURGE MITIGATION</div>
                    <div className="text-sm font-bold text-emerald-300 mt-1">30 wt% MEG Suppressed</div>
                    <div className="text-[11px] text-slate-300 font-sans mt-0.5">
                      T_hyd depressed to -3.4°C. Fluid restored to safe region (+11.2°C margin).
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Chart: Dynamic Hydrate Envelope */}
          <div className="glass-panel p-5 border border-slate-800 bg-[#050b18]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Sample Model Output: Dynamic PVT Hydrate Phase Equilibrium Envelope (P vs T)
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Phase boundaries shift dynamically with Water Cut. Hydrate crystallization occurs to the left of the active curve.
                </p>
              </div>
              <span className="badge badge-cyan text-[10px] font-mono">DYNAMIC PVT</span>
            </div>

            <div className="h-[320px] w-full">
              <Line 
                data={hydrateChartConfig} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } } },
                    y: { 
                      grid: { color: 'rgba(255,255,255,0.05)' }, 
                      ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } },
                      title: { display: true, text: 'Hydrate Equilibrium Temperature (°C)', color: '#94a3b8', font: { size: 11 } }
                    }
                  }
                }} 
              />
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: BAYESIAN UNCERTAINTY QUANTIFICATION (UQ) */}
      {activeTab === 'physics-uq' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel p-5 border border-purple-500/30 bg-[#070b1d]">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  3.1 Probabilistic RUL Prognostics: What P10, P50, and P90 Actually Mean
                </h3>

                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  In safety-critical subsea engineering, single-point Remaining Useful Life (RUL) estimates are dangerously misleading. Riser wall thickness variations, stochastic ocean currents, and localized pitting induce wide variance. SubseaGuard AI implements Bayesian uncertainty quantification (UQ) outputting the cumulative failure distribution:
                </p>

                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40">
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">P10 QUANTILE</span>
                    <h4 className="text-base font-bold text-white mt-1">Conservative Safety Limit</h4>
                    <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                      <strong>90% probability of survival</strong> (10% failure probability). This is the operational dispatch threshold. If P10 breaches the 60-day window, vessel mobilization is scheduled immediately.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/40">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">P50 QUANTILE</span>
                    <h4 className="text-base font-bold text-white mt-1">Median Life Expectancy</h4>
                    <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                      <strong>50% probability of survival</strong>. Represents the central mathematical expectation under sustained operating conditions; used for long-range asset integrity planning.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">P90 QUANTILE</span>
                    <h4 className="text-base font-bold text-white mt-1">Upper Life Horizon</h4>
                    <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                      <strong>10% probability of survival</strong> (90% cumulative failure probability). Represents the absolute outer boundary under best-case passivation film re-formation.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-sans space-y-2 leading-relaxed">
                  <h4 className="font-bold text-white font-mono text-xs uppercase text-cyan-300">
                    Prior Distribution & Bayesian Updating Formula
                  </h4>
                  <p>
                    Degradation paths assume a 2-parameter Weibull failure intensity function:
                  </p>
                  <div className="p-2.5 rounded bg-[#02050f] border border-slate-800 text-center font-mono text-purple-300 text-xs">
                    {"R(t) = \\exp\\left( -\\left( \\frac{t}{\\eta} \\right)^\\beta \\right), \\quad \\text{Prior: } \\theta = (\\eta, \\beta) \\sim \\mathcal{N}(\\mu_0, \\Sigma_0)"}
                  </div>
                  <p>
                    When an ROV completes a targeted non-destructive testing (NDT) scan (ultrasonic wall thickness or phased-array crack depth), the observation likelihood <strong className="text-white font-mono">P(D_ROV | θ)</strong> updates the posterior distribution via Bayes' theorem:
                  </p>
                  <div className="p-2 rounded bg-[#02050f] border border-slate-800 text-center font-mono text-cyan-300 text-xs">
                    {"P(\\theta \\mid D_{\\text{ROV}}) = \\frac{P(D_{\\text{ROV}} \\mid \\theta) \\cdot P(\\theta)}{\\int P(D_{\\text{ROV}} \\mid \\theta) \\cdot P(\\theta)\\, d\\theta}"}
                  </div>
                  <p>
                    This Bayesian ground-truth update instantaneously contracts the P10–P90 uncertainty cone, eliminating model drift without manual code modifications.
                  </p>
                </div>
              </div>
            </div>

            {/* UQ Engineering Value */}
            <div className="space-y-4">
              <div className="glass-panel p-5 border border-slate-800 bg-[#050b18]">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Safety & Commercial Impact
                </h4>

                <div className="space-y-3 mt-3 text-xs font-sans text-slate-300 leading-relaxed">
                  <p>
                    • <strong className="text-white">Zero False-Positive Mobilizations:</strong> Calendar-based maintenance dispatches ROVs blindly every 24 months. Bayesian UQ allows extending healthy inspections to 54 months while pinpointing real anomalies.
                  </p>
                  <p>
                    • <strong className="text-white">Insurance & Safety Case Integrity:</strong> BSEE and DNV regulators require quantitative confidence bounds for deepwater unbonded flexible risers and SCRs under DNV-RP-F116.
                  </p>
                  <p>
                    • <strong className="text-emerald-400 font-bold">$3.83M Annual Cost Avoidance:</strong> Avoids 28 vessel-days per year per field cluster.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Chart: RUL Fan Chart */}
          <div className="glass-panel p-5 border border-slate-800 bg-[#050b18]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Sample Model Output: Bayesian RUL Fan Chart (Days to Failure with Confidence Bounds)
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Shows anomaly injection at Day 30, divergence of P10/P50/P90 cones, and Bayesian re-calibration post-ROV inspection at Day 75.
                </p>
              </div>
              <span className="badge badge-purple text-[10px] font-mono">BAYESIAN UQ</span>
            </div>

            <div className="h-[320px] w-full">
              <Line 
                data={rulFanChartConfig} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } } },
                    y: { 
                      grid: { color: 'rgba(255,255,255,0.05)' }, 
                      ticks: { color: '#94a3b8', font: { family: 'monospace', size: 10 } },
                      title: { display: true, text: 'Forecast Remaining Useful Life (Days)', color: '#94a3b8', font: { size: 11 } }
                    }
                  }
                }} 
              />
            </div>
          </div>

        </div>
      )}

      {/* SECTION 4: NPW ACOUSTIC LOCALIZATION */}
      {activeTab === 'physics-leak' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="glass-panel p-6 border border-cyan-500/30 bg-[#060e22]">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              4.1 Negative Pressure Wave (NPW) Acoustic Time-of-Flight Localization
            </h3>

            <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
              When a containment breach occurs along a 12.4 km production flowline at -1,850 m depth, the instantaneous local pressure drop initiates an acoustic rarefaction wave (Negative Pressure Wave, NPW) that propagates in both directions at the sonic velocity of the fluid medium.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              
              <div className="p-4 rounded-xl bg-[#030612] border border-cyan-500/20 font-mono space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">TIME-OF-FLIGHT FORMULATION</span>
                <div className="p-3 my-1 rounded bg-[#050b18] border border-cyan-400/40 text-center text-cyan-200 text-sm">
                  {"X_{\\text{leak}} = \\frac{L + a \\cdot (t_{\\text{outlet}} - t_{\\text{inlet}})}{2}"}
                </div>
                <div className="text-[11px] text-slate-300 font-sans space-y-1">
                  <div>• <strong className="text-white">L = 12.4 km:</strong> Flowline length between manifold and PLET.</div>
                  <div>• <strong className="text-white">a ≈ 1080 m/s:</strong> Speed of acoustic sound in multiphase crude.</div>
                  <div>• <strong className="text-white">t_outlet - t_inlet:</strong> Time-of-flight arrival difference recorded by quartz transducers and fiber DAS.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#030612] border border-purple-500/20 font-mono space-y-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase">IEEE 1588 PTP NANOSECOND SYNCHRONIZATION</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Pinpoint sub-meter localization requires absolute time synchronization across distributed seabed nodes. SubseaGuard AI incorporates IEEE 1588 Precision Time Protocol (PTP), achieving:
                </p>
                <div className="p-2 rounded bg-[#050b18] border border-purple-400/40 text-center text-purple-200 text-xs">
                  {"|t_{\\text{NPW}} - t_{\\text{quartz}}| < 15\\text{ ns} \\implies \\text{Spatial Precision } \\pm 16.2\\text{ mm}"}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Guarantees that acoustic peaks from flow slugs or pump starts are differentiated from genuine micro-leaks.
                </p>
              </div>

            </div>

            <div className="p-4 rounded-lg bg-[#040816] border border-slate-800 text-xs font-sans space-y-2 text-slate-300 leading-relaxed">
              <strong className="text-white font-mono uppercase text-cyan-300">Multi-Stream Cross-Validation Hierarchy:</strong>
              <p>
                To avoid false alarms that would trigger needless emergency shutdown (ESD-1), the acoustic NPW signal is correlated in real time with:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-bold">1. Mass Balance</span>
                  <div className="text-white mt-0.5">Δṁ = ṁ_in - ṁ_out &gt; 0.2 kg/s</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold">2. Optical Plume</span>
                  <div className="text-white mt-0.5">Sniffer &gt; 5.0 ppm-m CH4</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-purple-400 font-bold">3. Transient dP/dt</span>
                  <div className="text-white mt-0.5">Gradient &lt; -0.35 bar/s</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 5: EDGE-TO-ACTION PIPELINE & MERMAID DIAGRAM */}
      {activeTab === 'architecture-pipeline' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="glass-panel p-6 border border-cyan-500/30 bg-[#060c1e]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  5.1 Sensor &rarr; Edge Wavelet (128:1) &rarr; Inference &rarr; HITL Gate &rarr; Action
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  The end-to-end data processing topology operating between -1,850m seabed and topside facility.
                </p>
              </div>

              <button
                onClick={copyMermaidCode}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? 'Copied Mermaid!' : 'Copy Mermaid'}</span>
              </button>
            </div>

            {/* Edge Wavelet Explanation */}
            <div className="p-4 rounded-xl bg-[#040816] border border-cyan-500/20 text-xs font-sans text-slate-300 leading-relaxed space-y-2 mb-4">
              <strong className="text-cyan-300 font-mono">WHY SUBSEA EDGE WAVELET COMPRESSION (128:1) IS CRITICAL:</strong>
              <p>
                Fiber Distributed Acoustic Sensing (DAS) channels pulse at 25 kHz, generating <strong className="text-white">~48 MB/s</strong> of continuous acoustic raw telemetry. Subsea umbilical copper/fiber pairs have severely constrained bandwidth and high transmission latency across 15+ km tiebacks.
              </p>
              <p>
                Subsea canisters deployed at the seabed PLET perform edge Discrete Wavelet Transforms (DWT, Daubechies db4) and FFT spectral binning. Raw 25 kHz streams are compressed down to <strong className="text-emerald-400 font-mono font-bold">20 Hz wavelet packet statistics (128:1 reduction ratio)</strong>, allowing continuous real-time transmission over standard umbilical modems without losing acoustic transients.
              </p>
            </div>

            {/* Mermaid Architecture Code Display */}
            <div className="p-4 rounded-xl bg-[#02050f] border border-slate-800 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <span>MERMAID PIPELINE SPECIFICATION (PASTE INTO GITHUB OR NOTION)</span>
                <span className="text-cyan-400">Flowchart TD</span>
              </div>
              <pre className="text-cyan-300 leading-relaxed">{mermaidPipelineCode}</pre>
            </div>

            {/* HITL Gate Explanation */}
            <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-sans text-amber-200 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                <Lock className="w-4 h-4" />
                <span>The Human-in-the-Loop (HITL) Authorization Gate:</span>
              </div>
              Offshore ROV intervention vessels cost between <strong>$95,000 and $135,000 per day</strong> plus mobilization fees. If an AI algorithm dispatched ROV spreads autonomously on raw inference scores, a single sensor glitch or marine biofouling anomaly would incur catastrophic operational waste. SubseaGuard AI enforces a mandatory cryptographic authorization token requiring the Chief Subsea Integrity Lead to formally review evidence and approve the mission prior to physical spread mobilization.
            </div>

          </div>

        </div>
      )}

      {/* SECTION 6: ISO 14224 EQUIPMENT TAXONOMY */}
      {activeTab === 'iso-taxonomy' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="glass-panel p-6 border border-slate-800 bg-[#050b18]">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-cyan-400" />
              6.1 ISO 14224 Subsea Equipment Taxonomy & Failure Mode Codes (FMC)
            </h3>

            <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
              SubseaGuard AI aligns all digital twin components, sensor telemetry, and work orders with <strong className="text-white">ISO 14224:2016</strong> (Petroleum, petrochemical and natural gas industries — Collection and exchange of reliability and maintenance data for equipment).
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#030612] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Taxonomy Level</th>
                    <th className="p-2.5">System Name</th>
                    <th className="p-2.5">Equipment Unit</th>
                    <th className="p-2.5">ISO Failure Mode (FMC)</th>
                    <th className="p-2.5">AI Detection Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">Level 4: Subsystem</td>
                    <td className="p-2.5">Flowlines & Risers</td>
                    <td className="p-2.5 text-white font-bold">PFL-101 (Pipe-in-Pipe)</td>
                    <td className="p-2.5 text-rose-300">PLUG (Hydrate Blockage)</td>
                    <td className="p-2.5">Dynamic PVT Subcooling Margin (ΔT &lt; 0)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">Level 4: Subsystem</td>
                    <td className="p-2.5">Flowlines & Risers</td>
                    <td className="p-2.5 text-white font-bold">SCR-01 (Steel Catenary)</td>
                    <td className="p-2.5 text-rose-300">BRKD (Structural Fatigue)</td>
                    <td className="p-2.5">0.38 Hz VIV Accelerometer FFT &amp; Rainflow</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">Level 4: Subsystem</td>
                    <td className="p-2.5">Flowlines & Risers</td>
                    <td className="p-2.5 text-white font-bold">PFL-101 (Terminal Elbow)</td>
                    <td className="p-2.5 text-rose-300">ERO (Wall Thinning)</td>
                    <td className="p-2.5">Acoustic Sand Sensor &amp; Salama Model</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">Level 4: Subsystem</td>
                    <td className="p-2.5">Flowlines & Risers</td>
                    <td className="p-2.5 text-white font-bold">PFL-101 (Seabed Route)</td>
                    <td className="p-2.5 text-rose-300">ELK (External Leak)</td>
                    <td className="p-2.5">NPW Time-of-Flight &amp; Mass Balance Deficit</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">Level 4: Subsystem</td>
                    <td className="p-2.5">Flowlines & Risers</td>
                    <td className="p-2.5 text-white font-bold">PFL-101 (Cold Zone)</td>
                    <td className="p-2.5 text-amber-300">RES (Hydraulic Restriction)</td>
                    <td className="p-2.5">WAT Subcooling &amp; Differential Pressure ΔP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Navigation Return Footer */}
      <div className="p-4 rounded-xl bg-[#050b18] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-400">
          SubseaGuard AI Technical Whitepaper • Version 4.2.8-prod • Published for Peer Review
        </span>

        <button
          onClick={() => onNavigateTab('control-room')}
          className="btn-primary text-xs py-1.5 px-4 font-sans flex items-center gap-1.5"
        >
          <span>Return to Live Control Room</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
