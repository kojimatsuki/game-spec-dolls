// ui.js - UI描画・人形図鑑・メッセージ表示

import { getFoundDolls, getAllDolls, getLevel, getFoundCount, getTotalCount, isDollFound } from './dolls.js';
import { getRevealedHints } from './story.js';
import { getAvailableStages, getCurrentStageIndex, getCurrentStage } from './map.js';

const $ = id => document.getElementById(id);

// 画面下部の仲間一覧を更新
export function updateCompanionBar() {
  const bar = $('companion-bar');
  if (!bar) return;
  const found = getFoundDolls();
  bar.innerHTML = '';
  if (found.length === 0) {
    bar.innerHTML = '<span class="companion-empty">まだ仲間がいない...</span>';
    return;
  }
  found.forEach(doll => {
    const span = document.createElement('span');
    span.className = 'companion-doll';
    span.textContent = doll.emoji;
    span.title = doll.name;
    bar.appendChild(span);
  });
}

// ステータスバー更新
export function updateStatusBar() {
  const bar = $('status-bar');
  if (!bar) return;
  const level = getLevel();
  const found = getFoundCount();
  const total = getTotalCount();
  bar.innerHTML = `
    <span class="status-level">Lv.${level}</span>
    <span class="status-dolls">🧸 ${found}/${total}</span>
    <span class="status-stage">${getCurrentStage().name}</span>
  `;
}

// メッセージ表示
export function showMessage(text, emoji = '', duration = 2500) {
  return new Promise(resolve => {
    const overlay = $('message-overlay');
    const msgBox = $('message-box');
    if (!overlay || !msgBox) { resolve(); return; }

    msgBox.innerHTML = `
      ${emoji ? `<div class="msg-emoji">${emoji}</div>` : ''}
      <div class="msg-text">${text.replace(/\n/g, '<br>')}</div>
    `;
    overlay.classList.add('visible');

    const dismiss = () => {
      overlay.classList.remove('visible');
      overlay.removeEventListener('click', dismiss);
      setTimeout(resolve, 300);
    };

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
    overlay.addEventListener('click', dismiss);
  });
}

// テキスト送り形式のメッセージ
export function showTextSequence(texts, onComplete) {
  let index = 0;
  const overlay = $('message-overlay');
  const msgBox = $('message-box');
  if (!overlay || !msgBox) { onComplete(); return; }

  function showNext() {
    if (index >= texts.length) {
      overlay.classList.remove('visible');
      overlay.removeEventListener('click', advance);
      onComplete();
      return;
    }
    const item = texts[index];
    msgBox.innerHTML = `
      ${item.emoji ? `<div class="msg-emoji">${item.emoji}</div>` : ''}
      <div class="msg-text">${item.text.replace(/\n/g, '<br>')}</div>
      <div class="msg-hint">タップして次へ</div>
    `;
    if (item.bg) {
      overlay.style.backgroundColor = item.bg;
    }
    overlay.classList.add('visible');
  }

  function advance() {
    index++;
    showNext();
  }

  overlay.addEventListener('click', advance);
  showNext();
}

// 人形図鑑画面
export function showCollection(onClose) {
  const screen = $('collection-screen');
  if (!screen) return;
  const allDolls = getAllDolls();

  let html = `
    <div class="collection-header">
      <h2>人形図鑑</h2>
      <span class="collection-count">${getFoundCount()}/${getTotalCount()}</span>
      <button id="collection-close" class="btn-close">✕</button>
    </div>
    <div class="collection-grid">
  `;

  allDolls.forEach(doll => {
    const found = isDollFound(doll.id);
    html += `
      <div class="collection-card ${found ? 'found' : 'not-found'}">
        <div class="card-emoji">${found ? doll.emoji : '❓'}</div>
        <div class="card-name">${found ? doll.name : '？？？'}</div>
        ${found ? `<div class="card-desc">${doll.description}</div>` : '<div class="card-desc">まだ見つけていない...</div>'}
      </div>
    `;
  });

  // ストーリーヒント
  const hints = getRevealedHints();
  if (hints.length > 0) {
    html += `</div><div class="collection-hints"><h3>記憶のかけら</h3>`;
    hints.forEach(hint => {
      html += `
        <div class="hint-card">
          <span class="hint-emoji">${hint.emoji}</span>
          <div>
            <div class="hint-title">${hint.title}</div>
            <div class="hint-text">${hint.text.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      `;
    });
  }

  html += '</div>';
  screen.innerHTML = html;
  screen.classList.add('visible');

  $('collection-close').addEventListener('click', () => {
    screen.classList.remove('visible');
    if (onClose) onClose();
  });
}

// ステージ選択UI
export function showStageSelect(onSelect) {
  const stages = getAvailableStages();
  const currentIdx = getCurrentStageIndex();

  const nav = $('stage-nav');
  if (!nav) return;
  nav.innerHTML = '';

  stages.forEach((stage, i) => {
    const btn = document.createElement('button');
    btn.className = `stage-btn ${i === currentIdx ? 'active' : ''}`;
    btn.textContent = `${stage.bgEmojis.split('').slice(0, 1)} ${stage.name}`;
    btn.addEventListener('click', () => onSelect(STAGES_MAP[stage.id]));
    nav.appendChild(btn);
  });
}

const STAGES_MAP = { 1: 0, 2: 1, 3: 2, 4: 3 };

// 人形発見演出
export function showDollFound(doll) {
  return new Promise(resolve => {
    const overlay = $('message-overlay');
    const msgBox = $('message-box');
    if (!overlay || !msgBox) { resolve(); return; }

    msgBox.innerHTML = `
      <div class="found-animation">
        <div class="found-sparkle">✨✨✨</div>
        <div class="found-emoji">${doll.emoji}</div>
        <div class="found-name">${doll.name}を見つけた！</div>
        <div class="found-message">${doll.foundMessage}</div>
        <div class="found-desc">${doll.description}</div>
        <div class="msg-hint">タップして続ける</div>
      </div>
    `;
    overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
    overlay.classList.add('visible');

    const dismiss = () => {
      overlay.classList.remove('visible');
      overlay.removeEventListener('click', dismiss);
      setTimeout(resolve, 300);
    };
    overlay.addEventListener('click', dismiss);
  });
}

// レベルアップ演出
export function showLevelUp(newLevel) {
  return new Promise(resolve => {
    const overlay = $('message-overlay');
    const msgBox = $('message-box');
    if (!overlay || !msgBox) { resolve(); return; }

    msgBox.innerHTML = `
      <div class="levelup-animation">
        <div class="levelup-sparkle">⭐✨⭐</div>
        <div class="levelup-text">レベルアップ！</div>
        <div class="levelup-level">Lv.${newLevel}</div>
        <div class="levelup-info">新しい場所に行けるようになった！</div>
        <div class="msg-hint">タップして続ける</div>
      </div>
    `;
    overlay.style.backgroundColor = 'rgba(0,0,30,0.9)';
    overlay.classList.add('visible');

    const dismiss = () => {
      overlay.classList.remove('visible');
      overlay.removeEventListener('click', dismiss);
      setTimeout(resolve, 300);
    };
    overlay.addEventListener('click', dismiss);
  });
}

// ストーリーヒント演出
export function showStoryHint(hint) {
  return new Promise(resolve => {
    const overlay = $('message-overlay');
    const msgBox = $('message-box');
    if (!overlay || !msgBox) { resolve(); return; }

    msgBox.innerHTML = `
      <div class="story-hint-animation">
        <div class="story-hint-emoji">${hint.emoji}</div>
        <div class="story-hint-title">${hint.title}</div>
        <div class="story-hint-text">${hint.text.replace(/\n/g, '<br>')}</div>
        <div class="msg-hint">タップして続ける</div>
      </div>
    `;
    overlay.style.backgroundColor = 'rgba(10,0,20,0.95)';
    overlay.classList.add('visible');

    const dismiss = () => {
      overlay.classList.remove('visible');
      overlay.removeEventListener('click', dismiss);
      setTimeout(resolve, 300);
    };
    overlay.addEventListener('click', dismiss);
  });
}

// シークレット発見の特別演出
export function showSecretFound(doll) {
  return new Promise(resolve => {
    const overlay = $('message-overlay');
    const msgBox = $('message-box');
    if (!overlay || !msgBox) { resolve(); return; }

    msgBox.innerHTML = `
      <div class="secret-animation">
        <div class="secret-flash"></div>
        <div class="secret-sparkle">🌟✨🌟✨🌟</div>
        <div class="secret-emoji">${doll.emoji}</div>
        <div class="secret-name">シークレットの人形</div>
        <div class="secret-doll-name">${doll.name}を見つけた！</div>
        <div class="secret-message">${doll.foundMessage}</div>
        <div class="msg-hint">タップして続ける</div>
      </div>
    `;
    overlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
    overlay.classList.add('visible');

    const dismiss = () => {
      overlay.classList.remove('visible');
      overlay.removeEventListener('click', dismiss);
      setTimeout(resolve, 300);
    };
    overlay.addEventListener('click', dismiss);
  });
}
