---
format: 1920x1080
duration: 89s
message: "一言投げれば動画が出る。しかも出せるものは動画だけじゃない"
arc: Hook → 流れ（入口 → BRIEF → ルーティング → 組み立て → check → render） → 幅（作れるもの） → 締め
audience: HyperFrames をこれから使う実装者
mode: autonomous
music: none
---

## Video direction

**Palette（`frame.md` の役割に従う。発明しない）** — 地は cream `#FAF9F5`、内容が集まる面は tile
`#EFE9DE`、声は ink `#141413`。コードとターミナルの面だけ warm navy `#181715`。coral `#CC785C`
は**1フレームに1箇所だけ**の電圧で、見出し本文には絶対に使わない。段差はヘアライン
（ink@12%）1本。影・グロー・グラデーションは使わない。

**Type（役割で参照）** — display / headline は EB Garamond（センテンスケース、負トラッキング）。
body / lead / card-title は Inter。kicker・mono-label・コード面は JetBrains Mono。kicker は必ず
coral の ✱ を前置する。日本語は各役割のフォールバックに落ちるため、**サイズと字間で階層を作る**
（書体差だけに頼らない）。

**Motion grammar — 無音版の読み替え** — この動画にナレーションは無い。したがって各シーンの
リビールは**声ではなく拍に同期**する。ただし規律は同じで、**t=0 に全部出さない**。t=0 では
その瞬間に読ませたいものだけを出し、残りは後半 50% に配分する。イージングは長い減衰
（`power3` 既定、跳ねさせない）。読み切るまでの保持時間は日本語の可読性を優先して長めに取る。

**Rhythm / 保持フレームの配分** — 07（render）と 10（締め）は**意図的に静止させる**。
直前が情報量の多いフレームなので、ここで息を抜く。08・09 のカタログは要素が多いぶん
1枚ずつ順に入れ、出そろったら動かさない。**下手に動かすより止める。**

**Negative list** — ナビバー・フッター・スクロールバー・ブラウザ chrome は描かない。
紫青の「AI っぽい」グラデーションとボケ玉は禁止。coral を1フレームに2箇所置かない。
2つの失敗モードも禁止 — 前半に全部出して以降フリーズする「スライドショー」と、
全要素が各自ふわふわ漂う「スクリーンセーバー」。

**Caption band** — 字幕は無効（無音）だが、下端 ~17%（y>897px）には主要な内容を置かない。
背景・環境レイヤーのみ通す。

---

## Frame 1 — Hook

- scene: 「一言、投げるだけ。」が据わり、そこへ「動画が返ってくる。」が続く
- duration: 6s
- transition_in: cut
- status: animated
- blueprint: compose
- focal: 見出しの一文（near full-bleed の EB Garamond display）
- roles: 見出し = foreground subject · cream の地 + 極薄のヘアライングリッド = background · ✱ spike = supporting
- src: compositions/frames/01-hook.html

掴み。HyperFrames が何であるかを説明せず、**何が起きるか**だけを置く。

Scene 1 (0.0–1.6s): cream の地に「一言、投げるだけ。」が per-word reveal で入る。Centered、
文字が横幅の ~72% を占める near full-bleed。背景はヘアライングリッドのみ（ink@6%）。
Scene 2 (1.6–3.4s): 一文目がわずかに上へ送られ、下に「動画が返ってくる。」が入る。
2行の lockup として据わる。ここで初めて ✱ が coral で灯る（この frame 唯一の coral）。
Scene 3 (3.4–6.0s): 完全静止。2行を読み切らせる。カメラは動かさない。

## Frame 2 — 入口はひとつ

- scene: `/hyperframes` の mono カードが中央に据わり、雑多な依頼が両脇から吸い込まれる
- duration: 7s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: `/hyperframes` の mono ラベルカード
- roles: `/hyperframes` カード = foreground subject · 依頼の断片3つ = supporting · tile の面 = background
- src: compositions/frames/02-entry.html

覚える手順は無い、という主張。入口が1つであることを構図で示す。

Scene 1 (0.0–1.4s): kicker「✱ ENTRY POINT」が左上に。見出し「入口は、ひとつ」が
rule-of-thirds の上段に入る。
Scene 2 (1.4–3.6s): 中央に `/hyperframes` の mono カード（tile 面 + ヘアライン）が
scale 0.94→1 で据わる。カードは画面幅の ~46%。
Scene 3 (3.6–5.6s): 「動画を作りたい」「このデッキを直して」「PR を解説したい」の3片が
左右から順に寄ってきてカードの縁で止まる（layer-reveal、拍ごとに1つ）。3層の奥行き。
Scene 4 (5.6–7.0s): 静止して読ませる。

## Frame 3 — 聞かれて、1枚のファイルになる

- scene: 3つの問いが並び、答えが BRIEF.md のコード面に落ちる
- duration: 10s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: BRIEF.md の warm-navy コード面
- roles: コード面 = foreground subject · 問い3つ = supporting · cream の地 = background
- src: compositions/frames/03-brief.html

聞かれる内容と、それがどこに固定されるかを見せる。ここが「二度聞かれない」の根拠。

Scene 1 (0.0–1.2s): kicker「✱ STEP 01—02」。見出し「聞かれて、1枚のファイルになる」。
asymmetric 60/40 — 左に問い、右にファイル。
Scene 2 (1.2–4.2s): 左カラムに問いが1つずつ入る（拍ごと）。「何を伝える動画か」
「どこに置くか」「どのくらいの長さか」。Inter lead、ヘアラインで区切る。
Scene 3 (4.2–7.4s): 右に warm-navy のコード面が立ち上がり、`BRIEF.md` のタイトルバーの下に
frontmatter が1行ずつ typing で書かれる — `workflow:` `message:` `aspect:` `length:`。
値は coral ではなく teal `#5DB8A6`（文字列）で、coral はタイトルバーの ✱ 1箇所のみ。
Scene 4 (7.4–10.0s): 面の下に「以降、同じことは二度聞かれない」が入り、静止。

## Frame 4 — 入力の種類が、出力を決める

- scene: 左の入力から右のワークフローへ、ヘアラインが1本ずつ引かれる
- duration: 10s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: 入力→出力の対応図
- roles: 対応図 = foreground subject · 見出し = supporting · tile の帯 = background
- src: compositions/frames/04-route.html

この動画のいちばん重要な一枚。ワークフローは覚えるものではなく、入力から決まる。

Scene 1 (0.0–1.2s): kicker「✱ STEP 03」。見出し「入力の種類が、出力を決める」を上段に。
Scene 2 (1.2–6.6s): split-screen。左に入力（URL / テキスト / GitHub の PR / 音源）、
右にワークフロー名（mono）。1組ずつ、左のラベル → ヘアラインが右へ draw → 右のラベルが灯る、
を4回繰り返す。拍ごとに1組。
Scene 3 (6.6–8.4s): 4本引き終わったところで、線全体が一度だけ ink@20% に締まる。
Scene 4 (8.4–10.0s): 静止。

## Frame 5 — シーンに割って、1枚ずつ組む

- scene: STORYBOARD.md から HTML フレームの帯が展開する
- duration: 9s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: フレームの帯（full-width strip）
- roles: フレーム帯 = foreground subject · STORYBOARD.md カード = supporting · cream = background
- src: compositions/frames/05-build.html

成果物が「1シーン1ファイルの HTML」であることを見せる。ここが HyperFrames の肝。

Scene 1 (0.0–1.4s): kicker「✱ STEP 04—05」。見出し「シーンに割って、1枚ずつ組む」。
Scene 2 (1.4–3.0s): 上段に `STORYBOARD.md` のカードが1枚。
Scene 3 (3.0–6.8s): カードの下端から full-width strip が展開し、`01-hook.html`
`02-entry.html` … と mono ラベルのタイルが左から順に着地する（stagger、拍ごと）。
タイルは10枚、画面幅いっぱい。
Scene 4 (6.8–9.0s): 最後のタイルが着いたら静止。帯の下に小さく「1シーン = 1ファイルの HTML」。

## Frame 6 — check を通らないと、次に行けない

- scene: 5つの検証項目が順に通り、最後に門が開く
- duration: 9s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: 検証項目のリスト
- roles: リスト = foreground subject · 通過マーク = supporting · tile 面 = background
- src: compositions/frames/06-check.html

品質ゲートの存在を見せる。ここが coral の使いどころ。

Scene 1 (0.0–1.2s): kicker「✱ STEP 06」。見出し「check を通らないと、次に行けない」。
Scene 2 (1.2–5.6s): 中央に5行のリスト。「lint」「実行時エラー」「レイアウト崩れ」
「モーション」「文字コントラスト」。拍ごとに1行ずつ、行頭のマークが灯る。Centered、~52%。
Scene 3 (5.6–7.2s): 5行が揃った瞬間、リスト全体の左に coral の縦罫が1本 draw する
（この frame 唯一の coral）。
Scene 4 (7.2–9.0s): 静止。

## Frame 7 — render

- scene: coral の帯に `render` の一語、そこから MP4 が落ちる
- duration: 6s
- transition_in: cut
- status: animated
- blueprint: compose
- focal: `render` の coral full-bleed 帯
- roles: coral 帯 = foreground subject · 出力ファイル名 = supporting · cream = background
- src: compositions/frames/07-render.html

**保持フレーム。** 直前まで情報量が多いので、ここは一語で息を抜く。

Scene 1 (0.0–1.2s): 画面下 1/3 に coral の full-bleed 帯が左から wipe で入り、
cream の文字で `npx hyperframes render` が乗る。
Scene 2 (1.2–2.8s): 帯の上に `video.mp4` が着地する（mono、大きめ）。
Scene 3 (2.8–6.0s): 完全静止。動かさない。

## Frame 8 — 作れるもの（前半）

- scene: 4枚のカードが2×2で着地し、それぞれ入力→出力を持つ
- duration: 12s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: 2×2 のカードグリッド
- roles: カード4枚 = foreground subject · 見出し = supporting · tile の地 = background
- src: compositions/frames/08-catalog-a.html

第2部の開幕。ここから「何が作れるのか」に切り替わる。

Scene 1 (0.0–1.6s): kicker「✱ WHAT YOU CAN MAKE」。見出し「では、何が作れるのか」。
Scene 2 (1.6–8.0s): 2×2 のヘアラインカードが1枚ずつ着地（拍ごと）。各カードは
mono のワークフロー名 + Inter の一行。
`product-launch-video` — 製品サイトの URL → 製品紹介の動画。
`faceless-explainer` — 記事・メモ・お題 → 解説動画。素材ゼロで成立する。
`pr-to-video` — GitHub の PR → コード変更の解説動画。
`motion-graphics` — 10秒前後。ロゴのスティング、数字のカウントアップ、字幕オーバーレイ。
Scene 3 (8.0–12.0s): 4枚が揃ったら静止。読ませる時間を長く取る。

## Frame 9 — 作れるもの（後半）

- scene: 残り5つが縦の帯として積まれる
- duration: 12s
- transition_in: cut
- status: animated
- blueprint: compose
- focal: 5行の帯リスト
- roles: 帯5本 = foreground subject · `slideshow` の但し書き = supporting · cream = background
- src: compositions/frames/09-catalog-b.html

前フレームと**framing を変える**（2×2 グリッド → 縦積みの帯）。同じ型を続けない。

Scene 1 (0.0–0.8s): 見出しなしで直接リストに入る（前フレームからの連続）。
Scene 2 (0.8–7.2s): 全幅の帯が上から1本ずつ積まれる（拍ごと）。
`slideshow` — プレゼン・ピッチデッキ。段階表示と分岐、発表者モード。
`music-to-video` — 音源 → ビート同期の映像。
`embedded-captions` — 既存の映像 → 字幕を載せる。映像は無加工。
`talking-head-recut` — 既存の映像 → 情報カードやローワーサードを重ねる。
`general-video` — 上記以外すべて。長尺、モンタージュ、共同編集モード。
Scene 3 (7.2–9.4s): `slideshow` の帯だけ coral のヘアラインが右端に灯り、
「これだけ出力は MP4 ではなく、操作できるデッキ」が添う（この frame 唯一の coral）。
Scene 4 (9.4–12.0s): 静止。

## Frame 10 — この動画も、その出力

- scene: 締めの一文と ✱
- duration: 8s
- transition_in: crossfade
- status: animated
- blueprint: compose
- focal: 締めの一文
- roles: 一文 = foreground subject · ✱ spike = supporting · cream + ヘアライングリッド = background
- src: compositions/frames/10-close.html

**保持フレーム。** 種明かしをして終わる。

Scene 1 (0.0–1.8s): 「この動画も、テキストを一つ渡しただけ。」が per-word reveal で入る。
Centered、横幅の ~68%。
Scene 2 (1.8–3.4s): 下に小さく mono で `faceless-explainer` と添える。
Scene 3 (3.4–4.6s): ✱ が coral で灯り、0.92→1 でスケールして止まる。
Scene 4 (4.6–8.0s): 完全静止。
