// 阿宝云端服务
const express = require('express');
const app = express();
const SEND_KEY = 'SCT333784T80D75rYQrzMdhOXZxspJuTY4';
const PUSH_URL = `https://sctapi.ftqq.com/${SEND_KEY}.send`;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Content-Type');
 if (req.method === 'OPTIONS') return res.sendStatus(200);
 next();
});
app.get('/', (req, res) => { res.send('<html><head><meta charset="utf-8"><title>阿宝云端</title></head><body style="font-family:sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px"><div style="background:white;border-radius:20px;padding:40px;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)"><h1>阿宝云端</h1><p style="color:#666;margin-bottom:30px">王杨专属投资顾问 · 24小时在线</p><textarea id="msg" placeholder="输入您想问阿宝的问题..." style="width:100%;height:120px;border:2px solid #eee;border-radius:10px;padding:15px;font-size:16px;resize:none;margin-bottom:15px;box-sizing:border-box"></textarea><button onclick="send()" style="width:100%;padding:15px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:18px;cursor:pointer">发送给阿宝</button><div id="status" style="margin-top:20px;padding:15px;border-radius:10px;text-align:center;display:none"></div></div><script>async function send(){const m=document.getElementById("msg").value.trim();if(!m){show("请输入",\"error\");return}const s=document.getElementById(\"status\");s.style.display=\"block\";s.textContent=\"发送中...\";try{const r=await fetch(\"/api/send\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({message:m})});const d=await r.json();show(d.success?\"已推送到微信！\":\"失败:\"+(d.error||\"\"),d.success?\"success\":\"error\")}catch(e){show(\"网络错误\",\"error\")}}function show(t,c){const s=document.getElementById(\"status\");s.style.display=\"block\";s.className=c;s.textContent=t;s.style.background=c==\"success\"?\"#d4edda\":\"#f8d7da\";s.style.color=c==\"success\"?\"#155724\":\"#721c24\"}</script></body></html>'); });
app.post('/api/send', async (req, res) => {
 const { message } = req.body;
 if (!message) return res.json({ success: false, error: '空' });
 try {
 const r = await fetch(PUSH_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ title: '阿宝收到消息', desp: message }) });
 const d = await r.json();
 res.json({ success: d.code === 0, error: d.message });
 } catch(e) { res.json({ success: false, error: e.message }); }
});
app.post('/api/push', async (req, res) => {
 const { title, content } = req.body;
 try {
 const r = await fetch(PUSH_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ title, desp: content }) });
 res.json(await r.json());
 } catch(e) { res.json({ success: false, error: e.message }); }
});
module.exports = app;
