// data.js - ゲームデータ定義

// 人形データ
export const DOLLS = [
  {
    id: 'pon',
    name: 'ポン',
    emoji: '🧸',
    description: 'くまのぬいぐるみ。いつも元気いっぱいだったけど、今は段ボールの中で泣いている。',
    stage: 1,
    location: 'cardboard',
    hint: '段ボールの中から泣き声が聞こえる...',
    foundMessage: '「うぅ...暗くてこわかったよぉ。ありがとう、見つけてくれて！」',
    secret: false
  },
  {
    id: 'matochan',
    name: 'マトちゃん',
    emoji: '🪆',
    description: 'マトリョーシカのお人形。ロシアからやってきた、おしゃべり好きな人形。',
    stage: 1,
    location: 'garbage_bag',
    hint: 'ゴミ袋の隙間から何か見えている...',
    foundMessage: '「やっと出られたわ！ゴミ袋の中はせまくて大変だったの」',
    secret: false
  },
  {
    id: 'ohinachan',
    name: 'おひなちゃん',
    emoji: '🎎',
    description: '日本人形。おしとやかで優しい人形。砂場に埋まっていた。',
    stage: 2,
    location: 'sandbox',
    hint: '砂場の中に何か埋まっている...',
    foundMessage: '「お砂の中は冷たかったけれど...見つけてくれて、嬉しゅうございます」',
    secret: false
  },
  {
    id: 'gachan',
    name: 'ガチャン',
    emoji: '🤖',
    description: 'ロボットのおもちゃ。ちょっとぶっきらぼうだけど、本当は優しい。',
    stage: 2,
    location: 'swing',
    hint: 'ブランコに何か引っかかっている...',
    foundMessage: '「ワタシ...助ケテモラエルトハ思ワナカッタ。アリガトウ」',
    secret: false
  },
  {
    id: 'mimi',
    name: 'ミミ',
    emoji: '🐰',
    description: 'うさぎのぬいぐるみ。とても怖がりで、いつも震えている。',
    stage: 2,
    location: 'slide',
    hint: '滑り台の下で何かが震えている...',
    foundMessage: '「ひっ...あ、人形さん？よかった...怖くないんだね」',
    secret: false
  },
  {
    id: 'patch',
    name: 'パッチ',
    emoji: '🎪',
    description: 'ピエロ人形。いつもみんなを笑わせてくれる明るい人形。',
    stage: 3,
    location: 'theater',
    hint: '古い劇場の前に誰かが倒れている...',
    foundMessage: '「アハハ...やっと見つけてもらえた。ピエロは笑うのが仕事だけど、ひとりは寂しかったなぁ」',
    secret: false
  },
  {
    id: 'rosa',
    name: 'ローザ',
    emoji: '👸',
    description: 'お姫様人形。気品があるけど、本当はとても寂しがりや。',
    stage: 3,
    location: 'window',
    hint: '壊れた窓の向こうに何か見える...',
    foundMessage: '「...こんな姿を見られるなんて恥ずかしいわ。でも...ありがとう」',
    secret: false
  },
  {
    id: 'hikari',
    name: 'ヒカリ',
    emoji: '🌟',
    description: '光る人形。すべての人形たちの希望の光。みんなの約束を覚えている。',
    stage: 4,
    location: 'secret_place',
    hint: 'どこかで不思議な光が...',
    foundMessage: '「ずっと待っていたよ。みんなを集めてくれたんだね。さあ、おうちに帰ろう」',
    secret: true
  }
];

// ステージデータ（座標を十分離して配置）
export const STAGES = [
  {
    id: 1,
    name: 'ゴミ捨て場',
    subtitle: 'はじまりの場所',
    bgColor: '#0a0a1a',
    bgEmojis: '🗑️📦🌙',
    description: '夜のゴミ捨て場。段ボールやゴミ袋の間に、捨てられた人形たちがいるかもしれない。',
    requiredLevel: 1,
    locations: [
      { id: 'cardboard', name: '段ボール', emoji: '📦', x: 25, y: 20, description: '大きな段ボールが置いてある' },
      { id: 'garbage_bag', name: 'ゴミ袋', emoji: '🗑️', x: 72, y: 70, description: 'ゴミ袋が積まれている' },
      { id: 'streetlight', name: '街灯', emoji: '🏮', x: 70, y: 18, description: '街灯がぼんやり光っている' },
      { id: 'fence', name: 'フェンス', emoji: '🚧', x: 25, y: 72, description: '古びたフェンスがある' }
    ]
  },
  {
    id: 2,
    name: '夜の公園',
    subtitle: '星が見える場所',
    bgColor: '#0d1025',
    bgEmojis: '🌳🌙⭐',
    description: '暗い公園。ブランコや滑り台の影に人形が隠れているかもしれない。',
    requiredLevel: 2,
    locations: [
      { id: 'sandbox', name: '砂場', emoji: '⛱️', x: 22, y: 22, description: '砂場が広がっている' },
      { id: 'swing', name: 'ブランコ', emoji: '🎠', x: 75, y: 20, description: 'ブランコが風に揺れている' },
      { id: 'slide', name: '滑り台', emoji: '🛝', x: 75, y: 72, description: '大きな滑り台がある' },
      { id: 'bench', name: 'ベンチ', emoji: '🪑', x: 22, y: 72, description: '古いベンチがある' },
      { id: 'tree', name: '大きな木', emoji: '🌳', x: 50, y: 46, description: '大きな木が立っている' }
    ]
  },
  {
    id: 3,
    name: '忘れられた路地裏',
    subtitle: '雨の降る場所',
    bgColor: '#111528',
    bgEmojis: '🏚️🌧️💧',
    description: '古い路地裏。雨が降っている。寂しい場所だけど、仲間が元気をくれる。',
    requiredLevel: 3,
    locations: [
      { id: 'theater', name: '古い劇場', emoji: '🎭', x: 25, y: 22, description: '閉まったままの古い劇場' },
      { id: 'window', name: '壊れた窓', emoji: '🪟', x: 75, y: 22, description: '窓ガラスが割れている建物' },
      { id: 'puddle', name: '水たまり', emoji: '💧', x: 50, y: 72, description: '大きな水たまりがある' },
      { id: 'alley', name: '路地の奥', emoji: '🌫️', x: 25, y: 72, description: '暗い路地の奥が見える' }
    ]
  },
  {
    id: 4,
    name: '子供の家への帰り道',
    subtitle: '夜明けの場所',
    bgColor: '#1a1530',
    bgEmojis: '🏠🌅✨',
    description: '夜明け前の住宅街。少しずつ空が明るくなっている。',
    requiredLevel: 4,
    locations: [
      { id: 'house_gate', name: '家の門', emoji: '🏠', x: 50, y: 18, description: '懐かしい家の門が見える' },
      { id: 'garden', name: '庭', emoji: '🌷', x: 22, y: 50, description: '小さな庭がある' },
      { id: 'mailbox', name: 'ポスト', emoji: '📮', x: 78, y: 50, description: '赤いポストがある' },
      { id: 'secret_place', name: '不思議な光', emoji: '✨', x: 50, y: 78, description: '何か光っている...' }
    ]
  }
];

// オープニングテキスト
export const OPENING_TEXTS = [
  { text: '夜の子供部屋...', emoji: '🌙', bg: '#080818' },
  { text: '人形たちは、子供が寝た後に\nこっそり遊んでいました。', emoji: '🧸🪆🎎', bg: '#080818' },
  { text: 'くすくす...楽しいね！\nもっと遊ぼうよ！', emoji: '🧸✨', bg: '#0a0a20' },
  { text: '...その時、子供が目を覚ましました。', emoji: '👧', bg: '#0a0a20' },
  { text: '「こんな人形なんて...いらない！」', emoji: '👧💢', bg: '#1a0000' },
  { text: '人形たちは次々と捨てられてしまいました...', emoji: '🗑️🧸🪆🎎', bg: '#0a0a1a' },
  { text: 'どんどん増える、迷子の人形たち。', emoji: '😢😢😢', bg: '#0a0a1a' },
  { text: '...', emoji: '', bg: '#050510' },
  { text: 'わたしも、まいごになっちゃった。', emoji: '🧸', bg: '#050510' },
  { text: 'でも、きっとみんなを見つけられる。\nさあ、探しに行こう。', emoji: '🧸✨', bg: '#0a0a1a' }
];

// ストーリーヒント（レベルアップ時に解放）
export const STORY_HINTS = [
  {
    level: 2,
    title: '記憶のかけら①',
    text: '「...思い出した。わたしたち、やくそくをしたんだ」',
    emoji: '💭'
  },
  {
    level: 3,
    title: '記憶のかけら②',
    text: '「やくそく...それは"夜に遊ばない"こと。\nでも私たちは破ってしまった」',
    emoji: '💔'
  },
  {
    level: 4,
    title: '記憶のかけら③',
    text: '「だから子供に嫌われて、捨てられたんだ...\nでも、もう約束は破らない。みんなで帰ろう」',
    emoji: '😢'
  }
];

// エンディングテキスト
export const ENDING_NORMAL = [
  { text: '迷子の人形たちと一緒に、朝を迎えました。', emoji: '🌅' },
  { text: '空がだんだん明るくなっていきます。', emoji: '🌤️' },
  { text: '「もう約束は破らないよ。」', emoji: '🧸' },
  { text: '「いつか子供が迎えに来てくれるかな...」', emoji: '🧸😢' },
  { text: 'まいごの人形たちは、寄り添いながら\n夜明けを見つめていました。', emoji: '🧸🪆🎎🤖🐰🎪👸' },
  { text: '— おわり —\n\nいつか、きっと迎えが来るよ。', emoji: '🌅✨' }
];

export const ENDING_TRUE = [
  { text: 'ヒカリの光が、あたりを包みます。', emoji: '🌟✨' },
  { text: '「みんな、おうちに帰ろう。」', emoji: '🌟' },
  { text: '光に導かれ、人形たちは\n子供の家へと戻っていきました。', emoji: '🏠✨' },
  { text: '朝、子供が目を覚ますと...\n枕元に人形たちが並んでいました。', emoji: '👧' },
  { text: '「...あれ？ 人形たち...」', emoji: '👧' },
  { text: '「...ごめんね。捨てたりしないよ。」', emoji: '👧💕' },
  { text: '人形たちは静かに微笑んでいました。', emoji: '🧸🪆🎎🤖🐰🎪👸🌟' },
  { text: '🌟 あなたは1位です 🌟\n\n人間にも「いい人形だ」と\n思ってもらえました。', emoji: '👑✨🌟' },
  { text: '— 真エンディング —\n\nやくそくを守れば、\nきっとまた会えるよ。', emoji: '🌟🌅✨' }
];

// 汎用メッセージ
export const MESSAGES = {
  nothingHere: [
    'ここには何もないみたい...',
    'しーん...何も見つからなかった。',
    '風の音だけが聞こえる...',
    'まだ他の場所を探してみよう。'
  ],
  alreadyFound: 'もうここは調べたよ。他の場所を探そう！',
  stageComplete: 'このエリアの人形は全員見つけた！次の場所に行こう。',
  levelUp: 'レベルアップ！ 新しい場所に行けるようになった！'
};
