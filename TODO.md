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

- [ ] qpdf-wasmのブラウザ動作を検証する
- [ ] qpdf-wasmをWeb Worker内で初期化する
- [ ] 1ファイルの解除処理を実装する
- [ ] wrong password / unsupported / unknown error を分類する
- [ ] 処理後のメモリ解放を確認する

## Phase 3: 複数PDF処理

- [ ] 順次処理キューを実処理に接続する
- [ ] 成功ファイルをBlobとして保持する
- [ ] 個別ダウンロードを実データに接続する
- [ ] JSZipで成功ファイルを一括ダウンロードする
- [ ] 失敗ファイルだけ再試行できるようにする

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
