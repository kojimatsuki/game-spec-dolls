// audio.js - Web Audio API サウンド管理

let audioCtx = null;
let bgmGain = null;
let sfxGain = null;
let currentBgmOscillators = [];
let bgmInterval = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    bgmGain = audioCtx.createGain();
    bgmGain.gain.value = 0.15;
    bgmGain.connect(audioCtx.destination);
    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.3;
    sfxGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

export function initAudio() {
  getContext();
}

function playNote(freq, duration, type = 'sine', gainNode = sfxGain, startTime = 0) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0.001, ctx.currentTime + startTime);
  env.gain.linearRampToValueAtTime(0.5, ctx.currentTime + startTime + 0.05);
  env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
  osc.connect(env);
  env.connect(gainNode);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
  return osc;
}

// 人形発見 - 温かいチャイム音
export function playFoundSound() {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playNote(freq, 0.6, 'sine', sfxGain, i * 0.15);
  });
}

// 足音
export function playStepSound() {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 200 + Math.random() * 100;
  env.gain.setValueAtTime(0.1, ctx.currentTime);
  env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(env);
  env.connect(sfxGain);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// 約束の記憶 - 切ないピアノ風
export function playMemorySound() {
  const notes = [392, 440, 494, 523, 494, 440, 392]; // G4-A4-B4-C5-B4-A4-G4
  notes.forEach((freq, i) => {
    playNote(freq, 0.8, 'triangle', sfxGain, i * 0.3);
  });
}

// レベルアップ
export function playLevelUpSound() {
  const notes = [262, 330, 392, 523, 659, 784]; // C4-E4-G4-C5-E5-G5
  notes.forEach((freq, i) => {
    playNote(freq, 0.4, 'square', sfxGain, i * 0.12);
  });
}

// シークレット発見 - ファンファーレ
export function playSecretSound() {
  const melody = [
    [523, 0.3], [523, 0.15], [523, 0.15], [659, 0.3],
    [784, 0.6], [659, 0.3], [784, 0.3], [1047, 0.9]
  ];
  let time = 0;
  melody.forEach(([freq, dur]) => {
    playNote(freq, dur + 0.1, 'square', sfxGain, time);
    playNote(freq * 0.5, dur + 0.1, 'triangle', sfxGain, time);
    time += dur;
  });
}

// クリック音
export function playClickSound() {
  playNote(800, 0.08, 'sine', sfxGain, 0);
}

// オルゴール風BGM
const BGM_MELODIES = {
  title: [
    392, 440, 494, 523, 494, 440, 392, 0,
    330, 392, 440, 494, 440, 392, 330, 0,
    262, 330, 392, 440, 523, 494, 440, 392
  ],
  stage1: [
    262, 294, 330, 262, 0, 262, 294, 330, 262, 0,
    330, 349, 392, 0, 330, 349, 392, 0,
    392, 440, 392, 349, 330, 262, 0, 0
  ],
  stage2: [
    392, 440, 494, 523, 0, 494, 440, 392, 0,
    330, 349, 392, 440, 0, 392, 349, 330, 0,
    440, 494, 523, 587, 523, 494, 440, 0
  ],
  stage3: [
    330, 294, 262, 294, 330, 0, 330, 294, 262, 0,
    294, 330, 349, 330, 294, 0, 262, 0,
    330, 392, 349, 330, 294, 262, 0, 0
  ],
  stage4: [
    523, 494, 440, 392, 440, 494, 523, 0,
    587, 523, 494, 440, 494, 523, 587, 0,
    659, 587, 523, 494, 523, 587, 659, 784
  ],
  ending: [
    392, 440, 494, 523, 587, 659, 784, 0,
    784, 659, 587, 523, 494, 440, 392, 0,
    523, 587, 659, 784, 880, 784, 659, 523
  ]
};

export function playBGM(trackName) {
  stopBGM();
  const melody = BGM_MELODIES[trackName] || BGM_MELODIES.title;
  let noteIndex = 0;
  const playNext = () => {
    const freq = melody[noteIndex % melody.length];
    if (freq > 0) {
      playNote(freq, 0.35, 'sine', bgmGain, 0);
      // harmony
      playNote(freq * 0.5, 0.35, 'triangle', bgmGain, 0);
    }
    noteIndex++;
  };
  playNext();
  bgmInterval = setInterval(playNext, 400);
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

export function setBGMVolume(vol) {
  if (bgmGain) bgmGain.gain.value = vol;
}

export function setSFXVolume(vol) {
  if (sfxGain) sfxGain.gain.value = vol;
}
