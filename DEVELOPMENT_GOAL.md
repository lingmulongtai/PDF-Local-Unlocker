# PDF Local Unlocker - 開発目標

## 1. プロジェクト概要

**PDF Local Unlocker** は、ユーザーが正しいパスワードを知っているPDFに対して、ブラウザ上だけでパスワード解除済みPDFを生成する静的Webアプリである。

GitHub Pagesで公開できるように、サーバー処理・アップロード・ユーザー登録・クラウド保存は行わない。PDFファイルとパスワードはユーザーの端末内、つまりブラウザのメモリ上でのみ扱う。

## 2. 開発目的

複数のパスワード付きPDFを一括で処理し、パスワードなしで開けるPDFとして保存できる、シンプルかつ見た目の良いWebアプリを作る。

特に重視することは以下。

- 完全クライアントサイド処理
- 複数PDFの一括処理
- パスワードはユーザーが知っている前提
- ファイルをサーバーに送信しない安心感
- GitHub Pagesで公開できる静的構成
- 最近のおしゃれなUI
- 開発しやすく、READMEと記録を常に更新できる運用

## 3. 前提・重要なルール

このアプリは、ユーザー本人が所有している、または正当に利用許可を得ているPDFだけを対象にする。

### 実装してよいこと

- ユーザーが入力した正しいパスワードを使ってPDFを開く
- 開けたPDFを、パスワードなしPDFとして保存する
- 複数ファイルを同時または順番に処理する
- 処理結果を個別ダウンロード、またはZIPで一括ダウンロードする

### 実装しないこと

- パスワード解析
- 総当たり攻撃
- 辞書攻撃
- パスワード候補の自動生成
- 他人のPDFを開くことを助ける機能
- サーバーへのPDFアップロード
- パスワードの保存
- 解析ログ・ファイル名・内容の外部送信
- 広告用・分析用トラッキング

## 4. 想定ユーザー

- 自分のPDFのパスワードを毎回入力するのが面倒な人
- 学校・仕事・個人管理で、同じパスワードのPDFを複数持っている人
- オンラインPDF解除サービスにファイルをアップロードしたくない人
- ローカル処理で安心して使いたい人

## 5. MVPで作る機能

### 必須機能

- PDFファイルのドラッグ&ドロップ
- 複数PDFの選択
- 共通パスワード入力
- ファイル別パスワードの上書き入力
- 一括アンロック開始
- ファイルごとの処理状況表示
- 成功・失敗・スキップの表示
- 解除済みPDFの個別ダウンロード
- 成功したPDFのZIP一括ダウンロード
- 間違ったパスワード時のわかりやすいエラー
- すべてクライアント側で処理していることの明示
- パスワードを保存しないことの明示

### MVPでは任意

- PDFプレビュー
- 暗号化状態の詳細表示
- ダークモード切り替え
- 多言語対応
- PWA化
- 処理履歴
- PDFの結合・分割・圧縮


## 5.1 ファイルごとの個別パスワード入力

複数PDFを一括処理する場合、すべてのファイルが同じパスワードとは限らない。そのため、共通パスワードに加えて、ファイルごとの個別パスワード入力を必須機能として実装する。

### 基本仕様

- 共通パスワード欄を用意する
- 各ファイル行に個別パスワード欄を用意する
- 個別パスワードが入力されている場合は、そのファイルでは個別パスワードを優先する
- 個別パスワードが空の場合は、共通パスワードを使う
- 共通パスワードも個別パスワードも空の場合、そのファイルは処理せず「Password required」と表示する
- 個別パスワードは保存しない
- 個別パスワードはログに出さない
- 個別パスワードはlocalStorage / sessionStorage / IndexedDBに保存しない
- ページを閉じたらパスワードは消える

### UI仕様

ファイル一覧の各行に以下を表示する。

- ファイル名
- ファイルサイズ
- 状態バッジ
- 個別パスワード入力欄
- パスワード表示/非表示ボタン
- 共通パスワードをこのファイルにコピーするボタン
- 処理後のダウンロードボタン
- 削除ボタン

### UX方針

- 初期状態では、各ファイルは共通パスワードを使う
- 個別パスワード欄に入力したファイルだけ、個別パスワードを使う
- 個別パスワード欄には `Optional: use a different password for this file` のような説明を入れる
- ファイル行が増えても見やすいように、パスワード欄は折りたたみ可能にしてもよい
- 失敗したファイルだけ個別パスワードを修正して再試行できるようにする
- 成功したファイルのパスワード欄は自動でクリアするか、処理完了後に全パスワードをクリアする

### 処理ルール

パスワード決定ロジックは以下。

```ts
function getPasswordForFile(fileItem: FileItem, commonPassword: string): string | null {
  const individualPassword = fileItem.passwordOverride?.trim();

  if (individualPassword) {
    return individualPassword;
  }

  if (commonPassword.trim()) {
    return commonPassword;
  }

  return null;
}
```

### 状態管理

`FileItem`には、個別パスワード用の状態を持たせる。

```ts
type FileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  passwordOverride: string;
  usePasswordOverride: boolean;
  status: FileStatus;
  progress: number;
  outputBlob?: Blob;
  outputName?: string;
  errorMessage?: string;
};
```

ただし、`usePasswordOverride`は必須ではない。個別パスワード欄が空かどうかで判定してもよい。UIで明示的に「このファイルだけ別パスワードを使う」トグルを作る場合は、`usePasswordOverride`を使う。

### 再試行仕様

- 失敗したファイルだけ再試行できる
- 個別パスワードを修正して、そのファイルだけ再試行できる
- 「失敗したファイルを再試行」ボタンを用意してもよい
- 再試行時も、個別パスワードがあれば個別パスワードを優先する
- 成功済みファイルは再処理しない

### セキュリティ注意

個別パスワード機能は便利だが、扱う情報は機密情報である。以下を必ず守る。

- 入力値をログに出さない
- エラー文にパスワードを含めない
- devlogに実際のパスワードを書かない
- READMEのスクリーンショットにもパスワードが見えないようにする
- テスト用パスワードはダミー値だけを使う

## 6. 技術方針

### 推奨スタック

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- qpdf-wasm
- Web Worker
- JSZip
- GitHub Pages
- GitHub Actions

### 中核ライブラリ

PDFのパスワード解除処理は、`qpdf` をWebAssembly化したライブラリを中心に検討する。

候補:

- `@neslinesli93/qpdf-wasm`
- `@jspawn/qpdf-wasm`
- qpdfを自前でWASMビルドする案

`pdf-lib` は、PDF作成・編集には便利だが、暗号化PDFの解除処理の中核にはしない。必要に応じて、解除後PDFの軽い確認や将来の補助機能に使う。

`PDF.js` は、プレビューやパスワード付きPDFの読み込み確認には使えるが、パスワード解除済みPDFを書き出す中核にはしない。

## 7. 基本アーキテクチャ

```text
User Browser
  |
  |-- React UI
  |     |-- File drop area
  |     |-- Password input
  |     |-- Queue list
  |     |-- Progress display
  |     |-- Download buttons
  |
  |-- Web Worker
  |     |-- qpdf-wasm initialization
  |     |-- PDF decrypt process
  |     |-- memory cleanup
  |
  |-- Browser memory only
        |-- input PDF bytes
        |-- password string
        |-- output PDF bytes
```

## 8. 処理フロー

1. ユーザーがPDFをドラッグ&ドロップする
2. アプリがPDFのみを受け付ける
3. ファイル一覧を表示する
4. ユーザーが共通パスワードを入力する
5. 必要ならファイルごとの個別パスワードを入力する
6. ユーザーが「Unlock PDFs」を押す
7. Web Workerを起動する
8. qpdf-wasmを初期化する
9. PDFをWorkerにTransferableとして渡す
10. Worker内の仮想ファイルシステムにPDFを書き込む
11. qpdfで復号・パスワード解除済みPDFを生成する
12. 出力PDFをUint8Arrayとして読み出す
13. UIに結果を返す
14. 成功したファイルはダウンロード可能にする
15. 複数成功した場合はZIP一括ダウンロードを可能にする
16. 処理後、メモリとObject URLを可能な限り解放する

## 9. UI・デザイン方針

全体の雰囲気は「最近のSaaS風」「クリーン」「少しガラス感」「安心感」を重視する。

### デザインキーワード

- soft gradient
- glassmorphism
- rounded 2xl
- subtle shadow
- neumorphismは使いすぎない
- Apple風の余白
- Linear / Arc / Raycast っぽい整理されたUI
- 暗め背景 + 明るいカード、または白基調 + 淡いグラデーション
- アニメーションは控えめで気持ちよく
- 技術ツールっぽいが、怖くない見た目

### 画面構成

#### Hero

- アプリ名
- 短い説明
- 「Files never leave your device」バッジ
- 「No upload」「No account」「Batch unlock」などの信頼ラベル

#### Main Card

- ドラッグ&ドロップエリア
- ファイル選択ボタン
- パスワード入力欄
- パスワード表示切り替え
- 共通パスワード適用
- Unlockボタン

#### File Queue

- ファイル名
- サイズ
- 状態
  - Waiting
  - Processing
  - Success
  - Wrong password
  - Failed
- 個別パスワード欄
- ダウンロードボタン
- 削除ボタン

#### Result Area

- 成功件数
- 失敗件数
- ZIP一括ダウンロード
- もう一度処理
- すべてクリア

#### Privacy / Safety Section

- PDFはアップロードされない
- パスワードは保存しない
- ブラウザ内で処理する
- 許可されたPDFだけに使う

## 10. コンポーネント設計

```text
src/
  main.tsx
  App.tsx
  components/
    Hero.tsx
    PrivacyBadge.tsx
    FileDropzone.tsx
    PasswordPanel.tsx
    FileQueue.tsx
    FileRow.tsx
    ProgressPill.tsx
    ResultActions.tsx
    SafetyNotice.tsx
    ThemeToggle.tsx
  workers/
    qpdf.worker.ts
  lib/
    fileValidation.ts
    formatBytes.ts
    zip.ts
    download.ts
    qpdfTypes.ts
    errors.ts
  styles/
    globals.css
```

## 11. 状態管理

MVPではReactのuseState / useReducerで十分。

### FileItemの状態例

```ts
type FileStatus =
  | "waiting"
  | "processing"
  | "success"
  | "wrong-password"
  | "failed"
  | "skipped";

type FileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  passwordOverride?: string;
  status: FileStatus;
  progress: number;
  outputBlob?: Blob;
  outputName?: string;
  errorMessage?: string;
};
```

## 12. セキュリティ・プライバシー要件

- PDFを外部サーバーへ送らない
- パスワードをlocalStorageに保存しない
- パスワードをsessionStorageに保存しない
- パスワードをURL、ログ、エラー文に含めない
- エラー表示にパスワードを出さない
- デバッグログにもパスワードを出さない
- 分析ツールは入れない
- CDN利用はプロトタイプまでにし、公開版は可能な限り依存ファイルを自前配信する
- Content Security Policyを設定できる範囲で強める
- READMEに利用上の注意を書く
- アプリ内にも「自分が権利を持つPDFだけに使う」旨を明記する

## 13. パフォーマンス要件

- UIスレッドを重くしないため、qpdf処理はWeb Workerで実行する
- ArrayBufferは可能な限りTransferableとしてWorkerへ渡す
- 大きいPDFの処理中もUIが固まらないようにする
- 複数ファイルは最初は順次処理でよい
- 並列処理は将来対応とする
- 処理後は仮想ファイルシステムとObject URLをクリーンアップする
- 大量ファイル投入時は警告を表示する

## 14. エラーハンドリング

### 想定エラー

- PDFではないファイル
- ファイルサイズが大きすぎる
- パスワード未入力
- パスワードが違う
- PDFが破損している
- qpdf-wasm初期化失敗
- ブラウザがWASMに対応していない
- メモリ不足
- ZIP生成失敗

### エラー表示方針

- ユーザー向けには短くわかりやすく表示
- 詳細は開発者向けログに分ける
- パスワードやファイル内容は絶対にログに出さない
- 1つのファイルが失敗しても、他のファイル処理は続ける

## 15. ファイル名ルール

出力ファイル名は以下のようにする。

```text
original-name.unlocked.pdf
```

同名ファイルがある場合は番号を付ける。

```text
original-name.unlocked-2.pdf
```

ZIP名は以下。

```text
pdf-local-unlocker-results.zip
```

## 16. GitHub Pages公開方針

- Viteの`base`をリポジトリ名に合わせる
- GitHub Actionsでビルドとデプロイ
- `dist/`をGitHub Pagesに公開
- `qpdf.wasm`が正しく配信されるか確認する
- 公開前にブラウザのDevTools NetworkでPDFが外部送信されないことを確認する

## 17. READMEに必ず書くこと

READMEは毎回確認し、実装変更に合わせて更新する。

### README必須項目

- プロジェクト名
- 何ができるか
- 何ができないか
- 完全クライアントサイド処理であること
- PDFとパスワードをアップロードしないこと
- 正当な権限を持つPDFだけに使うこと
- セットアップ手順
- 開発コマンド
- ビルド手順
- GitHub Pages公開手順
- 使用ライブラリ
- セキュリティ方針
- 既知の制限
- 今後の予定

## 18. 開発記録の運用

毎回の開発セッションで、以下のどれかを更新する。

```text
docs/devlog/YYYY-MM-DD.md
docs/decisions.md
README.md
TODO.md
```

### devlogに書く内容

- 日付
- その日にやったこと
- 変更したファイル
- 試したこと
- うまくいかなかったこと
- 次にやること
- 未解決の問題

### decisions.mdに書く内容

- 技術選定の理由
- UI方針
- セキュリティ判断
- 実装で迷った点
- 採用しなかった案と理由

## 19. 開発ロードマップ

### Phase 0: 準備

- リポジトリ作成
- Vite + React + TypeScript構築
- Tailwind CSS設定
- README初版作成
- DEVELOPMENT_GOAL.md追加
- SESSION_PROMPT.md追加
- docs/devlog作成

### Phase 1: UIモック

- Hero作成
- Dropzone作成
- File Queue作成
- Password Panel作成
- Result Area作成
- Safety Notice作成
- レスポンシブ対応
- ダークモード検討

### Phase 2: 単一PDF処理

- qpdf-wasm導入
- Web Worker作成
- 1つのPDFを読み込む
- パスワード付きPDFを解除する
- 解除済みPDFをダウンロードする
- 間違ったパスワードのエラー表示

### Phase 3: 複数PDF処理

- キュー処理
- 共通パスワード
- 個別パスワード
- 成功・失敗の一覧表示
- ZIP一括ダウンロード
- 処理中キャンセルの検討

### Phase 4: 品質向上

- UIアニメーション
- アクセシビリティ改善
- エラー文改善
- README更新
- devlog整理
- セキュリティ確認
- ブラウザ互換確認

### Phase 5: 公開

- GitHub Actions設定
- GitHub Pages公開
- 実機テスト
- Network確認
- READMEに公開URL追記
- 利用上の注意を最終確認

## 20. 受け入れ条件

MVP完了の条件は以下。

- GitHub Pages上でアプリが表示できる
- 複数PDFをドラッグ&ドロップできる
- 正しいパスワードでPDFを解除できる
- 間違ったパスワードでは安全に失敗する
- 失敗しても他のPDF処理が止まらない
- 解除済みPDFを個別に保存できる
- 成功分をZIPで保存できる
- PDFがサーバーに送信されないことを確認できる
- READMEに使い方と注意点が書かれている
- docs/devlogに開発記録が残っている
- UIがスマホとPCの両方で破綻しない
- パスワードが保存されない

## 21. 既知の制限としてREADMEに書く候補

- すべてのPDF暗号化方式に対応できるとは限らない
- 非常に大きいPDFではブラウザのメモリ不足になる場合がある
- 古いブラウザでは動作しない場合がある
- PDFの内容を編集するアプリではない
- パスワードを知らないPDFを開くためのアプリではない
- DRMや特殊な保護があるPDFでは動作しない場合がある

## 22. 将来機能

- PDFプレビュー
- 解除前の暗号化状態表示
- PDF結合
- PDF分割
- PDF圧縮
- PDFページ並び替え
- PWA化
- オフライン動作
- 多言語対応
- 処理キャンセル
- 大容量ファイル向けの改善
- デスクトップ版の検討

## 23. 開発時に常に守ること

- 実装前にREADMEを読む
- 実装前にこの開発目標を読む
- 実装後にREADMEを更新する必要がないか確認する
- 実装後にdevlogを更新する
- セキュリティとプライバシーの前提を崩さない
- 便利さのためにファイルをサーバーに送らない
- パスワードを保存しない
- 一度に大きく作りすぎず、小さく動くものを積み上げる
- UIを後回しにしすぎない
- 使う人が不安にならない説明を入れる

## 24. 推奨リポジトリ構成

```text
pdf-local-unlocker/
  README.md
  DEVELOPMENT_GOAL.md
  SESSION_PROMPT.md
  TODO.md
  package.json
  vite.config.ts
  index.html
  public/
    favicon.svg
  src/
    main.tsx
    App.tsx
    components/
    workers/
    lib/
    styles/
  docs/
    devlog/
      YYYY-MM-DD.md
    decisions.md
  .github/
    workflows/
      deploy.yml
```

## 25. 最初の実装タスク

1. Vite + React + TypeScriptのプロジェクトを作る
2. Tailwind CSSを入れる
3. README初版を書く
4. このファイルを`DEVELOPMENT_GOAL.md`として置く
5. セッション用プロンプトを`SESSION_PROMPT.md`として置く
6. UIモックを作る
7. qpdf-wasmの単体検証をする
8. Web Worker化する
9. 1ファイル解除を成功させる
10. 複数ファイル対応へ進む
