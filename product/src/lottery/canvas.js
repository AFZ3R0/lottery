(function () {
  //based on an Example by @curran
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame;
  })();
  var canvas = document.getElementById("canvas");

  ~~(function setSize() {
    //定义canvas的宽高，让他跟浏览器的窗口的宽高相同
    window.onresize = arguments.callee;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  })();

  var c = canvas.getContext("2d");

  var numStars = 400;
  var initialStars = 100;
  var starsIncrement = 50;
  var starsIncrementInterval = 100; // ms
  var starsTarget = numStars;
  var radius = "0." + Math.floor(Math.random() * 9) + 1;
  var focalLength = canvas.width * 2;
  var warp = 0;
  var centerX, centerY;

  var stars = [],
    star;
  var i;

  var animate = true;

  initializeStars();

  function executeFrame() {
    if (animate) requestAnimFrame(executeFrame);
    moveStars();
    drawStars();
  }
  
  // 掛載到 window 上，讓外部可以呼叫
  window.executeFrame = executeFrame;

  function initializeStars() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    stars = [];
    for (i = 0; i < numStars; i++) {
      star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        o: "0." + Math.floor(Math.random() * 99) + 1
      };
      stars.push(star);
    }
  }

  function moveStars() {
    for (i = 0; i < numStars; i++) {
      star = stars[i];
      star.z -= 1.5;

      if (star.z <= 0) {
        star.z = canvas.width;
      }
    }
  }

  // 新增：載入背景圖片
  var bgImg = new Image();
  // 嘗試不同的路徑
  bgImg.src = '../img/bg.jpeg';
  var bgLoaded = false;
  bgImg.onload = function() {
    bgLoaded = true;
    // console.log('背景圖載入成功');
  };
  bgImg.onerror = function() {
    console.error('背景圖載入失敗，嘗試其他路徑');
    // 嘗試其他路徑
    bgImg.src = './img/bg.jpeg';
  };

  // 讀取主題設定的目標值
  var targetBlur = parseFloat(localStorage.getItem('bgBlurValue')) || 8;
  var targetDarken = localStorage.getItem('bgDarkenValue') !== null ? parseFloat(localStorage.getItem('bgDarkenValue')) : 0.5;
  // 初始值
  var currentBlur = 0;
  var currentDarken = 1; // 先設最暗
  var blurAnimStart = null;
  var blurAnimDuration = 2000; // 2秒
  var blurAnimDelay = 5000; // 5秒延遲
  var blurAnimRunning = false;

  setTimeout(function() {
    // 5秒後，模糊值直接到主題設定值
    currentBlur = targetBlur;
    // 變暗值開始漸進
    blurAnimRunning = true;
    blurAnimStart = performance.now();
    requestAnimationFrame(darkenAnimStep);
  }, blurAnimDelay);

  function darkenAnimStep(now) {
    if (!blurAnimRunning) return;
    var elapsed = now - blurAnimStart;
    var t = Math.min(elapsed / blurAnimDuration, 1);
    // 只漸進變暗值
    currentDarken = 1 + (targetDarken - 1) * t;
    if (t < 1) {
      requestAnimationFrame(darkenAnimStep);
    } else {
      blurAnimRunning = false;
      currentDarken = targetDarken;
    }
  }

  // 取得星星顏色（主色+動態alpha）
  function getStarColor(alpha) {
    const cssColor = getComputedStyle(document.documentElement).getPropertyValue('--star-color').trim() || 'rgba(209,255,255,0.8)';
    // 解析 rgba(r,g,b,a)
    const match = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return `rgba(209,255,255,${alpha})`;
  }

  function drawStars() {
    var pixelX, pixelY, pixelRadius;

    // Resize to the screen
    if (
      canvas.width != window.innerWidth ||
      canvas.width != window.innerWidth
    ) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    }

    // 先畫模糊背景圖
    if (bgLoaded) {
      // console.log('繪製背景圖');
      c.save();
      
      // 使用動畫中的 currentBlur/currentDarken
      c.filter = `blur(${currentBlur}px)`;
      
      // 從 localStorage 讀取值，如果沒有則使用預設值
      // const blurValue = localStorage.getItem('bgBlurValue') || '8px';
      // const darkenValue = localStorage.getItem('bgDarkenValue') !== null ? parseFloat(localStorage.getItem('bgDarkenValue')) : 0.5;
      
      // console.log('使用的模糊值:', blurValue);
      // console.log('使用的變暗值:', darkenValue, '類型:', typeof darkenValue);
      // console.log('變暗值是否大於 0:', darkenValue > 0);
      
      // c.filter = `blur(${blurValue})`;
      
      // 讓圖片寬度自動，高度等於canvas
      var imgRatio = bgImg.width / bgImg.height;
      var canvasRatio = canvas.width / canvas.height;
      var drawWidth, drawHeight, drawX, drawY;
      if (imgRatio > canvasRatio) {
        // 圖片比canvas寬
        drawHeight = canvas.height;
        drawWidth = bgImg.width * (canvas.height / bgImg.height);
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // 圖片比canvas窄
        drawWidth = canvas.width;
        drawHeight = bgImg.height * (canvas.width / bgImg.width);
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }
      c.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      c.restore();
      c.filter = 'none';

      // 應用變暗效果
      if (currentDarken > 0) {
        // console.log('準備應用變暗效果，值為:', darkenValue);
        // console.log('應用變暗效果');
        c.save();
        c.globalCompositeOperation = 'multiply';
        c.globalAlpha = currentDarken;
        c.fillStyle = '#000';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.restore();
      } else {
        // console.log('跳過變暗效果（值為 0 或負數）');
      }
    } else {
      // console.log('背景圖未載入');
      // 沒有圖片時用透明
      c.clearRect(0, 0, canvas.width, canvas.height);
    }

    // c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    c.fillStyle = getStarColor(radius);
    for (i = 0; i < numStars; i++) {
      star = stars[i];

      pixelX = (star.x - centerX) * (focalLength / star.z);
      pixelX += centerX;
      pixelY = (star.y - centerY) * (focalLength / star.z);
      pixelY += centerY;
      pixelRadius = 1 * (focalLength / star.z);

      c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
      c.fillStyle = getStarColor(star.o);
      //c.fill();
    }
  }

  // document.getElementById('warp').addEventListener("click", function(e) {
  //     window.c.beginPath();
  //     window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
  //     window.warp = warp ? 0 : 1;
  //     executeFrame();
  // });

  executeFrame();
})();
