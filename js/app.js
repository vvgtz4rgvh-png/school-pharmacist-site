/* ==========================================================================
   app.js
   全ページ共通の初期化処理。
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderBinderHoles();
  highlightActiveTab();
  renderTodayLabel();
  renderFooterYear();
});

/** 左端のバインダー穴を高さに応じて生成する（サイトの署名的な装飾要素） */
function renderBinderHoles() {
  document.querySelectorAll(".binder-holes").forEach((el) => {
    const h = document.documentElement.scrollHeight;
    const count = Math.max(4, Math.floor(h / 90));
    el.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.style.top = `${40 + i * 90}px`;
      el.appendChild(span);
    }
  });
}
window.addEventListener("resize", () => {
  clearTimeout(window.__holeTimer);
  window.__holeTimer = setTimeout(renderBinderHoles, 200);
});

/** 現在のページに対応するタブに active クラスを付与 */
function highlightActiveTab() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".tabnav a").forEach((a) => {
    const href = a.getAttribute("href").split("/").pop();
    if (href === current) a.classList.add("active");
  });
}

/** ヘッダー右上に今日の日付を表示 */
function renderTodayLabel() {
  const el = document.getElementById("today-label");
  if (!el) return;
  const d = new Date();
  const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  el.textContent = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w}）`;
}

function renderFooterYear() {
  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/** 判定バッジ生成 */
function badgeHTML(pass) {
  return pass
    ? `<span class="badge pass">適合</span>`
    : `<span class="badge fail">要改善</span>`;
}

/** 保存容量の目安メーターを描画する（写真添付ページなどで使用） */
function renderStorageMeter(elId) {
  const el = document.getElementById(elId);
  if (!el || typeof Storage === "undefined" || !Storage.estimateUsage) return;
  const u = Storage.estimateUsage();
  el.classList.toggle("warn", u.percent > 70);
  el.innerHTML = `
    この端末の保存容量の目安：約${u.mb.toFixed(2)}MB
    <span class="bar"><span style="width:${Math.max(3, u.percent)}%"></span></span>
    ${u.percent > 70 ? "（残り容量が少なくなっています。CSV書き出しでバックアップしてください）" : ""}
  `;
}

/** フォーム送信後の一時メッセージ表示 */
function flashStatus(el, text) {
  el.textContent = text;
  el.classList.add("show", "ok");
  clearTimeout(el.__t);
  el.__t = setTimeout(() => el.classList.remove("show"), 2600);
}
