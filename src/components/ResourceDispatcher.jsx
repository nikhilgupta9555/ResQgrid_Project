import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  Battery, 
  Fuel, 
  Users, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResourceDispatcher({
  incident,
  resources,
  isOpen,
  onClose,
  onAssignResource,
  onMarkResolved
}) {
  if (!isOpen || !incident) return null;

  const [selectedUnitId, setSelectedUnitId] = useState(
    resources.find(r => r.status === 'available')?.id || resources[0]?.id
  );

  const calculateDistanceKm = (res) => {
    // Euclidean distance scaled roughly to km in metro grid
    const dLat = (res.lat - incident.lat) * 111;
    const dLng = (res.lng - incident.lng) * 105;
    return Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1);
  };

  const calculateETA = (res, distKm) => {
    const hours = distKm / (res.speedKmh || 30);
    const minutes = Math.max(Math.round(hours * 60), 2);
    return `${minutes} mins`;
  };

  const handleDispatch = () => {
    const unit = resources.find(r => r.id === selectedUnitId);
    if (!unit) return;

    const dist = calculateDistanceKm(unit);
    const eta = calculateETA(unit, dist);

    onAssignResource(incident.id, {
      id: unit.id,
      name: unit.name,
      eta,
      distanceKm: dist
    });
    onClose();
  };

  const handleResolveAndRescue = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    onMarkResolved(incident.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Tactical Fleet Dispatcher</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Target: {incident.id}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Incident Snapshot */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800/80 flex items-start justify-between gap-3 text-xs">
          <div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              incident.priority === 'P1' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {incident.priority} CRITICAL
            </span>
            <h3 className="text-sm font-bold text-white mt-1">{incident.title}</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">{incident.locationName}</p>
          </div>
          <div className="text-right space-y-1 font-mono text-[11px]">
            <div className="text-amber-400 font-bold">{incident.trappedCount} Persons Trapped</div>
            <div className="text-blue-400">{incident.waterLevel}</div>
          </div>
        </div>

        {/* Fleet Asset Selection */}
        <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Select Optimal Response Unit:</span>
            <span className="text-[11px] text-cyan-400 font-mono">Real-time GPS Distance Matrix</span>
          </label>

          <div className="space-y-2">
            {resources.map(unit => {
              const isSelected = selectedUnitId === unit.id;
              const isAvailable = unit.status === 'available';
              const dist = calculateDistanceKm(unit);
              const eta = calculateETA(unit, dist);

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">
                        {unit.type === 'boat' ? '🚤' : unit.type === 'drone' ? '🚁' : unit.type === 'medic' ? '🚑' : '🚚'}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{unit.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{unit.id}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {unit.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Navigation className="w-3 h-3 text-cyan-400" />
                        <span>{dist} km away</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>ETA ~ {eta}</span>
                      </span>
                    </div>
                    <div>
                      <span>Speed: {unit.speedKmh} km/h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div>
            {incident.assignedUnit && (
              <button
                onClick={handleResolveAndRescue}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Mark Evacuated & Safe</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-900/40 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPATCH CONVOY</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
