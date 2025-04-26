window.onload = function () {
  const splash = document.getElementById('splash');
  const mainContent = document.getElementById('main-content');
  const fullscreenPrompt = document.getElementById('fullscreen-prompt');
  const enterBtn = document.getElementById('enter-fullscreen');
  const rotateWarning = document.getElementById('rotate-warning');

  const isLandscape = () => window.innerWidth > window.innerHeight;
  const isFullscreen = () => !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  const isSafari = () => /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  function requestFullscreen() {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      return docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      return docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      return docEl.msRequestFullscreen();
    } else {
      return Promise.resolve();
    }
  }

  function startSplash() {
    splash.style.display = 'flex';
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.classList.add('d-none');
        mainContent.classList.remove('d-none');
      }, 500);
    }, 500);
  }

  function checkOrientationAndStart() {
    if (!isLandscape()) {
      rotateWarning.style.display = 'flex';
      fullscreenPrompt.style.display = 'none';
      splash.style.display = 'none';
      mainContent.classList.add('d-none');
    } else {
      rotateWarning.style.display = 'none';

      if (isSafari()) {
        // Safariの場合、全画面ボタンは表示せずにスプラッシュ画面を表示する
        fullscreenPrompt.style.display = 'none';
        splash.style.display = 'flex';
        mainContent.classList.add('d-none');
        startSplash();
      } else {
        // Safari以外で、全画面でない場合は全画面ボタンを表示
        if (!isFullscreen()) {
          fullscreenPrompt.style.display = 'flex';
          splash.style.display = 'none';
          mainContent.classList.add('d-none');
        } else {
          fullscreenPrompt.style.display = 'none';
          startSplash();
        }
      }
    }
  }

  // 初回判定
  checkOrientationAndStart();

  // 向き変更に対応
  window.addEventListener('resize', checkOrientationAndStart);

  // ボタンクリックで全画面に移行
  enterBtn.addEventListener('click', () => {
    requestFullscreen().then(() => {
      fullscreenPrompt.style.display = 'none';
      checkOrientationAndStart();
    });
  });
};
