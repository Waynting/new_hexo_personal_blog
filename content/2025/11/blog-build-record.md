---
title: 部落格建置轉換心得
date: 2025-11-16T00:00:00.000Z
tags:
  - daily-notes
categories:
  - tech-notes
slug: blog-build-record
coverImage: 'https://img.waynspace.com/2025/11/blog-build-record/image.webp'
author:
  name: Wei-Ting Liu
  email: wayntingliu@gmail.com
seo:
  metaDescription: '部落格建置轉換心得，從 wix, blogger, wordpress 到現在的 Next.js 加上 Cloudflare'
  keywords:
    - 部落格建置
    - 台大資管
    - 臺大資管
    - 科學班
summary: '部落格建置轉換心得，從 wix, blogger, wordpress 到現在的 Next.js 加上 Cloudflare'
---

## Summary

Theoretically, I used to have four versions of my personal blog.

Wix -> Blogger -> Pure Wordpress -> Wordpress with Next.js(frontend)

and now I'm using Next.js 16 and Cloudflare R2 to build a modern blog.



And I think the outcome I just built two weeks ago (just the blog now you see) is not bad.

So I want to record the process of building this blog.

--- 

### Why did I choose Wordpress and why did I give up on it?

一開始用 wix 真的就是完全不會寫程式的高中時期，google 上搜尋跳出來就使用了。沒多久後就打算轉到 blogger ，一樣不用程式但簡單且直覺些。

當時使用了 blogger 一段時間，但發現功能實在過於陽春，標準化的頁面、照片上傳系統的薄弱，整體排版上也差強人意，故我選擇改到大眾的選擇。

喔對了我的 blogger 已經 shutdown，因為當時買的一個醜醜網址我不想付錢了：）

![blogger 後台](https://img.waynspace.com/2025/11/blog-build-record/%E6%88%AA%E5%9C%96-2025-11-16-%E4%B8%8A%E5%8D%8811.27.51.webp)

其實現在來看，流量還可以誒（甚至是四位數）

---
### 大一下

這個時候會寫些Ｃ＋＋了，但跟網頁一點關係都沒有，最後爬了文後選擇了 Wordpress。

剛開始使用時，豐富完整的 Plugin 系統，讓我覺得 Wordpress 是個很強大的工具，訂閱系統、GA4串接、SEO優化等等功能，讓我覺得 Wordpress 是個很強大的工具。

也在此寫了一段時間（大一下到大二上），也順利地讓幾個關鍵字能夠排到搜尋結果的上方，像是 [相機漂流計劃](https://www.google.com/search?q=%E7%9B%B8%E6%A9%9F%E6%BC%82%E6%B5%81%E8%A8%88%E5%8A%83&oq=%E7%9B%B8%E6%A9%9F%E6%BC%82%E6%B5%81%E8%A8%88%E5%8A%83&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgcIARAAGO8FMgcIAhAAGO8FMgoIAxAAGIAEGKIEMgoIBBAAGIAEGKIEMgYIBRBFGD0yBggGEEUYPTIGCAcQRRg90gEIMjk2OGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8) 、[科學班生活](https://www.google.com/search?q=%E7%A7%91%E5%AD%B8%E7%8F%AD%E7%94%9F%E6%B4%BB&sca_esv=85d6b1dba9314c34&ei=0D4ZacmFBJ_n1e8Pg9vGsQ8&ved=0ahUKEwjJrcm11_WQAxWfc_UHHYOtMfYQ4dUDCBE&uact=5&oq=%E7%A7%91%E5%AD%B8%E7%8F%AD%E7%94%9F%E6%B4%BB&gs_lp=Egxnd3Mtd2l6LXNlcnAiD-enkeWtuOePreeUn-a0uzIFEAAY7wUyBRAAGO8FMgUQABjvBTIFEAAY7wUyCBAAGIAEGKIESNsSUPMCWO0PcAF4AJABAJgBU6ABzgeqAQIxN7gBA8gBAPgBAZgCEqACiQjCAggQABiwAxjvBcICCxAAGIAEGLADGKIEwgIFEAAYgATCAgUQLhiABMICCxAuGIAEGMcBGK8BwgIUEC4YgAQYsQMYgwEYxwEYjgUYrwHCAgsQLhiABBixAxiDAcICDhAAGIAEGLEDGIMBGIoFwgILEAAYgAQYsQMYgwHCAggQABiABBixA8ICERAuGIAEGLEDGIMBGMcBGK8BwgIjEC4YgAQYsQMYgwEYxwEYjgUYrwEYlwUY3AQY3gQY4ATYAQHCAg4QLhiABBixAxiDARiKBcICERAuGIAEGLEDGMcBGI4FGK8BwgIEEAAYA8ICChAAGIAEGEMYigXCAhoQLhiABBixAxiDARiXBRjcBBjeBBjgBNgBAcICBxAAGIAEGA3CAggQABiiBBiJBZgDAIgGAZAGBLoGBggBEAEYFJIHAjE4oAeaQbIHAjE3uAeHCMIHBjEuMTMuNMgHKQ&sclient=gws-wiz-serp)等等，都是查詢相關的字就會看到我的文章。

大概是大一下的時候，開始覺得前端設計有點笨重，只能用預設的那些模塊牌來排去，有種揮之不去的生硬感。最後打聽到了 Headless CMS，也就是用文章公開的 API 端點（Wordpress 有 plugin）來存取內容，就可以自己設計其他的靜態頁面和文章卡片樣式，只要把文章讀進來就行。

並且因為 AI 變強大了，所以在操作和調整上更加的迅速，且我對 Next.js 當時完全一竅不通：）也看了不少印度人的教學影片和各種文章。

於是這個稍微漂亮點的前端陪我度過了大約半年的時間，不過最後發現兩個大問題。

1. 這根本只是把我的文章換個地方放，每個人拿到 API 都可以做一樣事情（因為完全公開）

2. 真正的 headless CMS 要有後台、草稿等等功能，我的完全沒有

⇒ 我只是寫了一個用來接文章的網站而已，但觀賞體驗至少會比較好：）

## 使用 Next.js 16 和 Cloudflare R2 圖床打造的新部落格

到十月中的時候，因為這個學期有修了電機系 ric 所開設的「網路程式服務設計」，所以對於 react, front/backend, next.js, database 等等有較多的涉獵，雖目前仍無法熟練手打，但能知道怎麼運作和架設，對於更新我的部落格而言已然充足。

加上我發現原本單純上傳照片到 wordpress 然後展示有個超級大問題：「照片載入速度過慢」，用戶體驗非常的糟糕，至少要先放個一段時間才會跑出來，點擊了其他頁面也是一樣的狀態。這時想到其實應該用雲端圖庫來處理，因為就會有 CDN 加速…

想完之後就開始動工。

### Cloudflare R2 Storage

但說實話，當時在用雲端圖庫時還是不太理解，不過 claude and cursor 的指引蠻充足的，教我怎麼設置 config 可以上傳照片，甚至轉檔（用 sharp）和上傳腳本都幫我寫好了。

最後一個晚上大約 4 個小時（抱歉有點慢），整個部落格的照片就搬完家了。

### Hexo with Next.js

照片的部分處理完了，那文章該怎麼處理呢？

原本是想說繼續在 Wordpress 的後台寫，但發現都架了網站，那為什麼不直接搬出來用 .md 寫就好呢？自由度還比較高：）

於是看上了 Hexo 文件架構，挑好後就請 AI 做完啦。雖然路徑有些變化（後來修回來了），加上一些 redirect 就可以把舊的 SEO 分數給吸回來，現在的頁面應該都能打開…，除非是我放棄的網頁頁面。

改了一下部落格的 UI 設計，讓人覺得像是在用電腦，大概就完成了。

![現在新的部落格頁面](https://img.waynspace.com/2025/11/blog-build-record/image.webp)

## 總結

說難嗎，感覺上還好，現在的 AI 工具真的太強大了，所以點子和想法變得更加重要，要想想自己到底想幹嘛跟打造出什麼東西。

最近好像都是在寫網站呀，能夠直觀快速看到的成果＋分享給他人的便利性，其實還蠻有成就感的。




