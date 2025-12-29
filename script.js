let currentMatchIndex = 0;

const MEMBERS = [
  "田中", "佐藤", "鈴木", "高橋",
  "伊藤", "渡辺", "山本", "中村",
  "小林", "加藤"
];

let selectedMembers = [];
let remainingNumbers = [];
let assignedNumbers = {};
let currentDrawerIndex = 0;
let matches = [];



window.onload = function () {
  const list = document.getElementById("member-list");
  list.innerHTML = "";

  for (let i = 0; i < MEMBERS.length; i++) {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = MEMBERS[i];

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + MEMBERS[i]));
    list.appendChild(label);
  }
};

function confirmMembers() {
  const checked = document.querySelectorAll(
    '#member-list input[type="checkbox"]:checked'
  );

  selectedMembers = [];
  for (let i = 0; i < checked.length; i++) {
    selectedMembers.push(checked[i].value);
  }

  if (selectedMembers.length < 4) {
    alert("4人以上選んでください");
    return;
  }

  remainingNumbers = [];
  assignedNumbers = {};
  currentDrawerIndex = 0;

  for (let i = 1; i <= selectedMembers.length; i++) {
    remainingNumbers.push(i);
  }

  document.getElementById("member-selection").style.display = "none";
  document.getElementById("lottery-screen").style.display = "block";

  createLotteryCards();
}

function createLotteryCards() {
  const area = document.getElementById("lottery-area");
  area.innerHTML = "";

  for (let i = 0; i < remainingNumbers.length; i++) {
    const card = document.createElement("div");
    card.className = "lottery-card";
    card.textContent = "？";

    card.onclick = function () {
      drawLottery(card);
    };

    area.appendChild(card);
  }

  updateTurnDisplay();
}

function updateTurnDisplay() {
  if (currentDrawerIndex < selectedMembers.length) {
    document.getElementById("turn-display").textContent =
      "くじ引く人：" + selectedMembers[currentDrawerIndex];
  }
}

function drawLottery(card) {
  if (card.classList.contains("used")) return;
  if (currentDrawerIndex >= selectedMembers.length) return;

  const name = selectedMembers[currentDrawerIndex];

  const idx = Math.floor(Math.random() * remainingNumbers.length);
  const number = remainingNumbers.splice(idx, 1)[0];

  assignedNumbers[name] = number;

  card.textContent = name + "\n" + number;
  card.classList.add("used");
  card.style.background = "#ffeaa7";

  currentDrawerIndex++;
  updateTurnDisplay();
}

function getNameByNumber(num) {
  for (const name in assignedNumbers) {
    if (assignedNumbers[name] === num) return name;
  }
}


function showMatch() {
  const match = matches[currentMatchIndex];
  if (!match) return;

  document.getElementById("teamA1").textContent = getNameByNumber(match[0]);
  document.getElementById("teamA2").textContent = getNameByNumber(match[1]);
  document.getElementById("teamB1").textContent = getNameByNumber(match[2]);
  document.getElementById("teamB2").textContent = getNameByNumber(match[3]);
}



function nextMatch() {
  if (currentMatchIndex < matches.length - 1) {
    currentMatchIndex++;
    showMatch();
  }
}

function prevMatch() {
  if (currentMatchIndex > 0) {
    currentMatchIndex--;
    showMatch();
  }
}

function startMatches() {
  const n = selectedMembers.length;

  if (n < 4 || n > 10) {
    alert("人数は4〜10人にしてください");
    return;
  }

  if (Object.keys(assignedNumbers).length !== n) {
    alert("全員くじを引いてください");
    return;
  }

  // ★ ここを修正
  matches = generateMatches(n);

  currentMatchIndex = 0;

  document.getElementById("lottery-screen").style.display = "none";
  document.getElementById("match-screen").style.display = "block";

  showMatch();
}

// ===== 試合制御 =====
let currentMatchIndex = -1;
let matchHistory = [];

// 偏り管理
let sideStats = {};
let pairCount = {};

// 初期化
function initMatchStats(players) {
  sideStats = {};
  pairCount = {};

  players.forEach(p => {
    sideStats[p] = { left: 0, right: 0 };
    pairCount[p] = {};
    players.forEach(q => pairCount[p][q] = 0);
  });

  matchHistory = [];
  currentMatchIndex = -1;
}

// ===============================
// ① 試合列挙（最大100通り）
// ===============================
function enumerateMatches(players, maxPatterns = 100) {
  const results = [];
  const n = players.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        for (let l = k + 1; l < n; l++) {

          const p = [players[i], players[j], players[k], players[l]];

          const patterns = [
            [p[0], p[1], p[2], p[3]],
            [p[2], p[3], p[0], p[1]],

            [p[0], p[2], p[1], p[3]],
            [p[1], p[3], p[0], p[2]],

            [p[0], p[3], p[1], p[2]],
            [p[1], p[2], p[0], p[3]],
          ];

          for (const m of patterns) {
            results.push(m);
            if (results.length >= maxPatterns) return results;
          }
        }
      }
    }
  }

  return results;
}

// ===============================
// ② スコア評価
// ===============================
function scoreMatch(match) {
  let score = 0;

  // 左右偏り
  score += sideStats[match[0]].left;
  score += sideStats[match[1]].left;
  score += sideStats[match[2]].right;
  score += sideStats[match[3]].right;

  // ペア偏り（重め）
  score += pairCount[match[0]][match[1]] * 5;
  score += pairCount[match[2]][match[3]] * 5;

  return score;
}

// ===============================
// ③ 最適試合選択
// ===============================
function selectBestMatch(players) {
  const candidates = enumerateMatches(players, 100);

  let best = null;
  let bestScore = Infinity;

  for (const m of candidates) {
    const s = scoreMatch(m);
    if (s < bestScore) {
      bestScore = s;
      best = m;
    }
  }

  return best;
}

// ===============================
// ④ 試合反映
// ===============================
function applyMatch(match) {
  sideStats[match[0]].left++;
  sideStats[match[1]].left++;
  sideStats[match[2]].right++;
  sideStats[match[3]].right++;

  pairCount[match[0]][match[1]]++;
  pairCount[match[2]][match[3]]++;
}

// ===============================
// ⑤ 表示
// ===============================
function displayMatch(match) {
  document.getElementById("teamA1").textContent = match[0];
  document.getElementById("teamA2").textContent = match[1];
  document.getElementById("teamB1").textContent = match[2];
  document.getElementById("teamB2").textContent = match[3];
}

// ===============================
// ⑥ 試合開始
// ===============================
function startMatches() {
  if (Object.keys(assignedNumbers).length !== selectedMembers.length) {
    alert("全員くじを引いてください");
    return;
  }

  initMatchStats(selectedMembers);

  document.getElementById("lottery-screen").style.display = "none";
  document.getElementById("match-screen").style.display = "block";

  nextMatch();
}

// ===============================
// ⑦ 次へ / 前へ
// ===============================
function nextMatch() {
  const match = selectBestMatch(selectedMembers);
  applyMatch(match);

  matchHistory.push(match);
  currentMatchIndex++;

  displayMatch(match);
}

function prevMatch() {
  if (currentMatchIndex <= 0) return;

  currentMatchIndex--;
  displayMatch(matchHistory[currentMatchIndex]);
}

