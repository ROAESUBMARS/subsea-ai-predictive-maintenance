# SubseaGuard AI — Engineering Walkthrough (Phases 2, 3 & 4)

## Overview & Executive Summary

**SubseaGuard AI** is a physics-informed industrial digital twin and predictive maintenance platform engineered for deepwater subsea production infrastructure (Flowlines and Steel Catenary Risers at **-1,850 meters depth**). 

This walkthrough documents the end-to-end implementation across **Phase 2 (Control Room Experience)**, **Phase 3 (Engineering Visibility & Methodology)**, and **Phase 4 (Computed Physics, Persistence, ISO 14224 Export, PWA, CI/CD & Characterization Tests)**.

---

## Phase 2 & 3: Making the Engineering Visible

### 1. Interactive Methodology Whitepaper ([METHODOLOGY.md](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/METHODOLOGY.md) & [src/components/MethodologyView.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/MethodologyView.jsx))
- **Dedicated Route `/methodology`:** Integrated directly into navigation with a `Whitepaper` badge.
- **First-Principles Equations & Mathematical Formulations:**
  - **Paris-Erdogan Law:** $\frac{da}{dN} = C(\Delta K)^m$ with Newman-Raju geometry factor ($Y=1.12$).
  - **Dynamic Sloan Clathrate Hydrate Phase Boundary:** $T_{\text{hyd}}(P) = 8.9\log_{10}(P) + 0.018P - 7.5 + \Delta T_{\text{PVT}}(\text{WC}, \text{GOR})$.
  - **Negative Pressure Wave (NPW) Speed-of-Sound Localization:** $X_{\text{leak}} = \frac{L + a \cdot \Delta t}{2}$ with IEEE 1588 PTP nanosecond sync.
  - **Rainflow Counting:** ASTM E1049-85 stress reversal binning with Palmgren-Miner cumulative fatigue damage $D = \sum \frac{n_i}{N_i}$.
- **Interactive Methodology Charts:**
  - Live thermodynamic hydrate formation curve showing nominal operating points, MEG suppression, and hydrate risk boundaries.
  - Bayesian RUL fan chart depicting $P_{10}$ (conservative), $P_{50}$ (median), and $P_{90}$ (optimistic) confidence envelopes.
  - Paris flaw propagation comparison: nominal wave fatigue vs. VIV 0.38 Hz modal lock-in.
- **End-to-End Mermaid Architecture Pipeline:** Sensor Ingestion $\rightarrow$ Subsea Edge Wavelet Compression (128:1) $\rightarrow$ Real-Time Physics Models $\rightarrow$ Bayesian UQ $\rightarrow$ HITL Gate $\rightarrow$ Autonomous ROV Dispatch.

### 2. Teachable Moments Annotation Panel ([src/components/ScenarioAnnotationPanel.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/ScenarioAnnotationPanel.jsx))
- Dockable panel answering: **"Why Did the Model Flag This?"**
- Dynamic threshold crossing table (measured value vs. safe API 17D / DNV limit, deviation %).
- Bayesian posterior shift analysis explaining prior design life vs. posterior $P_{10}/P_{50}/P_{90}$ degradation.
- Governing physics breakdown with LaTeX formulas and real-time SHAP feature attributions.

### 3. Timeline Scrubber & Speed Controls HUD ([src/components/TimeControlsHUD.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/TimeControlsHUD.jsx))
- Floating industrial time control bar docked at the bottom of the console.
- **Simulation Speed Toggles:** `0.5x`, `1x`, `2x`, `5x`, `10x`, plus Play / Pause.
- **Historical Scrubbing:** Rewind up to 80 simulation snapshots to review anomaly onset, peak excursion, and post-intervention stabilization.
- **Quick Jump Points:** Instant triggers for Normal Baseline, Hydrate Risk, VIV Riser Lock-in, Choke Erosion, Micro-Leak Breach, and Wax Deposition.

### 4. 90-Second Guided Tour Modal ([src/components/GuidedTourModal.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/GuidedTourModal.jsx))
- Automated executive walkthrough designed for recruiter and stakeholder demonstrations.
- Guides through 3 key subsea operational anomalies in sequence:
  1. **Flow Assurance:** Dynamic PVT Hydrate Blockage & Safe Clamped MEG Dosing.
  2. **Structural Health:** Steel Catenary Riser 0.38 Hz VIV Modal Lock-in & Paris LEFM Crack Growth.
  3. **Containment Integrity:** Nanosecond Acoustic Wave Micro-Leak Localization at KP 4.35.
- Features automatic countdown timer, pause/resume, and manual step-through buttons.

---

## Phase 4: High-Leverage Engineering Hardening

### 1. Genuine Computed Model: Paris-Erdogan LEFM Solver ([src/services/fractureMechanics.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/services/fractureMechanics.js))
- Moves Remaining Useful Life (RUL) from scripted figures to **genuinely computed numerical integration** in JavaScript.
- **BS 7910 / DNV-RP-F108 Material Constants for Welded Marine Steel with CP:**
  - $C_{\text{P50}} = 5.21 \times 10^{-13}\ \text{mm/cycle}\cdot(\text{MPa}\sqrt{\text{m}})^{-3}$
  - $C_{\text{P10}} = 7.19 \times 10^{-13}$ (Conservative 90% upper bound)
  - $C_{\text{P90}} = 3.77 \times 10^{-13}$ (Optimistic 10% lower bound)
  - $m = 3.00$, $Y = 1.12$, $a_{\text{crit}} = 8.50\ \text{mm}$, $\Delta K_{\text{th}} = 2.00\ \text{MPa}\sqrt{\text{m}}$
- **Analytical Closed-Form Evaluation ($m = 3.0$):**
  $$N_{\text{fail}} = \frac{2}{C (Y \Delta\sigma \sqrt{\pi})^3} \left[ \frac{1}{\sqrt{a}} - \frac{1}{\sqrt{a_{\text{crit}}}} \right], \quad \text{RUL}_{\text{days}} = \frac{N_{\text{fail}}}{f \cdot 86,400}$$
- **Time-Step Numerical Crack Propagation (`stepCrackPropagation`):**
  $$\Delta a = C (\Delta K)^m \cdot \Delta n$$
  Evaluated on every simulation step for `SCR-01` during 0.38 Hz lock-in ($\Delta\sigma \approx 160\ \text{MPa}$) and baseline ($\Delta\sigma \approx 42\ \text{MPa}$ at $0.14\ \text{Hz}$).

### 2. State Persistence via LocalStorage ([src/services/telemetryEngine.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/services/telemetryEngine.js))
- State survives page reloads, browser restarts, and tab closures:
  - `subseaguard_hitl_audit_log`: Authenticated ROV mission sign-offs with cryptographic audit hashes.
  - `subseaguard_pending_auth`: Staged ROV dispatches awaiting engineer authorization.
  - `subseaguard_interventions`: Field calibration records (UT wall scans, ROV visual surveys).
  - `subseaguard_ack_alerts` & `subseaguard_alert_owners`: Control room alert acknowledgment tracking.
- Added `clearPersistedState()` for resetting to pristine factory conditions when needed.

### 3. Real ISO 14224:2016 JSON Audit Dossier Export ([src/components/ReportGeneratorModal.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/ReportGeneratorModal.jsx))
- **"Download ISO 14224 JSON"** button triggers an actual browser file download (`SubseaGuard_ISO14224_Audit_Dossier_[date].json`).
- Structures full ISO 14224:2016 equipment taxonomy (Levels 1–5: Industry, Business, Installation, Plant, Equipment Units).
- Includes real-time computed fracture mechanics parameters ($\Delta K$, $da/dN$, $a$, $a_{\text{crit}}$, $P_{10}/P_{50}/P_{90}$ RUL), failure mode codes (e.g. `FAT-VIV-02`, `HYD-PLUG-01`), SHA-256 tamper-proof audit proof, and CBI cost savings ($3.84M YTD).
- Preserved existing PDF / Print exporter with formatted styles.

### 4. Offline Progressive Web App (PWA) ([public/manifest.json](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/manifest.json) & [public/sw.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/sw.js))
- Configured Web App Manifest with deepwater cyan palette, standalone display mode, and SVG icons.
- Built-in Service Worker implements stale-while-revalidate precaching and offline navigation fallback.
- Enables demonstration in bad-WiFi interview rooms, conference centers, or offshore vessels without network dropout.
- Registered in both landing page ([index.html](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/index.html)) and operational console ([app/index.html](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/app/index.html)).

### 5. Automated Characterization & Physics Test Suites ([tests/physics.test.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/tests/physics.test.js) & [tests/scenarios.test.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/tests/scenarios.test.js))
- Built using Node.js' native test runner (`node --test`), zero extra dependencies.
- **Physics Suite (6 tests):**
  - Paris material constant conformity (BS 7910).
  - Stress Intensity Factor Range ($\Delta K = Y \Delta\sigma \sqrt{\pi a}$).
  - Analytical Paris closed-form integral ($m = 3.0$).
  - Bayesian Uncertainty Quantification ($P_{10} \le P_{50} \le P_{90}$).
  - Monotonic step crack propagation integration.
  - Dynamic PVT hydrate boundary shift with pressure and water cut.
- **Scenarios Suite (6 tests):**
  - Scenario schema and teachable moment metadata completeness.
  - Normal baseline operational state verification.
  - Touchdown fatigue lock-in and Paris LEFM crack integration on `SCR-01`.
  - Hydrate subcooling $\Delta T$ margin and MEG surge alert on `PFL-101`.
  - Micro-leak acoustic wave triangulation at KP 4.35.
  - Human-in-the-Loop alert acknowledgment and cryptographic mission authorization.
- **Execution Result:** `12 passed, 0 failed` in 256ms.

### 6. GitHub Actions Continuous Integration (CI) ([.github/workflows/ci.yml](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/.github/workflows/ci.yml))
- Matrix build running on `ubuntu-latest` across Node.js `20.x` and `22.x` on every push and PR:
  1. `npm ci`
  2. `npm run lint` (Oxlint with 0 errors)
  3. `npm test` (12 characterization tests)
  4. `npm run build` (Vite production bundle verification)
- Embedded CI build badge, PWA Offline badge, and ISO 14224 compliance badge into [README.md](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/README.md).

### 7. Technical LinkedIn Article ([LINKEDIN_ARTICLE.md](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/LINKEDIN_ARTICLE.md))
- Complete, publication-ready engineering article: *"I Built a Physics-Informed Digital Twin for Deepwater Subsea Equipment — Here's How It Works"*.
- Explains the deepwater environment (-1,850 m, 345 bar, $180k/day vessel rates), why pure ML fails offshore, mathematical derivations of the 4-stage pipeline, Bayesian UQ, and links to the live console.

---

## Verification & Build Summary

| Command | Status | Result / Metrics |
| :--- | :---: | :--- |
| `npm run lint` | **PASS** | 0 errors across 38 files |
| `npm test` | **PASS** | 12/12 characterization & physics tests passing (256ms) |
| `npm run build` | **PASS** | Complete production bundle built in 16.7s, code-split into optimized chunks |
