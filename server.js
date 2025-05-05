// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');

// Express + HTTP サーバーセットアップ
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

// public フォルダ配下の静的ファイル配信
app.use(express.static('public'));

// シリアルポート初期化（お使いの環境に合わせて変更）
const serial = new SerialPort({
  path: '/dev/ttyUSB0',   // Windows なら 'COM3' など
  baudRate: 115200,
  autoOpen: true
});
serial.on('open', () => console.log('Serial port opened'));
serial.on('error', err => console.error('Serial error:', err));

// Socket.IO でコントローラー情報を受信しシリアル送信
io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('controller_status', data => {
    // 例: スティック軸 → "n:0.55,1.00,0.00,0.00"
    const axesStr = 'n:' + data.axes.map(v => v.toFixed(2)).join(',');
    // 例: ボタン   → "1,0,0,1,0,..."
    const btnStr  = data.buttons.map(b => b.pressed ? '1' : '0').join(',');
    // セミコロン区切り＋改行
    const outStr  = `${axesStr};${btnStr}\n`;

    // ターミナルにも表示
    console.log(`Axes: ${axesStr} | Buttons: ${btnStr}`);

    // シリアルへ送信
    serial.write(outStr, err => {
      if (err) console.error('Write error:', err);
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO server running at http://0.0.0.0:${PORT}`);
});