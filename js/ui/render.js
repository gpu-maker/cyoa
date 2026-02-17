import { EVIDENCE_TYPES, TOOLS } from '../data/constants.js';
import { getRoom } from '../systems/houseGenerator.js';

export function setupStaticUI(gameState, handlers) {
  const toolList = document.getElementById('toolList');
  toolList.innerHTML = TOOLS.map((tool) => `
    <div class="tool-card">
      <strong>${tool.name}</strong>
      <p>${tool.desc}</p>
    </div>
  `).join('');

  const evidenceChecklist = document.getElementById('evidenceChecklist');
  evidenceChecklist.innerHTML = EVIDENCE_TYPES.map((evidence) => `
    <label>
      <input type="checkbox" data-evidence="${evidence}" />
      ${evidence}
    </label>
  `).join('');

  evidenceChecklist.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => handlers.onToggleEvidence(input.dataset.evidence));
  });

  document.getElementById('scanBtn').addEventListener('click', handlers.onScan);
  document.getElementById('listenBtn').addEventListener('click', handlers.onSpiritBox);
  document.getElementById('moveBtn').addEventListener('click', handlers.onMove);
  document.getElementById('identifyBtn').addEventListener('click', handlers.onIdentify);
  document.getElementById('escapeBtn').addEventListener('click', handlers.onEscape);

  render(gameState);
}

export function render(gameState) {
  renderTopStatus(gameState);
  renderGrid(gameState);
  renderEvidence(gameState);
  renderLikelyGhosts(gameState);
  renderRoomInfo(gameState);
  renderLog(gameState);
}

function renderTopStatus(gameState) {
  document.getElementById('phaseLabel').textContent = `Phase: ${gameState.phase}`;
  document.getElementById('timerLabel').textContent = `Time: ${formatTime(gameState.timeElapsed)}`;
  document.getElementById('sanityLabel').textContent = `Sanity: ${Math.round(gameState.player.sanity)}% | Battery: ${Math.round(gameState.player.flashlightBattery)}%`;
}

function renderGrid(gameState) {
  const grid = document.getElementById('houseGrid');
  grid.style.gridTemplateColumns = `repeat(${gameState.house.size}, 1fr)`;
  grid.innerHTML = '';

  gameState.house.rooms.forEach((room) => {
    const cell = document.createElement('button');
    cell.className = 'room-cell';
    const isPlayer = room.id === gameState.player.roomId;
    const isGhost = room.id === gameState.ghost.roomId;

    if (isPlayer) cell.classList.add('player-room');
    if (isGhost && gameState.phase === 'Ghost Hunt') cell.classList.add('ghost-room');
    if (!room.lightOn) cell.classList.add('lights-off');
    if (room.isSafeZone) cell.classList.add('safe-room');

    cell.textContent = room.name;
    cell.addEventListener('click', () => gameState.handlers.moveTo(room.id));
    grid.appendChild(cell);
  });
}

function renderEvidence(gameState) {
  const checks = document.querySelectorAll('#evidenceChecklist input');
  checks.forEach((check) => {
    const evidence = check.dataset.evidence;
    check.checked = gameState.player.selectedEvidence.has(evidence);
    check.parentElement.classList.toggle('found-evidence', gameState.player.evidenceFound.has(evidence));
  });
}

function renderLikelyGhosts(gameState) {
  const label = document.getElementById('ghostGuessLabel');
  const selected = [...gameState.player.selectedEvidence];

  const likely = gameState.ghostRoster
    .filter((ghost) => selected.every((evidence) => ghost.evidence.includes(evidence)))
    .map((ghost) => ghost.name);

  label.textContent = `Likely ghosts: ${likely.length ? likely.join(', ') : 'Unknown'}`;
}

function renderRoomInfo(gameState) {
  const room = getRoom(gameState.house, gameState.player.roomId);
  const ghostDistance = distance(room.id, gameState.ghost.roomId);
  const safeStatus = room.isSafeZone ? 'Safe Zone' : 'Danger Zone';
  const doorStatus = gameState.house.doorsLocked ? 'Locked (hunt)' : 'Unlocked';

  document.getElementById('roomInfo').textContent = `Room: ${room.name} | Temp: ${room.tempC.toFixed(1)}°C | ${safeStatus} | Doors: ${doorStatus} | Ghost proximity: ${ghostDistance}`;
}

function renderLog(gameState) {
  const ul = document.getElementById('logList');
  ul.innerHTML = gameState.log.slice(-10).reverse().map((entry) => `<li>${entry}</li>`).join('');
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function distance(a, b) {
  const [ax, ay] = a.split('-').map(Number);
  const [bx, by] = b.split('-').map(Number);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}
