export const INITIAL_RESOURCES = [
  {
    id: 'UNIT-BOAT-01',
    name: 'NDRF Inflatable Gemini 01',
    type: 'boat',
    status: 'assigned',
    lat: 19.0880,
    lng: 72.8900,
    speedKmh: 28,
    capacityPeople: 12,
    personnel: '4 NDRF Divers + 1 Paramedic',
    equipment: ['Lifebuoys x12', 'Defibrillator', 'Thermal Blankets x15'],
    currentAssignedIncidentId: 'INC-7731',
    fuelPercent: 88
  },
  {
    id: 'UNIT-BOAT-02',
    name: 'Coast Guard Jet-Rescue 04',
    type: 'boat',
    status: 'available',
    lat: 19.0600,
    lng: 72.8550,
    speedKmh: 35,
    capacityPeople: 10,
    personnel: '3 Marine Officers',
    equipment: ['Rope launchers', 'Survival Rations x30'],
    currentAssignedIncidentId: null,
    fuelPercent: 95
  },
  {
    id: 'UNIT-DRONE-01',
    name: 'SkyLifter Heavy Payload Drone Alpha',
    type: 'drone',
    status: 'available',
    lat: 19.0740,
    lng: 72.8710,
    speedKmh: 65,
    capacityPayloadKg: 40,
    equipment: ['Emergency Blood Packs', 'Satellite Comms Beacon', 'EpiPens & Inhalers'],
    currentAssignedIncidentId: null,
    batteryPercent: 92
  },
  {
    id: 'UNIT-DRONE-02',
    name: 'ResQ-Eagle Heavy Drone 02',
    type: 'drone',
    status: 'dispatched',
    lat: 19.0700,
    lng: 72.8680,
    speedKmh: 70,
    capacityPayloadKg: 50,
    equipment: ['Thermal Imaging Camera', 'Air-Drop Trauma Kit'],
    currentAssignedIncidentId: 'INC-8820',
    batteryPercent: 79
  },
  {
    id: 'UNIT-MEDIC-01',
    name: 'Rapid Disaster Medical Response Unit',
    type: 'medic',
    status: 'available',
    lat: 19.0780,
    lng: 72.8800,
    speedKmh: 40,
    capacityPatients: 4,
    personnel: '2 Trauma Doctors + 2 EMTs',
    equipment: ['Portable Oxygen Generator', 'Anti-venom Kits', 'Suture & Trauma Sets'],
    currentAssignedIncidentId: null,
    fuelPercent: 76
  },
  {
    id: 'UNIT-CONVOY-01',
    name: 'Red Cross Mobile Rations Convoy',
    type: 'convoy',
    status: 'available',
    lat: 19.0640,
    lng: 72.8480,
    speedKmh: 30,
    capacityFoodMeals: 500,
    waterLiters: 1200,
    equipment: ['High-calorie energy bars', 'Water purification sachets (2000L)'],
    currentAssignedIncidentId: null,
    fuelPercent: 82
  }
];

export const INITIAL_SHELTERS = [
  {
    id: 'SHELTER-01',
    name: 'St. Xavier High School Evacuation Center',
    lat: 19.0910,
    lng: 72.8720,
    capacityTotal: 350,
    capacityCurrent: 218,
    status: 'operational',
    hasPower: true,
    hasGeneratorBackup: true,
    hasMedicalStaff: true,
    contact: '+91 98200 11223'
  },
  {
    id: 'SHELTER-02',
    name: 'BKC Indoor Sports Complex Relief Hub',
    lat: 19.0620,
    lng: 72.8680,
    capacityTotal: 600,
    capacityCurrent: 480,
    status: 'near_capacity',
    hasPower: true,
    hasGeneratorBackup: true,
    hasMedicalStaff: true,
    contact: '+91 98201 44556'
  },
  {
    id: 'SHELTER-03',
    name: 'Dharavi Municipal Community Center',
    lat: 19.0430,
    lng: 72.8580,
    capacityTotal: 250,
    capacityCurrent: 92,
    status: 'operational',
    hasPower: false,
    hasGeneratorBackup: true,
    hasMedicalStaff: false,
    contact: '+91 98203 77889'
  }
];
