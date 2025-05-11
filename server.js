const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
// ここだけ native なしライブラリ
const ROSLIB     = require('roslib');

async function main() {
  // 1) roslib で WS 接続
  const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });
  ros.on('connection',  () => console.log('→ connected to rosbridge'));
  ros.on('error',       err => console.error('rosbridge error:', err));
  ros.on('close',       () => console.log('rosbridge connection closed'));

  // 2) Joy トピックの publisher を用意
  const joyTopic = new ROSLIB.Topic({
    ros,
    name:    '/joy',
    messageType: 'sensor_msgs/msg/Joy'
  });

  // 3) Express + Socket.IO の設定
  const app    = express();
  const server = http.createServer(app);
  const io     = new Server(server, { cors: { origin: '*', methods: ['GET','POST'] } });
  app.use(express.static('public'));

  // 4) シリアルポート
  const serial = new SerialPort({ path:'/dev/ttyACM0', baudRate:115200, autoOpen:true });
  serial.on('open',  () => console.log('Serial port opened'));
  serial.on('error', err => console.error('Serial error:', err));

  // 5) Socket.IO → ROS2 + シリアル
  io.on('connection', socket => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('controller_status', data => {
      // rosbridge に publish
      const joyMsg = new ROSLIB.Message({
        header:  { stamp: { sec:0, nanosec:0 }, frame_id:'' },
        axes:    data.axes,
        buttons: data.buttons.map(b => b.pressed ? 1 : 0)
      });
      joyTopic.publish(joyMsg);

      // シリアルにも流したければ
      const axesStr = 'n:' + data.axes.map(v=>v.toFixed(2)).join(':');
      const outStr  = `${axesStr}|`;
      serial.write(outStr, err=> err && console.error('Write error:', err));

      console.log(`→ /joy published, axes=[${joyMsg.axes}], buttons=[${joyMsg.buttons}]`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  const PORT = 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP+Socket.IO server at http://0.0.0.0:${PORT}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
