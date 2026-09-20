import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  Upload, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  MapPin, 
  Droplet, 
  Users, 
  Camera, 
  Check, 
  WifiOff,
  Flame,
  FileText
} from 'lucide-react';
import { DISASTER_PRESETS, runAITriageEvaluation, encodeLoRaPacket } from '../utils/triageClassifier';

export default function CitizenSOSModal({
  isOpen,
  onClose,
  onSubmitSOS,
  isOffline
}) {
  if (!isOpen) return null;

  const [selectedPresetId, setSelectedPresetId] = useState(DISASTER_PRESETS[0].id);
  const [photoPreview, setPhotoPreview] = useState(DISASTER_PRESETS[0].imagePreview);
  const [trappedCount, setTrappedCount] = useState(DISASTER_PRESETS[0].trappedCount);
  const [waterLevelNum, setWaterLevelNum] = useState(7);
  const [hasInfants, setHasInfants] = useState(true);
  const [hasElderly, setHasElderly] = useState(true);
  const [medicalUrgent, setMedicalUrgent] = useState(true);
  const [reporterName, setReporterName] = useState('Citizen Beacon #409');
  const [customDescription, setCustomDescription] = useState(DISASTER_PRESETS[0].description);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  const [analysisStep, setAnalysisStep] = useState('');

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setPhotoPreview(preset.imagePreview);
    setTrappedCount(preset.trappedCount);
    setHasInfants(preset.hasInfants);
    setHasElderly(preset.hasElderly);
    setMedicalUrgent(preset.medicalUrgent);
    setCustomDescription(preset.description);
    setTriageResult(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
        setSelectedPresetId('custom-upload');
        setTriageResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep('Scanning image tensors for water displacement & debris...');

    setTimeout(() => {
      setAnalysisStep('Evaluating thermal & structural damage risks...');
    }, 700);

    setTimeout(() => {
      setAnalysisStep('Computing vulnerability index & triage priority score...');
    }, 1300);

    setTimeout(() => {
      const result = runAITriageEvaluation({
        trappedCount,
        hasInfants,
        hasElderly,
        medicalUrgent,
        waterLevelNum,
        hazards: ['High Inundation', 'Hypothermia Risk'],
        customText: customDescription
      });
      setTriageResult(result);
      setIsAnalyzing(false);
    }, 1800);
  };

  const handleFinalSubmit = () => {
    const activePreset = DISASTER_PRESETS.find(p => p.id === selectedPresetId);
    
    // Evaluate if not already run
    const result = triageResult || runAITriageEvaluation({
      trappedCount,
      hasInfants,
      hasElderly,
      medicalUrgent,
      waterLevelNum,
      hazards: ['Rapid Ingress'],
      customText: customDescription
    });

    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: activePreset ? activePreset.title : 'Citizen Distress Beacon: Emergency Evacuation Needed',
      type: activePreset ? activePreset.type : 'flood',
      priority: result.priority,
      lat: 19.0700 + (Math.random() - 0.5) * 0.04,
      lng: 72.8700 + (Math.random() - 0.5) * 0.04,
      locationName: activePreset ? activePreset.locationName : 'Sector 7 Transit Zone (GPS Lock)',
      trappedCount,
      waterLevel: `${waterLevelNum}.0 ft (${waterLevelNum > 4 ? 'Dangerously Rising' : 'Static'})`,
      hazards: [
        medicalUrgent ? 'Critical Medical Urgency' : null,
        hasInfants ? 'Infants Trapped' : null,
        hasElderly ? 'Elderly Stranded' : null
      ].filter(Boolean),
      timestamp: 'Just now',
      status: 'active',
      aiConfidence: result.confidence,
      recommendedUnits: result.recommendedUnits,
      assignedUnit: null,
      audioTranscript: customDescription,
      imagePreview: photoPreview,
      reporterName
    };

    onSubmitSOS(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Citizen Distress Beacon & AI Triage</span>
                {isOffline && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Offline LoRa Mode
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Low-bandwidth emergency beacon submission with automated vision triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Preset Selector for Fast Demos */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Disaster Scenario Preset (or upload photo):</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DISASTER_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all ${
                    selectedPresetId === p.id
                      ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="font-bold">{p.label}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview & AI Visual Scanner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Disaster Scene"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-600 text-xs flex flex-col items-center gap-1">
                    <Camera className="w-8 h-8 opacity-40" />
                    <span>No image attached</span>
                  </div>
                )}

                {/* AI HUD Overlay if analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3"></div>
                    <p className="text-xs font-mono text-cyan-300 animate-pulse">{analysisStep}</p>
                  </div>
                )}

                {/* Target boxes if triage completed */}
                {triageResult && !isAnalyzing && (
                  <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                    <div className="border border-red-500/80 bg-red-500/10 p-1.5 rounded text-[10px] font-mono text-red-300 w-fit backdrop-blur-md">
                      ⚠️ HAZARD IDENTIFIED: {triageResult.priorityLabel}
                    </div>
                    <div className="text-right text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded w-fit self-end">
                      Confidence: {triageResult.confidence}%
                    </div>
                  </div>
                )}
              </div>

              {/* Upload custom image */}
              <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Upload Custom Disaster Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Situation Parameter Sliders & Checkboxes */}
            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-300 font-semibold">
                  <span>Trapped Persons Count:</span>
                  <span className="text-cyan-400 font-bold">{trappedCount} People</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={trappedCount}
                  onChange={e => setTrappedCount(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300 font-semibold">
                  <span>Inundation / Water Level:</span>
                  <span className="text-blue-400 font-bold">{waterLevelNum} Feet</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={waterLevelNum}
                  onChange={e => setWaterLevelNum(Number(e.target.value))}
                  className="w-full accent-blue-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInfants}
                    onChange={e => setHasInfants(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-red-500 focus:ring-0"
                  />
                  <span>Infants or Toddlers Present</span>
                </label>

                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasElderly}
                    onChange={e => setHasElderly(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Elderly or Wheelchair-bound Individuals</span>
                </label>

                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medicalUrgent}
                    onChange={e => setMedicalUrgent(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-red-500 focus:ring-0"
                  />
                  <span className="text-red-300 font-medium">Critical Medical Emergency / Oxygen Risk</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleRunAIAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-2 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{isAnalyzing ? 'Running AI Vision Classifier...' : 'Run Automated AI Triage'}</span>
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {triageResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">AI CLASSIFICATION REPORT:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-extrabold border ${triageResult.badgeColor}`}>
                  {triageResult.priorityLabel}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {triageResult.aiReasoning}
              </p>
              <div className="text-[11px] text-cyan-400 flex items-center gap-2 pt-1 border-t border-slate-800">
                <span>Recommended Dispatch:</span>
                <span className="font-semibold text-white">{triageResult.recommendedUnits.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Low Bandwidth Packet Info */}
          {isOffline && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs flex items-center gap-3">
              <WifiOff className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <div>
                <p className="font-bold">Zero-Connectivity Fallback Active</p>
                <p className="text-[11px] text-amber-300/80">
                  This beacon will be encoded into a 128-byte peer-to-peer packet and stored in the local mesh queue until a gateway node is discovered.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-950/60 border border-red-400/40 flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <Radio className="w-4 h-4 animate-ping" />
            <span>TRANSMIT DISTRESS BEACON NOW</span>
          </button>
        </div>

      </div>
    </div>
  );
}
