export const EVIDENCE_TYPES = [
  'EMF Level 5',
  'Spirit Box',
  'Freezing Temps',
  'Motion',
  'Ghost Orbs'
];

export const GAME_PHASES = {
  BRIEFING: 'Briefing',
  INVESTIGATION: 'Investigation',
  HUNT: 'Ghost Hunt',
  SUCCESS: 'Mission Success',
  FAILURE: 'Mission Failed'
};

export const TOOLS = [
  { id: 'emf', name: 'EMF Reader', desc: 'Reports local paranormal field strength.' },
  { id: 'thermo', name: 'Thermometer', desc: 'Reads room-level temperature simulation.' },
  { id: 'spiritBox', name: 'Spirit Box', desc: 'Can trigger direct entity responses.' },
  { id: 'motion', name: 'Motion Sensor', desc: 'Detects movement near your current room.' },
  { id: 'flashlight', name: 'Flashlight', desc: 'Battery drains over time and during hunts.' }
];

export const HOUSE_SIZE = 4;

export const ROOM_NAMES = [
  'Foyer', 'Living Room', 'Kitchen', 'Bathroom', 'Bedroom',
  'Nursery', 'Garage', 'Basement', 'Study', 'Dining Room'
];
