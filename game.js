const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const editorCanvas = document.getElementById("editorCanvas");
const editorCtx = editorCanvas.getContext("2d");

const hud = document.getElementById("hud");
const livesBar = document.getElementById("livesBar");
const timeText = document.getElementById("timeText");
const checkpointText = document.getElementById("checkpointText");
const levelNameText = document.getElementById("levelNameText");
const menuScreen = document.getElementById("menuScreen");
const messageOverlay = document.getElementById("messageOverlay");
const messageTitle = document.getElementById("messageTitle");
const messageBody = document.getElementById("messageBody");
const messageIcon = document.getElementById("messageIcon");
const overlayButton = document.getElementById("overlayButton");
const toastMessage = document.getElementById("toastMessage");
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");
const touchControls = document.getElementById("touchControls");
const menuButton = document.getElementById("menuButton");
const bestTimeText = document.getElementById("bestTimeText");
const menuModeText = document.getElementById("menuModeText");
const playTabBtn = document.getElementById("playTabBtn");
const editorTabBtn = document.getElementById("editorTabBtn");
const playTab = document.getElementById("playTab");
const editorTab = document.getElementById("editorTab");
const levelList = document.getElementById("levelList");
const editorLevelList = document.getElementById("editorLevelList");
const levelNameInput = document.getElementById("levelNameInput");
const newLevelBtn = document.getElementById("newLevelBtn");
const saveLevelBtn = document.getElementById("saveLevelBtn");
const clearEditorBtn = document.getElementById("clearEditorBtn");
const fillGroundBtn = document.getElementById("fillGroundBtn");
const palette = document.getElementById("palette");
const selectedToolText = document.getElementById("selectedToolText");

const VIEW_WIDTH = canvas.width;
const VIEW_HEIGHT = canvas.height;
const TILE = 60;
const COLS = 7;
const ROWS = 26;
const WORLD_HEIGHT = ROWS * TILE;
const GRAVITY = 0.52;
const MAX_FALL = 13;
const MOVE_SPEED = 4.8;
const AIR_CONTROL = 0.22;
const GROUND_FRICTION = 0.8;
const ICE_FRICTION = 0.96;
const JUMP_FORCE = 11.8;
const SPRING_FORCE = 17;
const MAX_LIVES = 2;
const STORAGE_KEY = "boomer-parkur-levels-v2";
const HIDDEN_BUILTINS_KEY = "boomer-parkur-hidden-builtins-v1";

const keys = { left: false, right: false, jump: false };

const assets = {
  logo: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0000_Katman-1.png",
  playerIdleA: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0001_Katman-2.png",
  playerIdleB: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0002_Katman-3.png",
  playerRunA: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0003_Katman-4.png",
  playerRunB: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0004_Katman-5.png",
  playerRunC: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0005_Katman-6.png",
  playerJump: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0006_Katman-7.png",
  grassA: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0010_Katman-11.png",
  grassB: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0011_Katman-12.png",
  stoneCracked: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0012_Katman-13.png",
  ice: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0013_Katman-14.png",
  crate: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0014_Katman-15.png",
  stoneDark: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0015_Katman-16.png",
  spikes: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0017_Katman-18.png",
  cannon: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0018_Katman-19.png",
  hangingSpike: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0019_Katman-20.png",
  fire: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0020_Katman-21.png",
  life: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0021_Katman-22.png",
  gem: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0022_Katman-23.png",
  spring: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0023_Katman-24.png",
  death: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0024_Katman-25.png",
  checkpoint: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0025_Katman-26.png",
  portal: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0026_Katman-27.png",
  cloud: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0027_Katman-28.png",
  bush: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0028_Katman-29.png",
  saw: "source/assets/Ba%C5%9Fl%C4%B1ks%C4%B1z-1_0029_Katman-30.png"
};

const toolDefs = {
  grassA: { label: "Zemin 1", sprite: "grassA" },
  grassB: { label: "Zemin 2", sprite: "grassB" },
  stoneDark: { label: "Tas", sprite: "stoneDark" },
  ice: { label: "Buz", sprite: "ice" },
  crate: { label: "Kirilan", sprite: "crate" },
  checkpoint: { label: "Checkpoint", sprite: "checkpoint" },
  spring: { label: "Yay", sprite: "spring" },
  fire: { label: "Ates", sprite: "fire" },
  spikes: { label: "Spike", sprite: "spikes" },
  saw: { label: "Topuz", sprite: "saw" },
  cannonRight: { label: "Top Sag", sprite: "cannon" },
  cannonLeft: { label: "Top Sol", sprite: "cannon" },
  hangingSpike: { label: "Sarkit", sprite: "hangingSpike" },
  portal: { label: "Bitis", sprite: "portal" },
  spawn: { label: "Baslangic", sprite: "playerIdleA" },
  erase: { label: "Sil", sprite: "death" }
};

const renderTweaks = {
  player: { x: -6, y: 10, width: 54, height: 64 },
  checkpoint: { x: -3, y: 2, width: 54, height: 86 },
  spring: { x: 2, y: 24, width: 56, height: 56 },
  portal: { x: -6, y: 18, width: 72, height: 72 },
  fire: { x: 1, y: 22, width: 58, height: 58 },
  spikes: { x: -2, y: 42, width: 64, height: 20 },
  saw: { x: 2, y: 24, width: 56, height: 56 },
  cannon: { x: -8, y: 22, width: 76, height: 52 },
  hangingSpike: { x: 6, y: -4, width: 46, height: 66 },
  grassA: { x: 0, y: 8, width: 60, height: 60 },
  grassB: { x: 0, y: 8, width: 60, height: 60 },
  stoneCracked: { x: 0, y: 8, width: 60, height: 60 },
  stoneDark: { x: 0, y: 8, width: 60, height: 60 },
  ice: { x: 0, y: 8, width: 60, height: 60 },
  crate: { x: 0, y: 8, width: 60, height: 60 }
};

const SURFACE_ANCHORS = {
  spring: { default: 0, grassA: 4, grassB: 0, ice: 4, crate: 2, stoneDark: 2, stoneCracked: 2 },
  spikes: { default: 0, grassA: 4, grassB: 0, ice: 4, crate: 2, stoneDark: 2, stoneCracked: 2 },
  saw: { default: 0, grassA: 4, grassB: 0, ice: 4, crate: 2, stoneDark: 2, stoneCracked: 2 },
  cannon: { default: 2, grassA: 10, grassB: 6, ice: 10, crate: 8, stoneDark: 8, stoneCracked: 8 },
  fire: { default: 0, grassA: 4, grassB: 0, ice: 4, crate: 2, stoneDark: 2, stoneCracked: 2 }
};

const state = {
  images: {},
  scene: "menu",
  player: null,
  cameraY: WORLD_HEIGHT - VIEW_HEIGHT,
  lives: MAX_LIVES,
  checkpointKey: "spawn",
  elapsed: 0,
  bestTime: Number(localStorage.getItem("boomer-parkur-best") || 0),
  timerStarted: false,
  timerStart: 0,
  jumpQueued: false,
  messageAction: null,
  respawnLock: false,
  finishTriggered: false,
  levels: [],
  selectedTool: "grassA",
  editorLevel: createBlankLevel(),
  editingLevelId: null,
  currentLevelData: null,
  runtimeLevel: null
};

function createBlankLevel() {
  return {
    id: `lvl-${Date.now()}`,
    name: "Yeni Seviye",
    cols: COLS,
    rows: ROWS,
    spawn: { x: 1, y: ROWS - 3 },
    tiles: []
  };
}

function createDefaultLevels() {
  const levelA = createBlankLevel();
  levelA.id = "default-1";
  levelA.name = "Baslangic Zirvesi";
  levelA.tiles = [
    ...groundRow("grassA"),
    ...rowTiles(21, [1, 2], "grassB"),
    ...rowTiles(19, [4, 5], "ice"),
    ...rowTiles(17, [1, 2], "crate"),
    ...rowTiles(15, [4, 5], "grassA"),
    ...rowTiles(13, [2, 3], "stoneDark"),
    ...rowTiles(11, [0, 1], "ice"),
    ...rowTiles(9, [4, 5], "grassB"),
    ...rowTiles(7, [2, 3], "stoneCracked"),
    ...rowTiles(5, [1, 2, 3], "grassA"),
    { x: 2, y: 20, type: "checkpoint" },
    { x: 1, y: 10, type: "checkpoint" },
    { x: 3, y: 20, type: "spring" },
    { x: 5, y: 8, type: "spring" },
    { x: 5, y: 18, type: "fire" },
    { x: 4, y: 14, type: "spikes" },
    { x: 3, y: 12, type: "fire" },
    { x: 0, y: 10, type: "spikes" },
    { x: 1, y: 6, type: "hangingSpike" },
    { x: 5, y: 6, type: "cannonLeft" },
    { x: 4, y: 4, type: "saw" },
    { x: 3, y: 3, type: "portal" }
  ];

  const levelB = createBlankLevel();
  levelB.id = "default-2";
  levelB.name = "Buzlu Kosu";
  levelB.spawn = { x: 2, y: ROWS - 3 };
  levelB.tiles = [
    ...groundRow("grassB"),
    ...rowTiles(22, [2, 3, 4], "ice"),
    ...rowTiles(20, [0, 1], "grassA"),
    ...rowTiles(18, [4, 5], "crate"),
    ...rowTiles(16, [2, 3], "ice"),
    ...rowTiles(14, [5, 6], "grassA"),
    ...rowTiles(12, [1, 2], "stoneDark"),
    ...rowTiles(10, [3, 4], "ice"),
    ...rowTiles(8, [0, 1], "crate"),
    ...rowTiles(6, [4, 5], "grassB"),
    ...rowTiles(4, [2, 3], "grassA"),
    { x: 3, y: 21, type: "checkpoint" },
    { x: 5, y: 11, type: "checkpoint" },
    { x: 2, y: 15, type: "spring" },
    { x: 1, y: 7, type: "spring" },
    { x: 0, y: 19, type: "fire" },
    { x: 5, y: 17, type: "spikes" },
    { x: 3, y: 9, type: "saw" },
    { x: 2, y: 5, type: "hangingSpike" },
    { x: 6, y: 13, type: "cannonLeft" },
    { x: 2, y: 2, type: "portal" }
  ];

  return [levelA, levelB];
}

function groundRow(type) {
  return Array.from({ length: COLS }, (_, x) => ({ x, y: ROWS - 1, type }));
}

function rowTiles(y, xs, type) {
  return xs.map((x) => ({ x, y, type }));
}

function createPlayer() {
  return {
    x: 0,
    y: 0,
    width: 0.72 * TILE,
    height: 0.82 * TILE,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    frameTime: 0,
    blink: 0
  };
}

function loadImages() {
  const entries = Object.entries(assets);
  return Promise.all(entries.map(([key, src]) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve([key, image]);
    image.onerror = reject;
    image.src = src;
  }))).then((loaded) => {
    for (const [key, image] of loaded) {
      state.images[key] = image;
    }
    renderLives();
  });
}

function loadLevels() {
  const builtIns = createDefaultLevels().map(normalizeLevel);
  const hiddenBuiltIns = new Set(JSON.parse(localStorage.getItem(HIDDEN_BUILTINS_KEY) || "[]"));
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.levels = builtIns.filter((level) => !hiddenBuiltIns.has(level.id));
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const custom = Array.isArray(parsed) ? parsed.map(normalizeLevel) : [];
    const customIds = new Set(custom.map((level) => level.id));
    state.levels = [
      ...builtIns.filter((level) => !customIds.has(level.id) && !hiddenBuiltIns.has(level.id)),
      ...custom
    ];
  } catch {
    state.levels = builtIns.filter((level) => !hiddenBuiltIns.has(level.id));
  }
}

function normalizeLevel(level) {
  const next = structuredClone(level);
  next.tiles = (next.tiles || []).map((tile) => {
    if (tile.type === "cannon") {
      return { ...tile, type: "cannonRight" };
    }
    return tile;
  });
  return next;
}

function saveLevels() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state.levels.filter((level) => !isBuiltInLevel(level.id)))
  );
}

function renderLives() {
  livesBar.innerHTML = "";
  for (let i = 0; i < state.lives; i += 1) {
    const icon = document.createElement("img");
    icon.className = "life-icon";
    icon.src = assets.life;
    icon.alt = "Can";
    livesBar.appendChild(icon);
  }
}

function updateBestTimeDisplay() {
  if (!bestTimeText) {
    return;
  }
  bestTimeText.textContent = state.bestTime ? `${state.bestTime.toFixed(2)}s` : "Henuz yok";
}

function isBuiltInLevel(levelId) {
  return typeof levelId === "string" && levelId.startsWith("default-");
}

function setActiveTab(tab) {
  const playActive = tab === "play";
  const editorActive = tab === "editor";
  playTabBtn.classList.toggle("active", playActive);
  editorTabBtn.classList.toggle("active", editorActive);
  playTab.classList.toggle("hidden", !playActive);
  editorTab.classList.toggle("hidden", !editorActive);
  menuScreen.dataset.mode = tab || "idle";
  if (menuModeText) {
    menuModeText.textContent = playActive ? "Oyna" : editorActive ? "Editor" : "Beklemede";
  }
}

function buildPalette() {
  palette.innerHTML = "";
  Object.entries(toolDefs).forEach(([key, tool]) => {
    const button = document.createElement("button");
    button.className = "palette-btn";
    button.innerHTML = `<img src="${assets[tool.sprite]}" alt="${tool.label}"><span>${tool.label}</span>`;
    button.addEventListener("click", () => setTool(key));
    button.dataset.tool = key;
    palette.appendChild(button);
  });
  setTool(state.selectedTool);
}

function setTool(key) {
  state.selectedTool = key;
  selectedToolText.textContent = `Secili arac: ${toolDefs[key].label}`;
  [...palette.children].forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === key);
  });
}

function renderLevelLists() {
  levelList.innerHTML = "";
  editorLevelList.innerHTML = "";
  updateBestTimeDisplay();

  if (!state.levels.length) {
    levelList.innerHTML = `
      <article class="level-card empty-state">
        <span class="card-badge">Bos</span>
        <h3>Henuz seviye yok</h3>
        <p class="level-meta">Editor moduna gir, ilk haritani kaydet ve burada oyna.</p>
      </article>
    `;

    editorLevelList.innerHTML = `
      <article class="saved-card empty-state">
        <span class="card-badge">Editor</span>
        <h3>Kayit bekleniyor</h3>
        <p class="level-meta">Kaydedilen haritalar burada yukle ve sil aksiyonlariyla gorunecek.</p>
      </article>
    `;
    return;
  }

  state.levels.forEach((level, index) => {
    const tileCount = level.tiles.length;
    const checkpointCount = level.tiles.filter((tile) => tile.type === "checkpoint").length;
    const hazardCount = level.tiles.filter((tile) => (
      ["fire", "spikes", "saw", "cannonRight", "cannonLeft", "hangingSpike"].includes(tile.type)
    )).length;
    const builtIn = isBuiltInLevel(level.id);
    const playCard = document.createElement("article");
    playCard.className = "level-card";
    playCard.innerHTML = `
      <div class="card-topline">
        <span class="card-badge">${builtIn ? "Hazir" : "Ozel"}</span>
        <span class="card-index">#${String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>${level.name}</h3>
      <p class="level-meta">${tileCount} asset | ${hazardCount} tuzak | ${checkpointCount} checkpoint</p>
      <div class="card-stats">
        <span>${level.rows} satir</span>
        <span>Spawn ${level.spawn.x + 1}/${level.spawn.y + 1}</span>
      </div>
      <div class="card-actions">
        <button class="primary-action" data-play="${level.id}">Oyna</button>
        <button data-edit="${level.id}">Duzenle</button>
      </div>
    `;
    levelList.appendChild(playCard);

    const saveCard = document.createElement("article");
    saveCard.className = "saved-card";
    saveCard.innerHTML = `
      <div class="card-topline">
        <span class="card-badge">${builtIn ? "Hazir" : "Kayitli"}</span>
        <span class="card-index">#${String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>${level.name}</h3>
      <p class="level-meta">Spawn ${level.spawn.x + 1}/${level.spawn.y + 1} | ${tileCount} asset | ${hazardCount} tuzak</p>
      <div class="card-actions">
        <button data-load="${level.id}">Yukle</button>
        <button data-delete="${level.id}">Sil</button>
      </div>
    `;
    editorLevelList.appendChild(saveCard);
  });
}

function createRuntimeLevel(levelData) {
  const tileLookup = new Map(levelData.tiles.map((tile) => [`${tile.x}:${tile.y}`, tile.type]));
  const runtime = {
    solids: [],
    checkpoints: [],
    hazards: [],
    springs: [],
    projectiles: [],
    goal: null,
    spawn: { ...levelData.spawn }
  };

  levelData.tiles.forEach((tile) => {
    const rect = gridRect(tile.x, tile.y);
    if (["grassA", "grassB", "stoneDark", "stoneCracked", "ice", "crate"].includes(tile.type)) {
      runtime.solids.push({ ...rect, style: tile.type, broken: false, breakTimer: 0 });
    }
    if (tile.type === "checkpoint") {
      runtime.checkpoints.push({ ...rect, label: `Bayrak ${runtime.checkpoints.length + 1}`, active: false, key: `${tile.x}:${tile.y}` });
    }
    if (["fire", "spikes", "saw", "cannonRight", "cannonLeft", "hangingSpike"].includes(tile.type)) {
      runtime.hazards.push(createHazard(tile, getSupportStyle(tileLookup, tile.x, tile.y)));
    }
    if (tile.type === "spring") {
      const supportStyle = getSupportStyle(tileLookup, tile.x, tile.y);
      const supportNudge = getSurfaceAnchorY("spring", supportStyle);
      runtime.springs.push({
        cellX: rect.x,
        cellY: rect.y,
        supportStyle,
        ...rect,
        x: rect.x + 8,
        y: rect.y + 28 + supportNudge,
        width: TILE - 16,
        height: TILE - 28 - supportNudge
      });
    }
    if (tile.type === "portal") {
      runtime.goal = { ...rect };
    }
  });

  return runtime;
}

function getSupportStyle(tileLookup, x, y) {
  const style = tileLookup.get(`${x}:${y + 1}`);
  return ["grassA", "grassB", "stoneDark", "stoneCracked", "ice", "crate"].includes(style) ? style : null;
}

function getSurfaceAnchorY(type, style) {
  const anchors = SURFACE_ANCHORS[type];
  if (!anchors) {
    return 0;
  }
  if (style && typeof anchors[style] === "number") {
    return anchors[style];
  }
  return anchors.default || 0;
}

function hazardRect(type, x, y, dir = 1, supportStyle = null) {
  const base = gridRect(x, y);
  const supportNudge = getSurfaceAnchorY(type, supportStyle);
  if (type === "spikes") {
    return { x: base.x + 4, y: base.y + 42 + supportNudge, width: TILE - 8, height: 18 };
  }
  if (type === "cannon") {
    return { x: base.x - 4, y: base.y + 8 + supportNudge, width: TILE + 12, height: TILE * 0.7, dir };
  }
  if (type === "hangingSpike") {
    return { x: base.x + TILE * 0.15, y: base.y - 6, width: TILE * 0.7, height: TILE * 0.9 };
  }
  if (type === "saw") {
    return { x: base.x + 14, y: base.y + 30 + supportNudge, width: TILE - 28, height: TILE - 32 - supportNudge };
  }
  return { x: base.x + 10, y: base.y + 12 + supportNudge, width: TILE - 20, height: TILE - 18 };
}

function createHazard(tile, supportStyle = null) {
  if (tile.type === "cannonRight" || tile.type === "cannonLeft") {
    const dir = tile.type === "cannonLeft" ? -1 : 1;
    return {
      ...hazardRect("cannon", tile.x, tile.y, dir, supportStyle),
      type: "cannon",
      gridX: tile.x,
      gridY: tile.y,
      supportStyle,
      dir,
      cooldown: 1.25
    };
  }

  if (tile.type === "hangingSpike") {
    const rect = hazardRect("hangingSpike", tile.x, tile.y);
    return {
      ...rect,
      type: "hangingSpike",
      originX: rect.x,
      originY: rect.y,
      state: "idle",
      triggerTimer: 0,
      vy: 0
    };
  }

  return {
    ...hazardRect(tile.type, tile.x, tile.y, 1, supportStyle),
    type: tile.type,
    gridX: tile.x,
    gridY: tile.y,
    supportStyle
  };
}

function gridRect(x, y) {
  return { x: x * TILE, y: y * TILE, width: TILE, height: TILE };
}

function startGame(levelId) {
  const levelData = state.levels.find((entry) => entry.id === levelId);
  if (!levelData) {
    return;
  }

  state.scene = "playing";
  state.currentLevelData = structuredClone(levelData);
  state.runtimeLevel = createRuntimeLevel(state.currentLevelData);
  state.lives = MAX_LIVES;
  state.checkpointKey = "spawn";
  state.elapsed = 0;
  state.timerStarted = false;
  state.finishTriggered = false;
  state.messageAction = null;
  state.respawnLock = false;
  keys.left = false;
  keys.right = false;
  releaseJump();
  state.player = createPlayer();
  respawnToCurrentCheckpoint();
  menuScreen.classList.add("hidden");
  messageOverlay.classList.add("hidden");
  toastMessage.classList.add("hidden");
  hud.classList.remove("hidden");
  touchControls.classList.remove("hidden");
  if (checkpointText) {
    checkpointText.textContent = "Baslangic";
  }
  if (levelNameText) {
    levelNameText.textContent = state.currentLevelData.name;
  }
  renderLives();
  updateHud();
}

function restartCurrentLevel() {
  if (!state.currentLevelData?.id) {
    returnToMenu();
    return;
  }
  startGame(state.currentLevelData.id);
}

function respawnToCurrentCheckpoint() {
  const spawn = getSpawnPoint();
  state.player.x = spawn.x;
  state.player.y = spawn.y;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.onGround = false;
  state.player.blink = 0;
  state.cameraY = clamp(state.player.y - VIEW_HEIGHT * 0.65, 0, WORLD_HEIGHT - VIEW_HEIGHT);
  state.runtimeLevel.solids.forEach((solid) => {
    if (solid.style === "crate") {
      solid.broken = false;
      solid.breakTimer = 0;
    }
  });
}

function getSpawnPoint() {
  if (state.checkpointKey !== "spawn") {
    const cp = state.runtimeLevel.checkpoints.find((entry) => entry.key === state.checkpointKey);
    if (cp) {
      return { x: cp.x + 4, y: cp.y - TILE * 0.64 };
    }
  }

  return {
    x: state.currentLevelData.spawn.x * TILE + 4,
    y: state.currentLevelData.spawn.y * TILE - TILE * 0.64
  };
}

function updateHud() {
  timeText.textContent = `${state.elapsed.toFixed(2)}s`;
  updateBestTimeDisplay();
}

function queueJump() {
  if (!keys.jump) {
    state.jumpQueued = true;
  }
  keys.jump = true;
}

function releaseJump() {
  keys.jump = false;
  state.jumpQueued = false;
}

function updateGame(delta) {
  if (state.scene !== "playing") {
    return;
  }

  if (!messageOverlay.classList.contains("hidden")) {
    return;
  }

  const player = state.player;
  player.frameTime += delta;
  if (player.blink > 0) {
    player.blink -= delta;
  }

  const horizontalAccel = player.onGround ? 1 : AIR_CONTROL;
  if (keys.left) {
    player.vx = Math.max(player.vx - horizontalAccel, -MOVE_SPEED);
    player.facing = -1;
  }
  if (keys.right) {
    player.vx = Math.min(player.vx + horizontalAccel, MOVE_SPEED);
    player.facing = 1;
  }
  if (!keys.left && !keys.right) {
    const friction = isOnIce(player) ? ICE_FRICTION : GROUND_FRICTION;
    player.vx *= friction;
    if (Math.abs(player.vx) < 0.08) {
      player.vx = 0;
    }
  }

  if (state.jumpQueued && player.onGround) {
    player.vy = -JUMP_FORCE;
    player.onGround = false;
    state.jumpQueued = false;
    beginTimer();
  }

  beginTimerIfMoving();

  player.x += player.vx;
  resolveSolidCollision("x");

  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL);
  player.y += player.vy;
  player.onGround = false;
  resolveSolidCollision("y");

  player.x = clamp(player.x, 0, VIEW_WIDTH - player.width);

  updateBreakablePlatforms(delta);
  updateCheckpoints();
  updateSprings();
  updateHazards(delta);
  updateProjectiles();
  updateGoal();

  if (player.y > WORLD_HEIGHT + TILE && !state.respawnLock) {
    applyDamage("Dustun ama parkur bitmedi.");
  }

  state.cameraY = clamp(player.y - VIEW_HEIGHT * 0.62, 0, WORLD_HEIGHT - VIEW_HEIGHT);

  if (state.timerStarted) {
    state.elapsed = (performance.now() - state.timerStart) / 1000;
    updateHud();
  }
}

function beginTimerIfMoving() {
  const player = state.player;
  if (!state.timerStarted && (Math.abs(player.vx) > 0.2 || Math.abs(player.vy) > 0.2 || keys.jump)) {
    beginTimer();
  }
}

function beginTimer() {
  if (!state.timerStarted) {
    state.timerStarted = true;
    state.timerStart = performance.now() - state.elapsed * 1000;
  }
}

function isOnIce(player) {
  const feetX = player.x + player.width * 0.5;
  const feetY = player.y + player.height + 2;
  return state.runtimeLevel.solids.some((solid) => (
    !solid.broken &&
    solid.style === "ice" &&
    feetX >= solid.x &&
    feetX <= solid.x + solid.width &&
    feetY >= solid.y &&
    feetY <= solid.y + 6
  ));
}

function resolveSolidCollision(axis) {
  for (const solid of state.runtimeLevel.solids) {
    if (solid.broken || !overlap(state.player, solid)) {
      continue;
    }

    if (axis === "x") {
      if (state.player.vx > 0) {
        state.player.x = solid.x - state.player.width;
      } else if (state.player.vx < 0) {
        state.player.x = solid.x + solid.width;
      }
      state.player.vx = 0;
    } else {
      if (state.player.vy > 0) {
        state.player.y = solid.y - state.player.height;
        state.player.vy = 0;
        state.player.onGround = true;
      } else if (state.player.vy < 0) {
        state.player.y = solid.y + solid.height;
        state.player.vy = 0;
      }
    }
  }
}

function updateBreakablePlatforms(delta) {
  for (const solid of state.runtimeLevel.solids) {
    if (solid.style !== "crate" || solid.broken) {
      continue;
    }

    const standing = state.player.onGround &&
      state.player.y + state.player.height >= solid.y - 1 &&
      state.player.y + state.player.height <= solid.y + 10 &&
      state.player.x + state.player.width > solid.x + 4 &&
      state.player.x < solid.x + solid.width - 4;

    if (standing) {
      solid.breakTimer += delta;
      if (solid.breakTimer >= 2) {
        solid.broken = true;
      }
    } else {
      solid.breakTimer = 0;
    }
  }
}

function updateCheckpoints() {
  for (const checkpoint of state.runtimeLevel.checkpoints) {
    if (!checkpoint.active && overlap(state.player, checkpoint)) {
      checkpoint.active = true;
      state.checkpointKey = checkpoint.key;
      state.lives = MAX_LIVES;
      if (checkpointText) {
        checkpointText.textContent = checkpoint.label;
      }
      renderLives();
      showCenterToast("Checkpoint!", "Canlarin yenilendi.", 900);
    }
  }
}

function updateSprings() {
  for (const spring of state.runtimeLevel.springs) {
    if (
      overlap(state.player, spring) &&
      state.player.vy >= 0 &&
      state.player.y + state.player.height <= spring.y + spring.height * 0.68
    ) {
      state.player.y = spring.y - state.player.height;
      state.player.vy = -SPRING_FORCE;
      state.player.onGround = false;
      beginTimer();
    }
  }
}

function updateHazards(delta) {
  updateHazardMotion(delta);

  if (state.player.blink > 0 || state.respawnLock) {
    return;
  }

  for (const hazard of state.runtimeLevel.hazards) {
    if (hazard.type === "saw" && overlap(state.player, hazard)) {
      const playerBottom = state.player.y + state.player.height;
      const playerCenterX = state.player.x + state.player.width / 2;
      const horizontalSafe = playerCenterX > hazard.x + 4 && playerCenterX < hazard.x + hazard.width - 4;
      if (state.player.vy >= 0 && horizontalSafe && playerBottom - hazard.y < 14) {
        bounceSaw();
        return;
      }
    }

    if (overlap(state.player, hazard)) {
      applyDamage("Canin azaldi, checkpointten devam.");
      return;
    }
  }
}

function updateHazardMotion(delta) {
  for (const hazard of state.runtimeLevel.hazards) {
    if (hazard.type === "cannon") {
      hazard.cooldown -= delta;
      if (hazard.cooldown <= 0) {
        hazard.cooldown = 3;
        fireCannon(hazard);
      }
    }

    if (hazard.type === "hangingSpike") {
      updateHangingSpike(hazard, delta);
    }
  }
}

function updateHangingSpike(hazard, delta) {
  if (hazard.state === "idle") {
    const playerCenterX = state.player.x + state.player.width / 2;
    const hazardCenterX = hazard.x + hazard.width / 2;
    const playerBelow = state.player.y > hazard.y + hazard.height * 0.2;
    const closeX = Math.abs(playerCenterX - hazardCenterX) < TILE * 0.7;
    const closeY = state.player.y - hazard.y < TILE * 5.5;
    const lineBlocked = isHangingSpikeBlocked(hazard, playerCenterX, state.player.y);
    if (playerBelow && closeX && closeY && !lineBlocked) {
      hazard.state = "warning";
      hazard.triggerTimer = 2;
    }
  } else if (hazard.state === "warning") {
    hazard.triggerTimer -= delta;
    if (hazard.triggerTimer <= 0) {
      hazard.state = "falling";
      hazard.vy = 0;
    }
  } else if (hazard.state === "falling") {
    hazard.vy = Math.min(hazard.vy + GRAVITY * 1.12, MAX_FALL + 5);
    hazard.y += hazard.vy;
  }
}

function isHangingSpikeBlocked(hazard, playerCenterX, playerTopY) {
  const rayLeft = playerCenterX - 6;
  const rayRight = playerCenterX + 6;
  const startY = hazard.y + hazard.height;
  const endY = playerTopY;

  return state.runtimeLevel.solids.some((solid) => {
    if (solid.broken) {
      return false;
    }

    const overlapsX = rayRight > solid.x && rayLeft < solid.x + solid.width;
    const betweenHazardAndPlayer = solid.y < endY && solid.y + solid.height > startY;
    return overlapsX && betweenHazardAndPlayer;
  });
}

function fireCannon(hazard) {
  state.runtimeLevel.projectiles.push({
    x: hazard.dir > 0 ? hazard.x + hazard.width - 12 : hazard.x - 20,
    y: hazard.y + 14,
    width: 24,
    height: 24,
    vx: hazard.dir * 6.8
  });
}

function updateProjectiles() {
  state.runtimeLevel.projectiles = state.runtimeLevel.projectiles.filter((projectile) => {
    projectile.x += projectile.vx;

    const hitSolid = state.runtimeLevel.solids.some((solid) => !solid.broken && overlap(projectile, solid));
    if (hitSolid) {
      return false;
    }

    if (overlap(projectile, state.player) && !state.respawnLock && state.player.blink <= 0) {
      loseAllLives("Top atesi degdi. Bu tuzak tek vurusluk.");
      return false;
    }

    return projectile.x > -40 && projectile.x < VIEW_WIDTH + 40;
  });
}

function bounceSaw() {
  state.player.vy = -SPRING_FORCE * 0.92;
  state.player.onGround = false;
  state.player.y = state.player.y - 10;
  state.player.blink = 0.8;
  consumeLife({
    message: "Topuz bir can goturdu ama seni geri firlatti.",
    respawn: false,
    icon: "saw",
    silent: true
  });
}

function updateGoal() {
  if (!state.runtimeLevel.goal || state.finishTriggered || state.respawnLock) {
    return;
  }

  if (overlap(state.player, state.runtimeLevel.goal)) {
    state.finishTriggered = true;
    state.timerStarted = false;

    if (!state.bestTime || state.elapsed < state.bestTime) {
      state.bestTime = state.elapsed;
      localStorage.setItem("boomer-parkur-best", String(state.bestTime));
    }

    showMessage({
      title: "Parkur tamam!",
      body: `${state.currentLevelData.name} bitirildi. Sure: ${state.elapsed.toFixed(2)}s | En iyi: ${state.bestTime.toFixed(2)}s`,
      icon: "gem",
      button: "Menuye Don",
      onConfirm: returnToMenu
    });
  }
}

function applyDamage(bodyText) {
  consumeLife({ message: bodyText, respawn: true, icon: "death" });
}

function loseAllLives(bodyText) {
  if (state.respawnLock) {
    return;
  }

  state.respawnLock = true;
  state.lives = 0;
  renderLives();
  state.timerStarted = false;
  showMessage({
    title: "Aninda dustun",
    body: bodyText,
    icon: "death",
    button: "Yeniden Basla",
    onConfirm: restartCurrentLevel
  });
}

function consumeLife({ message, respawn, icon, silent = false }) {
  if (state.respawnLock) {
    return;
  }

  if (respawn) {
    state.respawnLock = true;
  }
  state.lives -= 1;
  renderLives();
  state.player.blink = 0.9;

  if (state.lives > 0) {
    if (respawn) {
      rebuildRuntimeLevelState();
      respawnToCurrentCheckpoint();
      state.respawnLock = false;
      showCenterToast("Canin Gitti", message, 1200);
    } else if (!silent) {
      showCenterToast("Can Eksildi", message, 950);
    } else {
      showCenterToast("Canin Gitti", message, 900);
    }
    return;
  }

  state.timerStarted = false;
  state.respawnLock = true;
  showMessage({
    title: "Canlar bitti",
    body: "Bu kosu kapandi. Menuye donup tekrar dene ya da editorle seviyeyi duzenle.",
    icon: "death",
    button: "Yeniden Basla",
    onConfirm: restartCurrentLevel
  });
}

function rebuildRuntimeLevelState() {
  const activeKeys = state.runtimeLevel.checkpoints.filter((checkpoint) => checkpoint.active).map((checkpoint) => checkpoint.key);
  state.runtimeLevel = createRuntimeLevel(state.currentLevelData);
  state.runtimeLevel.checkpoints.forEach((checkpoint) => {
    checkpoint.active = activeKeys.includes(checkpoint.key);
  });
}

function returnToMenu() {
  state.scene = "menu";
  state.runtimeLevel = null;
  state.currentLevelData = null;
  hud.classList.add("hidden");
  touchControls.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  messageOverlay.classList.add("hidden");
  toastMessage.classList.add("hidden");
  setActiveTab(null);
  renderLevelLists();
  drawMenuBackdrop();
}

function showCenterToast(title, body, duration = 1000) {
  toastTitle.textContent = title;
  toastBody.textContent = body;
  toastMessage.classList.remove("hidden");
  clearTimeout(showCenterToast.timeoutId);
  showCenterToast.timeoutId = setTimeout(() => {
    toastMessage.classList.add("hidden");
  }, duration);
}

function showToast(title, body, iconKey, duration) {
  showMessage({
    title,
    body,
    icon: iconKey,
    button: "Tamam",
    onConfirm: () => {
      messageOverlay.classList.add("hidden");
      state.respawnLock = false;
    }
  });

  overlayButton.classList.add("hidden");
  setTimeout(() => {
    if (!messageOverlay.classList.contains("hidden") && title === messageTitle.textContent) {
      messageOverlay.classList.add("hidden");
      overlayButton.classList.remove("hidden");
      state.messageAction = null;
      state.respawnLock = false;
    }
  }, duration);
}

function showMessage({ title, body, icon, button, onConfirm }) {
  messageTitle.textContent = title;
  messageBody.textContent = body;
  messageIcon.src = state.images[icon]?.src || "";
  messageIcon.alt = title;
  overlayButton.textContent = button;
  overlayButton.classList.remove("hidden");
  state.messageAction = onConfirm;
  messageOverlay.classList.remove("hidden");
}

function draw() {
  if (state.scene !== "playing" || !state.runtimeLevel) {
    drawMenuBackdrop();
    return;
  }

  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  drawSky();
  drawGridBackground();
  drawRuntimeLevel();
  drawPlayer();
}

function drawMenuBackdrop() {
  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  drawSky();
  ctx.globalAlpha = 0.2;
  drawImage("cloud", 30, 120, 120, 70);
  drawImage("cloud", 250, 260, 110, 64);
  ctx.globalAlpha = 1;
  drawImage("bush", 20, VIEW_HEIGHT - 95, 130, 50);
  drawImage("bush", 250, VIEW_HEIGHT - 90, 110, 46);
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, "#8fdcff");
  gradient.addColorStop(0.52, "#eafcff");
  gradient.addColorStop(1, "#d6f2bb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
}

function drawGridBackground() {
  ctx.save();
  ctx.translate(0, -state.cameraY * 0.15);
  ctx.globalAlpha = 0.16;
  drawImage("cloud", 25, 120, 120, 70);
  drawImage("cloud", 250, 310, 100, 60);
  drawImage("cloud", 70, 620, 130, 80);
  ctx.restore();
}

function drawRuntimeLevel() {
  state.runtimeLevel.solids.forEach((solid) => {
    if (!solid.broken) {
      drawTileCell(solid.style, solid.x, solid.y);
      if (solid.style === "crate" && solid.breakTimer > 0) {
        const ratio = clamp(solid.breakTimer / 2, 0, 1);
        ctx.fillStyle = `rgba(255, 90, 50, ${0.25 + ratio * 0.2})`;
        ctx.fillRect(solid.x + 8, solid.y - state.cameraY + 8, TILE - 16, 8);
      }
    }
  });

  state.runtimeLevel.checkpoints.forEach((checkpoint) => {
    drawSpriteInCell("checkpoint", checkpoint.x, checkpoint.y, renderTweaks.checkpoint);
    if (checkpoint.active) {
      ctx.fillStyle = "rgba(255, 208, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(checkpoint.x + 22, checkpoint.y - state.cameraY + 26, 22, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  state.runtimeLevel.springs.forEach((spring) => {
    drawGroundShadow(spring.cellX + TILE * 0.18, spring.cellY + TILE * 0.8, TILE * 0.64, 10, 0.2);
    drawSpriteInCell("spring", spring.cellX, spring.cellY, renderTweaks.spring);
  });

  state.runtimeLevel.hazards.forEach((hazard) => {
    drawHazard(hazard);
  });

  if (state.runtimeLevel.goal) {
    drawSpriteInCell("portal", state.runtimeLevel.goal.x, state.runtimeLevel.goal.y, renderTweaks.portal);
  }

  state.runtimeLevel.projectiles.forEach((projectile) => {
    drawWorldImage("fire", projectile.x, projectile.y, projectile.width, projectile.height);
  });
}

function drawPlayer() {
  const sprite = choosePlayerSprite();
  const tweak = renderTweaks.player;
  const drawX = state.player.x + tweak.x;
  const drawY = state.player.y - state.cameraY + tweak.y;

  if (state.player.blink > 0 && Math.floor(state.player.blink * 12) % 2 === 0) {
    return;
  }

  ctx.save();
  if (state.player.facing < 0) {
    ctx.translate(drawX + tweak.width / 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(state.images[sprite], -tweak.width / 2, drawY, tweak.width, tweak.height);
  } else {
    ctx.drawImage(state.images[sprite], drawX, drawY, tweak.width, tweak.height);
  }
  ctx.restore();
}

function choosePlayerSprite() {
  if (!state.player.onGround) {
    return "playerJump";
  }
  if (Math.abs(state.player.vx) < 1) {
    return Math.floor(state.player.frameTime * 3) % 2 === 0 ? "playerIdleA" : "playerIdleB";
  }
  const running = ["playerRunA", "playerRunB", "playerRunC"];
  return running[Math.floor(state.player.frameTime * 9) % running.length];
}

function drawImage(key, x, y, width, height) {
  const image = state.images[key];
  if (!image) {
    return;
  }
  ctx.drawImage(image, x, y, width, height);
}

function drawWorldImage(key, x, y, width, height) {
  const image = state.images[key];
  if (!image) {
    return;
  }
  ctx.drawImage(image, x, y - state.cameraY, width, height);
}

function drawTileCell(key, x, y) {
  const tweak = renderTweaks[key];
  if (tweak) {
    drawWorldImage(key, x + tweak.x, y + tweak.y, tweak.width, tweak.height);
    return;
  }
  drawWorldImage(key, x, y, TILE, TILE);
}

function drawWorldSprite(key, x, y, width, height, flip = false) {
  const image = state.images[key];
  if (!image) {
    return;
  }

  ctx.save();
  if (flip) {
    ctx.translate(x + width / 2, y - state.cameraY);
    ctx.scale(-1, 1);
    ctx.drawImage(image, -width / 2, 0, width, height);
  } else {
    ctx.drawImage(image, x, y - state.cameraY, width, height);
  }
  ctx.restore();
}

function drawSpriteInCell(key, x, y, tweak) {
  drawWorldImage(key, x + tweak.x, y + tweak.y, tweak.width, tweak.height);
}

function drawGroundShadow(x, y, width, height, alpha = 0.16) {
  ctx.save();
  ctx.fillStyle = `rgba(18, 34, 52, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x + width / 2, y - state.cameraY, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHazard(hazard) {
  if (hazard.type === "cannon") {
    const tweak = renderTweaks.cannon;
    const baseX = hazard.gridX * TILE;
    const baseY = hazard.gridY * TILE;
    const anchorY = getSurfaceAnchorY("cannon", hazard.supportStyle);
    drawGroundShadow(baseX + 10, baseY + TILE * 0.8 + anchorY, TILE * 0.72, 10, 0.18);
    drawWorldSprite("cannon", baseX + tweak.x, baseY + tweak.y + anchorY, tweak.width, tweak.height, hazard.dir < 0);
    return;
  }

  if (hazard.type === "hangingSpike") {
    const tweak = renderTweaks.hangingSpike;
    drawWorldImage("hangingSpike", hazard.x + tweak.x, hazard.y + tweak.y, tweak.width, tweak.height);
    if (hazard.state === "warning") {
      ctx.fillStyle = "rgba(255, 87, 87, 0.26)";
      ctx.beginPath();
      ctx.arc(hazard.x + hazard.width / 2, hazard.y - state.cameraY + hazard.height + 8, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  const tweak = renderTweaks[hazard.type];
  if (tweak) {
    const baseX = hazard.gridX * TILE;
    const baseY = hazard.gridY * TILE;
    const anchorY = getSurfaceAnchorY(hazard.type, hazard.supportStyle);
    if (hazard.type === "saw" || hazard.type === "fire") {
      drawGroundShadow(baseX + TILE * 0.18, baseY + TILE * 0.8 + anchorY, TILE * 0.64, 10, 0.18);
    }
    drawWorldImage(hazard.type, baseX + tweak.x, baseY + tweak.y + anchorY, tweak.width, tweak.height);
    return;
  }
  drawWorldImage(hazard.type, hazard.x, hazard.y, hazard.width, hazard.height);
}

function drawEditor() {
  editorCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  const cell = editorCanvas.width / COLS;
  const tileLookup = new Map(state.editorLevel.tiles.map((tile) => [`${tile.x}:${tile.y}`, tile.type]));

  const gradient = editorCtx.createLinearGradient(0, 0, 0, editorCanvas.height);
  gradient.addColorStop(0, "#8fdcff");
  gradient.addColorStop(0.58, "#eefcff");
  gradient.addColorStop(1, "#d6f2bb");
  editorCtx.fillStyle = gradient;
  editorCtx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      editorCtx.strokeStyle = "rgba(27, 39, 64, 0.08)";
      editorCtx.strokeRect(x * cell, y * cell, cell, cell);
    }
  }

  state.editorLevel.tiles.forEach((tile) => {
    const px = tile.x * cell;
    const py = tile.y * cell;
    drawEditorTile(tile, px, py, cell, tileLookup);
  });

  const spawnX = state.editorLevel.spawn.x * cell;
  const spawnY = state.editorLevel.spawn.y * cell;
  editorCtx.fillStyle = "rgba(125, 122, 255, 0.28)";
  editorCtx.fillRect(spawnX + 4, spawnY + 4, cell - 8, cell - 8);
  editorCtx.drawImage(state.images.playerIdleA, spawnX + 8, spawnY + 6, cell - 16, cell - 12);
}

function handleEditorPointer(event) {
  const rect = editorCanvas.getBoundingClientRect();
  const scaleX = editorCanvas.width / rect.width;
  const scaleY = editorCanvas.height / rect.height;
  const cell = editorCanvas.width / COLS;
  const x = Math.floor(((event.clientX - rect.left) * scaleX) / cell);
  const y = Math.floor(((event.clientY - rect.top) * scaleY) / cell);

  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
    return;
  }

  if (state.selectedTool === "spawn") {
    state.editorLevel.spawn = { x, y };
    drawEditor();
    return;
  }

  const existing = state.editorLevel.tiles.findIndex((tile) => tile.x === x && tile.y === y);
  if (existing >= 0) {
    state.editorLevel.tiles.splice(existing, 1);
  }

  if (state.selectedTool !== "erase") {
    if (state.selectedTool === "portal") {
      state.editorLevel.tiles = state.editorLevel.tiles.filter((tile) => tile.type !== "portal");
    }
    state.editorLevel.tiles.push({ x, y, type: state.selectedTool });
  }

  drawEditor();
}

function newEditorLevel() {
  state.editorLevel = createBlankLevel();
  state.editingLevelId = null;
  state.editorLevel.name = "Yeni Seviye";
  levelNameInput.value = state.editorLevel.name;
  drawEditor();
}

function saveEditorLevel() {
  const name = levelNameInput.value.trim() || "Isimsiz Seviye";
  const hasPortal = state.editorLevel.tiles.some((tile) => tile.type === "portal");
  if (!hasPortal) {
    showMessage({
      title: "Bitis eksik",
      body: "Seviyede en az bir bitis kapisi olmali.",
      icon: "portal",
      button: "Tamam",
      onConfirm: () => messageOverlay.classList.add("hidden")
    });
    return;
  }

  const nextLevel = structuredClone(state.editorLevel);
  nextLevel.name = name;
  nextLevel.id = state.editingLevelId && !isBuiltInLevel(state.editingLevelId)
    ? state.editingLevelId
    : `lvl-${Date.now()}`;

  const existingIndex = state.levels.findIndex((level) => level.id === nextLevel.id);
  if (existingIndex >= 0) {
    state.levels[existingIndex] = nextLevel;
  } else {
    state.levels.push(nextLevel);
  }

  saveLevels();
  state.editingLevelId = nextLevel.id;
  state.editorLevel = structuredClone(nextLevel);
  renderLevelLists();
  showMessage({
    title: "Kaydedildi",
    body: `${name} seviyesi listeye eklendi.`,
    icon: "checkpoint",
    button: "Guzel",
    onConfirm: () => messageOverlay.classList.add("hidden")
  });
}

function loadLevelIntoEditor(levelId) {
  const level = state.levels.find((entry) => entry.id === levelId);
  if (!level) {
    return;
  }

  state.editorLevel = structuredClone(level);
  state.editingLevelId = level.id;
  levelNameInput.value = level.name;
  setActiveTab("editor");
  drawEditor();
}

function deleteLevel(levelId) {
  if (isBuiltInLevel(levelId)) {
    const hiddenBuiltIns = new Set(JSON.parse(localStorage.getItem(HIDDEN_BUILTINS_KEY) || "[]"));
    hiddenBuiltIns.add(levelId);
    localStorage.setItem(HIDDEN_BUILTINS_KEY, JSON.stringify([...hiddenBuiltIns]));
  }
  state.levels = state.levels.filter((level) => level.id !== levelId);
  saveLevels();
  renderLevelLists();
  if (state.editingLevelId === levelId) {
    newEditorLevel();
  }
}

function fillGround() {
  for (let x = 0; x < COLS; x += 1) {
    setEditorTile(x, ROWS - 1, "grassA");
  }
  drawEditor();
}

function clearEditor() {
  state.editorLevel.tiles = [];
  state.editorLevel.spawn = { x: 1, y: ROWS - 3 };
  drawEditor();
}

function setEditorTile(x, y, type) {
  const existing = state.editorLevel.tiles.findIndex((tile) => tile.x === x && tile.y === y);
  if (existing >= 0) {
    state.editorLevel.tiles.splice(existing, 1);
  }
  state.editorLevel.tiles.push({ x, y, type });
}

function drawEditorTile(tile, px, py, cell, tileLookup) {
  const sprite = toolDefs[tile.type]?.sprite || tile.type;
  const image = state.images[sprite];
  if (!image) {
    return;
  }

  const supportStyle = getSupportStyle(tileLookup, tile.x, tile.y);
  const supportOffset = getSurfaceAnchorY(
    tile.type === "cannonLeft" || tile.type === "cannonRight" ? "cannon" : tile.type,
    supportStyle
  );
  const supportScaleOffset = supportOffset * (cell / TILE);

  if (tile.type === "cannonLeft") {
    editorCtx.save();
    editorCtx.translate(px + cell / 2, py + 6 + supportScaleOffset);
    editorCtx.scale(-1, 1);
    editorCtx.drawImage(image, -(cell + 4) / 2, 0, cell + 4, cell - 10);
    editorCtx.restore();
    return;
  }

  if (tile.type === "cannonRight") {
    editorCtx.drawImage(image, px - 2, py + 6 + supportScaleOffset, cell + 4, cell - 10);
    return;
  }

  if (tile.type === "hangingSpike") {
    editorCtx.drawImage(image, px + 8, py - 4, cell - 16, cell + 8);
    return;
  }

  const tweak = renderTweaks[tile.type];
  if (tweak) {
    const scale = cell / TILE;
    editorCtx.drawImage(
      image,
      px + tweak.x * scale,
      py + tweak.y * scale + supportScaleOffset,
      tweak.width * scale,
      tweak.height * scale
    );
    return;
  }

  editorCtx.drawImage(image, px + 2, py + 2, cell - 4, cell - 4);
}

function overlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

let lastTime = performance.now();
function loop(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;
  updateGame(delta);
  draw();
  requestAnimationFrame(loop);
}

function wireKeyboard() {
  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
      keys.left = true;
    }
    if (event.code === "KeyD" || event.code === "ArrowRight") {
      keys.right = true;
    }
    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
      queueJump();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
      keys.left = false;
    }
    if (event.code === "KeyD" || event.code === "ArrowRight") {
      keys.right = false;
    }
    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
      releaseJump();
    }
  });
}

function wireTouch() {
  document.querySelectorAll(".control-btn").forEach((button) => {
    const control = button.dataset.control;

    const press = (event) => {
      event.preventDefault();
      if (control === "left") {
        keys.left = true;
      }
      if (control === "right") {
        keys.right = true;
      }
      if (control === "jump") {
        queueJump();
      }
    };

    const release = (event) => {
      event.preventDefault();
      if (control === "left") {
        keys.left = false;
      }
      if (control === "right") {
        keys.right = false;
      }
      if (control === "jump") {
        releaseJump();
      }
    };

    button.addEventListener("touchstart", press, { passive: false });
    button.addEventListener("touchend", release, { passive: false });
    button.addEventListener("touchcancel", release, { passive: false });
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
}

function wireInteractionGuards() {
  const guardedElements = [
    canvas,
    touchControls,
    hud,
    messageOverlay,
    toastMessage
  ].filter(Boolean);

  guardedElements.forEach((element) => {
    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    element.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
  });
}

function wireMenu() {
  playTabBtn.addEventListener("click", () => setActiveTab("play"));
  editorTabBtn.addEventListener("click", () => setActiveTab("editor"));
  newLevelBtn.addEventListener("click", newEditorLevel);
  saveLevelBtn.addEventListener("click", saveEditorLevel);
  clearEditorBtn.addEventListener("click", clearEditor);
  fillGroundBtn.addEventListener("click", fillGround);
  editorCanvas.addEventListener("pointerdown", handleEditorPointer);

  levelList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (target.dataset.play) {
      startGame(target.dataset.play);
    }
    if (target.dataset.edit) {
      loadLevelIntoEditor(target.dataset.edit);
    }
  });

  editorLevelList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (target.dataset.load) {
      loadLevelIntoEditor(target.dataset.load);
    }
    if (target.dataset.delete) {
      deleteLevel(target.dataset.delete);
    }
  });

  menuButton.addEventListener("click", () => {
    if (state.scene !== "playing") {
      return;
    }
    showMessage({
      title: "Menuye don?",
      body: "Mevcut kosu kapanacak ama seviyen kaybolmaz.",
      icon: "checkpoint",
      button: "Don",
      onConfirm: returnToMenu
    });
  });
}

overlayButton.addEventListener("click", () => {
  messageOverlay.classList.add("hidden");
  if (state.messageAction) {
    const action = state.messageAction;
    state.messageAction = null;
    action();
  }
});

loadImages()
  .then(() => {
    loadLevels();
    buildPalette();
    renderLevelLists();
    wireKeyboard();
    wireTouch();
    wireInteractionGuards();
    wireMenu();
    levelNameInput.value = state.editorLevel.name;
    updateBestTimeDisplay();
    setActiveTab(null);
    drawEditor();
    drawMenuBackdrop();
    requestAnimationFrame(loop);
  })
  .catch(() => {
    messageTitle.textContent = "Asset yuklenemedi";
    messageBody.textContent = "Gorseller bulunamadi. Dosya yollarini kontrol et.";
    messageOverlay.classList.remove("hidden");
  });
