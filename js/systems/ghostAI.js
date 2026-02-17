import { GAME_PHASES } from '../data/constants.js';
import { getRoom, neighbors } from './houseGenerator.js';

export function createGhost(ghostDef, startRoomId) {
  return {
    ...ghostDef,
    roomId: startRoomId,
    state: 'wandering',
    huntProgress: 0,
    lastNoise: 0
  };
}

/**
 * Simple behavior tree style update:
 * 1) Check hunt trigger by sanity / aggression.
 * 2) If hunting, path to player and attempt kill when line-of-sight.
 * 3) Else switch between stalking and wandering based on sound + proximity.
 */
export function updateGhostAI(gameState) {
  const { ghost, player, house } = gameState;
  const playerRoom = getRoom(house, player.roomId);
  const ghostRoom = getRoom(house, ghost.roomId);
  const distance = manhattan(playerRoom, ghostRoom);

  const hearsPlayer = Math.random() < ghost.soundSensitivity * (distance <= 2 ? 1 : 0.45);
  ghost.lastNoise = hearsPlayer ? ghost.lastNoise + 1 : Math.max(0, ghost.lastNoise - 1);

  const shouldHunt = player.sanity <= ghost.huntThreshold || ghost.lastNoise >= 3;

  if (shouldHunt) {
    ghost.state = 'hunting';
    gameState.phase = GAME_PHASES.HUNT;
    house.doorsLocked = true;
    moveTowardPlayer(gameState);
    return;
  }

  house.doorsLocked = false;
  gameState.phase = GAME_PHASES.INVESTIGATION;

  if (distance <= 1 || hearsPlayer) {
    ghost.state = 'stalking';
    moveTowardPlayer(gameState, 0.65);
  } else {
    ghost.state = 'wandering';
    randomWander(gameState);
  }
}

function moveTowardPlayer(gameState, chance = 1) {
  const { ghost, player, house } = gameState;
  if (Math.random() > chance) return;

  const options = neighbors(house, ghost.roomId);
  if (!options.length) return;

  options.sort((a, b) => manhattan(a, getRoom(house, player.roomId)) - manhattan(b, getRoom(house, player.roomId)));
  ghost.roomId = options[0].id;

  if (ghost.roomId === player.roomId && gameState.phase === GAME_PHASES.HUNT) {
    gameState.player.alive = false;
    gameState.phase = GAME_PHASES.FAILURE;
  }
}

function randomWander(gameState) {
  const options = neighbors(gameState.house, gameState.ghost.roomId);
  if (!options.length) return;
  const room = options[Math.floor(Math.random() * options.length)];
  gameState.ghost.roomId = room.id;
}

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
