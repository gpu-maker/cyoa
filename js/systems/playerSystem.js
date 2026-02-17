import { EVIDENCE_TYPES } from '../data/constants.js';

export function createPlayer(startRoomId) {
  return {
    roomId: startRoomId,
    sanity: 100,
    flashlightBattery: 100,
    speed: 1,
    evidenceFound: new Set(),
    selectedEvidence: new Set(),
    alive: true,
    escaped: false
  };
}

export function tickPlayer(player, inHunt) {
  const sanityDrain = inHunt ? 2.4 : 0.45;
  const batteryDrain = inHunt ? 2.7 : 0.7;

  player.sanity = Math.max(0, +(player.sanity - sanityDrain).toFixed(1));
  player.flashlightBattery = Math.max(0, +(player.flashlightBattery - batteryDrain).toFixed(1));

  if (player.flashlightBattery <= 0) {
    player.sanity = Math.max(0, +(player.sanity - 0.8).toFixed(1));
  }
}

export function toggleEvidenceSelection(player, evidence) {
  if (!EVIDENCE_TYPES.includes(evidence)) return;

  if (player.selectedEvidence.has(evidence)) {
    player.selectedEvidence.delete(evidence);
  } else {
    player.selectedEvidence.add(evidence);
  }
}
