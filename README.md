# 学校薬剤師支援サイト

学校薬剤師の実務（プール水検査・ダニ検査・給食室検査・空気/騒音検査）を、
スマホ・PCどちらからでも記録できるようにするための静的サイトです。
GitHub / GitHub Pages を使った公開・運用を通して、HTML・CSS・JavaScript・Git を学ぶ教材も兼ねています。

## できること

- 各検査の「検査方法」と「目安となる基準値」の確認
- 検査記録フォームへの入力 → 自動判定（適合／要改善）→ この端末への保存
- 保存した記録のCSV書き出し・印刷
- 年間予定の登録と、ホーム画面での次回予定表示
- 保健だより・Q&Aの一覧（`data/` フォルダのJSONを編集するだけで更新可能）

## フォルダ構成

```
school-pharmacist-site/
├── index.html          … ホーム
├── css/style.css        … 共通スタイル
├── js/
│   ├── app.js            … 共通初期化処理
│   ├── storage.js         … 記録の保存/読込/削除（localStorage）
│   └── csv.js             … CSV書き出し
├── pages/
│   ├── pool.html          … プール水検査
│   ├── mite.html          … ダニ検査
│   ├── kitchen.html       … 給食室検査
│   ├── air.html           … 空気・騒音検査
│   ├── schedule.html      … 年間予定
│   ├── newsletter.html    … 保健だより
│   └── qa.html            … Q&A
├── data/
│   ├── newsletter.json    … 保健だよりの一覧データ
│   └── qa.json            … Q&Aの一覧データ
└── assets/
    ├── pdf/               … 保健だよりのPDFを置く場所
    └── images/            … 画像置き場
```

## データの保存場所について（重要）

検査記録・年間予定は、**入力した端末のブラウザ内（localStorage）にのみ**保存されます。
サーバーやクラウドには送信されません。そのため、

- 別の端末やブラウザからは記録を見られません
- ブラウザのデータ（サイトデータ／Cookie）を消去すると記録も消えます

大事な記録は、各ページの「CSVで書き出す」ボタンで定期的にバックアップしてください。
将来的にクラウド保存（Googleスプレッドシート連携など）に発展させることも可能です。

## ローカルでの確認方法

`index.html` をブラウザでそのまま開いても大部分は動作しますが、
保健だより・Q&Aページは `fetch` でJSONを読み込むため、ブラウザによっては
`file://` から直接開くとデータが読み込めないことがあります
（その場合は自動的にサンプルデータが表示されます）。

正しく確認したい場合は、フォルダ内で簡易サーバーを起動してください。

```bash
# Pythonがある場合
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## GitHubで公開する手順（GitHub Pages）

1. GitHubで新しいリポジトリを作成します（例：`school-pharmacist-site`）。
2. このフォルダの中身をリポジトリにpushします。

   ```bash
   git init
   git add .
   git commit -m "はじめてのコミット：学校薬剤師支援サイト"
   git branch -M main
   git remote add origin https://github.com/【あなたのユーザー名】/school-pharmacist-site.git
   git push -u origin main
   ```

3. GitHubのリポジトリ画面で `Settings` → `Pages` を開きます。
4. `Source` を `Deploy from a branch`、ブランチを `main`、フォルダを `/ (root)` に設定して保存します。
5. 数分後、`https://【あなたのユーザー名】.github.io/school-pharmacist-site/` でサイトが公開されます。

## 保健だより・Q&Aの更新方法

1. `data/newsletter.json` または `data/qa.json` をテキストエディタで開きます。
2. 既存の項目をコピーして、内容を書き換えます（JSONの記法に注意）。
3. 保健だよりの場合は、PDFファイルを `assets/pdf/` に置き、`file` の値をそのファイル名に合わせます。
4. 変更をコミット・pushすれば、サイトに反映されます。

```bash
git add data/newsletter.json assets/pdf/新しいファイル.pdf
git commit -m "保健だよりを追加：〇〇号"
git push
```

## 学習ロードマップ（段階的に育てる）

1. **基本サイト**：ホーム・各ページ・レスポンシブ対応（← 今回作成した部分）
2. **入力フォームの拡張**：写真添付、必須項目バリデーションの強化
3. **データ活用**：過去記録の年度比較、グラフ表示（Chart.jsなど）
4. **発展機能**：PWA化（オフライン対応・ホーム画面追加）、Googleスプレッドシート連携によるクラウド保存、QRコードでの結果共有

この順番で機能を追加していくと、HTML・CSS・JavaScript・Gitの知識が実務のニーズに沿って自然に身につきます。

## 注意事項

各ページの「目安となる基準値」は一般的な目安として記載しているものです。
実際の判定・報告にあたっては、必ず文部科学省「学校環境衛生基準」および
自治体・学校の最新の指針を正式な基準として確認してください。
