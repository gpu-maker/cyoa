/**
 * Ghost definitions are data-driven so adding new entities only requires extending this array.
 */
export const GHOST_TYPES = [
  {
    id: 'wraith',
    name: 'Wraith',
    personality: 'Aggressive stalker that hunts when sanity drops quickly.',
    evidence: ['EMF Level 5', 'Spirit Box', 'Motion'],
    strengths: 'Can rapidly close distance when it has line-of-sight.',
    weaknesses: 'More vulnerable when players stay in lit safe rooms.',
    huntThreshold: 55,
    soundSensitivity: 0.85
  },
  {
    id: 'shade',
    name: 'Shade',
    personality: 'Passive observer that avoids direct interaction early.',
    evidence: ['Freezing Temps', 'Ghost Orbs', 'Motion'],
    strengths: 'Hard to provoke at high sanity levels.',
    weaknesses: 'Rarely hunts above 50% sanity.',
    huntThreshold: 35,
    soundSensitivity: 0.35
  },
  {
    id: 'oni',
    name: 'Oni',
    personality: 'Loud and kinetic ghost that manipulates environment often.',
    evidence: ['EMF Level 5', 'Freezing Temps', 'Spirit Box'],
    strengths: 'Frequent scare events and object movement.',
    weaknesses: 'Predictable once evidence is collected quickly.',
    huntThreshold: 65,
    soundSensitivity: 0.6
  },
  {
    id: 'mimic',
    name: 'Mimic',
    personality: 'Deceptive spirit with contradictory traces.',
    evidence: ['Spirit Box', 'Ghost Orbs', 'EMF Level 5'],
    strengths: 'Can fake motion spikes and brief fake freezing.',
    weaknesses: 'Inconsistent behavior exposes it over time.',
    huntThreshold: 50,
    soundSensitivity: 0.7
  }
];
