# Decisions

## 2026-05-28 - 初期スタックと実装範囲

### 背景

PDF Local Unlocker はGitHub Pagesで公開できる静的Webアプリとして作る。PDFとパスワードは外部送信せず、ブラウザ内で完結させる必要がある。

### 選択肢

1. Vite + React + TypeScript + Tailwind CSS
2. Vanilla TypeScript + CSS
3. Next.jsなどのフルスタック寄り構成

### 採用した案

Vite + React + TypeScript + Tailwind CSS を採用した。

### 理由

- 静的ビルドをGitHub Pagesに載せやすい
- Web WorkerとWASMの構成を作りやすい
- Reactの状態管理で複数PDFキューと個別パスワード入力を小さく実装できる
- Tailwind CSSのViteプラグイン構成が公式に案内されている

### 採用しなかった案と理由

- Vanilla TypeScriptは依存が少ないが、キューUIや状態更新の実装量が増えやすい
- Next.jsは今回の要件ではサーバー機能が不要で、GitHub Pages公開の前提に対して重い

### 今後見直す条件

- qpdf-wasmがVite Worker内で安定して扱えない場合
- GitHub PagesでWASM配信に問題が出た場合

## 2026-05-28 - qpdf実処理はUIモック後に接続する

### 背景

MVPではqpdf-wasmによる実解除が必要だが、初回作業ではプロジェクト土台、UI、記録運用を先に作る必要がある。

### 選択肢

1. 初回からqpdf-wasmの実処理まで入れる
2. Worker型とプレースホルダーを先に作り、UIから差し込める形にする
3. qpdfなしでUIだけ作る

### 採用した案

Worker型とプレースホルダーを先に作り、実処理は次フェーズで接続する。

### 理由

- 初回でビルド可能なアプリ状態を確保できる
- パスワード解析や外部送信を入れず、安全なUI導線から始められる
- qpdf-wasm固有のエラー分類を次回小さく検証できる

### 採用しなかった案と理由

- 初回から実処理まで入れる案は、WASMの読み込みとWorker周りの不確実性が大きい
- qpdfなしでUIだけ作る案は、後続の接続点が曖昧になる

### 今後見直す条件

- qpdf-wasmのAPIがWorker向きでない場合
- 別のqpdf-wasmパッケージのほうが安定していると分かった場合
