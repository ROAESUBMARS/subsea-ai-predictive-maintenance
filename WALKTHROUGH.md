# SubseaGuard AI — Master Engineering Walkthrough (Phases 1, 2, 3 & 4)

## Executive Summary & System Overview

**SubseaGuard AI** is an industrial-grade digital twin and predictive maintenance platform engineered for deepwater subsea production infrastructure (Flowlines and Steel Catenary Risers at **-1,850 meters depth**). 

The platform bridges the critical gap between academic machine learning and offshore engineering reality: generic black-box AI fails in deepwater environments where catastrophic failures carry catastrophic environmental consequences ($1.8M+/day blowout liability) and work-class ROV spreads cost **$95,000–$135,000/day**. SubseaGuard AI embeds first-principles fracture mechanics (Paris-Erdogan LEFM), multiphase thermodynamics (dynamic clathrate hydrate phase boundary), negative pressure wave acoustics (IEEE 1588 PTP), and Bayesian Uncertainty Quantification (UQ) into a real-time, human-in-the-loop operational console.

This master walkthrough documents the full engineering lifecycle across all four phases:
1. **Phase 1: Production Anti-Pattern Elimination & Infrastructure Hardening**
2. **Phase 2: Shareability, Recruiter Experience & Operational Accessibility (WCAG 2.1 AA/AAA)**
3. **Phase 3: Physics & Engineering Transparency (Methodology Whitepaper, Teachable Moments, Timeline HUD & Guided Tour)**
4. **Phase 4: High-Leverage Engineering Hardening (Numerical LEFM Solver, State Persistence, ISO 14224 Export, Offline PWA & Automated Physics Test Suites)**

---

## Phase 1: Production Anti-Pattern Elimination

### 1.1 Replace Tailwind CDN with Ahead-Of-Time (AOT) Build
- **Problem**: The prototype relied on runtime `<script src="https://cdn.tailwindcss.com"></script>` with an inline script configuration. This injected an unminified ~110 KB runtime compiler, created layout shift (FOUC), and prevented the use of strict Content Security Policies.
- **Solution**:
  - Installed `tailwindcss@^3.4.19`, `postcss@^8.5.28`, and `autoprefixer@^10.6.1` as devDependencies.
  - Authored modern ES module config [`tailwind.config.js`](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/tailwind.config.js) scanning `./index.html`, `./app/**/*.html`, and `./src/**/*.{js,ts,jsx,tsx}`.
  - Implemented typography stacks: `heading` (Sora), `sans` (DM Sans), and `mono` (JetBrains Mono).
  - Ported design tokens for `surface` (`base`, `card`, `raised`) and `status` (`critical`, `warning`, `nominal`, `offline`).
  - Integrated `@tailwind base; @tailwind components; @tailwind utilities;` in [`src/index.css`](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/index.css).
  - Production compiled CSS is minified down to ~57 kB with zero runtime JIT overhead.

### 1.2 Enterprise Security Headers via Edge Configuration ([vercel.json](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/vercel.json))
Injected production security headers across all routes (`/(.*)`):
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options`: `DENY` (prevents clickjacking attacks)
- `X-Content-Type-Options`: `nosniff` (mitigates MIME-type confusion attacks)
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=()` (restricts browser device access)
- `Content-Security-Policy`: Restricts scripts, styles, and font origins to `'self'`, Google Fonts, and secure data URIs.

### 1.3 High-Resolution 1200×630 Open Graph Social Share Card
- Designed and rendered [`public/og.png`](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/og.png) at exactly **1200 × 630 px**.
- Features SubseaGuard AI branding, glowing subsea beacon, category badges (*Industrial Digital Twin & Predictive Maintenance*), deepwater bathymetric indicators, framed live dashboard view with real telemetry charts, and domain watermark.
- Injected absolute Open Graph (`og:image`, `og:image:width`, `og:image:height`) and Twitter card (`twitter:card`, `twitter:image`) meta tags into both `index.html` and `app/index.html`.

### 1.4 Real Infrastructure Files & 404 Route Handling
- **Real Robots File ([public/robots.txt](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/robots.txt))**: Allows universal crawler indexing and declares canonical sitemap.
- **Real Sitemap ([public/sitemap.xml](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/sitemap.xml))**: Indexes canonical endpoints (`https://subseaguard.dev/` and `https://subseaguard.dev/methodology`).
- **Custom 404 Component ([src/components/NotFound.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/NotFound.jsx))**:
  - Subsea glassmorphic design featuring `404 // TELEMETRY LINK LOSS` status badge.
  - One-click **Return to Control Room Dashboard** primary button plus direct jump shortcuts to 3D Digital Twin and Active Alerts.

### 1.5 Custom Branded Domain Configuration (`subseaguard.dev`)
- Synchronized canonical domain `subseaguard.dev` across meta tags, sitemap, edge configuration, and social share card.
- Configured Vercel DNS instructions for apex `A` record (`76.76.21.21`) and `CNAME` delegation (`cname.vercel-dns.com`).

---

## Phase 2: Shareability, Recruiter Experience & Operational Accessibility

### 2.1 Prerendered Static Front Door & Multi-Page Vite Split
- Architectural problem: Serving the heavy React console at `/` forced recruiters, mobile visitors, and search crawlers to download and execute full WebGL/Chart.js bundles before seeing what the project was.
- Solution: Separated public front door from the operational console using Vite's native multi-page rollup capabilities:
  - **Root (`/`)**: Static pre-rendered landing page at [`index.html`](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/index.html) requiring zero JavaScript for instant display, social scrapers, and mobile evaluation.
  - **Console (`/app/`)**: Full React 18 operational digital twin console at [`app/index.html`](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/app/index.html).

### 2.2 Dedicated Recruiter & Portfolio Landing Screen
Engineered the landing page specifically for technical recruiters, hiring managers, and portfolio evaluation:
1. **Hero**: Highlights SubseaGuard AI as a deepwater digital twin with physics-informed predictive maintenance. Dual call-to-actions: **Launch Live Demo** (`/app/`) and **Read the Methodology** (`#methodology`).
2. **Prominent Simulation Disclosure**: Clear statement that all telemetry is synthetic, generated by continuous physics models: Vortex-Induced Vibration (VIV), PVT hydrate thermodynamic equilibrium, and Paris-Erdogan fatigue crack growth. Live field assets remain untouched.
3. **Three Core Recruiter Cards**:
   - **What It Monitors**: Flowlines (PFL-101), steel catenary risers (SCR-01), manifolds (SM-01), multiphase pumps (MP-01). 20 Hz DAS distributed acoustic fiber, ultrasonic wall thickness, pressure, temperature, top-tension load cells.
   - **How It Predicts**: Remaining Useful Life (RUL) with Bayesian Uncertainty Quantification (UQ). Weibull hazard rate modeling with P10 / P50 / P90 confidence bounds, hydrate $\Delta T$ margin, Paris-Erdogan crack propagation.
   - **What It Triggers**: Human-In-The-Loop (HITL) Gated Autonomous ROV Dispatch. Automated ISO 14224 work orders, 3D waypoint dive trajectory planning, mandatory engineering sign-off prior to mobilization.
4. **Methodology Deep-Dive**: Mathematical formulations for acoustic negative pressure wave triangulation, thermodynamic hydrate subcooling boundary, Paris-Erdogan crack growth, and Condition-Based Inspection ROI (-68% OPEX).
5. **Technical Attribution**: Architect Oluwatobiloba Smithson (Subsea Integrity & AI Systems Engineer).

### 2.3 Operational Control Room Accessibility (WCAG 2.1 AA/AAA)
High-stress offshore control room consoles require rapid visual scanning, reliable contrast, and complete keyboard/screen reader navigability:
1. **High-Contrast Micro-Typography**:
   - Micro-labels under 14px in dark consoles often fail low-vision readability.
   - Re-mapped `--text-secondary` to `#cbd5e1` (slate-300, **8.2:1 contrast ratio**) and `--text-muted` to `#94a3b8` (slate-400).
   - Injected global `.text-slate-400 { color: #cbd5e1 !important; }` override and re-mapped Tailwind palette `slate: { 400: '#cbd5e1', 500: '#94a3b8' }`.
2. **Screen-Reader Icon-Only Button Labeling**:
   - Added contextual `aria-label` attributes to every button without visible text (playback toggles, sound synthesizer, spatial location filters, dialog closers, alert action toolbars).
3. **WAI-ARIA Standard Patterns**:
   - **Role Persona Switcher**: Wrapped in `role="radiogroup" aria-label="Operator role persona"` with each button bearing `role="radio"` and `aria-checked`.
   - **Stage Ribbon Tabs**: Standard tablist pattern with `role="tablist"`, `role="tab"`, `id="tab-{id}"`, `aria-selected`, `aria-controls="panel-{id}"`, and matching `<section role="tabpanel" id="panel-{id}" aria-labelledby="tab-{id}">`.
   - **Custom Diagnostics Dropdown**: WAI-ARIA menu pattern with `aria-haspopup="listbox"`, `aria-expanded`, `role="listbox"`, and `role="option"`.
   - **Modals & Overlays**: Wrapped in `role="dialog"`, `aria-modal="true"`, and linked `aria-labelledby`.
4. **Prefers-Reduced-Motion Support**:
   - Heavy pulsation (`animate-ping`, `animate-pulse`, `animate-spin`) can trigger vestibular discomfort. Added `@media (prefers-reduced-motion: reduce)` in `src/index.css` disabling all decorative animations and clamping transitions.

### 2.4 Simulated Personas & Professional Engineering Designations
- In the United States and international jurisdictions, "PE" (Professional Engineer) is a legally protected title and credential.
- Sanitized all synthetic demo personas across `telemetryEngine.js`, `IndustrialControlRoomDashboard.jsx`, and `ConditionBasedInspectionROI.jsx` from `O. Smithson, PE` to `O. Smithson (Simulated) — Lead Subsea Integrity, Synthetic Demo`.
- Verified zero remaining instances of `\bPE\b` across project files.

### 2.5 "Launch Live Demo" Multi-Page Routing Fix
- In multi-page Vite applications, `/app` without a trailing slash caused Vite dev server to treat `/app` as an asset lookup and fall back to root `index.html`.
- Implemented `appRewritePlugin` in [`vite.config.js`](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/vite.config.js) capturing `/app`, `/app/`, and all nested subpaths.
- Updated all navigation links and CTAs in `index.html` to `href="/app/"`.
- Configured edge rewrites in `vercel.json` mapping `/app` and `/app/(.*)` to `/app/index.html`.

---

## Phase 3: Physics & Engineering Transparency

### 3.1 Interactive Methodology Whitepaper ([METHODOLOGY.md](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/METHODOLOGY.md) & [src/components/MethodologyView.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/MethodologyView.jsx))
- **Dedicated Route `/methodology`:** Integrated directly into navigation ribbon with a `Whitepaper` badge.
- **First-Principles Equations & Formulations**:
  - **Paris-Erdogan Law:** $\frac{da}{dN} = C(\Delta K)^m$ with Newman-Raju geometry factor ($Y=1.12$).
  - **Dynamic Sloan Clathrate Hydrate Phase Boundary:** $T_{\text{hyd}}(P) = 8.9\log_{10}(P) + 0.018P - 7.5 + \Delta T_{\text{PVT}}(\text{WC}, \text{GOR})$.
  - **Negative Pressure Wave (NPW) Speed-of-Sound Localization:** $X_{\text{leak}} = \frac{L + a \cdot \Delta t}{2}$ with IEEE 1588 PTP nanosecond sync ($a \approx 1,080\ \text{m/s}$).
  - **Rainflow Counting:** ASTM E1049-85 stress reversal binning with Palmgren-Miner cumulative fatigue damage $D = \sum \frac{n_i}{N_i}$.
- **Interactive Methodology Charts**:
  - Live thermodynamic hydrate formation curve showing nominal operating points, MEG suppression, and hydrate risk boundaries.
  - Bayesian RUL fan chart depicting $P_{10}$ (conservative), $P_{50}$ (median), and $P_{90}$ (optimistic) confidence envelopes.
  - Paris flaw propagation comparison: nominal wave fatigue vs. VIV 0.38 Hz modal lock-in.
- **End-to-End Architecture Pipeline**: Sensor Ingestion $\to$ Subsea Edge Wavelet Compression (128:1) $\to$ Real-Time Physics Models $\to$ Bayesian UQ $\to$ HITL Gate $\to$ Autonomous ROV Dispatch.

### 3.2 Teachable Moments Annotation Panel ([src/components/ScenarioAnnotationPanel.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/ScenarioAnnotationPanel.jsx))
- Dockable panel answering: **"Why Did the Model Flag This?"**
- Dynamic threshold crossing table (measured value vs. safe API 17D / DNV limit, deviation %).
- Bayesian posterior shift analysis explaining prior design life vs. posterior $P_{10}/P_{50}/P_{90}$ degradation.
- Governing physics breakdown with LaTeX formulas and real-time SHAP feature attributions.

### 3.3 Timeline Scrubber & Speed Controls HUD ([src/components/TimeControlsHUD.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/TimeControlsHUD.jsx))
- Floating industrial time control bar docked at the bottom of the console.
- **Simulation Speed Toggles:** `0.5x`, `1x`, `2x`, `5x`, `10x`, plus Play / Pause.
- **Historical Scrubbing:** Rewind up to 80 simulation snapshots to review anomaly onset, peak excursion, and post-intervention stabilization.
- **Quick Jump Points:** Instant triggers for Normal Baseline, Hydrate Risk, VIV Riser Lock-in, Choke Erosion, Micro-Leak Breach, and Wax Deposition.

### 3.4 90-Second Guided Tour Modal ([src/components/GuidedTourModal.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/GuidedTourModal.jsx))
- Automated executive walkthrough designed for recruiter and stakeholder demonstrations.
- Guides through 3 key subsea operational anomalies in sequence:
  1. **Flow Assurance:** Dynamic PVT Hydrate Blockage & Safe Clamped MEG Dosing.
  2. **Structural Health:** Steel Catenary Riser 0.38 Hz VIV Modal Lock-in & Paris LEFM Crack Growth.
  3. **Containment Integrity:** Nanosecond Acoustic Wave Micro-Leak Localization at KP 4.35.
- Features automatic countdown timer, pause/resume, and manual step-through buttons.

---

## Phase 4: High-Leverage Engineering Hardening

### 4.1 Genuine Computed Model: Paris-Erdogan LEFM Solver ([src/services/fractureMechanics.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/services/fractureMechanics.js))
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

### 4.2 State Persistence via LocalStorage ([src/services/telemetryEngine.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/services/telemetryEngine.js))
- State survives page reloads, browser restarts, and tab closures:
  - `subseaguard_hitl_audit_log`: Authenticated ROV mission sign-offs with cryptographic audit hashes.
  - `subseaguard_pending_auth`: Staged ROV dispatches awaiting engineer authorization.
  - `subseaguard_interventions`: Field calibration records (UT wall scans, ROV visual surveys).
  - `subseaguard_ack_alerts` & `subseaguard_alert_owners`: Control room alert acknowledgment tracking.
- Added `clearPersistedState()` for resetting to pristine factory conditions when needed.

### 4.3 Real ISO 14224:2016 JSON Audit Dossier Export ([src/components/ReportGeneratorModal.jsx](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/src/components/ReportGeneratorModal.jsx))
- **"Download ISO 14224 JSON"** triggers an actual browser file download (`SubseaGuard_ISO14224_Audit_Dossier_[date].json`).
- Structures full ISO 14224:2016 equipment taxonomy (Levels 1–5: Industry, Business, Installation, Plant, Equipment Units).
- Includes real-time computed fracture mechanics parameters ($\Delta K$, $da/dN$, $a$, $a_{\text{crit}}$, $P_{10}/P_{50}/P_{90}$ RUL), failure mode codes (e.g. `FAT-VIV-02`, `HYD-PLUG-01`), SHA-256 tamper-proof audit proof, and CBI cost savings ($3.84M YTD).
- Preserved existing PDF / Print exporter with formatted styles.

### 4.4 Offline Progressive Web App (PWA) ([public/manifest.json](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/manifest.json) & [public/sw.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/public/sw.js))
- Configured Web App Manifest with deepwater cyan palette, standalone display mode, and SVG icons.
- Built-in Service Worker implements stale-while-revalidate precaching and offline navigation fallback.
- Enables demonstration in bad-WiFi interview rooms, conference centers, or offshore vessels without network dropout.
- Registered in both landing page ([index.html](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/index.html)) and operational console ([app/index.html](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/app/index.html)).

### 4.5 Automated Characterization & Physics Test Suites ([tests/physics.test.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/tests/physics.test.js) & [tests/scenarios.test.js](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/tests/scenarios.test.js))
- Built using Node.js' native test runner (`node --test`), requiring zero external test runner dependencies.
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
- **Execution Result:** `12 passed, 0 failed` in 258ms.

### 4.6 GitHub Actions Continuous Integration (CI) ([.github/workflows/ci.yml](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/.github/workflows/ci.yml))
- Matrix build running on `ubuntu-latest` across Node.js `20.x` and `22.x` on every push and PR:
  1. `npm ci`
  2. `npm run lint` (Oxlint with 0 errors)
  3. `npm test` (12 characterization tests)
  4. `npm run build` (Vite production bundle verification)
- Embedded CI build badge, PWA Offline badge, and ISO 14224 compliance badge into [README.md](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/README.md).

### 4.7 Technical LinkedIn Article ([LINKEDIN_ARTICLE.md](file:///c:/Users/user/OneDrive/Desktop/PROJECTS/AI%20driven%20predictive%20maintenance%20for%20subsea%20system%20for%20improved%20safety%20and%20reliabilty/LINKEDIN_ARTICLE.md))
- Complete, publication-ready engineering article: *"I Built a Physics-Informed Digital Twin for Deepwater Subsea Equipment — Here's How It Works"*.
- Explains the deepwater environment (-1,850 m, 345 bar, $180k/day vessel rates), why pure ML fails offshore, mathematical derivations of the 4-stage pipeline, Bayesian UQ, and links to the live console.

---

## Verification & Build Summary Matrix

| Quality Gate | Tooling / Command | Result | Metrics / Details |
| :--- | :--- | :---: | :--- |
| **Linting & a11y Analysis** | `npm run lint` (Oxlint) | **PASS** | 0 errors across 38 files |
| **Physics & Scenario Tests** | `npm test` (`node --test`) | **PASS** | 12/12 characterization tests passing (258ms) |
| **Production Bundle Build** | `npm run build` (Vite 5) | **PASS** | 1,623 modules transformed in 11.69s; split into optimized chunks |
| **PWA Service Worker** | `public/sw.js` | **ACTIVE** | Pre-caches `/`, `/app/`, and manifests for offline fallback |
| **Security Headers** | `vercel.json` | **VERIFIED** | Strict CSP, HSTS 2-yr preload, DENY frame, nosniff |
| **Designation Compliance** | `\bPE\b` regex scan | **VERIFIED** | 0 instances; simulated personas clearly labeled |
