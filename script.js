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

function generateMatches(n) {
  if (n < 4 || n > 10) {
    throw new Error("人数は4〜10人にしてください");
  }

  const players = [];
  for (let i = 1; i <= n; i++) {
    players.push(i);
  }

  const playCount = Array(n).fill(0);
  const restCount = Array(n).fill(0);

  const matches = [];

  // 1試合目は固定
  matches.push([1, 2, 3, 4]);
  for (let i = 0; i < 4; i++) playCount[i]++;

  // 試合数の目安（全員がほぼ同じ回数出る）
  const totalMatches = Math.ceil((n * 2) / 4);

  for (let m = 1; m < totalMatches; m++) {
    // 出場回数が少ない順にソート
    const sorted = players
      .slice()
      .sort((a, b) => playCount[a - 1] - playCount[b - 1]);

    const match = sorted.slice(0, 4);
    matches.push(match);

    for (let i = 0; i < n; i++) {
      if (match.includes(i + 1)) {
        playCount[i]++;
      } else {
        restCount[i]++;
      }
    }
  }

  return matches;
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

  // ★ ここが重要
  MATCH_TABLE[n] = generateMatches(n);
  currentMatchIndex = 0;

  document.getElementById("lottery-screen").style.display = "none";
  document.getElementById("match-screen").style.display = "block";

  showMatch();
}
