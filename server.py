from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
  return render_template('index.html')  # HTML側で使うファイル名

@socketio.on('start_time')
def handle_start_time(data):
  print("受信したスタート時刻:", data['timestamp'])
  emit('broadcast_start_time', data, broadcast=True)

@socketio.on('reset_timer')
def handle_reset_timer():
  print("Reset signal received")  # デバッグ用
  emit('broadcast_reset_timer', broadcast=True)
  
if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=5001)

