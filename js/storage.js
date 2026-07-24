/* ==========================================================================
   storage.js
   検査記録をブラウザの localStorage に保存する共通モジュール。
   「クラウド保存」ではなく、まずは端末内保存からスタート。
   将来的に Firebase 等に差し替える場合も、この関数群だけ書き換えれば良いように
   薄いラッパーにしてあります。
   ========================================================================== */

const Storage = (() => {
  const PREFIX = "spss_"; // school-pharmacist-support-site

  function keyOf(type) {
    return `${PREFIX}${type}`;
  }

  function getRecords(type) {
    try {
      const raw = localStorage.getItem(keyOf(type));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("記録の読み込みに失敗しました", e);
      return [];
    }
  }

  function saveRecord(type, data) {
    const records = getRecords(type);
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      savedAt: new Date().toISOString(),
      ...data,
    };
    records.unshift(record);
    localStorage.setItem(keyOf(type), JSON.stringify(records));
    return record;
  }

  function deleteRecord(type, id) {
    const records = getRecords(type).filter((r) => r.id !== id);
    localStorage.setItem(keyOf(type), JSON.stringify(records));
  }

  function clearAll(type) {
    localStorage.removeItem(keyOf(type));
  }

  /** この端末でのlocalStorage使用量の目安を計算する（写真添付が容量を増やす主因） */
  function estimateUsage() {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += (localStorage[key].length + key.length) * 2; // UTF-16換算の概算
      }
    }
    const LIMIT_BYTES = 5 * 1024 * 1024; // ブラウザごとに異なるが5MBを目安に警告
    return {
      bytes: total,
      mb: total / (1024 * 1024),
      percent: Math.min(100, (total / LIMIT_BYTES) * 100),
    };
  }

  return { getRecords, saveRecord, deleteRecord, clearAll, estimateUsage };
})();
