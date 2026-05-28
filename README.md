# PDF Local Unlocker

PDF Local Unlocker は、正しいパスワードを知っているPDFをブラウザ内だけで開き、パスワードなしPDFとして保存できるようにする静的Webアプリです。

## 現在の進捗

### 2026-05-28

- Vite + React + TypeScript + Tailwind CSS の初期構成を作成
- ドラッグ&ドロップ、複数PDFキュー、共通パスワード、ファイル別パスワード入力のUIモックを実装
- 個別ダウンロード、ZIPダウンロード、再試行ボタンの導線を配置
- qpdf-wasm 用のWorker型と実行処理を追加
- devlog / decisions / TODO の初期ファイルを追加
- 初期画面スクリーンショット: `docs/devlog/2026-05-28-home.png`
- GitHub ActionsでコミットごとにGitHub Pagesへ自動デプロイするワークフローを追加
- qpdf-wasmをWeb Workerに接続し、既知パスワードによるPDF解除処理を実装
- 成功したPDFをBlobとして保持し、個別ダウンロードとZIP一括ダウンロードの対象にする処理を接続
- wrong password / unsupported / qpdf error の基本分類を追加
- 処理中にWorkerを停止できるキャンセル操作を追加
- WebAssembly / Web Worker / Blob URL / crypto.randomUUID のブラウザ互換性チェックを追加
- パスワードがかかっていないPDFを `Already unlocked` として認識し、パスワード不要で処理できるようにした

## できること

- PDFファイルを複数選択またはドラッグ&ドロップする
- 共通パスワードを入力する
- ファイルごとに別パスワードを入力する
- 共通パスワードを特定ファイルへコピーする
- ファイルごとの状態を確認する
- 正しい既知パスワードでPDFのパスワード解除を実行する
- 成功ファイルを個別ダウンロードする
- 成功ファイルをZIPで一括ダウンロードする
- 処理中にキャンセルする
- ブラウザがローカル処理に必要な機能を持っているか確認する
- パスワードなしPDFを検出し、元PDFのままダウンロード/ZIP対象にする

## まだできないこと

- GitHub Actions上でのPagesデプロイ成功確認
- すべてのPDF暗号化方式への対応保証
- 処理キャンセル
- 処理キャンセル後の大きなPDFでのメモリ挙動確認
- スマホ表示の詳細確認
- パスワードなしPDFを含む複数PDFバッチの実ブラウザ確認

## セキュリティ方針

- PDFとパスワードを外部サーバーへアップロードしない
- パスワードを localStorage / sessionStorage / IndexedDB に保存しない
- パスワードをログ、URL、エラー文、devlogに出さない
- パスワード解析、総当たり、辞書攻撃は実装しない
- 自分が所有している、または正当に利用許可を得ているPDFだけに使う

## セットアップ

```bash
npm install
```

## 開発コマンド

```bash
npm run dev
npm run build
npm run preview
```

## GitHub Pages公開方針

- Viteの `base` は静的公開しやすいように `./` に設定
- `npm run build` で `dist/` を生成
- `.github/workflows/deploy.yml` が `main` / `master` へのpushごとに `dist/` をGitHub Pagesへデプロイ
- 手動再実行用に `workflow_dispatch` も有効
- 公開前にブラウザのNetworkでPDFが外部送信されないことを確認する

## 使用ライブラリ

- Vite
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
- JSZip
- @neslinesli93/qpdf-wasm

## 既知の制限

- 現時点ではUIモック段階で、実際のPDF解除は未実装
- すべてのPDF暗号化方式に対応できるとは限らない
- 大きなPDFではブラウザのメモリ不足になる可能性がある
- 古いブラウザではWebAssembly Workerが動作しない可能性がある
- PDF内容の編集、結合、分割、圧縮は対象外

## 今後の予定

1. ブラウザ上で複数の実PDFサンプルを使って解除結果を確認する
2. GitHub Actions上でPagesデプロイが成功することを確認する
3. 公開URLをREADMEに追記する
4. スマホ表示を追加確認する
5. qpdf-wasmのエラー分類を実PDFで増やす
6. 大きめのPDFでキャンセル後の再試行を確認する
7. パスワード付き/なし混在バッチを実ブラウザで確認する
