// map.js - マップ・エリア移動ロジック

import { STAGES } from './data.js';
import { getLevel, getDollAtLocation, isDollFound, canFindSecret } from './dolls.js';

let currentStageIndex = 0;

export function initMap() {
  currentStageIndex = 0;
}

export function getCurrentStage() {
  return STAGES[currentStageIndex];
}

export function getCurrentStageIndex() {
  return currentStageIndex;
}

export function setStage(index) {
  if (index >= 0 && index < STAGES.length && STAGES[index].requiredLevel <= getLevel()) {
    currentStageIndex = index;
    return true;
  }
  return false;
}

export function getAvailableStages() {
  const level = getLevel();
  return STAGES.filter(s => s.requiredLevel <= level);
}

export function getLocationsForCurrentStage() {
  const stage = getCurrentStage();
  return stage.locations.map(loc => {
    const doll = getDollAtLocation(loc.id);
    const isSecret = loc.id === 'secret_place';
    const secretAvailable = canFindSecret();
    let glowing = false;
    let available = true;

    if (doll) {
      if (isSecret && !secretAvailable) {
        available = false;
      } else {
        glowing = true;
      }
    }

    return {
      ...loc,
      hasDoll: !!doll && available,
      glowing: glowing && available,
      dollId: doll ? doll.id : null
    };
  });
}

export function checkLocationForDoll(locationId) {
  const doll = getDollAtLocation(locationId);
  if (!doll) return null;
  if (doll.location === 'secret_place' && !canFindSecret()) return null;
  return doll;
}

export function canGoToStage(stageIndex) {
  return stageIndex >= 0 && stageIndex < STAGES.length && STAGES[stageIndex].requiredLevel <= getLevel();
}

export function getStageCount() {
  return STAGES.length;
}

export function getStageByIndex(index) {
  return STAGES[index];
}
