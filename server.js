// 阿宝云端服务 - Vercel部署版
const express = require('express');
const app = express();

// Server酱配置
const SEND_KEY = 'SCT333784T80D75rYQrzMdhOXZxspJuTY4';
const PUSH_URL = `https://sctapi.ftqq.com/${SEND_KEY}.send`;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 允许跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// 首页
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>🐉 阿宝云端</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 { color: #333; margin-bottom: 10px; }
    .subtitle { color: #666; margin-bottom: 30px; }
    textarea {
      width: 100%;
      height: 120px;
      border: 2px solid #eee;
      border-radius: 10px;
      padding: 15px;
      font-size: 16px;
      resize: none;
      margin-bottom: 15px;
    }
    textarea:focus { border-color: #667eea; outline: none; }
    button {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover { transform: scale(1.02); }
    .status { 
      margin-top: 20px; 
      padding: 15px; 
      border-radius: 10px;
      text-align: center;
      display: none;
    }
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
    .info { 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 1px solid #eee;
      color: #888;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🐉 阿宝云端</h1>
    <p class="subtitle">王杨专属投资顾问 · 24小时在线</p>
    
    <textarea id="message" placeholder="输入您想问阿宝的问题...&#10;例如：分析一下农产品&#10;例如：推送止损提醒"></textarea>
    
    <button onclick="send()">发送给阿宝</button>
    
    <div id="status" class="status"></div>
    
    <div class="info">
      ✅ 已激活 | Server酱推送 | 2026-04-04
    </div>
  </div>
  
  <script>
    async function send() {
      const msg = document.getElementById('message').value.trim();
      if (!msg) {
        showStatus('请输入消息', 'error');
        return;
      }
      
      const status = document.getElementById('status');
      status.style.display = 'block';
      status.className = 'status';
      status.textContent = '发送中...';
      
      try {
        const res = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        
        if (data.success) {
          showStatus('✅ 已推送到微信！', 'success');
        } else {
          showStatus('发送失败: ' + data.error, 'error');
        }
      } catch (e) {
        showStatus('网络错误', 'error');
      }
    }
    
    function showStatus(text, type) {
      const status = document.getElementById('status');
      status.style.display = 'block';
      status.className = 'status ' + type;
      status.textContent = text;
    }
  </script>
</body>
</html>
  `);
});

// API: 发送消息
app.post('/api/send', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.json({ success: false, error: '消息不能为空' });
  }
  
  try {
    const response = await fetch(PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '🐉 阿宝收到消息',
        desp: `老板发来消息：\n\n${message}\n\n——来自阿宝云端`
      })
    });
    
    const data = await response.json();
    
    if (data.code === 0) {
      res.json({ success: true, pushid: data.data.pushid });
    } else {
      res.json({ success: false, error: data.message });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// API: 主动推送（内部调用）
app.post('/api/push', async (req, res) => {
  const { title, content } = req.body;
  
  try {
    const response = await fetch(PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, desp: content })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Vercel导出
module.exports = app;
