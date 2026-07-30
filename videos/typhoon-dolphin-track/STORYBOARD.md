---
format: 1920x1080
duration: 10s
message: "台風13号ドルフィンの進路予報と、将来ほど広がる予報円を伝える"
audience: 日本の一般視聴者
mode: autonomous
music: none
---

## Video direction

気象庁が2026年7月30日21時45分に発表した進路予報を固定データとして使用する。
進路線を時系列で描き、各予報点へ到達するたびに予報円を表示する。
日本への上陸や接近を断定せず、最新情報の確認を促す。

## Frame 1 — 台風13号 ドルフィン 進路予報

- scene: 実況位置から5日先までの進路線と予報円を日本周辺の地図上に表示する
- duration: 10s
- transition_in: cut
- status: animated
- focal: 進路線、予報点、予報円
- src: index.html

前半で進路を時系列に描画し、後半はすべての予報円を保持して不確実性を読ませる。
