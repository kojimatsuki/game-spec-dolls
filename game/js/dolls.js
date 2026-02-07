// dolls.js - 人形データ・コレクション管理

import { DOLLS } from './data.js';

let foundDolls = new Set();
let level = 1;
let exp = 0;

const LEVEL_THRESHOLDS = [0, 0, 2, 5, 7]; // Lv1:0, Lv2:2体, Lv3:5体, Lv4:7体

export function initDolls() {
  foundDolls = new Set();
  level = 1;
  exp = 0;
}

export function findDoll(dollId) {
  if (foundDolls.has(dollId)) return null;
  foundDolls.add(dollId);
  exp = foundDolls.size;
  const doll = getDollData(dollId);
  return doll;
}

export function isDollFound(dollId) {
  return foundDolls.has(dollId);
}

export function getDollData(dollId) {
  return DOLLS.find(d => d.id === dollId);
}

export function getFoundDolls() {
  return DOLLS.filter(d => foundDolls.has(d.id));
}

export function getAllDolls() {
  return DOLLS;
}

export function getFoundCount() {
  return foundDolls.size;
}

export function getTotalCount() {
  return DOLLS.length;
}

export function getLevel() {
  return level;
}

export function getExp() {
  return exp;
}

// 複数レベル同時に上がる場合も対応。上がった全レベルを配列で返す
export function checkLevelUp() {
  const levels = [];
  while (level < 4) {
    const nextLevel = level + 1;
    if (exp >= LEVEL_THRESHOLDS[nextLevel]) {
      level = nextLevel;
      levels.push(level);
    } else {
      break;
    }
  }
  return levels;
}

export function getDollsForStage(stageId) {
  return DOLLS.filter(d => d.stage === stageId);
}

export function getStageDollsFound(stageId) {
  return DOLLS.filter(d => d.stage === stageId && foundDolls.has(d.id));
}

export function isStageComplete(stageId) {
  const stageDolls = getDollsForStage(stageId);
  return stageDolls.every(d => foundDolls.has(d.id));
}

export function isSecretFound() {
  return foundDolls.has('hikari');
}

export function canFindSecret() {
  const nonSecretDolls = DOLLS.filter(d => !d.secret);
  return nonSecretDolls.every(d => foundDolls.has(d.id));
}

export function getDollAtLocation(locationId) {
  return DOLLS.find(d => d.location === locationId && !foundDolls.has(d.id));
}
