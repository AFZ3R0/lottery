/**
 * 獎品設置
 * type: 唯一標識，0是預設特別獎的預留位置，其它獎品不可使用
 * count: 獎品數量
 * title: 獎品描述
 * text: 獎品標題
 * img: 圖片位址
 */
const prizes = [
  {
    type: 0,
    count: 1000,
    title: "",
    text: "特別獎"
  },
  {
    type: 1,
    count: 1,
    text: "頭獎",
    title: "Samsung Galaxy Z Fold7",
    img: "../img/pz01.png"
  },
  {
    type: 2,
    count: 3,
    text: "二獎",
    title: "富衛 1881 公館酒店富尚套房住宿一晚",
    img: "../img/pz02.png"
  },
  {
    type: 3,
    count: 1,
    text: "三獎",
    title: "旅遊禮券港幣$5,000",
    img: "../img/pz03.png"
  },
  {
    type: 4,
    count: 3,
    text: "四獎",
    title: "Market Place惠康禮券港幣$1,000",
    img: "../img/pz04.png"
  },
  {
    type: 5,
    count: 3,
    text: "五獎",
    title: "Market Place惠康禮券港幣$1,000",
    img: "../img/pz05.png"
  },
  {
    type: 6,
    count: 3,
    text: "五獎",
    title: "百佳禮券港幣$1,000",
    img: "../img/pz06.png"
  },
  {
    type: 7,
    count: 1,
    text: "六獎",
    title: "中銀人壽十二生肖清酒杯套裝",
    img: "../img/pz07.png"
  },
  {
    type: 8,
    count: 2,
    text: "七獎",
    title: "金運福船",
    img: "../img/pz08.png"
  },
  {
    type: 9,
    count: 2,
    text: "八獎",
    title: "AXA Wine (Domaine de L'Arlot Clos de L'Arlot 2020)",
    img: "../img/pz09.png"
  },
  {
    type: 10,
    count: 2,
    text: "九獎",
    title: "頂級海味珍饌福袋",
    img: "../img/pz10.png"
  }
];

/**
 * 一次抽取的獎品個數與prizes對應
 */
const EACH_COUNT = [1, 1, 3, 1, 3, 3, 3, 1, 2, 2, 2];

/**
 * 卡片公司名稱標識
 */
const COMPANY = "AMG";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};


