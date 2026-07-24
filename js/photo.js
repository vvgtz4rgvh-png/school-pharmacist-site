/* ==========================================================================
   photo.js
   検査記録に添付する写真を、ブラウザ内で圧縮してからプレビュー表示するための
   共通モジュールです。localStorageの容量を圧迫しすぎないよう、
   長辺を最大1000px・JPEG品質0.72程度に自動で圧縮します。
   ========================================================================== */

/**
 * 画像ファイルを読み込み、指定サイズ以内にリサイズ＆圧縮してdataURLで返す
 */
function compressImage(file, maxDim = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
    reader.readAsDataURL(file);
  });
}

/**
 * 写真入力欄(input[type=file])とプレビュー表示欄を1組にして管理する。
 * フォームの送信時は managerObj.getPhotos() で dataURL の配列を取得し、
 * 保存後は managerObj.reset() でプレビューをクリアする。
 */
function createPhotoManager(inputId, previewId, maxPhotos = 3) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  let photos = [];

  function renderPreview() {
    preview.innerHTML = "";
    photos.forEach((src, idx) => {
      const div = document.createElement("div");
      div.className = "photo-thumb";
      div.innerHTML = `<img src="${src}" alt="添付写真${idx + 1}"><button type="button" aria-label="この写真を削除">✕</button>`;
      div.querySelector("button").addEventListener("click", () => {
        photos.splice(idx, 1);
        renderPreview();
      });
      preview.appendChild(div);
    });
    const noteId = "photo-limit-note";
    let note = document.getElementById(noteId);
    if (photos.length >= maxPhotos) {
      if (!note) {
        note = document.createElement("div");
        note.id = noteId;
        note.className = "photo-note";
        preview.appendChild(note);
      }
      note.textContent = `最大${maxPhotos}枚まで添付できます`;
    }
  }

  input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    for (const file of files) {
      if (photos.length >= maxPhotos) break;
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await compressImage(file);
        photos.push(dataUrl);
      } catch (err) {
        console.error(err);
      }
    }
    input.value = "";
    renderPreview();
  });

  return {
    getPhotos: () => photos.slice(),
    reset: () => {
      photos = [];
      renderPreview();
    },
  };
}

/** 写真をクリックした時に大きく表示するライトボックス（全ページ共通） */
function openLightbox(src) {
  let overlay = document.getElementById("lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "lightbox-overlay";
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `<img alt="拡大写真">`;
    overlay.addEventListener("click", () => overlay.classList.remove("show"));
    document.body.appendChild(overlay);
  }
  overlay.querySelector("img").src = src;
  overlay.classList.add("show");
}

/** 記録テーブル内の写真サムネイルをクリックしたらライトボックス表示（イベント委譲） */
function enablePhotoLightbox(containerEl) {
  containerEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("table-thumb")) {
      openLightbox(e.target.dataset.src);
    }
  });
}
