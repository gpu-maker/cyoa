import { GAME_PHASES } from './data/constants.js';
import { GHOST_TYPES } from './data/ghosts.js';
import { generateHouse, getRoom, neighbors } from './systems/houseGenerator.js';
import { createGhost, updateGhostAI } from './systems/ghostAI.js';
import { createPlayer, tickPlayer, toggleEvidenceSelection } from './systems/playerSystem.js';
import { scanEMF, readMotion, readTemperature, runSpiritBox } from './systems/evidenceSystem.js';
import { resolveLineOfSight, updateEnvironment } from './systems/horrorSystem.js';
import { render, setupStaticUI } from './ui/render.js';

const house = generateHouse();
const startRoom = house.rooms.find((room) => room.isSafeZone)?.id || house.rooms[0].id;
const ghostType = GHOST_TYPES[Math.floor(Math.random() * GHOST_TYPES.length)];

const gameState = {
  house,
  player: createPlayer(startRoom),
  ghost: createGhost(ghostType, house.ghostRoom),
  ghostRoster: GHOST_TYPES,
  phase: GAME_PHASES.BRIEFING,
  timeElapsed: 0,
  tickHandle: null,
  log: [
    'Mission started. Enter the house and collect 3 evidence types.',
    `Intel: Possible entities include ${GHOST_TYPES.map((g) => g.name).join(', ')}.`
  ],
  handlers: {}
};

function startGameLoop() {
  gameState.phase = GAME_PHASES.INVESTIGATION;

  gameState.tickHandle = setInterval(() => {
    if (isTerminal()) {
      clearInterval(gameState.tickHandle);
      return;
    }

    gameState.timeElapsed += 1;
    tickPlayer(gameState.player, gameState.phase === GAME_PHASES.HUNT);

    const envEvent = updateEnvironment(gameState);
    if (envEvent) gameState.log.push(envEvent);

    updateGhostAI(gameState);

    if (gameState.phase === GAME_PHASES.HUNT && resolveLineOfSight(gameState)) {
      gameState.log.push('The ghost sees you in direct line-of-sight!');
      if (!getRoom(gameState.house, gameState.player.roomId).isSafeZone && Math.random() > 0.45) {
        gameState.player.alive = false;
        gameState.phase = GAME_PHASES.FAILURE;
        gameState.log.push('You were caught during the hunt. Mission failed.');
      }
    }

    if (gameState.player.sanity <= 0) {
      gameState.player.alive = false;
      gameState.phase = GAME_PHASES.FAILURE;
      gameState.log.push('You lost your sanity and collapsed in the dark.');
    }

    render(gameState);
  }, 1000);
}

function movePlayer(roomId) {
  if (isTerminal()) return;

  if (gameState.house.doorsLocked && gameState.phase === GAME_PHASES.HUNT) {
    gameState.log.push('Doors are locked during the hunt!');
    render(gameState);
    return;
  }

  const current = getRoom(gameState.house, gameState.player.roomId);
  const adjacent = neighbors(gameState.house, current.id).some((room) => room.id === roomId);

  if (!adjacent && roomId !== current.id) {
    gameState.log.push('You can only move to adjacent rooms.');
  } else {
    gameState.player.roomId = roomId;
    gameState.log.push(`Moved to ${getRoom(gameState.house, roomId).name}.`);
  }

  render(gameState);
}

function runScan() {
  if (isTerminal()) return;

  const emf = scanEMF(gameState);
  const temp = readTemperature(gameState);
  const motion = readMotion(gameState);

  gameState.log.push(`EMF reader peaks at level ${emf}.`);
  gameState.log.push(`Thermometer reports ${temp.toFixed(1)}°C.`);
  gameState.log.push(`Motion sensor: ${motion ? 'Triggered' : 'Clear'}.`);

  if (gameState.player.evidenceFound.size >= 3) {
    gameState.log.push('You have enough evidence to identify the entity.');
  }

  render(gameState);
}

function runSpirit() {
  if (isTerminal()) return;
  const response = runSpiritBox(gameState);
  gameState.log.push(`Spirit Box: ${response}`);
  render(gameState);
}

function moveRandom() {
  if (isTerminal()) return;
  const next = neighbors(gameState.house, gameState.player.roomId);
  if (!next.length) return;
  const target = next[Math.floor(Math.random() * next.length)];
  movePlayer(target.id);
}

function identifyGhost() {
  if (isTerminal()) return;

  const selected = [...gameState.player.selectedEvidence];
  const candidates = GHOST_TYPES.filter((g) => selected.every((e) => g.evidence.includes(e)));

  if (!candidates.length) {
    gameState.log.push('Journal combination does not match known ghost profiles.');
  } else if (candidates.some((c) => c.id === gameState.ghost.id)) {
    gameState.phase = GAME_PHASES.SUCCESS;
    gameState.log.push(`Correct identification: ${gameState.ghost.name}. Extract now!`);
  } else {
    gameState.phase = GAME_PHASES.FAILURE;
    gameState.player.alive = false;
    gameState.log.push(`Wrong identification. The ${gameState.ghost.name} attacked before extraction.`);
  }

  render(gameState);
}

function attemptEscape() {
  if (isTerminal()) return;

  const room = getRoom(gameState.house, gameState.player.roomId);
  if (room.isSafeZone && gameState.phase === GAME_PHASES.SUCCESS) {
    gameState.player.escaped = true;
    gameState.log.push('You reached the van and escaped successfully.');
  } else if (room.isSafeZone) {
    gameState.log.push('You can leave, but mission counts only after correct identification.');
  } else {
    gameState.log.push('No van nearby. Return to a safe zone to extract.');
  }

  render(gameState);
}

function isTerminal() {
  return gameState.phase === GAME_PHASES.FAILURE || gameState.player.escaped;
}

gameState.handlers = {
  moveTo: movePlayer
};

setupStaticUI(gameState, {
  onToggleEvidence: (e) => {
    toggleEvidenceSelection(gameState.player, e);
    render(gameState);
  },
  onScan: runScan,
  onSpiritBox: runSpirit,
  onMove: moveRandom,
  onIdentify: identifyGhost,
  onEscape: attemptEscape
});

startGameLoop();
