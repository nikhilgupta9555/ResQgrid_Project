import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  Droplet, 
  Zap, 
  ShieldCheck, 
  Filter, 
  Search, 
  PlusCircle, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function IncidentFeed({
  incidents,
  selectedIncident,
  onSelectIncident,
  onOpenDispatch,
  onSimulateIncomingAlert
}) {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    const matchPriority = filterPriority === 'ALL' || inc.priority === filterPriority;
    const matchSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPriority && matchSearch;
  });

  const p1Count = incidents.filter(i => i.priority === 'P1').length;
  const p2Count = incidents.filter(i => i.priority === 'P2').length;

  return (
    <div className="w-full lg:w-[420px] flex flex-col h-full bg-tactical-card/90 border border-tactical-border/80 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      
      {/* Feed Header */}
      <div className="p-3.5 border-b border-tactical-border/80 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="text-sm font-bold tracking-wide text-white uppercase flex items-center gap-1.5">
              <span>Distress Triage Queue</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {incidents.length} Active
              </span>
            </h2>
          </div>

          {/* Quick Demo Simulator Button */}
          <button
            onClick={onSimulateIncomingAlert}
            title="Simulate live incoming distress beacon"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>+ Sim Beacon</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search incident, location, hazard..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Priority Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
              filterPriority === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            ALL ({incidents.length})
          </button>
          <button
            onClick={() => setFilterPriority('P1')}
            className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
              filterPriority === 'P1'
                ? 'bg-red-600/40 text-red-200 border border-red-500/50'
                : 'bg-red-950/40 text-red-400 hover:bg-red-900/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span>P1 CRITICAL ({p1Count})</span>
          </button>
          <button
            onClick={() => setFilterPriority('P2')}
            className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
              filterPriority === 'P2'
                ? 'bg-amber-600/40 text-amber-200 border border-amber-500/50'
                : 'bg-amber-950/40 text-amber-400 hover:bg-amber-900/30'
            }`}
          >
            <span>P2 ({p2Count})</span>
          </button>
          <button
            onClick={() => setFilterPriority('P3')}
            className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
              filterPriority === 'P3'
                ? 'bg-cyan-600/40 text-cyan-200'
                : 'bg-slate-900 text-cyan-500 hover:bg-cyan-950/40'
            }`}
          >
            P3
          </button>
        </div>
      </div>

      {/* Incident List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No distress beacons match the selected criteria.
          </div>
        ) : (
          filteredIncidents.map(inc => {
            const isSelected = selectedIncident && selectedIncident.id === inc.id;
            const isP1 = inc.priority === 'P1';
            const isP2 = inc.priority === 'P2';

            let priorityBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
            if (isP1) priorityBadgeColor = 'bg-red-500/20 text-red-400 border-red-500/40';
            else if (isP2) priorityBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
            else if (inc.priority === 'P3') priorityBadgeColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400/80 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                    : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                {/* Priority Color Bar */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1 ${
                    isP1 ? 'bg-red-500' : isP2 ? 'bg-amber-500' : 'bg-cyan-500'
                  }`}
                />

                <div className="flex items-start justify-between gap-2 pl-1 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${priorityBadgeColor}`}>
                      {inc.priority}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{inc.id}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{inc.timestamp}</span>
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-white pl-1 leading-snug line-clamp-2">
                  {inc.title}
                </h3>

                <div className="mt-2 pl-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span className="truncate max-w-[140px]">{inc.locationName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span className="font-semibold text-slate-300">{inc.trappedCount} Trapped</span>
                  </span>
                  {inc.waterLevel && (
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-blue-400" />
                      <span>{inc.waterLevel.split(' ')[0]}</span>
                    </span>
                  )}
                </div>

                {/* AI Triage Snippet */}
                <div className="mt-2.5 pl-1 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan-300">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span className="font-mono font-medium">AI Match: {inc.aiConfidence}%</span>
                  </div>

                  {inc.assignedUnit ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{inc.assignedUnit.name.split(' ')[0]} En Route</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDispatch(inc);
                      }}
                      className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-1"
                    >
                      <span>Dispatch Fleet</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
