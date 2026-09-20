import React from 'react';
import { WifiOff, Wifi, RefreshCw, Layers, Radio, ArrowUpRight } from 'lucide-react';

export default function OfflineMeshBar({
  isOffline,
  setIsOffline,
  offlineQueue,
  onSyncOfflineQueue
}) {
  return (
    <div className={`px-4 py-2 border-t transition-all duration-300 text-xs font-mono flex flex-wrap items-center justify-between gap-3 ${
      isOffline
        ? 'bg-amber-950/80 border-amber-600/50 text-amber-200'
        : 'bg-slate-950/90 border-slate-800 text-slate-400'
    }`}>
      
      {/* Left: Network Mode Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {isOffline ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-bold text-amber-300">
                LORA MESH P2P MODE (ZERO TELECOM)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-medium">
                CENTRAL SATELLITE & CELLULAR BACKHAUL ONLINE
              </span>
            </>
          )}
        </div>

        <span className="hidden md:inline text-slate-600">|</span>

        <div className="hidden md:flex items-center space-x-2 text-[11px]">
          <span>MESH PEERS: <b>6 NODES</b></span>
          <span className="text-slate-600">•</span>
          <span>LATENCY: <b>{isOffline ? '42ms (Direct P2P)' : '18ms (Cloud)'}</b></span>
          <span className="text-slate-600">•</span>
          <span>FREQUENCY: <b>868.1 MHz (LoRa Sub-GHz)</b></span>
        </div>
      </div>

      {/* Right: Offline Queue & Sync Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">Buffered Beacons:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            offlineQueue.length > 0
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {offlineQueue.length}
          </span>
        </div>

        {isOffline ? (
          <button
            onClick={() => setIsOffline(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors"
          >
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Reconnect Tower Gateway</span>
          </button>
        ) : (
          offlineQueue.length > 0 && (
            <button
              onClick={onSyncOfflineQueue}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold animate-pulse transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>Sync {offlineQueue.length} Mesh Packets Now</span>
            </button>
          )
        )}
      </div>

    </div>
  );
}
