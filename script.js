let remainingNumbers = [];
let assignedNumbers = {};
let selectedMembers = [];

// 固定メンバー一覧
const MEMBERS = [
  "田中", "佐藤", "鈴木", "高橋",
  "伊藤", "渡辺", "山本", "中村",
  "小林", "加藤"
];

// ページ読み込み時
window.onload = function () {
  const list = document.getElementById("member-list");

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

// 決定ボタン
function confirmMembers() {
  const checked = document.querySelectorAll(
    '#member-list input[type="checkbox"]:checked'
  );

  selectedMembers = Array.from(checked).map(c => c.value);

  if (selectedMembers.length < 4) {
    alert("4人以上選んでください");
    return;
  }

  // 画面切り替え
  document.getElementById("member-selection").style.display = "none";
  document.getElementById("lottery-screen").style.display = "block";

  createLotteryCards();
    // くじ番号を初期化
  remainingNumbers = [];
  assignedNumbers = {};

  for (let i = 1; i <= selectedMembers.length; i++) {
    remainingNumbers.push(i);
  }

}

function createLotteryCards() {
  const area = document.getElementById("lottery-area");
  area.innerHTML = "";

  selectedMembers.forEach(name => {
    const card = document.createElement("div");
    card.className = "lottery-card";

    // 名前表示
    const nameDiv = document.createElement("div");
    nameDiv.textContent = name;
    nameDiv.className = "card-name";

    // 番号表示（最初は空）
    const numberDiv = document.createElement("div");
    numberDiv.className = "card-number";

    card.appendChild(nameDiv);
    card.appendChild(numberDiv);

    card.onclick = function () {
      drawNumber(name, card);
    };

    area.appendChild(card);
  });
}


function drawNumber(name, card) {
  if (assignedNumbers[name]) return;

  const idx = Math.floor(Math.random() * remainingNumbers.length);
  const number = remainingNumbers.splice(idx, 1)[0];

  assignedNumbers[name] = number;

  // 表示切り替え
  card.querySelector(".card-name").style.display = "none";
  card.querySelector(".card-number").textContent = number;

  card.style.background = "#ffeaa7";
}

}

