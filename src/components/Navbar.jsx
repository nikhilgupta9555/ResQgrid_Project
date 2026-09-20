import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Presentation, 
  UserCheck, 
  Activity,
  Compass
} from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  isOffline,
  setIsOffline,
  soundEnabled,
  setSoundEnabled,
  offlineQueueCount,
  openPitchDeck,
  openCitizenModal,
  activeIncidentCount
}) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-tactical-card/95 border-b border-tactical-border/80 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand & Threat Level */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-900/30 border border-red-500/30">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wider text-white flex items-center gap-1.5">
                ResQ<span className="text-cyan-400 font-extrabold">Grid</span>
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                CrisisPulse v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>SECTOR: Coastal Disaster Zone 04</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-red-400 font-semibold font-mono text-[10px]">THREAT: SEVERE CYCLONE</span>
            </p>
          </div>
        </div>

        {/* Center: View Switchers */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveView('command')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeView === 'command'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Command Room</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/30 text-red-300 font-mono">
              {activeIncidentCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeView === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Analytics & AAR</span>
          </button>

          <button
            onClick={() => openPitchDeck()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all ml-1"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Judge Pitch Deck</span>
          </button>
        </div>

        {/* Right: Telemetry, Offline Toggle, Audio, Citizen Trigger */}
        <div className="flex items-center space-x-2.5">
          {/* Realtime Clock */}
          <div className="hidden lg:flex flex-col items-end text-right px-2.5 py-1 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="text-cyan-400 font-bold">{timeString || '11:30:00 AM'}</span>
            <span className="text-[9px] text-slate-500">GRID SYNC: LIVE</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Tactical Audio On" : "Tactical Audio Muted"}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-slate-800/90 text-cyan-400 border-cyan-500/30 hover:bg-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Offline/Online Simulation Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
              isOffline
                ? 'bg-amber-950/80 text-amber-300 border-amber-600/50 shadow-md shadow-amber-900/40 animate-pulse'
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFLINE MESH ({offlineQueueCount})</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLOUD SYNCED</span>
              </>
            )}
          </button>

          {/* Direct Citizen SOS Trigger */}
          <button
            onClick={openCitizenModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 border border-red-400/30 transition-all hover:scale-105 active:scale-95"
          >
            <Radio className="w-4 h-4 animate-ping" />
            <span>SEND SOS / AI SCAN</span>
          </button>
        </div>

      </div>
    </header>
  );
}
