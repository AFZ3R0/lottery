import "./index.css";
import "../css/animate.min.css";
import "./canvas.js";
import {
  addQipao,
  setPrizes,
  showPrizeList,
  setPrizeData,
  resetPrize
} from "./prizeList";
import { NUMBER_MATRIX } from "./config.js";

const ROTATE_TIME = 3000;
const ROTATE_LOOP = 1000;
const BASE_HEIGHT = 1080;

let TOTAL_CARDS,
  btns = {
    enter: document.querySelector("#enter"),
    lotteryBar: document.querySelector("#lotteryBar"),
    lottery: document.querySelector("#lottery")
  },
  prizes,
  EACH_COUNT,
  ROW_COUNT = 7,
  COLUMN_COUNT = 17,
  COMPANY,
  HIGHLIGHT_CELL = [],
  // 目前比例
  Resolution = 1;

let camera,
  scene,
  renderer,
  controls,
  threeDCards = [],
  targets = {
    table: [],
    sphere: []
  };

let rotateObj;

let selectedCardIndex = [],
  rotate = false,
  basicData = {
    prizes: [], //獎品信息
    users: [], //所有人員
    luckyUsers: {}, //已中獎人員
    leftUsers: [] //未中獎人員
  },
  interval,
  // 目前抽的獎項，從最低獎開始抽，直到抽到大獎
  currentPrizeIndex,
  currentPrize,
  // 正在抽獎
  isLotting = false,
  currentLuckys = [];

initAll();

/**
 * 初始化所有DOM
 */
function initAll() {
  window.AJAX({
    url: "/getTempData",
    success(data) {
      // 獲取基礎資料
      prizes = data.cfgData.prizes;
      EACH_COUNT = data.cfgData.EACH_COUNT;
      COMPANY = data.cfgData.COMPANY;
      HIGHLIGHT_CELL = createHighlight();
      basicData.prizes = prizes;
      setPrizes(prizes);

      TOTAL_CARDS = ROW_COUNT * COLUMN_COUNT;

      // 讀取目前已設置的抽獎結果
      basicData.leftUsers = data.leftUsers;
      basicData.luckyUsers = data.luckyData;

      let prizeIndex = basicData.prizes.length - 1;
      for (; prizeIndex > -1; prizeIndex--) {
        if (
          data.luckyData[prizeIndex] &&
          data.luckyData[prizeIndex].length >=
            basicData.prizes[prizeIndex].count
        ) {
          continue;
        }
        currentPrizeIndex = prizeIndex;
        currentPrize = basicData.prizes[currentPrizeIndex];
        break;
      }

      showPrizeList(currentPrizeIndex);
      let curLucks = basicData.luckyUsers[currentPrize.type];
      setPrizeData(currentPrizeIndex, curLucks ? curLucks.length : 0, true);
    }
  });

  window.AJAX({
    url: "/getUsers",
    success(data) {
      basicData.users = data;

      initCards();
      // startMaoPao();
      animate();
      shineCard();
    }
  });
}

function initCards() {
  let member = basicData.users.slice(),
    showCards = [],
    length = member.length;

  let isBold = false,
    showTable = basicData.leftUsers.length === basicData.users.length,
    index = 0,
    totalMember = member.length,
    position = {
      x: (140 * COLUMN_COUNT - 20) / 2,
      y: (180 * ROW_COUNT - 20) / 2
    };

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;

  scene = new THREE.Scene();

  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COLUMN_COUNT; j++) {
      isBold = HIGHLIGHT_CELL.includes(j + "-" + i);
      var element = createCard(
        member[index % length],
        isBold,
        index,
        showTable
      );

      var object = new THREE.CSS3DObject(element);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);
      threeDCards.push(object);
      //

      var object = new THREE.Object3D();
      object.position.x = j * 140 - position.x;
      object.position.y = -(i * 180) + position.y;
      targets.table.push(object);
      index++;
    }
  }

  // sphere

  var vector = new THREE.Vector3();

  for (var i = 0, l = threeDCards.length; i < l; i++) {
    var phi = Math.acos(-1 + (2 * i) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;
    var object = new THREE.Object3D();
    object.position.setFromSphericalCoords(800 * Resolution, phi, theta);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    targets.sphere.push(object);
  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  //

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);

  bindEvent();

  if (showTable) {
    switchScreen("enter");
  } else {
    switchScreen("lottery");
  }
}

function setLotteryStatus(status = false) {
  isLotting = status;
}

/**
 * 事件綁定
 */
function bindEvent() {
  document.querySelector("#menu").addEventListener("click", function (e) {
    e.stopPropagation();
    // 如果正在抽獎，則禁止一切操作
    if (isLotting) {
      if (e.target.id === "lottery") {
        rotateObj.stop();
        btns.lottery.innerHTML = "開始抽獎";
      } else {
        addQipao("正在抽獎，抽慢一點點～～");
      }
      return false;
    }

    let target = e.target.id;
    switch (target) {
      // 顯示數字牆
      case "welcome":
        switchScreen("enter");
        rotate = false;
        break;
      // 進入抽獎
      case "enter":
        removeHighlight();
        addQipao(`即將抽取[${currentPrize && currentPrize.title ? currentPrize.title : ''}]，請勿離開。`);
        rotate = true;
        switchScreen("lottery");
        break;
      // 重置
      case "reset":
        let doREset = window.confirm(
          "是否確認重置資料，重置後，當前已抽的獎項全部清空？"
        );
        if (!doREset) {
          return;
        }
        addQipao("重置所有資料，重新抽獎");
        addHighlight();
        resetCard();
        // Reset all data
        currentLuckys = [];
        basicData.leftUsers = Object.assign([], basicData.users);
        basicData.luckyUsers = {};
        currentPrizeIndex = basicData.prizes.length - 1;
        currentPrize = basicData.prizes[currentPrizeIndex];

        resetPrize(currentPrizeIndex);
        reset();
        switchScreen("enter");
        break;
      // 抽獎
      case "lottery":
        setLotteryStatus(true);
        saveData();
        changePrize();
        resetCard().then(res => {
          lottery();
        });
        addQipao(`正在抽取[${currentPrize && currentPrize.title ? currentPrize.title : ''}]，請準備！`);
        break;
      // 重新抽獎
      case "reLottery":
        if (currentLuckys.length === 0) {
          addQipao(`目前尚未抽獎，無法重新抽取。`);
          return;
        }
        setErrorData(currentLuckys);
        addQipao(`重新抽取[${currentPrize && currentPrize.title ? currentPrize.title : ''}]，請準備！`);
        setLotteryStatus(true);
        resetCard().then(res => {
          lottery();
        });
        break;
      // 導出抽獎結果
      case "save":
        saveData().then(res => {
          resetCard().then(res => {
            // Clear previous records
            currentLuckys = [];
          });
          exportData();
          addQipao(`資料已匯出至EXCEL。`);
        });
        break;
    }
  });

  window.addEventListener("resize", onWindowResize, false);
}

function switchScreen(type) {
  switch (type) {
    case "enter":
      btns.enter.classList.remove("none");
      btns.lotteryBar.classList.add("none");
      transform(targets.table, 2000);
      break;
    default:
      btns.enter.classList.add("none");
      btns.lotteryBar.classList.remove("none");
      transform(targets.sphere, 2000);
      break;
  }
}

/**
 * 創建元素
 */
function createElement(css, text) {
  let dom = document.createElement("div");
  dom.className = css || "";
  dom.innerHTML = text || "";
  return dom;
}

/**
 * 創建名牌
 */
function createCard(user, isBold, id, showTable) {
  var element = createElement();
  element.id = "card-" + id;

  if (isBold) {
    element.className = "element lightitem";
    if (showTable) {
      element.classList.add("highlight");
    }
  } else {
    element.className = "element";
    element.style.backgroundColor =
      "rgba(0,127,127," + (Math.random() * 0.7 + 0.25) + ")";
  }
  
  // 只顯示姓名和部門
  var nameElement = createElement("name", user[1]);
  var deptElement = createElement("department", user[2]);
  
  // 添加文字縮放功能
  adjustTextSize(nameElement, "name");
  adjustTextSize(deptElement, "department");
  
  element.appendChild(nameElement);
  element.appendChild(deptElement);
  
  return element;
}

/**
 * 調整文字大小以適應卡片
 */
function adjustTextSize(element, className) {
  const maxWidth = 7; // 卡片寬度限制 (vh) - 為邊距留出更多空間
  const maxHeight = className === "name" ? 4.5 : 2.5; // 卡片高度限制 (vh) - 為邊距留出更多空間
  
  // 獲取文字內容
  const text = element.textContent;
  
  // 處理換行邏輯 - 只在空格處換行
  const processedText = processTextWrap(text, className);
  element.innerHTML = processedText;
  
  // 根據文字長度計算合適的字體大小
  let fontSize = className === "name" ? 2.9 : 1.6; // 默認字體大小（最大字體）
  
  // 計算中文字符數量（中文字符占用更多空間）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishChars = text.length - chineseChars;
  const effectiveLength = chineseChars * 1.5 + englishChars;
  
  // 只有當文字長度超過閾值時才進行縮放
  const nameThreshold = 6; // 姓名超過6個字符才開始縮放
  const deptThreshold = 8; // 部門超過8個字符才開始縮放
  const threshold = className === "name" ? nameThreshold : deptThreshold;
  
  if (effectiveLength > threshold) {
    // 文字過長時縮小字體，但不超過原始字體大小
    const scale = Math.min(maxWidth / effectiveLength, maxHeight / 2);
    fontSize = Math.max(fontSize * scale, 1.0); // 最小字體大小
    fontSize = Math.min(fontSize, className === "name" ? 2.9 : 1.6); // 不超過原始字體大小
  }
  
  element.style.fontSize = fontSize + "vh";
  
  // 使用flexbox布局，不需要設置行高
  // element.style.lineHeight = maxHeight + "vh";
}

/**
 * 處理文字換行，只在空格處換行
 */
function processTextWrap(text, className) {
  // 根據元素類型設置最大字符數
  const maxCharsPerLine = className === "name" ? 5 : 7; // 減少字符數，為邊距留出空間
  
  // 如果没有空格，檢查是否需要強制換行
  if (!text.includes(' ')) {
    if (text.length > maxCharsPerLine) {
      // 對於沒有空格的長文字，在適當位置強制換行
      const midPoint = Math.ceil(text.length / 2);
      return text.substring(0, midPoint) + '<br>' + text.substring(midPoint);
    }
    return text;
  }
  
  // 分割文字為單詞
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // 如果當前行加上新單詞不超過限制，就添加到當前行
    if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      // 如果當前行不為空，先保存當前行
      if (currentLine) {
        lines.push(currentLine);
      }
      // 開始新行
      currentLine = word;
    }
  }
  
  // 添加最後一行
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // 將多行文字用<br>連接
  return lines.join('<br>');
}

function removeHighlight() {
  document.querySelectorAll(".highlight").forEach(node => {
    node.classList.remove("highlight");
  });
}

function addHighlight() {
  document.querySelectorAll(".lightitem").forEach(node => {
    node.classList.add("highlight");
  });
}

/**
 * 渲染地球等
 */
function transform(targets, duration) {
  // TWEEN.removeAll();
  for (var i = 0; i < threeDCards.length; i++) {
    var object = threeDCards[i];
    var target = targets[i];

    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

// function rotateBall() {
//   return new Promise((resolve, reject) => {
//     scene.rotation.y = 0;
//     new TWEEN.Tween(scene.rotation)
//       .to(
//         {
//           y: Math.PI * 8
//         },
//         ROTATE_TIME
//       )
//       .onUpdate(render)
//       .easing(TWEEN.Easing.Exponential.InOut)
//       .start()
//       .onComplete(() => {
//         resolve();
//       });
//   });
// }

function rotateBall() {
  return new Promise((resolve, reject) => {
    scene.rotation.y = 0;
    rotateObj = new TWEEN.Tween(scene.rotation);
    rotateObj
      .to(
        {
          y: Math.PI * 6 * ROTATE_LOOP
        },
        ROTATE_TIME * ROTATE_LOOP
      )
      //.easing(TWEEN.Easing.Cubic.Out)  // 指數減速：前面快、後面慢
      //.easing(TWEEN.Easing.Linear)
      .onUpdate(render)
      
      .start()
      .onStop(() => {
        scene.rotation.y = 0;
        resolve();
      })
      .onComplete(() => {
        resolve();
      });
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  // 讓場景通過x軸或者y軸旋轉
  // rotate && (scene.rotation.y += 0.088);

  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();

  // 渲染循環
  // render();
}

function render() {
  renderer.render(scene, camera);
}

function selectCard(duration = 600) {
  rotate = false;
  let width = 140,
    tag = -(currentLuckys.length - 1) / 2,
    locates = [];

  // 計算位置信息, 大於5個分兩排顯示
  if (currentLuckys.length > 5) {
    let yPosition = [-87, 87],
      l = selectedCardIndex.length,
      mid = Math.ceil(l / 2);
    tag = -(mid - 1) / 2;
    for (let i = 0; i < mid; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[0] * Resolution
      });
      tag++;
    }

    tag = -(l - mid - 1) / 2;
    for (let i = mid; i < l; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[1] * Resolution
      });
      tag++;
    }
  } else {
    for (let i = selectedCardIndex.length; i > 0; i--) {
      locates.push({
        x: tag * width * Resolution,
        y: 0 * Resolution
      });
      tag++;
    }
  }

  let text = currentLuckys.map(item => item[1]);
  addQipao(
    `恭喜${text.join("、")}獲得${currentPrize && currentPrize.title ? currentPrize.title : ''}，新的一年必定旺旺旺！`
  );

  // 根據得獎個數決定Z值
  const zValue = currentLuckys.length > 1 ? 2350 : 2500;
  
  selectedCardIndex.forEach((cardIndex, index) => {
    changeCard(cardIndex, currentLuckys[index]);
    var object = threeDCards[cardIndex];
    new TWEEN.Tween(object.position)
      .to(
        {
          x: locates[index].x,
          y: locates[index].y * Resolution,
          z: zValue
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: 0,
          y: 0,
          z: 0
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    object.element.classList.add("prize");
    tag++;
  });

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start()
    .onComplete(() => {
      // 動畫結束後可以操作
      setLotteryStatus();
    });
}

/**
 * 重置抽獎牌內容
 */
function resetCard(duration = 500) {
  if (currentLuckys.length === 0) {
    return Promise.resolve();
  }

  selectedCardIndex.forEach(index => {
    let object = threeDCards[index],
      target = targets.sphere[index];

    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });

  return new Promise((resolve, reject) => {
    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        selectedCardIndex.forEach(index => {
          let object = threeDCards[index];
          object.element.classList.remove("prize");
        });
        resolve();
      });
  });
}

/**
 * 抽獎
 */
function lottery() {
  // if (isLotting) {
  //   rotateObj.stop();
  //   btns.lottery.innerHTML = "開始抽獎";
  //   return;
  // }
  btns.lottery.innerHTML = "結束抽獎";
  rotateBall().then(() => {
    // Clear previous records
    currentLuckys = [];
    selectedCardIndex = [];
    // 目前同時抽取的數目,目前獎品抽完還可以繼續抽，但是不記錄數據
    let perCount = EACH_COUNT[currentPrizeIndex],
      luckyData = basicData.luckyUsers[currentPrize.type],
      leftCount = basicData.leftUsers.length,
      leftPrizeCount = currentPrize.count - (luckyData ? luckyData.length : 0);

    if (leftCount < perCount) {
      addQipao("剩餘參與抽獎人員不足，現已重設所有人員可進行二次抽獎！");
      basicData.leftUsers = basicData.users.slice();
      leftCount = basicData.leftUsers.length;
    }

    for (let i = 0; i < perCount; i++) {
      let luckyId = random(leftCount);
      currentLuckys.push(basicData.leftUsers.splice(luckyId, 1)[0]);
      leftCount--;
      leftPrizeCount--;

      let cardIndex = random(TOTAL_CARDS);
      while (selectedCardIndex.includes(cardIndex)) {
        cardIndex = random(TOTAL_CARDS);
      }
      selectedCardIndex.push(cardIndex);

      if (leftPrizeCount === 0) {
        break;
      }
    }

    // console.log(currentLuckys);
    selectCard();
  });
}

/**
 * 保存上一次的抽獎結果
 */
function saveData() {
  if (!currentPrize) {
    //若獎品抽完，則不再記錄數據，但是還是可以進行抽獎
    return;
  }

  let type = currentPrize.type,
    curLucky = basicData.luckyUsers[type] || [];

  curLucky = curLucky.concat(currentLuckys);

  basicData.luckyUsers[type] = curLucky;

  if (currentPrize.count <= curLucky.length) {
    currentPrizeIndex--;
    if (currentPrizeIndex <= -1) {
      currentPrizeIndex = 0;
    }
    currentPrize = basicData.prizes[currentPrizeIndex];
  }

  if (currentLuckys.length > 0) {
    // todo by xc 添加數據保存機制，以免伺服器掛掉數據丢失
    return setData(type, currentLuckys);
  }
  return Promise.resolve();
}

function changePrize() {
  let luckys = basicData.luckyUsers[currentPrize.type];
  let luckyCount = (luckys ? luckys.length : 0) + EACH_COUNT[currentPrizeIndex];
  // 修改左側prize的數目和百分比
  setPrizeData(currentPrizeIndex, luckyCount);
}

/**
 * 隨機抽獎
 */
function random(num) {
  // Math.floor取到0-num-1之間數字的概率是相等的
  return Math.floor(Math.random() * num);
}

/**
 * 切換名牌人員信息
 */
function changeCard(cardIndex, user) {
  let card = threeDCards[cardIndex].element;

  // 只顯示姓名和部門
  var nameElement = createElement("name", user[1]);
  var deptElement = createElement("department", user[2]);
  
  // 添加文字縮放功能
  adjustTextSize(nameElement, "name");
  adjustTextSize(deptElement, "department");
  
  card.innerHTML = "";
  card.appendChild(nameElement);
  card.appendChild(deptElement);
}

/**
 * 切換名牌背景
 */
function shine(cardIndex, color) {
  let card = threeDCards[cardIndex].element;
  card.style.backgroundColor =
    color || "rgba(0,127,127," + (Math.random() * 0.7 + 0.25) + ")";
}

/**
 * 隨機切換背景和人員信息
 */
function shineCard() {
  let maxCard = 10,
    maxUser;
  let shineCard = 10 + random(maxCard);

  setInterval(() => {
    // 正在抽獎停止閃爍
    if (isLotting) {
      return;
    }
    maxUser = basicData.leftUsers.length;
    for (let i = 0; i < shineCard; i++) {
      let index = random(maxUser),
        cardIndex = random(TOTAL_CARDS);
      // 目前顯示的已抽中名單不進行隨機切換
      if (selectedCardIndex.includes(cardIndex)) {
        continue;
      }
      shine(cardIndex);
      changeCard(cardIndex, basicData.leftUsers[index]);
    }
  }, 30);
}

function setData(type, data) {
  return new Promise((resolve, reject) => {
    window.AJAX({
      url: "/saveData",
      data: {
        type,
        data
      },
      success() {
        resolve();
      },
      error() {
        reject();
      }
    });
  });
}

function setErrorData(data) {
  return new Promise((resolve, reject) => {
    window.AJAX({
      url: "/errorData",
      data: {
        data
      },
      success() {
        resolve();
      },
      error() {
        reject();
      }
    });
  });
}

function exportData() {
  window.AJAX({
    url: "/export",
    success(data) {
      if (data.type === "success") {
        location.href = data.url;
      }
    }
  });
}

function reset() {
  window.AJAX({
    url: "/reset",
    success(data) {
      console.log("重置成功");
    }
  });
}

function createHighlight() {
  let year = new Date().getFullYear() + "";
  let step = 4,
    xoffset = 1,
    yoffset = 1,
    highlight = [];

  year.split("").forEach(n => {
    highlight = highlight.concat(
      NUMBER_MATRIX[n].map(item => {
        return `${item[0] + xoffset}-${item[1] + yoffset}`;
      })
    );
    xoffset += step;
  });

  return highlight;
}

let onload = window.onload;

window.onload = function () {
  onload && onload();

  let music = document.querySelector("#music");

  let rotated = 0,
    stopAnimate = false,
    musicBox = document.querySelector("#musicBox");

  function animate() {
    requestAnimationFrame(function () {
      if (stopAnimate) {
        return;
      }
      rotated = rotated % 360;
      musicBox.style.transform = "rotate(" + rotated + "deg)";
      rotated += 1;
      animate();
    });
  }

  musicBox.addEventListener(
    "click",
    function (e) {
      if (music.paused) {
        music.play().then(
          () => {
            stopAnimate = false;
            animate();
          },
          () => {
            addQipao("背景音樂自動播放失敗，請手動播放！");
          }
        );
      } else {
        music.pause();
        stopAnimate = true;
      }
    },
    false
  );

  setTimeout(function () {
    musicBox.click();
  }, 1000);
};

// Custom cursor (semi-transparent dot)
(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    body { cursor: none !important; }
    #custom-cursor {
      position: fixed;
      left: 0; top: 0;
      width: 36px; height: 36px;
      margin-left: -18px; margin-top: -18px;
      pointer-events: none;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      box-shadow: 0 0 8px 2px rgba(255,255,255,0.10);
      z-index: 9999;
      transition: background 0.2s, transform 0.1s;
      will-change: transform;
      display: none;
    }
    @media (pointer: coarse) {
      body { cursor: auto !important; }
      #custom-cursor { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  // Show/hide on mouse enter/leave
  document.body.addEventListener('mouseenter', () => { cursor.style.display = 'block'; });
  document.body.addEventListener('mouseleave', () => { cursor.style.display = 'none'; });

  // 跟隨滑鼠移動
  document.addEventListener('mousemove', function(e) {
    cursor.style.display = 'block';
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
})();

// 主題色自動套用
(function applyLotteryTheme() {
  const theme = localStorage.getItem('lotteryTheme');
  if (theme) {
    const colors = JSON.parse(theme);
    Object.entries(colors).forEach(([key, conf]) => {
      const { color, alpha } = conf;
      const r = parseInt(color.substr(1,2),16);
      const g = parseInt(color.substr(3,2),16);
      const b = parseInt(color.substr(5,2),16);
      const rgba = `rgba(${r},${g},${b},${alpha})`;
      document.documentElement.style.setProperty(`--${key}`, rgba);
    });
  }
})();
