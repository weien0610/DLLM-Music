const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// 啟用CORS
app.use(cors());

// 靜態文件中間件
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    // 處理音頻文件的特殊頭部
    if (path.extname(filePath) === '.mp3') {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// 特別處理音頻文件請求
app.get('/music/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'music', filename);
  
  // 檢查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    return res.status(404).send('找不到音頻文件');
  }
  
  // 獲取文件的擴展名
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.mp3' ? 'audio/mpeg' : 'audio/wav';
  
  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    
    // 設置適當的頭部
    res.set({
      'Content-Type': mimeType,
      'Content-Length': fileSize,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    
    // 直接發送文件
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(`提供文件時出錯: ${error.message}`);
    res.status(500).send('服務器錯誤');
  }
});

// 處理主頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`音樂播放器服務器運行在 http://localhost:${PORT}/`);
  console.log('請在瀏覽器中打開上述地址');
  console.log('按Ctrl+C停止服務器');
}); 