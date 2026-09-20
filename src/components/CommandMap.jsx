import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass, Eye, Shield, Radio, Navigation, Maximize2 } from 'lucide-react';

export default function CommandMap({
  incidents,
  resources,
  shelters,
  selectedIncident,
  onSelectIncident,
  onOpenDispatch
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const routesLayerGroupRef = useRef(null);

  const [showShelters, setShowShelters] = useState(true);
  const [showRescuers, setShowRescuers] = useState(true);
  const [showFloodHazardZones, setShowFloodHazardZones] = useState(true);
  const [radarActive, setRadarActive] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on disaster coordinates
    const map = L.map(mapContainerRef.current, {
      center: [19.0760, 72.8777],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Free dark tile layers — NO API KEY REQUIRED
    // Primary: Stadia Maps Alidade Smooth Dark (completely free, no key needed)
    const stadiaLayer = L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        minZoom: 2,
        attribution: '&copy; <a href="https://stadia.maps.com">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>',
      }
    );

    // Fallback: OpenStreetMap standard (if Stadia is slow)
    const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
        opacity: 0.25, // Darken by lowering opacity over black background
      }
    );

    // Try Stadia first, if tiles fail automatically fallback to OSM
    stadiaLayer.on('tileerror', function() {
      if (map && !osmLayer._map) {
        map.removeLayer(stadiaLayer);
        osmLayer.addTo(map);
      }
    });

    stadiaLayer.addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    routesLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerGroupRef.current || !routesLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    const routesGroup = routesLayerGroupRef.current;

    markersGroup.clearLayers();
    routesGroup.clearLayers();

    // 1. Render Flood Hazard Polygons if toggled
    if (showFloodHazardZones) {
      const floodZone1 = L.polygon([
        [19.0850, 72.8750],
        [19.0920, 72.8890],
        [19.0780, 72.8950],
        [19.0720, 72.8820],
      ], {
        color: '#06b6d4',
        weight: 1.5,
        fillColor: '#06b6d4',
        fillOpacity: 0.15,
        dashArray: '4, 8'
      }).addTo(markersGroup);
      floodZone1.bindTooltip('🌊 Severe Inundation Zone: 6ft+ Flood Level', { sticky: true, className: 'tactical-tooltip' });

      const floodZone2 = L.polygon([
        [19.0620, 72.8550],
        [19.0700, 72.8680],
        [19.0580, 72.8730],
        [19.0520, 72.8600],
      ], {
        color: '#ef4444',
        weight: 1.5,
        fillColor: '#ef4444',
        fillOpacity: 0.12,
        dashArray: '5, 5'
      }).addTo(markersGroup);
      floodZone2.bindTooltip('⚠️ High-Risk Flash Washout Zone', { sticky: true, className: 'tactical-tooltip' });
    }

    // 2. Render Shelters
    if (showShelters) {
      shelters.forEach(shelter => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-emerald-400 shadow-md shadow-emerald-900/40 transform hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon }).addTo(markersGroup);
        marker.bindPopup(`
          <div class="p-2 min-w-[210px] text-xs">
            <div class="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
              <span>🛡️ Safe Evacuation Shelter</span>
            </div>
            <p class="font-semibold text-white text-sm">${shelter.name}</p>
            <div class="mt-2 text-slate-300 space-y-1">
              <p>Capacity: <b class="text-white">${shelter.capacityCurrent} / ${shelter.capacityTotal}</b> evacuees</p>
              <p>Auxiliary Power: <span class="${shelter.hasPower ? 'text-emerald-400 font-semibold' : 'text-amber-400'}">${shelter.hasPower ? 'ONLINE' : 'GENERATOR'}</span></p>
              <p>Hotline: <span class="font-mono text-cyan-300">${shelter.contact}</span></p>
            </div>
          </div>
        `);
      });
    }

    // 3. Render Rescue Fleet / Units
    if (showRescuers) {
      resources.forEach(res => {
        const isBoat = res.type === 'boat';
        const isDrone = res.type === 'drone';
        const isMedic = res.type === 'medic';
        const color = res.status === 'dispatched' ? '#f59e0b' : '#06b6d4';

        const fleetIcon = L.divIcon({
          className: 'custom-fleet-marker',
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 border-2 shadow-lg transform hover:scale-110 transition-transform" style="border-color: ${color}; color: ${color};">
              <span class="text-sm font-bold">${isBoat ? '🚤' : isDrone ? '🚁' : isMedic ? '🚑' : '🚚'}</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([res.lat, res.lng], { icon: fleetIcon }).addTo(markersGroup);
        marker.bindPopup(`
          <div class="p-2 min-w-[220px] text-xs">
            <div class="flex items-center justify-between font-bold mb-1">
              <span class="text-cyan-300">${res.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${
                res.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }">${res.status}</span>
            </div>
            <p class="text-slate-300 text-[11px]">Speed: ${res.speedKmh} km/h</p>
            <p class="text-slate-300 text-[11px]">Fuel/Battery: <b class="text-emerald-400">${res.fuelPercent || res.batteryPercent}%</b></p>
            <p class="text-slate-400 text-[10px] mt-1">Crew: ${res.personnel || 'Autonomous / Automated'}</p>
          </div>
        `);
      });
    }

    // 4. Render Distress Incidents (SOS Beacons)
    incidents.forEach(inc => {
      let pinColor = '#38bdf8';
      let glowClass = 'glow-cyan';

      if (inc.priority === 'P1') {
        pinColor = '#ef4444';
        glowClass = 'glow-danger';
      } else if (inc.priority === 'P2') {
        pinColor = '#f59e0b';
        glowClass = 'glow-amber';
      }

      const isSelected = selectedIncident && selectedIncident.id === inc.id;

      const beaconIcon = L.divIcon({
        className: 'custom-beacon-wrapper',
        html: `
          <div class="relative cursor-pointer group">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-xl ${glowClass} transition-all duration-300 ${
              isSelected ? 'ring-4 ring-white scale-125' : 'hover:scale-110'
            }" style="background: ${pinColor}">
              <span class="text-[11px] font-mono font-black">${inc.priority}</span>
            </div>
            ${
              inc.priority === 'P1'
                ? '<div class="absolute -inset-2 rounded-full border-2 border-red-500/60 animate-ping pointer-events-none"></div>'
                : ''
            }
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([inc.lat, inc.lng], { icon: beaconIcon }).addTo(markersGroup);

      marker.on('click', () => {
        onSelectIncident(inc);
      });

      // Render polyline route if an incident has an assigned unit
      if (inc.assignedUnit) {
        const assignedRes = resources.find(r => r.id === inc.assignedUnit.id);
        if (assignedRes) {
          const routeLine = L.polyline(
            [
              [assignedRes.lat, assignedRes.lng],
              [inc.lat, inc.lng]
            ],
            {
              color: '#38bdf8',
              weight: 3,
              opacity: 0.85,
              dashArray: '8, 12'
            }
          ).addTo(routesGroup);
          routeLine.bindTooltip(`⚡ Active Convoy Route: ${assignedRes.name} (ETA: ${inc.assignedUnit.eta})`, {
            sticky: true
          });
        }
      }
    });

  }, [incidents, resources, shelters, selectedIncident, showShelters, showRescuers, showFloodHazardZones]);

  // Center on selected incident when changed
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedIncident.lat, selectedIncident.lng], 15, {
        duration: 1.2
      });
    }
  }, [selectedIncident]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([19.0760, 72.8777], 13, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 rounded-xl overflow-hidden border border-tactical-border/80 bg-tactical-bg shadow-2xl">
      
      {/* Tactical Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Radar Overlay Animation */}
      {radarActive && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-20">
          <div className="w-[1200px] h-[1200px] absolute -top-[300px] -left-[300px] rounded-full border border-cyan-500/20">
            <div className="w-full h-full rounded-full border border-cyan-500/10 scale-75"></div>
            <div className="w-full h-full rounded-full border border-cyan-500/10 scale-50"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-full animate-radar-sweep origin-center"></div>
          </div>
        </div>
      )}

      {/* Map Control HUD (Floating Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2">
        <div className="bg-slate-900/95 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-xs shadow-xl space-y-1.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Tactical Layers</span>
            </span>
            <button
              onClick={resetView}
              title="Recenter Map"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          <label className="flex items-center gap-2 px-1 text-slate-300 hover:text-white cursor-pointer select-none text-[11px]">
            <input
              type="checkbox"
              checked={showFloodHazardZones}
              onChange={e => setShowFloodHazardZones(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Flood Hazard Corridors</span>
          </label>

          <label className="flex items-center gap-2 px-1 text-slate-300 hover:text-white cursor-pointer select-none text-[11px]">
            <input
              type="checkbox"
              checked={showShelters}
              onChange={e => setShowShelters(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Relief Shelters</span>
          </label>

          <label className="flex items-center gap-2 px-1 text-slate-300 hover:text-white cursor-pointer select-none text-[11px]">
            <input
              type="checkbox"
              checked={showRescuers}
              onChange={e => setShowRescuers(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>Rescue Fleet & Boats</span>
          </label>

          <label className="flex items-center gap-2 px-1 text-slate-300 hover:text-white cursor-pointer select-none text-[11px]">
            <input
              type="checkbox"
              checked={radarActive}
              onChange={e => setRadarActive(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Radar Sweep Simulation</span>
          </label>
        </div>
      </div>

      {/* Legend & Telemetry Bar (Floating Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 shadow-xl">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-red-400 font-bold">P1 Critical</span>
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-amber-400 font-bold">P2 Urgent</span>
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span className="text-cyan-400 font-bold">P3 Moderate</span>
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span>🛡️ Verified Shelters</span>
        </span>
      </div>

    </div>
  );
}
