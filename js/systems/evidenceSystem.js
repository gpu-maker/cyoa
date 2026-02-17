import { getRoom } from './houseGenerator.js';

export function scanEMF(gameState) {
  const { house, ghost, player } = gameState;
  const room = getRoom(house, player.roomId);
  const distance = roomDistance(room.id, house.ghostRoom);
  const base = Math.max(1, 5 - distance);
  const variance = Math.floor(Math.random() * 2);
  const value = Math.min(5, base + variance);

  if (value >= 5 && ghost.evidence.includes('EMF Level 5')) {
    player.evidenceFound.add('EMF Level 5');
  }

  return value;
}

export function readTemperature(gameState) {
  const { house, ghost, player } = gameState;
  const room = getRoom(house, player.roomId);
  let reading = room.tempC;

  if (room.id === house.ghostRoom && ghost.evidence.includes('Freezing Temps')) {
    reading = Math.min(reading, -2 + Math.round(Math.random() * 2));
    player.evidenceFound.add('Freezing Temps');
  }

  if (ghost.id === 'mimic' && Math.random() > 0.8) {
    reading = Math.min(reading, 0);
  }

  return reading;
}

export function runSpiritBox(gameState) {
  const { house, ghost, player } = gameState;
  const closeToGhost = roomDistance(player.roomId, house.ghostRoom) <= 1;
  const canRespond = ghost.evidence.includes('Spirit Box') && closeToGhost;

  if (canRespond && Math.random() > 0.35) {
    player.evidenceFound.add('Spirit Box');
    return '...GET OUT...';
  }

  return Math.random() > 0.6 ? '...STATIC...' : 'No response.';
}

export function readMotion(gameState) {
  const { house, ghost, player } = gameState;
  const nearGhost = roomDistance(player.roomId, house.ghostRoom) <= 1;
  const detected = nearGhost || Math.random() > 0.9;

  if (detected && ghost.evidence.includes('Motion')) {
    player.evidenceFound.add('Motion');
  }

  return detected;
}

function roomDistance(a, b) {
  const [ax, ay] = a.split('-').map(Number);
  const [bx, by] = b.split('-').map(Number);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}
