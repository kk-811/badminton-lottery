// ===== 状態管理 =====
const MEMBERS = [
  "田中", "佐藤", "鈴木", "高橋",
  "伊藤", "渡辺", "山本", "中村",
  "小林", "加藤"
];

let selectedMembers = [];
let remainingNumbers = [];
let assignedNumbers = {};

// ===== 初期表示 =====
window.onload = function () {
  const list = document.getElementById("member-list");
  list.innerHTML = "";

  MEMBERS.forEach(name => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = name;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + name));
    list.appendChild(label);
  });
};

// ===== メンバー決定 =====
function confirmMembers() {
  const checked = document.querySelectorAll(
    '#member-list input[type="checkbox"]:checked'
  );

  selectedMembers = Array.from(checked).map(c => c.value);

  if (selectedMembers.length < 4) {
    alert("4人以上選んでください");
    return;
  }

  remainingNumbers = [];
  assignedNumbers = {};

  for (let i = 1; i <= selectedMembers.length; i++) {
    remainingNumbers.push(i);
  }

  document.getElementById("member-selection").style.display = "none";
  document.getElementById("lottery-screen").style.display = "block";

  createLotteryCards();
}

// ===== くじカード作成 =====
function createLotteryCards() {
  const area = document.getElementById("lottery-area");
  area.innerHTML = "";

  selectedMembers.forEach(name => {
    const card = document.createElement("div");
    card.className = "lottery-card";
    card.textContent = name;

    card.onclick = function () {
      drawNumber(name, card);
    };

    area.appendChild(card);
  });
}

// ===== 番号を引く =====
function drawNumber(name, card) {
  if (assignedNumbers[name]) return;

  const idx = Math.floor(Math.random() * remainingNumbers.length);
  const number = remainingNumbers.splice(idx, 1)[0];

  assignedNumbers[name] = number;
  card.textContent = number;
  card.style.background = "#ffeaa7";
}
