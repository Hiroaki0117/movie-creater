# Slides

HyperFrames で作った、操作できるスライドデッキと解説動画の置き場。
トップページから選んで開く構成で、Vercel に静的デプロイできます。

| 種類   | 中身                                                                 |
| ------ | -------------------------------------------------------------------- |
| Decks  | `slideshow` ワークフロー。矢印キーで進む HTML デッキ（MP4 ではない） |
| Videos | `faceless-explainer` ワークフロー。書き出した MP4                    |

## 動かす

```bash
npm run serve
```

ビルドしてから静的サーバを立ち上げ、`http://localhost:4173` で確認できます。
**これが本番と同じ条件です** — Vercel は静的ホスティングなので、確認はこちらで行ってください。

デッキを編集しながら作業するときは、ライブリロードと発表者モードが付く方を使います。

```bash
npm run dev
```

| コマンド        | 用途                                                          |
| --------------- | ------------------------------------------------------------- |
| `npm run serve` | 本番相当の静的配信で確認する（ビルド込み）                    |
| `npm run build` | `decks.json` からデッキラッパーとトップのカードを生成する      |
| `npm run dev`   | `hyperframes present`。編集中の確認・発表者モード             |
| `npm run check` | lint・実行時・レイアウト・モーション・コントラストを一括検証   |
| `npm run studio`| Studio でタイムラインを触る                                    |

## 操作

- **← / →**、**Space / Backspace** … スライドと段階表示を移動
- **P** またはナビの Present ボタン … 発表者モード（別タブに聴衆用ビューが開く）
- 左上の **← 一覧** … トップページに戻る（発表者モード・全画面では消える）
- スライド 07 右下のホットスポット … 決定論ルールの詳細へ分岐

## デプロイ（Vercel）

リポジトリを Vercel にインポートするだけです。`vercel.json` で以下を指定済み:

- Framework: なし（静的）
- Build Command: `node scripts/build.mjs`
- Output Directory: `.`

外部 CDN への依存はありません。GSAP もプレイヤーのバンドルもリポジトリに同梱してあるので、
デプロイ後の表示が他所のホストの生死に左右されることはありません。

`.vercelignore` で `.agents/` や制作用メタデータ（`BRIEF.md` など）は配信対象から外しています。

## 収録している解説動画

`videos/hyperframes-skills-tour/` — 「スキルの使い方と、作れるもの」（89秒 / 10シーン / 無音）。

前半で `/hyperframes` に一言投げてから MP4 が出るまでの流れを追い、後半で入力の種類ごとに
何が作れるのかを一覧します。デザインは `code-editorial` プリセット。

**ナレーションはありません。** ローカルの Kokoro TTS は日本語を音素化できず
（espeak-ng が日本語非対応で、Unicode 文字名を英語で読み上げる）、代替の misaki[ja] は
pyopenjtalk の C++ ビルドに Windows SDK を要求するため断念しました。日本語音声が要る場合は
`npx hyperframes auth login` で HeyGen にサインインすれば本来の経路が使えます
（尺の組み直しは発生します）。

動画を編集して作り直す手順:

```bash
npx hyperframes check ./videos/hyperframes-skills-tour
```

```bash
npx hyperframes render ./videos/hyperframes-skills-tour --skill=faceless-explainer --quality high --output renders/video.mp4
```

書き出した MP4 を `media/hyperframes-skills-tour.mp4` に置き換えてから `npm run build` します。

## デッキを追加する

1. 新しいコンポジションを作る

   ```bash
   npx hyperframes init composition-2 --example blank --resolution landscape --non-interactive
   ```

2. `decks.json` に 1 エントリ足す

   ```json
   {
     "id": "my-deck",
     "title": "タイトル",
     "subtitle": "サブタイトル",
     "description": "カードに出る説明",
     "composition": "/composition-2/index.html",
     "accent": "#f5b942",
     "tags": ["タグ"]
   }
   ```

3. `npm run build`

`decks/<id>/index.html` が生成され、トップにカードが追加されます。
スライド枚数・段階表示の数・分岐の枚数はコンポジションから自動で数えます。

## 構成

| パス                            | 役割                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `index.html`                    | トップページ。カード部分は `npm run build` が生成する       |
| `decks/<id>/index.html`         | デッキのラッパー（生成物・直接編集しない）                  |
| `composition/index.html`        | デッキ本体。島 + 11 シーン + root タイムライン + 可視性制御 |
| `composition/vendor/gsap.min.js`| 同梱した GSAP                                               |
| `vendor/*.js`                   | 同梱した HyperFrames プレイヤー / スライドショー            |
| `decks.json`                    | デッキ一覧の定義                                            |
| `scripts/build.mjs`             | ラッパーとカードの生成                                      |
| `scripts/deck-template.html`    | ラッパーのテンプレート                                      |
| `scripts/serve.mjs`             | 本番相当の静的サーバ                                        |
| `composition/BRIEF.md`          | 確定した制作意図。ワークフローが再開時に読む                |

デッキ本体の内訳は本線 9 枚 + 分岐 2 枚。

| #   | scene id      | 内容                                                  |
| --- | ------------- | ----------------------------------------------------- |
| 01  | `hook`        | HyperFrames は HTML を動画のソース形式に変える         |
| 02  | `install`     | 前提は Node 22+ と FFmpeg。init / preview / render     |
| 03  | `anatomy`     | ルート1つ + クリップ。`class="clip"` が必須            |
| 04  | `timing`      | `data-start` / `data-duration` / `data-track-index`    |
| 05  | `tracks`      | トラック = 重なり順、クリップ = 表示区間               |
| 06  | `gsap`        | paused な GSAP タイムライン1本、`window.__timelines`   |
| 07  | `determinism` | 時計・乱数・無限ループが使えない理由（分岐あり）       |
| 08  | `cli`         | init → preview → check → render の流れ                 |
| 09  | `close`       | クロージング                                           |
| ↳   | `det-why`     | 分岐: 1フレームは時刻だけから再現できなければならない  |
| ↳   | `det-fix`     | 分岐: 時計や乱数はトゥイーンに置き換える               |

## 実装メモ（コンポジションを触る前に読む）

`present` も静的配信も、コンポジションを **HyperFrames ランタイム抜き**でホストします。
iframe に入るスクリプトは GSAP とコンポジション自身のものだけで、プレイヤーは
`window.__timelines.root` を直接駆動するフォールバック経路で動きます。
そのため通常のコンポジションとは違う作りが必要です。

1. **`root` タイムライン1本**が全体の尺（118秒）を張る。
2. **可視性コントローラ**が `root.time()` を見て、アクティブなシーン1枚だけを表示する。
3. **scenes の postMessage** で各シーンの時間範囲を親フレームへ通知する。
   これが無いとスライドショーは `sceneId` を解決できず、**1枚も表示されません**。
   分岐シーンも必ず含めること。島の `startTime` / `endTime` は代替になりません。

登場と段階表示は **CSS トランジション + クラス切り替え**で実装しています。
命令的な GSAP トゥイーンで出す方式にしないでください — rAF が止まった瞬間
（タブが背面、ウィンドウが隠れた等）に要素が opacity 0 のまま取り残されます。
現在の実装は表示状態が再生位置 `t` の純粋な関数なので、前後どちらへシークしても
必ず正しい状態に落ち着きます。

島（スライド定義）は `composition/index.html` 側が唯一の正で、ラッパーへは
`npm run build` が複製します。`decks/` 以下を直接編集しないでください。

## MP4 について

成果物は**デッキそのもの**で、`render` での MP4 書き出しは対象外・未検証です。
実行した場合、分岐スライド（`det-why` / `det-fix`）も尺に含まれます。
静止画が要る場合は `hyperframes snapshot` を使ってください。
