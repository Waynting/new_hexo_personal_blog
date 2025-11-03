# Waynspace - 個人部落格

基於 Next.js 16 和 Cloudflare R2 圖床打造的現代化個人部落格系統。

🌐 **線上網站**：[waynspace.com](https://waynspace.com)

---

## 📚 目錄

- [技術棧](#技術棧)
- [專案結構](#專案結構)
- [快速開始](#快速開始)
- [撰寫文章](#撰寫文章)
- [圖片管理](#圖片管理-cloudflare-r2)
- [SEO 與效能優化](#seo-與效能優化)
- [部署指南](#部署指南)
- [功能特色](#功能特色)
- [開發指南](#開發指南)
- [故障排除](#故障排除)

---

## 技術棧

### 前端框架
- **Next.js 16** - React 全端框架（App Router）
- **React 19** - UI 函式庫
- **TypeScript** - 型別安全開發

### 樣式與 UI
- **Tailwind CSS v4** - 原子化 CSS 框架
- 自定義 UI 元件（Card、Section、Badge 等）

### 內容管理
- **MDX** - Markdown 內容格式（支援 frontmatter）
- **gray-matter** - Frontmatter 解析
- **remark/rehype** - Markdown 處理管線

### 圖片與資源
- **Cloudflare R2** - 物件儲存與 CDN
- **rclone** - R2 檔案同步工具
- **Next.js Image** - 自動圖片最佳化

### SEO 與分析
- 動態 **Sitemap.xml** 自動生成
- **Robots.txt** 支援預覽環境不索引
- **Open Graph & Twitter Cards** 社群媒體預覽
- **Google Analytics 4** 網站分析

---

## 專案結構

```
new_hexo_personal_blog/
├── content/                 # 部落格文章（YYYY/MM/slug.mdx）
│   ├── 2024/
│   │   ├── 10/
│   │   ├── 11/
│   │   └── 12/
│   └── 2025/
│       └── 01/
├── src/
│   ├── app/                 # Next.js App Router 頁面
│   │   ├── layout.tsx       # 根佈局（含 SEO、Analytics）
│   │   ├── page.tsx         # 首頁
│   │   ├── sitemap.ts       # 動態生成 sitemap.xml
│   │   ├── robots.ts        # 動態生成 robots.txt
│   │   ├── posts/           # 文章相關頁面
│   │   │   ├── page.tsx                    # 文章列表
│   │   │   ├── [...slug]/                  # 動態文章路由
│   │   │   │   ├── page.tsx                # 文章詳細頁
│   │   │   │   └── metadata.ts             # 文章 SEO metadata
│   │   │   ├── category/[category]/        # 分類頁面
│   │   │   └── [year]/                     # 年份歸檔
│   │   └── projects/        # 專案頁面
│   ├── components/          # React 元件
│   │   ├── ui/              # UI 基礎元件
│   │   ├── Header.tsx       # 導航列
│   │   ├── Footer.tsx       # 頁尾
│   │   ├── PostCard.tsx     # 文章卡片
│   │   ├── Analytics.tsx    # Google Analytics
│   │   └── ...
│   ├── lib/                 # 工具函數
│   │   ├── posts.ts         # 文章處理邏輯
│   │   └── markdown.ts      # Markdown 轉換
│   ├── types/               # TypeScript 型別定義
│   │   └── blog.ts          # Post、Category 等型別
│   └── config/              # 配置檔案
│       └── seo.ts           # SEO 配置
├── scripts/                 # 自動化腳本
│   ├── publish-images-to-r2.mjs      # 上傳圖片到 R2
│   ├── update-content-images.mjs     # 更新文章圖片路徑
│   ├── verify-r2-images.mjs          # 驗證 R2 圖片
│   ├── test-r2-config.mjs            # 測試 R2 配置
│   └── archived/                     # 已棄用的腳本
├── public/                  # 靜態資源
│   ├── CV_WeiTing Liu.pdf   # 履歷
│   ├── blog-image.jpg       # 預設 OG 圖片
│   └── ...
├── .env.example             # 環境變數範本
├── 如何撰寫文章.md           # 📖 寫作指南
└── README.md                # 本檔案
```

---

## 快速開始

### 環境需求

- **Node.js** 18 或更高版本
- **npm** 或 **pnpm**
- **rclone**（選用，用於 R2 圖片管理）

### 安裝與執行

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 瀏覽網站
open http://localhost:3000
```

### 生產環境建置

```bash
# 建置專案
npm run build

# 啟動生產伺服器
npm run start
```

---

## 撰寫文章

### 📖 完整寫作指南

請查看 **[如何撰寫文章.md](如何撰寫文章.md)** 獲取詳細教學，包括：
- 創建新文章
- 圖片上傳到 R2
- Frontmatter 配置
- 完整範例

### 快速創建文章流程

#### 1. 創建 MDX 檔案

```bash
# 格式：content/YYYY/MM/slug.mdx
# 範例：
content/2025/01/my-new-post.mdx
```

#### 2. 添加 Frontmatter

```markdown
---
title: "文章標題"
date: 2025-01-15
modifiedDate: 2025-01-20  # 選填
tags:
  - 標籤1
  - 標籤2
categories:
  - 分類名稱
slug: "my-new-post"
coverImage: "https://img.waynspace.com/2025/01/my-new-post/cover.webp"
author:
  name: "Wayne Liu"
  email: "wayntingliu@gmail.com"
seo:
  metaDescription: "這篇文章的描述（用於 SEO）"
  keywords:
    - 關鍵字1
    - 關鍵字2
---

這裡開始寫文章內容...

## 標題範例

![圖片說明](https://img.waynspace.com/2025/01/my-new-post/image.webp)
```

#### 3. 上傳圖片到 R2

```bash
# 使用 rclone 上傳圖片到對應路徑
rclone copy ~/Downloads/my-images/ \
  r2:blog-post/2025/01/my-new-post/ \
  --include "*.{jpg,jpeg,png,webp,gif}" \
  --progress
```

#### 4. 本地預覽

```bash
npm run dev
# 瀏覽 http://localhost:3000/posts/2025/01/my-new-post
```

### 圖片 URL 格式

```
https://img.waynspace.com/{year}/{month}/{slug}/{filename}

範例：
https://img.waynspace.com/2025/01/my-new-post/cover.webp
```

⚠️ **重要提醒**：URL 路徑中**不包含** `/blog-post/` 前綴（`blog-post` 是 R2 bucket 名稱，不是 URL 路徑的一部分）

---

## 圖片管理 (Cloudflare R2)

### 配置 R2 環境

#### 1. 安裝 rclone

```bash
# macOS
brew install rclone

# 其他系統請參考官網
# https://rclone.org/install/
```

#### 2. 配置 rclone

```bash
rclone config
```

**配置資訊：**
- **Name**: `r2`
- **Storage**: `s3` (Amazon S3 Compliant)
- **Provider**: `Cloudflare`
- **Access Key & Secret**: 從 Cloudflare R2 API Token 獲取
- **Endpoint**: `https://{AccountID}.r2.cloudflarestorage.com`
- **Region**: `auto`

#### 3. 設定環境變數

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# Cloudflare R2 配置
CF_ACCOUNT_ID=你的帳號ID
R2_BUCKET=blog-post
R2_BASE_URL=https://img.waynspace.com
R2_PREFIX=blog-post
RCLONE_REMOTE=r2

# Google Analytics 4（選填）
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 可用腳本

```bash
# 上傳圖片到 R2
npm run images:publish

# 更新文章中的圖片路徑
npm run images:update

# 驗證 R2 上的圖片
npm run images:verify

# 測試 R2 配置
npm run test:r2
```

### R2 目錄結構

```
blog-post/                    ← R2 Bucket 名稱
├── 2024/
│   └── 12/
│       └── article-slug/
│           ├── image1.webp
│           └── image2.jpg
└── 2025/
    └── 01/
        └── my-new-post/
            ├── cover.webp
            └── photo.png
```

---

## SEO 與效能優化

### SEO 配置

本專案已完整配置 SEO 最佳化：

- ✅ **動態 Metadata** - 每篇文章自動生成 SEO metadata
- ✅ **Open Graph** - 社群媒體分享預覽（Facebook、LinkedIn）
- ✅ **Twitter Cards** - Twitter/X 分享卡片
- ✅ **Sitemap.xml** - 自動生成網站地圖
- ✅ **Robots.txt** - 搜尋引擎爬蟲規則（支援預覽環境不索引）
- ✅ **Canonical URL** - 避免重複內容問題

### 效能最佳化

- ✅ **Preconnect** - 預先連接外部資源（R2、Google Fonts、Analytics）
- ✅ **DNS Prefetch** - DNS 預先解析
- ✅ **Next.js Image** - 自動圖片最佳化與延遲載入
- ✅ **Static Site Generation (SSG)** - 靜態頁面生成
- ✅ **Code Splitting** - 程式碼自動分割

### Google Analytics 設定

在 `.env` 中設定 GA4 追蹤 ID：

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 部署指南

### Vercel 部署（推薦）

1. 將專案推送到 GitHub
2. 前往 [Vercel](https://vercel.com) 並導入專案
3. 配置環境變數（選填）：
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. 部署完成！

**注意事項：**
- R2 圖片已經是公開 URL，不需要額外配置環境變數
- Vercel 會自動偵測 Next.js 並使用正確的建置指令

### Zeabur 部署

1. 將專案推送到 GitHub
2. 前往 [Zeabur](https://zeabur.com) 並導入專案
3. 設定環境變數（選填）
4. 部署完成！

### 自行部署

```bash
# 1. 建置專案
npm run build

# 2. 啟動 Node.js 伺服器
npm run start

# 3. 使用 PM2（建議用於生產環境）
pm2 start npm --name "waynspace" -- start
```

---

## 功能特色

### ✨ 自動化功能

- **自動提取封面圖** - 如果文章沒有設定 `coverImage`，系統會自動提取內容中的第一張圖片作為封面
- **URL 解碼支援** - 完整支援中文、特殊字元的文章路徑（例如：`國際科展之旅-202301280202`）
- **圖片語法處理** - 自動轉換複雜的 Markdown 圖片語法為正確的 HTML `<img>` 標籤
- **響應式設計** - 完整的行動裝置與平板適配
- **多重路由** - 支援年份、分類、標籤等多種文章篩選與瀏覽方式

### 📁 文章分類系統

系統預設分類與對應顏色：

| 分類 | 顏色 | 說明 |
|------|------|------|
| 台大資管生活 | 藍色 | 大學生活記錄 |
| 科學班生活 | 紫色 | 高中科學班經歷 |
| 攝影筆記 | 綠色 | 攝影作品與心得 |
| 城市漫步 | 黃色 | 城市探索與旅行 |
| 生活日誌 | 粉紅色 | 日常生活記錄 |
| 讀書筆記與心得 | 靛藍色 | 閱讀筆記與書評 |
| 技術筆記 | 紅色 | 技術文章與教學 |

### 🎨 UI 元件

- **Card 系統** - CardHeader、CardContent、CardFooter
- **Section 佈局** - 響應式 Section 與 SectionContent
- **Badge 標籤** - 分類與標籤視覺化顯示
- **返回頂部按鈕** - 平滑滾動體驗

---

## 開發指南

### 核心函數

```typescript
// src/lib/posts.ts - 文章處理核心
getAllPosts()         // 獲取所有文章
getPostBySlug()       // 根據 slug 獲取單篇文章
getAllCategories()    // 獲取所有分類
getAllYears()         // 獲取所有年份

// src/lib/markdown.ts - Markdown 處理
markdownToHtml()      // 轉換 Markdown 為 HTML
formatDate()          // 格式化日期
extractExcerpt()      // 提取文章摘要
calculateReadTime()   // 計算閱讀時間
```

### 新增頁面

```typescript
// src/app/new-page/page.tsx
import { Section, SectionContent } from '@/components/ui/section'

export default function NewPage() {
  return (
    <Section>
      <SectionContent>
        <h1 className="text-4xl font-bold mb-4">新頁面</h1>
        <p>頁面內容...</p>
      </SectionContent>
    </Section>
  )
}
```

### 自訂樣式

使用 Tailwind CSS v4：

```typescript
<div className="bg-primary text-foreground p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  內容區塊
</div>
```

---

## 故障排除

### 圖片無法顯示

#### ✅ 檢查 R2 圖片是否存在

```bash
rclone ls r2:blog-post/2025/01/my-post/
```

#### ✅ 確認 URL 格式正確

```
✅ 正確格式: https://img.waynspace.com/2025/01/my-post/image.webp
❌ 錯誤格式: https://img.waynspace.com/blog-post/2025/01/my-post/image.webp
```

#### ✅ 設定 Cloudflare R2 Custom Domain

1. 前往 Cloudflare Dashboard > R2 > 你的 bucket
2. 進入 **Settings** > **Custom Domains**
3. 新增自訂網域：`img.waynspace.com`
4. Cloudflare 會自動建立 DNS 紀錄

#### ✅ 測試圖片 URL

```bash
curl -I "https://img.waynspace.com/2025/01/my-post/image.webp"
# 應該回傳 HTTP/2 200
```

### 建置失敗

#### ✅ 檢查 frontmatter 格式

確認所有 `.mdx` 檔案的 frontmatter 格式正確（YAML 格式）

#### ✅ 確認依賴已安裝

```bash
rm -rf node_modules package-lock.json
npm install
```

#### ✅ 檢查 Node.js 版本

```bash
node -v
# 需要 v18 或更高版本
```

### 文章路徑顯示 404

#### ✅ 確認檔案路徑格式

```
正確格式: content/YYYY/MM/slug.mdx
範例: content/2025/01/my-new-post.mdx
```

#### ✅ 確認 slug 與檔名一致

Frontmatter 中的 `slug` 欄位應與檔案名稱相同（不含 `.mdx` 副檔名）

#### ✅ 重新啟動開發伺服器

```bash
# 清除快取並重啟
rm -rf .next
npm run dev
```

### 中文 URL 顯示 404

中文 URL 會被瀏覽器自動編碼，這是正常的行為。Next.js 會自動解碼處理。

**範例：**
```
使用者看到: http://localhost:3000/posts/2024/02/國際科展之旅-202301280202
實際 URL:  http://localhost:3000/posts/2024/02/%E5%9C%8B%E9%9A%9B%E7%A7%91%E5%B1%95%E4%B9%8B%E6%97%85-202301280202
```

---

## 待辦事項

- [ ] 深色模式切換功能
- [ ] 文章全文搜尋
- [ ] RSS Feed 訂閱
- [ ] 文章評論系統（Giscus）
- [ ] 閱讀進度條
- [ ] 相關文章推薦演算法
- [ ] 文章目錄導航（TOC）
- [ ] 增量靜態再生（ISR）

---

## 貢獻

這是個人部落格專案，歡迎 fork 並根據自己的需求修改！

如有問題或建議，歡迎開 [Issue](https://github.com/Waynting/new_hexo_personal_blog/issues)。

---

## 授權

MIT License

---

## 作者

**Wayne Liu（劉維廷）**

- 🌐 網站：[waynspace.com](https://waynspace.com)
- 📧 Email：wayntingliu@gmail.com
- 💼 LinkedIn：[Wei-Ting Liu](https://www.linkedin.com/in/waiting5928/)
- 📷 Instagram：[@waiting_941208](https://www.instagram.com/waiting_941208/)
- 💻 GitHub：[@Waynting](https://github.com/Waynting)

---

## 致謝

感謝以下開源專案：

- [Next.js](https://nextjs.org/) - React 全端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 工具框架
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - 物件儲存服務
- [remark](https://github.com/remarkjs/remark) - Markdown 處理器
- [rclone](https://rclone.org/) - 雲端檔案同步工具
- [Vercel](https://vercel.com/) - 網站部署平台

---

**最後更新日期**：2025-01-15
