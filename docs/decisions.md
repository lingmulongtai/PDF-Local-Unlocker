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

## 2026-05-28 - GitHub Pagesを公式Pages Actionsでデプロイする

### 背景

GitHub Pagesの公開設定がActionsベースで有効になったため、コミットごとにViteのビルド成果物を自動公開する必要がある。

### 選択肢

1. GitHub公式の `configure-pages` / `upload-pages-artifact` / `deploy-pages` を使う
2. `gh-pages` ブランチへビルド成果物をコミットする
3. サードパーティのPagesデプロイActionを使う

### 採用した案

GitHub公式のPages Actionsを使う。

### 理由

- GitHub DocsでカスタムPagesワークフローとして案内されている
- `dist/` をartifactとしてアップロードし、Pages環境へ直接デプロイできる
- ビルド成果物をリポジトリの別ブランチへコミットしなくてよい
- `pages: write` と `id-token: write` の最小限のPages権限で運用できる

### 採用しなかった案と理由

- `gh-pages` ブランチ運用は履歴にビルド成果物が増え、管理対象が広がる
- サードパーティActionは今回の要件では不要

### 今後見直す条件

- GitHub公式Actionのメジャーバージョンが更新された場合
- リポジトリのデフォルトブランチが `main` / `master` 以外になる場合

## 2026-05-28 - qpdf.wasmはVite asset URLとしてWorkerにバンドルする

### 背景

qpdf-wasmはJavaScript本体と `qpdf.wasm` を別ファイルとして配布している。GitHub Pages配下でもパスが崩れないように、Workerから安定してWASMを参照する必要がある。

### 選択肢

1. `public/wasm/qpdf.wasm` に手動コピーして固定パスで読む
2. `@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url` としてViteにasset管理させる
3. CDNからWASMを読む

### 採用した案

Viteの `?url` asset importで `qpdf.wasm` をWorkerにバンドルする。

### 理由

- GitHub PagesのサブパスでもViteが正しいURLに変換できる
- 依存ファイルをCDNへ取りに行かないため、ローカル処理という説明と矛盾しにくい
- `public/` に手動コピーする運用が不要になる

### 採用しなかった案と理由

- `public/wasm` 固定配置は重複管理になりやすい
- CDN利用は公開版のプライバシー説明と相性が悪い

### 今後見直す条件

- qpdf-wasmのパッケージ構成が変わった場合
- GitHub Pages上でWASMのMIME typeや読み込みに問題が出た場合

## 2026-05-28 - qpdfの標準出力と標準エラーはWorker内で捕捉する

### 背景

qpdf-wasmはqpdfの標準出力と標準エラーを `console.log` / `console.error` に流す実装になっている。エラー文にパスワードが出る想定ではないが、パスワードをログに残さない方針を強く守る必要がある。

### 選択肢

1. qpdfの出力をそのままブラウザコンソールへ流す
2. Worker初期化時にconsole出力を捕捉し、UI向けの安全なエラー文へ変換する
3. qpdfの出力を完全に捨てる

### 採用した案

Worker初期化時にqpdfのconsole出力を捕捉し、分類にだけ使う。

### 理由

- パスワードやファイル内容をブラウザコンソールへ残さない
- `invalid password` などの出力を安全なUI文言へ変換できる
- 詳細ログを保存しない方針を維持できる

### 採用しなかった案と理由

- そのままコンソールへ流す案は、ログを残さない方針と合わない
- 完全に捨てる案は、wrong passwordなどの分類精度が落ちる

### 今後見直す条件

- qpdf-wasmが出力制御APIを提供した場合
- エラー分類をより細かくする必要が出た場合

## 2026-05-28 - キャンセルはWorker terminateで実装する

### 背景

qpdf-wasmの `callMain` は同期的に重い処理を行うため、処理中PDFを途中停止するにはWorkerごと止める必要がある。

### 選択肢

1. 現在処理中のPDFが終わるまで待ってから次を止める
2. Workerを `terminate()` して現在処理中のPDFも停止する
3. キャンセルをMVPから外す

### 採用した案

Workerを `terminate()` して保留中の処理を `cancelled` として扱う。

### 理由

- 大きいPDFでユーザーが待ち続ける状態を避けられる
- qpdf-wasm内部にキャンセルAPIがなくても実装できる
- 成功済みファイルはそのまま残し、キャンセルされたファイルだけ再試行できる

### 採用しなかった案と理由

- 現在処理中PDFの完了待ちは、重いファイルではキャンセルの意味が薄い
- キャンセルを外す案は、MVP後半の使い勝手に不安が残る

### 今後見直す条件

- qpdf-wasmがキャンセル可能な非同期APIを提供した場合
- Worker再生成コストが体感上問題になる場合

## 2026-05-28 - 必須ブラウザ機能を起動時に表示する

### 背景

このアプリはWebAssembly、Web Worker、Blob URL、crypto.randomUUIDに依存する。古いブラウザで黙って失敗すると、PDFやパスワードがどう扱われたかユーザーが不安になりやすい。

### 選択肢

1. 処理開始時に失敗したらエラー表示する
2. 起動時に必要機能を確認し、足りない場合は処理UIを無効化する
3. READMEだけに制限を書く

### 採用した案

起動時に必要機能を確認し、UI上に互換性状態を表示する。

### 理由

- 処理前にローカル実行可否を伝えられる
- 必須機能がない状態でPDF投入やパスワード入力を進めさせない
- READMEを読まないユーザーにも安全側の説明が届く

### 採用しなかった案と理由

- 処理開始時だけのエラーは発見が遅い
- READMEだけではアプリ内の安心感が弱い

### 今後見直す条件

- crypto.randomUUIDなしでも安全なID生成に切り替える場合
- 対応ブラウザ範囲を明示する必要が出た場合
