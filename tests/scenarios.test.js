// Characterization Tests for SubseaGuard Simulation Scenarios & State Engine
// Validates anomaly injection, alert tiering, affected assets, and HITL governance

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  telemetryEngine,
  SIMULATION_SCENARIOS,
  ASSET_DEFINITIONS
} from '../src/services/telemetryEngine.js';

test('Scenarios - Schema Completeness & Teachable Moment Metadata', () => {
  const expectedScenarios = [
    'NORMAL',
    'HYDRATE_RISK',
    'TOUCHDOWN_FATIGUE',
    'EROSION_WALL_LOSS',
    'MICRO_LEAK',
    'WAX_DEPOSITION'
  ];

  expectedScenarios.forEach((key) => {
    const scn = SIMULATION_SCENARIOS[key];
    assert.ok(scn, `Scenario ${key} must exist in SIMULATION_SCENARIOS`);
    assert.ok(scn.name, `Scenario ${key} must have a name`);
    assert.ok(scn.severity, `Scenario ${key} must specify severity`);
    assert.ok(scn.affectedAsset, `Scenario ${key} must specify affectedAsset`);

    // Verify teachable moment explanation structure
    assert.ok(scn.teachableExplanation, `Scenario ${key} must have teachableExplanation`);
    assert.ok(scn.teachableExplanation.whyFlagged, `Scenario ${key} must explain whyFlagged`);
    assert.ok(Array.isArray(scn.teachableExplanation.thresholdCrossings), `Scenario ${key} must list thresholdCrossings`);
    assert.ok(scn.teachableExplanation.rulPosteriorShift, `Scenario ${key} must describe rulPosteriorShift`);
    assert.ok(scn.teachableExplanation.governingPhysics, `Scenario ${key} must specify governingPhysics`);
    assert.ok(scn.teachableExplanation.governingPhysics.equation, `Scenario ${key} must include governing equation`);
  });
});

test('Scenarios - NORMAL Baseline Execution', () => {
  telemetryEngine.resetSimulation();
  telemetryEngine.setScenario('NORMAL');
  const data = telemetryEngine.getLatestData();

  assert.equal(data.scenario, 'NORMAL');
  const pfl = data.assets['PFL-101'];
  assert.equal(pfl.status, 'OPTIMAL');
  assert.ok(pfl.rulDays >= 400, 'Baseline RUL should exceed 400 days');
  assert.equal(pfl.flowRegime, 'Stratified Wavy Multiphase Flow');
  assert.equal(data.activeAlerts.length, 0, 'Normal state should have zero active alerts');
});

test('Scenarios - TOUCHDOWN_FATIGUE Computes Paris LEFM on SCR-01', () => {
  telemetryEngine.resetSimulation();
  telemetryEngine.setScenario('TOUCHDOWN_FATIGUE');
  const data = telemetryEngine.getLatestData();

  assert.equal(data.scenario, 'TOUCHDOWN_FATIGUE');
  const scr = data.assets['SCR-01'];
  assert.equal(scr.status, 'CRITICAL');
  assert.ok(scr.parisLawComputed, 'Paris law must be genuinely computed');
  assert.ok(scr.crackLengthMm >= 2.45, `Crack depth should propagate past 2.45mm, current: ${scr.crackLengthMm}`);
  assert.ok(scr.rulDays < 100, `RUL should be reduced under lock-in fatigue, current: ${scr.rulDays}`);
  assert.ok(scr.rulP10Days <= scr.rulP50Days, 'P10 conservative bound must be <= P50');

  // Verify alert creation
  const fatigueAlert = data.activeAlerts.find(a => a.category === 'STRUCTURAL_HEALTH');
  assert.ok(fatigueAlert, 'Structural health fatigue alert must be generated');
  assert.equal(fatigueAlert.assetId, 'SCR-01');
  assert.equal(fatigueAlert.severity, 'CRITICAL');
});

test('Scenarios - HYDRATE_RISK Triggers Thermodynamic Subcooling Alert', () => {
  telemetryEngine.resetSimulation();
  telemetryEngine.setScenario('HYDRATE_RISK');
  const data = telemetryEngine.getLatestData();

  const pfl = data.assets['PFL-101'];
  assert.equal(pfl.status, 'CRITICAL');
  assert.ok(pfl.hydrateMarginDeltaTC < 0, `Subcooling margin must be negative in hydrate zone: ${pfl.hydrateMarginDeltaTC}`);
  assert.equal(pfl.megInjectionRateLh, 185, 'MEG rate must surge to clamped guardrail limit');

  const hydAlert = data.activeAlerts.find(a => a.category === 'FLOW_ASSURANCE');
  assert.ok(hydAlert, 'Flow assurance hydrate alert must be generated');
  assert.equal(hydAlert.assetId, 'PFL-101');
});

test('Scenarios - MICRO_LEAK Triggers NPW Acoustic Localization at KP 4.35', () => {
  telemetryEngine.resetSimulation();
  telemetryEngine.setScenario('MICRO_LEAK');
  const data = telemetryEngine.getLatestData();

  const pfl = data.assets['PFL-101'];
  assert.equal(pfl.status, 'CRITICAL');
  assert.equal(pfl.leakLocationKp, 4.35, 'Leak must be localized at KP 4.35');
  assert.ok(pfl.leakProbabilityPct > 90, 'Leak probability must spike > 90%');

  const leakAlert = data.activeAlerts.find(a => a.category === 'LEAK_CONTAINMENT');
  assert.ok(leakAlert, 'Leak containment alert must be generated');
  assert.equal(leakAlert.kp, 4.35);
});

test('HITL Governance - Alert Acknowledgment & Mission Authorization', () => {
  telemetryEngine.resetSimulation();
  telemetryEngine.setScenario('TOUCHDOWN_FATIGUE');
  let data = telemetryEngine.getLatestData();

  assert.ok(data.activeAlerts.length > 0, 'Alerts should exist');
  const alertId = data.activeAlerts[0].id;

  // Test acknowledging alert
  telemetryEngine.acknowledgeAlert(alertId, 'Lead Engineer Smithson', 'Observed under control');
  data = telemetryEngine.getLatestData();
  const acked = data.activeAlerts.find(a => a.id === alertId);
  assert.ok(acked.acknowledged, 'Alert must be marked acknowledged');
  assert.equal(acked.acknowledgedBy, 'Lead Engineer Smithson');

  // Test mission authorization
  const auth = telemetryEngine.authorizeMission({
    missionId: 'SCR-01',
    missionTitle: 'ROV Phased Array Inspection',
    engineerName: 'Lead Engineer Smithson',
    reason: 'Validate 0.38 Hz lock-in fatigue crack'
  });

  assert.ok(auth.id.startsWith('AUTH-2026-'), 'Auth ID must be structured');
  assert.equal(auth.status, 'APPROVED & DISPATCHED');
  assert.ok(auth.hash.startsWith('0x'), 'Auth must have cryptographic audit hash');
  
  data = telemetryEngine.getLatestData();
  assert.ok(data.hitlAuditLog.some(entry => entry.id === auth.id), 'Audit log must include new authorization');
});
