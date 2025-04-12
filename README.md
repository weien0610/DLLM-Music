# DLLM 音樂播放器

歡迎使用 DLLM 音樂播放器，這是一個純前端的音樂播放器，支持在瀏覽器中播放音樂。

## 在線體驗

訪問我們的 GitHub Pages 版本：
[https://weien0610.github.io/DLLM-Music/](https://weien0610.github.io/DLLM-Music/)

## 功能

- 自動播放（需要用戶交互）
- 播放、暫停、上一首、下一首控制
- 進度條顯示和控制
- 音量調節
- 播放列表
- 專輯封面顯示

## 如何使用（本地開發）

### 方法 1：直接打開 HTML 文件

您可以直接在瀏覽器中打開 `index.html` 文件，但由於瀏覽器安全限制，某些功能可能不可用。

### 方法 2：使用 Node.js 服務器（推薦）

1. 確保已安裝 Node.js
2. 安裝依賴：
   ```
   npm install express cors
   ```
3. 啟動服務器：
   ```
   node server.js
   ```
4. 打開瀏覽器訪問 `http://localhost:8080`

## 添加音樂

1. 將 MP3 音樂文件放入 `music/` 目錄
2. 將專輯封面圖片放入 `covers/` 目錄
3. 編輯 `script.js` 文件中的 `songs` 數組：

```javascript
const songs = [
    {
        name: "歌曲名稱",
        artist: "藝術家",
        path: "music/歌曲文件.mp3",
        cover: "covers/封面圖片.jpg"
    },
    // 添加更多歌曲...
];
```

## 本地開發與 GitHub Pages 的區別

- **本地開發**：使用 Node.js 服務器 (`server.js`) 提供更好的音頻文件處理
- **GitHub Pages**：純靜態部署，不需要服務器代碼

## 關於瀏覽器自動播放政策

現代瀏覽器通常會阻止自動播放帶聲音的媒體，直到用戶與頁面進行交互。
我們的播放器會顯示一個開始覆蓋層，當用戶點擊後才開始播放音樂。

## 技術細節

- 純 HTML, CSS 和 JavaScript
- 支持主流瀏覽器
- 響應式設計，適合各種設備

## 授權

MIT 許可證 