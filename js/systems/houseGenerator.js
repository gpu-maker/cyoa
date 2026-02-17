import { HOUSE_SIZE, ROOM_NAMES } from '../data/constants.js';

export function generateHouse(seed = Date.now()) {
  let randomState = seed % 2147483647;
  const rand = () => {
    randomState = (randomState * 48271) % 2147483647;
    return randomState / 2147483647;
  };

  const rooms = [];
  for (let y = 0; y < HOUSE_SIZE; y += 1) {
    for (let x = 0; x < HOUSE_SIZE; x += 1) {
      const roomIndex = Math.floor(rand() * ROOM_NAMES.length);
      rooms.push({
        id: `${x}-${y}`,
        name: ROOM_NAMES[roomIndex],
        x,
        y,
        tempC: 16 + Math.round(rand() * 6),
        lightOn: rand() > 0.2,
        hasMotion: false,
        isSafeZone: rand() > 0.75
      });
    }
  }

  const ghostRoom = rooms[Math.floor(rand() * rooms.length)].id;
  const breakerRoom = rooms[Math.floor(rand() * rooms.length)].id;

  return {
    seed,
    size: HOUSE_SIZE,
    rooms,
    ghostRoom,
    breakerRoom,
    doorsLocked: false
  };
}

export function getRoom(house, roomId) {
  return house.rooms.find((room) => room.id === roomId);
}

export function neighbors(house, roomId) {
  const room = getRoom(house, roomId);
  if (!room) return [];

  return house.rooms.filter((candidate) => {
    const dx = Math.abs(candidate.x - room.x);
    const dy = Math.abs(candidate.y - room.y);
    return dx + dy === 1;
  });
}
