import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CommandMap from './components/CommandMap';
import IncidentFeed from './components/IncidentFeed';
import CitizenSOSModal from './components/CitizenSOSModal';
import ResourceDispatcher from './components/ResourceDispatcher';
import OfflineMeshBar from './components/OfflineMeshBar';
import AnalyticsView from './components/AnalyticsView';
import PitchDeckModal from './components/PitchDeckModal';

import { INITIAL_INCIDENTS } from './data/mockIncidents';
import { INITIAL_RESOURCES, INITIAL_SHELTERS } from './data/mockResources';
import { playSOSAlert, playRadarPing, playSuccessChime } from './utils/soundAlerts';
import { getOfflineQueue, saveToOfflineQueue, clearOfflineQueue } from './utils/offlineQueue';

export default function App() {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [shelters, setShelters] = useState(INITIAL_SHELTERS);

  const [selectedIncident, setSelectedIncident] = useState(INITIAL_INCIDENTS[0]);
  const [activeView, setActiveView] = useState('command'); // 'command' | 'analytics'

  const [isOffline, setIsOffline] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);

  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  // Load offline queue on mount
  useEffect(() => {
    setOfflineQueue(getOfflineQueue());
  }, []);

  // Play audio helper with toggle check
  const triggerAudio = (fn) => {
    if (soundEnabled) {
      fn();
    }
  };

  const handleSelectIncident = (inc) => {
    setSelectedIncident(inc);
    triggerAudio(playRadarPing);
  };

  const handleOpenDispatch = (inc) => {
    setSelectedIncident(inc);
    setIsDispatchModalOpen(true);
  };

  const handleAssignResource = (incidentId, dispatchData) => {
    // 1. Update Incident
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'assigned',
          assignedUnit: dispatchData
        };
      }
      return inc;
    }));

    // 2. Update Resource Status
    setResources(prev => prev.map(res => {
      if (res.id === dispatchData.id) {
        return {
          ...res,
          status: 'dispatched',
          currentAssignedIncidentId: incidentId
        };
      }
      return res;
    }));

    triggerAudio(playSuccessChime);
  };

  const handleMarkResolved = (incidentId) => {
    const inc = incidents.find(i => i.id === incidentId);
    
    // Free assigned resource
    if (inc?.assignedUnit) {
      setResources(prev => prev.map(res => {
        if (res.id === inc.assignedUnit.id) {
          return {
            ...res,
            status: 'available',
            currentAssignedIncidentId: null
          };
        }
        return res;
      }));
    }

    // Mark incident as rescued
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        return {
          ...i,
          status: 'rescued'
        };
      }
      return i;
    }));

    triggerAudio(playSuccessChime);
  };

  const handleSubmitSOS = (newIncident) => {
    if (isOffline) {
      const updatedQueue = saveToOfflineQueue(newIncident);
      setOfflineQueue(updatedQueue);
      triggerAudio(playRadarPing);
      alert(`[OFFLINE LORA MESH]: Beacon ${newIncident.id} encoded into 128-byte packet and cached locally.`);
    } else {
      setIncidents(prev => [newIncident, ...prev]);
      setSelectedIncident(newIncident);
      triggerAudio(playSOSAlert);
    }
  };

  const handleSyncOfflineQueue = () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    setIncidents(prev => [...queue, ...prev]);
    clearOfflineQueue();
    setOfflineQueue([]);
    triggerAudio(playSuccessChime);
    alert(`[GATEWAY RECONNECTED]: Successfully synchronized ${queue.length} buffered distress beacons from local LoRa mesh queue to Central Command!`);
  };

  const handleSimulateIncomingAlert = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newSim = {
      id: `INC-${randomNum}`,
      title: '🚨 Rapid Water Influx: 5 Civilians Trapped on Balcony',
      type: 'flood',
      priority: 'P1',
      lat: 19.0740 + (Math.random() - 0.5) * 0.03,
      lng: 72.8750 + (Math.random() - 0.5) * 0.03,
      locationName: 'Kalina Transit Junction (Auto-Beacon)',
      trappedCount: 5,
      waterLevel: '5.5 ft (Surging)',
      hazards: ['Live current', 'Submerged transformer'],
      timestamp: 'Just now',
      status: 'active',
      aiConfidence: 97.2,
      recommendedUnits: ['NDRF Gemini Inflatable Boat', 'Rescue Drone'],
      assignedUnit: null,
      audioTranscript: 'Water level jumped by 2 feet in 15 minutes! Please send boats immediately to Kalina market side.',
      imagePreview: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      reporterName: 'Kalina Community Watch'
    };

    handleSubmitSOS(newSim);
  };

  const activeIncidentCount = incidents.filter(i => i.status !== 'rescued').length;

  return (
    <div className="min-h-screen flex flex-col bg-tactical-bg text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Tactical Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        offlineQueueCount={offlineQueue.length}
        openPitchDeck={() => setIsPitchDeckOpen(true)}
        openCitizenModal={() => setIsCitizenModalOpen(true)}
        activeIncidentCount={activeIncidentCount}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'command' ? (
          <div className="flex-1 p-3 sm:p-4 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-[calc(100vh-115px)]">
            
            {/* Left Column: Live Incident Feed & Triage */}
            <IncidentFeed
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelectIncident={handleSelectIncident}
              onOpenDispatch={handleOpenDispatch}
              onSimulateIncomingAlert={handleSimulateIncomingAlert}
            />

            {/* Right Column: Tactical Map with Radar & Layers */}
            <div className="flex-1 flex flex-col min-h-[500px]">
              <CommandMap
                incidents={incidents}
                resources={resources}
                shelters={shelters}
                selectedIncident={selectedIncident}
                onSelectIncident={handleSelectIncident}
                onOpenDispatch={handleOpenDispatch}
              />
            </div>

          </div>
        ) : (
          <AnalyticsView
            incidents={incidents}
            resources={resources}
            shelters={shelters}
            onBackToCommand={() => setActiveView('command')}
          />
        )}
      </main>

      {/* Low-Bandwidth / LoRa Mesh Status Bar */}
      <OfflineMeshBar
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        offlineQueue={offlineQueue}
        onSyncOfflineQueue={handleSyncOfflineQueue}
      />

      {/* Modals */}
      <CitizenSOSModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        onSubmitSOS={handleSubmitSOS}
        isOffline={isOffline}
      />

      <ResourceDispatcher
        incident={selectedIncident}
        resources={resources}
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onAssignResource={handleAssignResource}
        onMarkResolved={handleMarkResolved}
      />

      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

    </div>
  );
}
