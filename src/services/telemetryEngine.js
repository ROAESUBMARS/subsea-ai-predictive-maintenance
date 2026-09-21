// Subsea Flowlines & Risers AI Telemetry & Predictive Maintenance Engine
// Enhanced 4-Stage Architecture:
// Stage 1: Sensor Self-Diagnostics, Edge DAS Wavelet Compression, IEEE 1588 PTP Clock Sync
// Stage 2: Dynamic PVT Compositional Hydrate Envelope (GOR/WaterCut), H2S/MIC Corrosion, Multiphase Flow Regime (Slugging/Annular)
// Stage 3: Bayesian Uncertainty Quantification (UQ), Constrained RL Dosing Guardrails, SHAP Explainability, PSI Model Drift Tracking
// Stage 4: Bidirectional Inspection Calibration & Human-in-the-Loop (HITL) Sign-off Gate

export const ASSET_DEFINITIONS = [
  {
    id: 'SCR-01',
    name: 'Deepwater Steel Catenary Riser Alpha',
    type: 'Steel Catenary Riser (SCR)',
    depth: 1850,
    lengthKm: 8.4,
    outerDiameterInches: 12.75,
    innerDiameterMm: 273.0,
    nominalWallThicknessMm: 25.4,
    minAllowableWallMm: 16.5,
    materialGrade: 'DNV-OS-F101 SAWL 450 (X65 Super Duplex Clad)',
    designPressureBar: 345,
    designTempC: 85,
    hangOffAngleDeg: 14.5,
    touchdownLocationKp: 2.85,
    coordinates: { x: 780, y: 160 },
    icon: 'GitBranch',
    criticality: 'CRITICAL_PRODUCTION',
    downtimeCostPerHourUsd: 85000,
    description: '12-inch dynamic Steel Catenary Riser connecting seabed PLET to Floating Production Unit (FPU). Subjected to high cyclic wave motion, benthic currents (VIV), and touchdown fatigue.',
    sensors: [
      { id: 'tdz_accel_1', name: 'TDZ Triaxial Accelerometer #1 (VIV)', type: 'Vibration/VIV', unit: 'g', healthPct: 99.4, ptpSyncOffsetNs: 12 },
      { id: 'tdz_strain_1', name: 'Touchdown Dynamic Fiber-Optic Strain Gauge', type: 'Strain', unit: 'µε', healthPct: 98.8, ptpSyncOffsetNs: 14 },
      { id: 'top_hangoff_load', name: 'Topside Hang-off Load Cell & Inclinometer', type: 'Tension', unit: 'kN', healthPct: 99.9, ptpSyncOffsetNs: 8 },
      { id: 'ut_wall_gauge_1', name: 'High-Resolution Subsea Ultrasonic Wall-Thickness Gauge', type: 'UT Thickness', unit: 'mm', healthPct: 97.5, ptpSyncOffsetNs: 16 }
    ],
    components: [
      { id: 'hangoff_joint', name: 'Titanium Flex-Joint / Hang-off Porch', normalRUL: 320, currentRUL: 310, zone: 'Topside Hang-off' },
      { id: 'top_riser_section', name: 'Upper Dynamic Catenary Section', normalRUL: 280, currentRUL: 275, zone: 'Water Column' },
      { id: 'tdz_section', name: 'Touchdown Zone (TDZ) Seabed Dynamic Arc', normalRUL: 110, currentRUL: 104, zone: 'Touchdown Zone (KP 2.85)' },
      { id: 'riser_base_plet', name: 'Riser Base PLET Termination', normalRUL: 420, currentRUL: 410, zone: 'Seabed PLET' }
    ]
  },
  {
    id: 'PFL-101',
    name: 'Primary Multiphase Production Flowline',
    type: 'Subsea Production Flowline',
    depth: 1830,
    lengthKm: 12.4,
    outerDiameterInches: 14.0,
    innerDiameterMm: 304.8,
    nominalWallThicknessMm: 24.5,
    minAllowableWallMm: 15.2,
    materialGrade: 'Carbon Steel + 3mm Inconel 625 Clad (Pipe-in-Pipe)',
    designPressureBar: 310,
    designTempC: 95,
    touchdownLocationKp: null,
    coordinates: { x: 480, y: 320 },
    icon: 'Activity',
    criticality: 'CRITICAL_PRODUCTION',
    downtimeCostPerHourUsd: 125000,
    description: '14-inch insulated Pipe-in-Pipe (PiP) production flowline transporting multiphase crude & gas from Manifold SM-01 to PLET-01 over 12.4 km.',
    sensors: [
      { id: 'inlet_pt', name: 'Manifold Inlet Quartz P/T Sensor', type: 'Pressure/Temp', unit: 'bar / °C', healthPct: 99.2, ptpSyncOffsetNs: 9 },
      { id: 'outlet_pt', name: 'PLET Outlet Quartz P/T Sensor', type: 'Pressure/Temp', unit: 'bar / °C', healthPct: 99.1, ptpSyncOffsetNs: 11 },
      { id: 'acoustic_npw_1', name: 'Distributed Fiber-Optic Acoustic Sensor (NPW Leak)', type: 'DAS Acoustic', unit: 'dB', healthPct: 98.4, ptpSyncOffsetNs: 5 },
      { id: 'sand_monitor_pfl', name: 'Acoustic Sand Erosion & Velocity Probe', type: 'Sand Rate', unit: 'PPM', healthPct: 97.9, ptpSyncOffsetNs: 15 }
    ],
    components: [
      { id: 'manifold_tie_in', name: 'Manifold SM-01 Rigid Tie-in Spool', normalRUL: 360, currentRUL: 350, zone: 'Manifold Tie-In' },
      { id: 'midline_expansion', name: 'Seabed Expansion Loop & Pipe Insulation', normalRUL: 450, currentRUL: 440, zone: 'Midline (KP 6.0)' },
      { id: 'corrosion_monitoring_spool', name: 'Online Ultrasonic & Corrosion Spool', normalRUL: 180, currentRUL: 175, zone: 'PLET Elbow (KP 12.4)' },
      { id: 'plet_inlet_valve', name: 'PLET-01 Subsea Isolation Wing Valve', normalRUL: 310, currentRUL: 300, zone: 'PLET Terminal' }
    ]
  },
  {
    id: 'GEL-201',
    name: 'High-Pressure Subsea Gas Export Flowline',
    type: 'Subsea Gas Export Flowline',
    depth: 1810,
    lengthKm: 18.6,
    outerDiameterInches: 16.0,
    innerDiameterMm: 362.0,
    nominalWallThicknessMm: 22.2,
    minAllowableWallMm: 14.0,
    materialGrade: 'DNV-OS-F101 SAWL 485 (13Cr / CRA Clad)',
    designPressureBar: 380,
    designTempC: 70,
    touchdownLocationKp: null,
    coordinates: { x: 620, y: 460 },
    icon: 'Radio',
    criticality: 'HIGH',
    downtimeCostPerHourUsd: 72000,
    description: '16-inch high-pressure gas export line transporting gas across 18.6 km. Continuous monitoring of rapid depressurization transients and high fluid velocity.',
    sensors: [
      { id: 'gel_mass_flow_in', name: 'Inlet Venturi Gas Mass Flowmeter', type: 'Mass Flow', unit: 'kg/s', healthPct: 98.9, ptpSyncOffsetNs: 10 },
      { id: 'gel_pressure_gradient', name: 'Differential Pressure Gradient & Transient (dP/dt)', type: 'Transient P', unit: 'bar/s', healthPct: 99.5, ptpSyncOffsetNs: 8 }
    ],
    components: [
      { id: 'gel_gas_choke', name: 'Subsea Gas Export Pressure Control Choke', normalRUL: 190, currentRUL: 185, zone: 'Gas Export Skid' },
      { id: 'gel_pipeline_body', name: 'Seabed 13Cr CRA Pipeline Free-Span', normalRUL: 500, currentRUL: 490, zone: 'Subsea Route' }
    ]
  },
  {
    id: 'FLEX-03',
    name: 'Lazy-Wave Flexible Riser Bundle',
    type: 'Unbonded Flexible Riser',
    depth: 1840,
    lengthKm: 4.6,
    outerDiameterInches: 8.625,
    innerDiameterMm: 177.8,
    nominalWallThicknessMm: 18.0,
    minAllowableWallMm: 12.0,
    materialGrade: 'API 17J Multi-Layer Armor Steel + PVDF Barrier',
    designPressureBar: 275,
    designTempC: 90,
    hangOffAngleDeg: 10.0,
    touchdownLocationKp: 1.45,
    coordinates: { x: 320, y: 190 },
    icon: 'Layers',
    criticality: 'HIGH',
    downtimeCostPerHourUsd: 55000,
    description: '8-inch unbonded flexible riser with distributed buoyancy modules creating a lazy-wave decoupling catenary motion.',
    sensors: [
      { id: 'flex_bend_stiffener', name: 'Topside Bend Stiffener Curvature Inclinometer', type: 'Curvature', unit: '1/m', healthPct: 99.2, ptpSyncOffsetNs: 12 },
      { id: 'annulus_vent_gas', name: 'Annulus Gas Venting & Permeation Monitor', type: 'Permeation', unit: 'NL/h', healthPct: 98.0, ptpSyncOffsetNs: 14 }
    ],
    components: [
      { id: 'bend_stiffener_top', name: 'Polyurethane Dynamic Bend Stiffener', normalRUL: 220, currentRUL: 215, zone: 'Topside' },
      { id: 'buoyancy_modules', name: 'Syntactic Foam Distributed Buoyancy Clamps', normalRUL: 380, currentRUL: 375, zone: 'Buoyancy Arch' }
    ]
  },
  {
    id: 'WIF-301',
    name: 'High-Pressure Water Injection Flowline',
    type: 'Subsea Water Injection Line',
    depth: 1820,
    lengthKm: 6.8,
    outerDiameterInches: 10.75,
    innerDiameterMm: 228.6,
    nominalWallThicknessMm: 21.0,
    minAllowableWallMm: 13.5,
    materialGrade: 'Duplex 22Cr Stainless Steel',
    designPressureBar: 420,
    designTempC: 45,
    touchdownLocationKp: null,
    coordinates: { x: 260, y: 440 },
    icon: 'Droplets',
    criticality: 'MEDIUM_HIGH',
    downtimeCostPerHourUsd: 38000,
    description: '10-inch high-pressure treated seawater injection line with dissolved oxygen, biocide, and MIC bio-corrosion monitoring.',
    sensors: [
      { id: 'wif_dissolved_o2', name: 'Dissolved Oxygen & SRB Bio-Corrosion Sensor', type: 'Electro-Chem', unit: 'ppb', healthPct: 98.2, ptpSyncOffsetNs: 16 },
      { id: 'wif_flow_rate', name: 'Electromagnetic Injection Water Flowmeter', type: 'Flow Rate', unit: 'm³/h', healthPct: 99.4, ptpSyncOffsetNs: 7 }
    ],
    components: [
      { id: 'wif_injection_choke', name: 'Tungsten Carbide Water Injection Trim Choke', normalRUL: 140, currentRUL: 135, zone: 'Injection Skid' }
    ]
  },
  {
    id: 'PLEM-01',
    name: 'Pipeline End Manifold & Pigging Station',
    type: 'Subsea Manifold & Pig Launcher',
    depth: 1835,
    lengthKm: 0.1,
    outerDiameterInches: 16.0,
    innerDiameterMm: 350.0,
    nominalWallThicknessMm: 28.0,
    minAllowableWallMm: 18.0,
    materialGrade: 'Forged Super Duplex UNS S32750 / F53',
    designPressureBar: 350,
    designTempC: 90,
    touchdownLocationKp: null,
    coordinates: { x: 550, y: 220 },
    icon: 'ShieldAlert',
    criticality: 'CRITICAL_SAFETY',
    downtimeCostPerHourUsd: 110000,
    description: 'Deepwater convergence station with automated subsea pig launcher, chemical distribution mandrels, and dual isolation barriers.',
    sensors: [
      { id: 'pig_passage_acoustic', name: 'Non-Intrusive Acoustic / Magnetic Pig Signaller', type: 'Pig Passage', unit: 'Hits', healthPct: 99.8, ptpSyncOffsetNs: 6 },
      { id: 'cp_anode_potential', name: 'Cathodic Protection Reference Probe', type: 'CP Potential', unit: '-mV', healthPct: 99.0, ptpSyncOffsetNs: 12 }
    ],
    components: [
      { id: 'pig_launcher_barrel', name: 'Subsea Intelligent Pigging Launcher Barrel', normalRUL: 350, currentRUL: 340, zone: 'Launcher Barrel' }
    ]
  }
];

export const SIMULATION_SCENARIOS = {
  NORMAL: {
    name: 'Baseline Steady-State Flow Assurance & Structural Integrity',
    description: 'Flowlines and risers operating under nominal multiphase flow, dynamic PVT hydrate buffer, balanced mass flow, and low fatigue.',
    badge: 'OPTIMAL',
    severity: 'NORMAL',
    affectedAsset: 'PFL-101',
    faultType: 'None (Healthy Base State)',
    flowRegime: 'Stratified Wavy Flow',
    confidenceScore: 99.2
  },
  HYDRATE_RISK: {
    name: 'Deepwater Subcooling & Severe Hydrate Plaque Formation Risk',
    description: 'Ambient sea temp (3.6°C) cools multiphase crude below dynamic PVT hydrate equilibrium curve, triggering bounded RL MEG inhibitor surge.',
    badge: 'HYDRATE CRIT',
    severity: 'CRITICAL',
    affectedAsset: 'PFL-101',
    faultType: 'Thermodynamic Gas Hydrate Plaque Blockage',
    flowRegime: 'Severe Hydrodynamic Slugging',
    confidenceScore: 94.8
  },
  TOUCHDOWN_FATIGUE: {
    name: 'SCR Riser Touchdown Zone (TDZ) Vortex-Induced Vibration (VIV) & Fatigue Spike',
    description: 'Benthic loop currents (1.85 knots) trigger 2nd modal vortex lock-in on SCR-01, accelerating Paris-Erdogan flaw propagation with Bayesian UQ bounds.',
    badge: 'FATIGUE CRIT',
    severity: 'CRITICAL',
    affectedAsset: 'SCR-01',
    faultType: 'VIV Modal Lock-in & TDZ Micro-Crack Initiation',
    flowRegime: 'Annular Mist / Dynamic Wave Loading',
    confidenceScore: 96.4
  },
  EROSION_WALL_LOSS: {
    name: 'Choke Sand Breakthrough & Severe Flowline Wall Thinning',
    description: 'Sand breakthrough (82 PPM) combined with H2S sour pitting accelerates wall loss to 2.85 mm/yr. Bayesian UQ forecasts P10/P50/P90 RUL breach.',
    badge: 'WALL LOSS CRIT',
    severity: 'CRITICAL',
    affectedAsset: 'PFL-101',
    faultType: 'Accelerated Sand Erosion & H2S Sour Pitting',
    flowRegime: 'High-Velocity Annular Flow',
    confidenceScore: 97.1
  },
  MICRO_LEAK: {
    name: 'Early Stage Flowline Micro-Leak Detected by Acoustic NPW & Mass Balance',
    description: 'Real-time mass balance deficit (1.85 kg/s) combined with IEEE 1588 time-synced NPW acoustics localizes breach to KP 4.35 km.',
    badge: 'LEAK DETECTED',
    severity: 'CRITICAL',
    affectedAsset: 'PFL-101',
    faultType: 'Flowline Hydrocarbon Containment Breach (Micro-Leak)',
    flowRegime: 'Unstable Depressurization Slug Flow',
    confidenceScore: 98.6
  },
  WAX_DEPOSITION: {
    name: 'Waxy Crude Deposition & Dynamic Intelligent Pigging Schedule',
    description: 'Subcooling below WAT (37.5°C) deposits 3.4 mm paraffin wax layer, restricting effective ID and triggering HITL-gated pigging dispatch.',
    badge: 'WAX WARNING',
    severity: 'WARNING',
    affectedAsset: 'PFL-101',
    faultType: 'Paraffin Wax Deposition & Hydraulic Restriction',
    flowRegime: 'Stratified Core-Annular Flow',
    confidenceScore: 92.3
  }
};

class TelemetryEngine {
  constructor() {
    this.scenario = 'NORMAL';
    this.tick = 0;
    this.listeners = new Set();
    this.interventionHistory = [];
    this.escalationLog = [];
    this.pendingRovAuthorizations = [];
    this.alertHistory = [
      {
        id: 'ALT-109',
        timestamp: '2026-08-31 22:45:10',
        tier: 'INFORMATIONAL',
        assetId: 'PFL-101',
        title: 'Thermal Insulation Micro-Drift',
        message: 'DTS fiber sensor self-diagnostics verified; thermal gradient drifted 0.4°C.',
        status: 'RESOLVED'
      }
    ];

    this.history = {
      timestamps: [],
      inletPressure: [],
      outletPressure: [],
      fluidTemp: [],
      ambientTemp: [],
      massFlowIn: [],
      massFlowOut: [],
      tdzStrain: [],
      vivAcceleration: [],
      wallThickness: [],
      megDosingRate: [],
      waxThickness: [],
      leakProbability: []
    };

    this.latestState = this.generateInitialState();
  }

  generateInitialState() {
    const assets = {};
    ASSET_DEFINITIONS.forEach(asset => {
      assets[asset.id] = {
        id: asset.id,
        name: asset.name,
        type: asset.type,
        healthScore: 96,
        status: 'OPTIMAL',
        rulDays: 450,
        confidenceInterval: [420, 480],
        rulP10Days: 395,
        rulP50Days: 450,
        rulP90Days: 488,
        failureMode: 'None (Nominal Base Condition)',
        flowRegime: 'Stratified Wavy Multiphase Flow',
        waterCutPct: 14.2,
        gorScfStb: 1680,
        h2sPartialPressureBar: 0.042,
        micBioCorrosionRisk: 'LOW (< 10² cells/mL SRB)',
        co2CorrosionRateMmYear: 0.04,
        h2sCorrosionRateMmYear: 0.015,
        micCorrosionRateMmYear: 0.005,
        totalCorrosionRateMmYear: 0.06,
        sensorTrustIndexPct: 99.4,
        ptpClockSyncStatus: 'LOCKED (±8ns jitter)',
        edgeCompressionRatio: '128:1 (Wavelet Spectral Reduction)',
        modelDriftPsiScore: 0.024, // Population Stability Index (< 0.10 is stable)
        modelRetrainStatus: 'BASELINE SYNCHRONIZED',
        rlGuardrailStatus: 'ACTIVE (Safe Action Envelope [20, 200] L/h)',
        faultProbabilities: {
          corrosionWallLoss: 2.1,
          waxHydrateBlockage: 1.4,
          tdzFatigueCrack: 3.2,
          sluggingInstability: 4.0,
          microLeakBreach: 0.2
        },
        shapAttributions: [
          { feature: 'Fluid Velocity (v_mix)', shapValue: 0.14, desc: '3.8 m/s' },
          { feature: 'Water Cut (WC)', shapValue: 0.12, desc: '14.2%' },
          { feature: 'Sand Production Rate', shapValue: 0.08, desc: '1.2 PPM' },
          { feature: 'H2S Sour Content', shapValue: 0.05, desc: '0.042 bar' }
        ],
        wallThicknessMm: asset.nominalWallThicknessMm,
        inletPressureBar: asset.designPressureBar * 0.62,
        outletPressureBar: asset.designPressureBar * 0.58,
        differentialPressureBar: asset.designPressureBar * 0.04,
        fluidTempC: asset.designTempC * 0.75,
        ambientSeaTempC: 3.8,
        hydrateEquilibriumTempC: 14.5,
        hydrateMarginDeltaTC: 18.2,
        waxAppearanceTempC: 37.5,
        waxLayerThicknessMm: 0.2,
        massFlowRateKgS: 48.5,
        massDiscrepancyKgS: 0.02,
        leakProbabilityPct: 0.01,
        leakLocationKp: null,
        tdzMicroStrain: 220,
        tdzBendingStressMpa: 85,
        vivVibrationG: 0.04,
        vivHarmonicFreqHz: 0.12,
        fatigueDamageAccumulated: 0.012,
        crackLengthMm: 0.45,
        criticalCrackMm: 8.5,
        megInjectionRateLh: 38,
        dynamicMegSavingsPerDay: 1850,
        piggingLauncherStatus: 'STANDBY',
        pigLocationKp: null,
        inspectionPriority: 'LOW',
        hitlApprovalRequired: false,
        hitlApprovalStatus: 'N/A',
        technicianSOP: 'All sensors healthy. PTP clock sync locked. Maintain 20 Hz edge wavelet streaming.',
        engineerNotes: 'Dynamic PVT phase boundary calibrated for WC=14.2%, GOR=1680. Model drift PSI=0.024.',
        managerImpact: 'Zero production risk exposure. $0 downtime forecasted.'
      };
    });

    return {
      timestamp: new Date().toISOString(),
      scenario: 'NORMAL',
      tick: 0,
      assets,
      activeAlerts: [],
      alertHistory: this.alertHistory,
      escalationLog: this.escalationLog,
      interventionHistory: this.interventionHistory,
      pendingRovAuthorizations: this.pendingRovAuthorizations,
      kpTelemetryProfile: this.generateKpProfile('NORMAL', 0),
      hydrateEnvelopeCurve: this.generateDynamicPvtHydrateEnvelope(14.2, 1680),
      vivSpectrum: this.generateVivSpectrum('NORMAL', 0),
      rainflowHistogram: this.generateRainflowDistribution('NORMAL'),
      cbiCostAnalysis: this.generateCbiEconomics('NORMAL')
    };
  }

  // Dynamic PVT Compositional Hydrate Phase Boundary (updates as GOR and WaterCut change)
  generateDynamicPvtHydrateEnvelope(waterCutPct, gorScfStb) {
    const points = [];
    const pvtShift = (waterCutPct - 10) * 0.12 + (gorScfStb - 1500) * 0.002;
    for (let p = 20; p <= 350; p += 15) {
      const tHyd = 8.9 * Math.log10(p) + 0.018 * p - 7.5 + pvtShift;
      points.push({
        pressureBar: p,
        hydrateTempC: Number(tHyd.toFixed(1)),
        waterCutShiftC: Number(pvtShift.toFixed(2))
      });
    }
    return points;
  }

  generateKpProfile(scenario, tick) {
    const kpPoints = [];
    const totalKp = 12.4;
    const step = 0.5;

    for (let kp = 0; kp <= totalKp; kp += step) {
      const frac = kp / totalKp;
      let temp = 68.0 - frac * 36.0 + Math.sin(kp + tick * 0.1) * 0.5;
      let pressure = 220.0 - frac * 28.0;
      let wallThickness = 24.5 - (kp > 11.5 ? 0.8 : 0.2);
      let waxThickness = temp < 37.5 ? Math.max(0, (37.5 - temp) * 0.08) : 0.05;
      let acousticNoise = 18 + Math.sin(kp * 2) * 2;
      let leakPlume = 0;
      let sensorHealth = 99.2;

      if (scenario === 'HYDRATE_RISK') {
        temp = Math.max(3.8, 42.0 - frac * 38.0);
      } else if (scenario === 'EROSION_WALL_LOSS') {
        if (kp >= 11.0) {
          wallThickness = 17.8 - (kp - 11.0) * 2.2;
        }
      } else if (scenario === 'MICRO_LEAK') {
        if (Math.abs(kp - 4.35) < 0.6) {
          acousticNoise = 88.5;
          leakPlume = 145;
          pressure -= 14.5;
        }
      } else if (scenario === 'WAX_DEPOSITION') {
        if (kp >= 2.5 && kp <= 9.0) {
          waxThickness = 3.4 - Math.abs(kp - 5.5) * 0.35;
          pressure += (waxThickness * 4.2);
        }
      }

      kpPoints.push({
        kp: Number(kp.toFixed(1)),
        pressureBar: Number(pressure.toFixed(1)),
        temperatureC: Number(temp.toFixed(1)),
        wallThicknessMm: Number(wallThickness.toFixed(2)),
        waxThicknessMm: Number(waxThickness.toFixed(2)),
        dasAcousticDb: Number(acousticNoise.toFixed(1)),
        leakPlumePpm: Number(leakPlume.toFixed(1)),
        sensorHealthPct: Number(sensorHealth.toFixed(1)),
        elevationM: Number((-1830 - Math.sin(kp * 0.6) * 45).toFixed(1))
      });
    }

    return kpPoints;
  }

  generateVivSpectrum(scenario, tick) {
    const bins = [];
    const isLockIn = scenario === 'TOUCHDOWN_FATIGUE';
    
    for (let f = 0.05; f <= 2.0; f += 0.05) {
      let amp = 0.008 + Math.random() * 0.004;
      
      if (Math.abs(f - 0.14) < 0.03) {
        amp += 0.045;
      }
      
      if (isLockIn) {
        if (Math.abs(f - 0.38) < 0.04) {
          amp += 0.34 + Math.sin(tick * 0.4) * 0.04;
        }
        if (Math.abs(f - 0.76) < 0.04) {
          amp += 0.12;
        }
      }

      bins.push({
        freqHz: Number(f.toFixed(2)),
        amplitudeG: Number(amp.toFixed(3)),
        isLockInPeak: isLockIn && (Math.abs(f - 0.38) < 0.04 || Math.abs(f - 0.76) < 0.04)
      });
    }
    return bins;
  }

  generateRainflowDistribution(scenario) {
    const isFatigue = scenario === 'TOUCHDOWN_FATIGUE';
    return [
      { stressRangeMpa: '0 - 20', cycles: isFatigue ? 18000 : 42000 },
      { stressRangeMpa: '20 - 40', cycles: isFatigue ? 24000 : 18000 },
      { stressRangeMpa: '40 - 60', cycles: isFatigue ? 19500 : 4200 },
      { stressRangeMpa: '60 - 80', cycles: isFatigue ? 14200 : 850 },
      { stressRangeMpa: '80 - 100', cycles: isFatigue ? 8900 : 120 },
      { stressRangeMpa: '100 - 140', cycles: isFatigue ? 4800 : 15 },
      { stressRangeMpa: '140 - 180', cycles: isFatigue ? 1650 : 0 }
    ];
  }

  generateCbiEconomics(scenario) {
    return {
      scheduledInspectionIntervalMonths: 24,
      conditionBasedInspectionIntervalMonths: 54,
      rovSpreadDayRateUsd: 115000,
      vesselFuelCostPerDayUsd: 22000,
      daysSavedYtd: 28,
      totalCostAvoidanceUsd: 3836000,
      carbonEmissionsMitigatedTons: 640,
      riskReductionPct: 78.4,
      plannedNextCbiTarget: 'SCR-01 Touchdown Zone (KP 2.85) Ultrasonic Phased Array Scan'
    };
  }

  // Human-in-the-Loop (HITL) Authorization Gate for ROV Missions
  requestRovAuthorization(mission) {
    const req = {
      id: `AUTH-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      assetId: mission.assetId,
      targetLocation: mission.location,
      reason: mission.reason,
      costEstimateUsd: mission.costEstimateUsd || 115000,
      status: 'AWAITING_ENGINEER_SIGNOFF',
      approver: null
    };
    this.pendingRovAuthorizations.unshift(req);
    this.notify();
    return req;
  }

  approveRovAuthorization(authId, engineerName) {
    const auth = this.pendingRovAuthorizations.find(a => a.id === authId);
    if (auth) {
      auth.status = 'APPROVED_DISPATCHED';
      auth.approver = engineerName || 'Chief Subsea Integrity Lead';
      this.notify();
    }
  }

  // Bidirectional Model Retraining via Field Ground-Truth Calibration
  logCompletedIntervention(intervention) {
    const record = {
      id: `INT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      assetId: intervention.assetId,
      action: intervention.action,
      findings: intervention.findings,
      technician: intervention.technician || 'Offshore ROV Team A',
      newWallThicknessMm: intervention.newWallThicknessMm || null,
      status: 'CALIBRATED_RETRAINED'
    };

    this.interventionHistory.unshift(record);

    if (this.latestState.assets[intervention.assetId]) {
      const asset = this.latestState.assets[intervention.assetId];
      if (intervention.newWallThicknessMm) {
        asset.wallThicknessMm = Number(intervention.newWallThicknessMm);
      }
      asset.healthScore = Math.min(100, asset.healthScore + 25);
      asset.rulDays = Math.max(asset.rulDays, 410);
      asset.rulP10Days = asset.rulDays - 35;
      asset.rulP90Days = asset.rulDays + 45;
      asset.status = 'OPTIMAL';
      asset.modelDriftPsiScore = 0.012; // Reset drift on ground-truth calibration
      asset.modelRetrainStatus = 'GROUND_TRUTH_CALIBRATED (ROV Survey Synchronized)';
      this.scenario = 'NORMAL';
    }

    this.notify();
    return record;
  }

  triggerEscalationNotification(alert) {
    const escalation = {
      id: `ESC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      alertTitle: alert.title,
      assetId: alert.assetId,
      tier: alert.severity,
      channels: [
        { type: 'SMS (Twilio)', recipient: '+1 (555) 839-2041 [On-Call Lead]', status: 'SENT_DELIVERED' },
        { type: 'Email (SMTP)', recipient: 'subsea-integrity@deepwater-ops.com', status: 'DISPATCHED' }
      ]
    };
    this.escalationLog.unshift(escalation);
    return escalation;
  }

  step() {
    this.tick++;
    const s = this.scenario;
    const now = new Date().toISOString();
    const assets = { ...this.latestState.assets };
    const alerts = [];

    const waveNoise = Math.sin(this.tick * 0.25) * 0.8;

    Object.keys(assets).forEach(key => {
      const asset = { ...assets[key] };
      const isAffected = SIMULATION_SCENARIOS[s].affectedAsset === key;

      if (s === 'NORMAL') {
        asset.status = 'OPTIMAL';
        asset.healthScore = Math.min(100, Math.max(94, 97 + Math.sin(this.tick + key.length) * 2));
        asset.rulDays = Math.round(480 - (this.tick * 0.05));
        asset.rulP10Days = asset.rulDays - 28;
        asset.rulP50Days = asset.rulDays;
        asset.rulP90Days = asset.rulDays + 32;
        asset.flowRegime = 'Stratified Wavy Multiphase Flow';
        asset.modelDriftPsiScore = 0.024;
        asset.modelRetrainStatus = 'BASELINE HEALTHY';
        asset.rlGuardrailStatus = 'ACTIVE (Bounded Rate Limit: ±15 L/h/min)';
        asset.hitlApprovalRequired = false;
        asset.faultProbabilities = {
          corrosionWallLoss: 2.1,
          waxHydrateBlockage: 1.4,
          tdzFatigueCrack: 3.2,
          sluggingInstability: 4.0,
          microLeakBreach: 0.2
        };
        asset.shapAttributions = [
          { feature: 'Fluid Velocity (v_mix)', shapValue: 0.14, desc: '3.8 m/s' },
          { feature: 'Water Cut (WC)', shapValue: 0.12, desc: '14.2%' },
          { feature: 'Sand PPM', shapValue: 0.08, desc: '1.2 PPM' },
          { feature: 'H2S Content', shapValue: 0.05, desc: '0.042 bar' }
        ];
        asset.leakProbabilityPct = 0.02;
        asset.leakLocationKp = null;
        asset.massDiscrepancyKgS = Number((0.02 + Math.random() * 0.03).toFixed(2));
        asset.totalCorrosionRateMmYear = 0.06;
        asset.megInjectionRateLh = 38;
        asset.dynamicMegSavingsPerDay = 1850;
        asset.waxLayerThicknessMm = 0.2;
        asset.tdzMicroStrain = 210 + waveNoise * 15;
        asset.tdzBendingStressMpa = 82 + waveNoise * 4;
        asset.vivVibrationG = 0.04 + Math.random() * 0.01;
        asset.crackLengthMm = 0.45;
        asset.inspectionPriority = 'LOW';
      } 
      else if (s === 'HYDRATE_RISK' && isAffected) {
        asset.status = 'CRITICAL';
        asset.healthScore = 44;
        asset.rulDays = 12;
        asset.rulP10Days = 6;
        asset.rulP50Days = 12;
        asset.rulP90Days = 18;
        asset.failureMode = 'Severe Gas Hydrate Solidification & Line Plugging';
        asset.flowRegime = 'Severe Hydrodynamic Slugging Flow';
        asset.modelDriftPsiScore = 0.142; // Drift detected
        asset.modelRetrainStatus = 'RETRAIN RECOMMENDED (PVT Shift Detected)';
        asset.rlGuardrailStatus = 'GUARDRAIL CLAMPED (Surge to 185 L/h max safe limit)';
        asset.hitlApprovalRequired = true;
        asset.faultProbabilities = {
          corrosionWallLoss: 3.4,
          waxHydrateBlockage: 94.8,
          tdzFatigueCrack: 1.8,
          sluggingInstability: 38.5,
          microLeakBreach: 0.4
        };
        asset.shapAttributions = [
          { feature: 'Fluid Subcooling ΔT', shapValue: 0.68, desc: '-6.7°C Subcooled' },
          { feature: 'Operating Pressure', shapValue: 0.18, desc: '195 bar' },
          { feature: 'Water Cut (WC)', shapValue: 0.10, desc: '28.5% Surge' },
          { feature: 'MEG Dosing Deficit', shapValue: 0.04, desc: 'Pre-Surge 38 L/h' }
        ];
        asset.fluidTempC = 7.8;
        asset.hydrateEquilibriumTempC = 14.5;
        asset.hydrateMarginDeltaTC = -6.7;
        asset.differentialPressureBar = 42.5;
        asset.megInjectionRateLh = 185;
        asset.inspectionPriority = 'URGENT';

        const alertObj = {
          id: `ALT-HYD-${this.tick}`,
          timestamp: now.replace('T', ' ').slice(0, 19),
          tier: 'CRITICAL',
          severity: 'CRITICAL',
          category: 'FLOW_ASSURANCE',
          title: 'DYNAMIC PVT HYDRATE BLOCKAGE RISK',
          message: 'Fluid temperature (7.8°C) is 6.7°C below live PVT hydrate curve (14.5°C). RL agent clamped at 185 L/h safe boundary.',
          action: 'Dynamic Inhibitor Surge & Subsea Trace Heating Activation'
        };
        alerts.push(alertObj);
        if (this.tick % 4 === 1) this.triggerEscalationNotification(alertObj);
      }
      else if (s === 'TOUCHDOWN_FATIGUE' && isAffected) {
        asset.status = 'CRITICAL';
        asset.healthScore = 38;
        asset.rulDays = 42;
        asset.rulP10Days = 26;
        asset.rulP50Days = 42;
        asset.rulP90Days = 58;
        asset.failureMode = 'VIV 2nd Harmonic Modal Lock-in & TDZ Micro-Cracking';
        asset.flowRegime = 'Dynamic Wave & Current Hydrodynamic Loading';
        asset.modelDriftPsiScore = 0.118;
        asset.hitlApprovalRequired = true;
        asset.faultProbabilities = {
          corrosionWallLoss: 8.2,
          waxHydrateBlockage: 1.1,
          tdzFatigueCrack: 96.4,
          sluggingInstability: 12.0,
          microLeakBreach: 4.8
        };
        asset.shapAttributions = [
          { feature: 'VIV Lock-in Acceleration (0.38 Hz)', shapValue: 0.62, desc: '0.38g RMS' },
          { feature: 'Benthic Loop Current', shapValue: 0.22, desc: '1.85 knots' },
          { feature: 'Cyclic Bending Stress Range', shapValue: 0.11, desc: 'Δσ = 160 MPa' },
          { feature: 'Paris da/dN Flaw Depth', shapValue: 0.05, desc: 'a = 2.45 mm' }
        ];
        asset.tdzMicroStrain = 890 + waveNoise * 180;
        asset.tdzBendingStressMpa = 245 + waveNoise * 35;
        asset.vivVibrationG = 0.38 + Math.random() * 0.06;
        asset.vivHarmonicFreqHz = 0.38;
        asset.fatigueDamageAccumulated = 0.084;
        asset.crackLengthMm = 2.45 + (this.tick * 0.02);
        asset.inspectionPriority = 'CRITICAL_DISPATCH';

        const alertObj = {
          id: `ALT-FAT-${this.tick}`,
          timestamp: now.replace('T', ' ').slice(0, 19),
          tier: 'CRITICAL',
          severity: 'CRITICAL',
          category: 'STRUCTURAL_HEALTH',
          title: 'RISER TDZ VIV MODAL LOCK-IN (0.38 Hz)',
          message: 'PTP-synced accelerometers confirm 0.38 Hz lock-in. TDZ stress reached 245 MPa. Paris flaw growth rate accelerated.',
          action: 'Deploy ROV Phased-Array UT to KP 2.85 (Awaiting Engineer Sign-off)'
        };
        alerts.push(alertObj);
        if (this.tick % 4 === 1) this.triggerEscalationNotification(alertObj);
      }
      else if (s === 'EROSION_WALL_LOSS' && isAffected) {
        asset.status = 'CRITICAL';
        asset.healthScore = 32;
        asset.rulDays = 88;
        asset.rulP10Days = 68;
        asset.rulP50Days = 88;
        asset.rulP90Days = 104;
        asset.failureMode = 'Sand Erosion + H2S Sour Pitting Wall Thinning';
        asset.flowRegime = 'High-Velocity Annular Mist Flow (11.8 m/s)';
        asset.hitlApprovalRequired = true;
        asset.faultProbabilities = {
          corrosionWallLoss: 97.1,
          waxHydrateBlockage: 2.3,
          tdzFatigueCrack: 6.4,
          sluggingInstability: 18.2,
          microLeakBreach: 14.5
        };
        asset.shapAttributions = [
          { feature: 'Acoustic Sand Production', shapValue: 0.54, desc: '84.5 PPM' },
          { feature: 'Multiphase Mixture Velocity', shapValue: 0.28, desc: '11.8 m/s' },
          { feature: 'H2S Sour Pitting Rate', shapValue: 0.12, desc: '0.42 mm/yr' },
          { feature: 'CO2 Partial Pressure', shapValue: 0.06, desc: '1.45 bar' }
        ];
        asset.sandProductionPpm = 84.5;
        asset.erosionVelocityMs = 11.8;
        asset.totalCorrosionRateMmYear = 2.85;
        asset.co2CorrosionRateMmYear = 1.85;
        asset.h2sCorrosionRateMmYear = 0.72;
        asset.micCorrosionRateMmYear = 0.28;
        asset.wallThicknessMm = Math.max(16.8, 17.8 - (this.tick * 0.01));
        asset.inspectionPriority = 'HIGH_PRIORITY';

        const alertObj = {
          id: `ALT-ERO-${this.tick}`,
          timestamp: now.replace('T', ' ').slice(0, 19),
          tier: 'CRITICAL',
          severity: 'CRITICAL',
          category: 'WALL_INTEGRITY',
          title: 'ACCELERATED EROSION & H2S PITTING (2.85 mm/yr)',
          message: 'Sand breakthrough (84.5 PPM) at 11.8 m/s annular flow. Wall thickness at 17.8 mm. Bayesian P10 RUL is 68 days.',
          action: 'Throttle Choke & Dispatch ROV Phased Array Tool (HITL Gate Active)'
        };
        alerts.push(alertObj);
        if (this.tick % 4 === 1) this.triggerEscalationNotification(alertObj);
      }
      else if (s === 'MICRO_LEAK' && isAffected) {
        asset.status = 'CRITICAL';
        asset.healthScore = 28;
        asset.rulDays = 2;
        asset.rulP10Days = 1;
        asset.rulP50Days = 2;
        asset.rulP90Days = 4;
        asset.failureMode = 'Flowline Hydrocarbon Containment Breach (Micro-Leak at KP 4.35)';
        asset.flowRegime = 'Unstable Depressurization Slug Flow';
        asset.hitlApprovalRequired = true;
        asset.faultProbabilities = {
          corrosionWallLoss: 22.4,
          waxHydrateBlockage: 0.8,
          tdzFatigueCrack: 11.2,
          sluggingInstability: 5.4,
          microLeakBreach: 98.6
        };
        asset.shapAttributions = [
          { feature: 'DAS Acoustic NPW Energy', shapValue: 0.58, desc: '88.5 dB at KP 4.35' },
          { feature: 'Mass Balance Flow Deficit', shapValue: 0.26, desc: '1.85 kg/s' },
          { feature: 'Optical Methane Plume', shapValue: 0.12, desc: '145 ppm-m' },
          { feature: 'dP/dt Transient Gradient', shapValue: 0.04, desc: '-0.42 bar/s' }
        ];
        asset.leakProbabilityPct = 98.4;
        asset.leakLocationKp = 4.35;
        asset.massDiscrepancyKgS = 1.85;
        asset.sensorStreams.dasAcousticDb = 88.5;
        asset.sensorStreams.opticalMethanePpm = 145.0;
        asset.sensorStreams.outletPressure = 187.6;
        asset.inspectionPriority = 'EMERGENCY_ISOLATION';

        const alertObj = {
          id: `ALT-LEAK-${this.tick}`,
          timestamp: now.replace('T', ' ').slice(0, 19),
          tier: 'CRITICAL',
          severity: 'CRITICAL',
          category: 'LEAK_CONTAINMENT',
          title: 'MICRO-LEAK CONFIRMED AT KP 4.35 km',
          message: 'PTP time-synced DAS acoustic wave localizes breach to KP 4.35. Discrepancy is 1.85 kg/s. Hydrocarbon optical plume confirmed.',
          action: 'Execute Emergency Subsea Isolation ESD-1'
        };
        alerts.push(alertObj);
        if (this.tick % 4 === 1) this.triggerEscalationNotification(alertObj);
      }
      else if (s === 'WAX_DEPOSITION' && isAffected) {
        asset.status = 'WARNING';
        asset.healthScore = 68;
        asset.rulDays = 145;
        asset.rulP10Days = 118;
        asset.rulP50Days = 145;
        asset.rulP90Days = 172;
        asset.failureMode = 'Paraffin Wax Crystal Deposition & Hydraulic Constriction';
        asset.flowRegime = 'Stratified Core-Annular Flow';
        asset.hitlApprovalRequired = false;
        asset.faultProbabilities = {
          corrosionWallLoss: 4.5,
          waxHydrateBlockage: 92.3,
          tdzFatigueCrack: 1.0,
          sluggingInstability: 44.0,
          microLeakBreach: 0.1
        };
        asset.shapAttributions = [
          { feature: 'WAT Subcooling (T < 37.5°C)', shapValue: 0.52, desc: '3.4 mm Wax Layer' },
          { feature: 'Differential Pressure ΔP', shapValue: 0.32, desc: '+28 bar increase' },
          { feature: 'Crude Wax Content (Wax %)', shapValue: 0.16, desc: '8.4 wt%' }
        ];
        asset.waxLayerThicknessMm = 3.4;
        asset.differentialPressureBar = 38.5;
        asset.piggingLauncherStatus = 'DISPATCH_RECOMMENDED';
        asset.inspectionPriority = 'MEDIUM_PIGGING';

        const alertObj = {
          id: `ALT-WAX-${this.tick}`,
          timestamp: now.replace('T', ' ').slice(0, 19),
          tier: 'WARNING',
          severity: 'WARNING',
          category: 'FLOW_ASSURANCE',
          title: 'PARAFFIN WAX DEPOSITION (3.4 mm Layer)',
          message: 'Subcooling below WAT (37.5°C) caused 24% effective ID reduction. Differential pressure increased +28 bar.',
          action: 'Launch Intelligent Cleaning Pig from PLEM-01'
        };
        alerts.push(alertObj);
      }

      assets[key] = asset;
    });

    const pfl = assets['PFL-101'] || assets[ASSET_DEFINITIONS[0].id];
    const scr = assets['SCR-01'] || assets[ASSET_DEFINITIONS[0].id];

    this.history.timestamps.push(now.slice(11, 19));
    this.history.inletPressure.push(pfl.inletPressureBar);
    this.history.outletPressure.push(pfl.outletPressureBar);
    this.history.fluidTemp.push(pfl.fluidTempC);
    this.history.ambientTemp.push(pfl.ambientSeaTempC);
    this.history.massFlowIn.push(pfl.massFlowRateKgS);
    this.history.massFlowOut.push(pfl.massFlowRateKgS - pfl.massDiscrepancyKgS);
    this.history.tdzStrain.push(scr.tdzMicroStrain);
    this.history.vivAcceleration.push(scr.vivVibrationG);
    this.history.wallThickness.push(pfl.wallThicknessMm);
    this.history.megDosingRate.push(pfl.megInjectionRateLh);
    this.history.waxThickness.push(pfl.waxLayerThicknessMm);
    this.history.leakProbability.push(pfl.leakProbabilityPct);

    if (this.history.timestamps.length > 30) {
      Object.keys(this.history).forEach(k => this.history[k].shift());
    }

    this.latestState = {
      timestamp: now,
      scenario: s,
      tick: this.tick,
      assets,
      activeAlerts: alerts,
      alertHistory: this.alertHistory,
      escalationLog: this.escalationLog,
      interventionHistory: this.interventionHistory,
      pendingRovAuthorizations: this.pendingRovAuthorizations,
      kpTelemetryProfile: this.generateKpProfile(s, this.tick),
      hydrateEnvelopeCurve: this.generateDynamicPvtHydrateEnvelope(pfl.waterCutPct || 14.2, pfl.gorScfStb || 1680),
      vivSpectrum: this.generateVivSpectrum(s, this.tick),
      rainflowHistogram: this.generateRainflowDistribution(s),
      cbiCostAnalysis: this.generateCbiEconomics(s)
    };

    this.notify();
  }

  setScenario(scenarioKey) {
    if (SIMULATION_SCENARIOS[scenarioKey]) {
      this.scenario = scenarioKey;
      this.step();
    }
  }

  getLatestData() {
    return this.latestState;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.latestState);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l(this.latestState));
  }
}

export const telemetryEngine = new TelemetryEngine();
