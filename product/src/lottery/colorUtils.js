/**
 * 顏色工具類
 * 用於管理抽獎系統的顏色變量
 */

// 引入色票索引
// 對於瀏覽器直接引用，ColorIndex 已掛在 window 上

class ColorUtils {
  /**
   * 獲取CSS變量值
   * @param {string} variableName - CSS變量名稱
   * @returns {string} CSS變量值
   */
  static getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }

  /**
   * 設置CSS變量值
   * @param {string} variableName - CSS變量名稱
   * @param {string} value - 要設置的值
   */
  static setCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
  }

  /**
   * 獲取RGBA顏色值
   * @param {string} variableName - CSS變量名稱
   * @returns {string} RGBA顏色值
   */
  static getRGBA(variableName) {
    return this.getCSSVariable(variableName);
  }

  /**
   * 獲取十六進制顏色值
   * @param {string} variableName - CSS變量名稱
   * @returns {string} 十六進制顏色值
   */
  static getHex(variableName) {
    return this.getCSSVariable(variableName);
  }

  /**
   * 生成隨機透明度
   * @param {number} min - 最小透明度 (0-1)
   * @param {number} max - 最大透明度 (0-1)
   * @returns {number} 隨機透明度值
   */
  static getRandomOpacity(min = 0.25, max = 0.95) {
    return Math.random() * (max - min) + min;
  }

  /**
   * 生成卡片背景色
   * @param {number} r - 紅色值 (0-255)
   * @param {number} g - 綠色值 (0-255)
   * @param {number} b - 藍色值 (0-255)
   * @param {number} minOpacity - 最小透明度
   * @param {number} maxOpacity - 最大透明度
   * @returns {string} RGBA顏色字符串
   */
  static generateCardBackground(r = 0, g = 127, b = 127, minOpacity = 0.25, maxOpacity = 0.95) {
    const opacity = this.getRandomOpacity(minOpacity, maxOpacity);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * 獲取預定義的顏色主題
   * @returns {Object} 顏色主題對象
   */
  static getColorTheme() {
    return { ...window.ColorIndex };
  }

  /**
   * 設置新的顏色主題
   * @param {Object} theme - 顏色主題對象
   */
  static setColorTheme(theme) {
    Object.keys(theme).forEach(key => {
      const variableName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      this.setCSSVariable(variableName, theme[key]);
    });
  }

  /**
   * 預設顏色主題
   */
  static themes = {
    // 默認主題 (當前使用)
    default: { ...window.ColorIndex },
    // 紫色主題等可自訂
  };
}

// 導出到全局作用域
window.ColorUtils = ColorUtils; 