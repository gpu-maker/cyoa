import { getRoom } from './houseGenerator.js';

export function updateEnvironment(gameState) {
  const { house, ghost, player } = gameState;

  house.rooms.forEach((room) => {
    if (room.id === house.ghostRoom) {
      room.tempC = Math.max(-4, room.tempC - 0.4);
    } else {
      room.tempC = Math.min(23, room.tempC + 0.1);
    }
  });

  if (Math.random() > 0.94) {
    const randomRoom = house.rooms[Math.floor(Math.random() * house.rooms.length)];
    randomRoom.lightOn = !randomRoom.lightOn;
    return `Lights flicker in ${randomRoom.name}.`;
  }

  if (ghost.id === 'oni' && Math.random() > 0.9) {
    const room = getRoom(house, player.roomId);
    room.lightOn = false;
    return `A violent slam echoes through the ${room.name}.`;
  }

  if (Math.random() > 0.95) {
    return 'You hear distant footsteps and a child laughing.';
  }

  return null;
}

export function resolveLineOfSight(gameState) {
  const { house, ghost, player } = gameState;
  const playerRoom = getRoom(house, player.roomId);
  const ghostRoom = getRoom(house, ghost.roomId);

  const sameRow = playerRoom.y === ghostRoom.y;
  const sameCol = playerRoom.x === ghostRoom.x;

  return sameRow || sameCol;
}
