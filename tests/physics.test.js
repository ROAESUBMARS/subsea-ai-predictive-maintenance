// Characterization & Unit Tests for SubseaGuard Physics Models
// Validates Linear Elastic Fracture Mechanics (LEFM), Paris-Erdogan Numerical Integration,
// and Dynamic PVT Hydrate Phase Boundaries using Node.js built-in test runner

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PARIS_CONSTANTS,
  computeDeltaK,
  computeRemainingCycles,
  computeRulDays,
  computeBayesianRul,
  stepCrackPropagation
} from '../src/services/fractureMechanics.js';
import {
  telemetryEngine,
  getHydrateEnvelopeSampleData,
  getRulFanChartSampleData,
  getParisCrackSampleData
} from '../src/services/telemetryEngine.js';

test('Physics - Paris Constants Conformity', () => {
  assert.equal(PARIS_CONSTANTS.m, 3.0, 'Paris exponent m must be 3.0 for Stage II marine welded steel');
  assert.equal(PARIS_CONSTANTS.a_crit, 8.5, 'Critical crack depth must match API 579 limit (8.5mm)');
  assert.equal(PARIS_CONSTANTS.deltaK_th, 2.0, 'Threshold stress intensity factor range must be 2.0 MPa√m');
  assert.ok(PARIS_CONSTANTS.C_P10 > PARIS_CONSTANTS.C_P50, 'P10 constant (conservative faster growth) must exceed P50');
  assert.ok(PARIS_CONSTANTS.C_P50 > PARIS_CONSTANTS.C_P90, 'P50 constant must exceed P90 constant');
});

test('Physics - Stress Intensity Factor Range ΔK', () => {
  // Test ΔK = Y · Δσ · √(π · a)
  // For a = 1.0 mm (0.001 m), Δσ = 100 MPa, Y = 1.12:
  // ΔK = 1.12 * 100 * √(π * 0.001) ≈ 1.12 * 100 * 0.05605 ≈ 6.277 MPa√m
  const deltaK = computeDeltaK(100, 1.0);
  assert.ok(deltaK > 6.2 && deltaK < 6.35, `Expected ΔK ≈ 6.28, received ${deltaK}`);

  // When crack is 0 or negative, ΔK must be 0
  assert.equal(computeDeltaK(100, 0), 0);
  assert.equal(computeDeltaK(0, 2.5), 0);
});

test('Physics - Analytical Paris Closed-Form Integral (m = 3.0)', () => {
  const crackA0 = 1.0;
  const deltaSigma = 120;
  
  const cyclesP50 = computeRemainingCycles(crackA0, deltaSigma, PARIS_CONSTANTS.C_P50);
  const cyclesP10 = computeRemainingCycles(crackA0, deltaSigma, PARIS_CONSTANTS.C_P10);
  const cyclesP90 = computeRemainingCycles(crackA0, deltaSigma, PARIS_CONSTANTS.C_P90);

  assert.ok(cyclesP50 > 0, 'Remaining cycles must be positive');
  assert.ok(cyclesP10 < cyclesP50, 'Conservative P10 must yield fewer remaining cycles than median P50');
  assert.ok(cyclesP90 > cyclesP50, 'Optimistic P90 must yield more cycles than median P50');

  // If crack reaches critical depth (a >= a_crit), remaining cycles must be 0
  const cyclesAtCrit = computeRemainingCycles(PARIS_CONSTANTS.a_crit, deltaSigma);
  assert.equal(cyclesAtCrit, 0, 'Cycles at critical depth must be 0');
});

test('Physics - Bayesian Uncertainty Quantification (P10 / P50 / P90)', () => {
  const crackDepthMm = 2.45;
  const deltaSigma = 160;
  const dominantFreqHz = 0.38;

  const result = computeBayesianRul(crackDepthMm, deltaSigma, dominantFreqHz);
  
  assert.ok(result.rulP10Days > 0, 'P10 RUL days must be positive');
  assert.ok(result.rulP10Days <= result.rulP50Days, 'P10 must be <= P50');
  assert.ok(result.rulP50Days <= result.rulP90Days, 'P50 must be <= P90');
  assert.ok(result.deltaK > PARIS_CONSTANTS.deltaK_th, 'ΔK under 160 MPa must exceed threshold');
  assert.ok(result.growthRateMmPerCycle > 0, 'Crack growth rate da/dN must be positive');
});

test('Physics - Step Crack Propagation Integration', () => {
  const initialCrack = 2.0;
  const deltaSigma = 160;
  const dominantFreqHz = 0.38;
  const dtSeconds = 1.5;

  const step = stepCrackPropagation(initialCrack, deltaSigma, dominantFreqHz, dtSeconds);

  assert.ok(step.newCrackMm >= initialCrack, 'Crack propagation must be monotonic (new >= initial)');
  assert.ok(step.deltaAMm >= 0, 'Incremental crack growth da must be non-negative');
  assert.ok(step.newCrackMm <= PARIS_CONSTANTS.a_crit, 'Crack must not exceed critical boundary');
});

test('Physics - Dynamic PVT Hydrate Phase Boundary Calculation', () => {
  const envelope = telemetryEngine.generateDynamicPvtHydrateEnvelope(14.2, 1680);
  assert.ok(envelope.length > 10, 'Envelope should generate multiple pressure points');

  // Hydrate dissociation temperature must increase monotonically with pressure
  for (let i = 1; i < envelope.length; i++) {
    assert.ok(
      envelope[i].hydrateTempC >= envelope[i - 1].hydrateTempC,
      `Hydrate temperature must rise with pressure: ${envelope[i].hydrateTempC} >= ${envelope[i - 1].hydrateTempC}`
    );
  }

  // Higher water cut must shift equilibrium boundary higher (wider hydrate formation zone)
  const baseline = telemetryEngine.generateDynamicPvtHydrateEnvelope(10.0, 1500);
  const sourSurge = telemetryEngine.generateDynamicPvtHydrateEnvelope(28.5, 2200);
  assert.ok(
    sourSurge[5].hydrateTempC > baseline[5].hydrateTempC,
    'Higher water cut & GOR must shift hydrate boundary higher (elevated risk)'
  );
});
