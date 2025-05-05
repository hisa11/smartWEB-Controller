// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Express + HTTP サーバーセットアップ
const app = express();
const server = http.createServer(app);

// Socket.IO インスタンス生成（CORS 全開放）
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// public フォルダ配下の静的ファイルを配信（任意）
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`クライアント接続: ${socket.id}`);

  // コントローラー情報受信
  socket.on('controller_status', (data) => {
    console.log(`\n【ステータス受信 from ${socket.id}】`);
    console.log('Axes:', data.axes.map(v => v.toFixed(2)).join(', '));
    const pressed = data.buttons
      .map((b,i) => b.pressed ? i : null)
      .filter(i => i !== null);
    console.log('Buttons pressed:', pressed.length ? pressed.join(', ') : 'None');
  });

  socket.on('disconnect', () => {
    console.log(`クライアント切断: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO サーバー 起動中 → http://0.0.0.0:${PORT}`);
});
