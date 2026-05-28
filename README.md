# PDF Local Unlocker

PDF Local Unlocker は、正しいパスワードを知っているPDFをブラウザ内だけで開き、パスワードなしPDFとして保存できるようにする静的Webアプリです。

## 現在の進捗

### 2026-05-28

- Vite + React + TypeScript + Tailwind CSS の初期構成を作成
- ドラッグ&ドロップ、複数PDFキュー、共通パスワード、ファイル別パスワード入力のUIモックを実装
- 個別ダウンロード、ZIPダウンロード、再試行ボタンの導線を配置
- qpdf-wasm 用のWorker型とプレースホルダーを追加
- qpdf-wasm実処理は未接続のため、現時点のUnlock操作は「Unlock engine pending」を表示する
- devlog / decisions / TODO の初期ファイルを追加
- 初期画面スクリーンショット: `docs/devlog/2026-05-28-home.png`

## できること

- PDFファイルを複数選択またはドラッグ&ドロップする
- 共通パスワードを入力する
- ファイルごとに別パスワードを入力する
- 共通パスワードを特定ファイルへコピーする
- ファイルごとの状態を確認する
- 成功ファイルの個別ダウンロードとZIP一括ダウンロードのUIを使う

## まだできないこと

- 実際のPDFパスワード解除
- qpdf-wasm Workerによる復号処理
- 間違ったパスワードと未対応PDFの実判定
- GitHub Pagesへの自動デプロイ

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
- GitHub ActionsによるPages公開は今後追加予定
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

1. qpdf-wasmをWeb Worker内で初期化する
2. 1ファイルのパスワード解除を成功させる
3. 間違ったパスワード時のエラー分類を実装する
4. 複数PDFの順次処理と成功ファイルのBlob保存を実装する
5. ZIP一括ダウンロードを実データに接続する
6. GitHub Pagesデプロイを追加する
