const MAX_TOP = 300,
  MAX_WIDTH = document.body.clientWidth;

let defaultType = 0;

let prizes;
const DEFAULT_MESS = [
  "我是该抽中一等奖还是一等奖呢，纠结ing...",
  "听说要提前一个月吃素才能中大奖喔！",
  "好想要一等奖啊！！！",
  "一等奖有没有人想要呢？",
  "五等奖也不错，只要自己能中奖就行",
  "祝大家新年快乐！",
  "中不中奖不重要，大家吃好喝好。",
  "新年，祝福大家事事顺遂。",
  "作为专业陪跑的我，我就看看你们有谁跟我一样",
  "新的一年祝福大家越来越好！",
  "来年再战！！！"
];

let lastDanMuList = [];

let prizeElement = {},
  lasetPrizeIndex = 0;
class DanMu {
  constructor(option) {
    if (typeof option !== "object") {
      option = {
        text: option
      };
    }

    this.position = {};
    this.text = option.text;
    this.onComplete = option.onComplete;

    this.init();
  }

  init() {
    this.element = document.createElement("div");
    this.element.className = "dan-mu";
    document.body.appendChild(this.element);

    this.start();
  }

  setText(text) {
    this.text = text || this.text;
    this.element.textContent = this.text;
    this.width = this.element.clientWidth + 100;
  }

  start(text) {
    let speed = ~~(Math.random() * 10000) + 6000;
    this.position = {
      x: MAX_WIDTH
    };
    let delay = speed / 10;

    this.setText(text);
    this.element.style.transform = "translateX(" + this.position.x + "px)";
    this.element.style.top = ~~(Math.random() * MAX_TOP) + 10 + "px";
    this.element.classList.add("active");
    this.tween = new TWEEN.Tween(this.position)
      .to(
        {
          x: -this.width
        },
        speed
      )
      .onUpdate(() => {
        this.render();
      })
      .onComplete(() => {
        this.onComplete && this.onComplete();
      })
      .start();
  }

  render() {
    this.element.style.transform = "translateX(" + this.position.x + "px)";
  }
}

class Qipao {
  constructor(option) {
    if (typeof option !== "object") {
      option = {
        text: option
      };
    }

    this.text = option.text;
    this.onComplete = option.onComplete;
    this.$par = document.querySelector(".qipao-container");
    if (!this.$par) {
      this.$par = document.createElement("div");
      this.$par.className = "qipao-container";
      document.body.appendChild(this.$par);
    }

    this.init();
  }

  init() {
    this.element = document.createElement("div");
    this.element.className = "qipao animated";
    this.$par.appendChild(this.element);

    this.start();
  }

  setText(text) {
    this.text = text || this.text;
    this.element.textContent = this.text;
  }

  start(text) {
    this.setText(text);
    this.element.classList.remove("bounceOutRight");
    this.element.classList.add("bounceInRight");

    setTimeout(() => {
      this.element.classList.remove("bounceInRight");
      this.element.classList.add("bounceOutRight");
      this.onComplete && this.onComplete();
    }, 4000);
  }
}

// 停用氣泡提示
let addQipao = () => {};

// 名額顯示對應表，type=0 顯示 ???，其他顯示 count
let prizeQuotaMap = {};
function updatePrizeQuotaMap() {
  prizeQuotaMap = {};
  if (!prizes) return;
  prizes.forEach(item => {
    prizeQuotaMap[item.type] = (item.type === 0) ? "???" : item.count;
  });
}

function setPrizes(pri) {
  prizes = pri;
  defaultType = prizes[0]["type"];
  lasetPrizeIndex = pri.length - 1;
  updatePrizeQuotaMap();
}

function showPrizeList(currentPrizeIndex) {
  updatePrizeQuotaMap();
  let currentPrize = prizes[currentPrizeIndex];
  // 只有 type>0 時才顯示名額
  let showQuota = currentPrize.type > 0;
  let quotaText = prizeQuotaMap[currentPrize.type];
  let unitText = "個";
  let leftText = currentPrize.type === 0 ? "???" : quotaText;
  let quotaBlock = `<span id="prizeQuotaBlock">，名額<label class="prize-shine">${quotaText}</label>${unitText}</span>`;
  // 只更新 .prize-mess 內容
  const mess = document.querySelector('.prize-mess');
  if (mess) {
    mess.innerHTML = `正在抽取<label id="prizeType" class="prize-shine">${currentPrize.text}</label><label id="prizeText" class="prize-shine">${currentPrize.title}</label>${quotaBlock}<label id="prizeLeft" style="display:none">${leftText}</label>`;
  }
  console.log('[showPrizeList] type:', currentPrize.type, 'quotaBlock:', quotaBlock);
  let htmlCode = `<div class="prize-mess">正在抽取<label id="prizeType" class="prize-shine">${currentPrize.text}</label><label id="prizeText" class="prize-shine">${currentPrize.title}</label>${quotaBlock}<label id="prizeLeft" style="display:none">${leftText}</label></div>`;
  htmlCode += `<ul class="prize-list">`;
  let total = prizes.length;
  let center = currentPrizeIndex;
  let windowSize = 7; // 正抽+上下各三格
  let half = Math.floor(windowSize / 2);
  let start = Math.max(0, center - half);
  let end = Math.min(total, start + windowSize);
  // 若在底部不足windowSize，往上補
  if (end - start < windowSize) {
    start = Math.max(0, end - windowSize);
  }

  prizes.forEach((item, idx) => {
    if (item.type === defaultType) {
      return true;
    }
    let cls = "prize-item";
    if (idx === currentPrizeIndex) {
      cls += " shine";
    } else if (window.basicData && window.basicData.luckyUsers && (window.basicData.luckyUsers[item.type]||[]).length >= item.count) {
      cls += " done";
    } else if ((window.basicData && window.basicData.luckyUsers && (window.basicData.luckyUsers[item.type]||[]).length === 0)) {
      cls += " blur";
    }
    // 只顯示視窗範圍內的格子
    if (idx < start || idx >= end) {
      cls += " hidden";
    }
    
    // 計算實際的剩餘數量
    let luckyCount = (window.basicData && window.basicData.luckyUsers && window.basicData.luckyUsers[item.type]) ? window.basicData.luckyUsers[item.type].length : 0;
    let remainingCount = Math.max(item.count - luckyCount, 0);
    let displayText = item.type === 0 ? "???/???" : `${remainingCount}/${item.count}`;
    
    // 計算進度條寬度
    let progressWidth = item.type === 0 ? "100%" : `${(remainingCount / item.count * 100)}%`;
    
    htmlCode += `<li id="prize-item-${item.type}" class="${cls}">
                        <span></span><span></span><span></span><span></span>
                        <div class="prize-img">
                            <img src="${item.img}" alt="${item.title}">
                        </div>
                        <div class="prize-text">
                            <h5 class="prize-title">${item.text} ${item.title}</h5>
                            <div class="prize-count">
                                <div class="progress">
                                    <div id="prize-bar-${item.type}" class="progress-bar progress-bar-danger progress-bar-striped active" style="width: ${progressWidth};"></div>
                                </div>
                                <div id="prize-count-${item.type}" class="prize-count-left">
                                    ${displayText}
                                </div>
                            </div>
                        </div>
                    </li>`;
  });
  htmlCode += `</ul>`;

  document.querySelector("#prizeBar").innerHTML = htmlCode;
  // 強制清理多餘 .prize-mess
  setTimeout(() => {
    const messList = document.querySelectorAll('.prize-mess');
    if (messList.length > 1) {
      for (let i = 1; i < messList.length; i++) messList[i].remove();
    }
    const list = document.querySelector('.prize-list');
    const shine = list && list.querySelector('.shine');
    if (shine && list) {
      // 若列表可滾動，則自動將當前shine項目滾動到可見區域
      shine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 50);
}

function resetPrize(currentPrizeIndex) {
  prizeElement = {};
  lasetPrizeIndex = currentPrizeIndex;
  showPrizeList(currentPrizeIndex);
  // 強制刷新名額顯示，確保 type=0 時顯示 ??? 個
  if (typeof setPrizeData === 'function') {
    setPrizeData(currentPrizeIndex, 0, true);
  }
}

let setPrizeData = (function () {
  return function (currentPrizeIndex, count, isInit) {
    updatePrizeQuotaMap();
    let currentPrize = prizes[currentPrizeIndex],
      type = currentPrize.type,
      elements = prizeElement[type],
      totalCount = currentPrize.count;
    console.log(`[setPrizeData] type: ${type}, count: ${totalCount}, isInit: ${isInit}`);

    if (!elements) {
      elements = {
        box: document.querySelector(`#prize-item-${type}`),
        bar: document.querySelector(`#prize-bar-${type}`),
        text: document.querySelector(`#prize-count-${type}`)
      };
      prizeElement[type] = elements;
    }
    // 新增 DOM 取得狀態 log
    console.log(`[setPrizeData] DOM: bar=`, elements.bar, 'text=', elements.text);

    if (!prizeElement.prizeType) {
      prizeElement.prizeType = document.querySelector("#prizeType");
      prizeElement.prizeLeft = document.querySelector("#prizeLeft");
      prizeElement.prizeText = document.querySelector("#prizeText");
    }

    if (isInit) {
      for (let i = prizes.length - 1; i > currentPrizeIndex; i--) {
        let type = prizes[i]["type"];
        document.querySelector(`#prize-item-${type}`).className =
          "prize-item done";
        // type=0 顯示 ???/???，進度條 100%
        if (prizes[i]["type"] === 0) {
          document.querySelector(`#prize-bar-${type}`).style.width = "100%";
          document.querySelector(`#prize-count-${type}`).textContent =
            "???/???";
        } else {
          document.querySelector(`#prize-bar-${type}`).style.width = "0";
          document.querySelector(`#prize-count-${type}`).textContent =
            "0" + "/" + prizes[i]["count"];
        }
      }
    }

    if (lasetPrizeIndex !== currentPrizeIndex) {
      let lastPrize = prizes[lasetPrizeIndex],
        lastBox = document.querySelector(`#prize-item-${lastPrize.type}`);
      lastBox.classList.remove("shine");
      lastBox.classList.add("done");
      elements.box && elements.box.classList.add("shine");
      prizeElement.prizeType.textContent = currentPrize.text;
      prizeElement.prizeText.textContent = currentPrize.title;

      // 新增：自動滾動到當前 shine 的獎品
      setTimeout(() => {
        const list = document.querySelector('.prize-list');
        const shine = list && list.querySelector('.shine');
        if (shine && list) {
          shine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

      lasetPrizeIndex = currentPrizeIndex;
    }

    // type=0 特別獎，名額顯示 ??? 個，進度條 100%
    if (currentPrize.type === 0) {
      prizeElement.prizeType.textContent = currentPrize.text;
      prizeElement.prizeText.textContent = currentPrize.title;
      prizeElement.prizeLeft.textContent = "???";
      elements.text && (elements.text.textContent = "???/???");
      elements.bar && (elements.bar.style.width = "100%");
      // quotaBlock 顯示 ??? 個
      let quotaBlockEl = document.getElementById('prizeQuotaBlock');
      if (quotaBlockEl) quotaBlockEl.innerHTML = `，名額<label class=\"prize-shine\">???</label>個`;
      return;
    }

    count = totalCount - count;
    count = count < 0 ? 0 : count;
    let percent = (count / totalCount).toFixed(2);
    // 新增 log
    console.log(`[setPrizeData] 更新: 剩餘/總數: ${count} / ${totalCount}，百分比: ${percent}`);
    if (elements.bar) {
      elements.bar.style.width = percent * 100 + "%";
      console.log(`[setPrizeData] bar.style.width=`, elements.bar.style.width);
    }
    if (elements.text) {
      elements.text.textContent = count + "/" + totalCount;
      console.log(`[setPrizeData] text.textContent=`, elements.text.textContent);
    }
    prizeElement.prizeLeft.textContent = count;
    // quotaBlock 動態刷新
    let quotaBlockEl = document.getElementById('prizeQuotaBlock');
    if (quotaBlockEl) {
      quotaBlockEl.innerHTML = `，名額<label class="prize-shine">${totalCount}</label>個`;
    }
  };
})();

function startMaoPao() {
  let len = DEFAULT_MESS.length,
    count = 5,
    index = ~~(Math.random() * len),
    danmuList = [],
    total = 0;

  function restart() {
    total = 0;
    danmuList.forEach(item => {
      let text =
        lastDanMuList.length > 0
          ? lastDanMuList.shift()
          : DEFAULT_MESS[index++];
      item.start(text);
      index = index > len ? 0 : index;
    });
  }

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      danmuList.push(
        new DanMu({
          text: DEFAULT_MESS[index++],
          onComplete: function () {
            setTimeout(() => {
              this.start(DEFAULT_MESS[index++]);
              index = index > len ? 0 : index;
            }, 1000);
          }
        })
      );
      index = index > len ? 0 : index;
    }, 1500 * i);
  }
}

function addDanMu(text) {
  lastDanMuList.push(text);
}

export {
  startMaoPao,
  showPrizeList,
  setPrizeData,
  addDanMu,
  setPrizes,
  resetPrize,
  addQipao
};
