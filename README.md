# Night Watch: Ghost Investigation

A browser-based horror investigation prototype inspired by Phasmophobia-style gameplay.

## Features Implemented

- **Core gameplay loop**
  - Enter haunted location (procedural house)
  - Search rooms for evidence
  - Use investigation tools
  - Identify ghost type via journal
  - Survive hunt phases
  - Escape from safe zone

- **Investigation devices**
  - EMF reader with value output
  - Spirit box response system
  - Room temperature simulation
  - Flashlight battery drain tied to sanity pressure
  - Motion sensor readings
  - Evidence journal checklist + likely ghost filter

- **Ghost AI system**
  - Data-driven ghost personalities with strengths/weaknesses
  - Behavior-tree-style decision flow:
    - Wandering
    - Stalking
    - Hunting
  - Line-of-sight threat checks
  - Sound sensitivity influencing aggression

- **Environment + horror systems**
  - Procedural room-grid generation
  - Temperature drift by room
  - Door lock interactions during hunt state
  - Light breaker/flicker events
  - Safe zone vs danger zone room tags
  - Dynamic scare log events and object/audio-style cues

## System Architecture

```text
index.html + style.css
└── js/game.js (orchestration, loop, event bindings)
    ├── js/data/constants.js (global constants, evidence, tools, phases)
    ├── js/data/ghosts.js (ghost definitions, personalities, thresholds)
    ├── js/systems/houseGenerator.js (procedural map + adjacency)
    ├── js/systems/playerSystem.js (sanity, battery, journal selection)
    ├── js/systems/evidenceSystem.js (EMF/temp/spirit/motion readings)
    ├── js/systems/ghostAI.js (state transitions + movement logic)
    ├── js/systems/horrorSystem.js (scares, light/temperature changes, LOS)
    └── js/ui/render.js (DOM rendering and controls)
```

### Data Model Overview

- `house`
  - `size`, `rooms[]`, `ghostRoom`, `breakerRoom`, `doorsLocked`
- `room`
  - `id`, `name`, `x`, `y`, `tempC`, `lightOn`, `isSafeZone`
- `ghost`
  - `id`, `name`, `evidence[]`, `huntThreshold`, `soundSensitivity`, `state`, `roomId`
- `player`
  - `roomId`, `sanity`, `flashlightBattery`, `evidenceFound`, `selectedEvidence`, `alive`, `escaped`
- `gameState`
  - all systems + loop time, phase, and activity log

## Setup Instructions

No build tooling is required.

1. Open `index.html` in a modern browser.
2. Click room tiles to move through the house (adjacent movement only).
3. Use **Scan Room** and **Use Spirit Box** to gather evidence.
4. Toggle found evidence in the journal and click **Identify Ghost**.
5. Escape via a safe room after a correct identification.

## Notes for Extension

- Add a new ghost by appending to `js/data/ghosts.js`.
- Introduce new evidence by expanding `EVIDENCE_TYPES` and relevant scanners.
- Replace placeholders under `assets/audio` and `assets/images` for production polish.
