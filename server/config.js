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
    count: 2,
    text: "特等獎",
    title: "神秘大禮",
    img: "../img/secrit.jpg"
  },
  {
    type: 2,
    count: 5,
    text: "一等獎",
    title: "Mac Pro",
    img: "../img/mbp.jpg"
  },
  {
    type: 3,
    count: 6,
    text: "二等獎",
    title: "華為 Mate30",
    img: "../img/huawei.png"
  },
  {
    type: 4,
    count: 7,
    text: "三等獎",
    title: "Ipad Mini5",
    img: "../img/ipad.jpg"
  },
  {
    type: 5,
    count: 8,
    text: "四等獎",
    title: "大疆無人機",
    img: "../img/spark.jpg"
  },
  {
    type: 6,
    count: 8,
    text: "五等獎",
    title: "Kindle",
    img: "../img/kindle.jpg"
  },
  {
    type: 7,
    count: 11,
    text: "六等獎",
    title: "漫步者藍牙耳機",
    img: "../img/edifier.jpg"
  },
  {
    type: 8,
    count: 1,
    text: "二等獎",
    title: "華為 Mate30",
    img: "../img/huawei.png"
  },
  {
    type: 9,
    count: 1,
    text: "二等獎",
    title: "華為 Mate30",
    img: "../img/huawei.png"
  },
  {
    type: 10,
    count: 1,
    text: "二等獎",
    title: "華為 Mate30",
    img: "../img/huawei.png"
  }
];

/**
 * 一次抽取的獎品個數與prizes對應
 */
const EACH_COUNT = [1, 1, 5, 6, 7, 8, 9, 10,1,1,1];

/**
 * 卡片公司名稱標識
 */
const COMPANY = "AMG";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};


