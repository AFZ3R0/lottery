// 色票索引（Color Index）
// 集中管理所有顏色，供 JS 端統一引用

const ColorIndex = {
  // 主要背景色
  bgPrimary: '#131313',
  bgSecondary: '#02101c',

  // 文字顏色
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.75)',
  textTertiary: 'rgba(255, 255, 255, 0.85)',

  // 青色系
  cyanPrimary: 'rgba(0, 255, 255, 0.5)',
  cyanSecondary: 'rgba(0, 255, 255, 0.75)',
  cyanTertiary: 'rgba(0, 255, 255, 0.95)',
  cyanLight: 'rgba(127, 255, 255, 0.25)',
  cyanMedium: 'rgba(127, 255, 255, 0.75)',
  cyanDark: 'rgba(0, 127, 127, 0.37)',
  cyanGlow: 'rgba(0, 255, 255, 0.5)',
  cyanGlowStrong: 'rgba(0, 255, 255, 0.75)',

  // 橙色系
  orangePrimary: 'rgba(253, 105, 0, 0.95)',
  orangeSecondary: 'rgba(253, 105, 0, 0.85)',
  orangeTertiary: 'rgba(253, 105, 0, 0.9)',
  orangeBorder: 'rgba(253, 105, 0, 0.25)',
  orangeText: '#db5c58',

  // 黑色系
  blackPrimary: '#000000',
  blackOverlay: 'rgba(0, 0, 0, 0.5)',

  // 白色系
  whitePrimary: '#fff',
  whiteOverlay: 'rgba(255, 255, 255, 0.15)',
  whiteBorder: 'rgba(255, 255, 255, 0.5)',
  whiteGlow: 'rgba(255, 255, 255, 0.95)',

  // 其他
  progressBg: '#d9534f',
  shineColor: '#03e9f4',
  starfieldBg: 'rgba(0, 10, 20, 1)',
  starColor: 'rgba(209, 255, 255, 0.8)',
  cursorBg: 'rgba(255, 255, 255, 0.18)',
  cursorShadow: 'rgba(255, 255, 255, 0.10)',

  // 卡片隨機背景色範圍
  cardBgMin: 0.25,
  cardBgMax: 0.95
};

// 支援 CommonJS 及瀏覽器全域
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorIndex;
} else {
  window.ColorIndex = ColorIndex;
} 