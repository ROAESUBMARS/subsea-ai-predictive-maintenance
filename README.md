# SubseaGuard AI: Predictive Maintenance for Subsea Systems

> **AI-Driven Predictive Maintenance for Subsea Infrastructure to Enhance Safety, Integrity, and Operational Reliability.**

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌊 Overview

Subsea operations present harsh, high-pressure, and low-temperature environments where unscheduled equipment downtime or structural failures incur catastrophic financial and environmental costs. 

**SubseaGuard AI** is an industrial-grade digital twin and predictive maintenance platform designed for offshore subsea oil & gas operations. It combines continuous multi-sensor telemetry, physics-informed condition indicators, Remaining Useful Life (RUL) prognostics, and automated inspection dispatching to transform reactive repairs into proactive, condition-based interventions.

---

## 🚀 Key Capabilities & Modules

- **Industrial Control Room Dashboard (5-Zone)**: Real-time visual monitoring of subsea manifolds, trees, pumps, and risers with health index classification, operational state telemetry, and dynamic alert queues.
- **Flowline & Flexible Riser Integrity**: Finite-element-inspired stress monitoring, vortex-induced vibration (VIV) tracking, bend stiffener fatigue accumulators, and top-tension diagnostics.
- **Physics-Informed Digital Twin**: Interactive 2D/3D schematics of subsea production trees, choke valves, multiphase pumps, and flow loops with synchronized operational states.
- **Prognostics & Remaining Useful Life (RUL)**: Multi-parameter degradation curves (bearing vibration, seal leakage, stator winding temperature) forecasting days to failure.
- **Early Leak Detection**: Pressure wave speed acoustic correlation, mass balance monitoring, and subsea hydrocarbon sniffer tracking.
- **Corrosion & Erosion Prognostics**: Real-time ultrasonic wall thickness reduction estimates, sandbox acoustics, and sacrificial anode depletion models.
- **Condition-Based Inspection & ROI Hub**: Cost-benefit financial models comparing traditional calendar-based ROV surveys vs. AI-driven targeted inspection campaigns.
- **Automated ROV Deployment Hub**: Work order dispatch system with automated dive profile planning, payload configuration, and inspection checklists.
- **Role-Based Views**: Tailored operational interfaces for Field Technicians, Subsea Integrity Engineers, and Asset Operations Managers.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Hooks, Context, Real-Time Subscriptions)
- **Build Tooling**: Vite 5
- **Data Visualization**: Chart.js 4 & `react-chartjs-2`
- **UI Components & Icons**: Modern CSS Design System & `lucide-react`
- **Simulation Engine**: Built-in dynamic telemetry engine with configurable subsea failure injection scenarios (Normal, Hydrate Plug, Bearing Wear, Choke Erosion, Acoustic Leak, Top-Tension Fatigue).

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ROAESUBMARS/subsea-ai-predictive-maintenance.git
   cd subsea-ai-predictive-maintenance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To compile a minified production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📖 Documentation

For detailed technical explanations, scenario walkthroughs, and subsea operational workflows, refer to the included documentation:
- [`SubseaGuard_AI_User_Guide.pdf`](./SubseaGuard_AI_User_Guide.pdf)

---

## 📄 License

This project is licensed under the MIT License.
