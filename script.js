let privateMode = false;
let torMode = false;

function navigate() {
  const input = document.getElementById("urlInput").value.trim();
  const frame = document.getElementById("browserView");

  let url = "";
  if (input.startsWith("http")) {
    url = input;
  } else if (input.includes(".") && !input.includes(" ")) {
    url = "https://" + input;
  } else {
    // 検索：TorモードならDuckDuckGo、それ以外はSearX
    const engine = torMode
      ? "https://duckduckgo.com/?q="
      : "https://searx.be/search?q=";
    url = engine + encodeURIComponent(input);
  }

  // 広告ブロック対象ならブロック（例：ads.google.com）
  if (/(ads|doubleclick|tracking|googlesyndication)/i.test(url)) {
    alert("🔒 広告またはトラッカーをブロックしました");
    return;
  }

  frame.src = url;

  if (!privateMode) {
    saveHistory(url);
  }
}

function saveHistory(url) {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({ url, time: new Date().toISOString() });
  localStorage.setItem("history", JSON.stringify(history));
}

function addBookmark() {
  const url = document.getElementById("browserView").src;
  if (!url) return alert("URLが読み込まれていません");
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  bookmarks.push(url);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  alert("⭐ ブックマークに追加しました");
}

function viewBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  showPopup("📚 ブックマーク一覧", bookmarks.map(u => `<div><a href="#" onclick="openLink('${u}')">${u}</a></div>`));
}

function viewHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  showPopup("📜 履歴一覧", history.map(h => `<div><a href="#" onclick="openLink('${h.url}')">${h.url}</a> (${h.time})</div>`));
}

function showPopup(title, contentArray) {
  const popup = document.getElementById("popup");
  popup.innerHTML = `<h3>${title}</h3>` + contentArray.join("");
  popup.hidden = false;
  setTimeout(() => popup.hidden = true, 10000);
}

function openLink(url) {
  document.getElementById("browserView").src = url;
}

function clearAll() {
  if (confirm("すべての履歴とブックマークを削除しますか？")) {
    localStorage.clear();
    alert("🧹 消去完了");
  }
}

function togglePrivate() {
  privateMode = !privateMode;
  alert(privateMode ? "🕵️‍♂️ プライベートモード ON" : "🕵️‍♂️ プライベートモード OFF");
}

function toggleTor() {
  torMode = !torMode;
  alert(torMode ? "🧅 Torモード（DuckDuckGo）ON" : "🧅 Torモード OFF");
}
