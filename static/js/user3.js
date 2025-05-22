$(document).ready(function () {
    // ...existing code...
    const socket = io('http://192.168.2.200:5000'); // サーバーのURLを0.0.0.0:5000に変更
    // ネットワークタブのボタンでラウンドトリップ計測
    $("#network-button").on("click", function () {
        const start = performance.now();
        // サーバーにpingイベント送信
        socket.emit("network_ping", { timestamp: Date.now() });
        // サーバーからpongが返ってきたら計測
        socket.once("network_pong", function (data) {
            const end = performance.now();
            const rtt = Math.round(end - start);
            // タブ内に表示
            $("#network").find(".text-center").append(`<div id='rtt-result'>RTT: ${rtt} ms</div>`);
            setTimeout(()=>{$("#rtt-result").remove();}, 3000);
        });
        console.log('スイッチオンを送信しました');
    });
});