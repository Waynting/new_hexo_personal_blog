---
title: "網頁端照片整理工具"
date: Thu Jul 03 2025 08:00:00 GMT+0800 (Taiwan Standard Time)
tags:
  - "tech-memo"
categories:
  - "tech-notes"
coverImage: "https://img.waynspace.com/2025/07/photo-select-tool-note/螢幕擷取畫面-2025-07-03-225732.webp"
slug: "photo-select-tool-note"
---


20250703（四）

Github Repo：[https://github.com/Waynting/photo-select-tool](https://github.com/Waynting/photo-select-tool)  
小工具連結：[https://waynspace.com/flow-code/](https://waynspace.com/flow-code/)

這是我用 Vibe Coding做出來的，原先對於 Html、CSS 和 JS 只知道是最基本的網頁相關語言。  
但我沒想過真的有辦法以此做出這個，AI讓我能把腦海中的想法一步步實踐出來。

寫筆記除了能記錄自己學習到的內容，也是順便讓自己去讀原始碼（不然不知道怎麼維護）。  
是個不錯的開始，之後看看會繼續用 AI 生成出什麼東西。

<figure>

![](https://img.waynspace.com/2025/07/photo-select-tool-note/螢幕擷取畫面-2025-07-03-225732-1024x598.webp)

<figcaption>

實際使用介面（很不美觀抱歉）

</figcaption>

</figure>

* * *

## 筆記內容

```
photo-tool/
├── index.html      # 主頁面結構
├── style.css       # 樣式定義
└── main.js         # 互動邏輯
```

## 1\. `index.html`

> **功能**：定義整體頁面結構，載入樣式表與腳本，並提供上傳及顯示介面。

HTML

```
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>照片比較小工具</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="photo-tool">
    <h2>選擇要比較的照片（最多 30 張）</h2>
    <input type="file" id="fileInput" multiple accept="image/*">
    <div id="gallery" class="grid"></div>
<div></div>
    <div id="resultSection" class="hidden">
      <h3>比較結果</h3>
      <div class="result-container">
        <div class="result-column">
          <h4>保留</h4>
          <ul id="keptList" class="result-list"></ul>
        </div>
        <div class="result-column">
          <h4>刪除 (點擊檔名可還原)</h4>
          <ul id="deletedList" class="result-list"></ul>
        </div>
      </div>
      <div class="result-actions">
        <button id="zipBtn">下載保留照片 (.zip)</button>
      </div>
    </div>
  </div>
<div></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

```
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>照片比較小工具</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="photo-tool">
    <h2>選擇要比較的照片（最多 30 張）</h2>
    <input type="file" id="fileInput" multiple accept="image/*">
    <div id="gallery" class="grid"></div>

    <div id="resultSection" class="hidden">
      <h3>比較結果</h3>
      <div class="result-container">
        <div class="result-column">
          <h4>保留</h4>
          <ul id="keptList" class="result-list"></ul>
        </div>
        <div class="result-column">
          <h4>刪除 (點擊檔名可還原)</h4>
          <ul id="deletedList" class="result-list"></ul>
        </div>
      </div>
      <div class="result-actions">
        <button id="zipBtn">下載保留照片 (.zip)</button>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

HTML

### 1.1 `<head>` 區

- `<meta charset="UTF-8">`：確保使用 UTF‑8 編碼，支援中文。

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`：響應式設計，確保在行動裝置上適當縮放。

- `<title>`：設定瀏覽器分頁標題。

- `<link rel="stylesheet" href="style.css">`：引入同目錄下的樣式檔。

### 1.2 `<body>` 結構

1. **外層容器** `<div id="photo-tool">`：劃分此工具的專屬區域，方便後續樣式或 JS 定位。

3. **標題** `<h2>`：顯示說明文字「選擇要比較的照片」。

5. **檔案上傳** `<input type="file" id="fileInput" multiple accept="image/*">`：支援同時選擇多張圖片，並僅接受 `image/*`。

7. **縮圖展示區** `<div id="gallery" class="grid"></div>`：動態注入使用者上傳的縮圖。

9. **結果區**`<div id="resultSection" class="hidden">`：
    - 初始隱藏 (`.hidden`)，在使用者操作後才顯示。
    
    - **保留清單**：`<ul id="keptList">`
    
    - **刪除清單**：`<ul id="deletedList">`，列表項具有還原功能。
    
    - **下載按鈕**：`<button id="zipBtn">`，觸發 JSZip 打包下載。

11. **外部腳本**：
     - JSZip：`<script src="https://...jszip.min.js"></script>`
     
     - 主程式：`<script src="main.js"></script>`，處理狀態更新與事件綁定。

* * *

## 2\. `style.css`

> **功能**：定義整體樣式，包含響應式布局、淺色模式強制覆蓋及各元素樣式。

### 2.1 通用樣式與強制淺色

CSS

```
/* 強制淺色背景與文字，不受外部主題覆蓋 */
body {
  background: #ffffff !important;
  color: #333333 !important;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}
#photo-tool,
#photo-tool * {
  background: #ffffff !important;
  color: #333333 !important;
}
```

```
/* 強制淺色背景與文字，不受外部主題覆蓋 */
body {
  background: #ffffff !important;
  color: #333333 !important;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}
#photo-tool,
#photo-tool * {
  background: #ffffff !important;
  color: #333333 !important;
}
```

CSS

**目的**：隔離外部 WordPress 主題的深色／自訂樣式，確保工具始終以白底、深色文字呈現。  
`!important`：最高優先級，避免被覆蓋。  
`box-sizing: border-box`：所有元素計算含內邊距與邊框，方便控制寬高。

### 2.2 標題與檔案上傳按鈕

CSS

```
#photo-tool h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1rem;
}
#photo-tool #fileInput {
  display: inline-block;
  margin: 1rem 0 2rem;
}
```

```
#photo-tool h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1rem;
}
#photo-tool #fileInput {
  display: inline-block;
  margin: 1rem 0 2rem;
}
```

CSS

- **`clamp()`**：標題字體在小螢幕時最小 `1.5rem`，大螢幕時最大 `2rem`，中間依視窗寬度動態調整。

- 調整 `#fileInput` 的上下外距，使其在標題下方與縮圖區之間保持適當間隔。

### 2.3 縮圖區 (Gallery)

CSS

```
#photo-tool .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}
```

```
#photo-tool .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}
```

CSS

- **CSS Grid**：自動填滿列數 (`auto-fit`)，每格最小 `120px`、最大撐滿剩餘空間。

- **`gap: 1rem`**：格子間距統一為 `1rem`，可改為百分比或 `clamp()` 實現更靈活間距。

### 2.4 縮圖容器與圖片

CSS

```
#photo-tool .thumb {
  position: relative;
}
#photo-tool .thumb img {
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
#photo-tool .thumb img:hover,
#photo-tool .thumb img.selected {
  border-color: #007bff;
}
```

```
#photo-tool .thumb {
  position: relative;
}
#photo-tool .thumb img {
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
#photo-tool .thumb img:hover,
#photo-tool .thumb img.selected {
  border-color: #007bff;
}
```

CSS

- `.thumb`：相對定位，方便放置刪除按鈕。

- 圖片使用 **`aspect-ratio`** 保持 4:3 顯示比例，自動縮放，不失真。

- `border` + `transition`：滑鼠懸停或選中時淡入藍色邊框。

### 2.5 刪除浮層按鈕

CSS

```
#photo-tool .delete-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  display: none;
  cursor: pointer;
  z-index: 10;
}
#photo-tool .thumb:hover .delete-overlay {
  display: block;
}
```

```
#photo-tool .delete-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  display: none;
  cursor: pointer;
  z-index: 10;
}
#photo-tool .thumb:hover .delete-overlay {
  display: block;
}
```

CSS

- **絕對定位**：固定在縮圖右上角。

- 初始 `display: none`，僅在 `.thumb:hover` 時顯示，避免畫面雜亂。

### 2.6 縮圖檔名

CSS

```
#photo-tool .filename {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  word-break: break-all;
  text-align: center;
  max-width: 150px;
}
```

```
#photo-tool .filename {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  word-break: break-all;
  text-align: center;
  max-width: 150px;
}
```

CSS

- 使用 **`clamp()`** 動態文字大小，防止過大或過小。

- `word-break: break-all`：長檔名自動斷行，避免溢出。

### 2.7 結果區容器

CSS

```
#photo-tool #resultSection {
  display: none; /* 初始隱藏，無結果時不佔空間 */
  max-width: 90%;
  margin: 2rem auto;
  background: #f9f9f9;
  border: 1px dashed #cccccc;
  padding: 1rem;
}
#photo-tool #resultSection h3 {
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  margin-bottom: 1rem;
}
```

```
#photo-tool #resultSection {
  display: none; /* 初始隱藏，無結果時不佔空間 */
  max-width: 90%;
  margin: 2rem auto;
  background: #f9f9f9;
  border: 1px dashed #cccccc;
  padding: 1rem;
}
#photo-tool #resultSection h3 {
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  margin-bottom: 1rem;
}
```

CSS

- 初始 `display: none`，待 `renderResults()` 觸發時顯示。

- 邊框與背景顏色用淺灰系配色，與主畫面區分。

### .8 保留／刪除欄 & 列表

CSS```
#photo-tool .result-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
#photo-tool .result-column {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
}
#photo-tool .result-column h4 {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  margin-bottom: 0.8rem;
  text-align: center;
}
#photo-tool .result-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
#photo-tool .result-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
  word-break: break-all;
}
#photo-tool .result-list li:last-child {
  border-bottom: none;
}
#photo-tool .result-list li.restoreable {
  cursor: pointer;
  color: #007bff;
}
#photo-tool .result-list li.restoreable:hover {
  text-decoration: underline;
}

```

```
#photo-tool .result-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
#photo-tool .result-column {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
}
#photo-tool .result-column h4 {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  margin-bottom: 0.8rem;
  text-align: center;
}
#photo-tool .result-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
#photo-tool .result-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
  word-break: break-all;
}
#photo-tool .result-list li:last-child {
  border-bottom: none;
}
#photo-tool .result-list li.restoreable {
  cursor: pointer;
  color: #007bff;
}
#photo-tool .result-list li.restoreable:hover {
  text-decoration: underline;
}
```

CSS

- **Grid 佈局**：兩欄自動調整至單欄。

- `.result-column` 加 padding 與淺灰背景。

- 列表項目 `li` 有底線區隔，最後一項去除。

### 2.9 按鈕區

CSS

```
#photo-tool .result-actions {
  text-align: center;
  margin-top: 1rem;
}
#photo-tool #zipBtn {
  background: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 0.3rem;
  padding: 0.75rem 1rem;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  cursor: pointer;
}
```

```
#photo-tool .result-actions {
  text-align: center;
  margin-top: 1rem;
}
#photo-tool #zipBtn {
  background: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 0.3rem;
  padding: 0.75rem 1rem;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  cursor: pointer;
}
```

CSS

- 按鈕使用 **`clamp()`** 動態字體大小。

- 綠色背景白字，與其他動作區分。

### 2.10 響應式切換

CSS

```
@media (max-width: 600px) {
  #photo-tool {
    padding: 1rem;
  }
  #photo-tool .grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  #photo-tool .filename {
    font-size: 0.8rem;
  }
  #photo-tool .result-container {
    display: block; /* 直列呈現 */
  }
  #photo-tool #zipBtn {
    width: 100%;
    box-sizing: border-box;
  }
}
```

```
@media (max-width: 600px) {
  #photo-tool {
    padding: 1rem;
  }
  #photo-tool .grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  #photo-tool .filename {
    font-size: 0.8rem;
  }
  #photo-tool .result-container {
    display: block; /* 直列呈現 */
  }
  #photo-tool #zipBtn {
    width: 100%;
    box-sizing: border-box;
  }
}
```

CSS

- **600px 以下**：
    - 縮圖改為最少 `100px` 一格。
    
    - 結果欄改為直列呈現。
    
    - 按鈕滿寬，方便手機點擊。

* * *

### 2.11 完整 `style.css`

CSS

```
/* 1. 強制淺色模式 */
body {
  background: #ffffff;
  color: #333333;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
#photo-tool {
  background: #ffffff;
  color: #333333;
  padding: 2rem;
  text-align: center;
}
<div></div>
/* 2. 檔案上傳按鈕與標題 */
#photo-tool h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1rem;
}
#photo-tool #fileInput {
  margin: 1rem 0 2rem;
}
<div></div>
/* 3. 縮圖區：CSS Grid 自適應欄數 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.thumb {
  position: relative;
}
.thumb img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.thumb:hover img,
.thumb img.selected {
  border-color: #007bff;
}
.delete-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  display: none;
}
.thumb:hover .delete-overlay {
  display: block;
}
.filename {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  word-break: break-all;
  text-align: center;
}
<div></div>
/* 4. 結果區：自適應兩欄／單欄 */
#resultSection {
  display: none;
  max-width: 90%;
  margin: 2rem auto;
  background: #f9f9f9;
  border: 1px dashed #ccc;
  padding: 1rem;
}
.result-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.result-column {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
}
.result-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}
.result-list li.restoreable:hover {
  text-decoration: underline;
}
<div></div>
/* 5. 下載按鈕 */
#zipBtn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  padding: 0.75rem 1rem;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
}
<div></div>
/* 6. 手機優化 */
@media (max-width: 600px) {
  #photo-tool { padding: 1rem; }
  .grid { gap: 0.5rem; }
  .filename { font-size: 0.8rem; }
  #zipBtn { width: 100%; }
}
```

```
/* 1. 強制淺色模式 */
body {
  background: #ffffff;
  color: #333333;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
#photo-tool {
  background: #ffffff;
  color: #333333;
  padding: 2rem;
  text-align: center;
}

/* 2. 檔案上傳按鈕與標題 */
#photo-tool h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1rem;
}
#photo-tool #fileInput {
  margin: 1rem 0 2rem;
}

/* 3. 縮圖區：CSS Grid 自適應欄數 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.thumb {
  position: relative;
}
.thumb img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.thumb:hover img,
.thumb img.selected {
  border-color: #007bff;
}
.delete-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  display: none;
}
.thumb:hover .delete-overlay {
  display: block;
}
.filename {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  word-break: break-all;
  text-align: center;
}

/* 4. 結果區：自適應兩欄／單欄 */
#resultSection {
  display: none;
  max-width: 90%;
  margin: 2rem auto;
  background: #f9f9f9;
  border: 1px dashed #ccc;
  padding: 1rem;
}
.result-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.result-column {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
}
.result-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}
.result-list li.restoreable:hover {
  text-decoration: underline;
}

/* 5. 下載按鈕 */
#zipBtn {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  padding: 0.75rem 1rem;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
}

/* 6. 手機優化 */
@media (max-width: 600px) {
  #photo-tool { padding: 1rem; }
  .grid { gap: 0.5rem; }
  .filename { font-size: 0.8rem; }
  #zipBtn { width: 100%; }
}
```

CSS

## 3\. `main.js`

> 功**能**：管理應用狀態、渲染介面、綁定事件，實現上傳、刪除、還原及 ZIP 下載。

### 3.1 檔案選取與初始設定

JavaScript

```
// 取得 DOM 元素
const fileInput    = document.getElementById('fileInput');
const gallery      = document.getElementById('gallery');
const resultSection= document.getElementById('resultSection');
const zipBtn       = document.getElementById('zipBtn');
<div></div>
// 狀態陣列
let images      = [];   // 保留的 File 物件
let deletedList = [];   // 已刪除但可還原的 File 物件
<div></div>
// 綁定事件
fileInput.addEventListener('change', onFilesSelected);
zipBtn.addEventListener('click', onDownloadZip);
```

```
// 取得 DOM 元素
const fileInput    = document.getElementById('fileInput');
const gallery      = document.getElementById('gallery');
const resultSection= document.getElementById('resultSection');
const zipBtn       = document.getElementById('zipBtn');

// 狀態陣列
let images      = [];   // 保留的 File 物件
let deletedList = [];   // 已刪除但可還原的 File 物件

// 綁定事件
fileInput.addEventListener('change', onFilesSelected);
zipBtn.addEventListener('click', onDownloadZip);
```

JavaScript

**`images`**：存放使用者目前「保留」的照片檔。  
**`deletedList`**：存放使用者點掉「✕」標記為刪除、且可還原的照片檔。  
**`change` 事件**：使用者每次重新選檔都會觸發 `onFilesSelected()`，檢查檔案數量、清空舊畫面、載入新檔案。  
**`click` 事件**：點擊「下載 ZIP」後執行 `onDownloadZip()`。

### 3.2 檔案選取處理：`onFilesSelected()`

JavaScript

```
function onFilesSelected() {
  const selected = Array.from(fileInput.files);
<div></div>
  // 限制上限 30 張
  if (selected.length > 30) {
    alert('照片數量過多，請重新選擇上傳');
    fileInput.value = '';  
    return;
  }
<div></div>
  // 重置狀態
  images = selected;
  deletedList = [];
  renderGallery();
  renderResults();
}
```

```
function onFilesSelected() {
  const selected = Array.from(fileInput.files);

  // 限制上限 30 張
  if (selected.length > 30) {
    alert('照片數量過多，請重新選擇上傳');
    fileInput.value = '';  
    return;
  }

  // 重置狀態
  images = selected;
  deletedList = [];
  renderGallery();
  renderResults();
}
```

JavaScript

1. **轉陣列**：`Array.from()` 方便使用陣列方法。

3. **數量檢查**：若超過 30 張，跳出提醒並重置檔案選取欄位，**不再往下執行**。

5. **狀態重置**：把 `images` 設為新檔案、清空 `deletedList`。

7. **重畫**：呼叫 `renderGallery()` 和 `renderResults()`，同步更新 UI。

### 3.3 縮圖畫面：`renderGallery()`

JavaScript

```
function renderGallery() {
  gallery.innerHTML = '';
  images.forEach((file, idx) => {
    // 外層容器
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
<div></div>
    // 圖片
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.dataset.idx = idx;
    img.addEventListener('click', () => img.classList.toggle('selected'));
<div></div>
    // 刪除按鈕
    const del = document.createElement('div');
    del.className = 'delete-overlay';
    del.textContent = '✕';
    del.addEventListener('click', () => deleteImage(idx));
<div></div>
    // 檔名
    const name = document.createElement('div');
    name.className = 'filename';
    name.textContent = file.name;
<div></div>
    // 組合
    thumb.append(img, del, name);
    gallery.appendChild(thumb);
  });
}
```

```
function renderGallery() {
  gallery.innerHTML = '';
  images.forEach((file, idx) => {
    // 外層容器
    const thumb = document.createElement('div');
    thumb.className = 'thumb';

    // 圖片
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.dataset.idx = idx;
    img.addEventListener('click', () => img.classList.toggle('selected'));

    // 刪除按鈕
    const del = document.createElement('div');
    del.className = 'delete-overlay';
    del.textContent = '✕';
    del.addEventListener('click', () => deleteImage(idx));

    // 檔名
    const name = document.createElement('div');
    name.className = 'filename';
    name.textContent = file.name;

    // 組合
    thumb.append(img, del, name);
    gallery.appendChild(thumb);
  });
}
```

JavaScript

- 清空舊的 `<div id="gallery">`。

- **`<div.thumb>`** 作為每張縮圖的定位容器：
    - `<img>`：用 `URL.createObjectURL` 建立快取 URL，並綁定點選效果（添加 `.selected`）。
    
    - `<div.delete-overlay>`：浮在右上，點擊時呼 `deleteImage(idx)`。
    
    - `<div.filename>`：顯示檔名。

- 最後一併 append 至畫面。

### 3.4 刪除並可還原：`deleteImage(idx)`

JavaScript

```
function deleteImage(idx) {
  // 從 images 中移除並推入 deletedList
  const [removed] = images.splice(idx, 1);
  deletedList.push(removed);
<div></div>
  // 重畫縮圖與結果
  renderGallery();
  renderResults();
}
```

```
function deleteImage(idx) {
  // 從 images 中移除並推入 deletedList
  const [removed] = images.splice(idx, 1);
  deletedList.push(removed);

  // 重畫縮圖與結果
  renderGallery();
  renderResults();
}
```

JavaScript

- `Array.splice(idx, 1)` 回傳被移除元素陣列，用解構直接取出。

- 同步更新 `images` & `deletedList`，再呼兩次 render。

### 3.5 結果清單渲染：`renderResults()`

JavaScript```
function renderResults() {
  resultSection.innerHTML = '';  // 清空舊結果
  if (images.length === 0 && deletedList.length === 0) {
    resultSection.style.display = 'none';
    return;
  }
  resultSection.style.display = 'block';
<div></div>
  // 建立標題
  const title = document.createElement('h3');
  title.textContent = '比較結果';
  resultSection.appendChild(title);
<div></div>
  // 建立兩欄容器
  const container = document.createElement('div');
  container.className = 'result-container';
<div></div>
  // 保留欄
  const keepCol = document.createElement('div');
  keepCol.className = 'result-column';
  keepCol.innerHTML = '<h4>保留</h4>';
  const keepList = document.createElement('ul');
  images.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.name;
    keepList.appendChild(li);
  });
  keepCol.appendChild(keepList);
<div></div>
  // 刪除欄（可還原）
  const delCol = document.createElement('div');
  delCol.className = 'result-column';
  delCol.innerHTML = '<h4>刪除</h4>';
  const delListEl = document.createElement('ul');
  deletedList.forEach((f, i) => {
    const li = document.createElement('li');
    li.textContent = f.name;
    li.className = 'restoreable';
    li.addEventListener('click', () => restoreImage(i));
    delListEl.appendChild(li);
  });
  delCol.appendChild(delListEl);
<div></div>
  container.append(keepCol, delCol);
  resultSection.appendChild(container);
<div></div>
  // 下載按鈕
  const actions = document.createElement('div');
  actions.className = 'result-actions';
  actions.appendChild(zipBtn);
  resultSection.appendChild(actions);
}

```

```
function renderResults() {
  resultSection.innerHTML = '';  // 清空舊結果
  if (images.length === 0 && deletedList.length === 0) {
    resultSection.style.display = 'none';
    return;
  }
  resultSection.style.display = 'block';

  // 建立標題
  const title = document.createElement('h3');
  title.textContent = '比較結果';
  resultSection.appendChild(title);

  // 建立兩欄容器
  const container = document.createElement('div');
  container.className = 'result-container';

  // 保留欄
  const keepCol = document.createElement('div');
  keepCol.className = 'result-column';
  keepCol.innerHTML = '<h4>保留</h4>';
  const keepList = document.createElement('ul');
  images.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.name;
    keepList.appendChild(li);
  });
  keepCol.appendChild(keepList);

  // 刪除欄（可還原）
  const delCol = document.createElement('div');
  delCol.className = 'result-column';
  delCol.innerHTML = '<h4>刪除</h4>';
  const delListEl = document.createElement('ul');
  deletedList.forEach((f, i) => {
    const li = document.createElement('li');
    li.textContent = f.name;
    li.className = 'restoreable';
    li.addEventListener('click', () => restoreImage(i));
    delListEl.appendChild(li);
  });
  delCol.appendChild(delListEl);

  container.append(keepCol, delCol);
  resultSection.appendChild(container);

  // 下載按鈕
  const actions = document.createElement('div');
  actions.className = 'result-actions';
  actions.appendChild(zipBtn);
  resultSection.appendChild(actions);
}
```

JavaScript

- 若沒有任何檔案，隱藏結果區。

- 用動態建立的 `<ul>` 來呈現保留與刪除清單。

- 刪除清單每項加上 `.restoreable`，點擊呼 `restoreImage(i)`。

### 3.6 還原功能：`restoreImage(idx)`

JavaScript

```
function restoreImage(idx) {
  const [restored] = deletedList.splice(idx, 1);
  images.push(restored);
  renderGallery();
  renderResults();
}
```

```
function restoreImage(idx) {
  const [restored] = deletedList.splice(idx, 1);
  images.push(restored);
  renderGallery();
  renderResults();
}
```

JavaScript

- 與 `deleteImage` 方向相反：從 `deletedList` 拿回 `images`，再渲染。

### 3.7 ZIP 下載：`onDownloadZip()`

JavaScript

```
async function onDownloadZip() {
  const zip = new JSZip();
  for (const file of images) {
    const buffer = await file.arrayBuffer();
    zip.file(file.name, buffer);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'kept_photos.zip';
  a.click();
}
```

```
async function onDownloadZip() {
  const zip = new JSZip();
  for (const file of images) {
    const buffer = await file.arrayBuffer();
    zip.file(file.name, buffer);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'kept_photos.zip';
  a.click();
}
```

JavaScript

1. **讀取** 每個 `File` 的 `arrayBuffer()`。

3. **加入** 到 `JSZip` 實例：`zip.file(name, buffer)`。

5. **生成** Blob → 用隱藏 `<a>` 觸發下載。

### 3.8 完整 `main.js`

JavaScript

```
// 1. 參考元素與初始化狀態
const fileInput     = document.getElementById('fileInput');
const gallery       = document.getElementById('gallery');
const resultSection = document.getElementById('resultSection');
const keptListEl    = document.getElementById('keptList');
const deletedListEl = document.getElementById('deletedList');
const zipBtn        = document.getElementById('zipBtn');
<div></div>
let images = [];      // 保留照片陣列
let deletedList = []; // 已刪除(可還原)陣列
<div></div>
// 2. 上傳事件：驗證、初始化、渲染
fileInput.addEventListener('change', () => {
  const selected = Array.from(fileInput.files);
  if (selected.length > 30) {
    alert('照片數量過多，請重新選擇上傳');
    fileInput.value = '';
    gallery.innerHTML = '';
    resultSection.classList.add('hidden');
    return;
  }
  images = selected;
  deletedList = [];
  renderGallery();
  renderResults();
});
<div></div>
// 3. 渲染縮圖區
function renderGallery() {
  gallery.innerHTML = '';
  images.forEach((file, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
<div></div>
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    thumb.appendChild(img);
<div></div>
    const overlay = document.createElement('div');
    overlay.className = 'delete-overlay';
    overlay.textContent = '✕';
    overlay.addEventListener('click', e => {
      e.stopPropagation();
      deleteImage(idx);
    });
    thumb.appendChild(overlay);
<div></div>
    const label = document.createElement('div');
    label.className = 'filename';
    label.textContent = file.name;
    thumb.appendChild(label);
<div></div>
    gallery.appendChild(thumb);
  });
}
<div></div>
// 4. 刪除並更新畫面
function deleteImage(idx) {
  deletedList.push(images[idx]);
  images.splice(idx, 1);
  renderGallery();
  renderResults();
}
<div></div>
// 5. 渲染結果清單 (保留 & 已刪除)
function renderResults() {
  keptListEl.innerHTML = '';
  deletedListEl.innerHTML = '';
  images.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file.name;
    keptListEl.appendChild(li);
  });
  deletedList.forEach((file, idx) => {
    const li = document.createElement('li');
    li.textContent = file.name;
    li.className = 'restoreable';
    li.addEventListener('click', () => {
      const restored = deletedList.splice(idx, 1)[0];
      images.push(restored);
      renderGallery();
      renderResults();
    });
    deletedListEl.appendChild(li);
  });
  resultSection.classList.remove('hidden');
}
<div></div>
// 6. 打包 ZIP 並下載
zipBtn.addEventListener('click', async () => {
  const zip = new JSZip();
  for (const file of images) {
    const buffer = await file.arrayBuffer();
    zip.file(file.name, buffer);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = 'kept_photos.zip';
  a.click();
});
```

```
// 1. 參考元素與初始化狀態
const fileInput     = document.getElementById('fileInput');
const gallery       = document.getElementById('gallery');
const resultSection = document.getElementById('resultSection');
const keptListEl    = document.getElementById('keptList');
const deletedListEl = document.getElementById('deletedList');
const zipBtn        = document.getElementById('zipBtn');

let images = [];      // 保留照片陣列
let deletedList = []; // 已刪除(可還原)陣列

// 2. 上傳事件：驗證、初始化、渲染
fileInput.addEventListener('change', () => {
  const selected = Array.from(fileInput.files);
  if (selected.length > 30) {
    alert('照片數量過多，請重新選擇上傳');
    fileInput.value = '';
    gallery.innerHTML = '';
    resultSection.classList.add('hidden');
    return;
  }
  images = selected;
  deletedList = [];
  renderGallery();
  renderResults();
});

// 3. 渲染縮圖區
function renderGallery() {
  gallery.innerHTML = '';
  images.forEach((file, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    thumb.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'delete-overlay';
    overlay.textContent = '✕';
    overlay.addEventListener('click', e => {
      e.stopPropagation();
      deleteImage(idx);
    });
    thumb.appendChild(overlay);

    const label = document.createElement('div');
    label.className = 'filename';
    label.textContent = file.name;
    thumb.appendChild(label);

    gallery.appendChild(thumb);
  });
}

// 4. 刪除並更新畫面
function deleteImage(idx) {
  deletedList.push(images[idx]);
  images.splice(idx, 1);
  renderGallery();
  renderResults();
}

// 5. 渲染結果清單 (保留 & 已刪除)
function renderResults() {
  keptListEl.innerHTML = '';
  deletedListEl.innerHTML = '';
  images.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file.name;
    keptListEl.appendChild(li);
  });
  deletedList.forEach((file, idx) => {
    const li = document.createElement('li');
    li.textContent = file.name;
    li.className = 'restoreable';
    li.addEventListener('click', () => {
      const restored = deletedList.splice(idx, 1)[0];
      images.push(restored);
      renderGallery();
      renderResults();
    });
    deletedListEl.appendChild(li);
  });
  resultSection.classList.remove('hidden');
}

// 6. 打包 ZIP 並下載
zipBtn.addEventListener('click', async () => {
  const zip = new JSZip();
  for (const file of images) {
    const buffer = await file.arrayBuffer();
    zip.file(file.name, buffer);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = 'kept_photos.zip';
  a.click();
});
```

JavaScript

* * *

## 4\. 小結

- 本專案作為一款純前端、零後端依賴的「照片比較小工具」，關鍵設計與技術亮點如下：

- **狀態驅動、重渲染架構**
    - 以兩組 JavaScript 陣列（`images` 與 `deletedList`）作為唯一的狀態來源，所有使用者互動（上傳、刪除、還原）都透過更新陣列後呼叫同一組渲染函式（`renderGallery()`、`renderResults()`），自動重建 DOM。
    
    - 避免了手動追蹤 DOM 狀態的複雜度，並且將程式邏輯與畫面顯示分離，易於擴充新功能（如分頁、篩選、分群、標籤系統等）。
    
    - 無需引入大型框架（React、Vue 等），僅憑原生 DOM API 就能實現接近 MVVM 的開發體驗，減少打包體積、提升載入速度。

- **響應式 & 動態字體的 CSS 實現**
    - **CSS Grid**：採用 `auto-fit` + `minmax()` 讓縮圖自動調整欄數與寬度，不須為不同裝置寫死欄位數，手機、平板、桌面皆能自適應。
    
    - \*\*clamp()\*\*：利用 `clamp(min, preferred, max)` 讓標題、按鈕與檔名字體大小根據視窗寬度動態縮放，兼具可讀性與空間利用率。
    
    - **相對單位**（`rem`、`%`、`vw`）結合 Grid 與 Flex，排版彈性高、易於維護；同時在 `@media` 斷點中微調間距與排版，確保各種螢幕下都有良好體驗。

- **完全客戶端離線打包**
    - 引入 **JSZip**，僅在瀏覽器端讀取 `File` 物件的 `arrayBuffer()`，再透過 `.file()` 與 `.generateAsync()` 生成 ZIP Blob，最後用隱藏 `<a>` 標籤觸發下載。
    
    - 這種做法免去了伺服器端的檔案上傳與處理，不僅降低後端成本，也保護使用者隱私（照片不離開本機），並且能在無網路或內網環境下正常運行。

- **輕量且易於部屬**
    - 純靜態三檔案結構（`index.html`、`style.css`、`main.js`），可直接部署至任何支援靜態文件的服務（GitHub Pages、Vercel、WordPress 主機…）。
    
    - 推薦使用 `<iframe>` 隔離部屬，避免與現有 WordPress 主題 CSS/JS 衝突；也可選擇將檔案放入 `wp-content/uploads/`，再以絕對路徑引用。
    
    - 無需打包工具或額外建置流程，上手門檻低，方便快速驗證與迭代。

- **未來擴充方向**
    - **自動分群**：可利用前端圖像 Hash（pHash、aHash）或 TensorFlow.js 模型，輔助自動將相似照片分組；
    
    - **自訂標籤與打分**：在每張縮圖下方新增星等打分或文字標籤功能，幫助更細緻的篩選；
    
    - **行動端優化**：加入手勢滑動比較模式、觸控友善的拖放選圖；
    
    - **外部存儲整合**：連結到 Google Drive、Dropbox API，讓保留檔案能一鍵儲存到雲端。

- 透過上述設計，本專案在不依賴後端、維持高度可維護性的前提下，成功實現了直觀、高效且跨裝置一致的照片比較與打包下載功能。

好抱歉 AI 味道超重...
