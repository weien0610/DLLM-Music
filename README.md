# DLLM 音樂播放器

這是一個網頁音樂播放器，具有以下功能：

- 播放、暫停、上一首、下一首控制
- 進度條顯示和控制
- 音量控制
- 播放列表切換

## 在線體驗

訪問[DLLM音樂播放器](https://weien0610.github.io/DLLM-Music/)即可在線體驗。

## 如何使用

1. 克隆這個倉庫到你的本地
   ```
   git clone https://github.com/weien0610/DLLM-Music.git
   ```
2. 將你的音樂文件放在 `music` 目錄中
3. 將專輯封面圖片放在 `covers` 目錄中
4. 編輯 `script.js` 文件，在 `songs` 數組中添加你的音樂信息
5. 打開 `index.html` 文件，或使用以下命令啟動本地服務器：
   ```
   node server.js
   ```
   然後在瀏覽器中訪問 `http://localhost:8080`

## 添加音樂

在 `script.js` 文件中，找到 `songs` 數組，按照以下格式添加你的音樂：

```javascript
const songs = [
    {
        title: '歌曲標題',
        artist: '歌手/藝術家',
        path: 'music/你的音樂文件.mp3',
        cover: 'covers/專輯封面.jpg'
    },
    // 可以添加更多歌曲...
];
```

## 支持的音樂格式

該播放器支持所有現代瀏覽器支持的音頻格式，主要包括：

- MP3
- WAV
- OGG
- AAC

## 關於GitHub Pages部署

本項目已部署在GitHub Pages上，您可以通過以下步驟更新您的部署：

1. 完成代碼修改後，提交您的更改：
   ```
   git add .
   git commit -m "更新描述"
   git push origin main
   ```
2. GitHub Actions將自動部署您的更改到GitHub Pages
3. 幾分鐘後，您的更改將在 https://weien0610.github.io/DLLM-Music/ 上可見

## 注意事項

- 請確保你有權利使用你添加的音樂
- 在部署到公開網站之前，請確保你遵守當地的版權法律
- 該播放器僅供個人學習和非商業用途使用

## 技術細節

- 純HTML、CSS和JavaScript實現
- 不依賴任何外部庫（除了Material Icons）
- 響應式設計，適合在各種設備上使用

## 授權

MIT許可證 