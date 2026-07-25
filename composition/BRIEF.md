---
workflow: slideshow
flow: automation
storyboard: no
message: "HTML と data-* 属性だけで、動画もスライドも書ける"
aspect: 1920x1080
language: ja
audience: これから HyperFrames を使う実装者
angle: how-to
---

## Intent

HyperFrames の使い方を、実装者が手を動かせるレベルまで踏み込んで解説する
操作可能なデッキ。読み手は自分のペースで進めたいので、MP4 ではなく
ナビゲーション付きの HTML デッキが成果物。

扱う範囲は、概要 → インストール → CLI フロー → `data-*` タイミング属性 →
トラックとクリップ → GSAP タイムライン → 決定論ルール → 書き出しと公開。
コードを実際に見せながら説明する。

## Customizations

- 段階表示（fragment）で属性やコマンドを1つずつ提示する。
- 決定論ルールの「なぜ」はホットスポットから分岐スライドに逃がし、
  本線のテンポを落とさない。
- デッキ自体が HyperFrames 製であることをクロージングで示す。

## Notes

- 成果物はデッキ。`hyperframes render` で MP4 にはしない
  （スライドショーは master-root を持たないため、render は先頭シーンだけを
  出力して無言で切り詰められる）。
- 日本語表示のため、フォントは Windows で解決できるシステムスタックを使う。
- 本文の最小サイズは 40px を守る。
