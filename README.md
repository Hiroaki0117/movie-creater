# HyperFrames 入門デッキ

HyperFrames の使い方を実装者向けに解説する、操作可能なスライドデッキです。
デッキそのものが HyperFrames のコンポジションとして書かれています。

## 起動

```bash
npm run dev
```

`hyperframes present` がローカルサーバを立ち上げ、ナビゲーション付きのデッキを開きます。
表示された URL をブラウザで開いてください。

- **← / →**、**Space / Backspace** … スライドと段階表示（fragment）を進める / 戻る
- **P** またはナビの Present ボタン … 発表者モード（別タブに聴衆用ビューが開く）
- スライド 07 の右下 … ホットスポットから決定論ルールの詳細へ分岐する

> デッキは `file://` で直接開かず、必ず `npm run dev` 経由で開いてください。
> スライドショーのナビゲーション chrome はサーバ側が提供します。

## 中身

| パス                     | 役割                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| `composition/index.html` | デッキ本体。JSON島（スライド定義）+ 11 シーン + GSAP タイムライン    |
| `composition/BRIEF.md`   | 確定した制作意図。ワークフローが再開時に読む                        |
| `.claude/skills/`        | HyperFrames のエージェント用スキル群                                |

## 検証

```bash
npm run check
```

lint・実行時・レイアウト・モーション・コントラストを一括で検証します。
編集したら必ず通してください。

## 構成

本線 9 枚 + 分岐 2 枚。

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

## MP4 について

このデッキは **`hyperframes render` で MP4 にはできません。**
スライドショーは各スライドを独立したトップレベルのコンポジションとして持ち、
それらを束ねる master-root を持たないため、`render` は先頭シーンだけを解決して
無言で切り詰められた MP4 を出力します。

静止画が要る場合は `hyperframes snapshot` を使ってください。
"# movie-creater" 
