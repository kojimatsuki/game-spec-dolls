// scenes.js - シーン管理（タイトル/探索/イベント/エンディング）

import { getOpeningText, getOpeningLength, getHintForLevel, getEndingTexts } from './story.js';
import {
  getCurrentStage, getLocationsForCurrentStage, setStage,
  getAvailableStages, getCurrentStageIndex, checkLocationForDoll
} from './map.js';
import {
  findDoll, checkLevelUp, getLevel, getFoundCount, getTotalCount,
  isSecretFound, canFindSecret, initDolls
} from './dolls.js';
import {
  updateCompanionBar, updateStatusBar, showMessage, showTextSequence,
  showDollFound, showLevelUp, showStoryHint, showSecretFound, showCollection
} from './ui.js';
import {
  playBGM, stopBGM, playFoundSound, playStepSound, playMemorySound,
  playLevelUpSound, playSecretSound, playClickSound, initAudio
} from './audio.js';
import { MESSAGES } from './data.js';
import { initStory } from './story.js';
import { initMap } from './map.js';

const $ = id => document.getElementById(id);
let currentScene = 'title';

export function getCurrentScene() {
  return currentScene;
}

// タイトル画面
export function showTitle() {
  currentScene = 'title';
  const app = $('app');
  app.innerHTML = `
    <div class="title-screen">
      <div class="title-stars" id="title-stars"></div>
      <div class="title-moon">🌙</div>
      <div class="title-dolls">🧸 🪆 🎎</div>
      <h1 class="title-text">まいごの人形たち</h1>
      <h2 class="title-subtitle">〜やくそくのよる〜</h2>
      <button class="btn-start" id="btn-start">はじめる</button>
      <div class="title-hint">タップ/クリックで遊べます</div>
    </div>
  `;

  // 星のアニメーション
  const starsContainer = $('title-stars');
  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = Math.random() > 0.5 ? '⭐' : '✨';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 60 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.fontSize = (8 + Math.random() * 12) + 'px';
    starsContainer.appendChild(star);
  }

  $('btn-start').addEventListener('click', () => {
    initAudio();
    playClickSound();
    showOpening();
  });
}

// オープニング
function showOpening() {
  currentScene = 'opening';
  const app = $('app');
  app.innerHTML = `
    <div id="opening-screen" class="opening-screen">
      <div id="message-overlay" class="message-overlay visible">
        <div id="message-box" class="message-box"></div>
      </div>
    </div>
  `;

  const texts = [];
  for (let i = 0; i < getOpeningLength(); i++) {
    texts.push(getOpeningText(i));
  }

  playBGM('title');

  showTextSequence(texts, () => {
    startExploration();
  });
}

// 探索画面
export function startExploration() {
  currentScene = 'exploration';
  const stage = getCurrentStage();
  const bgTrack = 'stage' + stage.id;
  playBGM(bgTrack);
  renderExploration();
}

function renderExploration() {
  const stage = getCurrentStage();
  const locations = getLocationsForCurrentStage();

  const app = $('app');
  app.innerHTML = `
    <div class="explore-screen" style="background-color: ${stage.bgColor}">
      <div id="status-bar" class="status-bar"></div>
      <div class="explore-header">
        <h2 class="stage-name">${stage.bgEmojis} ${stage.name}</h2>
        <p class="stage-desc">${stage.description}</p>
      </div>
      <div id="stage-nav" class="stage-nav"></div>
      <div class="explore-map" id="explore-map">
        ${locations.map(loc => `
          <button class="map-point ${loc.glowing ? 'glowing' : ''} ${loc.hasDoll ? 'has-doll' : ''}"
                  data-location="${loc.id}"
                  style="left: ${loc.x}%; top: ${loc.y}%"
                  title="${loc.name}">
            <span class="point-emoji">${loc.emoji}</span>
            <span class="point-name">${loc.name}</span>
          </button>
        `).join('')}
      </div>
      <div class="explore-toolbar">
        <button class="btn-tool" id="btn-collection">📖 図鑑</button>
        <button class="btn-tool" id="btn-menu">☰ メニュー</button>
      </div>
      <div id="companion-bar" class="companion-bar"></div>
      <div id="message-overlay" class="message-overlay">
        <div id="message-box" class="message-box"></div>
      </div>
      <div id="collection-screen" class="collection-screen"></div>
    </div>
  `;

  updateStatusBar();
  updateCompanionBar();
  renderStageNav();
  bindExplorationEvents();
}

function renderStageNav() {
  const nav = $('stage-nav');
  if (!nav) return;
  const available = getAvailableStages();
  const currentIdx = getCurrentStageIndex();
  nav.innerHTML = '';

  available.forEach((stage) => {
    const idx = stage.id - 1;
    const btn = document.createElement('button');
    btn.className = `stage-btn ${idx === currentIdx ? 'active' : ''}`;
    btn.textContent = `${stage.name}`;
    btn.addEventListener('click', () => {
      playClickSound();
      if (setStage(idx)) {
        playBGM('stage' + stage.id);
        renderExploration();
      }
    });
    nav.appendChild(btn);
  });
}

function bindExplorationEvents() {
  // マップポイントのクリック
  let processing = false;
  document.querySelectorAll('.map-point').forEach(point => {
    point.addEventListener('click', async () => {
      if (processing) return;
      processing = true;
      playStepSound();
      const locationId = point.dataset.location;
      const doll = checkLocationForDoll(locationId);

      if (doll) {
        await handleDollFound(doll);
      } else if (locationId === 'house_gate' && getCurrentStage().id === 4 && canFindSecret()) {
        await showGoHomeChoice();
      } else {
        const msgs = MESSAGES.nothingHere;
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        await showMessage(randomMsg, '', 1500);
      }
      processing = false;
    });
  });

  // 図鑑ボタン
  $('btn-collection')?.addEventListener('click', () => {
    playClickSound();
    showCollection(() => {});
  });

  // メニューボタン
  $('btn-menu')?.addEventListener('click', () => {
    playClickSound();
    showGameMenu();
  });
}

async function handleDollFound(doll) {
  const found = findDoll(doll.id);
  if (!found) return;

  // 発見演出
  if (doll.secret) {
    playSecretSound();
    await showSecretFound(doll);
  } else {
    playFoundSound();
    await showDollFound(doll);
  }

  // レベルアップチェック（複数レベル同時対応）
  const newLevels = checkLevelUp();
  for (const newLevel of newLevels) {
    playLevelUpSound();
    await showLevelUp(newLevel);

    // ストーリーヒント
    const hint = getHintForLevel(newLevel);
    if (hint) {
      playMemorySound();
      await showStoryHint(hint);
    }
  }

  // シークレット人形発見 → 真エンディングへ
  if (doll.secret) {
    showEnding(true);
    return;
  }

  // シークレット以外全員発見後のヒント
  if (canFindSecret() && !isSecretFound() && getLevel() >= 4) {
    await showMessage('すべての仲間を見つけた！\n最後に不思議な光が見える...', '✨', 3000);
  }

  renderExploration();
}

async function showGoHomeChoice() {
  const overlay = $('message-overlay');
  const msgBox = $('message-box');
  if (!overlay || !msgBox) return;

  msgBox.innerHTML = `
    <div class="game-menu">
      <div class="msg-emoji">🏠</div>
      <div class="msg-text" style="margin-bottom:16px">
        ${isSecretFound()
          ? 'みんなで帰ろう！'
          : 'まだ不思議な光を調べていない...<br>このまま帰る？'}
      </div>
      <button class="menu-btn" id="choice-go-home">おうちに帰る</button>
      <button class="menu-btn" id="choice-keep-looking">もう少し探す</button>
    </div>
  `;
  overlay.classList.add('visible');

  return new Promise(resolve => {
    $('choice-go-home')?.addEventListener('click', () => {
      overlay.classList.remove('visible');
      playClickSound();
      showEnding(isSecretFound());
      resolve();
    });
    $('choice-keep-looking')?.addEventListener('click', () => {
      overlay.classList.remove('visible');
      playClickSound();
      resolve();
    });
  });
}

function showGameMenu() {
  const overlay = $('message-overlay');
  const msgBox = $('message-box');
  if (!overlay || !msgBox) return;

  msgBox.innerHTML = `
    <div class="game-menu">
      <h3>メニュー</h3>
      <button class="menu-btn" id="menu-collection">📖 人形図鑑</button>
      <button class="menu-btn" id="menu-story">📜 ストーリー</button>
      <button class="menu-btn" id="menu-close">✕ とじる</button>
    </div>
  `;
  overlay.classList.add('visible');

  $('menu-collection')?.addEventListener('click', () => {
    overlay.classList.remove('visible');
    playClickSound();
    showCollection(() => {});
  });

  $('menu-story')?.addEventListener('click', () => {
    overlay.classList.remove('visible');
    playClickSound();
    showCollection(() => {});
  });

  $('menu-close')?.addEventListener('click', () => {
    overlay.classList.remove('visible');
    playClickSound();
  });
}

// エンディング
export function showEnding(isTrue) {
  currentScene = 'ending';
  stopBGM();
  playBGM('ending');

  const app = $('app');
  const bgColor = isTrue ? '#1a1030' : '#0a0a1a';
  app.innerHTML = `
    <div class="ending-screen" style="background-color: ${bgColor}">
      <div id="message-overlay" class="message-overlay visible">
        <div id="message-box" class="message-box"></div>
      </div>
    </div>
  `;

  const texts = getEndingTexts(isTrue);
  showTextSequence(texts, () => {
    showEndingCredits(isTrue);
  });
}

function showEndingCredits(isTrue) {
  const app = $('app');
  app.innerHTML = `
    <div class="credits-screen">
      ${isTrue ? '<div class="credits-crown">👑</div>' : ''}
      <h2 class="credits-title">${isTrue ? '🌟 真エンディング 🌟' : 'エンディング'}</h2>
      <div class="credits-dolls">
        ${isTrue ? '🧸🪆🎎🤖🐰🎪👸🌟' : '🧸🪆🎎🤖🐰🎪👸'}
      </div>
      <p class="credits-text">
        見つけた人形: ${getFoundCount()}/${getTotalCount()}
      </p>
      ${isTrue ? '<p class="credits-rank">🌟 あなたは1位です 🌟</p>' : ''}
      <p class="credits-message">
        ${isTrue ? 'やくそくを守れば、きっとまた会えるよ。' : 'いつか、きっと迎えが来るよ。'}
      </p>
      <button class="btn-start" id="btn-restart">もういちど遊ぶ</button>
      <div class="credits-thanks">
        「まいごの人形たち 〜やくそくのよる〜」<br>
        おしまい
      </div>
    </div>
  `;

  $('btn-restart')?.addEventListener('click', () => {
    playClickSound();
    stopBGM();
    // 同期的にリセット（レースコンディション修正）
    initDolls();
    initStory();
    initMap();
    showTitle();
  });
}
