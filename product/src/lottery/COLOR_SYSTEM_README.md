# 抽獎系統顏色變量系統

## 概述

本系統將抽獎項目的所有RGB/RGBA顏色值統一管理，使用CSS變量和JavaScript工具類來實現顏色的集中控制和動態修改。

## 文件結構

```
lottery/
├── colors.css          # 顏色變量定義文件
├── colorUtils.js       # 顏色工具類
├── colorDemo.html      # 顏色系統演示頁面
├── index.css           # 主樣式文件（已更新為使用變量）
├── index.js            # 主邏輯文件（已更新為使用工具類）
└── canvas.js           # 星空背景文件（已更新為使用工具類）
```

## 顏色變量分類

### 1. 主要背景色
- `--bg-primary`: 主背景色 (#131313)
- `--bg-secondary`: 次背景色 (#02101c)

### 2. 文字顏色
- `--text-primary`: 主要文字 (#ffffff)
- `--text-secondary`: 次要文字 (rgba(255, 255, 255, 0.75))
- `--text-tertiary`: 第三級文字 (rgba(255, 255, 255, 0.85))

### 3. 青色系（主要主題色）
- `--cyan-primary`: 青色主色 (rgba(0, 255, 255, 0.5))
- `--cyan-secondary`: 青色次色 (rgba(0, 255, 255, 0.75))
- `--cyan-tertiary`: 青色第三級 (rgba(0, 255, 255, 0.95))
- `--cyan-light`: 淺青色 (rgba(127, 255, 255, 0.25))
- `--cyan-medium`: 中青色 (rgba(127, 255, 255, 0.75))
- `--cyan-dark`: 深青色 (rgba(0, 127, 127, 0.37))
- `--cyan-glow`: 青色光暈 (rgba(0, 255, 255, 0.5))
- `--cyan-glow-strong`: 強青色光暈 (rgba(0, 255, 255, 0.75))

### 4. 橙色系（高亮和獎品色）
- `--orange-primary`: 橙色主色 (rgba(253, 105, 0, 0.95))
- `--orange-secondary`: 橙色次色 (rgba(253, 105, 0, 0.85))
- `--orange-tertiary`: 橙色第三級 (rgba(253, 105, 0, 0.9))
- `--orange-border`: 橙色邊框 (rgba(253, 105, 0, 0.25))
- `--orange-text`: 橙色文字 (#db5c58)

### 5. 黑色系
- `--black-primary`: 主黑色 (#000000)
- `--black-overlay`: 黑色遮罩 (rgba(0, 0, 0, 0.5))

### 6. 白色系
- `--white-primary`: 主白色 (#fff)
- `--white-overlay`: 白色遮罩 (rgba(255, 255, 255, 0.15))
- `--white-border`: 白色邊框 (rgba(255, 255, 255, 0.5))
- `--white-glow`: 白色光暈 (rgba(255, 255, 255, 0.95))

### 7. 其他顏色
- `--progress-bg`: 進度條背景 (#d9534f)
- `--shine-color`: 閃光效果色 (#03e9f4)
- `--starfield-bg`: 星空背景 (rgba(0, 10, 20, 1))
- `--star-color`: 星星顏色 (rgba(209, 255, 255, 0.8))
- `--cursor-bg`: 自定義游標背景 (rgba(255, 255, 255, 0.18))
- `--cursor-shadow`: 自定義游標陰影 (rgba(255, 255, 255, 0.10))

## 使用方法

### CSS 中使用

```css
.my-element {
    background-color: var(--cyan-primary);
    color: var(--text-primary);
    border: 1px solid var(--cyan-light);
    box-shadow: 0 0 10px var(--cyan-glow);
}
```

### JavaScript 中使用 ColorUtils

```javascript
// 獲取顏色值
const primaryColor = ColorUtils.getCSSVariable('--cyan-primary');

// 設置顏色值
ColorUtils.setCSSVariable('--cyan-primary', 'rgba(0, 255, 255, 0.6)');

// 生成卡片背景色
const cardBg = ColorUtils.generateCardBackground(0, 127, 127);

// 獲取當前主題
const currentTheme = ColorUtils.getColorTheme();

// 切換主題
ColorUtils.setColorTheme(ColorUtils.themes.purple);
```

### 動態修改顏色

```javascript
// 修改單個顏色變量
document.documentElement.style.setProperty('--cyan-primary', 'rgba(0, 255, 255, 0.8)');

// 批量修改主題
const newTheme = {
    bgPrimary: '#1a0b2e',
    cyanPrimary: 'rgba(147, 51, 234, 0.5)',
    // ... 其他顏色
};
ColorUtils.setColorTheme(newTheme);
```

## 預設主題

### 默認主題 (default)
- 深色背景配青色主題
- 橙色高亮效果
- 適合科技感抽獎系統

### 紫色奢華主題 (purple)
- 深紫色背景
- 紫色主題色
- 黃色高亮效果
- 適合高端奢華場合

## ColorUtils 工具類方法

### 靜態方法

- `getCSSVariable(variableName)`: 獲取CSS變量值
- `setCSSVariable(variableName, value)`: 設置CSS變量值
- `getRGBA(variableName)`: 獲取RGBA顏色值
- `getHex(variableName)`: 獲取十六進制顏色值
- `getRandomOpacity(min, max)`: 生成隨機透明度
- `generateCardBackground(r, g, b, minOpacity, maxOpacity)`: 生成卡片背景色
- `getColorTheme()`: 獲取當前顏色主題
- `setColorTheme(theme)`: 設置新的顏色主題

### 預設主題

- `ColorUtils.themes.default`: 默認主題
- `ColorUtils.themes.purple`: 紫色奢華主題

## 演示頁面

打開 `colorDemo.html` 可以查看：
- 所有顏色變量的視覺預覽
- 主題切換功能
- 元素演示效果
- 使用方式示例

## 優勢

1. **統一管理**: 所有顏色集中在一個文件中管理
2. **易於維護**: 修改顏色只需更改變量值
3. **動態切換**: 支持運行時切換主題
4. **類型安全**: 提供工具類確保正確使用
5. **擴展性**: 容易添加新的顏色和主題
6. **一致性**: 確保整個系統顏色使用的一致性

## 注意事項

1. 確保在使用 ColorUtils 之前已加載 `colorUtils.js`
2. CSS變量名稱區分大小寫
3. 修改顏色時注意保持視覺層次的一致性
4. 新增顏色時建議在 `colors.css` 中添加註釋說明用途 