---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "一言投げれば動画が出る。しかも出せるものは動画だけじゃない"
destination: embed
aspect: 1920x1080
language: ja
audience: HyperFrames をこれから使う実装者
length: 90s
angle: how-to
---

## Intent

「HyperFrames のスキルをどう使うのか」と「結局どんな成果物が作れるのか」の2点に
答える解説動画。前回スライドで作ったときは data-* 属性や決定論ルールといった
フレームワークの内部仕様を軸にしてしまい、知りたかったことから外れた。今回は
**使う側の視点**に徹する。

2部構成:

1. **流れ** — `/hyperframes` に一言投げてから MP4 が出るまでを1本追う。
   意図の確認 → BRIEF.md → ストーリーボード → フレーム構築 → check → render。
   「何を聞かれて、何を書けば、何が返ってくるのか」が分かる状態にする。
2. **幅** — 他にどんなワークフローがあり、それぞれ何を入れると何が出るのか。
   product-launch / pr-to-video / motion-graphics / slideshow / music-to-video /
   embedded-captions / talking-head-recut。

## Customizations

- ナレーションは日本語。TTS はローカルの Kokoro（HeyGen ログイン不要）。
- この動画自体が「faceless-explainer で作れるもの」の実例になっているので、
  最後にそれを明かして閉じる。

## Notes

- 内部仕様（data-start / data-duration / 決定論ルール）には踏み込まない。
  それは既存のスライドデッキ側の担当。
- 完成後はトップページに「動画」エントリとして並べる。
