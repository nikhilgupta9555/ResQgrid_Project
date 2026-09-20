export const DISASTER_PRESETS = [
  {
    id: 'preset-flood-trapped',
    label: '🌊 Trapped in 7ft Flood Water (P1 Critical)',
    title: 'Multi-generational Family Trapped on Slanted Roof',
    type: 'flood',
    trappedCount: 6,
    hasInfants: true,
    hasElderly: true,
    medicalUrgent: true,
    waterLevel: '7.2 ft',
    hazards: ['Live electric wires nearby', 'Swirling river current', 'Hypothermia'],
    locationName: 'Kurla West, Milan Subway Vicinity',
    description: 'Water has risen above door frames! Grandfather is wheelchair bound, baby is 8 months old. Roof is slick and rain is intensifying.',
    imagePreview: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'preset-rubble-collapse',
    label: '🏗️ Building Rubble Collapse (P1 Critical)',
    title: 'Masonry Collapse with Pinned Victims',
    type: 'structural_collapse',
    trappedCount: 3,
    hasInfants: false,
    hasElderly: false,
    medicalUrgent: true,
    waterLevel: '2.0 ft',
    hazards: ['Crush injury syndrome', 'Unstable hanging slab', 'Pungent gas odor'],
    locationName: 'Sakinaka Industrial Estate, Gale No. 4',
    description: 'Support wall collapsed during deluge. 3 workers pinned below concrete beam. Severe bleeding visible.',
    imagePreview: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'preset-oxygen-shortage',
    label: '🩺 Cutoff Hospital Oxygen Depletion (P2 Urgent)',
    title: 'Critical ICU Generator Fuel & Oxygen Running Out',
    type: 'medical_critical',
    trappedCount: 12,
    hasInfants: true,
    hasElderly: true,
    medicalUrgent: true,
    waterLevel: '3.5 ft (Surrounding Access Roads)',
    hazards: ['Generator fuel < 45 mins', 'Liquid oxygen pressure dropping'],
    locationName: 'Sion LifeCare Nursing Home',
    description: 'Ground floor inundated. 12 patients in second floor step-down ward need emergency oxygen cylinders or power backup.',
    imagePreview: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'preset-water-depletion',
    label: '🍞 Relief Camp Supply Depletion (P3 Moderate)',
    title: 'Drinking Water & Baby Food Depletion',
    type: 'ration_depletion',
    trappedCount: 60,
    hasInfants: true,
    hasElderly: false,
    medicalUrgent: false,
    waterLevel: '1.0 ft',
    hazards: ['Dehydration risk', 'Waterborne pathogens in local pipe'],
    locationName: 'Chunabhatti Community Hall',
    description: 'Shelter safe from flooding but potable water stocks exhausted 3 hours ago. Need clean water and food packets.',
    imagePreview: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80'
  }
];

export function runAITriageEvaluation({
  trappedCount = 1,
  hasInfants = false,
  hasElderly = false,
  medicalUrgent = false,
  waterLevelNum = 0,
  hazards = [],
  customText = ''
}) {
  let score = 30; // base score

  // Score adjustments
  if (medicalUrgent) score += 35;
  if (hasInfants) score += 20;
  if (hasElderly) score += 15;
  if (trappedCount > 5) score += 20;
  else if (trappedCount > 2) score += 10;

  if (waterLevelNum >= 6) score += 30;
  else if (waterLevelNum >= 3) score += 15;

  const hazardKeywords = ['wire', 'electric', 'gas', 'collapse', 'crush', 'current', 'hypothermia', 'bleeding'];
  const textLower = (customText + ' ' + hazards.join(' ')).toLowerCase();
  
  hazardKeywords.forEach(kw => {
    if (textLower.includes(kw)) score += 8;
  });

  score = Math.min(Math.max(score, 10), 100);

  let priority = 'P3';
  let priorityLabel = 'Moderate';
  let badgeColor = 'text-sky-400 border-sky-500/30 bg-sky-500/10';
  let recommendedUnits = ['Relief Convoy Rations'];

  if (score >= 80) {
    priority = 'P1';
    priorityLabel = 'CRITICAL (Immediate Life Threat)';
    badgeColor = 'text-red-400 border-red-500/40 bg-red-500/20';
    recommendedUnits = ['NDRF Rescue Speedboat', 'Air-Drop Trauma Drone', 'Paramedic Extraction Team'];
  } else if (score >= 55) {
    priority = 'P2';
    priorityLabel = 'URGENT (High Vulnerability)';
    badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/20';
    recommendedUnits = ['Amphibious Medical Unit', 'High-Payload Supply Drone'];
  } else if (score >= 35) {
    priority = 'P3';
    priorityLabel = 'MODERATE (Support Required)';
    badgeColor = 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    recommendedUnits = ['Mobile Rations Truck', 'Clean Water Purification Kit'];
  } else {
    priority = 'P4';
    priorityLabel = 'LOW / MONITORING';
    badgeColor = 'text-slate-400 border-slate-600 bg-slate-800/40';
    recommendedUnits = ['Field Scout Verification'];
  }

  const confidence = (88 + (score % 11) + Math.random() * 2).toFixed(1);

  return {
    score,
    priority,
    priorityLabel,
    badgeColor,
    confidence: Number(confidence),
    recommendedUnits,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    aiReasoning: `Identified ${trappedCount} trapped persons with high vulnerability markers (${[
      hasInfants ? 'Infants' : '',
      hasElderly ? 'Elderly' : '',
      medicalUrgent ? 'Critical Medical Risk' : ''
    ].filter(Boolean).join(', ') || 'Standard'}. Hazard factors: ${hazards.length ? hazards.join(', ') : 'Waterlogging'}. Immediate dispatch recommended.`
  };
}

// Low-bandwidth 128-byte LoRa mesh packet encoder simulation
export function encodeLoRaPacket(incident) {
  const p = {
    id: incident.id,
    p: incident.priority,
    t: incident.type?.slice(0, 4),
    c: incident.trappedCount,
    lat: Number(incident.lat?.toFixed(4)),
    lng: Number(incident.lng?.toFixed(4)),
    ts: Date.now()
  };
  return `LORA_MESH::[${btoa(JSON.stringify(p))}]`;
}
