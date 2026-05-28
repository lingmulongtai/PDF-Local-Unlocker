# TODO

## Phase 0: 準備

- [x] Vite + React + TypeScript の構成を作る
- [x] Tailwind CSS を設定する
- [x] README 初版を作る
- [x] docs/devlog を作る
- [x] docs/decisions.md を作る

## Phase 1: UIモック

- [x] Hero / privacy badge
- [x] Drag & drop area
- [x] Common password panel
- [x] File queue
- [x] File-level password override
- [x] Result actions
- [x] Safety notice
- [ ] スマホ表示の追加確認

## Phase 2: 単一PDF処理

- [x] qpdf-wasmをWeb Worker内で初期化する
- [x] 1ファイルの解除処理を実装する
- [x] wrong password / unsupported / qpdf error の基本分類を実装する
- [x] qpdf仮想FSの一時ファイル削除を実装する
- [ ] qpdf-wasmのブラウザ実ファイル動作を複数サンプルで検証する
- [ ] 処理後のメモリ解放を追加確認する

## Phase 3: 複数PDF処理

- [x] 順次処理キューを実処理に接続する
- [x] 成功ファイルをBlobとして保持する
- [x] 個別ダウンロードを実データに接続する
- [x] JSZipで成功ファイルを一括ダウンロードする
- [x] 失敗ファイルだけ再試行できるようにする
- [ ] 複数の実PDFで一括処理を確認する

## Phase 4: 品質向上

- [ ] アクセシビリティ確認
- [ ] エラー文言の改善
- [ ] Network確認
- [ ] パスワード保存なしの確認
- [ ] READMEの利用手順を実装状況に合わせて更新

## Phase 5: 公開

- [x] GitHub Actionsを追加する
- [ ] GitHub Actions上でPagesデプロイ成功を確認する
- [ ] GitHub Pagesで公開URLを確認する
- [ ] 公開URLをREADMEに追記する
