# 🚨 ResQGrid (CrisisPulse)
### *Decentralized Rapid Disaster Response & AI-Powered Triage Mesh*

[![Theme](https://img.shields.io/badge/Theme-Tech_For_A_Better_Tomorrow-blue?style=for-the-badge)](https://unstats.un.org/sdgs/)
[![Hackathon](https://img.shields.io/badge/DECODEP-HACKDAY_1.0-red?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://vitejs.dev)

> **"Empowering frontline rescuers, optimizing critical supplies, and triaging victims in zero-connectivity disaster zones."**

---

## 🌍 The Problem Statement
During severe natural catastrophes (cyclones, urban floods, seismic collapses):
1. **Telecom Blackout:** Cellular towers and power grids submerge, rendering traditional emergency helplines (112/911) inaccessible.
2. **Triage Congestion:** Responders receive hundreds of unverified emergency calls without visual severity data, delaying critical P1 cases (infants, dialysis patients, hypothermia).
3. **Blind Logistics:** Relief boats, drones, and medical personnel are dispatched with incomplete situational awareness, creating bottlenecks.

---

## 💡 The Solution: ResQGrid
**ResQGrid** is an offline-ready, hardware-resilient tactical command platform that bridges the gap between stranded citizens and frontline rescue commanders.

### 🌟 Key Innovations & Features:
- 🩺 **Multimodal Edge AI Triage:** Citizens or field scouts snap/upload a disaster photo. On-device computer vision analyzes water depth, structural integrity, and vulnerability factors, assigning an instant triage priority (**P1 Critical**, **P2 Urgent**, **P3 Moderate**, **P4 Low**) in **<2 seconds**.
- 🗺️ **Tactical GIS Command Center:** Real-time dark-tile GIS situational map rendering live pulsating distress beacons, severe inundation zones, verified shelters, and fleet positions with simulated radar sweeps.
- 🚤 **Autonomous Fleet & Supply Dispatch Engine:** Real-time GPS distance-matrix calculator matching the closest NDRF speedboats, air-drop trauma drones, and medical vans to distress clusters with live ETA tracking.
- 📡 **Offline-Ready LoRa / P2P Mesh Synchronization:** When central telecom infrastructure collapses, distress beacons are encoded into ultra-compact **128-byte LoRa packets** buffered in persistent local storage. As soon as a mesh peer or gateway reconnects, buffered beacons replay and sync automatically.
- 📊 **Operational Analytics & After-Action Report (AAR):** Live telemetry tracking evacuated survivors, shelter occupancy rates, dispatch latency benchmarks, and one-click PDF export for municipal authorities.
- 🎯 **Built-in Judge Pitch Deck:** 6 high-impact presentation slides accessible directly within the application for seamless hackathon pitching.

---

## 🎯 UN Sustainable Development Goals (SDGs)
- **UN SDG 11: Sustainable Cities & Communities (Target 11.5):** Substantially decrease the number of deaths and people affected by water-related and natural disasters.
- **UN SDG 3: Good Health & Well-Being (Target 3.d):** Strengthen early warning, risk reduction, and management of national and global health emergencies.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS (Tactical Dark Command Aesthetic)
- **Mapping & GIS:** Leaflet.js with Dark Matter CartoDB tiles & animated SVG pulse icons
- **Tactical Audio:** Web Audio API (real-time synthesized sonar pings and siren alarms with zero external audio assets)
- **Icons & UI:** Lucide React
- **Celebration Effects:** Canvas-Confetti
- **Offline Mesh Layer:** LocalStorage & simulated 128-byte LoRa sub-GHz packet queue

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/resqgrid.git

# 2. Navigate to directory
cd resqgrid

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```

---

## 🎥 2-Minute Hackathon Demo Script for Judges
1. **Command Center:** Open the dashboard. Observe the live tactical map with dark CartoDB tiles, pulsating red P1 beacons, and flood risk zones.
2. **Citizen SOS:** Click **"SEND SOS / AI SCAN"** in the top navbar. Select a scenario preset (e.g. *Trapped in 7ft Flood Water*) or upload a photo. Click **"Run Automated AI Triage"** to see computer vision hazard extraction. Click **"Transmit Distress Beacon"**.
3. **Audio & Alert:** Notice the immediate alarm sound and the new beacon blinking on the Command Map.
4. **Fleet Dispatch:** Click **"Dispatch Fleet"** on the incident. Select the nearest *NDRF Inflatable Boat* or *Heavy Drone*. Click **"Dispatch Convoy"** to draw the animated route line on the map.
5. **Offline Mode Test:** Flip the **"Cloud Synced"** button to **"Offline Mesh"**. Send an SOS. Observe the beacon queuing into the local mesh buffer. Click **"Reconnect Tower Gateway"** to watch the automated sync replay!
6. **Pitch Deck:** Click **"Judge Pitch Deck"** to show the embedded 6-slide presentation directly inside the app.

---

## 👥 Submission Details
- **Project Title:** ResQGrid (CrisisPulse)
- **Theme:** Tech for a Better Tomorrow
- **Event:** DECODEP HACKDAY 1.0 (20 September 2026)
