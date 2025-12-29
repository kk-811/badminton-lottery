// テスト用：JSが読まれているか確認
alert("script.js が読み込まれました");

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
  alert("confirmMembers が呼ばれました");

  const checked = document.querySelectorAll(
    '#member-list input[type="checkbox"]:checked'
  );

  const selectedNames = Array.from(checked).map(c => c.value);

  alert("選択されたメンバー:\n" + selectedNames.join(", "));
}
