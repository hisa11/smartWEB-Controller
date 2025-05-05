/* user2.js */
// クライアント側の PS4 コントローラー入力取得・サーバー送信スクリプト

// Socket.IO クライアントと接続（HTML 側で読み込まれていると想定）
const socket = io('http://192.168.0.7:5000');

let gamepadIndex = null;    // 接続中のゲームパッド index
let pollInterval = null;    // ポーリング用 interval ID

// ゲームパッド接続イベント
window.addEventListener('gamepadconnected', (e) => {
    console.log('Gamepad connected:', e.gamepad);
    gamepadIndex = e.gamepad.index;
    startPolling();
});

// ゲームパッド切断イベント
window.addEventListener('gamepaddisconnected', (e) => {
    console.log('Gamepad disconnected:', e.gamepad);
    stopPolling();
    gamepadIndex = null;
});

// ゲームパッド入力のポーリングを開始
function startPolling() {
    if (pollInterval) return;
    // 送信間隔を 10ms に短縮
    pollInterval = setInterval(() => {
        const gp = navigator.getGamepads()[gamepadIndex];
        if (!gp) return;

        // 軸（スティック）情報を配列で取得
        const axes = gp.axes.slice();

        // ボタン情報を配列で取得（pressed および value）
        const buttons = gp.buttons.map(btn => ({
            pressed: btn.pressed,
            value: btn.value
        }));

        // サーバーに送信
        socket.emit('controller_status', { axes, buttons });
    }, 10);  // 10ms ごとに送信
}

// ポーリング停止
function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

// 初期状態でコントローラーがすでに接続されている場合の対応
window.addEventListener('load', () => {
    const gps = navigator.getGamepads();
    for (let i = 0; i < gps.length; i++) {
        if (gps[i]) {
            gamepadIndex = i;
            console.log('Gamepad detected on load:', gps[i]);
            startPolling();
            break;
        }
    }
});
