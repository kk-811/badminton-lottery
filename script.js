const MEMBERS = [
  "田中", "佐藤", "鈴木", "高橋",
  "伊藤", "渡辺", "山本", "中村",
  "小林", "加藤"
];

let selectedMembers = [];
let remainingNumbers = [];
let assignedNumbers = {};
let currentDrawerIndex = 0;

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
