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

  var numStars = 800;
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
      star.z--;

      if (star.z <= 0) {
        star.z = canvas.width;
      }
    }
  }

  // 新增：載入背景圖片
  var bgImg = new Image();
  bgImg.src = './img/bg.jpeg';
  var bgLoaded = false;
  bgImg.onload = function() {
    bgLoaded = true;
  };

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
      c.save();
      c.filter = 'blur(8px)'; // 可調整模糊程度
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

      // 新增：調暗圖片
      c.save();
      c.globalAlpha = 0.5; // 0~1，數值越大越暗
      c.fillStyle = '#000';
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.restore();
    } else {
      // 沒有圖片時用透明
      c.clearRect(0, 0, canvas.width, canvas.height);
    }

    c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    for (i = 0; i < numStars; i++) {
      star = stars[i];

      pixelX = (star.x - centerX) * (focalLength / star.z);
      pixelX += centerX;
      pixelY = (star.y - centerY) * (focalLength / star.z);
      pixelY += centerY;
      pixelRadius = 1 * (focalLength / star.z);

      c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
      c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
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
