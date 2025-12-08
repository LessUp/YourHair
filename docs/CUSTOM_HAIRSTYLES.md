# 自定义发型素材指南

## 概述

YourHair 支持添加自定义发型素材。你可以使用自己的发型图片替换或添加到发型库中。

## 发型素材要求

### 图片格式
- **推荐格式**: PNG（支持透明背景）
- **备选格式**: SVG（矢量图，可无限缩放）
- **不推荐**: JPG（不支持透明背景）

### 图片规格
- **分辨率**: 建议 800x1000 像素以上
- **背景**: 必须是透明背景
- **内容**: 只包含发型部分，不要包含脸部
- **颜色**: 保持发型的自然颜色和阴影

### 图片质量要求
- ✅ 高清晰度
- ✅ 边缘平滑（抗锯齿）
- ✅ 透明背景干净（无白边）
- ✅ 保留发丝细节
- ✅ 包含自然阴影和高光

## 如何制作发型素材

### 方法1: 使用 Photoshop

1. **打开照片**
   - 选择一张高清的发型照片
   - 确保发型清晰，光线充足

2. **抠图**
   - 使用"快速选择工具"或"魔棒工具"
   - 选中发型部分
   - 使用"选择并遮住"精细调整边缘
   - 删除背景，保留发型

3. **优化边缘**
   - 使用"调整边缘"功能
   - 设置"羽化"为 0.5-1 像素
   - 确保边缘平滑自然

4. **保存**
   - 文件 → 导出 → 导出为 PNG
   - 勾选"透明度"
   - 质量设置为"最佳"

### 方法2: 使用在线工具

推荐工具：
- **Remove.bg**: https://www.remove.bg/
  - 自动去除背景
  - 免费版支持标准分辨率
  
- **Photopea**: https://www.photopea.com/
  - 免费的在线 Photoshop 替代品
  - 支持图层和透明背景

步骤：
1. 上传发型照片
2. 使用工具自动或手动去除背景
3. 下载 PNG 格式（透明背景）

### 方法3: 使用 AI 工具

推荐工具：
- **Stable Diffusion**: 生成发型素材
- **Midjourney**: 生成创意发型
- **DALL-E**: 生成各种风格发型

提示词示例：
```
professional hairstyle, transparent background, 
high quality, detailed hair strands, natural lighting,
front view, [发型描述], PNG format
```

## 添加自定义发型

### 步骤1: 准备文件

1. 将发型图片命名为有意义的名称
   - 例如: `long-wavy-brown.png`
   - 格式: `[长度]-[样式]-[颜色].png`

2. 将文件放入项目目录
   ```
   public/hairstyles/long-wavy-brown.png
   ```

### 步骤2: 更新配置

编辑 `src/lib/hairstyles.js` 文件：

```javascript
export const hairstyles = [
  // 现有发型...
  
  // 添加你的新发型
  {
    id: 'long-wavy-brown',           // 唯一ID
    name: '波浪棕长发',               // 显示名称
    src: '/hairstyles/long-wavy-brown.png',  // 文件路径
    category: 'long',                 // 分类: short/long/curly
  },
];
```

### 步骤3: 测试

1. 保存文件
2. 刷新浏览器
3. 在发型库中查看新添加的发型
4. 测试效果

## 发型分类

### short (短发系列)
- 适合: 短发、碎发、波波头
- 长度: 耳朵以上到下巴
- 示例: 短黑发、蓝色碎发

### long (长发飘飘)
- 适合: 长发、超长发
- 长度: 肩膀以下
- 示例: 棕色长发、金色大波浪

### curly (个性卷发)
- 适合: 卷发、爆炸头、特殊造型
- 风格: 个性、夸张
- 示例: 红色卷发、爆炸头

### 添加新分类

如果需要新分类，编辑 `src/components/HairstyleSelector.jsx`:

```javascript
<h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 ml-1">
  {category === 'short' ? '短发系列' : 
   category === 'long' ? '长发飘飘' : 
   category === 'curly' ? '个性卷发' : 
   category === 'medium' ? '中长发' :  // 新增分类
   '其他'}
</h4>
```

## 批量添加发型

### 示例: 添加10个新发型

1. **准备文件**
   ```
   public/hairstyles/
   ├── short-pixie-black.png
   ├── short-bob-red.png
   ├── medium-layered-brown.png
   ├── long-straight-black.png
   ├── long-curly-blonde.png
   └── ...
   ```

2. **批量配置**
   ```javascript
   const newHairstyles = [
     { id: 'short-pixie-black', name: '精灵短发', src: '/hairstyles/short-pixie-black.png', category: 'short' },
     { id: 'short-bob-red', name: '红色波波头', src: '/hairstyles/short-bob-red.png', category: 'short' },
     { id: 'medium-layered-brown', name: '层次中长发', src: '/hairstyles/medium-layered-brown.png', category: 'medium' },
     // ... 更多发型
   ];
   
   export const hairstyles = [
     ...existingHairstyles,
     ...newHairstyles,
   ];
   ```

## 发型素材资源

### 免费资源

1. **Freepik**: https://www.freepik.com/
   - 搜索: "hairstyle PNG transparent"
   - 大量免费发型素材

2. **Pngtree**: https://pngtree.com/
   - 搜索: "hair PNG"
   - 部分免费素材

3. **Flaticon**: https://www.flaticon.com/
   - 搜索: "hairstyle"
   - 矢量图标，可自定义颜色

### 付费资源

1. **Shutterstock**: 高质量专业素材
2. **Adobe Stock**: 专业摄影素材
3. **iStock**: 多样化素材库

### AI 生成

使用 AI 工具生成自定义发型：

**Stable Diffusion 提示词模板**:
```
professional [发型类型] hairstyle, transparent background,
ultra high quality, detailed hair texture, natural hair color,
studio lighting, front view, isolated on transparent background,
8k resolution, photorealistic
```

示例：
```
professional long wavy blonde hairstyle, transparent background,
ultra high quality, detailed hair texture, natural blonde color,
studio lighting, front view, isolated on transparent background,
8k resolution, photorealistic
```

## 优化技巧

### 1. 调整图片大小

使用 ImageMagick 批量调整：
```bash
# 调整为统一高度 1200px
mogrify -resize x1200 *.png

# 压缩文件大小
mogrify -quality 85 *.png
```

### 2. 优化透明背景

使用 Photoshop:
1. 图层 → 修边 → 移去白色杂边
2. 图层 → 修边 → 移去黑色杂边
3. 确保边缘干净

### 3. 添加阴影效果

为发型添加自然阴影：
1. 复制图层
2. 底层添加高斯模糊（5-10px）
3. 降低不透明度（30-50%）
4. 向下偏移 5-10px

## 常见问题

### Q: 发型边缘有白边怎么办？

A: 
1. 在 Photoshop 中使用"移去白色杂边"
2. 或使用"图层 → 修边 → 去边"
3. 重新导出 PNG

### Q: 发型太大或太小？

A: 
1. 在图片编辑软件中调整尺寸
2. 建议高度 1000-1500px
3. 保持宽高比

### Q: 如何让发型更自然？

A: 
1. 保留发型的自然阴影
2. 确保边缘平滑（使用羽化）
3. 使用高质量原图
4. 调整混合模式和透明度

### Q: 可以使用真人照片吗？

A: 
- 可以，但需要：
  1. 获得肖像权授权
  2. 仅用于个人学习
  3. 商业使用需购买版权

## 示例配置

### 完整的发型配置示例

```javascript
// src/lib/hairstyles.js
export const hairstyles = [
  // 短发系列
  {
    id: 'short-pixie-black',
    name: '精灵短发',
    src: '/hairstyles/short-pixie-black.png',
    category: 'short',
    tags: ['短发', '黑色', '清爽'],
    description: '清爽利落的精灵短发',
  },
  
  // 中长发系列
  {
    id: 'medium-layered-brown',
    name: '层次中长发',
    src: '/hairstyles/medium-layered-brown.png',
    category: 'medium',
    tags: ['中长发', '棕色', '层次'],
    description: '时尚的层次感中长发',
  },
  
  // 长发系列
  {
    id: 'long-straight-black',
    name: '直顺长发',
    src: '/hairstyles/long-straight-black.png',
    category: 'long',
    tags: ['长发', '黑色', '直发'],
    description: '经典的直顺长发',
  },
  
  // 个性系列
  {
    id: 'curly-rainbow',
    name: '彩虹卷发',
    src: '/hairstyles/curly-rainbow.png',
    category: 'curly',
    tags: ['卷发', '彩色', '个性'],
    description: '个性十足的彩虹卷发',
  },
];
```

## 下一步

- 📖 查看 [快速开始指南](./QUICK_START.md)
- 🎨 查看 [混合模式使用指南](./BLEND_MODES_GUIDE.md)
- 💡 在 GitHub 分享你的发型素材

祝你创作出精美的发型素材！✨
