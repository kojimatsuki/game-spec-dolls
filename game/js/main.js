// main.js - ゲーム初期化・メインループ

import { initDolls } from './dolls.js';
import { initStory } from './story.js';
import { initMap } from './map.js';
import { showTitle } from './scenes.js';

function init() {
  initDolls();
  initStory();
  initMap();
  showTitle();
}

// DOMContentLoaded で初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
