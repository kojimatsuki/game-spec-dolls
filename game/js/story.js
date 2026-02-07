// story.js - ストーリー進行・約束の秘密の解放

import { STORY_HINTS, OPENING_TEXTS, ENDING_NORMAL, ENDING_TRUE } from './data.js';

let revealedHints = new Set();
let openingIndex = 0;
let endingIndex = 0;

export function initStory() {
  revealedHints = new Set();
  openingIndex = 0;
  endingIndex = 0;
}

export function getOpeningText(index) {
  if (index < OPENING_TEXTS.length) {
    return OPENING_TEXTS[index];
  }
  return null;
}

export function getOpeningLength() {
  return OPENING_TEXTS.length;
}

export function getHintForLevel(level) {
  const hint = STORY_HINTS.find(h => h.level === level);
  if (hint && !revealedHints.has(level)) {
    revealedHints.add(level);
    return hint;
  }
  return null;
}

export function getRevealedHints() {
  return STORY_HINTS.filter(h => revealedHints.has(h.level));
}

export function getEndingTexts(isTrue) {
  return isTrue ? ENDING_TRUE : ENDING_NORMAL;
}

export function getAllHintsRevealed() {
  return STORY_HINTS.every(h => revealedHints.has(h.level));
}
